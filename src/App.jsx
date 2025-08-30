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

    try {
      const results = await searchNetdisk(searchParams)
      console.log('搜索结果:', results)
      setSearchResults(results)
    } catch (err) {
      setError(err.message || '搜索失败，请稍后重试')
      console.error('搜索错误:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const isHomepage = !searchResults && !isLoading && !error

  return (
    <ThemeProvider>
      <div className={`${isHomepage ? 'h-screen homepage-no-scroll' : 'min-h-screen'} flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900`}>
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
                />
              </div>

              {/* 加载状态 */}
              {isLoading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
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
              {searchResults && !isLoading && (
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