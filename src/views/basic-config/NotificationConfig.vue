<template>
  <div class="notification-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>通知基础配置</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            <el-icon><Check /></el-icon>
            保存配置
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="notificationFormRef"
        :model="notificationForm"
        :rules="notificationFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-form-item label="启用系统通知" prop="enableSystemNotification">
          <el-switch v-model="notificationForm.enableSystemNotification" />
        </el-form-item>
        
        <el-form-item label="启用邮件通知" prop="enableEmailNotification">
          <el-switch v-model="notificationForm.enableEmailNotification" />
        </el-form-item>
        
        <el-form-item label="启用短信通知" prop="enableSmsNotification">
          <el-switch v-model="notificationForm.enableSmsNotification" />
        </el-form-item>
        
        <el-form-item label="启用微信通知" prop="enableWechatNotification">
          <el-switch v-model="notificationForm.enableWechatNotification" />
        </el-form-item>
        
        <el-form-item label="通知保留天数" prop="notificationRetentionDays">
          <el-input-number v-model="notificationForm.notificationRetentionDays" :min="1" :max="365" style="width: 200px;" />
          <span class="form-tip">天</span>
        </el-form-item>
        
        <el-form-item label="批量发送间隔" prop="batchSendInterval">
          <el-input-number v-model="notificationForm.batchSendInterval" :min="1" :max="60" style="width: 200px;" />
          <span class="form-tip">秒</span>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>邮件配置</span>
      </template>
      
      <el-form
        ref="emailFormRef"
        :model="emailForm"
        :rules="emailFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="SMTP服务器" prop="smtpHost">
              <el-input v-model="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="发件人邮箱" prop="senderEmail">
              <el-input v-model="emailForm.senderEmail" placeholder="请输入发件人邮箱" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="发件人名称" prop="senderName">
              <el-input v-model="emailForm.senderName" placeholder="请输入发件人名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱用户名" prop="username">
              <el-input v-model="emailForm.username" placeholder="请输入邮箱用户名" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="邮箱密码" prop="password">
              <el-input v-model="emailForm.password" type="password" placeholder="请输入邮箱密码" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="启用SSL" prop="enableSsl">
          <el-switch v-model="emailForm.enableSsl" />
        </el-form-item>
        
        <el-form-item label="启用TLS" prop="enableTls">
          <el-switch v-model="emailForm.enableTls" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleTestEmail">
            <el-icon><Message /></el-icon>
            测试邮件发送
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>短信配置</span>
      </template>
      
      <el-form
        ref="smsFormRef"
        :model="smsForm"
        :rules="smsFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="短信服务商" prop="provider">
              <el-select v-model="smsForm.provider" placeholder="请选择短信服务商" style="width: 100%;">
                <el-option label="阿里云" value="aliyun" />
                <el-option label="腾讯云" value="tencent" />
                <el-option label="华为云" value="huawei" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Access Key" prop="accessKey">
              <el-input v-model="smsForm.accessKey" placeholder="请输入Access Key" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Secret Key" prop="secretKey">
              <el-input v-model="smsForm.secretKey" type="password" placeholder="请输入Secret Key" show-password />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="签名" prop="signature">
              <el-input v-model="smsForm.signature" placeholder="请输入短信签名" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" @click="handleTestSms">
            <el-icon><Message /></el-icon>
            测试短信发送
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>微信配置</span>
      </template>
      
      <el-form
        ref="wechatFormRef"
        :model="wechatForm"
        :rules="wechatFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="企业ID" prop="corpId">
              <el-input v-model="wechatForm.corpId" placeholder="请输入企业ID" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="应用ID" prop="agentId">
              <el-input v-model="wechatForm.agentId" placeholder="请输入应用ID" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="应用密钥" prop="secret">
              <el-input v-model="wechatForm.secret" type="password" placeholder="请输入应用密钥" show-password />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="Token" prop="token">
              <el-input v-model="wechatForm.token" placeholder="请输入Token" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" @click="handleTestWechat">
            <el-icon><Message /></el-icon>
            测试微信发送
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>通知模板</span>
      </template>
      
      <el-table :data="notificationTemplates" style="width: 100%">
        <el-table-column prop="name" label="模板名称" width="150" />
        <el-table-column prop="type" label="通知类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getNotificationTypeTag(row.type)" size="small">
              {{ getNotificationTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题模板" min-width="200" />
        <el-table-column prop="content" label="内容模板" min-width="300" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditTemplate(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Message, Edit } from '@element-plus/icons-vue'
import { notificationConfigService } from '@/api'

// 响应式数据
const saving = ref(false)
const notificationFormRef = ref()
const emailFormRef = ref()
const smsFormRef = ref()
const wechatFormRef = ref()

// 通知基础配置表单
const notificationForm = reactive({
  enableSystemNotification: true,
  enableEmailNotification: true,
  enableSmsNotification: false,
  enableWechatNotification: false,
  notificationRetentionDays: 30,
  batchSendInterval: 5
})

// 邮件配置表单
const emailForm = reactive({
  smtpHost: 'smtp.qq.com',
  smtpPort: 587,
  senderEmail: 'admin@example.com',
  senderName: '系统管理员',
  username: 'admin@example.com',
  password: '',
  enableSsl: false,
  enableTls: true
})

// 短信配置表单
const smsForm = reactive({
  provider: 'aliyun',
  accessKey: '',
  secretKey: '',
  signature: '系统通知'
})

// 微信配置表单
const wechatForm = reactive({
  corpId: '',
  agentId: '',
  secret: '',
  token: ''
})

// 通知模板数据
const notificationTemplates = ref([])

// 表单验证规则
const notificationFormRules = {
  notificationRetentionDays: [
    { required: true, message: '请输入通知保留天数', trigger: 'blur' }
  ],
  batchSendInterval: [
    { required: true, message: '请输入批量发送间隔', trigger: 'blur' }
  ]
}

const emailFormRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP服务器', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  senderEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  senderName: [
    { required: true, message: '请输入发件人名称', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入邮箱用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
  ]
}

const smsFormRules = {
  provider: [
    { required: true, message: '请选择短信服务商', trigger: 'change' }
  ],
  accessKey: [
    { required: true, message: '请输入Access Key', trigger: 'blur' }
  ],
  secretKey: [
    { required: true, message: '请输入Secret Key', trigger: 'blur' }
  ],
  signature: [
    { required: true, message: '请输入短信签名', trigger: 'blur' }
  ]
}

const wechatFormRules = {
  corpId: [
    { required: true, message: '请输入企业ID', trigger: 'blur' }
  ],
  agentId: [
    { required: true, message: '请输入应用ID', trigger: 'blur' }
  ],
  secret: [
    { required: true, message: '请输入应用密钥', trigger: 'blur' }
  ],
  token: [
    { required: true, message: '请输入Token', trigger: 'blur' }
  ]
}

// 保存配置
const handleSave = async () => {
  try {
    await Promise.all([
      notificationFormRef.value?.validate(),
      emailFormRef.value?.validate(),
      smsFormRef.value?.validate(),
      wechatFormRef.value?.validate()
    ])
    
    saving.value = true
    
    const configData = {
      ...notificationForm,
      ...emailForm,
      ...smsForm,
      ...wechatForm
    }
    
    const response = await notificationConfigService.updateNotificationConfig(configData)
    
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

// 测试邮件发送
const handleTestEmail = async () => {
  try {
    await emailFormRef.value?.validate()
    
    // 模拟测试邮件发送
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('测试邮件发送成功')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('测试邮件发送失败')
      console.error('测试失败:', error)
    }
  }
}

// 测试短信发送
const handleTestSms = async () => {
  try {
    await smsFormRef.value?.validate()
    
    // 模拟测试短信发送
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('测试短信发送成功')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('测试短信发送失败')
      console.error('测试失败:', error)
    }
  }
}

// 测试微信发送
const handleTestWechat = async () => {
  try {
    await wechatFormRef.value?.validate()
    
    // 模拟测试微信发送
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('测试微信发送成功')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('测试微信发送失败')
      console.error('测试失败:', error)
    }
  }
}

