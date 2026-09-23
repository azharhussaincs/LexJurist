import React, { useState, useMemo } from 'react';
import { Search, X, User, Building, BookOpen, Users, Briefcase, Calendar, ChevronRight, Scale } from 'lucide-react';
import { LegalStorage } from '../../services/storage';
import { VerificationBadge } from './VerificationBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'lawyers' | 'posts' | 'jobs' | 'events' | 'communities'>('all');

  const users = LegalStorage.getUsers();
  const posts = LegalStorage.getPosts();
  const jobs = LegalStorage.getJobs();
  const events = LegalStorage.getEvents();
  const communities = LegalStorage.getCommunities();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    const matchedLawyers = users.filter((u) => {
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchPractice = u.lawyerProfile?.primaryPracticeArea?.toLowerCase().includes(q);
      const matchFirm = u.lawyerProfile?.firmOrOrganization?.toLowerCase().includes(q);
      const matchCity = u.lawyerProfile?.location?.city?.toLowerCase().includes(q);
      return matchName || matchPractice || matchFirm || matchCity;
    });

    const matchedPosts = posts.filter((p) => {
      return (
        p.content.toLowerCase().includes(q) ||
        p.caseCitation?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    const matchedJobs = jobs.filter((j) => {
      return (
        j.title.toLowerCase().includes(q) ||
        j.organizationName.toLowerCase().includes(q) ||
        j.practiceArea.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    });

    const matchedEvents = events.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        e.practiceArea.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
      );
    });

    const matchedCommunities = communities.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });

    return {
      lawyers: matchedLawyers,
      posts: matchedPosts,
      jobs: matchedJobs,
      events: matchedEvents,
      communities: matchedCommunities,
    };
  }, [query, users, posts, jobs, events, communities]);

  if (!isOpen) return null;

  const handleSelect = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0D121B] border border-[#26354D] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1A2538] bg-[#0A0E17]/80">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified advocates, precedents, court dockets, lateral mandates..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] px-2 py-1 bg-[#131B2A] hover:bg-[#1A2538] rounded text-slate-300 font-mono border border-[#1E293B]"
          >
            ESC
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1A2538] bg-[#090D14] text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'lawyers', label: 'Counsel & Chambers' },
            { id: 'posts', label: 'Precedents & Analysis' },
            { id: 'jobs', label: 'Lateral Mandates' },
            { id: 'events', label: 'CLE Symposia' },
            { id: 'communities', label: 'Practice Sections' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap text-xs ${
                activeTab === tab.id
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query.trim() ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Scale className="w-8 h-8 text-amber-500/30 mx-auto" />
              <p className="text-slate-300 font-display font-medium">Search the Inter-Chambers Docket</p>
              <p className="text-slate-500">Query by counsel name, state bar citation, court precedent, or practice group.</p>
            </div>
          ) : results ? (
            <div className="space-y-4">
              {/* Lawyers */}
              {(activeTab === 'all' || activeTab === 'lawyers') && results.lawyers.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-amber-400 block font-semibold">
                    Verified Counsel & Firms ({results.lawyers.length})
                  </span>
                  <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                    {results.lawyers.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => handleSelect(`/profile/${l.id}`)}
                        className="p-3 bg-[#090D14] hover:bg-[#111724] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-slate-100 font-display">
                                {l.fullName}
                              </span>
                              {l.lawyerProfile && (
                                <VerificationBadge status={l.lawyerProfile.verificationStatus} size="sm" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {l.lawyerProfile?.title || l.organizationProfile?.tagline} · {l.lawyerProfile?.firmOrOrganization}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-amber-400 block font-semibold">
                    Legal Analyses & Case Precedents ({results.posts.length})
                  </span>
                  <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                    {results.posts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect('/home')}
                        className="p-3 bg-[#090D14] hover:bg-[#111724] cursor-pointer space-y-1 transition-colors"
                      >
                        {p.caseCitation && (
                          <span className="text-[10px] font-mono text-amber-400 block">
                            {p.caseCitation}
                          </span>
                        )}
                        <p className="text-xs text-slate-300 line-clamp-2 font-serif font-editorial">
                          "{p.content}"
                        </p>
                        <span className="text-[10px] text-slate-500 block">By {p.authorName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-amber-400 block font-semibold">
                    Lateral Appointments ({results.jobs.length})
                  </span>
                  <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                    {results.jobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => handleSelect(`/jobs/${j.id}`)}
                        className="p-3 bg-[#090D14] hover:bg-[#111724] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-100 font-display block">
                            {j.title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {j.organizationName} · {j.location}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono-data text-amber-300">{j.salaryRange}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-amber-400 block font-semibold">
                    CLE Symposia ({results.events.length})
                  </span>
                  <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                    {results.events.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => handleSelect(`/events/${e.id}`)}
                        className="p-3 bg-[#090D14] hover:bg-[#111724] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-100 font-display block">
                            {e.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono-data">
                            {e.startDate} · {e.format}
                          </span>
                        </div>
                        {e.cleCredits && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            {e.cleCredits} CLE
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {(activeTab === 'all' || activeTab === 'communities') && results.communities.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-amber-400 block font-semibold">
                    Practice Sections ({results.communities.length})
                  </span>
                  <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                    {results.communities.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect(`/communities/${c.id}`)}
                        className="p-3 bg-[#090D14] hover:bg-[#111724] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-100 font-display block">
                            {c.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.membersCount} Enrolled Practitioners
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{c.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
