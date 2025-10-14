import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { userService, loginLogService } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const permissions = ref(JSON.parse(localStorage.getItem('permissions') || '[]'))
  const roles = ref(JSON.parse(localStorage.getItem('roles') || '[]'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userInfo = computed(() => user.value)
  const userPermissions = computed(() => permissions.value)
  const userRoles = computed(() => roles.value)

  // 权限定义
  const permissionList = {
    'user:view': '查看用户',
    'user:edit': '编辑用户',
    'user:delete': '删除用户',
    'user:create': '创建用户',
    'permission:view': '查看权限',
    'permission:edit': '编辑权限',
    'profile:view': '查看个人中心',
    'profile:edit': '编辑个人中心',
    'table:view': '查看表格',
    'table:edit': '编辑表格',
    'table:delete': '删除表格',
    'table:create': '创建表格',
    'table:export': '导出表格',
    'basic:view': '查看基础配置',
    'basic:website:view': '查看网站配置',
    'basic:system:view': '查看系统配置',
    'basic:dictionary:view': '查看数据字典',
    'basic:file:view': '查看文件管理',
    'basic:notification:view': '查看通知配置',
    'basic:security:view': '查看安全设置',
    'system:loginlog:view': '查看登录日志',
    'system:loginlog:delete': '删除登录日志',
    '*': '所有权限'
  }

  // 角色定义
  const roleList = {
    'admin': '超级管理员',
    'manager': '管理员',
    'user': '普通用户'
  }

  // 获取浏览器信息
  const getBrowserInfo = () => {
    const ua = navigator.userAgent
    let browser = '未知'
    
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      browser = 'Chrome'
    } else if (ua.indexOf('Edg') > -1) {
      browser = 'Edge'
    } else if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox'
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari'
    }
    
    return browser
  }
  
  // 获取操作系统信息
  const getOSInfo = () => {
    const ua = navigator.userAgent
    let os = '未知'
    
    if (ua.indexOf('Windows NT 10.0') > -1) {
      os = 'Windows 10'
    } else if (ua.indexOf('Windows NT 6.3') > -1) {
      os = 'Windows 8.1'
    } else if (ua.indexOf('Windows NT 6.2') > -1) {
      os = 'Windows 8'
    } else if (ua.indexOf('Windows NT 6.1') > -1) {
      os = 'Windows 7'
    } else if (ua.indexOf('Mac OS X') > -1) {
      os = 'Mac OS'
    } else if (ua.indexOf('Linux') > -1) {
      os = 'Linux'
    }
    
    return os
  }
  
  // 方法
  const login = async (loginForm) => {
    try {
      const response = await userService.login(loginForm)
      
      if (response.code === 200) {
        const { token: newToken, user: userData } = response.data
        
        // 保存用户信息
        token.value = newToken
        user.value = userData
        permissions.value = userData.permissions
        roles.value = userData.roles

        // 持久化存储
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('permissions', JSON.stringify(userData.permissions))
        localStorage.setItem('roles', JSON.stringify(userData.roles))

        // 记录登录日志
        try {
          await loginLogService.addLoginLog({
            username: userData.username,
            realName: userData.name,
            ip: '192.168.1.100', // 实际项目中应该从后端获取真实IP
            location: '中国-广东省-深圳市', // 实际项目中应该根据IP解析地理位置
            browser: getBrowserInfo(),
            os: getOSInfo(),
            status: 'success',
            message: '登录成功'
          })
        } catch (logError) {
          console.error('记录登录日志失败:', logError)
        }

        ElMessage.success(response.message)
        return true
      } else {
        // 记录登录失败日志
        try {
          await loginLogService.addLoginLog({
            username: loginForm.username,
            realName: loginForm.username,
            ip: '192.168.1.100',
            location: '中国-广东省-深圳市',
            browser: getBrowserInfo(),
            os: getOSInfo(),
            status: 'failed',
            message: response.message || '登录失败'
          })
        } catch (logError) {
          console.error('记录登录日志失败:', logError)
        }
        
        ElMessage.error(response.message)
        return false
      }
    } catch (error) {
      // 记录登录异常日志
      try {
        await loginLogService.addLoginLog({
          username: loginForm.username,
          realName: loginForm.username,
          ip: '192.168.1.100',
          location: '中国-广东省-深圳市',
          browser: getBrowserInfo(),
          os: getOSInfo(),
          status: 'failed',
          message: '登录异常'
        })
      } catch (logError) {
        console.error('记录登录日志失败:', logError)
      }
      
      ElMessage.error('登录失败')
      return false
    }
  }

  const logout = () => {
    // 清除状态
    token.value = ''
    user.value = null
    permissions.value = []
    roles.value = []

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
    localStorage.removeItem('roles')

    ElMessage.success('已退出登录')
  }

  const checkAuth = () => {
    if (token.value && user.value) {
      return true
    } else {
      // 清除可能存在的无效数据
      logout()
      return false
    }
  }

  const hasPermission = (permission) => {
    if (!permissions.value) return false
    // 超级管理员拥有所有权限
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(permission)
  }

  const hasRole = (role) => {
    if (!roles.value) return false
    return roles.value.includes(role)
  }

  const hasAnyPermission = (permissionList) => {
    if (!permissions.value) return false
    if (permissions.value.includes('*')) return true
    return permissionList.some(permission => permissions.value.includes(permission))
  }

  const hasAnyRole = (roleList) => {
    if (!roles.value) return false
    return roleList.some(role => roles.value.includes(role))
  }

  const updateUserInfo = (newUserInfo) => {
    if (user.value) {
      user.value = { ...user.value, ...newUserInfo }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    // 状态
    token,
    user,
    permissions,
    roles,
    
    // 计算属性
    isLoggedIn,
    userInfo,
    userPermissions,
    userRoles,
    
    // 方法
    login,
    logout,
    checkAuth,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAnyRole,
    updateUserInfo,
    
    // 常量
    permissionList,
    roleList
  }
})