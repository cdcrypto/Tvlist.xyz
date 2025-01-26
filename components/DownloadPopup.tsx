import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function DownloadPopup({ isOpen, onClose, isDarkMode }: DownloadPopupProps) {
  const themeClass = isDarkMode ? 'bg-ftx-dark-blue-light text-white' : 'bg-white text-ftx-dark-blue';
  const buttonClass = isDarkMode 
    ? 'bg-ftx-teal hover:bg-opacity-90 text-white' 
    : 'bg-ftx-teal hover:bg-opacity-90 text-white';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${themeClass} rounded-lg p-6 w-full max-w-md relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Thank you for using our service!</h3>
        <p className="mb-6">
          Like our free and open source work? Try out our fastest pump.fun sniper!
        </p>
        
        <Button
          className={`w-full ${buttonClass} transition-colors duration-300`}
          onClick={() => window.open('https://rugger.ai', '_blank')}
        >
          Visit Rugger.ai
        </Button>
      </div>
    </div>
  );
}
