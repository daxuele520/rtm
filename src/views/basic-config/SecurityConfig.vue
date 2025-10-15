<template>
  <div class="security-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>安全基础配置</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            <el-icon><Check /></el-icon>
            保存配置
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="securityFormRef"
        :model="securityForm"
        :rules="securityFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-form-item label="启用登录验证码" prop="enableLoginCaptcha">
          <el-switch v-model="securityForm.enableLoginCaptcha" />
        </el-form-item>
        
        <el-form-item label="启用双因子认证" prop="enable2FA">
          <el-switch v-model="securityForm.enable2FA" />
        </el-form-item>
        
        <el-form-item label="密码最小长度" prop="passwordMinLength">
          <el-input-number v-model="securityForm.passwordMinLength" :min="6" :max="32" style="width: 200px;" />
          <span class="form-tip">位</span>
        </el-form-item>
        
        <el-form-item label="密码复杂度要求" prop="passwordComplexity">
          <el-checkbox-group v-model="securityForm.passwordComplexity">
            <el-checkbox value="uppercase">包含大写字母</el-checkbox>
            <el-checkbox value="lowercase">包含小写字母</el-checkbox>
            <el-checkbox value="number">包含数字</el-checkbox>
            <el-checkbox value="special">包含特殊字符</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="密码有效期" prop="passwordExpireDays">
          <el-input-number v-model="securityForm.passwordExpireDays" :min="0" :max="365" style="width: 200px;" />
          <span class="form-tip">天 (0表示永不过期)</span>
        </el-form-item>
        
        <el-form-item label="登录失败锁定" prop="enableLoginLock">
          <el-switch v-model="securityForm.enableLoginLock" />
        </el-form-item>
        
        <el-row v-if="securityForm.enableLoginLock" :gutter="24">
          <el-col :span="12">
            <el-form-item label="最大失败次数" prop="maxLoginAttempts">
              <el-input-number v-model="securityForm.maxLoginAttempts" :min="3" :max="10" style="width: 100%;" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="锁定时间" prop="lockoutDuration">
              <el-input-number v-model="securityForm.lockoutDuration" :min="5" :max="60" style="width: 100%;" />
              <span class="form-tip">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="会话超时时间" prop="sessionTimeout">
          <el-input-number v-model="securityForm.sessionTimeout" :min="30" :max="1440" style="width: 200px;" />
          <span class="form-tip">分钟</span>
        </el-form-item>
        
        <el-form-item label="启用IP白名单" prop="enableIpWhitelist">
          <el-switch v-model="securityForm.enableIpWhitelist" />
        </el-form-item>
        
        <el-form-item v-if="securityForm.enableIpWhitelist" label="IP白名单" prop="ipWhitelist">
          <el-input
            v-model="securityForm.ipWhitelist"
            type="textarea"
            :rows="4"
            placeholder="请输入IP地址，每行一个，支持CIDR格式"
          />
        </el-form-item>
        
        <el-form-item label="启用操作日志" prop="enableOperationLog">
          <el-switch v-model="securityForm.enableOperationLog" />
        </el-form-item>
        
        <el-form-item label="启用登录日志" prop="enableLoginLog">
          <el-switch v-model="securityForm.enableLoginLog" />
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>数据加密配置</span>
      </template>
      
      <el-form
        ref="encryptionFormRef"
        :model="encryptionForm"
        :rules="encryptionFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-form-item label="数据加密算法" prop="encryptionAlgorithm">
          <el-select v-model="encryptionForm.encryptionAlgorithm" placeholder="请选择加密算法" style="width: 200px;">
            <el-option label="AES-256" value="aes-256" />
            <el-option label="AES-128" value="aes-128" />
            <el-option label="RSA-2048" value="rsa-2048" />
            <el-option label="RSA-4096" value="rsa-4096" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="启用数据脱敏" prop="enableDataMasking">
          <el-switch v-model="encryptionForm.enableDataMasking" />
        </el-form-item>
        
        <el-form-item label="启用传输加密" prop="enableTransportEncryption">
          <el-switch v-model="encryptionForm.enableTransportEncryption" />
        </el-form-item>
        
        <el-form-item label="启用存储加密" prop="enableStorageEncryption">
          <el-switch v-model="encryptionForm.enableStorageEncryption" />
        </el-form-item>
        
        <el-form-item label="密钥轮换周期" prop="keyRotationDays">
          <el-input-number v-model="encryptionForm.keyRotationDays" :min="30" :max="365" style="width: 200px;" />
          <span class="form-tip">天</span>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>访问控制配置</span>
      </template>
      
      <el-form
        ref="accessControlFormRef"
        :model="accessControlForm"
        :rules="accessControlFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-form-item label="启用访问频率限制" prop="enableRateLimit">
          <el-switch v-model="accessControlForm.enableRateLimit" />
        </el-form-item>
        
        <el-row v-if="accessControlForm.enableRateLimit" :gutter="24">
          <el-col :span="12">
            <el-form-item label="每分钟请求数" prop="requestsPerMinute">
              <el-input-number v-model="accessControlForm.requestsPerMinute" :min="10" :max="1000" style="width: 100%;" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="每小时请求数" prop="requestsPerHour">
              <el-input-number v-model="accessControlForm.requestsPerHour" :min="100" :max="10000" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="启用CORS" prop="enableCors">
          <el-switch v-model="accessControlForm.enableCors" />
        </el-form-item>
        
        <el-form-item v-if="accessControlForm.enableCors" label="允许的域名" prop="allowedOrigins">
          <el-input
            v-model="accessControlForm.allowedOrigins"
            type="textarea"
            :rows="3"
            placeholder="请输入允许的域名，每行一个，支持通配符"
          />
        </el-form-item>
        
        <el-form-item label="启用CSRF保护" prop="enableCsrfProtection">
          <el-switch v-model="accessControlForm.enableCsrfProtection" />
        </el-form-item>
        
        <el-form-item label="启用XSS保护" prop="enableXssProtection">
          <el-switch v-model="accessControlForm.enableXssProtection" />
        </el-form-item>
        
        <el-form-item label="启用SQL注入保护" prop="enableSqlInjectionProtection">
          <el-switch v-model="accessControlForm.enableSqlInjectionProtection" />
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>安全审计</span>
      </template>
      
      <el-table :data="securityAuditLogs" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="action" label="操作" width="150" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="result" label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === '成功' ? 'success' : 'danger'" size="small">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="auditPagination.page"
          v-model:page-size="auditPagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="auditPagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleAuditSizeChange"
          @current-change="handleAuditCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { securityConfigService } from '@/api'

