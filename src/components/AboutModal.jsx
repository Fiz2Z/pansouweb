import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Info, X, Heart, Github, ExternalLink } from 'lucide-react'

const AboutModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  // 从环境变量获取配置
  const authorName = import.meta.env.VITE_AUTHOR_NAME || 
                   (window.__APP_CONFIG__ && window.__APP_CONFIG__.AUTHOR_NAME) || 
                   'Yuccc'
  
  const blogUrl = import.meta.env.VITE_BLOG_URL || 
                 (window.__APP_CONFIG__ && window.__APP_CONFIG__.BLOG_URL) || 
                 null

  const blogName = import.meta.env.VITE_BLOG_NAME || 
                  (window.__APP_CONFIG__ && window.__APP_CONFIG__.BLOG_NAME) || 
                  'Blog'

  return (
    <>
      {/* 关于按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl backdrop-blur-sm transition-all duration-200"
        title="关于"
      >
        <Info className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">关于</span>
      </button>

      {/* 关于弹窗 */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          {/* 毛玻璃背景 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleClose}
          />
          
          {/* 弹窗内容 */}
          <div 
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-slide-up"
            style={{ 
              maxHeight: 'calc(100vh - 4rem)',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">关于</h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {/* 应用信息 */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">全网资源搜索</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  现代化的全网资源搜索工具
                </p>
              </div>

              {/* 作者信息 */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Made with ❤️ by <span className="font-semibold text-blue-600 dark:text-blue-400">{authorName}</span>
                  </span>
                </div>

                {/* 项目信息 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">基于</span>
                    <a
                      href="https://github.com/fish2018/pansou"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                    >
                      <Github className="w-3 h-3" />
                      <span>PanSou API</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">源码</span>
                    <a
                      href="https://github.com/YuuCccc/sousou"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                    >
                      <Github className="w-3 h-3" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {blogUrl && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">博客</span>
                      <a
                        href={blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                      >
                        <span>{blogName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">版本</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">v1.0.0</span>
                  </div>
                </div>

                {/* 技术栈 */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">技术栈</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Vite', 'Tailwind CSS', 'Lucide React'].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 底部 */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default AboutModal
