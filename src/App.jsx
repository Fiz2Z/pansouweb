import React, { useState } from 'react'
import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { ThemeProvider } from './contexts/ThemeContext'
import { searchNetdisk } from './services/api'

function App() {
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchProgress, setSearchProgress] = useState({ current: 0, total: 0 })
  const [keyword, setKeyword] = useState('')
  const [selectedCloudTypes, setSelectedCloudTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedCloudTypes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleCloudTypesChange = (cloudTypes) => {
    setSelectedCloudTypes(cloudTypes)
    localStorage.setItem('selectedCloudTypes', JSON.stringify(cloudTypes))
  }

  const handleSearch = async (searchParams) => {
    setIsLoading(true)
    setError(null)
    setSearchResults(null)
    setSearchProgress({ current: 0, total: 4 })

    try {
      // 第一次搜索
      console.log('开始第 1 次搜索...')
      setSearchProgress({ current: 1, total: 4 })
      
      const firstResults = await searchNetdisk(searchParams)
      console.log('第 1 次搜索结果:', firstResults)
      
      // 立即显示第一次结果
      setSearchResults(firstResults)
      setIsLoading(false) // 第一次完成后停止主加载状态
      
      // 后台继续搜索剩余3次
      continueBackgroundSearch(searchParams, firstResults)
      
    } catch (err) {
      setError(err.message || '搜索失败，请稍后重试')
      console.error('搜索错误:', err)
      setIsLoading(false)
      setSearchProgress({ current: 0, total: 0 })
    }
  }

  const continueBackgroundSearch = async (searchParams, initialResults) => {
    try {
      // 后台继续搜索2-4轮
      for (let i = 2; i <= 4; i++) {
        setSearchProgress({ current: i, total: 4 })
        console.log(`后台第 ${i} 次搜索...`)
        
        try {
          // 间隔1.5秒再搜索
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const results = await searchNetdisk(searchParams)
          console.log(`第 ${i} 次搜索结果:`, results)
          
          // 实时增量更新结果
          setSearchResults(prevResults => {
            if (!prevResults) return results
            
            // 合并新结果
            const mergedResults = {
              ...prevResults,
              total: 0, // 重新计算总数
              merged_by_type: { ...prevResults.merged_by_type }
            }
            
            // 合并各个网盘类型的结果
            Object.keys(results.merged_by_type || {}).forEach(type => {
              const prevLinks = mergedResults.merged_by_type[type] || []
              const newLinks = results.merged_by_type[type] || []
              
              // 去重合并（基于URL）
              const existingUrls = new Set(prevLinks.map(link => link.url))
              const uniqueNewLinks = newLinks.filter(link => !existingUrls.has(link.url))
              
              if (uniqueNewLinks.length > 0) {
                mergedResults.merged_by_type[type] = [...prevLinks, ...uniqueNewLinks]
                console.log(`${type} 新增 ${uniqueNewLinks.length} 条资源`)
              }
            })
            
            // 重新计算总数
            mergedResults.total = Object.values(mergedResults.merged_by_type)
              .reduce((sum, links) => sum + links.length, 0)
            
            return mergedResults
          })
          
        } catch (searchErr) {
          console.error(`第 ${i} 次后台搜索失败:`, searchErr)
        }
      }
      
      console.log('持续搜索全部完成！')
      
    } catch (err) {
      console.error('后台搜索错误:', err)
    } finally {
      // 延迟清除进度，让用户看到完成状态
      setTimeout(() => {
        setSearchProgress({ current: 0, total: 0 })
      }, 1000)
    }
  }

  const isHomepage = !searchResults && !isLoading && !error

  return (
    <ThemeProvider>
      <div className={`${isHomepage ? 'h-screen homepage-no-scroll' : 'min-h-screen'} flex flex-col bg-gradient-to-br from-blue-200/90 via-slate-200/70 to-purple-200/80 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900`}>
        <Header 
          selectedCloudTypes={selectedCloudTypes}
          onCloudTypesChange={handleCloudTypesChange}
        />
        
        {/* 首页状态 */}
        {isHomepage && (
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center w-full max-w-4xl -mt-8">
              {/* 主标题区域 */}
              <div className="mb-8 sm:mb-12 animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  网盘搜索
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  高效搜索全网网盘资源，支持多平台一键直达
                </p>
              </div>

              {/* 搜索表单 */}
              <div className="w-full max-w-3xl mx-auto animate-fade-in animation-delay-200">
                <SearchForm 
                  onSearch={handleSearch} 
                  isLoading={isLoading}
                  selectedCloudTypes={selectedCloudTypes}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                />
              </div>
            </div>
          </main>
        )}

        {/* 搜索状态页面 */}
        {!isHomepage && (
          <main className="flex-1 container mx-auto px-4 max-w-6xl">
            <div className="py-8 space-y-8">
              {/* 搜索表单 */}
              <div className="animate-fade-in">
                <SearchForm 
                  onSearch={handleSearch} 
                  isLoading={isLoading}
                  selectedCloudTypes={selectedCloudTypes}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                />
              </div>

              {/* 加载状态 */}
              {isLoading && (
                <div className="flex flex-col items-center py-12 space-y-6">
                  <LoadingSpinner />
                  {searchProgress.total > 0 && (
                    <div className="text-center max-w-md mx-auto">
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                        {/* 进度环 */}
                        <div className="relative w-20 h-20 mx-auto mb-4">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                            {/* 背景圆环 */}
                            <circle
                              cx="40"
                              cy="40"
                              r="32"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              className="text-gray-200 dark:text-gray-700"
                            />
                            {/* 进度圆环 */}
                            <circle
                              cx="40"
                              cy="40"
                              r="32"
                              stroke="url(#progressGradient)"
                              strokeWidth="6"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 32}`}
                              strokeDashoffset={`${2 * Math.PI * 32 * (1 - searchProgress.current / searchProgress.total)}`}
                              className="transition-all duration-700 ease-out"
                            />
                            <defs>
                              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#4F46E5" />
                              </linearGradient>
                            </defs>
                          </svg>
                          {/* 中心数字 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              {searchProgress.current}
                            </span>
                          </div>
                        </div>
                        
                        {/* 文字说明 */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            持续搜索中
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            第 {searchProgress.current} 轮 / 共 {searchProgress.total} 轮
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            正在挖掘更多优质资源...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 错误信息 */}
              {error && (
                <div className="animate-slide-up">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">搜索出错</h3>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 后台搜索进度指示器 */}
              {searchResults && searchProgress.total > 0 && searchProgress.current > 1 && (
                <div className="animate-fade-in mb-6">
                  <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                      {/* 圆形进度指示器 */}
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                          {/* 背景圆环 */}
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-blue-200/50 dark:text-blue-800/50"
                          />
                          {/* 进度圆环 */}
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="url(#miniProgressGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - searchProgress.current / searchProgress.total)}`}
                            className="transition-all duration-700 ease-out"
                          />
                          <defs>
                            <linearGradient id="miniProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#4F46E5" />
                            </linearGradient>
                          </defs>
                        </svg>
                        {/* 中心图标 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* 文字信息 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            持续搜索中
                          </h4>
                          <span className="px-2 py-0.5 bg-blue-500/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                            {searchProgress.current}/{searchProgress.total}
                          </span>
                        </div>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                          正在后台挖掘更多资源，结果将实时更新
                        </p>
                      </div>
                      
                      {/* 动画点 */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: `${dot * 200}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 搜索结果 */}
              {searchResults && (
                <div className="animate-slide-up">
                  <SearchResults results={searchResults} />
                </div>
              )}
            </div>
          </main>
        )}

        <Footer />
        
        {/* PWA 安装提示 */}
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App