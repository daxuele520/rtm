// 模拟数据存储
let mockData = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      name: '超级管理员',
      email: 'admin@example.com',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['admin'],
      permissions: ['*'],
      status: 'active',
      createTime: '2023-01-01 00:00:00',
      updateTime: '2023-01-01 00:00:00'
    },
    {
      id: 2,
      username: 'manager',
      password: '123456',
      name: '管理员',
      email: 'manager@example.com',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['manager'],
      permissions: ['user:view', 'user:edit', 'user:create', 'user:delete', 'permission:view', 'profile:view', 'profile:edit', 'table:view', 'table:edit', 'table:create', 'table:delete', 'table:export', 'basic:view', 'basic:website:view', 'basic:system:view', 'basic:dictionary:view', 'basic:file:view', 'basic:notification:view', 'basic:security:view', 'system:loginlog:view', 'system:loginlog:delete'],
      status: 'active',
      createTime: '2023-01-02 00:00:00',
      updateTime: '2023-01-02 00:00:00'
    },
    {
      id: 3,
      username: 'user',
      password: '123456',
      name: '普通用户',
      email: 'user@example.com',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['user'],
      permissions: ['profile:view', 'profile:edit'],
      status: 'active',
      createTime: '2023-01-03 00:00:00',
      updateTime: '2023-01-03 00:00:00'
    },
    {
      id: 4,
      username: 'test',
      password: '123456',
      name: '测试用户',
      email: 'test@example.com',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['user'],
      permissions: ['profile:view'],
      status: 'disabled',
      createTime: '2023-01-04 00:00:00',
      updateTime: '2023-01-04 00:00:00'
    }
  ],
  roles: [
    {
      id: 'admin',
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: ['*'],
      createTime: '2023-01-01 00:00:00',
      updateTime: '2023-01-01 00:00:00'
    },
    {
      id: 'manager',
      name: '管理员',
      description: '拥有用户管理、权限查看、表格管理和登录日志权限',
      permissions: ['user:view', 'user:edit', 'user:create', 'user:delete', 'permission:view', 'profile:view', 'profile:edit', 'table:view', 'table:edit', 'table:create', 'table:delete', 'table:export', 'basic:view', 'basic:website:view', 'basic:system:view', 'basic:dictionary:view', 'basic:file:view', 'basic:notification:view', 'basic:security:view', 'system:loginlog:view', 'system:loginlog:delete'],
      createTime: '2023-01-02 00:00:00',
      updateTime: '2023-01-02 00:00:00'
    },
    {
      id: 'user',
      name: '普通用户',
      description: '只能访问个人中心',
      permissions: ['profile:view', 'profile:edit'],
      createTime: '2023-01-03 00:00:00',
      updateTime: '2023-01-03 00:00:00'
    }
  ],
  permissions: [
    {
      id: 'user:view',
      name: '查看用户',
      description: '查看用户列表和详情',
      module: 'user',
      action: 'view'
    },
    {
      id: 'user:edit',
      name: '编辑用户',
      description: '编辑用户信息',
      module: 'user',
      action: 'edit'
    },
    {
      id: 'user:delete',
      name: '删除用户',
      description: '删除用户账号',
      module: 'user',
      action: 'delete'
    },
    {
      id: 'user:create',
      name: '创建用户',
      description: '创建新用户账号',
      module: 'user',
      action: 'create'
    },
    {
      id: 'permission:view',
      name: '查看权限',
      description: '查看权限和角色信息',
      module: 'permission',
      action: 'view'
    },
    {
      id: 'permission:edit',
      name: '编辑权限',
      description: '编辑权限和角色信息',
      module: 'permission',
      action: 'edit'
    },
    {
      id: 'profile:view',
      name: '查看个人中心',
      description: '查看个人中心信息',
      module: 'profile',
      action: 'view'
    },
    {
      id: 'profile:edit',
      name: '编辑个人中心',
      description: '编辑个人中心信息',
      module: 'profile',
      action: 'edit'
    },
    {
      id: 'table:view',
      name: '查看表格',
      description: '查看表格列表和详情',
      module: 'table',
      action: 'view'
    },
    {
      id: 'table:edit',
      name: '编辑表格',
      description: '编辑表格信息',
      module: 'table',
      action: 'edit'
    },
    {
      id: 'table:delete',
      name: '删除表格',
      description: '删除表格数据',
      module: 'table',
      action: 'delete'
    },
    {
      id: 'table:create',
      name: '创建表格',
      description: '创建新表格',
      module: 'table',
      action: 'create'
    },
    {
      id: 'table:export',
      name: '导出表格',
      description: '导出表格数据',
      module: 'table',
      action: 'export'
    },
    {
      id: 'basic:view',
      name: '查看基础配置',
      description: '查看基础配置模块',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'basic:website:view',
      name: '查看网站配置',
      description: '查看网站基础配置',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'basic:system:view',
      name: '查看系统配置',
      description: '查看系统基础配置',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'basic:dictionary:view',
      name: '查看数据字典',
      description: '查看数据字典配置',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'basic:file:view',
      name: '查看文件管理',
      description: '查看文件管理配置',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'basic:notification:view',
      name: '查看通知配置',
      description: '查看通知配置信息',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'basic:security:view',
      name: '查看安全设置',
      description: '查看安全设置配置',
      module: 'basic',
      action: 'view'
    },
    {
      id: 'system:loginlog:view',
      name: '查看登录日志',
      description: '查看用户登录日志记录',
      module: 'system',
      action: 'view'
    },
    {
      id: 'system:loginlog:delete',
      name: '删除登录日志',
      description: '删除用户登录日志记录',
      module: 'system',
      action: 'delete'
    }
  ],
  tables: [
    {
      id: 1,
      name: '用户信息表',
      description: '存储系统用户的基本信息',
      category: '用户管理',
      status: 'active',
      columns: 8,
      rows: 156,
      size: '2.5MB',
      createTime: '2023-01-01 00:00:00',
      updateTime: '2023-01-15 10:30:00'
    },
    {
      id: 2,
      name: '角色权限表',
      description: '管理系统角色和权限的关联关系',
      category: '权限管理',
      status: 'active',
      columns: 6,
      rows: 24,
      size: '0.8MB',
      createTime: '2023-01-02 00:00:00',
      updateTime: '2023-01-20 14:20:00'
    },
    {
      id: 3,
      name: '操作日志表',
      description: '记录系统操作日志和审计信息',
      category: '系统日志',
      status: 'active',
      columns: 12,
      rows: 1024,
      size: '15.6MB',
      createTime: '2023-01-03 00:00:00',
      updateTime: '2023-01-25 09:15:00'
    },
    {
      id: 4,
      name: '系统配置表',
      description: '存储系统配置参数和设置信息',
      category: '系统配置',
      status: 'active',
      columns: 5,
      rows: 48,
      size: '1.2MB',
      createTime: '2023-01-04 00:00:00',
      updateTime: '2023-01-22 16:45:00'
    },
    {
      id: 5,
      name: '数据字典表',
      description: '管理系统数据字典和枚举值',
      category: '数据字典',
      status: 'active',
      columns: 7,
      rows: 89,
      size: '1.8MB',
      createTime: '2023-01-05 00:00:00',
      updateTime: '2023-01-18 11:30:00'
    },
    {
      id: 6,
      name: '文件管理表',
      description: '管理系统中上传的文件信息',
      category: '文件管理',
      status: 'disabled',
      columns: 9,
      rows: 256,
      size: '8.9MB',
      createTime: '2023-01-06 00:00:00',
      updateTime: '2023-01-12 13:20:00'
    },
    {
      id: 7,
      name: '消息通知表',
      description: '存储系统消息和通知信息',
      category: '消息管理',
      status: 'active',
      columns: 10,
      rows: 512,
      size: '6.3MB',
      createTime: '2023-01-07 00:00:00',
      updateTime: '2023-01-24 08:50:00'
    },
    {
      id: 8,
      name: '部门组织表',
      description: '管理组织架构和部门信息',
      category: '组织管理',
      status: 'active',
      columns: 6,
      rows: 32,
      size: '0.9MB',
      createTime: '2023-01-08 00:00:00',
      updateTime: '2023-01-19 15:10:00'
    },
    {
      id: 9,
      name: '工作流表',
      description: '管理工作流程和审批信息',
      category: '工作流',
      status: 'active',
      columns: 11,
      rows: 128,
      size: '3.7MB',
      createTime: '2023-01-09 00:00:00',
      updateTime: '2023-01-21 12:25:00'
    },
    {
      id: 10,
      name: '备份记录表',
      description: '记录系统数据备份信息',
      category: '数据备份',
      status: 'active',
      columns: 8,
      rows: 64,
      size: '2.1MB',
      createTime: '2023-01-10 00:00:00',
      updateTime: '2023-01-23 07:40:00'
    }
  ],
  loginLogs: [
    {
      id: 1,
      username: 'admin',
      realName: '系统管理员',
      ip: '192.168.1.100',
      location: '中国-广东省-深圳市',
      browser: 'Chrome 120.0.0',
      os: 'Windows 10',
      status: 'success',
      message: '登录成功',
      loginTime: '2024-01-25 09:15:23'
    },
    {
      id: 2,
      username: 'manager',
      realName: '张经理',
      ip: '192.168.1.101',
      location: '中国-广东省-深圳市',
      browser: 'Chrome 120.0.0',
      os: 'Windows 11',
      status: 'success',
      message: '登录成功',
      loginTime: '2024-01-25 09:20:15'
    },
    {
      id: 3,
      username: 'admin',
      realName: '系统管理员',
      ip: '192.168.1.100',
      location: '中国-广东省-深圳市',
      browser: 'Chrome 120.0.0',
      os: 'Windows 10',
      status: 'success',
      message: '登录成功',
      loginTime: '2024-01-25 10:30:45'
    },
    {
      id: 4,
      username: 'user',
      realName: '李用户',
      ip: '192.168.1.102',
      location: '中国-广东省-广州市',
      browser: 'Firefox 121.0',
      os: 'Windows 10',
      status: 'failed',
      message: '密码错误',
      loginTime: '2024-01-25 11:05:12'
    },
    {
      id: 5,
      username: 'manager',
      realName: '张经理',
      ip: '192.168.1.101',
      location: '中国-广东省-深圳市',
      browser: 'Chrome 120.0.0',
      os: 'Windows 11',
      status: 'success',
      message: '登录成功',
      loginTime: '2024-01-25 13:45:30'
    },
    {
      id: 6,
      username: 'admin',
      realName: '系统管理员',
      ip: '192.168.1.100',
      location: '中国-广东省-深圳市',
      browser: 'Chrome 120.0.0',
      os: 'Windows 10',
      status: 'success',
      message: '登录成功',
      loginTime: '2024-01-25 14:20:18'
    },
    {
      id: 7,
      username: 'test',
      realName: '测试账号',
      ip: '192.168.1.105',
      location: '中国-北京市',
      browser: 'Edge 120.0.0',
      os: 'Windows 11',
      status: 'failed',
      message: '账号不存在',
      loginTime: '2024-01-25 15:10:25'
    },
    {
      id: 8,
      username: 'manager',
      realName: '张经理',
      ip: '192.168.1.101',
      location: '中国-广东省-深圳市',
      browser: 'Chrome 120.0.0',
      os: 'Windows 11',
      status: 'success',
      message: '登录成功',
      loginTime: '2024-01-25 16:35:42'
    }
  ]
}

