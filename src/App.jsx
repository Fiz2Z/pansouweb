import React, { useMemo, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchForm from './components/SearchForm'
import SearchResults, { SearchResultsSkeleton } from './components/SearchResults'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { ThemeProvider } from './contexts/ThemeContext'
import { searchNetdisk } from './services/api'

function App() {
  const [searchResults, setSearchResults] = useState(null)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showSearchCard, setShowSearchCard] = useState(false)
  const [selectedCloudTypes, setSelectedCloudTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedCloudTypes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const isHomepage = useMemo(() => !hasSearched && !error, [hasSearched, error])

  const handleCloudTypesChange = (cloudTypes) => {
    setSelectedCloudTypes(cloudTypes)
    localStorage.setItem('selectedCloudTypes', JSON.stringify(cloudTypes))
  }

  const handleSearch = async (searchParams) => {
    setHasSearched(true)
    setIsSearching(true)
    setError(null)
    setShowSearchCard(true)
    setSearchResults(null)

    try {
      const firstResults = await searchNetdisk(searchParams)
      setIsSearching(false)
      setSearchResults(firstResults)

      if (firstResults && Object.keys(firstResults.merged_by_type || {}).length > 0) {
        continueBackgroundSearch(searchParams)
      } else {
        setShowSearchCard(false)
      }
    } catch (err) {
      setIsSearching(false)
      setError(err.message || '搜索失败，请稍后重试')
      setShowSearchCard(false)
      setSearchResults(null)
    }
  }

  const continueBackgroundSearch = async (searchParams) => {
    try {
      for (let i = 2; i <= 4; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const results = await searchNetdisk(searchParams)

        setSearchResults((prevResults) => {
          if (!prevResults) return results

          const mergedResults = {
            ...prevResults,
            total: 0,
            merged_by_type: { ...prevResults.merged_by_type }
          }

          Object.keys(results.merged_by_type || {}).forEach((type) => {
            const prevLinks = mergedResults.merged_by_type[type] || []
            const newLinks = results.merged_by_type[type] || []
            const existingUrls = new Set(prevLinks.map((link) => link.url))
            const uniqueNewLinks = newLinks.filter((link) => !existingUrls.has(link.url))

            if (uniqueNewLinks.length > 0) {
              mergedResults.merged_by_type[type] = [...prevLinks, ...uniqueNewLinks]
            }
          })

          mergedResults.total = Object.values(mergedResults.merged_by_type).reduce(
            (sum, links) => sum + links.length,
            0
          )

          return mergedResults
        })
      }
    } catch {
      // silent background update failure
    } finally {
      setTimeout(() => {
        setShowSearchCard(false)
      }, 1500)
    }
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-cyan-300/35 blur-3xl dark:bg-cyan-700/20" />
          <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl dark:bg-indigo-700/25" />
          <div className="absolute bottom-10 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-700/20" />
        </div>

        <Header
          selectedCloudTypes={selectedCloudTypes}
          onCloudTypesChange={handleCloudTypesChange}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />

        {isHomepage ? (
          <main className="flex-1 px-4 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <section className="glass-card-strong rounded-3xl p-6 sm:p-8 lg:p-10 animate-fade-in">
                <div className="text-center max-w-3xl mx-auto">
                  <p className="text-sm font-semibold tracking-wide text-sky-700 dark:text-sky-300">PanSou Search Engine</p>
                  <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-primary leading-tight">
                    全网网盘资源搜索
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                    聚合主流网盘平台，一次输入，持续回填，快速定位你需要的资源。
                  </p>
                </div>

                <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
                  <SearchForm
                    onSearch={handleSearch}
                    isLoading={isSearching}
                    selectedCloudTypes={selectedCloudTypes}
                    keyword={keyword}
                    onKeywordChange={setKeyword}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                </div>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                  <span className="px-3 py-1.5 rounded-full border border-sky-200 dark:border-sky-700 bg-sky-50/80 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">多轮增量回填</span>
                  <span className="px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-700 bg-indigo-50/80 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">多平台聚合搜索</span>
                  <span className="px-3 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-700 bg-cyan-50/80 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300">支持安装到桌面</span>
                </div>
              </section>
            </div>
          </main>
        ) : (
          <main className="flex-1 px-4 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto space-y-6">
              <section className="glass-card rounded-3xl p-4 sm:p-6 animate-fade-in">
                <SearchForm
                  onSearch={handleSearch}
                  isLoading={isSearching}
                  selectedCloudTypes={selectedCloudTypes}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </section>

              {isSearching && (
                <section className="animate-fade-in">
                  <SearchResultsSkeleton />
                </section>
              )}

              {showSearchCard && (
                <section className="glass-card rounded-2xl p-4 sm:p-5 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">持续搜索中</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">正在后台挖掘更多资源，结果会实时增加</p>
                    </div>
                  </div>
                </section>
              )}

              {error && (
                <section className="rounded-2xl border p-4 animate-slide-up" style={{ background: 'var(--danger-bg)', borderColor: 'var(--danger-border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--danger-text)' }}>搜索出错</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--danger-text)' }}>{error}</p>
                </section>
              )}

              {searchResults && !isSearching && (
                <section className="animate-slide-up">
                  <SearchResults results={searchResults} />
                </section>
              )}
            </div>
          </main>
        )}

        <Footer />
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App
