import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LegalStorage } from '../services/storage';
import { UserRole } from '../types';
import { Scale, ShieldCheck, Lock, User, Mail, Award, Building, ArrowRight } from 'lucide-react';

interface Props {
  mode: 'login' | 'register';
  onNavigate: (route: string) => void;
}

export const AuthPages: React.FC<Props> = ({ mode, onNavigate }) => {
  const { allUsers, switchUser } = useAuth();
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(mode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('lawyer');
  const [barCouncil, setBarCouncil] = useState('New York State Bar Association');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [admissionYear, setAdmissionYear] = useState('2018');
  const [primaryPractice, setPrimaryPractice] = useState('Appellate & Complex Litigation');
  const [firmName, setFirmName] = useState('');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('United States');
  const [agreedEthics, setAgreedEthics] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchUser(found.id);
      onNavigate('/home');
    } else {
      // Allow login with demo persona
      const first = allUsers[0];
      switchUser(first.id);
      onNavigate('/home');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedEthics) {
      setErrorMsg('You must affirm compliance with the Legal Peer Ethics Oath.');
      return;
    }

    const newUser = LegalStorage.createUser({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      lawyerProfile:
        role === 'lawyer'
          ? {
              title: 'Associate Attorney',
              firmOrOrganization: firmName.trim() || 'Independent Practice',
              primaryPracticeArea: primaryPractice,
              practiceAreas: [primaryPractice, 'Legal Research'],
              bio: `${fullName} is an advocate admitted to practice before the ${barCouncil}.`,
              yearsOfExperience: 2026 - parseInt(admissionYear || '2020', 10),
              barAdmissions: [
                {
                  id: `adm-${Date.now()}`,
                  barCouncil,
                  licenseNumber: licenseNumber || 'NY-994102',
                  jurisdiction: city,
                  admissionYear: parseInt(admissionYear || '2018', 10),
                  status: 'Active',
                  isVerified: false,
                },
              ],
              education: [
                {
                  id: `edu-${Date.now()}`,
                  institution: 'Columbia Law School',
                  degree: 'Juris Doctor (J.D.)',
                  graduationYear: parseInt(admissionYear || '2018', 10),
                },
              ],
              experience: [
                {
                  id: `exp-${Date.now()}`,
                  organization: firmName || 'Independent Practice',
                  role: 'Counsel',
                  startDate: '2022',
                  endDate: 'Present',
                  location: city,
                  description: 'Active substantive litigation and counseling.',
                },
              ],
              location: {
                city,
                country,
              },
              languages: ['English'],
              verificationStatus: 'pending',
              connectionsCount: 0,
              followersCount: 0,
              followingCount: 0,
              privacySettings: {
                profileVisibility: 'public_lawyers',
                allowDirectMessages: 'network_only',
                showBarNumber: true,
              },
            }
          : undefined,
      organizationProfile:
        role === 'organization'
          ? {
              name: fullName,
              organizationType: 'Law Firm',
              tagline: 'Leading Legal Practice',
              about: 'Distinguished legal partnership serving international and domestic clients.',
              headquarters: `${city}, ${country}`,
              practiceAreas: [primaryPractice],
              website: 'https://example-law.com',
              isVerified: true,
            }
          : undefined,
    });

    switchUser(newUser.id);
    onNavigate('/home');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0D121B] border border-[#1C2638] rounded-lg shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto text-slate-950 shadow-md">
            <Scale className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-100 tracking-wider">
            LEXJURIST
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
            The exclusive professional peer network for verified advocates, general counsel, and legal partnerships.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#080C13] border border-[#1E293B] rounded text-xs font-semibold font-display tracking-wider uppercase">
          <button
            onClick={() => setCurrentMode('login')}
            className={`py-2 rounded transition-colors ${
              currentMode === 'login'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In to Chambers
          </button>
          <button
            onClick={() => setCurrentMode('register')}
            className={`py-2 rounded transition-colors ${
              currentMode === 'register'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Apply for Membership
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {currentMode === 'login' ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">
                Official Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@firm.com"
                  className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded pl-9 pr-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#080C13] border border-[#1E293B] focus:border-amber-500/50 rounded pl-9 pr-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow"
            >
              Authenticate & Enter Chambers
            </button>

            {/* Quick Demo Switcher Section */}
            <div className="pt-4 border-t border-[#1C2638] space-y-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-slate-400 block text-center">
                Instant Chambers Access (One-Click Credentials)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchUser('user-eleanor-vance');
                    onNavigate('/home');
                  }}
                  className="p-2.5 rounded bg-[#080C13] hover:bg-[#131B2A] border border-[#1E293B] hover:border-amber-500/40 text-left transition-colors"
                >
                  <span className="font-semibold text-amber-300 block font-display text-xs">Eleanor Vance, Esq.</span>
                  <span className="text-slate-400 text-[10px] font-mono">Litigation Partner</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchUser('org-hastings-clark');
                    onNavigate('/home');
                  }}
                  className="p-2.5 rounded bg-[#080C13] hover:bg-[#131B2A] border border-[#1E293B] hover:border-sky-500/40 text-left transition-colors"
                >
                  <span className="font-semibold text-sky-300 block font-display text-xs">Hastings & Clark</span>
                  <span className="text-slate-400 text-[10px] font-mono">Law Firm Entity</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchUser('user-admin-bar-council');
                    onNavigate('/admin');
                  }}
                  className="p-2.5 rounded bg-[#080C13] hover:bg-[#131B2A] border border-[#1E293B] hover:border-rose-500/40 text-left transition-colors"
                >
                  <span className="font-semibold text-rose-300 block font-display text-xs">Ethics Registrar</span>
                  <span className="text-slate-400 text-[10px] font-mono">Compliance Console</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Katherine Sterling, Esq."
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="katherine@sterlinglaw.com"
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Account Category</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="lawyer">Licensed Advocate / Counsel</option>
                  <option value="organization">Law Firm / Corporate Legal Dept</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Primary Practice</label>
                <select
                  value={primaryPractice}
                  onChange={(e) => setPrimaryPractice(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="Corporate & M&A">Corporate & M&A</option>
                  <option value="Appellate & Complex Litigation">Appellate Litigation</option>
                  <option value="Technology Law">Technology, AI & IP</option>
                  <option value="International Commercial Arbitration">International Arbitration</option>
                  <option value="White-Collar Defense">White-Collar Defense</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">
                  Bar Licensing Authority *
                </label>
                <input
                  type="text"
                  required
                  value={barCouncil}
                  onChange={(e) => setBarCouncil(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">
                  Bar License Roll # *
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. NY-4892103"
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Firm or Chambers *</label>
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="e.g. Sterling & Partners LLP"
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-display uppercase tracking-wider text-slate-300 mb-1">Admission Year *</label>
                <input
                  type="number"
                  value={admissionYear}
                  onChange={(e) => setAdmissionYear(e.target.value)}
                  className="w-full bg-[#080C13] border border-[#1E293B] rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="p-3 bg-[#080C13] border border-[#1E293B] rounded space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedEthics}
                  onChange={(e) => setAgreedEthics(e.target.checked)}
                  className="mt-0.5 rounded border-[#1E293B] text-amber-500 focus:ring-0 bg-[#06090F]"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  I solemnly affirm that I am an attorney or legal practitioner in good standing. I covenant to uphold confidentiality, avoid unauthorized practice of law (UPL), and comply with jurisdictional ethics rules.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow"
            >
              Submit Application for Bar Authentication
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
