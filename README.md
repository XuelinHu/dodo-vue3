# dodo-vue3：一天任务式全栈学习项目（Vue 3 + Node.js + PostgreSQL/PostGIS）

> 面向具备 Java/Python 基础的开发者，按照“二八原理”聚焦高频核心能力：
> - 前端：Vue 3（Composition API）+ Vite + Vue Router + Pinia + Axios + Element Plus + ECharts
> - 后端：Node.js + Express + PostgreSQL（基础数据类型 + POINT/GEOMETRY）

## 1. 项目目录结构（含核心文件说明）

```text
.
├─ frontend/                         # Vue 3 前端工程
│  ├─ src/
│  │  ├─ api/                        # Axios 请求封装与接口模块
│  │  ├─ components/                 # Sidebar、Tabs 组件
│  │  ├─ router/index.js             # Vue Router 路由定义
│  │  ├─ stores/tabs.js              # Pinia：Tab 状态管理
│  │  ├─ views/                      # 用户管理 / 学生管理(多页面) / 地理数据管理(可选)
│  │  ├─ App.vue                     # 左侧菜单 + 右侧 Tabs + 路由视图布局
│  │  └─ main.js                     # 应用入口（挂载 router/pinia）
│  ├─ vite.config.js                 # Vite 配置
│  └─ .eslintrc.cjs                  # ESLint 配置
├─ backend/                          # Node.js + Express 后端工程
│  ├─ src/
│  │  ├─ config/env.js               # 环境变量管理
│  │  ├─ controllers/                # RESTful 控制器 + 参数 schema
│  │  ├─ db/init.sql                 # PostgreSQL + PostGIS 初始化脚本
│  │  ├─ db/seed.sql                 # 示例数据初始化脚本
│  │  ├─ db/initDb.js                # 启动时初始化数据库
│  │  ├─ db/capabilities.js          # 数据库能力探测（是否安装 PostGIS）
│  │  ├─ middleware/                 # validate/error/response 中间件
│  │  ├─ routes/                     # users / geo / students / classes / scores 路由
│  │  ├─ services/                   # 数据库 CRUD + 分页 + 特殊类型处理
│  │  └─ server.js                   # 服务启动入口
│  └─ .env.example                   # 环境变量示例
├─ docs/DECISIONS.md                 # 仓库级关键设计决策
└─ package.json                      # workspace 脚本
```

---

## 2. 数据库设计

### 2.1 用户表 `users`（基础类型）
- `name VARCHAR(100)`
- `age INT`
- `salary NUMERIC(10,2)`
- `birthday DATE`
- `is_active BOOLEAN`

### 2.2 地理表 `geo_items`（特殊类型）
- `location POINT`
- `area GEOMETRY(POLYGON, 4326)`

> 通过 `ST_GeomFromText`、`ST_AsText` 完成 WKT 与 GEOMETRY 之间互转。
>
> 说明：PostGIS 为可选能力；若数据库未安装 PostGIS，会自动跳过 GIS 扩展与 `geo_items` 表。

### 2.3 学生信息管理（中后台 CRUD + 分页 + 统计）
- 班级表 `classes`：`name`、`grade`
- 学生表 `students`：`student_no`、`name`、`gender`、`birthdate`、`class_id`、`phone`、`email`、`is_active`
- 成绩表 `student_scores`：`student_id`、`subject`、`score`、`exam_date`

---

## 3. 快速启动（Windows / Mac 通用）

## 3.1 环境版本建议
- Node.js: `>= 20`
- npm: `>= 10`
- PostgreSQL: `>= 14`
- PostGIS（可选）: `>= 3`

### 3.2 创建数据库（一次性）

```sql
CREATE DATABASE dodo_vue3;
```

安装 PostGIS 扩展（可选，若需要 GIS 功能）：
- Mac（Homebrew）：`brew install postgis`
- Windows（StackBuilder）：为 PostgreSQL 安装 PostGIS 组件

### 3.3 安装依赖

```bash
npm install
```

### 3.4 配置后端环境变量

```bash
cp backend/.env.example backend/.env
```

Windows PowerShell 可用：
```powershell
Copy-Item backend/.env.example backend/.env
```

按需修改 `backend/.env` 中的 PostgreSQL 连接串。

完成数据库初始化（创建数据库 + 安装扩展 + 建表）：
```bash
npm run db:init
```

