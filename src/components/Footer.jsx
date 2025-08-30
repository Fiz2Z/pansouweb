import React from 'react'
import { Github, Star, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 mt-auto">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ by <span className="font-semibold text-blue-600 dark:text-blue-400">Yuccc</span>
            <span className="mx-2">•</span>
            基于 <a
              href="https://github.com/fish2018/pansou"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline"
            >
              PanSou API
            </a> 构建
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
