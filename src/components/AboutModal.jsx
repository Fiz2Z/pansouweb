import React, { useCallback, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { Github, Heart, Info, Link as LinkIcon, X } from 'lucide-react'
import { useDialogAccessibility } from '../hooks/useDialogAccessibility'

const AboutModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const descriptionId = useId()

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const dialogRef = useDialogAccessibility(isOpen, closeModal)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="soft-button px-3 sm:px-3.5 text-sm text-slate-700 dark:text-slate-200 bg-white/75 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1.5"
        title="关于"
        aria-label="查看关于信息"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Info className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">关于</span>
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="presentation">
            <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={closeModal} aria-hidden="true" />

            <div
              ref={dialogRef}
              className="relative w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl glass-card-strong border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col animate-slide-up"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              tabIndex={-1}
            >
              <header className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center">
                    <Info className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h2 id={titleId} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">关于项目</h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="soft-button w-10 h-10 inline-flex items-center justify-center bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="关闭关于弹窗"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </header>

              <div className="px-4 sm:px-6 py-5 overflow-y-auto space-y-4">
                <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/65 p-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">全网资源搜索</h3>
                  <p id={descriptionId} className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    一个专注网盘资源聚合检索的前端应用，支持持续回填与平台筛选。
                  </p>
                </section>

                <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/65 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">作者</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" />
                      Yuccc
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">项目仓库</span>
                    <a
                      href="https://github.com/YuuCccc/sousou"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 dark:text-sky-300"
                    >
                      <Github className="w-4 h-4" aria-hidden="true" />
                      GitHub
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">API 来源</span>
                    <a
                      href="https://github.com/fish2018/pansou"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 dark:text-sky-300"
                    >
                      <LinkIcon className="w-4 h-4" aria-hidden="true" />
                      PanSou
                    </a>
                  </div>
                </section>
              </div>

              <footer className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white/75 dark:bg-slate-900/70">
                <button
                  type="button"
                  onClick={closeModal}
                  className="soft-button w-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  关闭
                </button>
              </footer>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default AboutModal
