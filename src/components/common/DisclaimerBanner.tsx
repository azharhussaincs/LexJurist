import React, { useState } from 'react';
import { Scale, Info, X, ChevronDown, ChevronUp } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Professional Exclusivity and Regulatory Notice"
      className="bg-[#06090F] border-b border-[#1A2232] text-xs text-slate-400 py-1 px-4 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] truncate">
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300/90 font-display tracking-wider uppercase text-[10px] shrink-0">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Chambers Roll Notice</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-400 truncate">
            Restricted exclusively to licensed attorneys, accredited judicial faculty, and institutional counsel.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>{expanded ? 'Less' : 'Legal Scope'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto pt-2 pb-1.5 border-t border-[#151D2C] mt-1 text-[11px] text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-3">
          <p>
            LexJurist operates strictly as a peer knowledge and collegial networking medium. It does not provide legal representation, solicit client engagements, or substitute formal bar oversight.
          </p>
          <p>
            All member credentials remain subject to independent verification against respective state, national, or provincial bar registers.
          </p>
        </div>
      )}
    </aside>
  );
};
