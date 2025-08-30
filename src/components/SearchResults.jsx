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
  
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
  }
  
  return (
    <button
      onClick={handleClick}
      onTouchStart={handleClick}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm touch-manipulation
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

  const openLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // iOS Safari 优化：直接跳转而不是新窗口
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = link.url
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border-0 ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:shadow-xl hover:ring-gray-300/50 dark:hover:ring-gray-600/50 transition-all duration-300 overflow-hidden flex flex-col h-full min-h-[200px] hover:-translate-y-1">
      {/* 头部标签区域 */}
      <div className="relative p-4 pb-2">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white ${config.color} shadow-lg`}>
            {config.name}
          </span>
          {link.datetime && (
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {formatDate(link.datetime)}
            </span>
          )}
        </div>
        
        {/* 资源标题 */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mb-3">
          {link.note || '未命名资源'}
        </h3>
      </div>

      {/* 图片预览区域 */}
      {link.images && link.images.length > 0 && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2 h-16 rounded-xl overflow-hidden">
            {link.images.slice(0, 4).map((image, idx) => (
              <div key={idx} className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group/image">
                {!imageError ? (
                  <img
                    src={image}
                    alt={`预览图 ${idx + 1}`}
                    className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500 cursor-pointer"
                    onError={() => setImageError(true)}
                    onClick={() => window.open(image, '_blank')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-3 h-3" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          {link.images.length > 4 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></span>
              还有 {link.images.length - 4} 张图片
            </p>
          )}
        </div>
      )}

      {/* 占位区域 */}
      <div className="flex-grow"></div>

      {/* 底部操作区域 */}
      <div className="p-4 pt-2">
        <div className="flex items-center justify-between gap-3">
          {/* 左侧提取码 */}
          {link.password ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(link.password, 'password')
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(link.password, 'password')
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/60 dark:border-red-700/60 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/30 dark:hover:to-orange-900/30 transition-all duration-200 shadow-sm touch-manipulation"
            >
              <Key className="w-3 h-3" />
              <span>{copiedItem === 'password' ? '已复制' : link.password}</span>
            </button>
          ) : (
            <div></div>
          )}

          {/* 右侧操作按钮 */}
          {['magnet', 'torrent', 'thunder', 'ed2k'].includes(cloudType) ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(link.url, 'url')
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(link.url, 'url')
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedItem === 'url' ? '已复制' : '复制链接'}</span>
            </button>
          ) : (
            <button
              onClick={openLink}
              onTouchStart={openLink}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
            >
              <ExternalLink className="w-3 h-3" />
              <span>直达</span>
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
                    <div 
                      key={`${activeTab}-${index}`}
                      className="animate-fade-in"
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <LinkCard
                        link={link}
                        cloudType={activeTab}
                      />
                    </div>
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
