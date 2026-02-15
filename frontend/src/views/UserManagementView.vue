<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createUser, deleteUser, fetchUsers, updateUser } from '../api/users'

const loading = ref(false)
const users = ref([])
const editingId = ref(null)

// Vue 3 Composition API 核心知识点：reactive 管理表单对象
const form = reactive({
  name: '',
  age: 18,
  salary: 10000,
  birthday: '',
  isActive: true
})

const resetForm = () => {
  form.name = ''
  form.age = 18
  form.salary = 10000
  form.birthday = ''
  form.isActive = true
  editingId.value = null
}

const loadUsers = async () => {
  loading.value = true
  try {
    const result = await fetchUsers()
    users.value = result.data
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  const payload = { ...form }
  if (editingId.value) {
    await updateUser(editingId.value, payload)
  } else {
    await createUser(payload)
  }
  await loadUsers()
  resetForm()
}

const edit = (user) => {
  editingId.value = user.id
  Object.assign(form, {
    name: user.name,
    age: user.age,
    salary: user.salary,
    birthday: user.birthday?.slice(0, 10),
    isActive: user.is_active
  })
}

const remove = async (id) => {
  await deleteUser(id)
  await loadUsers()
}

onMounted(loadUsers)
</script>

<template>
  <section>
    <h2>用户管理（varchar/int/float/date/boolean）</h2>
    <form class="grid" @submit.prevent="submit">
      <input v-model="form.name" placeholder="姓名" required />
      <input v-model.number="form.age" type="number" placeholder="年龄" required />
      <input v-model.number="form.salary" type="number" step="0.01" placeholder="薪资" required />
      <input v-model="form.birthday" type="date" required />
      <label><input v-model="form.isActive" type="checkbox" /> 在职</label>
      <button type="submit">{{ editingId ? '更新' : '新增' }}</button>
      <button type="button" @click="resetForm">重置</button>
    </form>

    <p v-if="loading">加载中...</p>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th><th>姓名</th><th>年龄</th><th>薪资</th><th>生日</th><th>在职</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.salary }}</td>
          <td>{{ user.birthday?.slice(0, 10) }}</td>
          <td>{{ user.is_active ? '是' : '否' }}</td>
          <td>
            <button @click="edit(user)">编辑</button>
            <button @click="remove(user.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
