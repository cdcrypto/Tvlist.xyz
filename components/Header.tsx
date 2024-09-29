'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

const Logo = () => (
  <svg width="48" height="48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    {/* Top Rectangle */}
    <rect x="40" y="50" width="120" height="30" fill="#11A9BC"/>
    {/* Middle Rectangle */}
    <rect x="40" y="90" width="120" height="30" fill="#0C7C89"/>
    {/* Bottom Rectangle */}
    <rect x="40" y="130" width="120" height="30" fill="#09545C"/>

    {/* List Icon */}
    <circle cx="30" cy="65" r="5" fill="#FFFFFF"/>
    <circle cx="30" cy="105" r="5" fill="#FFFFFF"/>
    <circle cx="30" cy="145" r="5" fill="#FFFFFF"/>

    {/* Text Lines */}
    <rect x="50" y="60" width="100" height="10" fill="#FFFFFF"/>
    <rect x="50" y="100" width="100" height="10" fill="#FFFFFF"/>
    <rect x="50" y="140" width="100" height="10" fill="#FFFFFF"/>

    {/* Subtle Overlay */}
    <rect x="40" y="50" width="120" height="110" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
  </svg>
)

const Header: React.FC<{ isDarkMode: boolean; toggleDarkMode: () => void }> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <motion.header 
      className={`w-full py-4 px-6 ${isDarkMode ? 'bg-ftx-dark-blue text-white' : 'bg-white text-ftx-dark-blue'} shadow-md transition-colors duration-300`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
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
        </Link>
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