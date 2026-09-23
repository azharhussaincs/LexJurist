import React, { useState } from 'react';
import { LeftSidebar } from '../components/feed/LeftSidebar';
import { RightSidebar } from '../components/feed/RightSidebar';
import { PostComposer } from '../components/feed/PostComposer';
import { PostCard } from '../components/feed/PostCard';
import { LegalStorage } from '../services/storage';
import { LegalPost, LegalPostCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Filter, Sparkles, Scale, RefreshCw } from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<LegalPost[]>(() => LegalStorage.getPosts());
  const [activeFilter, setActiveFilter] = useState<'all' | 'network' | 'precedents' | 'queries'>('all');

  const refreshPosts = () => {
    setPosts(LegalStorage.getPosts());
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'precedents') {
      return post.category === 'Case Precedent' || post.category === 'Legal Analysis';
    }
    if (activeFilter === 'queries') {
      return post.category === 'Practice Query';
    }
    if (activeFilter === 'network') {
      const connections = LegalStorage.getConnections();
      const connectedUserIds = connections
        .filter((c) => c.status === 'accepted' && (c.senderId === currentUser.id || c.receiverId === currentUser.id))
        .map((c) => (c.senderId === currentUser.id ? c.receiverId : c.senderId));
      connectedUserIds.push(currentUser.id);
      return connectedUserIds.includes(post.authorId);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 cols) */}
        <div className="hidden lg:block lg:col-span-3">
          <LeftSidebar onNavigate={onNavigate} />
        </div>

        {/* Center Main Feed (6 cols) */}
        <main className="lg:col-span-6 space-y-4">
          {/* Post Composer */}
          <PostComposer onPostCreated={refreshPosts} />

          {/* Feed Filter Bar */}
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-2.5 flex items-center justify-between gap-2 overflow-x-auto shadow-sm">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium px-2 flex items-center gap-1 font-display tracking-wider text-[11px] uppercase">
                <Filter className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Docket Feed:</span>
              </span>
              {[
                { id: 'all', label: 'All Precedents & Filings' },
                { id: 'network', label: 'Collegial Network' },
                { id: 'precedents', label: 'Case Precedents' },
                { id: 'queries', label: 'Practice Queries' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                    activeFilter === f.id
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2A]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={refreshPosts}
              className="p-1.5 rounded text-slate-400 hover:text-amber-300 hover:bg-[#131B2A] transition-colors"
              title="Refresh Roster Feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Posts List */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onNavigateProfile={(userId) => onNavigate(`/profile/${userId}`)}
                  onPostUpdated={refreshPosts}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-10 text-center space-y-3">
              <Scale className="w-10 h-10 text-amber-500/40 mx-auto" />
              <h3 className="font-semibold text-slate-200 font-display">No Legal Discussions in this Filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                No publications match the selected filter. Broaden your filter or submit your own legal memorandum or precedent analysis.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-3.5 py-1.5 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs font-medium text-amber-400 border border-[#1E293B]"
              >
                Reset to All Discussions
              </button>
            </div>
          )}
        </main>

        {/* Right Column (3 cols) */}
        <div className="hidden lg:block lg:col-span-3">
          <RightSidebar onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
