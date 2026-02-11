import React, { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import SettingsModal from './SettingsModal'
import AboutModal from './AboutModal'
import { checkApiHealth } from '../services/api'

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const Header = ({ selectedCloudTypes, onCloudTypesChange, isSettingsOpen, setIsSettingsOpen }) => {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkApiHealth()
        setApiStatus('online')
      } catch {
        setApiStatus('offline')
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const statusConfig = {
    online: { dot: 'bg-emerald-500', text: '服务正常' },
    offline: { dot: 'bg-rose-500', text: '服务离线' },
    checking: { dot: 'bg-amber-500', text: '状态检查中' }
  }

  const currentStatus = statusConfig[apiStatus] || statusConfig.checking

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-5 lg:px-6">
      <div className="glass-card rounded-2xl max-w-6xl mx-auto px-3 sm:px-4 lg:px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md flex items-center justify-center shrink-0">
              <Logo />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">全网资源搜索</h1>
              <div className="hidden sm:flex items-center gap-2 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${currentStatus.dot} ${apiStatus === 'checking' ? 'animate-pulse' : ''}`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentStatus.text}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SettingsModal
              selectedCloudTypes={selectedCloudTypes}
              onCloudTypesChange={onCloudTypesChange}
              isOpen={isSettingsOpen}
              setIsOpen={setIsSettingsOpen}
            />
            <AboutModal />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
