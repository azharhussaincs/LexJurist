import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { LegalJob, JobApplication } from '../types';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Check,
  Send,
  Plus,
  X,
  FileText,
  Building,
  Scale,
  Award
} from 'lucide-react';

interface Props {
  selectedJobId?: string;
  onNavigate: (route: string) => void;
}

export const JobsPage: React.FC<Props> = ({ selectedJobId, onNavigate }) => {
  const { currentUser, isOrg, isAdmin } = useAuth();
  const [jobs, setJobs] = useState<LegalJob[]>(() => LegalStorage.getJobs());
  const [applications, setApplications] = useState<JobApplication[]>(() => LegalStorage.getJobApplications());
  const [activeTab, setActiveTab] = useState<'browse' | 'applications'>('browse');

  const [searchQuery, setSearchQuery] = useState('');
  const [practiceFilter, setPracticeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modals
  const [activeJobModal, setActiveJobModal] = useState<LegalJob | null>(() => {
    if (selectedJobId) {
      return LegalStorage.getJobs().find((j) => j.id === selectedJobId) || null;
    }
    return null;
  });

  const [applyModalJob, setApplyModalJob] = useState<LegalJob | null>(null);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);

  // Application form state
  const [applicantBarNumber, setApplicantBarNumber] = useState(
    currentUser.lawyerProfile?.barAdmissions[0]?.licenseNumber || ''
  );
  const [coverNote, setCoverNote] = useState('');
  const [appSubmitted, setAppSubmitted] = useState(false);

  // Post Job form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobPractice, setNewJobPractice] = useState('Corporate & M&A');
  const [newJobType, setNewJobType] = useState<LegalJob['employmentType']>('Full-time Associate');
  const [newJobExp, setNewJobExp] = useState('3-6 years');
  const [newJobLocation, setNewJobLocation] = useState('New York, NY (Hybrid)');
  const [newJobSalary, setNewJobSalary] = useState('$260,000 - $310,000 + Bonus');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobBarReq, setNewJobBarReq] = useState('Active state bar admission in good standing.');

  const savedJobIds = LegalStorage.getSavedItems().jobs;

  const handleToggleSaveJob = (jobId: string) => {
    LegalStorage.toggleSaveItem('jobs', jobId);
    setJobs([...LegalStorage.getJobs()]);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;

    LegalStorage.submitJobApplication({
      jobId: applyModalJob.id,
      jobTitle: applyModalJob.title,
      organizationName: applyModalJob.organizationName,
      applicantId: currentUser.id,
      applicantName: currentUser.fullName,
      applicantEmail: currentUser.email,
      applicantBarNumber: applicantBarNumber.trim() || 'NY-4892103',
      primaryPractice: currentUser.lawyerProfile?.primaryPracticeArea || 'Appellate & Complex Litigation',
      yearsExperience: currentUser.lawyerProfile?.yearsOfExperience || 10,
      coverNote: coverNote.trim(),
      resumeFileName: 'Curriculum_Vitae_Legal_Credentials.pdf',
    });

    setAppSubmitted(true);
    setApplications(LegalStorage.getJobApplications());
    setTimeout(() => {
      setAppSubmitted(false);
      setApplyModalJob(null);
      setCoverNote('');
    }, 1500);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    LegalStorage.createJob({
      organizationId: currentUser.id,
      organizationName: currentUser.organizationProfile?.name || currentUser.fullName,
      title: newJobTitle.trim(),
      practiceArea: newJobPractice,
      employmentType: newJobType,
      experienceRequired: newJobExp,
      location: newJobLocation,
      isRemoteFriendly: true,
      salaryRange: newJobSalary,
      description: newJobDesc.trim(),
      keyResponsibilities: [
        'Manage high-stakes transactional or litigation portfolios with partner oversight',
        'Direct associate diligence teams and interface with corporate board counsel',
      ],
      requirements: [
        'Superior academic credentials from an accredited law school',
        'Substantial peer-recognized substantive practice experience',
      ],
      barRequirements: newJobBarReq,
      applicationDeadline: '2026-11-30',
    });

    setJobs(LegalStorage.getJobs());
    setPostJobModalOpen(false);
    setNewJobTitle('');
    setNewJobDesc('');
  };

  const filteredJobs = jobs.filter((j) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        j.title.toLowerCase().includes(q) ||
        j.organizationName.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (practiceFilter !== 'All' && j.practiceArea !== practiceFilter) return false;
    if (typeFilter !== 'All' && j.employmentType !== typeFilter) return false;
    return true;
  });

  const myApplications = applications.filter((a) => a.applicantId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A2333]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Chambers Lateral Exchange</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 tracking-tight">
            Lateral Appointments & Searches
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Partner transitions, General Counsel mandates, and selective associate appointments from accredited law firms and legal departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-[#090D14] border border-[#1C2638] rounded text-xs font-mono">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded transition-colors font-medium ${
                activeTab === 'browse'
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Searches ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded transition-colors font-medium ${
                activeTab === 'applications'
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Dossiers ({myApplications.length})
            </button>
          </div>

          {(isOrg || isAdmin) && (
            <button
              onClick={() => setPostJobModalOpen(true)}
              className="px-3.5 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Post Lateral Mandate</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Filters */}
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search searches by title, law firm, practice discipline, or credentials..."
                className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-4 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] font-display uppercase tracking-wider">Practice:</span>
                <select
                  value={practiceFilter}
                  onChange={(e) => setPracticeFilter(e.target.value)}
                  className="bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="All">All Practices</option>
                  <option value="Corporate & M&A">Corporate & M&A</option>
                  <option value="Technology Law">Technology & IP</option>
                  <option value="Appellate & Complex Litigation">Appellate Litigation</option>
                  <option value="International Commercial Arbitration">International Arbitration</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] font-display uppercase tracking-wider">Appointment Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="All">All Appointment Types</option>
                  <option value="Full-time Associate">Full-time Associate</option>
                  <option value="Partner Track">Partner Track</option>
                  <option value="General Counsel">General Counsel / In-House</option>
                  <option value="Of Counsel">Of Counsel</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-[#0D121B] border border-[#1C2638] hover:border-[#28364F] rounded-lg p-5 shadow-sm transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <span className="text-amber-400/90 font-semibold">{job.practiceArea}</span>
                      <span className="text-slate-600">·</span>
                      <span>{job.employmentType}</span>
                    </div>

                    <h3
                      onClick={() => setActiveJobModal(job)}
                      className="text-base font-bold text-slate-100 font-display hover:text-amber-300 cursor-pointer tracking-wide transition-colors"
                    >
                      {job.title}
                    </h3>

                    <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-500/80" />
                      <span>{job.organizationName}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1 font-mono-data">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{job.location}</span>
                      </span>
                      {job.salaryRange && (
                        <span className="flex items-center gap-1 text-amber-300">
                          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                          <span>{job.salaryRange}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Min Experience: {job.experienceRequired}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleSaveJob(job.id)}
                      className={`p-2 rounded border transition-colors ${
                        isSaved
                          ? 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                          : 'border-[#1E293B] text-slate-400 hover:text-slate-200 bg-[#131B2A]'
                      }`}
                      title={isSaved ? 'Saved to bookmarks' : 'Save mandate'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => setActiveJobModal(job)}
                      className="px-3.5 py-1.5 rounded bg-[#131B2A] hover:bg-[#1A2538] text-xs font-medium text-slate-200 border border-[#1E293B] transition-colors font-display tracking-wider uppercase text-[10px]"
                    >
                      Mandate Brief
                    </button>

                    <button
                      onClick={() => setApplyModalJob(job)}
                      className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow"
                    >
                      Submit Credentials
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Applications Tab */
        <div className="space-y-4">
          <div className="bg-[#0D121B] border border-[#1C2638] rounded-lg p-5">
            <h3 className="text-xs font-display uppercase tracking-widest text-slate-300 mb-2">
              Confidential Application Tracking
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              All submitted lateral dossiers and bar admissions are transmitted confidentially to the recruiting partners of the designated chambers.
            </p>

            <div className="space-y-3">
              {myApplications.length > 0 ? (
                myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded bg-[#090D14] border border-[#1A2333] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-200 font-display text-sm">{app.jobTitle}</h4>
                      <p className="text-amber-400 font-medium">{app.organizationName}</p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()} · Bar Roll: {app.applicantBarNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#131B2A] border border-[#1E293B] text-[11px] font-mono text-amber-300 capitalize">
                        Status: {app.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-6 text-center">
                  No lateral dossiers filed yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0D121B] border border-[#26354D] rounded-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2538] bg-[#0A0E17]/60">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400">
                  {activeJobModal.practiceArea} · {activeJobModal.employmentType}
                </span>
                <h3 className="text-base font-bold text-slate-100 font-display">
                  {activeJobModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveJobModal(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-slate-200 block mb-1 text-sm font-display">Search Overview</span>
                <p className="leading-relaxed whitespace-pre-line">{activeJobModal.description}</p>
              </div>

              {activeJobModal.barRequirements && (
                <div className="p-3 rounded bg-[#090D14] border border-amber-500/20 text-amber-200">
                  <span className="font-semibold font-display uppercase tracking-wider text-[10px] block mb-1">
                    Mandatory Bar Admission Criteria:
                  </span>
                  <p>{activeJobModal.barRequirements}</p>
                </div>
              )}

              {activeJobModal.keyResponsibilities && (
                <div>
                  <span className="font-semibold text-slate-200 block mb-1 font-display uppercase text-[10px]">
                    Key Responsibilities:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {activeJobModal.keyResponsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-[#1A2538] bg-[#0A0E17]/60">
              <button
                onClick={() => setActiveJobModal(null)}
                className="px-4 py-1.5 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setApplyModalJob(activeJobModal);
                  setActiveJobModal(null);
                }}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0D121B] border border-[#26354D] rounded-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2538] mb-4">
              <div>
                <h3 className="font-bold text-slate-100 font-display text-sm">
                  Confidential Application Submission
                </h3>
                <p className="text-[11px] text-amber-400">{applyModalJob.title} · {applyModalJob.organizationName}</p>
              </div>
              <button
                onClick={() => setApplyModalJob(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-semibold text-slate-200 font-display">Credentials Transmitted Confidentially</h4>
                <p className="text-xs text-slate-400">
                  Your chambers dossier has been transmitted to the designated partner search committee.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Primary Bar Admission License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantBarNumber}
                    onChange={(e) => setApplicantBarNumber(e.target.value)}
                    placeholder="e.g. NY Bar Roll #4892103"
                    className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded px-3 py-1.5 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Confidential Lateral Introduction Note
                  </label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly summarize your practice focus, portable client base (if applicable), and interest..."
                    className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 rounded bg-[#090D14] border border-[#1A2333] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-[11px] text-slate-300">Verified_Bar_Credentials_CV.pdf</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Attached</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1A2538]">
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(null)}
                    className="px-4 py-1.5 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Submit Credentials
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post Job Modal (Firm/Admin) */}
      {postJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0D121B] border border-[#26354D] rounded-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2538] mb-4">
              <h3 className="font-bold text-slate-100 font-display text-sm">
                Initiate New Lateral Search Mandate
              </h3>
              <button
                onClick={() => setPostJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Position Title
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Antitrust & Trade Partner Track"
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Practice Discipline
                  </label>
                  <select
                    value={newJobPractice}
                    onChange={(e) => setNewJobPractice(e.target.value)}
                    className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="Corporate & M&A">Corporate & M&A</option>
                    <option value="Technology Law">Technology & IP</option>
                    <option value="Appellate & Complex Litigation">Appellate Litigation</option>
                    <option value="International Commercial Arbitration">International Arbitration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                    Appointment Rank
                  </label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value as any)}
                    className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="Full-time Associate">Full-time Associate</option>
                    <option value="Partner Track">Partner Track</option>
                    <option value="General Counsel">General Counsel</option>
                    <option value="Of Counsel">Of Counsel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Location & Practice Modality
                </label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Compensation Package Band
                </label>
                <input
                  type="text"
                  value={newJobSalary}
                  onChange={(e) => setNewJobSalary(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-400 mb-1">
                  Mandate Specification & Overview
                </label>
                <textarea
                  rows={3}
                  required
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Specify candidate profile, expected book of business, or transactional responsibilities..."
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded p-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1A2538]">
                <button
                  type="button"
                  onClick={() => setPostJobModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#131B2A] text-slate-300 hover:text-slate-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  File Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
