<template>
  <div class="permission-management">
    <div class="page-header">
      <h2>权限管理</h2>
      <p>管理系统角色和权限配置</p>
    </div>

    <el-row :gutter="20">
      <!-- 角色管理 -->
      <el-col :xs="24" :lg="12">
        <el-card class="role-card">
          <template #header>
            <div class="card-header">
              <span>角色管理</span>
              <el-button
                v-if="hasPermission('permission:edit')"
                type="primary"
                size="small"
                :icon="Plus"
                @click="handleAddRole"
              >
                新增角色
              </el-button>
            </div>
          </template>
          
          <el-table
            :data="roles"
            v-loading="roleLoading"
            stripe
            border
            height="400"
            @row-click="selectRole"
            style="cursor: pointer;"
          >
            <el-table-column prop="id" label="角色ID" width="100" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column label="权限数量" width="100">
              <template #default="{ row }">
                <el-tag type="info" size="small">
                  {{ row.permissions.length }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  :icon="Setting"
                  @click.stop="selectRole(row)"
                >
                  配置权限
                </el-button>
                <el-button
                  v-if="hasPermission('permission:edit')"
                  type="warning"
                  size="small"
                  :icon="Edit"
                  @click.stop="handleEditRole(row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="hasPermission('permission:edit') && row.id !== 'admin'"
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click.stop="handleDeleteRole(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 权限管理 -->
      <el-col :xs="24" :lg="12">
        <el-card class="permission-card">
          <template #header>
            <div class="card-header">
              <span>权限列表</span>
            </div>
          </template>
          
          <el-table
            :data="permissions"
            v-loading="permissionLoading"
            stripe
            border
            height="400"
          >
            <el-table-column prop="id" label="权限ID" width="120" />
            <el-table-column prop="name" label="权限名称" />
            <el-table-column prop="module" label="模块" width="80" />
            <el-table-column prop="action" label="操作" width="80" />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 角色权限配置 -->
    <el-card class="role-permission-card" v-if="selectedRole">
      <template #header>
        <div class="card-header">
          <span>角色权限配置 - {{ selectedRole.name }}</span>
        </div>
      </template>
      
      <div class="permission-config">
        <div class="permission-tree-container">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTreeData"
            :props="treeProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="selectedPermissions"
            :disabled="!hasPermission('permission:edit')"
            @check="handleTreeCheck"
            class="permission-tree"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <el-icon v-if="data.icon" class="node-icon">
                  <component :is="data.icon" />
                </el-icon>
                <span class="node-label">{{ data.label }}</span>
                <span v-if="data.description" class="node-description">{{ data.description }}</span>
              </div>
            </template>
          </el-tree>
        </div>
        
        <div class="permission-actions" v-if="hasPermission('permission:edit')">
          <el-button type="primary" @click="handleSavePermissions" :loading="saving">
            保存权限配置
          </el-button>
          <el-button @click="handleCancelPermissions">取消</el-button>
        </div>
      </div>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="roleDialogTitle"
      width="500px"
      @close="handleRoleDialogClose"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色ID" prop="id">
          <el-input v-model="roleForm.id" :disabled="isEditRole" />
        </el-form-item>
        
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" />
        </el-form-item>
        
        <el-form-item label="权限" prop="permissions">
          <el-select v-model="roleForm.permissions" multiple placeholder="请选择权限">
            <el-option
              v-for="permission in permissions"
              :key="permission.id"
              :label="permission.name"
              :value="permission.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRoleSubmit" :loading="roleSubmitting">
          {{ isEditRole ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { roleService, permissionService } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Setting, 
  Edit, 
  Delete,
  User,
  Key,
  UserFilled,
  Grid,
  Tools,
  Monitor,
  Collection,
  Folder,
  Bell,
  Lock
} from '@element-plus/icons-vue'

const authStore = useAuthStore()

// 响应式数据
const roleLoading = ref(false)
const permissionLoading = ref(false)
const saving = ref(false)
const roles = ref([])
const permissions = ref([])
const selectedRole = ref(null)
const selectedPermissions = ref([])
const permissionTreeRef = ref()

// 树形组件配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 角色对话框相关
const roleDialogVisible = ref(false)
const roleDialogTitle = ref('')
const isEditRole = ref(false)
const roleSubmitting = ref(false)
const roleFormRef = ref()

// 角色表单
const roleForm = ref({
  id: '',
  name: '',
  description: '',
  permissions: []
})

// 表单验证规则
const roleRules = {
  id: [
    { required: true, message: '请输入角色ID', trigger: 'blur' },
    { min: 2, max: 20, message: '角色ID长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ],
  permissions: [
    { required: true, message: '请选择权限', trigger: 'change' }
  ]
}

// 计算属性
const permissionGroups = computed(() => {
  const groups = {}
  permissions.value.forEach(permission => {
    if (!groups[permission.module]) {
      groups[permission.module] = []
    }
    groups[permission.module].push(permission)
  })
  return groups
})

// 树形数据
const permissionTreeData = computed(() => {
  const moduleIcons = {
    user: markRaw(User),
    permission: markRaw(Key),
    profile: markRaw(UserFilled),
    table: markRaw(Grid),
    basic: markRaw(Tools)
  }
  
  const moduleNames = {
    user: '用户管理',
    permission: '权限管理',
    profile: '个人中心',
    table: '表格管理',
    basic: '基础配置'
  }
  
  const basicSubModules = {
    'basic:website:view': { name: '网站配置', icon: markRaw(Monitor) },
    'basic:system:view': { name: '系统配置', icon: markRaw(Setting) },
    'basic:dictionary:view': { name: '数据字典', icon: markRaw(Collection) },
    'basic:file:view': { name: '文件管理', icon: markRaw(Folder) },
    'basic:notification:view': { name: '通知配置', icon: markRaw(Bell) },
    'basic:security:view': { name: '安全设置', icon: markRaw(Lock) }
  }
  
  const treeData = []
  
  // 按模块分组
  const groups = {}
  permissions.value.forEach(permission => {
    if (!groups[permission.module]) {
      groups[permission.module] = []
    }
    groups[permission.module].push(permission)
  })
  
  // 构建树形结构
  Object.keys(groups).forEach(module => {
    const modulePermissions = groups[module]
    const moduleNode = {
      id: module,
      label: moduleNames[module] || module,
      icon: moduleIcons[module],
      children: []
    }
    
    // 基础配置模块需要特殊处理，添加子模块
    if (module === 'basic') {
      // 添加基础配置主权限
      const basicMainPermission = modulePermissions.find(p => p.id === 'basic:view')
      if (basicMainPermission) {
        moduleNode.children.push({
          id: basicMainPermission.id,
          label: basicMainPermission.name,
          description: basicMainPermission.description,
          isPermission: true
        })
      }
      
      // 添加子模块
      const subModules = {}
      modulePermissions.forEach(permission => {
        if (permission.id !== 'basic:view') {
          const subModuleKey = permission.id.split(':')[1] // 获取子模块名
          if (!subModules[subModuleKey]) {
            subModules[subModuleKey] = {
              name: basicSubModules[permission.id]?.name || subModuleKey,
              icon: basicSubModules[permission.id]?.icon,
              permissions: []
            }
          }
          subModules[subModuleKey].permissions.push(permission)
        }
      })
      
      // 构建子模块节点
      Object.keys(subModules).forEach(subModuleKey => {
        const subModule = subModules[subModuleKey]
        const subModuleNode = {
          id: `basic:${subModuleKey}`,
          label: subModule.name,
          icon: subModule.icon,
          children: subModule.permissions.map(permission => ({
            id: permission.id,
            label: permission.name,
            description: permission.description,
            isPermission: true
          }))
        }
        moduleNode.children.push(subModuleNode)
      })
    } else {
      // 其他模块直接添加权限
      moduleNode.children = modulePermissions.map(permission => ({
        id: permission.id,
        label: permission.name,
        description: permission.description,
        isPermission: true
      }))
    }
    
    treeData.push(moduleNode)
  })
  
  return treeData
})

// 权限检查
const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

// 方法
const loadRoles = async () => {
  try {
    roleLoading.value = true
    const response = await roleService.getRoleList()
    if (response.code === 200) {
      roles.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载角色列表失败')
  } finally {
    roleLoading.value = false
  }
}

const loadPermissions = async () => {
  try {
    permissionLoading.value = true
    const response = await permissionService.getPermissionList()
    if (response.code === 200) {
      permissions.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载权限列表失败')
  } finally {
    permissionLoading.value = false
  }
}

const handleAddRole = () => {
  roleDialogTitle.value = '新增角色'
  isEditRole.value = false
  roleForm.value = {
    id: '',
    name: '',
    description: '',
    permissions: []
  }
  roleDialogVisible.value = true
}

const handleEditRole = (row) => {
  roleDialogTitle.value = '编辑角色'
  isEditRole.value = true
  roleForm.value = { ...row }
  roleDialogVisible.value = true
}

const handleDeleteRole = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await roleService.deleteRole(row.id)
    if (response.code === 200) {
      ElMessage.success(response.message)
      loadRoles()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleRoleSubmit = async () => {
  if (!roleFormRef.value) return
  
  try {
    const valid = await roleFormRef.value.validate()
    if (!valid) return
    
    roleSubmitting.value = true
    
    let response
    if (isEditRole.value) {
      response = await roleService.updateRole(roleForm.value.id, roleForm.value)
    } else {
      response = await roleService.createRole(roleForm.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(response.message)
      roleDialogVisible.value = false
      loadRoles()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    roleSubmitting.value = false
  }
}

const handleRoleDialogClose = () => {
  roleFormRef.value?.resetFields()
}

const handleSavePermissions = async () => {
  try {
    saving.value = true
    
    // 更新角色的权限配置
    const response = await roleService.updateRole(selectedRole.value.id, {
      ...selectedRole.value,
      permissions: selectedPermissions.value
    })
    
    if (response.code === 200) {
      ElMessage.success('权限配置保存成功')
      selectedRole.value = null
      selectedPermissions.value = []
      loadRoles() // 重新加载角色列表
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const handleCancelPermissions = () => {
  selectedRole.value = null
  selectedPermissions.value = []
}

// 监听角色选择
const selectRole = (role) => {
  selectedRole.value = role
  selectedPermissions.value = [...role.permissions]
  
  // 设置树形组件的选中状态
  if (permissionTreeRef.value) {
    // 延迟设置，确保树形数据已加载
    setTimeout(() => {
      permissionTreeRef.value.setCheckedKeys(selectedPermissions.value, false)
    }, 100)
  }
}

// 树形组件选中变化事件
const handleTreeCheck = (data, checked) => {
  // 获取所有选中的叶子节点（实际权限）
  const checkedNodes = permissionTreeRef.value.getCheckedNodes(false, true)
  selectedPermissions.value = checkedNodes
    .filter(node => node.isPermission)
    .map(node => node.id)
}

onMounted(() => {
  loadRoles()
  loadPermissions()
})
</script>

<style scoped>
.permission-management {
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

.role-card,
.permission-card {
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.role-permission-card {
  border-radius: 8px;
  margin-top: 20px;
}

.permission-config {
  padding: 10px 0;
}

.permission-tree-container {
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  background-color: #fafafa;
}

.permission-tree {
  background-color: transparent;
}

.permission-tree :deep(.el-tree-node__content) {
  height: 36px;
  padding: 4px 0;
}

.permission-tree :deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 4px 8px;
}

.node-icon {
  font-size: 16px;
  color: #409eff;
}

.node-label {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.node-description {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.permission-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .permission-groups {
    grid-template-columns: 1fr;
  }
  
  .permission-actions {
    flex-direction: column;
  }
}
</style>

