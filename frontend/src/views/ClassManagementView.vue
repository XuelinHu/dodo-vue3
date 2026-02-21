<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listClasses, createClass, updateClass, deleteClass } from '../api/classes'

const loading = ref(false)
const items = ref([])
const total = ref(0)

const query = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref(null)
const formRef = ref()

const form = reactive({
  name: '',
  grade: new Date().getFullYear()
})

const rules = {
  name: [{ required: true, message: '班级名称必填', trigger: 'blur' }],
  grade: [{ required: true, message: '年级必填', trigger: 'change' }]
}

const resetForm = () => {
  form.name = ''
  form.grade = new Date().getFullYear()
  editingId.value = null
}

const load = async () => {
  loading.value = true
  try {
    const result = await listClasses({
      keyword: query.keyword || undefined,
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
  form.name = row.name
  form.grade = row.grade
  dialogVisible.value = true
}

const submit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    const payload = { name: form.name, grade: Number(form.grade) }
    if (editingId.value) {
      await updateClass(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createClass(payload)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await load()
  } finally {
    submitting.value = false
  }
}

const removeRow = async (row) => {
  await ElMessageBox.confirm(`确定删除班级「${row.grade} ${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteClass(row.id)
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
          <el-input v-model="query.keyword" placeholder="班级名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="openCreate">新增班级</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="items" v-loading="loading" border height="560">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="grade" label="年级" width="120" />
      <el-table-column prop="name" label="班级" />
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑班级' : '新增班级'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="年级" prop="grade">
          <el-input-number v-model="form.grade" :min="1900" :max="3000" />
        </el-form-item>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：一班" />
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

