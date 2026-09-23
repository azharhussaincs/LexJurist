import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { VerificationBadge } from '../common/VerificationBadge';
import {
  Users,
  Bookmark,
  Shield,
  Award,
  ChevronRight,
  Sparkles,
  Scale,
  Briefcase,
  FileCheck
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const LeftSidebar: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, isVerified, verificationStatus } = useAuth();

  const profile = currentUser.lawyerProfile;
  const isLawyer = currentUser.role === 'lawyer';

  // Calculate profile completion percentage
  let completionScore = 55;
  if (profile?.barAdmissions?.length) completionScore += 20;
  if (profile?.experience?.length) completionScore += 15;
  if (profile?.education?.length) completionScore += 5;
  if (isVerified) completionScore += 5;
  completionScore = Math.min(100, completionScore);

  const primaryBar = profile?.barAdmissions?.[0];

  return (
    <aside aria-label="Profile and chambers credentials" className="space-y-4">
      {/* Chambers Identity Card */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 shadow-sm">
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#172030]">
          <div className="relative mb-3">
            <UserAvatar
              name={currentUser.fullName}
              size="lg"
              verificationStatus={verificationStatus}
            />
          </div>

          <h3 className="font-semibold text-base text-slate-100 font-display tracking-wide">
            {currentUser.fullName}
          </h3>

          <div className="mt-1.5">
            <VerificationBadge status={verificationStatus} showLabel size="sm" />
          </div>

          <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {profile?.title || currentUser.organizationProfile?.tagline || 'Advocate & Counsel'}
          </p>
          <p className="text-xs font-medium text-amber-400/90 mt-0.5">
            {profile?.firmOrOrganization || currentUser.organizationProfile?.name}
          </p>

          {/* Bar Roll Identifier */}
          {primaryBar && (
            <div className="mt-2 text-[10px] font-mono text-slate-500 bg-[#080C14] px-2 py-1 rounded border border-[#1A2333]">
              <span>{primaryBar.jurisdiction} · Roll #{primaryBar.licenseNumber}</span>
            </div>
          )}

          <button
            onClick={() => onNavigate(`/profile/${currentUser.id}`)}
            className="mt-3.5 w-full py-1.5 px-3 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs font-medium text-slate-200 border border-[#1E293B] hover:border-amber-500/30 transition-colors"
          >
            Chambers Profile Dossier
          </button>
        </div>

        {/* Profile Completion Bar */}
        {isLawyer && (
          <div className="py-3 border-b border-[#172030] text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-display uppercase tracking-wider">Credential Standing</span>
              <span className="font-mono-data text-amber-400 text-xs font-semibold">{completionScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#090D14] rounded-full overflow-hidden border border-[#1A2538]">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 rounded-full"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            {!isVerified && (
              <button
                onClick={() => onNavigate('/settings')}
                className="mt-2 text-[11px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3 h-3" />
                <span>Submit Bar Admission Roll Card</span>
              </button>
            )}
          </div>
        )}

        {/* Quick Nav metrics */}
        <div className="pt-2 space-y-1 text-xs">
          <button
            onClick={() => onNavigate('/connections')}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-[#131B2A] text-slate-300 hover:text-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400/80" />
              <span>Colleague Network</span>
            </span>
            <span className="font-mono-data text-slate-400 font-medium">
              {profile?.connectionsCount || 120}
            </span>
          </button>

          <button
            onClick={() => onNavigate('/saved')}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-[#131B2A] text-slate-300 hover:text-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>Saved Precedents & Briefs</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Practice Communities Quick Links */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm text-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#172030]">
          <h4 className="font-semibold text-slate-200 font-display tracking-wider uppercase text-[11px]">
            Affiliated Chambers
          </h4>
          <button
            onClick={() => onNavigate('/communities')}
            className="text-[11px] text-amber-400 hover:text-amber-300"
          >
            Directory
          </button>
        </div>
        <div className="space-y-1 text-slate-400">
          <button
            onClick={() => onNavigate('/communities/comm-corp-ma')}
            className="w-full text-left py-1 px-1.5 rounded hover:bg-[#131B2A] hover:text-slate-200 truncate block transition-colors font-sans text-xs"
          >
            Corporate M&A & Private Equity
          </button>
          <button
            onClick={() => onNavigate('/communities/comm-appellate')}
            className="w-full text-left py-1 px-1.5 rounded hover:bg-[#131B2A] hover:text-slate-200 truncate block transition-colors font-sans text-xs"
          >
            Supreme Court & Appellate Forum
          </button>
          <button
            onClick={() => onNavigate('/communities/comm-ip-tech')}
            className="w-full text-left py-1 px-1.5 rounded hover:bg-[#131B2A] hover:text-slate-200 truncate block transition-colors font-sans text-xs"
          >
            Intellectual Property & Technology
          </button>
        </div>
      </div>
    </aside>
  );
};
