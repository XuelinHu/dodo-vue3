<script setup>
import { onMounted, reactive, ref } from 'vue'
import { createGeoItem, deleteGeoItem, fetchGeoItems, updateGeoItem } from '../api/geo'

const items = ref([])
const editingId = ref(null)
const form = reactive({
  name: '',
  longitude: 121.47,
  latitude: 31.23,
  polygonWkt: 'POLYGON((121.46 31.22,121.48 31.22,121.48 31.24,121.46 31.24,121.46 31.22))'
})

const load = async () => {
  const result = await fetchGeoItems()
  items.value = result.data
}

const submit = async () => {
  // PostgreSQL + PostGIS 核心知识点：前端传递 WKT，后端使用 ST_GeomFromText 转换几何类型
  const payload = { ...form }
  if (editingId.value) {
    await updateGeoItem(editingId.value, payload)
  } else {
    await createGeoItem(payload)
  }
  editingId.value = null
  await load()
}

const edit = (item) => {
  editingId.value = item.id
  Object.assign(form, {
    name: item.name,
    longitude: item.longitude,
    latitude: item.latitude,
    polygonWkt: item.polygon_wkt
  })
}

const remove = async (id) => {
  await deleteGeoItem(id)
  await load()
}

onMounted(load)
</script>

<template>
  <section>
    <h2>地理数据管理（POINT / GEOMETRY）</h2>
    <form class="grid" @submit.prevent="submit">
      <input v-model="form.name" placeholder="地点名" required />
      <input v-model.number="form.longitude" type="number" step="0.000001" placeholder="经度" required />
      <input v-model.number="form.latitude" type="number" step="0.000001" placeholder="纬度" required />
      <textarea v-model="form.polygonWkt" rows="3" placeholder="WKT Geometry"></textarea>
      <button type="submit">{{ editingId ? '更新' : '新增' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th><th>名称</th><th>Point</th><th>Geometry(WKT)</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.location_text }}</td>
          <td>{{ item.polygon_wkt }}</td>
          <td>
            <button @click="edit(item)">编辑</button>
            <button @click="remove(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
