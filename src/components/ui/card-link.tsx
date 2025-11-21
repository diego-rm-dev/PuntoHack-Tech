'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CardLinkProps {
  href: string;
  children: React.ReactNode;
  hoverColor?: string;
  hoverBg?: string;
}

export function CardLink({ 
  href, 
  children, 
  hoverColor = '#606fe5',
  hoverBg = '#ececfe'
}: CardLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className="p-4 border-2 rounded-lg transition-all"
      style={{
        borderColor: isHovered ? hoverColor : '#e2e4e9',
        backgroundColor: isHovered ? hoverBg : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
