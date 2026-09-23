import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { VerificationRequest, ContentReport, User } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';
import { VerificationBadge } from '../components/common/VerificationBadge';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Briefcase,
  Flag,
  Award,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  Scale,
  Check,
  Ban
} from 'lucide-react';

interface Props {
  onNavigate: (route: string) => void;
}

export const AdminDashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'users'>('verifications');

  const [verifications, setVerifications] = useState<VerificationRequest[]>(() =>
    LegalStorage.getVerificationRequests()
  );
  const [reports, setReports] = useState<ContentReport[]>(() => LegalStorage.getReports());
  const [users, setUsers] = useState<User[]>(() => LegalStorage.getUsers());
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Metrics
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.lawyerProfile?.verificationStatus === 'verified').length;
  const pendingRequests = verifications.filter((v) => v.status === 'pending').length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const totalPosts = LegalStorage.getPosts().length;
  const totalJobs = LegalStorage.getJobs().length;

  const handleApproveVerification = (reqId: string) => {
    LegalStorage.processVerificationRequest(reqId, 'approved', 'Bar credentials confirmed against state registry.');
    setVerifications(LegalStorage.getVerificationRequests());
    setUsers(LegalStorage.getUsers());
    showSuccess('Lawyer Bar Credentials Approved & Verified Badge Issued.');
  };

  const handleRejectVerification = (reqId: string) => {
    LegalStorage.processVerificationRequest(reqId, 'rejected', 'Bar roll number did not match current active roster.');
    setVerifications(LegalStorage.getVerificationRequests());
    setUsers(LegalStorage.getUsers());
    showSuccess('Verification Request Rejected with Notification.');
  };

  const handleResolveReport = (reportId: string, actionTaken: string) => {
    LegalStorage.resolveReport(reportId, 'resolved', actionTaken);
    setReports(LegalStorage.getReports());
    showSuccess(`Report marked resolved: ${actionTaken}`);
  };

  const handleToggleUserSuspension = (targetUserId: string) => {
    const updated = users.map((u) => {
      if (u.id === targetUserId) {
        const nextStatus = u.status === 'suspended' ? ('active' as const) : ('suspended' as const);
        return { ...u, status: nextStatus, isSuspended: nextStatus === 'suspended' };
      }
      return u;
    });
    setUsers(updated);
    showSuccess('User account status updated.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Judicial Registry & Compliance Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
            Bar Admissions & Grievance Console
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Supervise bar credential authentication queues, adjudicate professional ethics reports, and maintain regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-[#090D14] border border-amber-500/30 text-amber-300 text-xs font-mono">
            Chambers Judicial Authority: ENFORCING
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 block">Enrolled Counsel</span>
          <div className="text-xl font-bold font-mono-data text-slate-100 mt-1">{totalUsers}</div>
        </div>

        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 block">Verified Advocates</span>
          <div className="text-xl font-bold font-mono-data text-amber-400 mt-1">{verifiedUsers}</div>
        </div>

        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 block">Pending Bar Review</span>
          <div className="text-xl font-bold font-mono-data text-sky-400 mt-1">{pendingRequests}</div>
        </div>

        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 block">Ethics Grievances</span>
          <div className="text-xl font-bold font-mono-data text-rose-400 mt-1">{pendingReports}</div>
        </div>

        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 block">Precedents Filed</span>
          <div className="text-xl font-bold font-mono-data text-slate-100 mt-1">{totalPosts}</div>
        </div>

        <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-3.5">
          <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 block">Active Mandates</span>
          <div className="text-xl font-bold font-mono-data text-slate-100 mt-1">{totalJobs}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center gap-1 border-b border-[#1C2638] px-4 bg-[#0A0E17]/60 text-xs">
          {[
            { id: 'verifications', label: `Bar Verification Queue (${pendingRequests})` },
            { id: 'reports', label: `Ethics & UPL Grievances (${pendingReports})` },
            { id: 'users', label: `Registry Roll (${users.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 font-medium transition-colors border-b-2 font-display tracking-wider text-[11px] uppercase ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Admissions submitted for Bar verification and regulatory authentication.</span>
              </div>

              {verifications.length > 0 ? (
                <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                  {verifications.map((v) => (
                    <div key={v.id} className="p-4 bg-[#090D14] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100 font-display">{v.fullName}</span>
                          <span className="text-xs text-slate-500 font-mono">({v.email})</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              v.status === 'pending'
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                                : v.status === 'verified'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300">
                          {v.barCouncil} · <span className="font-medium text-amber-400/90">{v.jurisdiction}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono-data text-slate-400">
                          <span>License Roll #: {v.licenseNumber}</span>
                          <span>·</span>
                          <span>Admitted: {v.admissionYear}</span>
                          <span>·</span>
                          <span>Submitted: {new Date(v.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {v.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectVerification(v.id)}
                            className="px-3 py-1.5 rounded bg-[#131B2A] hover:bg-rose-950/40 text-rose-300 text-xs font-medium border border-[#1E293B] hover:border-rose-500/30 transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Roll</span>
                          </button>
                          <button
                            onClick={() => handleApproveVerification(v.id)}
                            className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Authenticate Counsel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500">
                  All bar admission submissions have been reviewed and verified.
                </div>
              )}
            </div>
          )}

          {/* Ethics Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Ethical violations, unauthorized practice of law (UPL) flags, and confidentiality breaches.
              </div>

              {reports.length > 0 ? (
                <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                  {reports.map((r) => (
                    <div key={r.id} className="p-4 bg-[#090D14] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3.5 h-3.5 text-rose-400" />
                          <span className="font-semibold text-sm text-slate-100 font-display">{r.reason}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              r.status === 'pending'
                                ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{r.explanation}</p>

                        <div className="text-[11px] font-mono text-slate-400">
                          Target: <span className="text-amber-300 font-semibold">{r.targetTitle}</span> ({r.targetType})
                        </div>
                      </div>

                      {r.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleResolveReport(r.id, 'Dismissed - within professional standard')}
                            className="px-3 py-1.5 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 text-xs border border-[#1E293B]"
                          >
                            Dismiss Grievance
                          </button>
                          <button
                            onClick={() => handleResolveReport(r.id, 'Notice of Compliance Warning Issued')}
                            className="px-3 py-1.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 text-xs font-semibold"
                          >
                            Issue Admonition
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500">
                  No active ethics complaints or grievances pending adjudication.
                </div>
              )}
            </div>
          )}

          {/* Registry Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="divide-y divide-[#172030] border border-[#1C2638] rounded-lg overflow-hidden">
                {users.map((u) => {
                  const isSuspended = u.status === 'suspended' || u.isSuspended;
                  return (
                    <div key={u.id} className="p-3.5 bg-[#090D14] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.fullName} size="sm" verificationStatus={u.lawyerProfile?.verificationStatus} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-200 font-display text-xs">{u.fullName}</span>
                            {u.lawyerProfile && <VerificationBadge status={u.lawyerProfile.verificationStatus} size="sm" />}
                          </div>
                          <span className="text-[11px] text-slate-400">{u.email} · {u.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigate(`/profile/${u.id}`)}
                          className="px-2.5 py-1 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 border border-[#1E293B]"
                        >
                          Dossier
                        </button>
                        <button
                          onClick={() => handleToggleUserSuspension(u.id)}
                          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            isSuspended
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isSuspended ? 'Lift Suspension' : 'Suspend Standing'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
