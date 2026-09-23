import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LegalStorage } from '../../services/storage';
import { LegalPostCategory } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import {
  FileText,
  Bookmark,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle,
  Hash,
  Scale,
  BookOpen,
  X
} from 'lucide-react';

interface Props {
  communityId?: string;
  communityName?: string;
  onPostCreated?: () => void;
}

export const PostComposer: React.FC<Props> = ({ communityId, communityName, onPostCreated }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<LegalPostCategory>('Legal Analysis');
  const [caseCitation, setCaseCitation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: LegalPostCategory[] = [
    'Legal Analysis',
    'Case Precedent',
    'Practice Query',
    'Court Update',
    'Professional Article',
    'Ethics & Practice',
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAttachSampleBrief = () => {
    setDocumentName('Brief_for_Amici_Curiae_Antitrust.pdf');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      LegalStorage.createPost({
        category,
        content: content.trim(),
        caseCitation: caseCitation.trim() || undefined,
        tags: tags.length > 0 ? tags : ['LegalPractice'],
        documentName: documentName || undefined,
        communityId,
        communityName,
      });

      setContent('');
      setCaseCitation('');
      setTags([]);
      setDocumentName('');
      setIsExpanded(false);
      setIsSubmitting(false);
      if (onPostCreated) onPostCreated();
    }, 250);
  };

  return (
    <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm mb-4 transition-all">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#172030]">
        <div className="flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-display uppercase tracking-wider text-slate-200">
            {communityName ? `Filing to ${communityName}` : 'Chambers Memorandum & Precedent Filing'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Official Counsel Feed</span>
      </div>

      <div className="flex items-start gap-3">
        <UserAvatar
          name={currentUser.fullName}
          size="md"
          verificationStatus={currentUser.lawyerProfile?.verificationStatus}
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 4 : 2}
            placeholder={
              communityName
                ? `Publish legal analysis to ${communityName}...`
                : "Examine a recent holding, present a statutory analysis, or post a peer query..."
            }
            className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none transition-colors"
          />

          {isExpanded && (
            <div className="mt-3 space-y-3 pt-3 border-t border-[#172030] animate-in fade-in duration-150">
              {/* Category Segmented Selector */}
              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1.5">
                  Legal Category
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                        category === cat
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-medium'
                          : 'bg-[#080C13] text-slate-400 hover:text-slate-200 border border-[#1C2638]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Citation Input */}
              {(category === 'Legal Analysis' || category === 'Case Precedent' || category === 'Court Update') && (
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Formal Citation (e.g. 597 U.S. 215 or 15 U.S.C. § 1)
                  </label>
                  <div className="relative">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400/70 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={caseCitation}
                      onChange={(e) => setCaseCitation(e.target.value)}
                      placeholder="e.g. Loper Bright Enterprises v. Raimondo, 144 S. Ct. 2244 (2024)"
                      className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Tags Input */}
              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Jurisdiction & Practice Tags (Press Enter)
                </label>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#141C2A] text-amber-300 border border-[#223048]"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. Antitrust, FederalCourts, Certiorari..."
                  className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Document Attachment Strip */}
              {documentName ? (
                <div className="p-2.5 rounded bg-[#101622] border border-[#1E293B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs text-amber-200">{documentName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">· Certified Brief</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocumentName('')}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleAttachSampleBrief}
                    className="text-slate-400 hover:text-amber-300 flex items-center gap-1.5 text-[11px] py-1 px-2 rounded border border-[#1C2638] bg-[#0A0E17]"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                    <span>Attach Certified Court Brief (PDF)</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#172030]">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                >
                  Dismiss
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                    className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs transition-all shadow disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Filing...' : 'Publish to Roster'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