// 响应式数据
const saving = ref(false)
const securityFormRef = ref()
const encryptionFormRef = ref()
const accessControlFormRef = ref()

// 安全基础配置表单
const securityForm = reactive({
  enableLoginCaptcha: true,
  enable2FA: false,
  passwordMinLength: 8,
  passwordComplexity: ['lowercase', 'number'],
  passwordExpireDays: 90,
  enableLoginLock: true,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  sessionTimeout: 120,
  enableIpWhitelist: false,
  ipWhitelist: '',
  enableOperationLog: true,
  enableLoginLog: true
})

// 数据加密配置表单
const encryptionForm = reactive({
  encryptionAlgorithm: 'aes-256',
  enableDataMasking: true,
  enableTransportEncryption: true,
  enableStorageEncryption: false,
  keyRotationDays: 90
})

// 访问控制配置表单
const accessControlForm = reactive({
  enableRateLimit: true,
  requestsPerMinute: 100,
  requestsPerHour: 1000,
  enableCors: true,
  allowedOrigins: '*',
  enableCsrfProtection: true,
  enableXssProtection: true,
  enableSqlInjectionProtection: true
})

// 安全审计日志
const securityAuditLogs = ref([])

// 审计日志分页
const auditPagination = reactive({
  page: 1,
  size: 10,
  total: 5
})

// 表单验证规则
const securityFormRules = {
  passwordMinLength: [
    { required: true, message: '请输入密码最小长度', trigger: 'blur' }
  ],
  passwordExpireDays: [
    { required: true, message: '请输入密码有效期', trigger: 'blur' }
  ],
  maxLoginAttempts: [
    { required: true, message: '请输入最大失败次数', trigger: 'blur' }
  ],
  lockoutDuration: [
    { required: true, message: '请输入锁定时间', trigger: 'blur' }
  ],
  sessionTimeout: [
    { required: true, message: '请输入会话超时时间', trigger: 'blur' }
  ]
}

const encryptionFormRules = {
  encryptionAlgorithm: [
    { required: true, message: '请选择加密算法', trigger: 'change' }
  ],
  keyRotationDays: [
    { required: true, message: '请输入密钥轮换周期', trigger: 'blur' }
  ]
}

const accessControlFormRules = {
  requestsPerMinute: [
    { required: true, message: '请输入每分钟请求数', trigger: 'blur' }
  ],
  requestsPerHour: [
    { required: true, message: '请输入每小时请求数', trigger: 'blur' }
  ]
}

// 保存配置
const handleSave = async () => {
  try {
    await Promise.all([
      securityFormRef.value?.validate(),
      encryptionFormRef.value?.validate(),
      accessControlFormRef.value?.validate()
    ])
    
    saving.value = true
    
    const configData = {
      ...securityForm,
      ...encryptionForm,
      ...accessControlForm
    }
    
    const response = await securityConfigService.updateSecurityConfig(configData)
    
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
    const response = await securityConfigService.getSecurityConfig()
    if (response.code === 200) {
      const config = response.data
      Object.assign(securityForm, config)
      // 分离加密配置
      if (config.encryptionAlgorithm) {
        Object.assign(encryptionForm, {
          encryptionAlgorithm: config.encryptionAlgorithm,
          enableDataMasking: config.enableDataMasking,
          enableTransportEncryption: config.enableTransportEncryption,
          enableStorageEncryption: config.enableStorageEncryption,
          keyRotationDays: config.keyRotationDays
        })
      }
      // 分离访问控制配置
      if (config.enableRateLimit) {
        Object.assign(accessControlForm, {
          enableRateLimit: config.enableRateLimit,
          requestsPerMinute: config.requestsPerMinute,
          requestsPerHour: config.requestsPerHour,
          enableCors: config.enableCors,
          allowedOrigins: config.allowedOrigins,
          enableCsrfProtection: config.enableCsrfProtection,
          enableXssProtection: config.enableXssProtection,
          enableSqlInjectionProtection: config.enableSqlInjectionProtection
        })
      }
    }
  } catch (error) {
    console.error('获取安全配置失败:', error)
  }
}

// 获取安全审计日志
const getSecurityAuditLogs = async () => {
  try {
    const response = await securityConfigService.getSecurityAuditLogs({
      page: auditPagination.page,
      size: auditPagination.size
    })
    if (response.code === 200) {
      securityAuditLogs.value = response.data.list
      auditPagination.total = response.data.total
    }
  } catch (error) {
    console.error('获取安全审计日志失败:', error)
  }
}

// 审计日志分页处理
const handleAuditSizeChange = (size) => {
  auditPagination.size = size
  auditPagination.page = 1
  getSecurityAuditLogs()
}

const handleAuditCurrentChange = (page) => {
  auditPagination.page = page
  getSecurityAuditLogs()
}

// 初始化
onMounted(() => {
  getConfig()
  getSecurityAuditLogs()
})
</script>

<style scoped>
.security-config {
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

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
</style>