// 模拟API延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 生成ID
const generateId = () => Date.now() + Math.random()

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')
}

// 模拟API响应
const createResponse = (data, message = '操作成功') => ({
  code: 200,
  message,
  data
})

const createErrorResponse = (message = '操作失败') => ({
  code: 500,
  message,
  data: null
})

// 用户相关API
export const userApi = {
  // 登录
  async login(credentials) {
    await delay()
    
    const user = mockData.users.find(u => 
      u.username === credentials.username && u.password === credentials.password
    )
    
    if (!user) {
      return createErrorResponse('用户名或密码错误')
    }
    
    if (user.status === 'disabled') {
      return createErrorResponse('账号已被禁用')
    }
    
    // 生成token
    const token = `mock_token_${user.id}_${Date.now()}`
    
    return createResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles,
        permissions: user.permissions
      }
    }, '登录成功')
  },
  
  // 获取用户列表
  async getUserList(params = {}) {
    await delay()
    
    const { page = 1, size = 10, keyword = '' } = params
    let users = [...mockData.users]
    
    // 搜索过滤
    if (keyword) {
      users = users.filter(user => 
        user.username.includes(keyword) ||
        user.name.includes(keyword) ||
        user.email.includes(keyword)
      )
    }
    
    const total = users.length
    const start = (page - 1) * size
    const end = start + size
    const list = users.slice(start, end)
    
    return createResponse({
      list,
      total,
      page,
      size
    })
  },
  
  // 获取用户详情
  async getUserById(id) {
    await delay()
    
    const user = mockData.users.find(u => u.id === id)
    if (!user) {
      return createErrorResponse('用户不存在')
    }
    
    return createResponse(user)
  },
  
  // 创建用户
  async createUser(userData) {
    await delay()
    
    // 检查用户名是否已存在
    const existingUser = mockData.users.find(u => u.username === userData.username)
    if (existingUser) {
      return createErrorResponse('用户名已存在')
    }
    
    // 根据角色自动分配权限
    let userPermissions = []
    if (userData.roles && userData.roles.length > 0) {
      userData.roles.forEach(roleId => {
        const role = mockData.roles.find(r => r.id === roleId)
        if (role) {
          userPermissions = [...userPermissions, ...role.permissions]
        }
      })
      // 去重
      userPermissions = [...new Set(userPermissions)]
    }
    
    const newUser = {
      id: generateId(),
      ...userData,
      permissions: userPermissions,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      createTime: getCurrentTime(),
      updateTime: getCurrentTime()
    }
    
    mockData.users.push(newUser)
    
    return createResponse(newUser, '用户创建成功')
  },
  
  // 更新用户
  async updateUser(id, userData) {
    await delay()
    
    const userIndex = mockData.users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return createErrorResponse('用户不存在')
    }
    
    // 检查用户名是否被其他用户使用
    if (userData.username) {
      const existingUser = mockData.users.find(u => u.username === userData.username && u.id !== id)
      if (existingUser) {
        return createErrorResponse('用户名已存在')
      }
    }
    
    // 如果角色发生变化，重新计算权限
    let userPermissions = mockData.users[userIndex].permissions
    if (userData.roles && userData.roles.length > 0) {
      userPermissions = []
      userData.roles.forEach(roleId => {
        const role = mockData.roles.find(r => r.id === roleId)
        if (role) {
          userPermissions = [...userPermissions, ...role.permissions]
        }
      })
      // 去重
      userPermissions = [...new Set(userPermissions)]
    }
    
    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      ...userData,
      permissions: userPermissions,
      updateTime: getCurrentTime()
    }
    
    return createResponse(mockData.users[userIndex], '用户更新成功')
  },
  
  // 删除用户
  async deleteUser(id) {
    await delay()
    
    const userIndex = mockData.users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return createErrorResponse('用户不存在')
    }
    
    mockData.users.splice(userIndex, 1)
    
    return createResponse(null, '用户删除成功')
  },
  
  // 批量删除用户
  async batchDeleteUsers(ids) {
    await delay()
    
    const deletedCount = mockData.users.length
    mockData.users = mockData.users.filter(u => !ids.includes(u.id))
    const actualDeletedCount = deletedCount - mockData.users.length
    
    return createResponse({ deletedCount: actualDeletedCount }, `成功删除 ${actualDeletedCount} 个用户`)
  }
}

