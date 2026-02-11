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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:from-blue-500/20 group-hover:via-cyan-500/20 group-hover:to-indigo-500/20 transition-all duration-500"></div>

          <div className="relative flex items-center gap-2 sm:gap-0">
            {/* 输入框 */}
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="搜索全网资源..."
              className="w-full px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg rounded-2xl bg-white/95 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 font-body touch-manipulation pr-4 sm:pr-24"
              disabled={isLoading}
              onTouchStart={(e) => e.target.focus()}
            />

            {/* 搜索按钮 */}
            <button
              type="submit"
              disabled={!keyword.trim() || isLoading}
              onClick={handleButtonClick}
              onTouchStart={handleButtonClick}
              className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-4 sm:px-5 py-3 bg-gradient-cta hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/30 shadow-lg hover:scale-[1.03] disabled:hover:scale-100 touch-manipulation group/button font-heading font-semibold text-sm sm:text-base min-w-[48px]"
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
              className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 cursor-pointer border border-blue-200 dark:border-blue-800 font-body"
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
