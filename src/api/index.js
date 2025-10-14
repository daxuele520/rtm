// API接口统一导出
import request from './request'
import { userApi, roleApi, permissionApi, statsApi, tableApi, loginLogApi } from './mock'

// 用户相关接口
export const userService = {
  // 登录
  login: (credentials) => userApi.login(credentials),
  
  // 获取用户列表
  getUserList: (params) => userApi.getUserList(params),
  
  // 获取用户详情
  getUserById: (id) => userApi.getUserById(id),
  
  // 创建用户
  createUser: (userData) => userApi.createUser(userData),
  
  // 更新用户
  updateUser: (id, userData) => userApi.updateUser(id, userData),
  
  // 删除用户
  deleteUser: (id) => userApi.deleteUser(id),
  
  // 批量删除用户
  batchDeleteUsers: (ids) => userApi.batchDeleteUsers(ids)
}

// 角色相关接口
export const roleService = {
  // 获取角色列表
  getRoleList: () => roleApi.getRoleList(),
  
  // 获取角色详情
  getRoleById: (id) => roleApi.getRoleById(id),
  
  // 创建角色
  createRole: (roleData) => roleApi.createRole(roleData),
  
  // 更新角色
  updateRole: (id, roleData) => roleApi.updateRole(id, roleData),
  
  // 删除角色
  deleteRole: (id) => roleApi.deleteRole(id)
}

// 权限相关接口
export const permissionService = {
  // 获取权限列表
  getPermissionList: () => permissionApi.getPermissionList(),
  
  // 获取权限详情
  getPermissionById: (id) => permissionApi.getPermissionById(id)
}

// 统计相关接口
export const statsService = {
  // 获取统计数据
  getStats: () => statsApi.getStats()
}

// 表格相关接口
export const tableService = {
  // 获取表格列表
  getTableList: (params) => tableApi.getTableList(params),
  
  // 获取表格详情
  getTableById: (id) => tableApi.getTableById(id),
  
  // 创建表格
  createTable: (tableData) => tableApi.createTable(tableData),
  
  // 更新表格
  updateTable: (id, tableData) => tableApi.updateTable(id, tableData),
  
  // 删除表格
  deleteTable: (id) => tableApi.deleteTable(id),
  
  // 批量删除表格
  batchDeleteTables: (ids) => tableApi.batchDeleteTables(ids),
  
  // 导出表格数据
  exportTableData: (params) => tableApi.exportTableData(params)
}

// 登录日志相关接口
export const loginLogService = {
  // 获取登录日志列表
  getLoginLogList: (params) => loginLogApi.getLoginLogList(params),
  
  // 删除登录日志
  deleteLoginLog: (id) => loginLogApi.deleteLoginLog(id),
  
  // 批量删除登录日志
  batchDeleteLoginLogs: (ids) => loginLogApi.batchDeleteLoginLogs(ids),
  
  // 清空登录日志
  clearLoginLogs: (params) => loginLogApi.clearLoginLogs(params),
  
  // 添加登录日志
  addLoginLog: (logData) => loginLogApi.addLoginLog(logData)
}

// 真实后端接口示例（注释掉，需要时取消注释并修改）
/*
export const userService = {
  login: (credentials) => request.post('/auth/login', credentials),
  getUserList: (params) => request.get('/users', { params }),
  getUserById: (id) => request.get(`/users/${id}`),
  createUser: (userData) => request.post('/users', userData),
  updateUser: (id, userData) => request.put(`/users/${id}`, userData),
  deleteUser: (id) => request.delete(`/users/${id}`),
  batchDeleteUsers: (ids) => request.delete('/users/batch', { data: { ids } })
}

export const roleService = {
  getRoleList: () => request.get('/roles'),
  getRoleById: (id) => request.get(`/roles/${id}`),
  createRole: (roleData) => request.post('/roles', roleData),
  updateRole: (id, roleData) => request.put(`/roles/${id}`, roleData),
  deleteRole: (id) => request.delete(`/roles/${id}`)
}

export const permissionService = {
  getPermissionList: () => request.get('/permissions'),
  getPermissionById: (id) => request.get(`/permissions/${id}`)
}

export const statsService = {
  getStats: () => request.get('/stats')
}
*/

export default {
  userService,
  roleService,
  permissionService,
  statsService,
  tableService,
  loginLogService
}

