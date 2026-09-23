import React, { useState } from 'react';
import { LegalStorage } from '../services/storage';
import { PostCard } from '../components/feed/PostCard';
import { Bookmark, Scale, Briefcase, FileText } from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const SavedPage: React.FC<Props> = ({ onNavigate }) => {
  const [savedData, setSavedData] = useState(() => LegalStorage.getSavedItems());
  const [activeTab, setActiveTab] = useState<'posts' | 'jobs'>('posts');

  const allPosts = LegalStorage.getPosts();
  const allJobs = LegalStorage.getJobs();

  const savedPosts = allPosts.filter((p) => savedData.posts.includes(p.id));
  const savedJobs = allJobs.filter((j) => savedData.jobs.includes(j.id));

  const refreshSaved = () => {
    setSavedData(LegalStorage.getSavedItems());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#1A2333]">
        <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Personal Judicial Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
          Archived Precedents & Search Mandates
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Bookmarked case precedents, statutory memoranda, and lateral appointments saved for your active matters.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-3.5 py-1.5 rounded transition-colors font-medium flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-[#0D121B] border border-[#1C2638]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Preserved Memoranda ({savedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-3.5 py-1.5 rounded transition-colors font-medium flex items-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-[#0D121B] border border-[#1C2638]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Bookmarked Lateral Searches ({savedJobs.length})</span>
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="space-y-4">
          {savedPosts.length > 0 ? (
            savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onNavigateProfile={(uid) => onNavigate(`/profile/${uid}`)}
                onPostUpdated={refreshSaved}
              />
            ))
          ) : (
            <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-12 text-center text-xs text-slate-400 space-y-2">
              <Scale className="w-8 h-8 text-amber-500/30 mx-auto" />
              <p className="text-slate-200 font-display font-semibold">No Saved Legal Precedents</p>
              <p className="max-w-sm mx-auto leading-relaxed">
                Click the bookmark icon on any legal analysis in your docket feed to preserve it here for later reference.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {savedJobs.length > 0 ? (
            savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    {job.practiceArea} · {job.employmentType}
                  </span>
                  <h4 className="text-base font-semibold text-slate-200 font-display">{job.title}</h4>
                  <p className="text-xs text-slate-400">{job.organizationName} · {job.location}</p>
                </div>
                <button
                  onClick={() => onNavigate(`/jobs/${job.id}`)}
                  className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-12 text-center text-xs text-slate-400 space-y-2">
              <Briefcase className="w-8 h-8 text-amber-500/30 mx-auto" />
              <p className="text-slate-200 font-display font-semibold">No Bookmarked Searches</p>
              <p className="max-w-sm mx-auto leading-relaxed">Save interesting partner searches or in-house counsel appointments to revisit them anytime.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
