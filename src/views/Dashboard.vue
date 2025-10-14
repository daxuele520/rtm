<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>控制台</h2>
      <p>欢迎使用RBAC权限管理系统</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon role-icon">
              <el-icon><Key /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalRoles }}</div>
              <div class="stat-label">角色数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon permission-icon">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalPermissions }}</div>
              <div class="stat-label">权限数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon online-icon">
              <el-icon><Connection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.onlineUsers }}</div>
              <div class="stat-label">在线用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户权限信息 -->
    <el-row :gutter="20" class="info-row">
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>当前用户信息</span>
            </div>
          </template>
          <div class="user-info">
            <div class="user-avatar">
              <el-avatar :src="userInfo.avatar" :size="60" />
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
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>权限列表</span>
            </div>
          </template>
          <div class="permissions-list">
            <el-tag
              v-for="permission in userPermissions"
              :key="permission"
              :type="permission === '*' ? 'danger' : 'success'"
              size="small"
              class="permission-tag"
            >
              {{ permissionList[permission] || permission }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-card class="quick-actions">
      <template #header>
        <div class="card-header">
          <span>快速操作</span>
        </div>
      </template>
      <div class="actions-grid">
        <el-button
          v-if="hasPermission('user:view')"
          type="primary"
          :icon="User"
          @click="$router.push('/user-management')"
        >
          用户管理
        </el-button>
        <el-button
          v-if="hasPermission('permission:view')"
          type="success"
          :icon="Key"
          @click="$router.push('/permission-management')"
        >
          权限管理
        </el-button>
        <el-button
          v-if="hasPermission('profile:view')"
          type="info"
          :icon="UserFilled"
          @click="$router.push('/profile')"
        >
          个人中心
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { statsService } from '@/api'
import { User, Key, UserFilled, Lock, Connection } from '@element-plus/icons-vue'

const authStore = useAuthStore()

// 统计数据
const stats = ref({
  totalUsers: 0,
  totalRoles: 0,
  totalPermissions: 0,
  onlineUsers: 0
})

// 用户信息
const userInfo = computed(() => authStore.userInfo || {})
const userRoles = computed(() => authStore.userRoles || [])
const userPermissions = computed(() => authStore.userPermissions || [])
const roleList = computed(() => authStore.roleList || {})
const permissionList = computed(() => authStore.permissionList || {})

// 权限检查方法
const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await statsService.getStats()
    if (response.code === 200) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.dashboard-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.role-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.permission-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.online-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.info-row {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 20px;
}

.user-details h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 18px;
}

.user-details p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

.role-tag {
  margin-left: 8px;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-tag {
  margin: 0;
}

.quick-actions {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.actions-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .user-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .actions-grid {
    justify-content: center;
  }
}
</style>