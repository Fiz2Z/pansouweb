import React, { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import SettingsModal from './SettingsModal'
import AboutModal from './AboutModal'
import { checkApiHealth } from '../services/api'

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const Header = ({ selectedCloudTypes, onCloudTypesChange, isSettingsOpen, setIsSettingsOpen }) => {
  const [apiStatus, setApiStatus] = useState('checking') // 'checking', 'online', 'offline'

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkApiHealth()
        setApiStatus('online')
      } catch (error) {
        setApiStatus('offline')
      }
    }

    checkHealth()
    // 每30秒检查一次
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online': return 'bg-green-400'
      case 'offline': return 'bg-red-400'
      default: return 'bg-yellow-400'
    }
  }

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online': return 'API 正常'
      case 'offline': return 'API 离线'
      default: return '检查中...'
    }
  }

  return (
    <header className="border-b border-gray-200/40 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/30 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-5 lg:px-6 py-3 sm:py-4 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center min-w-0 gap-2 sm:gap-3">
            <div className="text-primary-600 dark:text-primary-400">
              <Logo />
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">全网资源搜索</h1>
            
            {/* API状态指示器 */}
            <div className="flex items-center space-x-2 ml-1 sm:ml-3">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${apiStatus === 'checking' ? 'animate-pulse' : ''}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">
                {getStatusText()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
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
