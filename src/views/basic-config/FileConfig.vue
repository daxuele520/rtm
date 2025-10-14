<template>
  <div class="file-config">
    <el-card class="toolbar">
      <div class="toolbar-content">
        <div class="search-section">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索文件名"
            style="width: 300px; margin-right: 16px;"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="searchForm.fileType"
            placeholder="文件类型"
            style="width: 120px; margin-right: 16px;"
            clearable
            @change="handleSearch"
          >
            <el-option label="图片" value="image" />
            <el-option label="文档" value="document" />
            <el-option label="视频" value="video" />
            <el-option label="音频" value="audio" />
            <el-option label="其他" value="other" />
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
          <el-upload
            ref="uploadRef"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :show-file-list="false"
            multiple
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              上传文件
            </el-button>
          </el-upload>
          
          <el-button
            type="danger"
            :disabled="selectedFiles.length === 0"
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
        :data="files"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="文件名" min-width="200">
          <template #default="{ row }">
            <div class="file-name">
              <el-icon class="file-icon" :class="getFileIconClass(row.type)">
                <component :is="getFileIcon(row.type)" />
              </el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="文件类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getFileTypeTag(row.type)" size="small">
              {{ getFileTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="size" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="path" label="存储路径" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="uploader" label="上传者" width="120" />
        
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePreview(row)">
              <el-icon><View /></el-icon>
              预览
            </el-button>
            
            <el-button type="success" size="small" @click="handleDownload(row)">
              <el-icon><Download /></el-icon>
              下载
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

    <!-- 文件预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      :title="`预览 - ${previewFile.name}`"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="preview-content">
        <div v-if="isImage(previewFile.type)" class="image-preview">
          <el-image
            :src="previewFile.url"
            :preview-src-list="[previewFile.url]"
            fit="contain"
            style="width: 100%; height: 500px;"
          />
        </div>
        
        <div v-else-if="isVideo(previewFile.type)" class="video-preview">
          <video
            :src="previewFile.url"
            controls
            style="width: 100%; height: 500px;"
          />
        </div>
        
        <div v-else-if="isAudio(previewFile.type)" class="audio-preview">
          <audio
            :src="previewFile.url"
            controls
            style="width: 100%;"
          />
        </div>
        
        <div v-else class="file-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="文件名">
              {{ previewFile.name }}
            </el-descriptions-item>
            <el-descriptions-item label="文件类型">
              {{ getFileTypeName(previewFile.type) }}
            </el-descriptions-item>
            <el-descriptions-item label="文件大小">
              {{ formatFileSize(previewFile.size) }}
            </el-descriptions-item>
            <el-descriptions-item label="上传时间">
              {{ previewFile.uploadTime }}
            </el-descriptions-item>
            <el-descriptions-item label="存储路径">
              {{ previewFile.path }}
            </el-descriptions-item>
            <el-descriptions-item label="上传者">
              {{ previewFile.uploader }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Upload,
  Delete,
  View,
  Download,
  Picture,
  Document,
  VideoPlay,
  Microphone,
  Files
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const files = ref([])
const selectedFiles = ref([])
const previewVisible = ref(false)
const previewFile = ref({})
const uploadRef = ref()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  fileType: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 上传配置
const uploadUrl = ref('/api/upload')
const uploadHeaders = ref({
  'Authorization': 'Bearer ' + localStorage.getItem('token')
})

// 模拟数据
const mockFiles = [
  {
    id: 1,
    name: 'logo.png',
    type: 'image',
    size: 102400,
    path: '/uploads/images/logo.png',
    url: 'https://via.placeholder.com/300x200',
    uploader: 'admin',
    uploadTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '用户手册.pdf',
    type: 'document',
    size: 2048000,
    path: '/uploads/documents/用户手册.pdf',
    url: '/uploads/documents/用户手册.pdf',
    uploader: 'admin',
    uploadTime: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    name: '演示视频.mp4',
    type: 'video',
    size: 15728640,
    path: '/uploads/videos/演示视频.mp4',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: 'admin',
    uploadTime: '2024-01-14 16:45:00'
  },
  {
    id: 4,
    name: '背景音乐.mp3',
    type: 'audio',
    size: 5120000,
    path: '/uploads/audio/背景音乐.mp3',
    url: '/uploads/audio/背景音乐.mp3',
    uploader: 'admin',
    uploadTime: '2024-01-14 14:20:00'
  },
  {
    id: 5,
    name: '系统配置.json',
    type: 'other',
    size: 2048,
    path: '/uploads/others/系统配置.json',
    url: '/uploads/others/系统配置.json',
    uploader: 'admin',
    uploadTime: '2024-01-14 11:30:00'
  }
]

// 获取文件列表
const getFileList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filteredFiles = [...mockFiles]
    
    // 关键词搜索
    if (searchForm.keyword) {
      filteredFiles = filteredFiles.filter(file => 
        file.name.includes(searchForm.keyword)
      )
    }
    
    // 文件类型筛选
    if (searchForm.fileType) {
      filteredFiles = filteredFiles.filter(file => file.type === searchForm.fileType)
    }
    
    files.value = filteredFiles
    pagination.total = filteredFiles.length
  } catch (error) {
    ElMessage.error('获取文件列表失败')
    console.error('获取文件列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getFileList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    fileType: ''
  })
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  getFileList()
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  getFileList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  getFileList()
}

// 选择处理
const handleSelectionChange = (selection) => {
  selectedFiles.value = selection
}

// 上传前检查
const beforeUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4', 'audio/mp3'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('不支持的文件类型!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

// 上传成功
const handleUploadSuccess = (response, file) => {
  ElMessage.success('文件上传成功')
  getFileList()
}

// 上传失败
const handleUploadError = (error) => {
  ElMessage.error('文件上传失败')
  console.error('上传失败:', error)
}

// 预览文件
const handlePreview = (row) => {
  previewFile.value = row
  previewVisible.value = true
}

// 下载文件
const handleDownload = (row) => {
  const link = document.createElement('a')
  link.href = row.url
  link.download = row.name
  link.click()
  ElMessage.success('开始下载')
}

// 删除文件
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('删除成功')
    getFileList()
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
      `确定要删除选中的${selectedFiles.value.length}个文件吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('批量删除成功')
    getFileList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 获取文件图标
const getFileIcon = (type) => {
  const iconMap = {
    image: Picture,
    document: Document,
    video: VideoPlay,
    audio: Microphone,
    other: Files
  }
  return iconMap[type] || Files
}

// 获取文件图标样式类
const getFileIconClass = (type) => {
  const classMap = {
    image: 'file-icon-image',
    document: 'file-icon-document',
    video: 'file-icon-video',
    audio: 'file-icon-audio',
    other: 'file-icon-other'
  }
  return classMap[type] || 'file-icon-other'
}

// 获取文件类型标签
const getFileTypeTag = (type) => {
  const tagMap = {
    image: 'success',
    document: 'primary',
    video: 'warning',
    audio: 'info',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取文件类型名称
const getFileTypeName = (type) => {
  const nameMap = {
    image: '图片',
    document: '文档',
    video: '视频',
    audio: '音频',
    other: '其他'
  }
  return nameMap[type] || '其他'
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 判断是否为图片
const isImage = (type) => {
  return type === 'image'
}

// 判断是否为视频
const isVideo = (type) => {
  return type === 'video'
}

// 判断是否为音频
const isAudio = (type) => {
  return type === 'audio'
}

// 初始化
onMounted(() => {
  getFileList()
})
</script>

<style scoped>
.file-config {
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

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-size: 16px;
}

.file-icon-image {
  color: #67c23a;
}

.file-icon-document {
  color: #409eff;
}

.file-icon-video {
  color: #e6a23c;
}

.file-icon-audio {
  color: #f56c6c;
}

.file-icon-other {
  color: #909399;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.preview-content {
  text-align: center;
}

.image-preview,
.video-preview,
.audio-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-info {
  text-align: left;
}
</style>
