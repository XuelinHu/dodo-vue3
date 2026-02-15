# dodo-vue3：一天任务式全栈学习项目（Vue 3 + Node.js + PostgreSQL/PostGIS）

> 面向具备 Java/Python 基础的开发者，按照“二八原理”聚焦高频核心能力：
> - 前端：Vue 3（Composition API）+ Vite + Vue Router + Pinia + Axios
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
│  │  ├─ views/                      # 用户管理、地理数据管理页面
│  │  ├─ App.vue                     # 左侧菜单 + 右侧 Tabs + 路由视图布局
│  │  └─ main.js                     # 应用入口（挂载 router/pinia）
│  ├─ vite.config.js                 # Vite 配置
│  └─ .eslintrc.cjs                  # ESLint 配置
├─ backend/                          # Node.js + Express 后端工程
│  ├─ src/
│  │  ├─ config/env.js               # 环境变量管理
│  │  ├─ controllers/                # RESTful 控制器 + 参数 schema
│  │  ├─ db/init.sql                 # PostgreSQL + PostGIS 初始化脚本
│  │  ├─ db/initDb.js                # 启动时初始化数据库
│  │  ├─ middleware/                 # validate/error/response 中间件
│  │  ├─ routes/                     # users / geo 路由
│  │  ├─ services/                   # 数据库 CRUD + 特殊类型处理
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

---

## 3. 快速启动（Windows / Mac 通用）

## 3.1 环境版本建议
- Node.js: `>= 20`
- npm: `>= 10`
- PostgreSQL: `>= 14`
- PostGIS: `>= 3`

### 3.2 创建数据库（一次性）

```sql
CREATE DATABASE dodo_vue3;
```

安装 PostGIS 扩展（若尚未安装）：
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

---

## 4. 你将学到的高频知识点（代码内已标注注释）

- Vue 3 Composition API：`ref`/`reactive`、`onMounted`、`watch`
- Vue Router 4：路由配置、菜单跳转、`router-view`
- Pinia：Tab 新增/关闭/切换状态管理
- Axios：请求/响应拦截器、统一错误处理
- Express RESTful：GET/POST/PUT/DELETE
- PostgreSQL：常规类型 CRUD
- PostGIS：`POINT`、`GEOMETRY` 的存取与 WKT 转换
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

统一响应格式：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

---

## 6. 一天学习建议（任务式）

1. 先跑通项目，观察左侧菜单与 Tabs 联动。
2. 在“用户管理”中完成一次增删改查，理解基础类型映射。
3. 在“地理数据管理”中新增一条 Polygon，观察 WKT 与数据库 GEOMETRY 的转换。
4. 对照注释阅读：`frontend/src/stores/tabs.js`、`frontend/src/api/http.js`、`backend/src/services/geoService.js`。
