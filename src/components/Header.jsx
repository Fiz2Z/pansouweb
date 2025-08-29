import React from 'react'
import ThemeToggle from './ThemeToggle'
import SettingsModal from './SettingsModal'

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const Header = ({ selectedCloudTypes, onCloudTypesChange }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-primary-600 dark:text-primary-400">
              <Logo />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">网盘搜索</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <SettingsModal 
              selectedCloudTypes={selectedCloudTypes}
              onCloudTypesChange={onCloudTypesChange}
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
