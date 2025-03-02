'use client'

import React from 'react';
import { Button } from "@/components/ui/button";

interface SmartListsModeProps {
  isDarkMode: boolean;
}

export function SmartListsMode({ isDarkMode }: SmartListsModeProps) {
  const themeClass = isDarkMode ? 'bg-ftx-dark-blue text-white' : 'bg-white text-ftx-dark-blue';

  return (
    <div className={`p-4 ${themeClass}`}>
      <h1 className="text-2xl font-bold mb-4">Smart Lists</h1>
      <p className="mb-4">This feature is coming soon. Stay tuned!</p>
      <div className="p-6 border border-dashed rounded-lg flex items-center justify-center">
        <p className="text-center text-gray-500">Smart Lists will allow you to create and manage custom watchlists with advanced filtering options.</p>
      </div>
    </div>
  );
} 