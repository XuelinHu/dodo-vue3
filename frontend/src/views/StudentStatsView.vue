<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getSubjectStats } from '../api/scores'

const loading = ref(false)
const chartEl = ref()
let chart = null

const render = (rows) => {
  const subjects = rows.map((r) => r.subject)
  const values = rows.map((r) => Number(r.avg_score))

  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: subjects },
    yAxis: { type: 'value', min: 0, max: 150 },
    series: [{ type: 'bar', data: values, name: '平均分' }]
  })
}

const load = async () => {
  loading.value = true
  try {
    const result = await getSubjectStats()
    render(result.data)
  } catch (err) {
    ElMessage.error(err.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  chart = echarts.init(chartEl.value)
  await load()
  window.addEventListener('resize', () => chart.resize())
})
</script>

<template>
  <section class="page">
    <div class="toolbar">
      <el-button type="primary" :loading="loading" @click="load">刷新</el-button>
    </div>
    <div ref="chartEl" class="chart" />
  </section>
</template>

<style scoped>
.page {
  padding: 14px;
}

.toolbar {
  margin-bottom: 12px;
}

.chart {
  height: 600px;
  background: #fff;
  border-radius: 8px;
}
</style>