// 角色相关API
export const roleApi = {
  // 获取角色列表
  async getRoleList() {
    await delay()
    return createResponse(mockData.roles)
  },
  
  // 获取角色详情
  async getRoleById(id) {
    await delay()
    
    const role = mockData.roles.find(r => r.id === id)
    if (!role) {
      return createErrorResponse('角色不存在')
    }
    
    return createResponse(role)
  },
  
  // 创建角色
  async createRole(roleData) {
    await delay()
    
    const newRole = {
      ...roleData,
      createTime: getCurrentTime(),
      updateTime: getCurrentTime()
    }
    
    mockData.roles.push(newRole)
    
    return createResponse(newRole, '角色创建成功')
  },
  
  // 更新角色
  async updateRole(id, roleData) {
    await delay()
    
    const roleIndex = mockData.roles.findIndex(r => r.id === id)
    if (roleIndex === -1) {
      return createErrorResponse('角色不存在')
    }
    
    mockData.roles[roleIndex] = {
      ...mockData.roles[roleIndex],
      ...roleData,
      updateTime: getCurrentTime()
    }
    
    // 更新所有拥有此角色的用户的权限
    mockData.users.forEach(user => {
      if (user.roles.includes(id)) {
        // 重新计算用户权限
        let userPermissions = []
        user.roles.forEach(roleId => {
          const role = mockData.roles.find(r => r.id === roleId)
          if (role) {
            userPermissions = [...userPermissions, ...role.permissions]
          }
        })
        // 去重
        userPermissions = [...new Set(userPermissions)]
        user.permissions = userPermissions
        user.updateTime = getCurrentTime()
      }
    })
    
    return createResponse(mockData.roles[roleIndex], '角色更新成功')
  },
  
  // 删除角色
  async deleteRole(id) {
    await delay()
    
    const roleIndex = mockData.roles.findIndex(r => r.id === id)
    if (roleIndex === -1) {
      return createErrorResponse('角色不存在')
    }
    
    // 检查是否有用户使用此角色
    const usersWithRole = mockData.users.filter(user => user.roles.includes(id))
    if (usersWithRole.length > 0) {
      return createErrorResponse(`无法删除角色，还有 ${usersWithRole.length} 个用户正在使用此角色`)
    }
    
    mockData.roles.splice(roleIndex, 1)
    
    return createResponse(null, '角色删除成功')
  }
}

