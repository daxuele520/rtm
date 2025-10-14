<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <div class="logo-icon" v-if="!isCollapse">
          <el-icon size="24"><Key /></el-icon>
        </div>
        <span v-if="!isCollapse">RBAC系统</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <template v-for="menu in menuList" :key="menu.path">
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon" /></el-icon>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleCollapse"
            class="collapse-btn"
          >
            <el-icon><component :is="isCollapse ? 'Expand' : 'Fold'" /></el-icon>
          </el-button>
          
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item
              v-for="item in breadcrumbList"
              :key="item.path"
              :to="item.path"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <!-- 主题切换下拉菜单 -->
          <el-dropdown @command="handleThemeChange" trigger="click">
            <div class="theme-switcher">
              <el-icon><component :is="currentThemeConfig.icon" /></el-icon>
              <span>{{ currentThemeConfig.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="theme in themeList" 
                  :key="theme.key"
                  :command="theme.key"
                  :class="{ 'is-active': currentTheme === theme.key }"
                >
                  <el-icon><component :is="theme.icon" /></el-icon>
                  {{ theme.name }}
                  <el-icon v-if="currentTheme === theme.key" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 用户信息下拉菜单 -->
          <el-dropdown @command="handleCommand" style="margin-left: 16px;">
            <div class="user-info">
              <el-avatar :src="userInfo.avatar" :size="32" />
              <span class="username">{{ userInfo.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, User, SwitchButton, Check, Key, Document } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// 主题相关
const { currentTheme, currentThemeConfig, themeList, themes, setTheme, initTheme } = themeStore

const isCollapse = ref(false)

// 用户信息
const userInfo = computed(() => authStore.userInfo || {})

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 菜单配置
const menuConfig = [
  {
    path: '/dashboard',
    title: '控制台',
    icon: 'Odometer',
    permission: null
  },
  {
    path: '/system',
    title: '系统管理',
    icon: 'Setting',
    permission: 'user:view',
    children: [
      {
        path: '/user-management',
        title: '用户管理',
        icon: 'User',
        permission: 'user:view'
      },
      {
        path: '/permission-management',
        title: '权限管理',
        icon: 'Key',
        permission: 'permission:view'
      },
      {
        path: '/login-log',
        title: '登录日志',
        icon: 'Document',
        permission: 'system:loginlog:view'
      }
    ]
  },
  {
    path: '/table',
    title: '表格管理',
    icon: 'Grid',
    permission: 'table:view',
    children: [
      {
        path: '/table-management',
        title: '表格列表',
        icon: 'List',
        permission: 'table:view'
      }
    ]
  },
  {
    path: '/basic-config',
    title: '基础配置',
    icon: 'Tools',
    permission: 'basic:view',
    children: [
      {
        path: '/basic-config/website',
        title: '网站配置',
        icon: 'Monitor',
        permission: 'basic:website:view'
      },
      {
        path: '/basic-config/system',
        title: '系统配置',
        icon: 'Setting',
        permission: 'basic:system:view'
      },
      {
        path: '/basic-config/dictionary',
        title: '数据字典',
        icon: 'Collection',
        permission: 'basic:dictionary:view'
      },
      {
        path: '/basic-config/file',
        title: '文件管理',
        icon: 'Folder',
        permission: 'basic:file:view'
      },
      {
        path: '/basic-config/notification',
        title: '通知配置',
        icon: 'Bell',
        permission: 'basic:notification:view'
      },
      {
        path: '/basic-config/security',
        title: '安全设置',
        icon: 'Lock',
        permission: 'basic:security:view'
      }
    ]
  },
  {
    path: '/profile',
    title: '个人中心',
    icon: 'UserFilled',
    permission: 'profile:view'
  }
]

// 根据权限过滤菜单
const menuList = computed(() => {
  return menuConfig.filter(menu => {
    if (menu.permission && !authStore.hasPermission(menu.permission)) {
      return false
    }
    
    if (menu.children) {
      menu.children = menu.children.filter(child => 
        !child.permission || authStore.hasPermission(child.permission)
      )
      return menu.children.length > 0
    }
    
    return true
  })
})

// 面包屑导航
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const breadcrumbs = []
  
  // 添加首页
  breadcrumbs.push({ path: '/dashboard', title: '首页' })
  
  // 添加当前路由的面包屑
  matched.forEach(match => {
    if (match.meta.title && match.path !== '/dashboard') {
      breadcrumbs.push({
        path: match.path,
        title: match.meta.title
      })
    }
  })
  
  return breadcrumbs
})

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理主题切换
const handleThemeChange = (themeKey) => {
  setTheme(themeKey)
  ElMessage.success(`已切换到${themes[themeKey].name}`)
}

// 处理用户下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    authStore.logout()
    router.push('/login')
  } catch {
    // 用户取消
  }
}

