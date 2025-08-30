import React, { useState } from 'react'
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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-indigo-500/20 transition-all duration-500"></div>
          
          <div className="relative flex items-center">
            {/* 输入框 */}
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="搜索全网资源..."
              className="w-full px-8 py-6 text-lg rounded-3xl bg-white/30 dark:bg-gray-800/40 backdrop-blur-2xl border-2 border-white/70 dark:border-gray-300/70 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:bg-white/40 dark:focus:bg-gray-800/50 focus:border-white dark:focus:border-gray-200 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/10 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:bg-white/35 dark:group-hover:bg-gray-800/45 group-hover:border-white/80 dark:group-hover:border-gray-300/80 touch-manipulation"
              disabled={isLoading}
              onTouchStart={(e) => e.target.focus()}
            />
            
            {/* 搜索按钮 */}
            <button
              type="submit"
              disabled={!keyword.trim() || isLoading}
              onClick={handleButtonClick}
              onTouchStart={handleButtonClick}
              className="absolute right-2 p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 shadow-xl hover:shadow-2xl hover:scale-105 disabled:shadow-none disabled:scale-100 touch-manipulation group/button"
            >
              <Search className={`w-6 h-6 ${isLoading ? 'opacity-50' : 'group-hover/button:scale-110'} transition-all duration-200`} />
            </button>
            

          </div>
        </div>
        
        {selectedCloudTypes.length > 0 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenSettings && onOpenSettings()
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              已筛选 {selectedCloudTypes.length} 种资源类型
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchForm
