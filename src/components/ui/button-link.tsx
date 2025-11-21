'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  primary: {
    default: '#606fe5',
    hover: '#5f6ee3',
    border: 'transparent',
    borderHover: 'transparent',
    text: '#ffffff',
    textHover: '#ffffff',
  },
  secondary: {
    default: 'transparent',
    hover: 'transparent',
    border: '#e2e4e9',
    borderHover: '#606fe5',
    text: '#0b0d0e',
    textHover: '#606fe5',
  },
  success: {
    default: '#19a44b',
    hover: '#158a3d',
    border: 'transparent',
    borderHover: 'transparent',
    text: '#ffffff',
    textHover: '#ffffff',
  },
  warning: {
    default: '#ffc20e',
    hover: '#e6ae0d',
    border: 'transparent',
    borderHover: 'transparent',
    text: '#ffffff',
    textHover: '#ffffff',
  },
};

export function ButtonLink({ 
  href, 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: ButtonLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const style = variantStyles[variant];

  return (
    <Link
      href={href}
      className={`${sizeClasses[size]} rounded-lg ${variant === 'secondary' ? 'border-2' : 'shadow-lg hover:shadow-xl'} transition-all font-semibold ${className}`}
      style={{
        backgroundColor: variant === 'secondary' ? style.default : (isHovered ? style.hover : style.default),
        borderColor: isHovered ? style.borderHover : style.border,
        color: isHovered ? style.textHover : style.text,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
