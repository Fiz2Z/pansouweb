import React from 'react'
import { Github, Star, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            基于 PanSou API 构建
          </div>
          
          <a
            href="https://github.com/fish2018/pansou"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>开源项目</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.6k stars</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
