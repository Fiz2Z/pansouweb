import React, { useState } from 'react'
import { ExternalLink, Copy, Eye, Calendar, Image as ImageIcon, Key, Download } from 'lucide-react'

const CLOUD_TYPE_CONFIG = {
  baidu: { name: '百度网盘', color: 'bg-blue-500', icon: '📁' },
  aliyun: { name: '阿里云盘', color: 'bg-orange-500', icon: '☁️' },
  quark: { name: '夸克网盘', color: 'bg-purple-500', icon: '⚡' },
  tianyi: { name: '天翼云盘', color: 'bg-red-500', icon: '📱' },
  uc: { name: 'UC网盘', color: 'bg-green-500', icon: '🌐' },
  '115': { name: '115网盘', color: 'bg-yellow-500', icon: '💾' },
  pikpak: { name: 'PikPak', color: 'bg-pink-500', icon: '📦' },
  xunlei: { name: '迅雷网盘', color: 'bg-indigo-500', icon: '⚡' },
  '123': { name: '123网盘', color: 'bg-cyan-500', icon: '💿' },
  magnet: { name: '磁力链接', color: 'bg-gray-500', icon: '🧲' },
  ed2k: { name: 'ED2K链接', color: 'bg-gray-600', icon: '🔗' },
  mobile: { name: '手机网盘', color: 'bg-teal-500', icon: '📱' }
}

const CloudTypeTab = ({ type, count, isActive, onClick }) => {
  const config = CLOUD_TYPE_CONFIG[type] || { name: type, color: 'bg-gray-500', icon: '📁' }
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
        ${isActive 
          ? 'bg-primary-600 text-white shadow-md' 
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }
      `}
    >
      <span className="text-lg">{config.icon}</span>
      <span className="hidden sm:inline">{config.name}</span>
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-bold
        ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
      `}>
        {count}
      </span>
    </button>
  )
}

const LinkCard = ({ link, cloudType }) => {
  const [copiedItem, setCopiedItem] = useState(null)
  const [imageError, setImageError] = useState(false)
  
  const config = CLOUD_TYPE_CONFIG[cloudType] || { name: cloudType, color: 'bg-gray-500', icon: '📁' }

  const copyToClipboard = async (text, type) => {
    try {
      // 尝试使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // 备用方法，适用于不支持 Clipboard API 的环境
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        textArea.remove()
        
        if (!successful) {
          throw new Error('复制失败')
        }
      }
      
      setCopiedItem(type)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      // 可以添加一个toast提示
      alert('复制失败，请手动复制')
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      // 检查是否是无效日期或默认的0001年
      if (isNaN(date.getTime()) || date.getFullYear() === 1) {
        return '未知日期'
      }
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '未知日期'
    }
  }

  const openLink = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* 头部标签 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.name}</span>
        </div>
        
        {link.datetime && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(link.datetime)}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 leading-tight">
          {link.note || '未命名资源'}
        </h3>

        {/* 图片预览 */}
        {link.images && link.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {link.images.slice(0, 4).map((image, idx) => (
                <div key={idx} className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {!imageError ? (
                    <img
                      src={image}
                      alt={`预览图 ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onError={() => setImageError(true)}
                      onClick={() => window.open(image, '_blank')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {link.images.length > 4 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">还有 {link.images.length - 4} 张图片</p>
            )}
          </div>
        )}

        {/* 提取码区域 */}
        {link.password && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-700 dark:text-red-300">密码: {link.password}</span>
              <button
                onClick={() => copyToClipboard(link.password, 'password')}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
              >
                {copiedItem === 'password' ? '已复制' : '复制'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={openLink}
          className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          直达云海
        </button>
      </div>
    </div>
  )
}

const SearchResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState(null)

  // 获取可用的网盘类型和数量
  const cloudTypes = results?.merged_by_type ? Object.keys(results.merged_by_type) : []
  
  // 设置默认激活的标签页
  React.useEffect(() => {
    if (cloudTypes.length > 0 && !activeTab) {
      setActiveTab(cloudTypes[0])
    }
  }, [cloudTypes, activeTab])

  const activeLinks = activeTab ? results?.merged_by_type?.[activeTab] || [] : []

  if (!results || !results.merged_by_type || Object.keys(results.merged_by_type).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">没有找到相关资源</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 搜索统计 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">搜索结果</h2>
          <span className="text-gray-500 dark:text-gray-400">
            共找到 {results.total || 0} 条结果
          </span>
        </div>
      </div>



      {cloudTypes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">暂无搜索结果</h3>
          <p className="text-gray-500 dark:text-gray-400">
            请尝试使用其他关键词或调整搜索条件
          </p>
        </div>
      ) : (
        <>
          {/* 网盘类型标签页 */}
          <div className="flex flex-wrap gap-3">
            {cloudTypes.map(type => (
              <CloudTypeTab
                key={type}
                type={type}
                count={results.merged_by_type[type]?.length || 0}
                isActive={activeTab === type}
                onClick={() => setActiveTab(type)}
              />
            ))}
          </div>

          {/* 当前标签页的结果 */}
          {activeTab && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {CLOUD_TYPE_CONFIG[activeTab]?.name || activeTab} 
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({activeLinks.length} 个链接)
                  </span>
                </h3>
              </div>

              {activeLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  该网盘类型下暂无结果
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeLinks.map((link, index) => (
                    <LinkCard
                      key={`${activeTab}-${index}`}
                      link={link}
                      cloudType={activeTab}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchResults
