<template>
  <div class="login-log">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>登录日志</h2>
      <p>查看和管理用户登录记录</p>
    </div>

    <!-- 搜索工具栏 -->
    <el-card class="toolbar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="登录时间">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 380px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="toolbar-actions">
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-dropdown @command="handleClearCommand">
          <el-button type="warning">
            <el-icon><Delete /></el-icon>
            清空日志
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="7">清空7天前</el-dropdown-item>
              <el-dropdown-item command="30">清空30天前</el-dropdown-item>
              <el-dropdown-item command="90">清空90天前</el-dropdown-item>
              <el-dropdown-item command="all" divided>清空全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="loadLoginLogs">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </el-card>

    <!-- 登录日志表格 -->
    <el-card>
      <el-table
        :data="loginLogs"
        v-loading="loading"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="location" label="登录地点" width="180" show-overflow-tooltip />
        <el-table-column prop="browser" label="浏览器" width="150" show-overflow-tooltip />
        <el-table-column prop="os" label="操作系统" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="消息" width="120" show-overflow-tooltip />
        <el-table-column prop="loginTime" label="登录时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
              v-if="hasPermission('system:loginlog:delete')"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadLoginLogs"
          @current-change="loadLoginLogs"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { loginLogService } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, ArrowDown } from '@element-plus/icons-vue'

const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const loginLogs = ref([])
const selectedIds = ref([])

// 搜索表单
const searchForm = reactive({
  username: '',
  status: '',
  timeRange: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 权限检查
const hasPermission = (permission) => {
  return authStore.hasPermission(permission)
}

// 加载登录日志列表
const loadLoginLogs = async () => {
  try {
    loading.value = true
    
    const params = {
      page: pagination.page,
      size: pagination.size,
      username: searchForm.username,
      status: searchForm.status
    }
    
    // 处理时间范围
    if (searchForm.timeRange && searchForm.timeRange.length === 2) {
      params.startTime = searchForm.timeRange[0]
      params.endTime = searchForm.timeRange[1]
    }
    
    const response = await loginLogService.getLoginLogList(params)
    if (response.code === 200) {
      loginLogs.value = response.data.list
      pagination.total = response.data.total
    }
  } catch (error) {
    ElMessage.error('加载登录日志失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadLoginLogs()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.status = ''
  searchForm.timeRange = null
  pagination.page = 1
  loadLoginLogs()
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// 删除单条日志
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${row.username} 在 ${row.loginTime} 的登录记录吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await loginLogService.deleteLoginLog(row.id)
    if (response.code === 200) {
      ElMessage.success(response.message)
      loadLoginLogs()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条登录记录吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await loginLogService.batchDeleteLoginLogs(selectedIds.value)
    if (response.code === 200) {
      ElMessage.success(response.message)
      selectedIds.value = []
      loadLoginLogs()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 清空日志命令
const handleClearCommand = async (command) => {
  let message = ''
  let params = {}
  
  if (command === 'all') {
    message = '确定要清空所有登录日志吗？此操作不可恢复！'
  } else {
    const days = parseInt(command)
    message = `确定要清空 ${days} 天前的登录日志吗？此操作不可恢复！`
    params.days = days
  }
  
  try {
    await ElMessageBox.confirm(message, '清空确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await loginLogService.clearLoginLogs(params)
    if (response.code === 200) {
      ElMessage.success(response.message)
      loadLoginLogs()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败')
    }
  }
}

onMounted(() => {
  loadLoginLogs()
})
</script>

<style scoped>
.login-log {
  max-width: 1600px;
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

.toolbar :deep(.el-card__body) {
  padding: 20px;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

