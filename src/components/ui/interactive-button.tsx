'use client';

import { useState } from 'react';

interface InteractiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning';
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  primary: {
    default: '#606fe5',
    hover: '#5f6ee3',
  },
  success: {
    default: '#19a44b',
    hover: '#158a3d',
  },
  warning: {
    default: '#ffc20e',
    hover: '#e6ae0d',
  },
};

export function InteractiveButton({ 
  children, 
  variant = 'primary',
  className = '',
  onClick 
}: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const style = variantStyles[variant];

  return (
    <button
      type="button"
      className={`w-full px-4 py-2 text-white rounded transition-colors ${className}`}
      style={{
        backgroundColor: isHovered ? style.hover : style.default,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
