<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listStudents, createStudent, updateStudent, deleteStudent } from '../api/students'
import { listClasses } from '../api/classes'

const loading = ref(false)
const items = ref([])
const total = ref(0)
const classes = ref([])

const query = reactive({
  keyword: '',
  classId: null,
  page: 1,
  pageSize: 10
})

const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref(null)
const formRef = ref()

const form = reactive({
  studentNo: '',
  name: '',
  gender: 'unknown',
  birthdate: '',
  classId: null,
  phone: '',
  email: '',
  isActive: true
})

const rules = {
  studentNo: [{ required: true, message: '学号必填', trigger: 'blur' }],
  name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

const resetForm = () => {
  form.studentNo = ''
  form.name = ''
  form.gender = 'unknown'
  form.birthdate = ''
  form.classId = null
  form.phone = ''
  form.email = ''
  form.isActive = true
  editingId.value = null
}

const loadClasses = async () => {
  const result = await listClasses({ page: 1, pageSize: 200 })
  classes.value = result.data.items
}

const load = async () => {
  loading.value = true
  try {
    const result = await listStudents({
      keyword: query.keyword || undefined,
      classId: query.classId || undefined,
      page: query.page,
      pageSize: query.pageSize
    })
    items.value = result.data.items
    total.value = result.data.total
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row) => {
  editingId.value = row.id
  form.studentNo = row.student_no
  form.name = row.name
  form.gender = row.gender || 'unknown'
  form.birthdate = row.birthdate ? row.birthdate.slice(0, 10) : ''
  form.classId = row.class_id
  form.phone = row.phone || ''
  form.email = row.email || ''
  form.isActive = Boolean(row.is_active)
  dialogVisible.value = true
}

const submit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    const payload = {
      studentNo: form.studentNo,
      name: form.name,
      gender: form.gender,
      birthdate: form.birthdate || null,
      classId: form.classId || null,
      phone: form.phone || null,
      email: form.email || null,
      isActive: form.isActive
    }

    if (editingId.value) {
      await updateStudent(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createStudent(payload)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    await load()
  } finally {
    submitting.value = false
  }
}

const removeRow = async (row) => {
  await ElMessageBox.confirm(`确定删除学生「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteStudent(row.id)
  ElMessage.success('删除成功')
  await load()
}

const onSearch = async () => {
  query.page = 1
  await load()
}

onMounted(async () => {
  await loadClasses()
  await load()
})
</script>

<template>
  <section class="page">
    <div class="toolbar">
      <el-form inline>
        <el-form-item label="关键字">
          <el-input v-model="query.keyword" placeholder="学号/姓名" clearable />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="query.classId" placeholder="全部" clearable style="width: 160px;">
            <el-option
              v-for="c in classes"
              :key="c.id"
              :label="`${c.grade} ${c.name}`"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="openCreate">新增学生</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="items" v-loading="loading" border height="560">
      <el-table-column prop="student_no" label="学号" width="140" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="90" />
      <el-table-column label="班级" min-width="160">
        <template #default="{ row }">
          <span v-if="row.class_id">{{ row.class_grade }} {{ row.class_name }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="140" />
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'">
            {{ row.is_active ? '在读' : '停用' }}
          </el-tag>
        </template>
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑学生' : '新增学生'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="学号" prop="studentNo">
          <el-input v-model="form.studentNo" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" style="width: 140px;">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
            <el-option label="未知" value="unknown" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.birthdate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="form.classId" placeholder="可为空" clearable style="width: 200px;">
            <el-option
              v-for="c in classes"
              :key="c.id"
              :label="`${c.grade} ${c.name}`"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="在读">
          <el-switch v-model="form.isActive" />
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

