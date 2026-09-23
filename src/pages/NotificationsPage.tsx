import React, { useState } from 'react';
import { LegalStorage } from '../services/storage';
import { NotificationItem } from '../types';
import {
  Bell,
  CheckCheck,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Briefcase,
  Users,
  Clock,
  Scale
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const NotificationsPage: React.FC<Props> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    LegalStorage.getNotifications()
  );
  const [filter, setFilter] = useState<'all' | 'unread' | 'connections' | 'verifications'>('all');

  const handleMarkAllRead = () => {
    LegalStorage.markAllNotificationsRead();
    setNotifications(LegalStorage.getNotifications());
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    LegalStorage.markNotificationRead(notif.id);
    setNotifications(LegalStorage.getNotifications());
    if (notif.link) {
      onNavigate(notif.link);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'connections') return n.type === 'connection_request' || n.type === 'connection_accepted';
    if (filter === 'verifications') return n.type === 'verification';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="w-4 h-4 text-sky-400" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'job_status':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'comment':
      case 'message':
        return <MessageSquare className="w-4 h-4 text-amber-300" />;
      default:
        return <ThumbsUp className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Registry Intelligence Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
            Chambers Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time updates regarding collegial invitations, bar admissions authentication, docket citations, and discussion threads.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs text-slate-200 border border-[#1E293B] font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread' },
          { id: 'connections', label: 'Invitations' },
          { id: 'verifications', label: 'Bar Accreditation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded transition-colors text-xs font-medium ${
              filter === tab.id
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-[#0D121B] border border-[#1C2638]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg shadow-sm divide-y divide-[#172030] overflow-hidden">
        {filtered.length > 0 ? (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                notif.read ? 'hover:bg-[#111724]' : 'bg-[#121927] hover:bg-[#152033] border-l-2 border-amber-400'
              }`}
            >
              <div className="p-2 rounded bg-[#080C14] border border-[#1C2638] shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-100 font-display truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-mono-data text-slate-500 shrink-0">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans">
                  {notif.description}
                </p>

                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-amber-500/30 mx-auto" />
            <p className="text-slate-300 font-display font-medium">All Chambers Notifications Clear</p>
            <p>You have reviewed all alerts across your professional docket.</p>
          </div>
        )}
      </div>
    </div>
  );
};