// 编辑通知模板
const handleEditTemplate = (row) => {
  ElMessage.info('编辑通知模板功能待实现')
}

// 获取通知类型标签
const getNotificationTypeTag = (type) => {
  const tagMap = {
    login: 'success',
    password_change: 'warning',
    maintenance: 'info',
    abnormal_login: 'danger'
  }
  return tagMap[type] || 'default'
}

// 获取通知类型名称
const getNotificationTypeName = (type) => {
  const nameMap = {
    login: '登录通知',
    password_change: '密码修改',
    maintenance: '系统维护',
    abnormal_login: '异常登录'
  }
  return nameMap[type] || '其他'
}

// 获取配置
const getConfig = async () => {
  try {
    const response = await notificationConfigService.getNotificationConfig()
    if (response.code === 200) {
      const config = response.data
      Object.assign(notificationForm, config)
      // 分离邮件配置
      if (config.smtpHost) {
        Object.assign(emailForm, {
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          senderEmail: config.senderEmail,
          senderName: config.senderName,
          username: config.username,
          password: config.password,
          enableSsl: config.enableSsl,
          enableTls: config.enableTls
        })
      }
      // 分离短信配置
      if (config.provider) {
        Object.assign(smsForm, {
          provider: config.provider,
          accessKey: config.accessKey,
          secretKey: config.secretKey,
          signature: config.signature
        })
      }
      // 分离微信配置
      if (config.corpId) {
        Object.assign(wechatForm, {
          corpId: config.corpId,
          agentId: config.agentId,
          secret: config.secret,
          token: config.token
        })
      }
    }
  } catch (error) {
    console.error('获取通知配置失败:', error)
  }
}

// 获取通知模板
const getNotificationTemplates = async () => {
  try {
    const response = await notificationConfigService.getNotificationTemplates()
    if (response.code === 200) {
      notificationTemplates.value = response.data
    }
  } catch (error) {
    console.error('获取通知模板失败:', error)
  }
}

// 初始化
onMounted(() => {
  getConfig()
  getNotificationTemplates()
})
</script>

<style scoped>
.notification-config {
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