// 权限相关API
export const permissionApi = {
  // 获取权限列表
  async getPermissionList() {
    await delay()
    return createResponse(mockData.permissions)
  },
  
  // 获取权限详情
  async getPermissionById(id) {
    await delay()
    
    const permission = mockData.permissions.find(p => p.id === id)
    if (!permission) {
      return createErrorResponse('权限不存在')
    }
    
    return createResponse(permission)
  }
}

// 统计相关API
export const statsApi = {
  // 获取统计数据
  async getStats() {
    await delay()
    
    return createResponse({
      totalUsers: mockData.users.length,
      totalRoles: mockData.roles.length,
      totalPermissions: mockData.permissions.length,
      onlineUsers: Math.floor(Math.random() * 20) + 5 // 模拟在线用户数
    })
  }
}

// 表格数据相关API
export const tableApi = {
  // 获取表格列表
  async getTableList(params = {}) {
    await delay()
    
    const { page = 1, size = 10, keyword = '', status = '', category = '', sortBy = '', sortOrder = '' } = params
    let tables = [...mockData.tables]
    
    // 搜索过滤
    if (keyword) {
      tables = tables.filter(table => 
        table.name.includes(keyword) ||
        table.description.includes(keyword) ||
        table.category.includes(keyword)
      )
    }
    
    // 状态过滤
    if (status) {
      tables = tables.filter(table => table.status === status)
    }
    
    // 分类过滤
    if (category) {
      tables = tables.filter(table => table.category === category)
    }
    
    // 排序
    if (sortBy) {
      tables.sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1
        } else {
          return aVal > bVal ? 1 : -1
        }
      })
    }
    
    const total = tables.length
    const start = (page - 1) * size
    const end = start + size
    const list = tables.slice(start, end)
    
    return createResponse({
      list,
      total,
      page,
      size
    })
  },
  
  // 获取表格详情
  async getTableById(id) {
    await delay()
    
    const table = mockData.tables.find(t => t.id === id)
    if (!table) {
      return createErrorResponse('表格不存在')
    }
    
    return createResponse(table)
  },
  
  // 创建表格
  async createTable(tableData) {
    await delay()
    
    // 检查表格名称是否已存在
    const existingTable = mockData.tables.find(t => t.name === tableData.name)
    if (existingTable) {
      return createErrorResponse('表格名称已存在')
    }
    
    const newTable = {
      id: generateId(),
      ...tableData,
      createTime: getCurrentTime(),
      updateTime: getCurrentTime()
    }
    
    mockData.tables.push(newTable)
    
    return createResponse(newTable, '表格创建成功')
  },
  
  // 更新表格
  async updateTable(id, tableData) {
    await delay()
    
    const tableIndex = mockData.tables.findIndex(t => t.id === id)
    if (tableIndex === -1) {
      return createErrorResponse('表格不存在')
    }
    
    // 检查表格名称是否被其他表格使用
    if (tableData.name) {
      const existingTable = mockData.tables.find(t => t.name === tableData.name && t.id !== id)
      if (existingTable) {
        return createErrorResponse('表格名称已存在')
      }
    }
    
    mockData.tables[tableIndex] = {
      ...mockData.tables[tableIndex],
      ...tableData,
      updateTime: getCurrentTime()
    }
    
    return createResponse(mockData.tables[tableIndex], '表格更新成功')
  },
  
  // 删除表格
  async deleteTable(id) {
    await delay()
    
    const tableIndex = mockData.tables.findIndex(t => t.id === id)
    if (tableIndex === -1) {
      return createErrorResponse('表格不存在')
    }
    
    mockData.tables.splice(tableIndex, 1)
    
    return createResponse(null, '表格删除成功')
  },
  
  // 批量删除表格
  async batchDeleteTables(ids) {
    await delay()
    
    const deletedCount = mockData.tables.length
    mockData.tables = mockData.tables.filter(t => !ids.includes(t.id))
    const actualDeletedCount = deletedCount - mockData.tables.length
    
    return createResponse({ deletedCount: actualDeletedCount }, `成功删除 ${actualDeletedCount} 个表格`)
  },
  
  // 导出表格数据
  async exportTableData(params = {}) {
    await delay()
    
    // 模拟导出数据
    const exportData = mockData.tables.map(table => ({
      表格名称: table.name,
      描述: table.description,
      分类: table.category,
      状态: table.status === 'active' ? '启用' : '禁用',
      创建时间: table.createTime,
      更新时间: table.updateTime
    }))
    
    return createResponse(exportData, '导出成功')
  }
}

