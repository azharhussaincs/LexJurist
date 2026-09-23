import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage, subscribeStorage } from '../services/storage';
import { Conversation, DirectMessage } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { ReportModal } from '../components/common/ReportModal';
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Flag,
  ShieldAlert,
  Paperclip,
  CheckCheck,
  Scale,
  Lock
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const MessagingPage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, allUsers } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(() => LegalStorage.getConversations());
  const [messages, setMessages] = useState<DirectMessage[]>(() => LegalStorage.getMessages());
  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    const first = LegalStorage.getConversations().find((c) => c.participantIds.includes(currentUser.id));
    if (first) {
      return first.participantIds.find((id) => id !== currentUser.id) || 'user-marcus-chen';
    }
    return 'user-marcus-chen';
  });

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSync = () => {
      setConversations(LegalStorage.getConversations());
      setMessages(LegalStorage.getMessages());
    };
    const unsubscribe = subscribeStorage(handleSync);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const activePartner = LegalStorage.getUserById(activePartnerId) || allUsers[1];

  // Messages between current user and active partner
  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === activePartnerId) ||
      (m.senderId === activePartnerId && m.recipientId === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isBlocked) return;

    LegalStorage.sendMessage(activePartnerId, messageInput.trim());
    setMessageInput('');
  };

  // Other legal colleagues to start a new chat with
  const availableColleagues = allUsers.filter(
    (u) => u.id !== currentUser.id && u.role === 'lawyer'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-0.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted Inter-Chambers Communications</span>
          </div>
          <h1 className="text-xl font-bold font-display text-slate-100 tracking-wide">
            Privileged Counsel Dispatch
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
            End-to-End Cryptographic Ledger
          </span>
        </div>
      </div>

      <div className="flex-1 bg-[#0D121B] border border-[#1C2638] rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0">
        {/* Left Column: Conversation Directory */}
        <div className="w-full md:w-80 border-r border-[#1C2638] flex flex-col bg-[#0A0E17]/60">
          {/* Search conversations */}
          <div className="p-3 border-b border-[#1C2638]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-amber-400/70 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search counsel threads..."
                className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#172030]">
            {availableColleagues
              .filter(
                (u) =>
                  !searchQuery ||
                  u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.lawyerProfile?.firmOrOrganization.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((colleague) => {
                const isActive = colleague.id === activePartnerId;
                const profile = colleague.lawyerProfile;
                const latestMsg = messages
                  .filter(
                    (m) =>
                      (m.senderId === colleague.id && m.recipientId === currentUser.id) ||
                      (m.senderId === currentUser.id && m.recipientId === colleague.id)
                  )
                  .pop();

                return (
                  <button
                    key={colleague.id}
                    onClick={() => {
                      setActivePartnerId(colleague.id);
                      setIsBlocked(false);
                    }}
                    className={`w-full p-3 text-left flex items-start gap-3 transition-colors ${
                      isActive ? 'bg-[#141C2B] border-l-2 border-amber-400' : 'hover:bg-[#111724]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <UserAvatar
                        name={colleague.fullName}
                        size="md"
                        verificationStatus={profile?.verificationStatus}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0D121B] rounded-full" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 truncate">
                          <span className="font-semibold text-xs text-slate-200 truncate font-display">
                            {colleague.fullName}
                          </span>
                          {profile && <VerificationBadge status={profile.verificationStatus} size="sm" />}
                        </div>
                        {latestMsg && (
                          <span className="text-[10px] font-mono-data text-slate-500 shrink-0">
                            {new Date(latestMsg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-amber-400/90 truncate font-sans">
                        {profile?.firmOrOrganization}
                      </p>

                      <p className="text-xs text-slate-400 truncate mt-0.5 font-sans">
                        {latestMsg ? latestMsg.content : 'Begin privileged discussion...'}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="flex-1 flex flex-col bg-[#090D14] min-w-0">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-[#1C2638] flex items-center justify-between bg-[#0D121B]">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={activePartner.fullName}
                size="md"
                verificationStatus={activePartner.lawyerProfile?.verificationStatus}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onNavigate(`/profile/${activePartner.id}`)}
                    className="font-semibold text-sm text-slate-100 hover:text-amber-300 font-display tracking-wide"
                  >
                    {activePartner.fullName}
                  </button>
                  {activePartner.lawyerProfile && (
                    <VerificationBadge status={activePartner.lawyerProfile.verificationStatus} size="sm" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activePartner.lawyerProfile?.title} ·{' '}
                  <span className="text-amber-400/90">{activePartner.lawyerProfile?.firmOrOrganization}</span>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="relative">
              <button
                onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#131B2A] transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {optionsMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-[#0D121B] border border-[#26354D] rounded shadow-xl py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      onNavigate(`/profile/${activePartner.id}`);
                      setOptionsMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-300 hover:bg-[#162032]"
                  >
                    View Official Bar Credentials
                  </button>
                  <button
                    onClick={() => {
                      setIsBlocked(!isBlocked);
                      setOptionsMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-amber-400 hover:bg-[#162032]"
                  >
                    {isBlocked ? 'Unblock Colleague' : 'Block Colleague'}
                  </button>
                  <button
                    onClick={() => {
                      setReportModalOpen(true);
                      setOptionsMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-[#162032] flex items-center gap-1.5"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Conversation</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Privileged Notice Bar */}
          <div className="bg-[#080C14] border-b border-[#1C2638] px-4 py-1.5 flex items-center gap-2 text-[11px] text-slate-400">
            <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[10px] text-slate-400">
              LEGAL PRIVILEGE NOTICE: Inter-counsel communication protected under Model Rule 1.6 & work-product doctrine.
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {threadMessages.length > 0 ? (
              threadMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg p-3 text-xs leading-relaxed ${
                        isMine
                          ? 'bg-[#1A160A] text-amber-100 border border-amber-500/30 rounded-br-none'
                          : 'bg-[#0E1522] text-slate-200 border border-[#1E293B] rounded-bl-none'
                      }`}
                    >
                      <p className="font-sans">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono-data text-slate-500">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3 text-amber-400" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-amber-500/30 mx-auto" />
                <p className="text-slate-300 font-display font-medium">Initiate Privileged Consultation</p>
                <p className="text-slate-500 max-w-xs mx-auto">Send an introductory communication to begin coordinating with {activePartner.fullName}.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#1C2638] bg-[#0D121B] flex items-center gap-2"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Send confidential message to ${activePartner.fullName}...`}
              className="flex-1 bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || isBlocked}
              className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="message"
        targetId={activePartner.id}
        targetTitle={`Communication Thread with ${activePartner.fullName}`}
      />
    </div>
  );
};
