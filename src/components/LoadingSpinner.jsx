import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 font-medium">正在搜索资源...</p>
        <p className="text-sm text-gray-500 mt-1">请稍候，这可能需要几秒钟</p>
      </div>
      
      {/* 搜索提示动画 */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}

export default LoadingSpinner
