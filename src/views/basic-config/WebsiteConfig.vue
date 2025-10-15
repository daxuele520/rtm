<template>
  <div class="website-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>网站基础配置</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            <el-icon><Check /></el-icon>
            保存配置
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="websiteFormRef"
        :model="websiteForm"
        :rules="websiteFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="websiteForm.siteName" placeholder="请输入网站名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="网站标题" prop="siteTitle">
              <el-input v-model="websiteForm.siteTitle" placeholder="请输入网站标题" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="网站关键词" prop="keywords">
              <el-input v-model="websiteForm.keywords" placeholder="请输入网站关键词，用逗号分隔" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="网站描述" prop="description">
              <el-input v-model="websiteForm.description" placeholder="请输入网站描述" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="网站Logo" prop="logo">
              <el-input v-model="websiteForm.logo" placeholder="请输入Logo URL">
                <template #append>
                  <el-button @click="handleUploadLogo">上传</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="网站图标" prop="favicon">
              <el-input v-model="websiteForm.favicon" placeholder="请输入网站图标URL">
                <template #append>
                  <el-button @click="handleUploadFavicon">上传</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="网站域名" prop="domain">
              <el-input v-model="websiteForm.domain" placeholder="请输入网站域名" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="网站端口" prop="port">
              <el-input-number v-model="websiteForm.port" :min="1" :max="65535" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="备案号" prop="icp">
              <el-input v-model="websiteForm.icp" placeholder="请输入备案号" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="版权信息" prop="copyright">
              <el-input v-model="websiteForm.copyright" placeholder="请输入版权信息" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="联系邮箱" prop="contactEmail">
          <el-input v-model="websiteForm.contactEmail" placeholder="请输入联系邮箱" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="websiteForm.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="联系地址" prop="contactAddress">
          <el-input v-model="websiteForm.contactAddress" placeholder="请输入联系地址" />
        </el-form-item>
        
        <el-form-item label="网站状态" prop="status">
          <el-radio-group v-model="websiteForm.status">
            <el-radio value="online">正常运营</el-radio>
            <el-radio value="maintenance">维护中</el-radio>
            <el-radio value="offline">暂停服务</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="websiteForm.status === 'maintenance'" label="维护说明" prop="maintenanceMessage">
          <el-input
            v-model="websiteForm.maintenanceMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入维护说明"
          />
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="config-card" style="margin-top: 20px;">
      <template #header>
        <span>SEO配置</span>
      </template>
      
      <el-form
        ref="seoFormRef"
        :model="seoForm"
        :rules="seoFormRules"
        label-width="120px"
        class="config-form"
      >
        <el-form-item label="默认语言" prop="defaultLanguage">
          <el-select v-model="seoForm.defaultLanguage" placeholder="请选择默认语言" style="width: 100%;">
            <el-option label="中文简体" value="zh-CN" />
            <el-option label="中文繁体" value="zh-TW" />
            <el-option label="English" value="en-US" />
            <el-option label="日本語" value="ja-JP" />
            <el-option label="한국어" value="ko-KR" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="字符编码" prop="charset">
          <el-select v-model="seoForm.charset" placeholder="请选择字符编码" style="width: 100%;">
            <el-option label="UTF-8" value="UTF-8" />
            <el-option label="GBK" value="GBK" />
            <el-option label="GB2312" value="GB2312" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Robots.txt" prop="robots">
          <el-input
            v-model="seoForm.robots"
            type="textarea"
            :rows="4"
            placeholder="请输入Robots.txt内容"
          />
        </el-form-item>
        
        <el-form-item label="网站地图" prop="sitemap">
          <el-input v-model="seoForm.sitemap" placeholder="请输入网站地图URL" />
        </el-form-item>
        
        <el-form-item label="Google Analytics" prop="googleAnalytics">
          <el-input v-model="seoForm.googleAnalytics" placeholder="请输入Google Analytics ID" />
        </el-form-item>
        
        <el-form-item label="百度统计" prop="baiduAnalytics">
          <el-input v-model="seoForm.baiduAnalytics" placeholder="请输入百度统计ID" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { websiteConfigService } from '@/api'

// 响应式数据
const saving = ref(false)
const websiteFormRef = ref()
const seoFormRef = ref()

// 网站基础配置表单
const websiteForm = reactive({
  siteName: 'RBAC管理系统',
  siteTitle: 'RBAC权限管理系统',
  keywords: 'RBAC,权限管理,用户管理,角色管理',
  description: '基于Vue3和Element Plus的RBAC权限管理系统',
  logo: '',
  favicon: '',
  domain: 'localhost',
  port: 3000,
  icp: '',
  copyright: '© 2024 RBAC管理系统. All rights reserved.',
  contactEmail: 'admin@example.com',
  contactPhone: '400-123-4567',
  contactAddress: '北京市朝阳区xxx街道xxx号',
  status: 'online',
  maintenanceMessage: ''
})

// SEO配置表单
const seoForm = reactive({
  defaultLanguage: 'zh-CN',
  charset: 'UTF-8',
  robots: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/`,
  sitemap: '/sitemap.xml',
  googleAnalytics: '',
  baiduAnalytics: ''
})

// 表单验证规则
const websiteFormRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' }
  ],
  siteTitle: [
    { required: true, message: '请输入网站标题', trigger: 'blur' }
  ],
  domain: [
    { required: true, message: '请输入网站域名', trigger: 'blur' }
  ],
  contactEmail: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const seoFormRules = {
  defaultLanguage: [
    { required: true, message: '请选择默认语言', trigger: 'change' }
  ],
  charset: [
    { required: true, message: '请选择字符编码', trigger: 'change' }
  ]
}

// 保存配置
const handleSave = async () => {
  try {
    await Promise.all([
      websiteFormRef.value?.validate(),
      seoFormRef.value?.validate()
    ])
    
    saving.value = true
    
    const configData = {
      ...websiteForm,
      ...seoForm
    }
    
    const response = await websiteConfigService.updateWebsiteConfig(configData)
    
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

// 上传Logo
const handleUploadLogo = () => {
  ElMessage.info('Logo上传功能待实现')
}

// 上传网站图标
const handleUploadFavicon = () => {
  ElMessage.info('网站图标上传功能待实现')
}

// 获取配置
const getConfig = async () => {
  try {
    const response = await websiteConfigService.getWebsiteConfig()
    if (response.code === 200) {
      const config = response.data
      Object.assign(websiteForm, config)
      // 分离SEO配置
      if (config.defaultLanguage) {
        Object.assign(seoForm, {
          defaultLanguage: config.defaultLanguage,
          charset: config.charset,
          robots: config.robots,
          sitemap: config.sitemap,
          enableGzip: config.enableGzip,
          enableCDN: config.enableCDN
        })
      }
    }
  } catch (error) {
    console.error('获取网站配置失败:', error)
  }
}

// 初始化
onMounted(() => {
  getConfig()
})
</script>

<style scoped>
.website-config {
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

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
</style>
