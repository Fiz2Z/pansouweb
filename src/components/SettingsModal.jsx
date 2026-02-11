import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Settings, X } from 'lucide-react'

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
  { value: 'magnet', label: '磁力链接', color: 'bg-slate-500' },
  { value: 'torrent', label: 'Torrent', color: 'bg-slate-700' },
  { value: 'thunder', label: 'Thunder', color: 'bg-indigo-600' },
  { value: 'ed2k', label: 'ED2K链接', color: 'bg-slate-600' }
]

const badgeClassMap = {
  sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
}

const TypeGrid = ({ title, items, selected, onToggle, color = 'sky' }) => (
  <section>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">{title}</h3>
      <span className={`text-xs px-2 py-1 rounded-full ${badgeClassMap[color] || badgeClassMap.sky}`}>
        已选 {items.filter((item) => selected.includes(item.value)).length}
      </span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {items.map((item) => {
        const active = selected.includes(item.value)
        return (
          <label
            key={item.value}
            className={`group relative cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
              active
                ? 'border-sky-400 bg-sky-50 dark:border-sky-600 dark:bg-sky-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 hover:border-sky-300'
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(item.value)}
              className="sr-only"
              aria-label={`切换 ${item.label}`}
            />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${item.color} text-white text-xs font-bold flex items-center justify-center`}>
                {item.label.slice(0, 1)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{item.label}</span>
            </div>

            <span
              className={`absolute top-2 right-2 h-4 w-4 rounded-full border flex items-center justify-center ${
                active
                  ? 'bg-sky-500 border-sky-500 text-white'
                  : 'border-slate-300 dark:border-slate-600 text-transparent'
              }`}
            >
              <Check className="w-3 h-3" aria-hidden="true" />
            </span>
          </label>
        )
      })}
    </div>
  </section>
)

const SettingsModal = ({ selectedCloudTypes, onCloudTypesChange, isOpen, setIsOpen }) => {
  const [tempSelected, setTempSelected] = useState(selectedCloudTypes)

  useEffect(() => {
    setTempSelected(selectedCloudTypes)
  }, [selectedCloudTypes])

  const toggleCloudType = (cloudType) => {
    setTempSelected((prev) =>
      prev.includes(cloudType) ? prev.filter((type) => type !== cloudType) : [...prev, cloudType]
    )
  }

  const selectAll = () => {
    setTempSelected([...CLOUD_TYPES.map((t) => t.value), ...OTHER_TYPES.map((t) => t.value)])
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
      <button
        onClick={() => setIsOpen(true)}
        className="soft-button px-3 sm:px-3.5 text-sm text-slate-700 dark:text-slate-200 bg-white/75 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1.5"
        title="资源搜索设置"
        aria-label="打开资源搜索设置"
      >
        <Settings className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">设置</span>
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={handleCancel} />

            <div className="relative w-full sm:max-w-3xl rounded-t-3xl sm:rounded-2xl glass-card-strong border border-slate-200 dark:border-slate-700 max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-slide-up">
              <header className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center">
                    <Settings className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">搜索筛选设置</h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">可按平台和链接类型筛选</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="soft-button w-10 h-10 inline-flex items-center justify-center bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="关闭设置"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </header>

              <div className="px-4 sm:px-6 py-4 overflow-y-auto space-y-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="soft-button px-3 text-xs sm:text-sm bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700 cursor-pointer"
                  >
                    全部选择
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="soft-button px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    清空选择
                  </button>
                </div>

                <TypeGrid title="网盘平台" items={CLOUD_TYPES} selected={tempSelected} onToggle={toggleCloudType} color="sky" />
                <TypeGrid title="其他类型" items={OTHER_TYPES} selected={tempSelected} onToggle={toggleCloudType} color="indigo" />
              </div>

              <footer className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleCancel}
                    className="soft-button flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="brand-button flex-1 text-sm font-semibold cursor-pointer"
                  >
                    保存设置
                  </button>
                </div>
              </footer>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default SettingsModal
