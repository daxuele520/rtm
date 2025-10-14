<template>
  <div class="table-management">
    <div class="page-header">
      <h2>表格管理</h2>
      <p>管理系统表格，支持各种表格操作功能</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-icon">
              <el-icon><Grid /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalTables }}</div>
              <div class="stat-label">总表格数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.activeTables }}</div>
              <div class="stat-label">启用表格</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon size-icon">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalSize }}</div>
              <div class="stat-label">总大小</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon category-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalCategories }}</div>
              <div class="stat-label">分类数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <el-button
            type="primary"
            :icon="Plus"
            @click="handleAdd"
          >
            新增表格
          </el-button>
          <el-button
            type="success"
            :icon="Download"
            @click="handleExport"
            :loading="exporting"
          >
            导出数据
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="!selectedTables.length"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button
            type="info"
            :icon="Refresh"
            @click="handleRefresh"
          >
            刷新
          </el-button>
        </div>
        
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索表格名称或描述"
            :prefix-icon="Search"
            clearable
            style="width: 250px; margin-right: 10px;"
            @input="handleSearch"
          />
          <el-select
            v-model="filterStatus"
            placeholder="状态筛选"
            clearable
            style="width: 120px; margin-right: 10px;"
            @change="handleFilter"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
          <el-select
            v-model="filterCategory"
            placeholder="分类筛选"
            clearable
            style="width: 150px;"
            @change="handleFilter"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- 表格列表 -->
    <el-card class="table-card">
      <el-table
        :data="tableList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        stripe
        border
        height="600"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="80" sortable="custom" />
        
        <el-table-column prop="name" label="表格名称" min-width="150" sortable="custom">
          <template #default="{ row }">
            <div class="table-name">
              <el-icon class="table-icon"><Grid /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="small">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="columns" label="列数" width="80" sortable="custom" />
        
        <el-table-column prop="rows" label="行数" width="100" sortable="custom" />
        
        <el-table-column prop="size" label="大小" width="100" sortable="custom" />
        
        <el-table-column prop="createTime" label="创建时间" width="160" sortable="custom" />
        
        <el-table-column prop="updateTime" label="更新时间" width="160" sortable="custom" />
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              type="warning"
              size="small"
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              :type="row.status === 'active' ? 'danger' : 'success'"
              size="small"
              :icon="row.status === 'active' ? 'Lock' : 'Unlock'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button
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
          :total="totalTables"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 表格表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="tableFormRef"
        :model="tableForm"
        :rules="tableRules"
        label-width="100px"
      >
        <el-form-item label="表格名称" prop="name">
          <el-input v-model="tableForm.name" placeholder="请输入表格名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="tableForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入表格描述"
          />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="tableForm.category" placeholder="请选择分类" style="width: 100%;">
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="tableForm.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="列数" prop="columns">
          <el-input-number
            v-model="tableForm.columns"
            :min="1"
            :max="100"
            placeholder="列数"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="行数" prop="rows">
          <el-input-number
            v-model="tableForm.rows"
            :min="0"
            :max="1000000"
            placeholder="行数"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="大小" prop="size">
          <el-input v-model="tableForm.size" placeholder="如：2.5MB" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 表格详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="表格详情"
      width="800px"
    >
      <div v-if="selectedTable" class="table-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="表格名称">
            {{ selectedTable.name }}
          </el-descriptions-item>
          <el-descriptions-item label="分类">
            <el-tag :type="getCategoryType(selectedTable.category)">
              {{ selectedTable.category }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedTable.status === 'active' ? 'success' : 'danger'">
              {{ selectedTable.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="列数">
            {{ selectedTable.columns }}
          </el-descriptions-item>
          <el-descriptions-item label="行数">
            {{ selectedTable.rows }}
          </el-descriptions-item>
          <el-descriptions-item label="大小">
            {{ selectedTable.size }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ selectedTable.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ selectedTable.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ selectedTable.description }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { tableService } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Grid, Check, FolderOpened, Collection, 
  Plus, Download, Delete, Refresh, Search, 
  View, Edit, Lock, Unlock 
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const exporting = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const selectedTables = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalTables = ref(0)
const tableList = ref([])
const sortBy = ref('')
const sortOrder = ref('')

// 对话框相关
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const submitting = ref(false)
const tableFormRef = ref()
const selectedTable = ref(null)

// 表格表单
const tableForm = ref({
  id: null,
  name: '',
  description: '',
  category: '',
  status: 'active',
  columns: 1,
  rows: 0,
  size: ''
})

// 表单验证规则
const tableRules = {
  name: [
    { required: true, message: '请输入表格名称', trigger: 'blur' },
    { min: 2, max: 50, message: '表格名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入表格描述', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  columns: [
    { required: true, message: '请输入列数', trigger: 'blur' }
  ],
  rows: [
    { required: true, message: '请输入行数', trigger: 'blur' }
  ],
  size: [
    { required: true, message: '请输入大小', trigger: 'blur' }
  ]
}

// 统计数据
const stats = ref({
  totalTables: 0,
  activeTables: 0,
  totalSize: '0MB',
  totalCategories: 0
})

// 分类列表
const categories = ref([
  '用户管理',
  '权限管理',
  '系统日志',
  '系统配置',
  '数据字典',
  '文件管理',
  '消息管理',
  '组织管理',
  '工作流',
  '数据备份'
])

// 计算属性
const filteredTableList = computed(() => {
  return tableList.value
})

// 方法
const loadTables = async () => {
  try {
    loading.value = true
    const response = await tableService.getTableList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value,
      status: filterStatus.value,
      category: filterCategory.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    })
    
    if (response.code === 200) {
      tableList.value = response.data.list
      totalTables.value = response.data.total
      updateStats()
    }
  } catch (error) {
    ElMessage.error('加载表格列表失败')
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  const allTables = tableList.value
  stats.value = {
    totalTables: allTables.length,
    activeTables: allTables.filter(t => t.status === 'active').length,
    totalSize: calculateTotalSize(allTables),
    totalCategories: new Set(allTables.map(t => t.category)).size
  }
}

const calculateTotalSize = (tables) => {
  let totalMB = 0
  tables.forEach(table => {
    const size = parseFloat(table.size)
    if (!isNaN(size)) {
      totalMB += size
    }
  })
  return totalMB.toFixed(1) + 'MB'
}

const getCategoryType = (category) => {
  const typeMap = {
    '用户管理': 'primary',
    '权限管理': 'success',
    '系统日志': 'warning',
    '系统配置': 'info',
    '数据字典': 'danger',
    '文件管理': 'primary',
    '消息管理': 'primary',
    '组织管理': 'success',
    '工作流': 'warning',
    '数据备份': 'info'
  }
  return typeMap[category] || 'info'
}

const handleAdd = () => {
  dialogTitle.value = '新增表格'
  isEdit.value = false
  tableForm.value = {
    id: null,
    name: '',
    description: '',
    category: '',
    status: 'active',
    columns: 1,
    rows: 0,
    size: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑表格'
  isEdit.value = true
  tableForm.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row) => {
  selectedTable.value = row
  detailDialogVisible.value = true
}

const handleToggleStatus = async (row) => {
  try {
    const action = row.status === 'active' ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}表格 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const newStatus = row.status === 'active' ? 'disabled' : 'active'
    const response = await tableService.updateTable(row.id, {
      ...row,
      status: newStatus
    })
    
    if (response.code === 200) {
      ElMessage.success(`表格${action}成功`)
      loadTables()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除表格 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await tableService.deleteTable(row.id)
    if (response.code === 200) {
      ElMessage.success(response.message)
      loadTables()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedTables.value.length} 个表格吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = selectedTables.value.map(table => table.id)
    const response = await tableService.batchDeleteTables(ids)
    if (response.code === 200) {
      ElMessage.success(response.message)
      selectedTables.value = []
      loadTables()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleExport = async () => {
  try {
    exporting.value = true
    const response = await tableService.exportTableData({
      keyword: searchKeyword.value,
      status: filterStatus.value,
      category: filterCategory.value
    })
    
    if (response.code === 200) {
      ElMessage.success('导出成功')
      // 这里可以实现实际的下载功能
      console.log('导出数据:', response.data)
    }
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

const handleRefresh = () => {
  loadTables()
}

const handleSearch = () => {
  currentPage.value = 1
  loadTables()
}

const handleFilter = () => {
  currentPage.value = 1
  loadTables()
}

const handleSelectionChange = (selection) => {
  selectedTables.value = selection
}

const handleSortChange = ({ prop, order }) => {
  sortBy.value = prop
  sortOrder.value = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
  loadTables()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadTables()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadTables()
}

const handleSubmit = async () => {
  if (!tableFormRef.value) return
  
  try {
    const valid = await tableFormRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    let response
    if (isEdit.value) {
      response = await tableService.updateTable(tableForm.value.id, tableForm.value)
    } else {
      response = await tableService.createTable(tableForm.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(response.message)
      dialogVisible.value = false
      loadTables()
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

const handleDialogClose = () => {
  tableFormRef.value?.resetFields()
}

onMounted(() => {
  loadTables()
})
</script>

<style scoped>
.table-management {
  max-width: 1400px;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.total-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.active-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.size-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.category-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
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

.table-name {
  display: flex;
  align-items: center;
}

.table-icon {
  margin-right: 8px;
  color: #409eff;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.table-detail {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .toolbar-right .el-input,
  .toolbar-right .el-select {
    width: 100% !important;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
}
</style>
