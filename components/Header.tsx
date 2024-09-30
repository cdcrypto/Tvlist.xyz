'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { useTheme } from 'next-themes';

interface HeaderProps {
  resetToHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ resetToHome }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  const handleGuideClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/guide');
  };

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <motion.header 
      className={`w-full py-4 px-6 ${isDarkMode ? 'bg-ftx-dark-blue text-white' : 'bg-white text-ftx-dark-blue'} shadow-md transition-colors duration-300`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" onClick={resetToHome} className="flex items-center space-x-2 group">
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
        <div className="flex items-center space-x-4">
          <Link href="/guide" onClick={handleGuideClick} className="hover:underline">Guide</Link>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;