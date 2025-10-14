<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <p>管理系统用户账号和权限</p>
    </div>

    <!-- 操作栏 -->
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <el-button
            v-if="hasPermission('user:create')"
            type="primary"
            :icon="Plus"
            @click="handleAdd"
          >
            新增用户
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="!selectedUsers.length"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
        
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名或邮箱"
            :prefix-icon="Search"
            clearable
            style="width: 300px;"
            @input="handleSearch"
          />
        </div>
      </div>
    </el-card>

    <!-- 用户表格 -->
    <el-card class="table-card">
      <el-table
        :data="filteredUsers"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        
        <el-table-column prop="username" label="用户名" width="120" />
        
        <el-table-column prop="name" label="姓名" width="120" />
        
        <el-table-column prop="email" label="邮箱" min-width="200" />
        
        <el-table-column label="角色" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              type="primary"
              size="small"
              class="role-tag"
            >
              {{ roleList[role] }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="权限数量" width="100">
          <template #default="{ row }">
            <el-tag type="info" size="small">
              {{ row.permissions.length }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="hasPermission('user:view')"
              type="primary"
              size="small"
              :icon="View"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="hasPermission('user:edit')"
              type="warning"
              size="small"
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="hasPermission('user:edit')"
              :type="row.status === 'active' ? 'danger' : 'success'"
              size="small"
              :icon="row.status === 'active' ? 'Lock' : 'Unlock'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button
              v-if="hasPermission('user:delete')"
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalUsers"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="dialogTitle === '用户详情' ? {} : userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit || dialogTitle === '用户详情'" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" :disabled="dialogTitle === '用户详情'" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" :disabled="dialogTitle === '用户详情'" />
        </el-form-item>
        
        <el-form-item v-if="!isEdit && dialogTitle !== '用户详情'" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        
        <el-form-item label="角色" prop="roles">
          <el-select v-model="userForm.roles" multiple placeholder="请选择角色" :disabled="dialogTitle === '用户详情'">
            <el-option
              v-for="(label, value) in roleList"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status" :disabled="dialogTitle === '用户详情'">
            <el-radio value="active">正常</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="dialogTitle === '用户详情'" label="创建时间">
          <el-input v-model="userForm.createTime" disabled />
        </el-form-item>
        
        <el-form-item v-if="dialogTitle === '用户详情'" label="更新时间">
          <el-input v-model="userForm.updateTime" disabled />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ dialogTitle === '用户详情' ? '关闭' : '取消' }}
        </el-button>
        <el-button 
          v-if="dialogTitle !== '用户详情'"
          type="primary" 
          @click="handleSubmit" 
          :loading="submitting"
        >
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, View, Edit, Search, Lock, Unlock } from '@element-plus/icons-vue'

const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedUsers = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const users = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const submitting = ref(false)
const userFormRef = ref()

// 用户表单
const userForm = ref({
  id: null,
  username: '',
  name: '',
  email: '',
  password: '',
  roles: [],
  status: 'active'
})

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  roles: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 计算属性
const roleList = computed(() => authStore.roleList || {})
const filteredUsers = computed(() => {
  // 直接返回从API获取的用户列表，分页由后端处理
  return users.value
})

// 权限检查
const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

// 方法
const loadUsers = async () => {
  try {
    loading.value = true
    const response = await userService.getUserList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value
    })
    
    if (response.code === 200) {
      users.value = response.data.list
      totalUsers.value = response.data.total
    }
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  userForm.value = {
    id: null,
    username: '',
    name: '',
    email: '',
    password: '',
    roles: [],
    status: 'active'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  userForm.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row) => {
  // 显示用户详情对话框
  userForm.value = { ...row }
  dialogTitle.value = '用户详情'
  isEdit.value = false
  dialogVisible.value = true
}

const handleToggleStatus = async (row) => {
  try {
    const action = row.status === 'active' ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}用户 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const newStatus = row.status === 'active' ? 'disabled' : 'active'
    const response = await userService.updateUser(row.id, {
      ...row,
      status: newStatus
    })
    
    if (response.code === 200) {
      ElMessage.success(`用户${action}成功`)
      loadUsers()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await userService.deleteUser(row.id)
    if (response.code === 200) {
      ElMessage.success(response.message)
      loadUsers()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = selectedUsers.value.map(user => user.id)
    const response = await userService.batchDeleteUsers(ids)
    if (response.code === 200) {
      ElMessage.success(response.message)
      selectedUsers.value = []
      loadUsers()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadUsers()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadUsers()
}

const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    const valid = await userFormRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    let response
    if (isEdit.value) {
      response = await userService.updateUser(userForm.value.id, userForm.value)
    } else {
      response = await userService.createUser(userForm.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(response.message)
      dialogVisible.value = false
      loadUsers()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

const handleDialogClose = () => {
  userFormRef.value?.resetFields()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.toolbar {
  margin-bottom: 20px;
  border-radius: 8px;
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.table-card {
  border-radius: 8px;
}

.role-tag {
  margin-right: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-right {
    width: 100%;
  }
  
  .toolbar-right .el-input {
    width: 100% !important;
  }
}
</style>