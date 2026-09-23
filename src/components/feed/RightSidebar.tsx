import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LegalStorage } from '../../services/storage';
import { UserAvatar } from '../common/UserAvatar';
import { VerificationBadge } from '../common/VerificationBadge';
import {
  UserPlus,
  Calendar,
  TrendingUp,
  ExternalLink,
  Check,
  Scale,
  Award,
  BookOpen
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const RightSidebar: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, allUsers } = useAuth();
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [rsvpEventIds, setRsvpEventIds] = useState<string[]>([]);

  // Suggested peers: other lawyers who are not current user
  const suggestedLawyers = allUsers
    .filter((u) => u.id !== currentUser.id && u.role === 'lawyer')
    .slice(0, 3);

  const upcomingEvents = LegalStorage.getEvents().slice(0, 2);

  const handleConnect = (targetUserId: string) => {
    LegalStorage.sendConnectionRequest(targetUserId, 'Colleague, I would like to connect on LexJurist.');
    setConnectedIds([...connectedIds, targetUserId]);
  };

  const handleToggleRsvp = (eventId: string) => {
    const isNowRegistered = LegalStorage.toggleEventRsvp(eventId);
    if (isNowRegistered) {
      setRsvpEventIds([...rsvpEventIds, eventId]);
    } else {
      setRsvpEventIds(rsvpEventIds.filter((id) => id !== eventId));
    }
  };

  const trendingTopics = [
    { title: 'Section 1 Algorithmic Pricing', category: 'Antitrust', count: '142 citations' },
    { title: 'Delaware Section 220 Demands', category: 'Chancery Court', count: '89 citations' },
    { title: 'EU AI Act Governance Conformity', category: 'Tech Regulation', count: '210 citations' },
    { title: 'New York Convention Enforcement', category: 'Arbitration', count: '64 citations' },
  ];

  return (
    <aside aria-label="Suggested peers and appellate docket" className="space-y-4">
      {/* Colleagues of the Bar */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm text-xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#172030]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100 font-display tracking-wider uppercase text-[11px]">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Colleagues of the Bar</span>
          </div>
          <button
            onClick={() => onNavigate('/lawyers')}
            className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
          >
            Roster
          </button>
        </div>

        <div className="space-y-3">
          {suggestedLawyers.map((lawyer) => {
            const isPending = connectedIds.includes(lawyer.id);
            return (
              <div key={lawyer.id} className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <UserAvatar
                    name={lawyer.fullName}
                    size="sm"
                    verificationStatus={lawyer.lawyerProfile?.verificationStatus}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onNavigate(`/profile/${lawyer.id}`)}
                        className="font-semibold text-slate-200 hover:text-amber-300 truncate text-left font-display tracking-wide text-xs"
                      >
                        {lawyer.fullName}
                      </button>
                      {lawyer.lawyerProfile?.verificationStatus && (
                        <VerificationBadge status={lawyer.lawyerProfile.verificationStatus} size="sm" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {lawyer.lawyerProfile?.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {lawyer.lawyerProfile?.firmOrOrganization} · {lawyer.lawyerProfile?.location.city}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleConnect(lawyer.id)}
                  disabled={isPending}
                  className={`p-1.5 rounded transition-colors shrink-0 ${
                    isPending
                      ? 'bg-[#141C2A] text-amber-400 border border-amber-500/30'
                      : 'bg-[#131B2A] hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-[#1E293B]'
                  }`}
                  title={isPending ? 'Invitation Pending' : 'Send Collegial Invitation'}
                >
                  {isPending ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <UserPlus className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appellate Docket & Precedents */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm text-xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#172030]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100 font-display tracking-wider uppercase text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Appellate Docket Trends</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Live</span>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((topic, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-amber-400/80 uppercase">{topic.category}</span>
                <span className="font-mono-data">{topic.count}</span>
              </div>
              <h5 className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors text-xs leading-snug mt-0.5">
                {topic.title}
              </h5>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming CLE & Legal Symposia */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm text-xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#172030]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100 font-display tracking-wider uppercase text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Accredited CLE Symposia</span>
          </div>
          <button
            onClick={() => onNavigate('/events')}
            className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
          >
            All CLE
          </button>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((evt) => {
            const isRsvped = evt.attendeeIds?.includes(currentUser.id) || rsvpEventIds.includes(evt.id);
            return (
              <div key={evt.id} className="p-3 rounded bg-[#090D14] border border-[#1A2333] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    {evt.format}
                  </span>
                  {evt.cleCredits && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{evt.cleCredits} CLE Credits</span>
                    </span>
                  )}
                </div>

                <h5 className="font-semibold text-slate-200 line-clamp-1 font-display text-xs">
                  {evt.title}
                </h5>

                <p className="text-[11px] text-slate-500 font-mono">
                  {evt.startDate} · {evt.startTime}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono-data">
                    {evt.attendeesCount} Registered
                  </span>

                  <button
                    onClick={() => handleToggleRsvp(evt.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      isRsvped
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        : 'bg-[#131B2A] hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-[#1E293B]'
                    }`}
                  >
                    {isRsvped ? 'Registered ✓' : 'Register RSVP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
