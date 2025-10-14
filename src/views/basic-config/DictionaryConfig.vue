<template>
  <div class="dictionary-config">
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="search-section">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索字典名称或编码"
            style="width: 300px; margin-right: 16px;"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="searchForm.status"
            placeholder="状态"
            style="width: 120px; margin-right: 16px;"
            clearable
            @change="handleSearch"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
          
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
        
        <div class="action-section">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增字典
          </el-button>
          
          <el-button
            type="danger"
            :disabled="selectedDictionaries.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
          
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="dictionaries"
        @selection-change="handleSelectionChange"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="字典名称" min-width="150" />
        
        <el-table-column prop="code" label="字典编码" min-width="120" />
        
        <el-table-column prop="value" label="字典值" min-width="120" />
        
        <el-table-column prop="sort" label="排序" width="80" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            
            <el-button type="warning" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 字典表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dictionaryFormRef"
        :model="dictionaryForm"
        :rules="dictionaryFormRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="dictionaryForm.name" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="字典编码" prop="code">
              <el-input v-model="dictionaryForm.code" placeholder="请输入字典编码" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典值" prop="value">
              <el-input v-model="dictionaryForm.value" placeholder="请输入字典值" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="父级字典" prop="parentId">
              <el-select v-model="dictionaryForm.parentId" placeholder="请选择父级字典" style="width: 100%;">
                <el-option label="无父级" :value="null" />
                <el-option
                  v-for="parent in parentDictionaryOptions"
                  :key="parent.value"
                  :label="parent.label"
                  :value="parent.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="dictionaryForm.sort" :min="1" :max="999" style="width: 100%;" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="dictionaryForm.status" placeholder="请选择状态" style="width: 100%;">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="dictionaryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入字典描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode === 'view'" type="primary" @click="dialogVisible = false">
            确定
          </el-button>
          <el-button v-else type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  View,
  Edit
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const dictionaries = ref([])
const selectedDictionaries = ref([])
const parentDictionaryOptions = ref([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogMode = ref('create') // create, edit, view
const isEdit = computed(() => dialogMode.value === 'edit')

// 字典表单
const dictionaryFormRef = ref()
const dictionaryForm = reactive({
  name: '',
  code: '',
  value: '',
  parentId: null,
  sort: 1,
  status: 'active',
  description: ''
})

// 表单验证规则
const dictionaryFormRules = {
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入字典编码', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入字典值', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 模拟数据
const mockDictionaries = [
  {
    id: 1,
    name: '用户状态',
    code: 'user_status',
    value: '',
    parentId: null,
    sort: 1,
    status: 'active',
    description: '用户状态字典',
    updatedAt: '2024-01-15 10:30:00',
    children: [
      {
        id: 2,
        name: '正常',
        code: 'user_status',
        value: 'active',
        parentId: 1,
        sort: 1,
        status: 'active',
        description: '正常状态',
        updatedAt: '2024-01-15 10:30:00'
      },
      {
        id: 3,
        name: '禁用',
        code: 'user_status',
        value: 'inactive',
        parentId: 1,
        sort: 2,
        status: 'active',
        description: '禁用状态',
        updatedAt: '2024-01-15 10:30:00'
      }
    ]
  },
  {
    id: 4,
    name: '性别',
    code: 'gender',
    value: '',
    parentId: null,
    sort: 2,
    status: 'active',
    description: '性别字典',
    updatedAt: '2024-01-15 10:30:00',
    children: [
      {
        id: 5,
        name: '男',
        code: 'gender',
        value: 'male',
        parentId: 4,
        sort: 1,
        status: 'active',
        description: '男性',
        updatedAt: '2024-01-15 10:30:00'
      },
      {
        id: 6,
        name: '女',
        code: 'gender',
        value: 'female',
        parentId: 4,
        sort: 2,
        status: 'active',
        description: '女性',
        updatedAt: '2024-01-15 10:30:00'
      }
    ]
  },
  {
    id: 7,
    name: '菜单类型',
    code: 'menu_type',
    value: '',
    parentId: null,
    sort: 3,
    status: 'active',
    description: '菜单类型字典',
    updatedAt: '2024-01-15 10:30:00',
    children: [
      {
        id: 8,
        name: '菜单',
        code: 'menu_type',
        value: 'menu',
        parentId: 7,
        sort: 1,
        status: 'active',
        description: '菜单类型',
        updatedAt: '2024-01-15 10:30:00'
      },
      {
        id: 9,
        name: '按钮',
        code: 'menu_type',
        value: 'button',
        parentId: 7,
        sort: 2,
        status: 'active',
        description: '按钮类型',
        updatedAt: '2024-01-15 10:30:00'
      }
    ]
  }
]

// 获取字典列表
const getDictionaryList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filteredDictionaries = [...mockDictionaries]
    
    // 关键词搜索
    if (searchForm.keyword) {
      filteredDictionaries = filteredDictionaries.filter(dict => 
        dict.name.includes(searchForm.keyword) || 
        dict.code.includes(searchForm.keyword)
      )
    }
    
    // 状态筛选
    if (searchForm.status) {
      filteredDictionaries = filteredDictionaries.filter(dict => dict.status === searchForm.status)
    }
    
    dictionaries.value = filteredDictionaries
    pagination.total = filteredDictionaries.length
  } catch (error) {
    ElMessage.error('获取字典列表失败')
    console.error('获取字典列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取父级字典选项
const getParentDictionaryOptions = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const parentDictionaries = mockDictionaries.filter(dict => dict.parentId === null)
    parentDictionaryOptions.value = parentDictionaries.map(dict => ({
      value: dict.id,
      label: dict.name
    }))
  } catch (error) {
    console.error('获取父级字典选项失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getDictionaryList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: ''
  })
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  getDictionaryList()
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  getDictionaryList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  getDictionaryList()
}

// 选择处理
const handleSelectionChange = (selection) => {
  selectedDictionaries.value = selection
}

// 新增字典
const handleAdd = () => {
  dialogTitle.value = '新增字典'
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 查看字典
const handleView = (row) => {
  dialogTitle.value = '查看字典'
  dialogMode.value = 'view'
  Object.assign(dictionaryForm, row)
  dialogVisible.value = true
}

// 编辑字典
const handleEdit = (row) => {
  dialogTitle.value = '编辑字典'
  dialogMode.value = 'edit'
  Object.assign(dictionaryForm, row)
  dialogVisible.value = true
}

// 删除字典
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('删除成功')
    getDictionaryList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${selectedDictionaries.value.length}个字典吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('批量删除成功')
    getDictionaryList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!dictionaryFormRef.value) return
  
  try {
    await dictionaryFormRef.value.validate()
    submitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    getDictionaryList()
  } catch (error) {
    if (error !== false) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      console.error('提交失败:', error)
    }
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(dictionaryForm, {
    name: '',
    code: '',
    value: '',
    parentId: null,
    sort: 1,
    status: 'active',
    description: ''
  })
  
  if (dictionaryFormRef.value) {
    dictionaryFormRef.value.resetFields()
  }
}

// 初始化
onMounted(() => {
  getDictionaryList()
  getParentDictionaryOptions()
})
</script>

<style scoped>
.dictionary-config {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section {
  display: flex;
  align-items: center;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-card {
  min-height: 600px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  text-align: right;
}
</style>
