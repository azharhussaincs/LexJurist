import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { Community } from '../types';
import { PostCard } from '../components/feed/PostCard';
import { PostComposer } from '../components/feed/PostComposer';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  Users,
  Shield,
  FileText,
  Lock,
  Globe,
  Check,
  Plus,
  ArrowLeft,
  Scale,
  Award,
  BookOpen
} from 'lucide-react';

interface Props {
  communityId?: string;
  onNavigate: (route: string) => void;
}

export const CommunitiesPage: React.FC<Props> = ({ communityId, onNavigate }) => {
  const { currentUser } = useAuth();
  const [communities, setCommunities] = useState<Community[]>(() => LegalStorage.getCommunities());
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(communityId || null);

  const activeCommunity = communities.find((c) => c.id === activeCommunityId);

  const handleToggleJoin = (cId: string) => {
    LegalStorage.toggleJoinCommunity(cId);
    setCommunities(LegalStorage.getCommunities());
  };

  // Posts inside active community
  const communityPosts = activeCommunity
    ? LegalStorage.getPosts().filter((p) => p.communityId === activeCommunity.id)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* If single community is selected, show detail view */}
      {activeCommunity ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveCommunityId(null)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Practice Sections</span>
          </button>

          {/* Community Header Banner */}
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  <span>{activeCommunity.category}</span>
                  <span className="text-slate-600">·</span>
                  {activeCommunity.isPrivate ? (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Restricted Section</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Plenary Bar Forum</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-wide">
                  {activeCommunity.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
                  {activeCommunity.description}
                </p>

                <div className="flex items-center gap-3 text-xs font-mono-data text-slate-400 pt-1">
                  <span>{activeCommunity.membersCount} Verified Counsel Enrolled</span>
                  <span className="text-slate-600">·</span>
                  <span>{activeCommunity.postsCount} Filed Memoranda</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleToggleJoin(activeCommunity.id)}
                  className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeCommunity.memberIds.includes(currentUser.id)
                      ? 'bg-[#131B2A] hover:bg-[#1A2538] text-slate-200 border border-[#1E293B]'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'
                  }`}
                >
                  {activeCommunity.memberIds.includes(currentUser.id) ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Enrolled Member</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Enroll in Practice Group</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Practice Guidelines Box */}
            <div className="mt-4 p-3.5 bg-[#080C13] border border-[#172030] rounded text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-amber-300 font-display text-[11px] tracking-wide block">
                Practice Section Charter & Discursive Rules:
              </span>
              <p className="leading-relaxed">{activeCommunity.guidelines}</p>
            </div>
          </div>

          {/* Community Post Composer */}
          <PostComposer
            communityId={activeCommunity.id}
            communityName={activeCommunity.name}
            onPostCreated={() => setCommunities(LegalStorage.getCommunities())}
          />

          {/* Posts list */}
          <div className="space-y-4">
            <h3 className="text-xs font-display uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Section Docket & Discussions ({communityPosts.length})</span>
            </h3>

            {communityPosts.length > 0 ? (
              communityPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onNavigateProfile={(uid) => onNavigate(`/profile/${uid}`)}
                />
              ))
            ) : (
              <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-10 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-200 font-display">No Publications in this Section Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Be the first member to submit a legal analysis, precedent note, or inquiry to this section.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Community Explorer View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
                <Scale className="w-3.5 h-3.5" />
                <span>Substantive Law Divisions</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
                Practice Groups & Inns of Practice
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Join focused substantive law sections to exchange case strategy, circulate draft amicus briefs, and analyze regulatory shifts with fellow practitioners.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] font-mono-data text-amber-400 font-semibold">
                {communities.length} Active Sections
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((comm) => {
              const isMember = comm.memberIds.includes(currentUser.id);
              return (
                <div
                  key={comm.id}
                  className="bg-[#0D121B] border border-[#1C2638] hover:border-[#28364F] rounded-lg p-5 shadow-sm flex flex-col justify-between transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                      <span className="text-amber-400/90 font-semibold">{comm.category}</span>
                      {comm.isPrivate ? (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Restricted</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>Public Section</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveCommunityId(comm.id)}
                      className="font-bold text-base text-slate-100 font-display hover:text-amber-300 text-left mb-2 block tracking-wide transition-colors"
                    >
                      {comm.name}
                    </button>

                    <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed font-sans">
                      {comm.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono-data text-slate-500 mb-3 pt-3 border-t border-[#172030]">
                      <span>{comm.membersCount} Members</span>
                      <span>{comm.postsCount} Filings</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCommunityId(comm.id)}
                        className="flex-1 py-1.5 px-3 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs font-medium text-slate-200 text-center border border-[#1E293B] transition-colors font-display tracking-wider uppercase text-[10px]"
                      >
                        Enter Section
                      </button>
                      <button
                        onClick={() => handleToggleJoin(comm.id)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                          isMember
                            ? 'bg-[#131B2A] text-emerald-300 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'
                        }`}
                      >
                        {isMember ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isMember ? 'Enrolled' : 'Enroll'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
