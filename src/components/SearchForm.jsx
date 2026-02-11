import React from 'react'
import { Search } from 'lucide-react'

const SearchForm = ({ onSearch, isLoading, selectedCloudTypes, keyword, onKeywordChange, onOpenSettings }) => {

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!keyword.trim()) return

    onSearch({
      kw: keyword.trim(),
      cloud_types: selectedCloudTypes.length > 0 ? selectedCloudTypes : undefined
    })
  }

  const handleButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!keyword.trim() || isLoading) return

    onSearch({
      kw: keyword.trim(),
      cloud_types: selectedCloudTypes.length > 0 ? selectedCloudTypes : undefined
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* 背景光晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 rounded-2xl blur-xl group-hover:from-cyan-500/25 group-hover:via-blue-500/25 group-hover:to-indigo-500/25 transition-all duration-500"></div>

          <div className="relative flex items-center gap-2 sm:gap-0 rounded-2xl border border-white/70 dark:border-slate-700/70 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-1.5 shadow-[0_12px_32px_-18px_rgba(14,116,144,0.45)]">
            {/* 输入框 */}
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="搜索全网资源..."
              className="w-full px-4 sm:px-6 py-3.5 sm:py-4 text-base sm:text-lg rounded-xl bg-white/95 dark:bg-slate-800 border border-sky-200/70 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 dark:focus:ring-sky-400/20 focus:border-sky-500 dark:focus:border-sky-400 shadow-sm transition-all duration-300 font-body touch-manipulation pr-4 sm:pr-24"
              disabled={isLoading}
              onTouchStart={(e) => e.target.focus()}
            />

            {/* 搜索按钮 */}
            <button
              type="submit"
              disabled={!keyword.trim() || isLoading}
              onClick={handleButtonClick}
              onTouchStart={handleButtonClick}
              className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-4 sm:px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-500/30 shadow-lg hover:scale-[1.03] disabled:hover:scale-100 touch-manipulation group/button font-heading font-semibold text-sm sm:text-base min-w-[48px]"
            >
              <div className="flex items-center gap-2">
                <Search className={`w-5 h-5 ${isLoading ? 'opacity-50' : 'group-hover/button:scale-110'} transition-all duration-200`} />
                <span className="hidden sm:inline">搜索</span>
              </div>
            </button>
          </div>
        </div>

        {selectedCloudTypes.length > 0 && (
          <div className="mt-4 text-center px-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenSettings && onOpenSettings()
              }}
              className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all duration-200 cursor-pointer border border-sky-200 dark:border-sky-800 font-body"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">已筛选 {selectedCloudTypes.length} 种资源类型</span>
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchForm
