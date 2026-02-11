import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Settings, X, Check } from 'lucide-react'

const CLOUD_TYPES = [
  { value: 'baidu', label: '百度网盘', color: 'bg-blue-500' },
  { value: 'aliyun', label: '阿里云盘', color: 'bg-orange-500' },
  { value: 'quark', label: '夸克网盘', color: 'bg-purple-500' },
  { value: 'tianyi', label: '天翼云盘', color: 'bg-red-500' },
  { value: 'uc', label: 'UC网盘', color: 'bg-green-500' },
  { value: '115', label: '115网盘', color: 'bg-yellow-500' },
  { value: 'pikpak', label: 'PikPak', color: 'bg-pink-500' },
  { value: 'xunlei', label: '迅雷网盘', color: 'bg-indigo-500' },
  { value: '123', label: '123网盘', color: 'bg-cyan-500' },
  { value: 'mobile', label: '移动云盘', color: 'bg-teal-500' },
  { value: 'lanzou', label: '蓝奏云盘', color: 'bg-blue-600' }
]

const OTHER_TYPES = [
  { value: 'magnet', label: '磁力链接', color: 'bg-gray-500' },
  { value: 'torrent', label: 'Torrent', color: 'bg-gray-700' },
  { value: 'thunder', label: 'Thunder', color: 'bg-indigo-600' },
  { value: 'ed2k', label: 'ED2K链接', color: 'bg-gray-600' }
]

const SettingsModal = ({ selectedCloudTypes, onCloudTypesChange, isOpen, setIsOpen }) => {
  const [tempSelected, setTempSelected] = useState(selectedCloudTypes)

  useEffect(() => {
    setTempSelected(selectedCloudTypes)
  }, [selectedCloudTypes])

  const toggleCloudType = (cloudType) => {
    setTempSelected(prev => 
      prev.includes(cloudType)
        ? prev.filter(type => type !== cloudType)
        : [...prev, cloudType]
    )
  }

  const selectAll = () => {
    setTempSelected([...CLOUD_TYPES.map(type => type.value), ...OTHER_TYPES.map(type => type.value)])
  }

  const clearAll = () => {
    setTempSelected([])
  }

  const selectAllCloudTypes = () => {
    const otherSelected = tempSelected.filter(type => OTHER_TYPES.some(ot => ot.value === type))
    setTempSelected([...CLOUD_TYPES.map(type => type.value), ...otherSelected])
  }

  const clearAllCloudTypes = () => {
    const otherSelected = tempSelected.filter(type => OTHER_TYPES.some(ot => ot.value === type))
    setTempSelected(otherSelected)
  }

  const selectAllOtherTypes = () => {
    const cloudSelected = tempSelected.filter(type => CLOUD_TYPES.some(ct => ct.value === type))
    setTempSelected([...cloudSelected, ...OTHER_TYPES.map(type => type.value)])
  }

  const clearAllOtherTypes = () => {
    const cloudSelected = tempSelected.filter(type => CLOUD_TYPES.some(ct => ct.value === type))
    setTempSelected(cloudSelected)
  }

  const handleSave = () => {
    onCloudTypesChange(tempSelected)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempSelected(selectedCloudTypes)
    setIsOpen(false)
  }

  return (
    <>
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl backdrop-blur-sm transition-all duration-200 min-h-[42px]"
        title="资源搜索设置"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">设置</span>
      </button>

      {/* 弹窗模态框 */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          {/* 毛玻璃背景 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleCancel}
          />
          
          {/* 弹窗内容 */}
          <div 
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 animate-slide-up flex flex-col"
            style={{ 
              maxHeight: 'calc(100vh - 1.5rem)',
              height: 'auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">资源搜索设置</h2>
              </div>
              <button
                onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100vh - 184px)' }}>
              

              {/* 网盘平台操作按钮 */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">网盘平台</h4>
                <div className="flex gap-1">
                  <button
                    onClick={selectAllCloudTypes}
                    className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    全选
                  </button>
                  <button
                    onClick={clearAllCloudTypes}
                    className="px-2 py-0.5 text-xs bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    清空
                  </button>
                </div>
              </div>

              {/* 网盘类型网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
                {CLOUD_TYPES.map((cloudType) => (
                  <label
                    key={cloudType.value}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      tempSelected.includes(cloudType.value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tempSelected.includes(cloudType.value)}
                      onChange={() => toggleCloudType(cloudType.value)}
                      className="sr-only"
                    />
                    
                    {/* 网盘图标 */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cloudType.color} text-white text-sm font-bold`}>
                      {cloudType.label.charAt(0)}
                    </div>

                    {/* 网盘名称 */}
                      <span className={`text-xs font-medium text-center transition-colors break-all ${
                        tempSelected.includes(cloudType.value)
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {cloudType.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* 其他类型筛选 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">其他类型</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={selectAllOtherTypes}
                      className="px-2 py-0.5 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                    >
                      全选
                    </button>
                    <button
                      onClick={clearAllOtherTypes}
                      className="px-2 py-0.5 text-xs bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      清空
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {OTHER_TYPES.map((otherType) => (
                    <label
                      key={otherType.value}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        tempSelected.includes(otherType.value)
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={tempSelected.includes(otherType.value)}
                        onChange={() => toggleCloudType(otherType.value)}
                        className="sr-only"
                      />
                      
                      {/* 类型图标 */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${otherType.color} text-white text-sm font-bold`}>
                        {otherType.label.charAt(0)}
                      </div>

                      {/* 类型名称 */}
                      <span className={`text-xs font-medium text-center transition-colors break-all ${
                        tempSelected.includes(otherType.value)
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {otherType.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 提示信息 */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">💡</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-semibold">提示：</span>不选择任何资源类型时，将搜索所有可用的平台。选择特定类型可以缩小搜索范围，提高搜索精度。
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      当前已选择 <span className="font-semibold">{tempSelected.length}</span> 种资源类型
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 sticky bottom-0 bg-white dark:bg-gray-800">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default SettingsModal
