import React, { useMemo, useState } from 'react'
import { CalendarClock, Copy, ExternalLink, Key, SearchX } from 'lucide-react'

const CLOUD_TYPE_CONFIG = {
  baidu: { name: '百度网盘', color: 'from-blue-500 to-blue-600' },
  aliyun: { name: '阿里云盘', color: 'from-orange-500 to-amber-500' },
  quark: { name: '夸克网盘', color: 'from-purple-500 to-indigo-500' },
  tianyi: { name: '天翼云盘', color: 'from-rose-500 to-red-500' },
  uc: { name: 'UC网盘', color: 'from-green-500 to-emerald-500' },
  '115': { name: '115网盘', color: 'from-yellow-500 to-amber-500' },
  pikpak: { name: 'PikPak', color: 'from-pink-500 to-fuchsia-500' },
  xunlei: { name: '迅雷网盘', color: 'from-indigo-500 to-blue-500' },
  thunder: { name: 'Thunder', color: 'from-indigo-600 to-slate-700' },
  '123': { name: '123网盘', color: 'from-cyan-500 to-sky-600' },
  magnet: { name: '磁力链接', color: 'from-slate-500 to-slate-700' },
  ed2k: { name: 'ED2K', color: 'from-slate-600 to-slate-800' },
  mobile: { name: '移动云盘', color: 'from-teal-500 to-cyan-600' },
  lanzou: { name: '蓝奏云盘', color: 'from-blue-600 to-indigo-600' },
  torrent: { name: 'Torrent', color: 'from-zinc-600 to-zinc-800' }
}

const formatDate = (value) => {
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime()) || date.getFullYear() === 1) return '未知时间'
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '未知时间'
  }
}

const copyText = async (text) => {
  if (!text) return false
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    textarea.remove()
    return ok
  } catch {
    return false
  }
}

const LinkCard = ({ link, cloudType }) => {
  const [copiedType, setCopiedType] = useState('')
  const cloud = CLOUD_TYPE_CONFIG[cloudType] || { name: cloudType, color: 'from-slate-500 to-slate-700' }
  const isCopyOnlyType = ['magnet', 'torrent', 'thunder', 'ed2k'].includes(cloudType)

  const onCopy = async (text, type) => {
    const copied = await copyText(text)
    if (!copied) return
    setCopiedType(type)
    window.setTimeout(() => setCopiedType(''), 1500)
  }

  return (
    <article className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col h-full animate-scale-in">
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${cloud.color}`}>
          {cloud.name}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <CalendarClock className="w-3.5 h-3.5" aria-hidden="true" />
          {formatDate(link.datetime)}
        </span>
      </div>

      <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
        {link.note || '未命名资源'}
      </h3>

      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
        {link.password ? (
          <button
            type="button"
            onClick={() => onCopy(link.password, 'password')}
            className="soft-button px-3 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 inline-flex items-center gap-1.5 cursor-pointer"
            aria-label="复制提取码"
          >
            <Key className="w-3.5 h-3.5" aria-hidden="true" />
            {copiedType === 'password' ? '已复制' : `提取码 ${link.password}`}
          </button>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">无提取码</span>
        )}

        {isCopyOnlyType ? (
          <button
            type="button"
            onClick={() => onCopy(link.url, 'url')}
            className="brand-button px-3.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            aria-label="复制链接"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            {copiedType === 'url' ? '已复制' : '复制链接'}
          </button>
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-button px-3.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
            aria-label="打开资源链接"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            直达
          </a>
        )}
      </div>
    </article>
  )
}

const CloudSection = ({ type, links }) => {
  const [expanded, setExpanded] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const config = CLOUD_TYPE_CONFIG[type] || { name: type, color: 'from-slate-500 to-slate-700' }
  const visibleLinks = showAll ? links : links.slice(0, 6)
  const hasMore = links.length > 6

  return (
    <section className="glass-card rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 sm:px-5 py-4 text-left bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${config.color}`}>
              {config.name}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 truncate">{links.length} 条资源</span>
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {visibleLinks.map((link, index) => (
              <LinkCard key={`${type}-${index}`} link={link} cloudType={type} />
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-4 w-full soft-button text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700 cursor-pointer"
            >
              {showAll ? '收起部分结果' : `查看全部 ${links.length} 条资源`}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

const SearchResults = ({ results }) => {
  const cloudTypes = useMemo(() => {
    if (!results?.merged_by_type) return []
    return Object.keys(results.merged_by_type).sort(
      (a, b) => (results.merged_by_type[b]?.length || 0) - (results.merged_by_type[a]?.length || 0)
    )
  }, [results])

  if (!results || !results.merged_by_type || cloudTypes.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
        <SearchX className="w-10 h-10 mx-auto text-slate-400" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">暂无结果</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">请尝试更换关键词或调整筛选条件。</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="glass-card rounded-2xl px-4 sm:px-5 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">搜索结果</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">共找到 {results.total || 0} 条资源</p>
        </div>
      </div>

      {cloudTypes.map((type) => (
        <CloudSection key={type} type={type} links={results.merged_by_type[type] || []} />
      ))}
    </div>
  )
}

const SkeletonCard = ({ compact }) => (
  <div className={`glass-card rounded-2xl animate-pulse ${compact ? 'p-3 sm:p-3.5' : 'p-4 sm:p-5'}`}>
    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
    <div className="mt-3 h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
    <div className="mt-2 h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-700" />
    <div className="mt-4 flex items-center justify-between gap-2">
      <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  </div>
)

export const SearchResultsSkeleton = () => {
  return (
    <div className="space-y-4 sm:space-y-5" aria-hidden="true">
      <div className="glass-card rounded-2xl animate-pulse px-4 sm:px-5 py-3.5">
        <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-5">
        <div className="animate-pulse h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} compact={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
