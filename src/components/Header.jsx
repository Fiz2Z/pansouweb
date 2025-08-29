import React from 'react'
import ThemeToggle from './ThemeToggle'
import SettingsModal from './SettingsModal'

const Header = ({ selectedCloudTypes, onCloudTypesChange }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
