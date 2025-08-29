import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

const CLOUD_TYPES = [
  { value: 'baidu', label: '百度网盘', color: 'bg-blue-500' },
  { value: 'aliyun', label: '阿里云盘', color: 'bg-orange-500' },
  { value: 'quark', label: '夸克网盘', color: 'bg-purple-500' },
  { value: 'tianyi', label: '天翼云盘', color: 'bg-red-500' },
  { value: 'uc', label: 'UC网盘', color: 'bg-green-500' },
  { value: '115', label: '115网盘', color: 'bg-yellow-500' },
  { value: 'pikpak', label: 'PikPak', color: 'bg-pink-500' },
  { value: 'xunlei', label: '迅雷网盘', color: 'bg-indigo-500' },
  { value: '123', label: '123网盘', color: 'bg-cyan-500' },
  { value: 'magnet', label: '磁力链接', color: 'bg-gray-500' },
  { value: 'ed2k', label: 'ED2K链接', color: 'bg-gray-600' }
]

const SearchForm = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('')
  const [selectedCloudTypes, setSelectedCloudTypes] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    onSearch({
      kw: keyword.trim(),
      cloud_types: selectedCloudTypes.length > 0 ? selectedCloudTypes : undefined
    })
  }

  const toggleCloudType = (cloudType) => {
    setSelectedCloudTypes(prev => 
      prev.includes(cloudType)
        ? prev.filter(type => type !== cloudType)
        : [...prev, cloudType]
    )
  }

  const clearAllFilters = () => {
    setSelectedCloudTypes([])
  }

  const selectAllCloudTypes = () => {
    setSelectedCloudTypes(CLOUD_TYPES.map(type => type.value))
  }

  return (
    <div className="card max-w-4xl mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 搜索输入框 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入搜索关键词，如：电影名、软件名、资料名等..."
            className="input-field pl-12 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            disabled={isLoading}
          />
        </div>

        {/* 筛选器切换按钮 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>网盘类型筛选</span>
            <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          
          {selectedCloudTypes.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>已选择 {selectedCloudTypes.length} 种网盘</span>
            </div>
          )}
        </div>

        {/* 网盘类型选择器 */}
        {showFilters && (
          <div className="animate-slide-up">
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">选择网盘类型</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={selectAllCloudTypes}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    全选
                  </button>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    清空
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {CLOUD_TYPES.map((cloudType) => (
                  <label
                    key={cloudType.value}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedCloudTypes.includes(cloudType.value)
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCloudTypes.includes(cloudType.value)}
                      onChange={() => toggleCloudType(cloudType.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${cloudType.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{cloudType.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {selectedCloudTypes.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedCloudTypes.map((type) => {
                      const cloudType = CLOUD_TYPES.find(ct => ct.value === type)
                      return (
                        <span
                          key={type}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {cloudType?.label}
                          <button
                            type="button"
                            onClick={() => toggleCloudType(type)}
                            className="ml-2 hover:text-primary-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 搜索按钮 */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!keyword.trim() || isLoading}
            className="btn-primary min-w-[200px] flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>搜索中...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>开始搜索</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
