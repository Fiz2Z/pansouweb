import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

const SearchForm = ({ onSearch, isLoading, selectedCloudTypes, keyword, onKeywordChange, onOpenSettings }) => {
  const submitSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!keyword.trim() || isLoading) return

    onSearch({
      kw: keyword.trim(),
      cloud_types: selectedCloudTypes.length > 0 ? selectedCloudTypes : undefined
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={submitSearch} className="space-y-4">
        <label htmlFor="search-input" className="sr-only">
          搜索关键字
        </label>

        <div className="glass-card rounded-2xl p-2 sm:p-2.5">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="search-input"
                type="text"
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                placeholder="输入关键字，搜索网盘资源"
                className="w-full min-h-[52px] rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900 px-12 pr-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={!keyword.trim() || isLoading}
              className="brand-button min-w-[120px] px-5 text-sm sm:text-base font-semibold cursor-pointer"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Search className="w-4 h-4" aria-hidden="true" />
                {isLoading ? '搜索中...' : '立即搜索'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="soft-button px-3 sm:px-4 text-sm text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-2"
            aria-label="打开筛选设置"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            筛选设置
          </button>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {selectedCloudTypes.length > 0 ? `已筛选 ${selectedCloudTypes.length} 种资源类型` : '未设置筛选，将搜索所有类型'}
          </p>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