// 监听路由变化，更新面包屑
watch(route, () => {
  // 路由变化时的处理逻辑
}, { immediate: true })

// 初始化主题
onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  background: var(--sidebar-bg, #f0f2f5);
  transition: width 0.3s;
  overflow: hidden;
  border-right: 1px solid var(--sidebar-border, #d9d9d9);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--logo-color, #1890ff);
  font-size: 18px;
  font-weight: 700;
  background: var(--logo-bg, #ffffff);
  border-bottom: 1px solid var(--logo-border, #d9d9d9);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background: #1890ff;
  border-radius: 6px;
  color: #ffffff;
}

.sidebar-menu {
  border: none;
  background: transparent;
}

/* 一级菜单项样式 */
.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  color: var(--menu-item-color, #262626);
  background-color: transparent;
  border: none;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  transition: all 0.3s;
  font-weight: 500;
}

/* 一级菜单项悬停效果 */
.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background: var(--menu-item-hover-bg, #e6f7ff);
  color: var(--menu-item-hover-color, #1890ff);
}

/* 一级菜单项激活状态 */
.sidebar-menu .el-menu-item.is-active {
  background: var(--menu-item-active-bg, #1890ff);
  color: var(--menu-item-active-color, #ffffff);
  font-weight: 600;
}

/* 子菜单容器样式 */
.sidebar-menu .el-sub-menu .el-menu {
  background: var(--submenu-bg, #fafafa);
  border: none;
}

/* 子菜单项样式 */
.sidebar-menu .el-sub-menu .el-menu-item {
  color: var(--submenu-item-color, #595959);
  background-color: transparent;
  border: none;
  height: 45px;
  line-height: 45px;
  padding-left: 50px;
  transition: all 0.3s;
  font-weight: 400;
}

/* 子菜单项悬停效果 */
.sidebar-menu .el-sub-menu .el-menu-item:hover {
  background: var(--submenu-item-hover-bg, #e6f7ff);
  color: var(--submenu-item-hover-color, #1890ff);
}

/* 子菜单项激活状态 */
.sidebar-menu .el-sub-menu .el-menu-item.is-active {
  background: var(--submenu-item-active-bg, #1890ff);
  color: var(--submenu-item-active-color, #ffffff);
  font-weight: 600;
}

/* 子菜单展开时的标题样式 */
.sidebar-menu .el-sub-menu.is-opened > .el-sub-menu__title {
  background: var(--menu-item-hover-bg, #e6f7ff);
  color: var(--menu-item-hover-color, #1890ff);
}

/* 菜单图标样式 */
.sidebar-menu .el-menu-item .el-icon,
.sidebar-menu .el-sub-menu__title .el-icon {
  margin-right: 10px;
  font-size: 16px;
}

/* 子菜单箭头样式 */
.sidebar-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
  color: var(--menu-item-color, #262626);
  transition: all 0.3s;
  font-size: 12px;
}

.sidebar-menu .el-sub-menu.is-opened .el-sub-menu__title .el-sub-menu__icon-arrow {
  color: var(--menu-item-hover-color, #1890ff);
  transform: rotateZ(180deg);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  margin-right: 20px;
  font-size: 18px;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
}

.theme-switcher {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
  color: #606266;
  font-size: 14px;
}

.theme-switcher:hover {
  background-color: #f5f7fa;
}

.theme-switcher .el-icon {
  margin: 0 4px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
  }
  
  .main-container {
    margin-left: 64px;
  }
  
  .header {
    padding: 0 10px;
  }
  
  .breadcrumb {
    display: none;
  }
}

/* 主题切换下拉菜单样式 */
:deep(.el-dropdown-menu__item.is-active) {
  background-color: #e6f7ff;
  color: #1890ff;
}

:deep(.el-dropdown-menu__item.is-active .check-icon) {
  color: #1890ff;
  margin-left: 8px;
}
</style>