初始化示例数据（可重复执行，使用 `ON CONFLICT DO NOTHING` 保持幂等）：
```bash
npm run db:seed
```

常用检查命令（静态检查，不会启动服务/改数据库）：
```bash
npm run lint
```

### 3.5 启动项目

1) 启动后端：
```bash
npm run dev:backend
```

2) 启动前端（新终端）：
```bash
npm run dev:frontend
```

访问：
- 前端：http://localhost:5173
- 后端健康检查：http://localhost:3000/health
- 能力探测：http://localhost:3000/api/capabilities

---

## 4. 你将学到的高频知识点（代码内已标注注释）

- Vue 3 Composition API：`ref`/`reactive`、`onMounted`、`watch`
- Vue Router 4：路由配置、菜单跳转、`router-view`
- Pinia：Tab 新增/关闭/切换状态管理
- Axios：请求/响应拦截器、统一错误处理
- Element Plus：`el-menu`、`el-table`、`el-form`、`el-dialog`、`el-pagination`
- ECharts：基础图表渲染与数据驱动更新
- Express RESTful：GET/POST/PUT/DELETE
- PostgreSQL：常规类型 CRUD + 分页（`LIMIT/OFFSET` + `COUNT(*)`）
- PostGIS（可选）：`POINT`、`GEOMETRY` 的存取与 WKT 转换
- 参数校验与异常处理：`zod` + middleware

---

## 5. API 概览

- 用户管理
  - `GET /api/users`
  - `POST /api/users`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`

- 地理数据管理
  - `GET /api/geo`
  - `POST /api/geo`
  - `PUT /api/geo/:id`
  - `DELETE /api/geo/:id`

- 学生管理（分页）
  - `GET /api/classes?page=&pageSize=&keyword=`
  - `POST /api/classes`
  - `PUT /api/classes/:id`
  - `DELETE /api/classes/:id`
  - `GET /api/students?page=&pageSize=&keyword=&classId=`
  - `POST /api/students`
  - `PUT /api/students/:id`
  - `DELETE /api/students/:id`
  - `GET /api/scores?page=&pageSize=&keyword=&subject=`
  - `GET /api/scores/stats/subjects`
  - `POST /api/scores`
  - `PUT /api/scores/:id`
  - `DELETE /api/scores/:id`

- 能力探测
  - `GET /api/capabilities`（返回 `postgis` 等能力，用于前端隐藏 GIS 菜单）

统一响应格式：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

分页响应（`GET /api/classes|students|scores`）：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 6. 一天学习建议（任务式）

1. 先跑通项目，观察左侧菜单与 Tabs 联动。
2. 在“学生信息/班级/成绩”中完成分页查询 + 新增/编辑/删除，理解中后台 CRUD 的完整链路。
3. 在“数据统计”中观察 ECharts 柱状图如何由后端聚合数据驱动。
4. 若数据库未安装 PostGIS，GIS 菜单会自动隐藏；如已安装，可体验 WKT 与 GEOMETRY 的转换。

---

## 7. 技术 - 文件对照（学习索引）

- Vue 3 + Composition API：`frontend/src/views/StudentListView.vue:1`、`frontend/src/views/ClassManagementView.vue:1`、`frontend/src/views/ScoreManagementView.vue:1`
- Vue Router（路由与元信息）：`frontend/src/router/index.js:1`
- Pinia（Tabs 状态）：`frontend/src/stores/tabs.js:1`、`frontend/src/components/TabsBar.vue:1`
- Element Plus（菜单/表格/弹窗/表单/分页）：`frontend/src/components/SidebarMenu.vue:1`、`frontend/src/views/StudentListView.vue:1`
- Axios（统一请求层）：`frontend/src/api/http.js:1`、`frontend/src/api/students.js:1`
- ECharts（统计图表）：`frontend/src/views/StudentStatsView.vue:1`
- Express（路由挂载）：`backend/src/server.js:1`
- Zod + 校验中间件：`backend/src/middleware/validate.js:1`、`backend/src/controllers/studentController.js:1`
- PostgreSQL（建表/初始化/分页 SQL）：`backend/src/db/init.sql:1`、`backend/src/services/studentService.js:1`、`backend/src/utils/pagination.js:1`
- 数据初始化（种子数据）：`backend/src/db/seed.sql:1`、`backend/src/db/seedDb.js:1`
