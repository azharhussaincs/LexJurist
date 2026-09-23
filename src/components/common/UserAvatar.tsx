import React from 'react';
import { VerificationStatus } from '../../types';

interface Props {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verificationStatus?: VerificationStatus;
  className?: string;
}

export const UserAvatar: React.FC<Props> = ({
  name,
  avatarUrl,
  size = 'md',
  verificationStatus,
  className = '',
}) => {
  const getInitials = (n: string) => {
    const cleaned = n.replace(/^(Hon\.|Prof\.|Dean|Justice|Judge)\s+/i, '').replace(/,\s*(Esq\.|FCIArb|KC|J\.D\.|LL\.M\.)/gi, '');
    const parts = cleaned.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || 'L').toUpperCase();
  };

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-semibold',
    lg: 'w-13 h-13 text-sm font-semibold',
    xl: 'w-20 h-20 text-lg font-bold',
  };

  // Color generator for dignified legal hues (ebony, deep sapphire, dark mahogany, midnight slate)
  const getHue = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const palettes = [
      'bg-gradient-to-br from-[#1A202C] to-[#0D1117] text-amber-200/90 border-[#2D3748]',
      'bg-gradient-to-br from-[#101F33] to-[#0A1220] text-sky-200/90 border-[#1E3A5F]',
      'bg-gradient-to-br from-[#1C1917] to-[#0C0A09] text-amber-300/90 border-[#3F362F]',
      'bg-gradient-to-br from-[#14231E] to-[#0B1512] text-emerald-200/90 border-[#1F3D32]',
    ];
    return palettes[Math.abs(hash) % palettes.length];
  };

  const styleClasses = getHue(name);
  const isVerified = verificationStatus === 'verified';

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`rounded-full flex items-center justify-center border shadow-inner select-none font-display tracking-wider ${styleClasses} ${
          isVerified ? 'ring-1 ring-amber-500/40 ring-offset-1 ring-offset-[#090D14]' : ''
        } ${sizeMap[size]}`}
      >
        <span>{getInitials(name)}</span>
      </div>

      {isVerified && size !== 'xs' && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-[#090D14] rounded-full flex items-center justify-center text-[8px] text-slate-950 font-extrabold shadow-sm"
          title="Verified Bar Enrolled Advocate"
        >
          ✓
        </span>
      )}
    </div>
  );
};
