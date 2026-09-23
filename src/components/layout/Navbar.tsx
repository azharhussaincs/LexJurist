import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  Scale,
  Bell,
  MessageSquare,
  Shield,
  Search,
  Menu,
  X,
  Bookmark,
  LogOut,
  UserCheck,
  Building,
  CheckCircle2,
  ChevronDown,
  Award,
  Layers
} from 'lucide-react';

interface Props {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<Props> = ({ currentRoute, onRouteChange, onOpenSearch }) => {
  const { currentUser, allUsers, switchUser, isAdmin, isLawyer, isOrg, unreadNotificationsCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navLinks = [
    { label: 'Feed & Docket', route: '/home' },
    { label: 'Counsel Roster', route: '/lawyers' },
    { label: 'Network', route: '/connections' },
    { label: 'Practice Groups', route: '/communities' },
    { label: 'Opportunities', route: '/jobs' },
    { label: 'CLE & Symposia', route: '/events' },
  ];

  if (isAdmin) {
    navLinks.push({ label: 'Bar Oversight', route: '/admin' });
  }

  const handleNavClick = (route: string) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090D14]/95 backdrop-blur-md border-b border-[#1A2333] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Distinctive Brand Lockup & Global Search */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => handleNavClick('/home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded border border-amber-500/40 bg-gradient-to-br from-[#1C160C] via-[#2A1E0E] to-[#120D06] flex items-center justify-center text-amber-400 shadow-sm group-hover:border-amber-400/70 transition-all">
              <Scale className="w-4 h-4 text-amber-400 group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-[0.1em] text-slate-100 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span>LEXJURIST</span>
              </div>
              <p className="text-[9px] font-display uppercase tracking-[0.18em] text-amber-500/70 leading-none">
                Chambers & Collegiate Roll
              </p>
            </div>
          </button>

          {/* Quick global search trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded bg-[#0E1420] border border-[#1E293B] text-xs text-slate-400 hover:text-slate-200 hover:border-amber-500/30 transition-all w-52 lg:w-64"
          >
            <Search className="w-3.5 h-3.5 text-amber-400/80" />
            <span className="truncate">Search counsel, precedent, citation...</span>
            <kbd className="hidden lg:inline ml-auto text-[10px] font-mono bg-[#182234] px-1.5 py-0.5 rounded text-slate-400 border border-[#27354E]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 2: Clean Typography Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route || currentRoute.startsWith(`${link.route}/`);
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`px-3 py-1.5 text-xs tracking-wide transition-all whitespace-nowrap relative rounded ${
                  isActive
                    ? 'text-amber-300 font-semibold bg-amber-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Executive Actions & Persona Credentials */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-[#0E1420] border border-[#232F42] hover:border-amber-500/40 text-slate-200 transition-colors"
              title="Switch demo persona for testing"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono-data text-[11px] text-amber-300">
                {isAdmin ? 'Registrar' : isOrg ? 'Law Firm' : 'Counsel'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0E131E] border border-[#26354D] rounded-lg shadow-2xl py-2 z-50">
                <div className="px-3.5 py-2 border-b border-[#1A2538] text-[10px] font-display uppercase tracking-widest text-amber-400/90 flex items-center justify-between">
                  <span>Switch Verified Persona</span>
                  <span className="font-mono text-slate-500 lowercase">live preview</span>
                </div>
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left flex items-start gap-3 hover:bg-[#162030] text-xs transition-colors ${
                        isCurrent ? 'bg-[#141C2A] border-l-2 border-amber-400' : ''
                      }`}
                    >
                      <UserAvatar name={u.fullName} size="sm" />
                      <div className="overflow-hidden min-w-0 flex-1">
                        <div className="font-semibold text-slate-200 truncate flex items-center justify-between">
                          <span>{u.fullName}</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {u.lawyerProfile?.title || u.organizationProfile?.name || u.email}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400/80 truncate mt-0.5">
                          {u.role === 'admin'
                            ? 'Bar Adjudications Officer'
                            : u.lawyerProfile?.firmOrOrganization || 'Legal Organization'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Messages icon */}
          <button
            onClick={() => handleNavClick('/messages')}
            className={`relative p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-[#131B2A] transition-colors ${
              currentRoute === '/messages' ? 'text-amber-400 bg-[#131B2A]' : ''
            }`}
            title="Confidential Communications"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Notifications icon with unread count */}
          <button
            onClick={() => handleNavClick('/notifications')}
            className={`relative p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-[#131B2A] transition-colors ${
              currentRoute === '/notifications' ? 'text-amber-400 bg-[#131B2A]' : ''
            }`}
            title="Notifications & Docket Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-sm" />
            )}
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded hover:bg-[#131B2A] transition-colors"
            >
              <UserAvatar
                name={currentUser.fullName}
                size="sm"
                verificationStatus={currentUser.lawyerProfile?.verificationStatus}
              />
              <span className="hidden md:inline text-xs font-medium text-slate-200 truncate max-w-[120px]">
                {currentUser.fullName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0E131E] border border-[#26354D] rounded-lg shadow-2xl py-1 z-50">
                <div className="px-4 py-3 border-b border-[#1A2538] bg-[#0A0E17]/60">
                  <p className="text-xs font-semibold text-slate-100 truncate font-display">{currentUser.fullName}</p>
                  <p className="text-[11px] text-amber-400/90 font-mono truncate mt-0.5">
                    {currentUser.lawyerProfile?.barAdmissions?.[0]?.licenseNumber || 'Active Member Roll'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <button
                  onClick={() => handleNavClick(`/profile/${currentUser.id}`)}
                  className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-[#162030] hover:text-slate-100 flex items-center gap-2.5 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Chambers Profile</span>
                </button>

                <button
                  onClick={() => handleNavClick('/saved')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-[#162030] hover:text-slate-100 flex items-center gap-2.5 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Saved Precedents & Dossiers</span>
                </button>

                <button
                  onClick={() => handleNavClick('/settings')}
                  className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-[#162030] hover:text-slate-100 flex items-center gap-2.5 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bar Credentials & Privacy</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className="w-full px-4 py-2 text-left text-xs text-amber-300 bg-amber-950/20 hover:bg-amber-950/50 flex items-center gap-2.5 border-t border-[#1A2538] transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bar Adjudication Console</span>
                  </button>
                )}

                <div className="border-t border-[#1A2538] my-1" />

                <button
                  onClick={() => handleNavClick('/login')}
                  className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-[#162030] flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out of Chambers</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-[#131B2A] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1A2333] bg-[#090D14] px-4 py-3 space-y-2">
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded bg-[#0E1420] border border-[#1E293B] text-xs text-slate-300"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Search counsel, precedents, jobs...</span>
          </button>

          <div className="pt-2 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                  currentRoute === link.route
                    ? 'bg-amber-950/40 text-amber-300 font-semibold border-l-2 border-amber-400'
                    : 'text-slate-300 hover:bg-[#131B2A]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
