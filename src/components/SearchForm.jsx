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
        <div className="relative flex items-center">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索网盘资源..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!keyword.trim() || isLoading}
            className="absolute right-2 p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {selectedCloudTypes.length > 0 && (
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              已筛选 {selectedCloudTypes.length} 种网盘类型
            </span>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchForm
