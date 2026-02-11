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
  const [showSearchCard, setShowSearchCard] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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
    setError(null)
    setShowSearchCard(true)

    // 立即显示空的搜索结果页面，避免页面跳转
    setSearchResults({ merged_by_type: {}, total: 0 })

    try {
      // 第一次搜索
      console.log('开始第 1 次搜索...')

      const firstResults = await searchNetdisk(searchParams)
      console.log('第 1 次搜索结果:', firstResults)

      // 更新为真实的搜索结果
      setSearchResults(firstResults)

      // 如果有结果，继续后台搜索；如果没有结果，也保持在搜索结果页面
      if (firstResults && Object.keys(firstResults.merged_by_type || {}).length > 0) {
        // 后台继续搜索剩余3次
        continueBackgroundSearch(searchParams, firstResults)
      } else {
        // 没有结果时也停留在搜索结果页面，隐藏搜索卡片
        setShowSearchCard(false)
      }

    } catch (err) {
      setError(err.message || '搜索失败，请稍后重试')
      console.error('搜索错误:', err)
      setShowSearchCard(false)
      // 保持在搜索结果页面，显示错误信息
      setSearchResults({ merged_by_type: {}, total: 0 })
    }
  }

  const continueBackgroundSearch = async (searchParams, initialResults) => {
    try {
      // 后台静默搜索2-4轮
      for (let i = 2; i <= 4; i++) {
        console.log(`后台第 ${i} 次搜索...`)

        try {
          // 间隔2秒再搜索
          await new Promise(resolve => setTimeout(resolve, 2000))

          const results = await searchNetdisk(searchParams)
          console.log(`第 ${i} 次搜索结果:`, results)

          // 静默增量更新结果
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
                console.log(`${type} 静默新增 ${uniqueNewLinks.length} 条资源`)
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

      console.log('后台搜索全部完成！')

    } catch (err) {
      console.error('后台搜索错误:', err)
    } finally {
      // 延迟隐藏搜索卡片
      setTimeout(() => {
        setShowSearchCard(false)
      }, 2000)
    }
  }

  const isHomepage = !searchResults && !isLoading && !error

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#eef2ff_40%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_45%,_#020617_100%)]">
        <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-cyan-300/35 blur-3xl dark:bg-cyan-700/20" />
        <div className="pointer-events-none absolute top-12 right-0 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-700/20" />
        <div className="pointer-events-none absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-700/20" />
        <Header
          selectedCloudTypes={selectedCloudTypes}
          onCloudTypesChange={handleCloudTypesChange}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />

        {/* 首页状态 */}
        {isHomepage && (
          <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-10 md:py-12">
            <div className="text-center w-full max-w-5xl">
              {/* 主标题区域 */}
              <div className="mb-7 sm:mb-10 animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gradient-primary mb-4 leading-tight">
                  全网资源搜索
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-body px-2">
                  高效搜索全网资源,一站式覆盖主流网盘平台
                </p>
              </div>

              {/* 搜索表单 */}
              <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-10 animate-fade-in animation-delay-200">
                <SearchForm
                  onSearch={handleSearch}
                  isLoading={false}
                  selectedCloudTypes={selectedCloudTypes}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </div>

              {/* 项目特点 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto animate-fade-in animation-delay-400">
                <div className="group text-center p-5 sm:p-6 rounded-2xl bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl border border-white/70 dark:border-slate-700/70 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold font-heading text-slate-900 dark:text-white mb-1">极速搜索</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body">毫秒级响应</p>
                </div>

                <div className="group text-center p-5 sm:p-6 rounded-2xl bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl border border-white/70 dark:border-slate-700/70 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold font-heading text-slate-900 dark:text-white mb-1">11+ 平台</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body">全面覆盖</p>
                </div>

                <div className="group text-center p-5 sm:p-6 rounded-2xl bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl border border-white/70 dark:border-slate-700/70 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold font-heading text-slate-900 dark:text-white mb-1">安全可靠</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body">无需注册</p>
                </div>

                <div className="group text-center p-5 sm:p-6 rounded-2xl bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl border border-white/70 dark:border-slate-700/70 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold font-heading text-slate-900 dark:text-white mb-1">PWA 支持</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-body">离线可用</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* 搜索状态页面 */}
        {!isHomepage && (
          <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-5 lg:px-6 max-w-6xl">
            <div className="py-6 sm:py-8 space-y-6 sm:space-y-8">
              {/* 搜索表单 */}
              <div className="animate-fade-in">
                <SearchForm
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  selectedCloudTypes={selectedCloudTypes}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </div>



              {/* 后台搜索进度卡片 */}
              {searchResults && showSearchCard && (
                <div className="animate-fade-in mb-4 sm:mb-6">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                    <div className="flex items-center p-4 sm:p-5">
                      {/* 搜索图标动画 */}
                      <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 mr-3 sm:mr-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-blue-500/30 rounded-xl animate-ping"></div>
                      </div>

                      {/* 信息区域 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold font-heading text-gray-900 dark:text-white">
                            持续搜索中
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-body">
                          正在后台挖掘更多资源,结果将实时更新
                        </p>
                      </div>

                      {/* 状态指示 */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"
                              style={{ animationDelay: `${dot * 150}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
