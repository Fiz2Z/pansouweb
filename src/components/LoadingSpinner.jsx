import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 简洁的搜索动画 */}
      <div className="relative">
        <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-3 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        正在搜索资源...
      </p>
    </div>
  )
}

export default LoadingSpinner
