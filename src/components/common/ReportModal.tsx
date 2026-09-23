import React, { useState } from 'react';
import { Flag, X, AlertTriangle, Check } from 'lucide-react';
import { LegalStorage } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'comment' | 'profile' | 'job' | 'community' | 'message';
  targetId: string;
  targetTitle: string;
}

export const ReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}) => {
  const [reason, setReason] = useState<'Spam' | 'Harassment' | 'False Information' | 'Unauthorized Practice of Law' | 'Ethics Violation' | 'Fraud / Scam' | 'Other'>('Ethics Violation');
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;

    LegalStorage.createReport({
      targetType,
      targetId,
      targetTitle,
      reason,
      explanation: explanation.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setExplanation('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Confidential Content & Ethics Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-semibold text-slate-100 mb-1">
              Report Submitted to Ethics Committee
            </h4>
            <p className="text-sm text-slate-400">
              Our bar compliance administration will review this item in accordance with the platform's professional conduct policies.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-400 space-y-1">
              <span className="text-slate-300 font-medium block">Reporting Subject:</span>
              <p className="font-mono text-slate-300 line-clamp-2">"{targetTitle}"</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Basis of Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Ethics Violation">Ethics Violation (Model Rules of Professional Conduct)</option>
                <option value="Unauthorized Practice of Law">Unauthorized Practice of Law (UPL) / Unverified Claims</option>
                <option value="False Information">Misleading or Fabricated Case Citation / Legal Precedent</option>
                <option value="Harassment">Professional Harassment or Defamation</option>
                <option value="Spam">Commercial Solicitation / Irrelevant Spam</option>
                <option value="Fraud / Scam">Fraudulent Opportunity / Misrepresentation</option>
                <option value="Other">Other Policy Infraction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Specific Details & Context <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={3}
                placeholder="Please describe why this content contravenes professional legal ethics or platform standards..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!explanation.trim()}
                className="px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Transmit to Administrator
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
