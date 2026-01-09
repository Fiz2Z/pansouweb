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

  const config = CLOUD_TYPE_CONFIG[cloudType] || { name: cloudType, color: 'bg-gray-500', icon: '📁' }

  const copyToClipboard = async (text, type) => {
    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

      if (isIOS) {
        // iOS 最佳实践方法
        return new Promise((resolve, reject) => {
          const textArea = document.createElement('textarea')
          textArea.value = text

          // 关键：让元素可见但不影响布局
          textArea.style.position = 'absolute'
          textArea.style.left = '0'
          textArea.style.top = '0'
          textArea.style.width = '2em'
          textArea.style.height = '2em'
          textArea.style.padding = '0'
          textArea.style.border = 'none'
          textArea.style.outline = 'none'
          textArea.style.boxShadow = 'none'
          textArea.style.background = 'transparent'
          textArea.style.fontSize = '16px' // 防止iOS缩放
          textArea.style.zIndex = '-1'
          textArea.setAttribute('readonly', '')

          document.body.appendChild(textArea)

          // 重要：使用 requestAnimationFrame 确保DOM更新
          requestAnimationFrame(() => {
            try {
              textArea.select()
              textArea.setSelectionRange(0, text.length)

              const successful = document.execCommand('copy')
              document.body.removeChild(textArea)

              if (successful) {
                setCopiedItem(type)
                setTimeout(() => setCopiedItem(null), 2000)
                resolve()
              } else {
                reject(new Error('iOS复制失败'))
              }
            } catch (error) {
              document.body.removeChild(textArea)
              reject(error)
            }
          })
        })
      } else {
        // 非 iOS 设备
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
        } else {
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
      }

    } catch (err) {
      console.error('复制失败:', err)

      // 更友好的错误处理
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // iOS: 直接显示内容让用户手动复制
        const userWantsCopy = confirm('自动复制失败，点击确定查看内容进行手动复制')
        if (userWantsCopy) {
          // 使用 prompt 显示内容，用户可以手动选择复制
          prompt('请长按选择并复制以下内容：', text)
        }
      } else {
        alert('复制失败，请手动复制')
      }
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

    // 所有设备都使用新标签页打开
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 overflow-hidden flex flex-col h-full min-h-[180px] hover:-translate-y-1 cursor-pointer">
      {/* 头部标签区域 */}
      <div className="relative p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold font-heading text-white ${config.color} shadow-md`}>
            {config.name}
          </span>
          {link.datetime && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-body">
              {formatDate(link.datetime)}
            </span>
          )}
        </div>

        {/* 资源标题 */}
        <h3 className="text-base font-bold font-heading text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
          {link.note || '未命名资源'}
        </h3>
      </div>

      {/* 占位区域 */}
      <div className="flex-grow"></div>

      {/* 底部操作区域 */}
      <div className="p-5 pt-2 bg-gray-50/50 dark:bg-gray-900/50">
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
              className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-semibold font-body text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation"
            >
              <Key className="w-3.5 h-3.5" />
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold font-heading rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 touch-manipulation"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedItem === 'url' ? '已复制' : '复制链接'}</span>
            </button>
          ) : (
            <button
              onClick={openLink}
              onTouchStart={openLink}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-primary hover:shadow-lg text-white text-sm font-semibold font-heading rounded-lg transition-all duration-200 shadow-md hover:scale-105 touch-manipulation"
            >
              <ExternalLink className="w-4 h-4" />
              <span>直达</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const IntegratedCloudCard = ({ type, links, config }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const displayLinks = showAll ? links : links.slice(0, 3)
  const hasMore = links.length > 3

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in shadow-md hover:shadow-xl transition-all duration-300">
      {/* 卡片头部 */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold font-heading text-white ${config.color} shadow-md`}>
            {config.name}
          </span>
          <span className="text-lg font-bold font-heading text-gray-900 dark:text-white">
            {links.length} 条资源
          </span>
        </div>

        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 卡片内容 */}
      {isExpanded && (
        <div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayLinks.map((link, index) => (
              <div
                key={index}
                className="animate-scale-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <LinkCard link={link} cloudType={type} />
              </div>
            ))}
          </div>

          {/* 查看全部按钮 */}
          {hasMore && (
            <div className="border-t border-gray-100 dark:border-gray-700 p-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 font-semibold font-heading border border-blue-200 dark:border-blue-800"
              >
                {showAll ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    <span>收起 ({links.length - 3} 条)</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>查看全部 {links.length} 条资源</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const SearchResults = ({ results }) => {
  // 获取可用的网盘类型和数量，并按资源数量降序排列
  const cloudTypes = results?.merged_by_type
    ? Object.keys(results.merged_by_type).sort((a, b) => {
      const countA = results.merged_by_type[a]?.length || 0
      const countB = results.merged_by_type[b]?.length || 0
      return countB - countA // 降序排列
    })
    : []

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
        <div className="space-y-4">
          {/* 整合卡片列表 */}
          {cloudTypes.map(type => {
            const links = results.merged_by_type[type] || []
            const config = CLOUD_TYPE_CONFIG[type] || { name: type, color: 'bg-gray-500' }

            return (
              <IntegratedCloudCard
                key={type}
                type={type}
                links={links}
                config={config}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchResults
