# 🚀 Vue RBAC 权限管理系统

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.3.4-4FC08D?style=flat-square&logo=vue.js)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.3.8-409EFF?style=flat-square&logo=element)
![Pinia](https://img.shields.io/badge/Pinia-2.1.6-FFD859?style=flat-square&logo=pinia)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

一个基于 Vue 3 + Element Plus + Pinia 构建的现代化 RBAC（基于角色的访问控制）权限管理系统

[在线演示](http://localhost:3000) | [功能特性](#-功能特性) | [快速开始](#-快速开始) | [项目结构](#-项目结构)

</div>

## 📋 目录

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [功能模块](#-功能模块)
- [权限系统](#-权限系统)
- [API 接口](#-api-接口)
- [开发指南](#-开发指南)
- [部署说明](#-部署说明)
- [常见问题](#-常见问题)
- [更新日志](#-更新日志)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

## ✨ 功能特性

### 🔐 用户认证与授权
- **JWT Token 认证** - 安全的用户身份验证
- **多角色权限控制** - 基于角色的细粒度权限管理
- **登录日志记录** - 完整的用户登录行为追踪
- **自动权限验证** - 路由级、页面级、按钮级权限控制

### 👥 用户管理
- **用户 CRUD 操作** - 完整的用户增删改查功能
- **批量操作** - 支持批量删除、批量状态修改
- **用户状态管理** - 启用/禁用用户账号
- **角色分配** - 灵活的用户角色分配机制
- **用户详情查看** - 完整的用户信息展示

### 🔑 权限管理
- **角色管理** - 创建、编辑、删除角色
- **权限配置** - 树形权限配置界面
- **权限分配** - 为角色分配具体权限
- **权限验证** - 实时权限检查和验证

### 📊 系统功能
- **控制台** - 系统概览和统计数据
- **表格管理** - 完整的表格功能示例（搜索、筛选、分页、CRUD、导出）
- **基础配置** - 系统基础配置管理
  - 网站配置
  - 系统配置
  - 数据字典
  - 文件管理
  - 通知配置
  - 安全设置
- **登录日志** - 用户登录行为记录和查询

### 🎨 界面特性
- **现代化 UI** - 基于 Element Plus 的美观界面
- **响应式设计** - 完美适配桌面端和移动端
- **主题切换** - 多种主题色彩方案
- **面包屑导航** - 清晰的页面导航
- **侧边栏折叠** - 灵活的布局控制

### 🛠️ 开发特性
- **Mock 数据接口** - 完整的假数据模拟，便于开发测试
- **模块化架构** - 清晰的代码结构，易于维护和扩展
- **TypeScript 友好** - 支持 TypeScript 开发
- **热重载** - 高效的开发体验

## 🛠️ 技术栈

### 核心框架
- **Vue 3.3.4** - 渐进式 JavaScript 框架
- **Vite 4.4.5** - 下一代前端构建工具
- **Vue Router 4.2.4** - 官方路由管理器

### UI 组件
- **Element Plus 2.3.8** - 基于 Vue 3 的组件库
- **Element Plus Icons 2.1.0** - 丰富的图标库

### 状态管理
- **Pinia 2.1.6** - Vue 的官方状态管理库

### HTTP 客户端
- **Axios 1.4.0** - 基于 Promise 的 HTTP 库

### 开发工具
- **@vitejs/plugin-vue 4.2.3** - Vue 单文件组件支持
- **Sass 1.64.1** - CSS 预处理器

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd vue-rbac

# 安装依赖
npm install
# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev
# 或使用 yarn
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本

```bash
# 构建生产版本
npm run build
# 或使用 yarn
yarn build
```

### 预览生产版本

```bash
# 预览生产版本
npm run preview
# 或使用 yarn
yarn preview
```

## 📁 项目结构

```
vue-rbac/
├── public/                     # 静态资源
│   ├── vite.svg               # Vite 图标
│   └── logo.svg               # 项目 Logo
├── src/                       # 源代码
│   ├── api/                   # API 接口层
│   │   ├── index.js          # 接口统一导出
│   │   ├── mock.js           # Mock 数据模拟
│   │   └── request.js        # Axios 配置
│   ├── layout/               # 布局组件
│   │   └── index.vue         # 主布局组件
│   ├── router/               # 路由配置
│   │   └── index.js          # 路由定义和守卫
│   ├── stores/               # 状态管理
│   │   ├── auth.js           # 认证状态管理
│   │   └── theme.js          # 主题状态管理
│   ├── views/                # 页面组件
│   │   ├── basic-config/     # 基础配置页面
│   │   │   ├── WebsiteConfig.vue
│   │   │   ├── SystemConfig.vue
│   │   │   ├── DictionaryConfig.vue
│   │   │   ├── FileConfig.vue
│   │   │   ├── NotificationConfig.vue
│   │   │   └── SecurityConfig.vue
│   │   ├── Dashboard.vue     # 控制台
│   │   ├── Login.vue         # 登录页
│   │   ├── LoginLog.vue      # 登录日志
│   │   ├── PermissionManagement.vue # 权限管理
│   │   ├── Profile.vue       # 个人中心
│   │   ├── TableManagement.vue # 表格管理
│   │   ├── UserManagement.vue # 用户管理
│   │   └── NotFound.vue      # 404 页面
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── index.html                # HTML 模板
├── package.json              # 项目配置
├── vite.config.js            # Vite 配置
├── README.md                 # 项目说明
└── 启动说明.md               # 启动说明
```

## 🎯 功能模块

### 1. 用户认证模块
- **登录功能** - 用户名密码登录
- **退出登录** - 安全退出并清除状态
- **Token 管理** - 自动 Token 刷新和过期处理
- **登录日志** - 记录登录 IP、时间、浏览器等信息

### 2. 用户管理模块
- **用户列表** - 分页展示用户信息
- **用户搜索** - 支持用户名、邮箱搜索
- **用户状态** - 启用/禁用用户账号
- **用户详情** - 查看用户完整信息
- **新增用户** - 创建新用户账号
- **编辑用户** - 修改用户信息
- **删除用户** - 单个或批量删除用户

### 3. 权限管理模块
- **角色管理** - 角色的增删改查
- **权限配置** - 树形权限配置界面
- **权限分配** - 为角色分配权限
- **权限验证** - 实时权限检查

### 4. 表格管理模块
- **数据展示** - 表格数据分页展示
- **搜索筛选** - 多条件搜索和筛选
- **排序功能** - 多列排序支持
- **CRUD 操作** - 完整的增删改查功能
- **批量操作** - 批量删除、批量导出
- **数据导出** - Excel 格式数据导出

### 5. 基础配置模块
- **网站配置** - 网站基本信息配置
- **系统配置** - 系统参数配置
- **数据字典** - 系统数据字典管理
- **文件管理** - 文件上传和管理
- **通知配置** - 系统通知配置
- **安全设置** - 系统安全参数设置

### 6. 个人中心模块
- **个人信息** - 查看和编辑个人信息
- **头像上传** - 支持头像图片上传
- **密码修改** - 安全密码修改功能
- **登录历史** - 查看个人登录记录

## 🔐 权限系统

### 权限定义

| 权限 ID | 权限名称 | 描述 |
|---------|----------|------|
| `user:view` | 查看用户 | 查看用户列表和详情 |
| `user:edit` | 编辑用户 | 编辑用户信息 |
| `user:delete` | 删除用户 | 删除用户账号 |
| `user:create` | 创建用户 | 创建新用户账号 |
| `permission:view` | 查看权限 | 查看权限和角色信息 |
| `permission:edit` | 编辑权限 | 编辑权限和角色信息 |
| `profile:view` | 查看个人中心 | 查看个人中心信息 |
| `profile:edit` | 编辑个人中心 | 编辑个人中心信息 |
| `table:view` | 查看表格 | 查看表格列表和详情 |
| `table:edit` | 编辑表格 | 编辑表格信息 |
| `table:delete` | 删除表格 | 删除表格数据 |
| `table:create` | 创建表格 | 创建新表格 |
| `table:export` | 导出表格 | 导出表格数据 |
| `basic:view` | 查看基础配置 | 查看基础配置模块 |
| `basic:website:view` | 查看网站配置 | 查看网站基础配置 |
| `basic:system:view` | 查看系统配置 | 查看系统基础配置 |
| `basic:dictionary:view` | 查看数据字典 | 查看数据字典配置 |
| `basic:file:view` | 查看文件管理 | 查看文件管理配置 |
| `basic:notification:view` | 查看通知配置 | 查看通知配置信息 |
| `basic:security:view` | 查看安全设置 | 查看安全设置配置 |
| `system:loginlog:view` | 查看登录日志 | 查看用户登录日志记录 |
| `system:loginlog:delete` | 删除登录日志 | 删除用户登录日志记录 |
| `*` | 所有权限 | 超级管理员权限 |

### 角色定义

| 角色 ID | 角色名称 | 权限说明 |
|---------|----------|----------|
| `admin` | 超级管理员 | 拥有系统所有权限 |
| `manager` | 管理员 | 拥有用户管理、权限查看、表格管理、基础配置、登录日志权限 |
| `user` | 普通用户 | 只能访问个人中心 |

### 演示账号

| 角色 | 用户名 | 密码 | 权限说明 |
|------|--------|------|----------|
| 超级管理员 | `admin` | `123456` | 拥有所有权限 |
| 管理员 | `manager` | `123456` | 用户管理、权限查看、表格管理、基础配置、登录日志 |
| 普通用户 | `user` | `123456` | 仅个人中心 |

## 📡 API 接口

### 认证接口

```javascript
// 用户登录
POST /api/auth/login
{
  "username": "admin",
  "password": "123456"
}

// 响应
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "系统管理员",
      "email": "admin@example.com",
      "avatar": "https://...",
      "roles": ["admin"],
      "permissions": ["*"]
    }
  }
}
```

### 用户管理接口

```javascript
// 获取用户列表
GET /api/users?page=1&size=10&keyword=

// 创建用户
POST /api/users
{
  "username": "newuser",
  "name": "新用户",
  "email": "newuser@example.com",
  "password": "123456",
  "roles": ["user"],
  "status": "active"
}

// 更新用户
PUT /api/users/:id

// 删除用户
DELETE /api/users/:id

// 批量删除用户
DELETE /api/users/batch
{
  "ids": [1, 2, 3]
}
```

### 角色管理接口

```javascript
// 获取角色列表
GET /api/roles

// 创建角色
POST /api/roles
{
  "id": "newrole",
  "name": "新角色",
  "description": "角色描述",
  "permissions": ["user:view", "user:edit"]
}

// 更新角色
PUT /api/roles/:id

// 删除角色
DELETE /api/roles/:id
```

### 权限管理接口

```javascript
// 获取权限列表
GET /api/permissions

// 获取权限详情
GET /api/permissions/:id
```

### 登录日志接口

```javascript
// 获取登录日志列表
GET /api/login-logs?page=1&size=10&username=&status=&startTime=&endTime=

// 删除登录日志
DELETE /api/login-logs/:id

// 批量删除登录日志
DELETE /api/login-logs/batch
{
  "ids": [1, 2, 3]
}

// 清空登录日志
DELETE /api/login-logs/clear
{
  "days": 30  // 清空30天前的日志，不传则清空全部
}
```

## 🛠️ 开发指南

### 添加新页面

1. **创建页面组件**
```bash
# 在 src/views 目录下创建新组件
touch src/views/NewPage.vue
```

2. **配置路由**
```javascript
// 在 src/router/index.js 中添加路由
{
  path: 'new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPage.vue'),
  meta: { 
    requiresAuth: true,
    permission: 'new:view',
    title: '新页面',
    icon: 'NewIcon'
  }
}
```

3. **添加菜单**
```javascript
// 在 src/layout/index.vue 中添加菜单项
{
  path: '/new-page',
  title: '新页面',
  icon: 'NewIcon',
  permission: 'new:view'
}
```

4. **添加权限**
```javascript
// 在 src/stores/auth.js 中添加权限定义
const permissionList = {
  'new:view': '查看新页面',
  'new:edit': '编辑新页面'
}
```

### 添加新 API

1. **在 mock.js 中添加数据**
```javascript
// 在 mockData 中添加数据
newData: [
  {
    id: 1,
    name: '示例数据',
    // ... 其他字段
  }
]
```

2. **添加 API 方法**
```javascript
// 在 mock.js 中添加 API
export const newApi = {
  async getNewList(params = {}) {
    // API 实现
  },
  
  async createNew(data) {
    // API 实现
  }
}
```

3. **在 index.js 中导出**
```javascript
// 在 src/api/index.js 中导出服务
export const newService = {
  getNewList: (params) => newApi.getNewList(params),
  createNew: (data) => newApi.createNew(data)
}
```

### 主题定制

1. **添加新主题**
```javascript
// 在 src/stores/theme.js 中添加主题
const themes = {
  // ... 现有主题
  newTheme: {
    name: '新主题',
    icon: 'NewIcon',
    colors: {
      primary: '#409EFF',
      success: '#67C23A',
      // ... 其他颜色
    }
  }
}
```

2. **应用主题样式**
```css
/* 在组件中使用 CSS 变量 */
.custom-component {
  background-color: var(--el-color-primary);
  color: var(--el-color-success);
}
```

## 🚀 部署说明

### 构建生产版本

```bash
# 构建生产版本
npm run build
```

构建完成后，`dist` 目录包含所有静态文件。

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker 部署

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制构建文件
COPY dist/ /usr/share/nginx/html/

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建和运行
docker build -t vue-rbac .
docker run -d -p 80:80 vue-rbac
```

## ❓ 常见问题

### Q: 如何修改端口号？
A: 在 `vite.config.js` 中修改 `server.port` 配置：
```javascript
export default defineConfig({
  server: {
    port: 8080, // 修改为所需端口
    open: true
  }
})
```

### Q: 如何对接真实后端？
A: 修改 `src/api/request.js` 中的 `baseURL`：
```javascript
const request = axios.create({
  baseURL: 'https://your-api-domain.com/api', // 修改为真实后端地址
  timeout: 10000
})
```

### Q: 如何添加新的权限？
A: 在 `src/stores/auth.js` 中的 `permissionList` 对象中添加新权限：
```javascript
const permissionList = {
  // ... 现有权限
  'new:permission': '新权限描述'
}
```

### Q: 如何自定义主题颜色？
A: 在 `src/stores/theme.js` 中修改主题配置：
```javascript
const themes = {
  default: {
    name: '默认主题',
    colors: {
      primary: '#409EFF', // 修改主色调
      success: '#67C23A', // 修改成功色
      // ... 其他颜色
    }
  }
}
```

### Q: 如何处理权限验证失败？
A: 系统会自动处理权限验证：
- 路由级权限：自动重定向到首页
- 页面级权限：显示无权限提示
- 按钮级权限：隐藏无权限按钮

### Q: 如何扩展用户信息字段？
A: 在 `src/api/mock.js` 中的用户数据结构中添加新字段：
```javascript
{
  id: 1,
  username: 'admin',
  name: '系统管理员',
  email: 'admin@example.com',
  phone: '13800138000', // 新增字段
  department: '技术部', // 新增字段
  // ... 其他字段
}
```

## 📝 更新日志

### v1.0.0 (2024-01-25)

#### ✨ 新增功能
- 🎉 完整的 RBAC 权限管理系统
- 👥 用户管理模块（增删改查、状态管理）
- 🔑 权限管理模块（角色管理、权限配置）
- 📊 表格管理模块（完整示例功能）
- 🏗️ 基础配置模块（6个子模块）
- 📝 登录日志模块（IP记录、时间记录）
- 🎨 主题切换功能（多主题支持）
- 📱 响应式设计（移动端适配）

#### 🛠️ 技术特性
- Vue 3 + Element Plus + Pinia 技术栈
- Mock 数据接口，便于开发测试
- 树形权限配置界面
- 完整的权限验证机制
- 现代化 UI 设计

#### 🔧 开发体验
- 热重载开发环境
- 清晰的代码结构
- 完善的错误处理
- TypeScript 友好

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **Fork 项目**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **开启 Pull Request**

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue 3 Composition API 规范
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 提交信息使用中文，格式：`类型: 描述`

### 提交类型

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by [Your Name]

</div>