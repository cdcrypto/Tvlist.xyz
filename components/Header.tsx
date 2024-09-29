'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { Logo } from './Logo'
import LogoSVG from '../app/favicon.svg' // Import the SVG file

const Header: React.FC<{ 
  isDarkMode: boolean; 
  toggleDarkMode: () => void;
  resetToHome: () => void;
}> = ({ isDarkMode, toggleDarkMode, resetToHome }) => {
  return (
    <motion.header 
      className={`w-full py-4 px-6 ${isDarkMode ? 'bg-ftx-dark-blue text-white' : 'bg-white text-ftx-dark-blue'} shadow-md transition-colors duration-300`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={resetToHome} className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg overflow-hidden p-1"
          >
            <Logo />
          </motion.div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-ftx-teal" style={{ letterSpacing: '-0.05em' }}>
              TLX
            </span>
            <span className="ml-2 text-sm font-light">
              Tradingview List Xpress
            </span>
          </div>
        </button>
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-ftx-dark-blue-light text-ftx-teal' : 'bg-ftx-light-gray text-ftx-dark-blue'} transition-colors duration-300`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header;