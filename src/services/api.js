import axios from 'axios'

// 从环境变量获取API域名（不包含端口）
const getApiBaseUrl = () => {
  const domain = import.meta.env.VITE_API_DOMAIN || 
                 (window.__APP_CONFIG__ && window.__APP_CONFIG__.API_DOMAIN) || 
                 '104.194.69.89'
  
  // 如果域名已经包含协议，直接使用，否则添加http://并指定端口8888
  if (domain.startsWith('http')) {
    return domain
  }
  
  return `http://${domain}:8888`
}

const API_BASE_URL = getApiBaseUrl()

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url, config.data || config.params)
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('响应错误:', error)
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    }
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      if (data && data.message) {
        throw new Error(data.message)
      }
      throw new Error(`服务器错误 (${status})`)
    } else if (error.request) {
      // 网络错误
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      throw new Error('请求失败，请稍后重试')
    }
  }
)

/**
 * 搜索网盘资源
 * @param {Object} params 搜索参数
 * @param {string} params.kw 搜索关键词
 * @param {string[]} params.cloud_types 网盘类型数组
 * @returns {Promise<Object>} 搜索结果
 */
export const searchNetdisk = async (params) => {
  const { kw, cloud_types } = params
  
  if (!kw || !kw.trim()) {
    throw new Error('请输入搜索关键词')
  }

  const searchParams = {
    kw: kw.trim(),
    res: 'merge' // 默认返回 merged_by_type 格式
  }

  // 只有选择了特定网盘类型时才传递 cloud_types 参数
  if (cloud_types && cloud_types.length > 0) {
    searchParams.cloud_types = cloud_types
  }

  try {
    const response = await api.post('/api/search', searchParams)
    return response.data
  } catch (error) {
    console.error('搜索API调用失败:', error)
    throw error
  }
}

/**
 * 检查API健康状态
 * @returns {Promise<Object>} 健康检查结果
 */
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/api/health')
    return response.data
  } catch (error) {
    console.error('健康检查失败:', error)
    throw error
  }
}

export default api
