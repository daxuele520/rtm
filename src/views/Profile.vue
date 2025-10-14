<template>
  <div class="profile">
    <div class="page-header">
      <h2>个人中心</h2>
      <p>管理个人信息和账户设置</p>
    </div>

    <el-row :gutter="20">
      <!-- 个人信息 -->
      <el-col :xs="24" :lg="8">
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button
                v-if="hasPermission('profile:edit')"
                type="primary"
                size="small"
                :icon="Edit"
                @click="handleEditProfile"
              >
                编辑
              </el-button>
            </div>
          </template>
          
          <div class="profile-info">
            <div class="avatar-section">
              <el-avatar :src="userInfo.avatar" :size="100" />
              <div class="avatar-actions" v-if="hasPermission('profile:edit')">
                <el-button type="text" size="small" @click="handleChangeAvatar">
                  更换头像
                </el-button>
              </div>
            </div>
            
            <div class="user-details">
              <h3>{{ userInfo.name }}</h3>
              <p><strong>用户名：</strong>{{ userInfo.username }}</p>
              <p><strong>邮箱：</strong>{{ userInfo.email }}</p>
              <p><strong>角色：</strong>
                <el-tag
                  v-for="role in userRoles"
                  :key="role"
                  type="primary"
                  size="small"
                  class="role-tag"
                >
                  {{ roleList[role] }}
                </el-tag>
              </p>
              <p><strong>状态：</strong>
                <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'">
                  {{ userInfo.status === 'active' ? '正常' : '禁用' }}
                </el-tag>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 权限信息 -->
      <el-col :xs="24" :lg="16">
        <el-card class="permissions-card">
          <template #header>
            <div class="card-header">
              <span>权限信息</span>
            </div>
          </template>
          
          <div class="permissions-content">
            <div class="permission-groups">
              <div
                v-for="(group, module) in permissionGroups"
                :key="module"
                class="permission-group"
              >
                <h4>{{ module }}模块</h4>
                <div class="permission-items">
                  <el-tag
                    v-for="permission in group"
                    :key="permission.id"
                    :type="permission.id === '*' ? 'danger' : 'success'"
                    size="small"
                    class="permission-tag"
                  >
                    {{ permissionList[permission.id] || permission.name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码 -->
    <el-card class="password-card" v-if="hasPermission('profile:edit')">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        style="max-width: 500px;"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
            修改密码
          </el-button>
          <el-button @click="handleResetPasswordForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 编辑个人信息对话框 -->
    <el-dialog
      v-model="profileDialogVisible"
      title="编辑个人信息"
      width="500px"
      @close="handleProfileDialogClose"
    >
      <el-form
        ref="profileFormRef"
        :model="profileForm"
        :rules="profileRules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="profileForm.name" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProfileSubmit" :loading="profileSubmitting">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

const authStore = useAuthStore()

// 响应式数据
const profileDialogVisible = ref(false)
const profileSubmitting = ref(false)
const changingPassword = ref(false)
const profileFormRef = ref()
const passwordFormRef = ref()

// 个人信息表单
const profileForm = ref({
  name: '',
  email: ''
})

// 密码修改表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const profileRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const userInfo = computed(() => authStore.userInfo || {})
const userRoles = computed(() => authStore.userRoles || [])
const userPermissions = computed(() => authStore.userPermissions || [])
const roleList = computed(() => authStore.roleList || {})
const permissionList = computed(() => authStore.permissionList || {})

const permissionGroups = computed(() => {
  const groups = {}
  userPermissions.value.forEach(permissionId => {
    const permission = Object.keys(permissionList.value).find(key => key === permissionId)
    if (permission) {
      const module = permission.split(':')[0]
      if (!groups[module]) {
        groups[module] = []
      }
      groups[module].push({
        id: permissionId,
        name: permissionList.value[permissionId]
      })
    }
  })
  return groups
})

// 权限检查
const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

// 方法
const handleEditProfile = () => {
  profileForm.value = {
    name: userInfo.value.name || '',
    email: userInfo.value.email || ''
  }
  profileDialogVisible.value = true
}

const handleChangeAvatar = () => {
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 检查文件大小（限制为2MB）
      if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过2MB')
        return
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return
      }
      
      // 创建FileReader读取文件
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAvatar = e.target.result
        // 更新用户头像
        authStore.updateUserInfo({ avatar: newAvatar })
        ElMessage.success('头像更新成功')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const handleProfileSubmit = async () => {
  if (!profileFormRef.value) return
  
  try {
    const valid = await profileFormRef.value.validate()
    if (!valid) return
    
    profileSubmitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户信息
    authStore.updateUserInfo(profileForm.value)
    
    ElMessage.success('个人信息更新成功')
    profileDialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    profileSubmitting.value = false
  }
}

const handleProfileDialogClose = () => {
  profileFormRef.value?.resetFields()
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    const valid = await passwordFormRef.value.validate()
    if (!valid) return
    
    // 验证当前密码
    const currentUser = authStore.userInfo
    if (passwordForm.value.currentPassword !== '123456') { // 模拟验证，实际项目中应该调用API
      ElMessage.error('当前密码不正确')
      return
    }
    
    changingPassword.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    handleResetPasswordForm()
  } catch (error) {
    ElMessage.error('密码修改失败')
  } finally {
    changingPassword.value = false
  }
}

const handleResetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordFormRef.value?.resetFields()
}

onMounted(() => {
  // 页面加载完成
})
</script>

<style scoped>
.profile {
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

.profile-card,
.permissions-card,
.password-card {
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

.profile-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.avatar-section {
  text-align: center;
}

.avatar-actions {
  margin-top: 12px;
}

.user-details h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.user-details p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

.role-tag {
  margin-left: 8px;
}

.permissions-content {
  max-height: 400px;
  overflow-y: auto;
}

.permission-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.permission-group h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.permission-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-tag {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .permission-groups {
    grid-template-columns: 1fr;
  }
}
</style>

