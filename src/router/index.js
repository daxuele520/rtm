import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { 
          requiresAuth: true,
          title: '控制台',
          icon: 'Odometer'
        }
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'user:view',
          title: '用户管理',
          icon: 'User'
        }
      },
      {
        path: 'permission-management',
        name: 'PermissionManagement',
        component: () => import('@/views/PermissionManagement.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'permission:view',
          title: '权限管理',
          icon: 'Key'
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'profile:view',
          title: '个人中心',
          icon: 'UserFilled'
        }
      },
      {
        path: 'table-management',
        name: 'TableManagement',
        component: () => import('@/views/TableManagement.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'table:view',
          title: '表格管理',
          icon: 'Grid'
        }
      },
      {
        path: 'basic-config',
        name: 'BasicConfig',
        redirect: '/basic-config/website',
        meta: { 
          requiresAuth: true,
          permission: 'basic:view',
          title: '基础配置',
          icon: 'Tools'
        },
        children: [
          {
            path: 'website',
            name: 'WebsiteConfig',
            component: () => import('@/views/basic-config/WebsiteConfig.vue'),
            meta: { 
              requiresAuth: true,
              permission: 'basic:website:view',
              title: '网站配置',
              icon: 'Monitor'
            }
          },
          {
            path: 'system',
            name: 'SystemConfig',
            component: () => import('@/views/basic-config/SystemConfig.vue'),
            meta: { 
              requiresAuth: true,
              permission: 'basic:system:view',
              title: '系统配置',
              icon: 'Setting'
            }
          },
          {
            path: 'dictionary',
            name: 'DictionaryConfig',
            component: () => import('@/views/basic-config/DictionaryConfig.vue'),
            meta: { 
              requiresAuth: true,
              permission: 'basic:dictionary:view',
              title: '数据字典',
              icon: 'Collection'
            }
          },
          {
            path: 'file',
            name: 'FileConfig',
            component: () => import('@/views/basic-config/FileConfig.vue'),
            meta: { 
              requiresAuth: true,
              permission: 'basic:file:view',
              title: '文件管理',
              icon: 'Folder'
            }
          },
          {
            path: 'notification',
            name: 'NotificationConfig',
            component: () => import('@/views/basic-config/NotificationConfig.vue'),
            meta: { 
              requiresAuth: true,
              permission: 'basic:notification:view',
              title: '通知配置',
              icon: 'Bell'
            }
          },
          {
            path: 'security',
            name: 'SecurityConfig',
            component: () => import('@/views/basic-config/SecurityConfig.vue'),
            meta: { 
              requiresAuth: true,
              permission: 'basic:security:view',
              title: '安全设置',
              icon: 'Lock'
            }
          }
        ]
      },
      {
        path: 'login-log',
        name: 'LoginLog',
        component: () => import('@/views/LoginLog.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'system:loginlog:view',
          title: '登录日志',
          icon: 'Document'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    if (!authStore.isLoggedIn) {
      next('/login')
      return
    }
    
    // 检查权限
    if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
      ElMessage.warning('您没有访问此页面的权限')
      next('/dashboard')
      return
    }
  }
  
  // 如果已登录且访问登录页，重定向到首页
  if (to.path === '/login' && authStore.isLoggedIn) {
    next('/')
    return
  }
  
  next()
})

export default router