import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { ReportModal } from '../components/common/ReportModal';
import { PostCard } from '../components/feed/PostCard';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Share2,
  Flag,
  UserPlus,
  MessageSquare,
  Calendar,
  Check,
  Edit3,
  ShieldCheck,
  Scale,
  Building,
  BookOpen
} from 'lucide-react';

interface Props {
  userId?: string;
  onNavigate: (route: string) => void;
}

export const ProfilePage: React.FC<Props> = ({ userId, onNavigate }) => {
  const { currentUser } = useAuth();
  const targetId = userId || currentUser.id;
  const user = LegalStorage.getUserById(targetId) || currentUser;

  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'admissions' | 'posts' | 'network'>('about');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const isSelf = user.id === currentUser.id;
  const profile = user.lawyerProfile;
  const orgProfile = user.organizationProfile;

  // Connections status
  const connections = LegalStorage.getConnections();
  const isConnected = connections.some(
    (c) =>
      c.status === 'accepted' &&
      ((c.senderId === currentUser.id && c.receiverId === user.id) ||
        (c.senderId === user.id && c.receiverId === currentUser.id))
  );
  const isPending = connections.some(
    (c) => c.status === 'pending' && c.senderId === currentUser.id && c.receiverId === user.id
  ) || requestSent;

  // Posts authored by this user
  const userPosts = LegalStorage.getPosts().filter((p) => p.authorId === user.id);

  const handleConnect = () => {
    LegalStorage.sendConnectionRequest(user.id, 'Colleague, I would like to connect with your practice on LexJurist.');
    setRequestSent(true);
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header Banner Card */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg shadow-sm overflow-hidden">
        {/* Cover strip */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#070A0F] via-[#101724] to-[#1F170D] relative border-b border-[#1C2638]">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="px-3 py-1.5 rounded bg-[#090D14]/90 hover:bg-[#121926] text-slate-200 border border-[#1E293B] text-xs font-medium flex items-center gap-1.5 transition-colors shadow"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isCopied ? 'Link Copied' : 'Share Chambers Link'}</span>
            </button>
            {!isSelf && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="p-1.5 rounded bg-[#090D14]/90 hover:bg-[#121926] text-slate-400 hover:text-rose-400 border border-[#1E293B] transition-colors shadow"
                title="Report Profile for Ethics / UPL Violation"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="ring-4 ring-[#0D121B] rounded-full bg-[#0D121B] shadow-xl">
                <UserAvatar
                  name={user.fullName}
                  size="xl"
                  verificationStatus={profile?.verificationStatus}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-100 tracking-wide">
                    {user.fullName}
                  </h1>
                  {profile && <VerificationBadge status={profile.verificationStatus} showLabel size="md" />}
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {profile?.title || orgProfile?.tagline}
                </p>
                <p className="text-xs font-semibold text-amber-400/90 font-display">
                  {profile?.firmOrOrganization || orgProfile?.name}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isSelf ? (
                <button
                  onClick={() => onNavigate('/settings')}
                  className="w-full sm:w-auto px-4 py-2 rounded bg-[#131B2A] hover:bg-[#1A2538] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#1E293B]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Chambers Dossier</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('/messages')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded bg-[#131B2A] hover:bg-[#1A2538] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#1E293B]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Confidential Message</span>
                  </button>

                  <button
                    onClick={handleConnect}
                    disabled={isConnected || isPending}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isConnected
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : isPending
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : isPending ? (
                      <span>Invitation Pending</span>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick metadata line */}
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-3 border-t border-[#172030]">
            {profile && (
              <>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profile.location.city}, {profile.location.country}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono-data">{profile.yearsOfExperience} Years Practice</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-amber-400/90">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{profile.primaryPracticeArea}</span>
                </span>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Firm Profile</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-t border-[#1A2333] bg-[#0A0E17]/60 text-xs overflow-x-auto">
          {[
            { id: 'about', label: 'Chambers Biography' },
            { id: 'admissions', label: 'Bar Admissions & Roll' },
            { id: 'experience', label: 'Experience & Credentials' },
            { id: 'posts', label: `Published Memoranda (${userPosts.length})` },
            { id: 'network', label: 'Colleague Roll' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 font-medium transition-colors border-b-2 whitespace-nowrap font-display tracking-wider text-[11px] uppercase ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panes */}
      <div className="space-y-6">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5">
                <h3 className="text-xs font-display uppercase tracking-widest text-slate-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Advocate Curriculum & Profile</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {profile?.bio || orgProfile?.about || 'No detailed biography provided.'}
                </p>
              </div>

              {/* Practice Specialties */}
              {profile && (
                <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5">
                  <h3 className="text-xs font-display uppercase tracking-widest text-slate-300 mb-3">
                    Practice Disciplines & Jurisdictions
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {profile.practiceAreas.map((area, idx) => (
                      <React.Fragment key={area}>
                        <span className="text-xs text-slate-200">
                          {area}
                        </span>
                        {idx < profile.practiceAreas.length - 1 && (
                          <span className="text-slate-600">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar quick info */}
            <div className="space-y-4">
              <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 text-xs space-y-3">
                <h4 className="font-semibold text-slate-200 font-display tracking-wider uppercase text-[11px] border-b border-[#172030] pb-2">
                  Bar Credentials Summary
                </h4>
                {profile?.barAdmissions.map((adm) => (
                  <div key={adm.id} className="p-2.5 rounded bg-[#090D14] border border-[#1A2333] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 font-display text-xs">{adm.jurisdiction}</span>
                      {adm.isVerified && (
                        <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{adm.barCouncil}</div>
                    <div className="text-[10px] font-mono-data text-slate-500">
                      Roll #{adm.licenseNumber} · Admitted {adm.admissionYear}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 text-xs space-y-2">
                <h4 className="font-semibold text-slate-200 font-display tracking-wider uppercase text-[11px] border-b border-[#172030] pb-2">
                  Languages of Practice
                </h4>
                <div className="flex items-center gap-2 flex-wrap text-slate-300">
                  {profile?.languages.map((l, i) => (
                    <React.Fragment key={l}>
                      <span>{l}</span>
                      {i < (profile?.languages.length || 0) - 1 && <span className="text-slate-600">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bar Admissions Tab */}
        {activeTab === 'admissions' && (
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#172030]">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 font-display tracking-wider uppercase">
                  Official Bar Admissions & Licensing Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Admissions are authenticated directly against public roll records and judicial records.
                </p>
              </div>
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-3">
              {profile?.barAdmissions.map((adm) => (
                <div
                  key={adm.id}
                  className="p-4 rounded bg-[#090D14] border border-[#1A2333] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100 font-display">{adm.jurisdiction}</span>
                      {adm.isVerified ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/40 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" />
                          <span>Officially Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950/40 text-sky-400 border border-sky-500/30 font-mono">
                          Pending Authentication
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{adm.barCouncil}</p>
                    <div className="flex items-center gap-3 text-xs font-mono-data text-slate-400">
                      <span>Bar Roll: {adm.licenseNumber}</span>
                      <span>·</span>
                      <span>Admitted: {adm.admissionYear}</span>
                      <span>·</span>
                      <span className="text-emerald-400 uppercase text-[10px]">{adm.status}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-400">
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Standing</span>
                    <span className="text-amber-400/90 font-medium">Good Standing Authenticated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience & Education Tab */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience timeline */}
            <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-semibold text-slate-100 font-display tracking-wider uppercase flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Professional Experience & Appointments</span>
              </h3>
              <div className="space-y-4 border-l-2 border-[#1E293B] ml-2 pl-4">
                {profile?.experience?.map((exp) => (
                  <div key={exp.id} className="relative group text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[21px] top-1 ring-2 ring-[#0D121B]" />
                    <h4 className="font-semibold text-slate-200 text-sm font-display">{exp.role}</h4>
                    <p className="text-amber-400 font-medium">{exp.organization} · {exp.location}</p>
                    <p className="text-[11px] font-mono text-slate-500 mb-1">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-slate-300 leading-relaxed font-sans">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education timeline */}
            <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-semibold text-slate-100 font-display tracking-wider uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Legal & Academic Education</span>
              </h3>
              <div className="space-y-4 border-l-2 border-[#1E293B] ml-2 pl-4">
                {profile?.education?.map((edu) => (
                  <div key={edu.id} className="relative group text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600 absolute -left-[21px] top-1 ring-2 ring-[#0D121B]" />
                    <h4 className="font-semibold text-slate-200 text-sm font-display">{edu.degree}</h4>
                    <p className="text-amber-400 font-medium">{edu.institution}</p>
                    <p className="text-[11px] font-mono text-slate-500 mb-1">
                      Class of {edu.graduationYear} {edu.field ? `· ${edu.field}` : ''}
                    </p>
                    {edu.honors && <p className="text-slate-400 italic font-editorial">{edu.honors}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onNavigateProfile={(uid) => onNavigate(`/profile/${uid}`)}
                />
              ))
            ) : (
              <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-10 text-center text-xs text-slate-400">
                No legal memoranda or case analyses published by this author yet.
              </div>
            )}
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 text-xs text-slate-300">
            <h3 className="text-sm font-semibold text-slate-100 font-display mb-3">
              Professional Connections Roll ({profile?.connectionsCount || 0})
            </h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              In accordance with professional networking privacy standards, mutual legal colleagues and verified counsel are recorded in the central collegial network.
            </p>
            <button
              onClick={() => onNavigate('/connections')}
              className="px-4 py-2 bg-[#131B2A] hover:bg-[#1A2538] text-amber-400 rounded font-semibold text-xs transition-colors border border-[#1E293B]"
            >
              Open Dedicated Connections Hub
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="profile"
        targetId={user.id}
        targetTitle={`Advocate Profile: ${user.fullName} (${profile?.firmOrOrganization})`}
      />
    </div>
  );
};
