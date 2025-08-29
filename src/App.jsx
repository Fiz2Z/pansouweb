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

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header 
          selectedCloudTypes={selectedCloudTypes}
          onCloudTypesChange={handleCloudTypesChange}
        />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">搜索出错</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
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

          {/* 空状态 */}
          {!searchResults && !isLoading && !error && (
            <div className="text-center py-12 animate-fade-in">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索网盘资源</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                输入关键词，选择需要搜索的网盘类型，即可快速找到您需要的资源
              </p>
            </div>
          )}
          </div>
        </main>

        <Footer />
        
        {/* PWA 安装提示 */}
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App
