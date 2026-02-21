<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listScores, createScore, updateScore, deleteScore } from '../api/scores'
import { listStudents } from '../api/students'

const loading = ref(false)
const items = ref([])
const total = ref(0)

const query = reactive({
  keyword: '',
  subject: '',
  page: 1,
  pageSize: 10
})

const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref(null)
const formRef = ref()

const studentOptions = ref([])
const studentLoading = ref(false)

const form = reactive({
  studentId: null,
  subject: '',
  score: 0,
  examDate: ''
})

const rules = {
  studentId: [{ required: true, message: '请选择学生', trigger: 'change' }],
  subject: [{ required: true, message: '科目必填', trigger: 'blur' }],
  score: [{ required: true, message: '分数必填', trigger: 'change' }],
  examDate: [{ required: true, message: '考试日期必填', trigger: 'change' }]
}

const resetForm = () => {
  form.studentId = null
  form.subject = ''
  form.score = 0
  form.examDate = ''
  editingId.value = null
}

const load = async () => {
  loading.value = true
  try {
    const result = await listScores({
      keyword: query.keyword || undefined,
      subject: query.subject || undefined,
      page: query.page,
      pageSize: query.pageSize
    })
    items.value = result.data.items
    total.value = result.data.total
  } finally {
    loading.value = false
  }
}

const searchStudents = async (keyword) => {
  studentLoading.value = true
  try {
    const result = await listStudents({ keyword, page: 1, pageSize: 50 })
    studentOptions.value = result.data.items.map((s) => ({
      value: s.id,
      label: `${s.student_no} ${s.name}`
    }))
  } finally {
    studentLoading.value = false
  }
}

const openCreate = async () => {
  resetForm()
  await searchStudents('')
  dialogVisible.value = true
}

const openEdit = async (row) => {
  editingId.value = row.id
  form.studentId = row.student_id
  form.subject = row.subject
  form.score = Number(row.score)
  form.examDate = row.exam_date ? row.exam_date.slice(0, 10) : ''
  await searchStudents(row.student_name || '')
  dialogVisible.value = true
}

const submit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    const payload = {
      studentId: Number(form.studentId),
      subject: form.subject,
      score: Number(form.score),
      examDate: form.examDate
    }

    if (editingId.value) {
      await updateScore(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createScore(payload)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    await load()
  } finally {
    submitting.value = false
  }
}

const removeRow = async (row) => {
  await ElMessageBox.confirm('确定删除该条成绩吗？', '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteScore(row.id)
  ElMessage.success('删除成功')
  await load()
}

const onSearch = async () => {
  query.page = 1
  await load()
}

onMounted(load)
</script>

<template>
  <section class="page">
    <div class="toolbar">
      <el-form inline>
        <el-form-item label="关键字">
          <el-input v-model="query.keyword" placeholder="学号/姓名" clearable />
        </el-form-item>
        <el-form-item label="科目">
          <el-input v-model="query.subject" placeholder="例如：数学" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="openCreate">新增成绩</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="items" v-loading="loading" border height="560">
      <el-table-column prop="student_no" label="学号" width="140" />
      <el-table-column prop="student_name" label="姓名" width="120" />
      <el-table-column prop="subject" label="科目" width="120" />
      <el-table-column prop="score" label="分数" width="100" />
      <el-table-column prop="exam_date" label="考试日期" width="140">
        <template #default="{ row }">{{ row.exam_date?.slice(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="query.pageSize"
        :current-page="query.page"
        @size-change="(s) => { query.pageSize = s; query.page = 1; load() }"
        @current-change="(p) => { query.page = p; load() }"
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑成绩' : '新增成绩'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="学生" prop="studentId">
          <el-select
            v-model="form.studentId"
            filterable
            remote
            reserve-keyword
            :remote-method="searchStudents"
            :loading="studentLoading"
            placeholder="输入学号/姓名搜索"
            style="width: 320px;"
          >
            <el-option
              v-for="opt in studentOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="form.subject" />
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input-number v-model="form.score" :min="0" :max="150" :step="0.5" />
        </el-form-item>
        <el-form-item label="考试日期" prop="examDate">
          <el-date-picker v-model="form.examDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">
          {{ editingId ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.page {
  padding: 14px;
}

.toolbar {
  margin-bottom: 12px;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>

