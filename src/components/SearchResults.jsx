import React, { useState } from 'react'
import { ExternalLink, Copy, Eye, Calendar, Database, Image as ImageIcon } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const config = CLOUD_TYPE_CONFIG[cloudType] || { name: cloudType, color: 'bg-gray-500', icon: '📁' }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const openLink = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
          <span className="font-medium text-gray-900">{config.name}</span>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => copyToClipboard(link.url)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="复制链接"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={openLink}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
            title="打开链接"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 标题和描述 */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
          {link.note || '未命名资源'}
        </h3>
        
        {link.source && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Database className="w-3 h-3" />
            <span>来源: {link.source}</span>
          </div>
        )}
      </div>

      {/* 图片预览 */}
      {link.images && link.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {link.images.slice(0, 4).map((image, idx) => (
              <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
            <p className="text-xs text-gray-500 mt-2">还有 {link.images.length - 4} 张图片</p>
          )}
        </div>
      )}

      {/* 链接信息 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">链接地址:</span>
          <button
            onClick={openLink}
            className="text-primary-600 hover:text-primary-700 font-mono text-xs bg-gray-50 px-2 py-1 rounded truncate max-w-[200px]"
            title={link.url}
          >
            {link.url}
          </button>
        </div>
        
        {link.password && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">提取码:</span>
            <button
              onClick={() => copyToClipboard(link.password)}
              className="text-gray-900 font-mono font-semibold bg-yellow-50 border border-yellow-200 px-2 py-1 rounded hover:bg-yellow-100 transition-colors"
              title="点击复制提取码"
            >
              {link.password}
            </button>
          </div>
        )}
        
        {link.datetime && (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(link.datetime)}</span>
          </div>
        )}
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
