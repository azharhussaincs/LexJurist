import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  Search,
  Filter,
  UserPlus,
  MessageSquare,
  MapPin,
  Briefcase,
  Award,
  Check,
  ChevronRight,
  Scale,
  Building,
  RotateCcw
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const LawyersDiscoveryPage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, allUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);

  // Collect unique practice areas and locations
  const practiceAreas = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => {
      if (u.lawyerProfile?.primaryPracticeArea) {
        set.add(u.lawyerProfile.primaryPracticeArea);
      }
    });
    return ['All', ...Array.from(set)];
  }, [allUsers]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => {
      if (u.lawyerProfile?.location?.city) {
        set.add(`${u.lawyerProfile.location.city}, ${u.lawyerProfile.location.country}`);
      }
    });
    return ['All', ...Array.from(set)];
  }, [allUsers]);

  // Existing connections
  const connections = LegalStorage.getConnections();
  const acceptedIds = connections
    .filter((c) => c.status === 'accepted' && (c.senderId === currentUser.id || c.receiverId === currentUser.id))
    .map((c) => (c.senderId === currentUser.id ? c.receiverId : c.senderId));

  const pendingIds = connections
    .filter((c) => c.status === 'pending' && c.senderId === currentUser.id)
    .map((c) => c.receiverId);

  const filteredLawyers = useMemo(() => {
    return allUsers.filter((user) => {
      if (!user.lawyerProfile) return false;
      const profile = user.lawyerProfile;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.fullName.toLowerCase().includes(q);
        const matchTitle = profile.title.toLowerCase().includes(q);
        const matchFirm = profile.firmOrOrganization.toLowerCase().includes(q);
        const matchPractice = profile.practiceAreas.some((p) => p.toLowerCase().includes(q));
        const matchBar = profile.barAdmissions.some(
          (b) => b.barCouncil.toLowerCase().includes(q) || b.licenseNumber.toLowerCase().includes(q)
        );
        if (!matchName && !matchTitle && !matchFirm && !matchPractice && !matchBar) {
          return false;
        }
      }

      if (practiceFilter !== 'All' && profile.primaryPracticeArea !== practiceFilter) {
        return false;
      }

      if (locationFilter !== 'All') {
        const userLoc = `${profile.location.city}, ${profile.location.country}`;
        if (userLoc !== locationFilter) return false;
      }

      if (verificationFilter === 'Verified Only' && profile.verificationStatus !== 'verified') {
        return false;
      }
      if (verificationFilter === 'Pending' && profile.verificationStatus !== 'pending') {
        return false;
      }

      if (experienceFilter === '10+ Years' && profile.yearsOfExperience < 10) return false;
      if (experienceFilter === '15+ Years' && profile.yearsOfExperience < 15) return false;

      return true;
    });
  }, [allUsers, searchQuery, practiceFilter, locationFilter, verificationFilter, experienceFilter]);

  const handleConnect = (targetUserId: string) => {
    LegalStorage.sendConnectionRequest(targetUserId, 'Colleague, I would like to connect with your professional practice on LexJurist.');
    setConnectedUserIds((prev) => [...prev, targetUserId]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Collegiate Chambers Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
            Official Counsel & Advocate Roll
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verified directory of advocates, appellate litigators, general counsel, and statutory specialists categorized by jurisdiction and admissions standing.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono-data text-amber-400 font-semibold">
            {filteredLawyers.length} Enrolled Counsel
          </span>
          <p className="text-[10px] font-mono text-slate-500">Active Jurisdiction</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm mb-6 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by advocate name, firm, practice specialty, bar roll number..."
            className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1">
              Practice Discipline
            </label>
            <select
              value={practiceFilter}
              onChange={(e) => setPracticeFilter(e.target.value)}
              className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              {practiceAreas.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1">
              Jurisdiction
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1">
              Bar Standing
            </label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">All Standings</option>
              <option value="Verified Only">Verified Counsel Only</option>
              <option value="Pending">Admissions Review Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider text-slate-500 mb-1">
              Seniority
            </label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">Any Experience</option>
              <option value="10+ Years">10+ Years Practice</option>
              <option value="15+ Years">15+ Years (Senior Counsel)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLawyers.map((lawyer) => {
          const profile = lawyer.lawyerProfile!;
          const isSelf = lawyer.id === currentUser.id;
          const isConnected = acceptedIds.includes(lawyer.id);
          const isPending = pendingIds.includes(lawyer.id) || connectedUserIds.includes(lawyer.id);

          return (
            <div
              key={lawyer.id}
              className="bg-[#0D121B] border border-[#1C2638] hover:border-[#28364F] rounded-lg p-5 shadow-sm flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-3.5 mb-3">
                  <UserAvatar
                    name={lawyer.fullName}
                    size="lg"
                    verificationStatus={profile.verificationStatus}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onNavigate(`/profile/${lawyer.id}`)}
                        className="font-semibold text-sm text-slate-100 hover:text-amber-300 truncate text-left font-display tracking-wide"
                      >
                        {lawyer.fullName}
                      </button>
                      <VerificationBadge status={profile.verificationStatus} size="sm" />
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-sans">
                      {profile.title}
                    </p>
                    <p className="text-xs font-medium text-amber-400/90 truncate">
                      {profile.firmOrOrganization}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-3.5 pb-3 border-b border-[#172030]">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{profile.location.city}, {profile.location.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono-data">{profile.yearsOfExperience} yrs practice</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300">{profile.primaryPracticeArea}</span>
                  </div>
                  {profile.barAdmissions[0] && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate bg-[#080C14] px-2 py-0.5 rounded border border-[#182234]">
                      <Award className="w-3 h-3 text-amber-400/80 shrink-0" />
                      <span className="truncate">{profile.barAdmissions[0].barCouncil} #{profile.barAdmissions[0].licenseNumber}</span>
                    </div>
                  )}
                </div>

                {/* Practice Areas - Zero Pill unboxed typography */}
                <div className="flex items-center gap-2 flex-wrap mb-4 text-[11px] text-slate-400">
                  {profile.practiceAreas.slice(0, 3).map((p, idx) => (
                    <React.Fragment key={p}>
                      <span className="text-slate-300 hover:text-amber-300 transition-colors">
                        {p}
                      </span>
                      {idx < Math.min(profile.practiceAreas.length - 1, 2) && (
                        <span className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                  {profile.practiceAreas.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      +{profile.practiceAreas.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2.5 border-t border-[#172030]">
                <button
                  onClick={() => onNavigate(`/profile/${lawyer.id}`)}
                  className="flex-1 py-1.5 px-3 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs font-medium text-slate-200 border border-[#1E293B] text-center transition-colors font-display tracking-wider uppercase text-[10px]"
                >
                  Dossier
                </button>

                {!isSelf && (
                  <>
                    <button
                      onClick={() => onNavigate('/messages')}
                      className="p-1.5 rounded bg-[#131B2A] hover:bg-[#1A2538] text-slate-300 hover:text-slate-100 border border-[#1E293B] transition-colors"
                      title="Send Private Chamber Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleConnect(lawyer.id)}
                      disabled={isConnected || isPending}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isConnected
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </>
                      ) : isPending ? (
                        <span>Pending</span>
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
          );
        })}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-12 text-center space-y-3">
          <Scale className="w-10 h-10 text-amber-500/30 mx-auto" />
          <h3 className="font-semibold text-slate-200 font-display">No Legal Practitioners Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            No practitioners match the specified filter criteria. Try expanding your search or clearing current filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPracticeFilter('All');
              setLocationFilter('All');
              setVerificationFilter('All');
              setExperienceFilter('All');
            }}
            className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Directory Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
