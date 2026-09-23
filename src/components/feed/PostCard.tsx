import React, { useState } from 'react';
import { LegalPost } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LegalStorage } from '../../services/storage';
import { UserAvatar } from '../common/UserAvatar';
import { VerificationBadge } from '../common/VerificationBadge';
import { ReportModal } from '../common/ReportModal';
import {
  MessageSquare,
  Share2,
  Bookmark,
  Scale,
  ThumbsUp,
  Lightbulb,
  CheckCircle,
  FileText,
  Flag,
  MoreHorizontal,
  Copy,
  Check,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface Props {
  post: LegalPost;
  onNavigateProfile: (userId: string) => void;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<Props> = ({ post, onNavigateProfile, onPostUpdated }) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    const saved = LegalStorage.getSavedItems();
    return saved.posts.includes(post.id);
  });
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const reactions = post.reactions || {};
  const userReaction = reactions[currentUser.id];

  const reactionCounts = {
    insightful: Object.values(reactions).filter((r) => r === 'insightful').length,
    helpful: Object.values(reactions).filter((r) => r === 'helpful').length,
    agree: Object.values(reactions).filter((r) => r === 'agree').length,
    precedent: Object.values(reactions).filter((r) => r === 'precedent').length,
  };
  const totalReactions = Object.keys(reactions).length;

  const handleToggleReaction = (type: 'insightful' | 'helpful' | 'agree' | 'precedent') => {
    LegalStorage.toggleReaction(post.id, type);
    if (onPostUpdated) onPostUpdated();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    LegalStorage.addComment(post.id, commentText.trim());
    setCommentText('');
    setShowComments(true);
    if (onPostUpdated) onPostUpdated();
  };

  const handleToggleSave = () => {
    const state = LegalStorage.toggleSaveItem('posts', post.id);
    setIsSaved(state);
  };

  const handleCopyCitation = (citationText: string) => {
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="bg-[#0D121B] border border-[#1C2638] hover:border-[#28364F] rounded-lg p-5 shadow-sm transition-all duration-200">
      {/* Category Kicker - Zero Pill Discipline */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wide mb-3 pb-2.5 border-b border-[#172030]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-amber-400/90 font-medium uppercase tracking-wider">{post.category}</span>
          {post.communityName && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 hover:text-amber-300 cursor-pointer">{post.communityName}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono-data">{formattedDate}</span>

          {/* Options Menu & Report */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#162030] transition-colors"
              title="Post actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-[#0E1420] border border-[#26354D] rounded-md shadow-2xl py-1 z-30 text-xs">
                <button
                  onClick={() => {
                    handleToggleSave();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-300 hover:bg-[#172234] flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isSaved ? 'Remove from Saved' : 'Save Legal Memorandum'}</span>
                </button>
                <button
                  onClick={() => {
                    setReportModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-400 hover:bg-[#172234] flex items-center gap-2 border-t border-[#1C2638]"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Ethics Violation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Author Header */}
      <div className="flex items-start gap-3 mb-3.5">
        <button
          onClick={() => onNavigateProfile(post.authorId)}
          className="focus:outline-none shrink-0"
        >
          <UserAvatar
            name={post.authorName}
            size="md"
            verificationStatus={post.authorVerification}
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onNavigateProfile(post.authorId)}
              className="font-semibold text-sm text-slate-100 hover:text-amber-300 transition-colors text-left font-display tracking-wide"
            >
              {post.authorName}
            </button>
            <VerificationBadge status={post.authorVerification} size="sm" />
          </div>
          <div className="text-xs text-slate-400 truncate">
            {post.authorTitle} <span className="text-slate-600">·</span> <span className="text-slate-300">{post.authorFirm}</span>
          </div>
        </div>
      </div>

      {/* Official Case Citation Callout Box (Legal Pullout) */}
      {post.caseCitation && (
        <div className="mb-3.5 p-3 rounded-r-md bg-[#111724] border-l-2 border-amber-500/80 border-y border-r border-[#1B2538] flex items-start justify-between gap-3 group">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-widest text-amber-400/90 font-semibold">
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Official Reporters Citation</span>
            </div>
            <p className="font-editorial text-sm sm:text-base text-slate-100 italic leading-snug tracking-wide">
              {post.caseCitation}
            </p>
          </div>

          <button
            onClick={() => handleCopyCitation(post.caseCitation || '')}
            className="text-xs text-slate-400 hover:text-amber-300 p-1.5 rounded hover:bg-[#1A2538] transition-colors shrink-0 flex items-center gap-1"
            title="Copy formal Bluebook citation"
          >
            {copiedCitation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono text-slate-400">Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Post Content Body */}
      <div className="text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line mb-3.5 font-sans">
        {post.content}
      </div>

      {/* Verified Document Attachment */}
      {post.documentName && (
        <div className="mb-3.5 p-2.5 rounded bg-[#101622] border border-[#1E293B] hover:border-amber-500/30 transition-colors flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-slate-200 min-w-0">
            <div className="p-1.5 rounded bg-amber-950/30 border border-amber-500/20 text-amber-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs text-amber-200 truncate">{post.documentName}</p>
              <p className="text-[10px] text-slate-500 font-mono">Certified Judicial Filing Brief · 2.4 MB PDF</p>
            </div>
          </div>
          <button
            onClick={() => window.open('#', '_blank')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded hover:bg-[#1A2538] transition-colors shrink-0"
          >
            Review Brief
          </button>
        </div>
      )}

      {/* Statutory Practice Tags - Clean unboxed text */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-3.5 text-xs text-slate-500">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-slate-400 hover:text-amber-400 font-mono text-[11px] cursor-pointer transition-colors"
            >
              §{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reaction Counts Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-[#172030] mb-2 font-mono-data">
          <div className="flex items-center gap-3 text-[11px]">
            {reactionCounts.insightful > 0 && (
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{reactionCounts.insightful} Insightful</span>
              </span>
            )}
            {reactionCounts.precedent > 0 && (
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>{reactionCounts.precedent} Precedent Cited</span>
              </span>
            )}
            {reactionCounts.helpful > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-sky-400" />
                <span>{reactionCounts.helpful} Helpful</span>
              </span>
            )}
            {reactionCounts.agree > 0 && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{reactionCounts.agree} Concurring</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-slate-200 text-[11px]"
          >
            {post.comments?.length || 0} Colleague Responses
          </button>
        </div>
      )}

      {/* Action Bar - Peer Endorsements */}
      <div className="flex items-center justify-between pt-2 border-t border-[#172030] text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToggleReaction('insightful')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              userReaction === 'insightful'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#162030]'
            }`}
            title="Mark as Insightful Analysis"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Insightful</span>
          </button>

          <button
            onClick={() => handleToggleReaction('precedent')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              userReaction === 'precedent'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#162030]'
            }`}
            title="Mark as Precedent Cited"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Precedent</span>
          </button>

          <button
            onClick={() => handleToggleReaction('helpful')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              userReaction === 'helpful'
                ? 'bg-sky-950/40 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#162030]'
            }`}
            title="Mark as Sound Counsel"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Helpful</span>
          </button>

          <button
            onClick={() => handleToggleReaction('agree')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              userReaction === 'agree'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#162030]'
            }`}
            title="Concurring"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Concur</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              showComments
                ? 'text-amber-300 bg-[#162030]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#162030]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Respond</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`p-1.5 rounded transition-colors ${
              isSaved ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#162030]'
            }`}
            title={isSaved ? 'Saved in dossiers' : 'Save memorandum'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-[#172030] space-y-3">
          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <UserAvatar name={currentUser.fullName} size="sm" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Submit collegial note or jurisdictional observation..."
                className="w-full bg-[#0A0E17] border border-[#1E293B] focus:border-amber-500/50 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-colors shrink-0"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Existing Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-2 pt-2">
              {post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3 rounded bg-[#0A0E17] border border-[#1A2538] flex items-start gap-2.5 text-xs"
                >
                  <UserAvatar
                    name={comm.authorName}
                    size="xs"
                    verificationStatus={comm.authorVerification}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200 font-display text-[11px] truncate">
                        {comm.authorName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {new Date(comm.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{comm.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ethics Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="post"
        targetId={post.id}
        targetTitle={`Post by ${post.authorName}: ${post.content.slice(0, 50)}...`}
      />
    </article>
  );
};
