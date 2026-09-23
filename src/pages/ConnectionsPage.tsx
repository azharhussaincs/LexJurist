import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  Users,
  UserCheck,
  UserPlus,
  Check,
  X,
  MessageSquare,
  Search,
  Scale,
  Clock
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const ConnectionsPage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, allUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'network' | 'discover'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const connections = LegalStorage.getConnections();

  // Pending incoming requests
  const pendingRequests = connections.filter(
    (c) => c.status === 'pending' && c.receiverId === currentUser.id
  );

  // Accepted connections
  const acceptedConnections = connections.filter(
    (c) => c.status === 'accepted' && (c.senderId === currentUser.id || c.receiverId === currentUser.id)
  );

  const connectedUserIds = acceptedConnections.map((c) =>
    c.senderId === currentUser.id ? c.receiverId : c.senderId
  );

  const connectedUsers = allUsers.filter((u) => connectedUserIds.includes(u.id));

  // Suggested peers (not self, not already connected, not pending)
  const pendingSentUserIds = connections
    .filter((c) => c.status === 'pending' && c.senderId === currentUser.id)
    .map((c) => c.receiverId);

  const suggestedPeers = allUsers.filter(
    (u) =>
      u.id !== currentUser.id &&
      u.role === 'lawyer' &&
      !connectedUserIds.includes(u.id) &&
      !pendingSentUserIds.includes(u.id)
  );

  const handleAccept = (reqId: string) => {
    LegalStorage.respondConnectionRequest(reqId, true);
  };

  const handleReject = (reqId: string) => {
    LegalStorage.respondConnectionRequest(reqId, false);
  };

  const handleSendInvite = (targetUserId: string) => {
    LegalStorage.sendConnectionRequest(targetUserId, 'Colleague, I would like to connect on LexJurist.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Collegial Chamber Roll</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
            Professional Colleague Network
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage your verified practitioner network, bilateral affiliations, pending admissions, and referral channels.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-[#090D14] border border-[#1C2638] rounded text-xs font-mono">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded transition-colors font-medium relative ${
              activeTab === 'pending'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Invitations</span>
            {pendingRequests.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-400 text-slate-950 font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeTab === 'network'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Network ({connectedUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeTab === 'discover'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Suggested Colleagues
          </button>
        </div>
      </div>

      {/* Pane 1: Pending Invitations */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5">
            <h3 className="text-xs font-display uppercase tracking-widest text-slate-300 mb-1">
              Received Collegial Invitations ({pendingRequests.length})
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Review credentialed requests from advocates and counsel seeking admission to your direct professional network.
            </p>

            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((req) => {
                  const sender = LegalStorage.getUserById(req.senderId);
                  const senderName = sender?.fullName || 'Verified Colleague';
                  const senderTitle = sender?.lawyerProfile?.title || 'Advocate & Counsel';
                  const senderFirm = sender?.lawyerProfile?.firmOrOrganization || 'Legal Practice';
                  const verificationStatus = sender?.lawyerProfile?.verificationStatus || 'verified';

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded bg-[#090D14] border border-[#1A2333] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          name={senderName}
                          size="md"
                          verificationStatus={verificationStatus}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onNavigate(`/profile/${req.senderId}`)}
                              className="font-semibold text-sm text-slate-100 hover:text-amber-300 font-display tracking-wide"
                            >
                              {senderName}
                            </button>
                            <VerificationBadge status={verificationStatus} size="sm" />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {senderTitle} · <span className="text-amber-400/90">{senderFirm}</span>
                          </p>
                          {req.note && (
                            <p className="text-xs text-slate-300 italic mt-2 bg-[#06090F] p-2 rounded border border-[#172030] font-editorial">
                              "{req.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(req.id)}
                          className="p-2 rounded bg-[#131B2A] hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-[#1E293B] hover:border-rose-500/30 transition-colors"
                          title="Decline Invitation"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="px-4 py-2 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept into Roll</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No pending connection invitations awaiting action.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pane 2: My Network */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-display uppercase tracking-widest text-slate-300">
                Enrolled Network Colleagues ({connectedUsers.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {connectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 rounded bg-[#090D14] border border-[#1A2333] flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserAvatar
                      name={user.fullName}
                      size="sm"
                      verificationStatus={user.lawyerProfile?.verificationStatus}
                    />
                    <div className="min-w-0">
                      <button
                        onClick={() => onNavigate(`/profile/${user.id}`)}
                        className="font-semibold text-xs text-slate-200 hover:text-amber-300 truncate block text-left font-display"
                      >
                        {user.fullName}
                      </button>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.lawyerProfile?.title}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('/messages')}
                    className="p-1.5 rounded bg-[#131B2A] hover:bg-[#1A2538] text-slate-300 hover:text-slate-100 border border-[#1E293B]"
                    title="Send Private Dispatch"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pane 3: Suggested Peers */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5">
            <h3 className="text-xs font-display uppercase tracking-widest text-slate-300 mb-1">
              Colleagues of the Bar with Shared Practice Focus
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Expand your professional referral network with verified counsel in your jurisdiction.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedPeers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="p-4 rounded bg-[#090D14] border border-[#1A2333] flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <UserAvatar
                      name={lawyer.fullName}
                      size="md"
                      verificationStatus={lawyer.lawyerProfile?.verificationStatus}
                    />
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => onNavigate(`/profile/${lawyer.id}`)}
                        className="font-semibold text-xs text-slate-200 hover:text-amber-300 truncate block text-left font-display"
                      >
                        {lawyer.fullName}
                      </button>
                      <p className="text-[11px] text-slate-400 truncate font-sans">
                        {lawyer.lawyerProfile?.title}
                      </p>
                      <p className="text-[11px] text-amber-400/90 truncate font-sans">
                        {lawyer.lawyerProfile?.firmOrOrganization}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendInvite(lawyer.id)}
                    className="w-full py-1.5 px-3 rounded bg-[#131B2A] hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-[#1E293B] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Send Invitation</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
