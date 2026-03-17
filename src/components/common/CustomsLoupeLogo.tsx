import React from 'react';
import Image from 'next/image';

interface CustomsLoupeLogoProps {
  className?: string;
  size?: number;
}

export const CustomsLoupeLogo: React.FC<CustomsLoupeLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <Image 
      src="/customs-loupe-logo.png" 
      alt="Customs Loupe Logo" 
      width={size} 
      height={size} 
      className={className} 
      priority
    />
  );
};
