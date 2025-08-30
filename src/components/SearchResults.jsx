import React, { useState } from 'react'
import { ExternalLink, Copy, Eye, Calendar, Image as ImageIcon, Key, Download } from 'lucide-react'

const CLOUD_TYPE_CONFIG = {
  baidu: { name: '百度网盘', color: 'bg-blue-500' },
  aliyun: { name: '阿里云盘', color: 'bg-orange-500' },
  quark: { name: '夸克网盘', color: 'bg-purple-500' },
  tianyi: { name: '天翼云盘', color: 'bg-red-500' },
  uc: { name: 'UC网盘', color: 'bg-green-500' },
  '115': { name: '115网盘', color: 'bg-yellow-500' },
  pikpak: { name: 'PikPak', color: 'bg-pink-500' },
  xunlei: { name: '迅雷网盘', color: 'bg-indigo-500' },
  thunder: { name: 'Thunder', color: 'bg-indigo-600' },
  '123': { name: '123网盘', color: 'bg-cyan-500' },
  magnet: { name: '磁力链接', color: 'bg-gray-500' },
  ed2k: { name: 'ED2K链接', color: 'bg-gray-600' },
  mobile: { name: '移动云盘', color: 'bg-teal-500' },
  lanzou: { name: '蓝奏云盘', color: 'bg-blue-600' },
  torrent: { name: 'Torrent', color: 'bg-gray-700' }
}

const CloudTypeTab = ({ type, count, isActive, onClick }) => {
  const config = CLOUD_TYPE_CONFIG[type] || { name: type, color: 'bg-gray-500' }
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm
        ${isActive 
          ? 'bg-primary-600 text-white shadow-md' 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
      `}
    >
      <span className="truncate">{config.name}</span>
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0
        ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden flex flex-col h-full min-h-[220px]">
      {/* 头部 - 网盘名称和日期 */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${config.color}`}>
            {config.name}
          </span>
          {link.datetime && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(link.datetime)}
            </span>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-3 flex-grow flex flex-col">
        {/* 资源标题 - 加大字体 */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {link.note || '未命名资源'}
          </h3>
        </div>

        {/* 图片预览区域 */}
        {link.images && link.images.length > 0 && (
          <div className="mb-3 flex-shrink-0">
            <div className="grid grid-cols-2 gap-2 h-20">
              {link.images.slice(0, 4).map((image, idx) => (
                <div key={idx} className="relative bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                  {!imageError ? (
                    <img
                      src={image}
                      alt={`预览图 ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                      onError={() => setImageError(true)}
                      onClick={() => window.open(image, '_blank')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {link.images.length > 4 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                +{link.images.length - 4} 张图片
              </p>
            )}
          </div>
        )}

        {/* 占位区域 */}
        <div className="flex-grow"></div>
      </div>

      {/* 底部操作区域 */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-600 flex-shrink-0 mt-auto">
        <div className="flex items-center justify-between gap-2">
          {/* 左侧提取码 */}
          {link.password ? (
            <button
              onClick={() => copyToClipboard(link.password, 'password')}
              className="flex items-center gap-1.5 px-2 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <span>密码: {copiedItem === 'password' ? '已复制' : link.password}</span>
            </button>
          ) : (
            <div></div>
          )}

          {/* 右侧操作按钮 */}
          {['magnet', 'torrent', 'thunder', 'ed2k'].includes(cloudType) ? (
            <button
              onClick={() => copyToClipboard(link.url, 'url')}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedItem === 'url' ? '已复制' : '复制链接'}</span>
            </button>
          ) : (
            <button
              onClick={openLink}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
            >
              直达
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const SearchResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState(null)

  // 获取可用的网盘类型和数量，并按资源数量降序排列
  const cloudTypes = results?.merged_by_type 
    ? Object.keys(results.merged_by_type).sort((a, b) => {
        const countA = results.merged_by_type[a]?.length || 0
        const countB = results.merged_by_type[b]?.length || 0
        return countB - countA // 降序排列
      })
    : []
  
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
