import React from 'react';
import prosperaLogo from './Prospera Master_WhiteBG_Color_Horizontal-Transparent.png';

interface ProsperaLogoProps {
  className?: string;
}

export const ProsperaLogo: React.FC<ProsperaLogoProps> = ({ className = '' }) => {
  return (
    <a
      href="https://www.prosperahq.io/ai-lab"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-80 ${className}`}
    >
      <img
        src={prosperaLogo}
        alt="PROSPERA"
        className="h-8 w-auto"
      />
    </a>
  );
};

