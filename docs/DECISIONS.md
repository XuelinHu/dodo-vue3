# Repository Decisions

- 使用 **前后端分离**（`frontend` + `backend`）目录结构，便于一天内聚焦主干知识点并快速定位代码。
- 前端选择 Vue 3 Composition API + Pinia + Vue Router，后端选择 Express + PostgreSQL（含 PostGIS）以覆盖高频全栈能力。
- 后端统一返回 `{ code, message, data }` 响应格式，前端通过 Axios 响应拦截器集中处理，降低页面重复逻辑。
