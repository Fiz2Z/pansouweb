import React from 'react'

const Footer = () => {
  return (
    <footer className="px-4 pb-4 sm:px-5 lg:px-6 mt-2">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl px-4 sm:px-5 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-3">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">PanSou Web · 全网资源聚合搜索</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Built with React + Tailwind</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
