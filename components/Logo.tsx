import React from 'react'

export const Logo: React.FC<{ width?: number; height?: number }> = ({ width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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