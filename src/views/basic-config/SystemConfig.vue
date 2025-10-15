<template>
  <div class="system-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>系统基础配置</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            <el-icon><Check /></el-icon>
            保存配置
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="systemFormRef"
        :model="systemForm"
        :rules="systemFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="systemForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="系统版本" prop="systemVersion">
              <el-input v-model="systemForm.systemVersion" placeholder="请输入系统版本" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="时区设置" prop="timezone">
              <el-select v-model="systemForm.timezone" placeholder="请选择时区" style="width: 100%;">
                <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai" />
                <el-option label="东京时间 (UTC+9)" value="Asia/Tokyo" />
                <el-option label="纽约时间 (UTC-5)" value="America/New_York" />
                <el-option label="伦敦时间 (UTC+0)" value="Europe/London" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="日期格式" prop="dateFormat">
              <el-select v-model="systemForm.dateFormat" placeholder="请选择日期格式" style="width: 100%;">
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
                <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
                <el-option label="YYYY年MM月DD日" value="YYYY年MM月DD日" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="时间格式" prop="timeFormat">
              <el-select v-model="systemForm.timeFormat" placeholder="请选择时间格式" style="width: 100%;">
                <el-option label="24小时制" value="24" />
                <el-option label="12小时制" value="12" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="语言设置" prop="language">
              <el-select v-model="systemForm.language" placeholder="请选择语言" style="width: 100%;">
                <el-option label="中文简体" value="zh-CN" />
                <el-option label="中文繁体" value="zh-TW" />
                <el-option label="English" value="en-US" />
                <el-option label="日本語" value="ja-JP" />
                <el-option label="한국어" value="ko-KR" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="每页显示条数" prop="pageSize">
              <el-input-number v-model="systemForm.pageSize" :min="10" :max="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="会话超时时间" prop="sessionTimeout">
              <el-input-number v-model="systemForm.sessionTimeout" :min="30" :max="1440" style="width: 100%;" />
              <span class="form-tip">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="系统维护模式" prop="maintenanceMode">
          <el-switch v-model="systemForm.maintenanceMode" />
          <span class="form-tip">开启后只有管理员可以访问系统</span>
        </el-form-item>
        
        <el-form-item v-if="systemForm.maintenanceMode" label="维护提示信息" prop="maintenanceMessage">
          <el-input
            v-model="systemForm.maintenanceMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入维护提示信息"
          />
        </el-form-item>
        
        <el-form-item label="启用注册功能" prop="enableRegister">
          <el-switch v-model="systemForm.enableRegister" />
        </el-form-item>
        
        <el-form-item label="启用验证码" prop="enableCaptcha">
          <el-switch v-model="systemForm.enableCaptcha" />
        </el-form-item>
        
        <el-form-item label="启用双因子认证" prop="enable2FA">
          <el-switch v-model="systemForm.enable2FA" />
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>日志配置</span>
      </template>
      
      <el-form
        ref="logFormRef"
        :model="logForm"
        :rules="logFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="日志级别" prop="logLevel">
              <el-select v-model="logForm.logLevel" placeholder="请选择日志级别" style="width: 100%;">
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARN" value="warn" />
                <el-option label="ERROR" value="error" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="日志保留天数" prop="logRetentionDays">
              <el-input-number v-model="logForm.logRetentionDays" :min="1" :max="365" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="启用操作日志" prop="enableOperationLog">
          <el-switch v-model="logForm.enableOperationLog" />
        </el-form-item>
        
        <el-form-item label="启用登录日志" prop="enableLoginLog">
          <el-switch v-model="logForm.enableLoginLog" />
        </el-form-item>
        
        <el-form-item label="启用错误日志" prop="enableErrorLog">
          <el-switch v-model="logForm.enableErrorLog" />
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>性能配置</span>
      </template>
      
      <el-form
        ref="performanceFormRef"
        :model="performanceForm"
        :rules="performanceFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="缓存类型" prop="cacheType">
              <el-select v-model="performanceForm.cacheType" placeholder="请选择缓存类型" style="width: 100%;">
                <el-option label="内存缓存" value="memory" />
                <el-option label="Redis缓存" value="redis" />
                <el-option label="文件缓存" value="file" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="缓存过期时间" prop="cacheExpireTime">
              <el-input-number v-model="performanceForm.cacheExpireTime" :min="60" :max="86400" style="width: 100%;" />
              <span class="form-tip">秒</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="最大上传大小" prop="maxUploadSize">
              <el-input-number v-model="performanceForm.maxUploadSize" :min="1" :max="1024" style="width: 100%;" />
              <span class="form-tip">MB</span>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="最大并发连接数" prop="maxConnections">
              <el-input-number v-model="performanceForm.maxConnections" :min="100" :max="10000" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="启用Gzip压缩" prop="enableGzip">
          <el-switch v-model="performanceForm.enableGzip" />
        </el-form-item>
        
        <el-form-item label="启用CDN加速" prop="enableCDN">
          <el-switch v-model="performanceForm.enableCDN" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { systemConfigService } from '@/api'

