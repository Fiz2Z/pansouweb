import React, { useState } from 'react'
import { Search } from 'lucide-react'

const SearchForm = ({ onSearch, isLoading, selectedCloudTypes, keyword, onKeywordChange }) => {

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
        <div className="relative flex items-center group">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="搜索全网资源..."
            className="w-full px-6 py-5 text-lg rounded-2xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl border-2 border-white/90 dark:border-gray-400/90 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:bg-white/30 dark:focus:bg-gray-800/40 focus:border-white dark:focus:border-gray-300 shadow-lg shadow-gray-200/30 dark:shadow-gray-900/30 transition-all duration-300 group-hover:shadow-xl group-hover:bg-white/25 dark:group-hover:bg-gray-800/35 group-hover:border-white/95 dark:group-hover:border-gray-400/95 touch-manipulation"
            disabled={isLoading}
            onTouchStart={(e) => e.target.focus()}
          />
          <button
            type="submit"
            disabled={!keyword.trim() || isLoading}
            onClick={handleButtonClick}
            onTouchStart={handleButtonClick}
            className="absolute right-3 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:shadow-none touch-manipulation"
          >
            <Search className={`w-5 h-5 ${isLoading ? 'opacity-50' : ''}`} />
          </button>
        </div>
        
        {selectedCloudTypes.length > 0 && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
              已筛选 {selectedCloudTypes.length} 种资源类型
            </span>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchForm
