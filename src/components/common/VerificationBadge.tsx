import React, { useState } from 'react';
import { VerificationStatus } from '../../types';
import { ShieldCheck, Clock, ShieldAlert, Award } from 'lucide-react';

interface Props {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({
  status,
  size = 'md',
  showLabel = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (status === 'not_verified') return null;

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const config = {
    verified: {
      icon: ShieldCheck,
      color: 'text-amber-400 hover:text-amber-300',
      badgeBg: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
      label: 'Verified Counsel',
      tooltip: 'Bar Registry Verified: Active bar license and good standing authenticated by registrar.',
    },
    pending: {
      icon: Clock,
      color: 'text-sky-400 hover:text-sky-300',
      badgeBg: 'bg-sky-950/40 border-sky-500/30 text-sky-300',
      label: 'Admissions Pending',
      tooltip: 'Bar admission credentials submitted. Pending registry authentication.',
    },
    rejected: {
      icon: ShieldAlert,
      color: 'text-rose-400 hover:text-rose-300',
      badgeBg: 'bg-rose-950/40 border-rose-500/30 text-rose-300',
      label: 'Unverified Practice',
      tooltip: 'Credentials require re-submission or bar roll verification review.',
    },
  }[status];

  if (!config) return null;
  const IconComponent = config.icon;

  return (
    <div
      className="relative inline-flex items-center cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      role="note"
      aria-label={config.label}
    >
      {showLabel ? (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded px-2 py-0.5 border text-xs ${config.badgeBg}`}
        >
          <IconComponent className={sizeClasses[size]} />
          <span className="font-display tracking-wide">{config.label}</span>
        </span>
      ) : (
        <span className={`inline-flex items-center ${config.color} transition-colors p-0.5`}>
          <IconComponent className={sizeClasses[size]} />
        </span>
      )}

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 text-xs bg-[#0E131E] border border-amber-500/30 text-slate-200 rounded shadow-2xl pointer-events-none animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1 font-display">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{config.label}</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">{config.tooltip}</p>
          <div className="w-2 h-2 bg-[#0E131E] border-r border-b border-amber-500/30 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};
