import React, { useState } from 'react'
import { Search } from 'lucide-react'

const SearchForm = ({ onSearch, isLoading, selectedCloudTypes }) => {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

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
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索网盘资源..."
            className="w-full px-6 py-5 text-lg border-0 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-gray-200/60 dark:group-hover:shadow-gray-900/60"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!keyword.trim() || isLoading}
            className="absolute right-3 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            <Search className={`w-5 h-5 ${isLoading ? 'opacity-50' : ''}`} />
          </button>
        </div>
        
        {selectedCloudTypes.length > 0 && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
              已筛选 {selectedCloudTypes.length} 种网盘类型
            </span>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchForm
