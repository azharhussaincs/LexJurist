import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { LegalEvent } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  Check,
  Plus,
  Video,
  ExternalLink,
  X,
  FileText,
  Scale,
  BookOpen
} from 'lucide-react';

interface Props {
  selectedEventId?: string;
  onNavigate: (route: string) => void;
}

export const EventsPage: React.FC<Props> = ({ selectedEventId, onNavigate }) => {
  const { currentUser, isOrg, isAdmin } = useAuth();
  const [events, setEvents] = useState<LegalEvent[]>(() => LegalStorage.getEvents());
  const [formatFilter, setFormatFilter] = useState<'All' | 'Webinar' | 'In-Person Conference' | 'Hybrid CLE' | 'Panel Discussion'>('All');
  const [cleOnly, setCleOnly] = useState(false);
  const [activeEventModal, setActiveEventModal] = useState<LegalEvent | null>(() => {
    if (selectedEventId) {
      return LegalStorage.getEvents().find((e) => e.id === selectedEventId) || null;
    }
    return null;
  });
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  // New Event Form
  const [newTitle, setNewTitle] = useState('');
  const [newOrganizer, setNewOrganizer] = useState(currentUser.fullName);
  const [newFormat, setNewFormat] = useState<LegalEvent['format']>('Webinar');
  const [newDate, setNewDate] = useState('2026-11-14');
  const [newStartTime, setNewStartTime] = useState('14:00 EST');
  const [newEndTime, setNewEndTime] = useState('16:00 EST');
  const [newLocation, setNewLocation] = useState('Zoom Judicial Forum');
  const [newPractice, setNewPractice] = useState('Antitrust & Competition');
  const [newCle, setNewCle] = useState<number>(2.0);
  const [newDesc, setNewDesc] = useState('');

  const handleToggleRsvp = (eventId: string) => {
    LegalStorage.toggleEventRsvp(eventId);
    setEvents(LegalStorage.getEvents());
    if (activeEventModal?.id === eventId) {
      setActiveEventModal(LegalStorage.getEvents().find((e) => e.id === eventId) || null);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    LegalStorage.createEvent({
      title: newTitle.trim(),
      description: newDesc.trim(),
      organizer: newOrganizer,
      format: newFormat,
      startDate: newDate,
      startTime: newStartTime,
      endDate: newDate,
      endTime: newEndTime,
      locationOrUrl: newLocation,
      practiceArea: newPractice,
      cleCredits: newCle || undefined,
      speakers: [
        `${currentUser.fullName} (${currentUser.lawyerProfile?.title || 'Keynote Faculty'})`,
      ],
      registrationOpen: true,
    });

    setEvents(LegalStorage.getEvents());
    setCreateEventModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredEvents = events.filter((e) => {
    if (formatFilter !== 'All' && e.format !== formatFilter) return false;
    if (cleOnly && !e.cleCredits) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Judicial Symposia & Continuing Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
            Accredited CLE & Legal Symposia
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            State bar-accredited Continuing Legal Education courses, judicial panels, appellate arguments, and cross-border symposiums.
          </p>
        </div>

        {(isOrg || isAdmin) && (
          <button
            onClick={() => setCreateEventModalOpen(true)}
            className="px-3.5 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Convene CLE Symposium</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5 flex items-center justify-between gap-4 flex-wrap text-xs shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[10px] font-display uppercase tracking-wider">Format:</span>
          {(['All', 'Webinar', 'In-Person Conference', 'Hybrid CLE', 'Panel Discussion'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-2.5 py-1 rounded transition-colors text-xs ${
                formatFilter === fmt
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2A]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
          <input
            type="checkbox"
            checked={cleOnly}
            onChange={(e) => setCleOnly(e.target.checked)}
            className="rounded border-[#1E293B] bg-[#080C13] text-amber-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span className="font-mono text-xs">Accredited CLE Credits Only</span>
        </label>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => {
          const isRegistered = evt.attendeeIds?.includes(currentUser.id);
          return (
            <div
              key={evt.id}
              className="bg-[#0D121B] border border-[#1C2638] hover:border-[#28364F] rounded-lg p-5 shadow-sm transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span className="text-amber-400/90 font-semibold">{evt.format}</span>
                  {evt.cleCredits && (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono-data">
                      <Award className="w-3.5 h-3.5" />
                      <span>{evt.cleCredits} CLE Credits</span>
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => setActiveEventModal(evt)}
                  className="text-base font-bold text-slate-100 font-display hover:text-amber-300 cursor-pointer line-clamp-2 tracking-wide transition-colors"
                >
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {evt.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-[#172030] font-mono-data">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{evt.startDate} · {evt.startTime} - {evt.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{evt.locationOrUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-sans">Faculty Host: {evt.organizer}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#172030]">
                <span className="text-xs font-mono-data text-slate-500">
                  {evt.attendeesCount} Practitioners Registered
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEventModal(evt)}
                    className="px-3 py-1.5 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs font-medium text-slate-200 border border-[#1E293B] font-display tracking-wider uppercase text-[10px]"
                  >
                    Faculty Syllabus
                  </button>
                  <button
                    onClick={() => handleToggleRsvp(evt.id)}
                    className={`px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isRegistered
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Register RSVP</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0D121B] border border-[#26354D] rounded-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2538] bg-[#0A0E17]/60">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400">
                  {activeEventModal.practiceArea} · {activeEventModal.format}
                </span>
                <h3 className="text-base font-bold text-slate-100 font-display">
                  {activeEventModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveEventModal(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              {activeEventModal.cleCredits && (
                <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>
                    Accredited: Eligible for <strong className="font-mono">{activeEventModal.cleCredits} Substantive CLE Hours</strong> across participating State Bar authorities.
                  </span>
                </div>
              )}

              <div>
                <span className="font-semibold text-slate-200 block mb-1 text-sm font-display">Syllabus Overview</span>
                <p className="leading-relaxed whitespace-pre-line font-sans">{activeEventModal.description}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-200 block mb-1 font-display uppercase text-[10px]">
                  Confirmed Faculty & Keynote Speakers:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-400 font-sans">
                  {activeEventModal.speakers.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded bg-[#090D14] border border-[#1A2333] space-y-1 text-[11px] font-mono-data text-slate-400">
                <div>Date & Time: {activeEventModal.startDate} ({activeEventModal.startTime} - {activeEventModal.endTime})</div>
                <div>Venue / Virtual Chambers: {activeEventModal.locationOrUrl}</div>
                <div>Organizer: {activeEventModal.organizer}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-[#1A2538] bg-[#0A0E17]/60">
              <button
                onClick={() => setActiveEventModal(null)}
                className="px-4 py-1.5 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 text-xs"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleToggleRsvp(activeEventModal.id)}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                {activeEventModal.attendeeIds?.includes(currentUser.id) ? 'Revoke RSVP' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convene Event Modal */}
      {createEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0D121B] border border-[#26354D] rounded-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2538] mb-4">
              <h3 className="font-bold text-slate-100 font-display text-sm">
                Convene Accredited Legal Symposium / CLE
              </h3>
              <button
                onClick={() => setCreateEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Symposium Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Current Precedents in Second Circuit Securities Litigation"
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Conveyance Format
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="Webinar">Live Judicial Webinar</option>
                    <option value="Hybrid CLE">Hybrid CLE Symposium</option>
                    <option value="In-Person Conference">In-Person Conference</option>
                    <option value="Panel Discussion">Panel Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Accredited CLE Credits
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCle}
                    onChange={(e) => setNewCle(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="e.g. 14:00 - 16:00 EST"
                    className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Virtual Chambers URL / Physical Court Venue
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Syllabus & Learning Outcomes
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize course content, statutory analysis, and faculty qualifications..."
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded p-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1A2538]">
                <button
                  type="button"
                  onClick={() => setCreateEventModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Publish Symposium
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