// 响应式数据
const saving = ref(false)
const systemFormRef = ref()
const logFormRef = ref()
const performanceFormRef = ref()

// 系统基础配置表单
const systemForm = reactive({
  systemName: 'RBAC管理系统',
  systemVersion: '1.0.0',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24',
  language: 'zh-CN',
  pageSize: 20,
  sessionTimeout: 120,
  maintenanceMode: false,
  maintenanceMessage: '系统正在维护中，请稍后再试',
  enableRegister: true,
  enableCaptcha: true,
  enable2FA: false
})

// 日志配置表单
const logForm = reactive({
  logLevel: 'info',
  logRetentionDays: 30,
  enableOperationLog: true,
  enableLoginLog: true,
  enableErrorLog: true
})

// 性能配置表单
const performanceForm = reactive({
  cacheType: 'memory',
  cacheExpireTime: 3600,
  maxUploadSize: 10,
  maxConnections: 1000,
  enableGzip: true,
  enableCDN: false
})

// 表单验证规则
const systemFormRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  systemVersion: [
    { required: true, message: '请输入系统版本', trigger: 'blur' }
  ],
  timezone: [
    { required: true, message: '请选择时区', trigger: 'change' }
  ],
  dateFormat: [
    { required: true, message: '请选择日期格式', trigger: 'change' }
  ],
  timeFormat: [
    { required: true, message: '请选择时间格式', trigger: 'change' }
  ],
  language: [
    { required: true, message: '请选择语言', trigger: 'change' }
  ]
}

const logFormRules = {
  logLevel: [
    { required: true, message: '请选择日志级别', trigger: 'change' }
  ]
}

const performanceFormRules = {
  cacheType: [
    { required: true, message: '请选择缓存类型', trigger: 'change' }
  ]
}

// 保存配置
const handleSave = async () => {
  try {
    await Promise.all([
      systemFormRef.value?.validate(),
      logFormRef.value?.validate(),
      performanceFormRef.value?.validate()
    ])
    
    saving.value = true
    
    const configData = {
      ...systemForm,
      logConfig: logForm,
      performanceConfig: performanceForm
    }
    
    const response = await systemConfigService.updateSystemConfig(configData)
    
    if (response.code === 200) {
      ElMessage.success('配置保存成功')
    } else {
      ElMessage.error(response.message || '配置保存失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('配置保存失败')
      console.error('保存失败:', error)
    }
  } finally {
    saving.value = false
  }
}

// 获取配置
const getConfig = async () => {
  try {
    const response = await systemConfigService.getSystemConfig()
    if (response.code === 200) {
      const config = response.data
      Object.assign(systemForm, config)
      if (config.logConfig) {
        Object.assign(logForm, config.logConfig)
      }
      if (config.performanceConfig) {
        Object.assign(performanceForm, config.performanceConfig)
      }
    }
  } catch (error) {
    console.error('获取系统配置失败:', error)
  }
}

// 初始化
onMounted(() => {
  getConfig()
})
</script>

<style scoped>
.system-config {
  padding: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-form {
  max-width: 800px;
}

.form-tip {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
</style>
