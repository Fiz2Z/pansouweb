import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="soft-button w-11 h-11 inline-flex items-center justify-center bg-white/75 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark ? <Sun className="w-[18px] h-[18px] text-amber-400" aria-hidden="true" /> : <Moon className="w-[18px] h-[18px] text-slate-700" aria-hidden="true" />}
    </button>
  )
}

export default ThemeToggle