// 登录日志相关API
export const loginLogApi = {
  // 获取登录日志列表
  async getLoginLogList(params = {}) {
    await delay()
    
    const { page = 1, size = 10, username, status, startTime, endTime } = params
    
    let filteredLogs = [...mockData.loginLogs]
    
    // 按用户名筛选
    if (username) {
      filteredLogs = filteredLogs.filter(log => 
        log.username.includes(username) || log.realName.includes(username)
      )
    }
    
    // 按状态筛选
    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status)
    }
    
    // 按时间范围筛选
    if (startTime) {
      filteredLogs = filteredLogs.filter(log => log.loginTime >= startTime)
    }
    if (endTime) {
      filteredLogs = filteredLogs.filter(log => log.loginTime <= endTime)
    }
    
    // 按登录时间倒序排序
    filteredLogs.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime))
    
    const total = filteredLogs.length
    const start = (page - 1) * size
    const end = start + size
    const list = filteredLogs.slice(start, end)
    
    return createResponse({
      list,
      total,
      page,
      size
    })
  },
  
  // 删除登录日志
  async deleteLoginLog(id) {
    await delay()
    
    const index = mockData.loginLogs.findIndex(log => log.id === id)
    if (index === -1) {
      return createErrorResponse('登录日志不存在')
    }
    
    mockData.loginLogs.splice(index, 1)
    return createResponse(null, '删除成功')
  },
  
  // 批量删除登录日志
  async batchDeleteLoginLogs(ids) {
    await delay()
    
    if (!ids || ids.length === 0) {
      return createErrorResponse('请选择要删除的日志')
    }
    
    mockData.loginLogs = mockData.loginLogs.filter(log => !ids.includes(log.id))
    return createResponse(null, `成功删除 ${ids.length} 条日志`)
  },
  
  // 清空登录日志
  async clearLoginLogs(params = {}) {
    await delay()
    
    const { days } = params
    
    if (days) {
      // 清空指定天数前的日志
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const cutoffTime = cutoffDate.toISOString().slice(0, 19).replace('T', ' ')
      
      const beforeCount = mockData.loginLogs.length
      mockData.loginLogs = mockData.loginLogs.filter(log => log.loginTime >= cutoffTime)
      const deletedCount = beforeCount - mockData.loginLogs.length
      
      return createResponse(null, `成功清空 ${deletedCount} 条日志`)
    } else {
      // 清空所有日志
      const count = mockData.loginLogs.length
      mockData.loginLogs = []
      return createResponse(null, `成功清空 ${count} 条日志`)
    }
  },
  
  // 添加登录日志
  async addLoginLog(logData) {
    await delay()
    
    const newLog = {
      id: generateId(),
      username: logData.username,
      realName: logData.realName || logData.username,
      ip: logData.ip || '0.0.0.0',
      location: logData.location || '未知',
      browser: logData.browser || '未知',
      os: logData.os || '未知',
      status: logData.status || 'success',
      message: logData.message || '登录成功',
      loginTime: getCurrentTime()
    }
    
    mockData.loginLogs.unshift(newLog)
    return createResponse(newLog, '记录成功')
  }
}

export default {
  userApi,
  roleApi,
  permissionApi,
  statsApi,
  tableApi,
  loginLogApi
}

