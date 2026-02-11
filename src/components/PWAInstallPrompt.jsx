import React, { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-[360px] z-40 glass-card-strong rounded-2xl p-4 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center">
            <Download className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">安装应用</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">支持离线访问和桌面快捷方式</p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="soft-button w-9 h-9 inline-flex items-center justify-center bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
          aria-label="关闭安装提示"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={handleInstall} className="brand-button flex-1 text-sm font-semibold cursor-pointer">
          立即安装
        </button>
        <button
          onClick={handleDismiss}
          className="soft-button px-3 text-sm text-slate-600 dark:text-slate-300 bg-white/75 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
        >
          稍后
        </button>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
