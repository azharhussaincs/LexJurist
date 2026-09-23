import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  Shield,
  Lock,
  Eye,
  Award,
  Bell,
  CheckCircle,
  FileText,
  Upload,
  Scale,
  Check
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const SettingsPage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, isVerified, verificationStatus, updateCurrentUser } = useAuth();
  const profile = currentUser.lawyerProfile;

  const [visibility, setVisibility] = useState<'public' | 'members_only' | 'connections_only'>(
    currentUser.privacySettings?.profileVisibility || 'public'
  );
  const [messagesPerm, setMessagesPerm] = useState<'everyone' | 'connections_only'>(
    currentUser.privacySettings?.whoCanMessage || 'connections_only'
  );

  // Bar credential form
  const [barCouncil, setBarCouncil] = useState('New York State Bar Association');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('New York, USA');
  const [admissionYear, setAdmissionYear] = useState('2018');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      privacySettings: {
        ...currentUser.privacySettings,
        profileVisibility: visibility,
        whoCanMessage: messagesPerm,
      },
    };

    updateCurrentUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber.trim()) return;

    LegalStorage.createVerificationRequest({
      barCouncil,
      licenseNumber: licenseNumber.trim(),
      jurisdiction,
      admissionYear: parseInt(admissionYear, 10) || 2018,
      documentUrl: 'Certificate_of_Good_Standing_2026.pdf',
    });

    setVerificationSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#1A2333]">
        <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Judicial Compliance & Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
          Chambers Compliance & Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Manage your official bar roll credentials, jurisdictional privacy boundaries, and inter-counsel messaging protocols.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Professional confidentiality and visibility settings updated successfully.</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#172030]">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100 font-display">
                Official Bar Admission Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Official status requires license verification against active court and bar council rosters.
              </p>
            </div>
          </div>

          <VerificationBadge status={verificationStatus} showLabel size="md" />
        </div>

        {isVerified ? (
          <div className="p-4 rounded bg-[#090D14] border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
            <span className="font-semibold flex items-center gap-1.5 font-display">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Full Peer Verification Active</span>
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              Your bar admissions credentials have been verified by the compliance administration. Your chambers dossier displays the Gold Verification Seal.
            </p>
          </div>
        ) : verificationSubmitted ? (
          <div className="p-4 rounded bg-[#090D14] border border-amber-500/30 text-xs text-amber-300 space-y-1">
            <span className="font-semibold font-display">Verification Credentials Transmitted</span>
            <p className="text-slate-400 font-sans leading-relaxed">
              The compliance registry is reviewing your bar number against the active court roll. You will receive an alert once authenticated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitVerification} className="space-y-3.5 text-xs pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-400 mb-1">
                  Licensing Authority / Bar Association
                </label>
                <input
                  type="text"
                  required
                  value={barCouncil}
                  onChange={(e) => setBarCouncil(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-400 mb-1">
                  Admitted Jurisdiction / Court
                </label>
                <input
                  type="text"
                  required
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-400 mb-1">
                  Official Bar Roll / License Number
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. NY-4892103"
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-400 mb-1">
                  Year of Bar Admission
                </label>
                <input
                  type="number"
                  value={admissionYear}
                  onChange={(e) => setAdmissionYear(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="p-3 bg-[#080C13] border border-[#172030] rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-[11px] text-slate-300">Certificate_of_Good_Standing.pdf</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Validated</span>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow"
            >
              Submit Credentials for Bar Authentication
            </button>
          </form>
        )}
      </div>

      {/* Privacy Boundaries Form */}
      <form onSubmit={handleSavePrivacy} className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 space-y-4 shadow-sm">
        <div className="pb-3 border-b border-[#172030]">
          <h3 className="text-sm font-semibold text-slate-100 font-display">
            Confidentiality & Discursive Boundaries
          </h3>
          <p className="text-xs text-slate-400">
            Configure profile discovery parameters in compliance with your firm's communications policy.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider text-slate-400 mb-1.5">
              Chambers Profile Visibility
            </label>
            <div className="space-y-2">
              {[
                { id: 'public', label: 'All Verified Legal Professionals', desc: 'Visible to all authenticated advocates and law firm partners' },
                { id: 'members_only', label: 'Admitted Practice Groups Only', desc: 'Restricted to colleagues enrolled in your shared substantive sections' },
                { id: 'connections_only', label: 'Direct Collegial Roll Only', desc: 'Private to mutually accepted legal connections' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-[#131B2A] transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value={opt.id}
                    checked={visibility === opt.id}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="mt-0.5 text-amber-500 bg-[#080C13] border-[#1E293B]"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">{opt.label}</span>
                    <span className="text-[11px] text-slate-400">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#172030]">
            <label className="block text-[10px] font-display uppercase tracking-wider text-slate-400 mb-1.5">
              Privileged Messaging Permissions
            </label>
            <div className="space-y-2">
              {[
                { id: 'everyone', label: 'Any Verified Legal Professional', desc: 'Allows direct consultation requests from any enrolled advocate' },
                { id: 'connections_only', label: 'Connected Colleagues Only', desc: 'Requires prior collegial connection acceptance before messaging' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-[#131B2A] transition-colors">
                  <input
                    type="radio"
                    name="messagesPerm"
                    value={opt.id}
                    checked={messagesPerm === opt.id}
                    onChange={(e) => setMessagesPerm(e.target.value as any)}
                    className="mt-0.5 text-amber-500 bg-[#080C13] border-[#1E293B]"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">{opt.label}</span>
                    <span className="text-[11px] text-slate-400">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#172030] flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Save Chambers Settings
          </button>
        </div>
      </form>
    </div>
  );
};
