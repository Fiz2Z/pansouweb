import React, { useState, useEffect } from 'react'
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
  { value: 'magnet', label: '磁力链接', color: 'bg-gray-500' },
  { value: 'ed2k', label: 'ED2K链接', color: 'bg-gray-600' }
]

const SettingsModal = ({ selectedCloudTypes, onCloudTypesChange }) => {
  const [isOpen, setIsOpen] = useState(false)
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
    setTempSelected(CLOUD_TYPES.map(type => type.value))
  }

  const clearAll = () => {
    setTempSelected([])
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
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="搜索设置"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">设置</span>
      </button>

      {/* 模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">搜索设置</h2>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">网盘类型筛选</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={selectAll}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        全选
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        onClick={clearAll}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        清空
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {CLOUD_TYPES.map((cloudType) => (
                      <label
                        key={cloudType.value}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={tempSelected.includes(cloudType.value)}
                            onChange={() => toggleCloudType(cloudType.value)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            tempSelected.includes(cloudType.value)
                              ? 'bg-primary-600 border-primary-600'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {tempSelected.includes(cloudType.value) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-1">
                          <div className={`w-3 h-3 rounded-full ${cloudType.color}`}></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cloudType.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>提示：</strong>不选择任何网盘类型时，将搜索所有可用的网盘平台。选择特定类型可以缩小搜索范围。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingsModal
