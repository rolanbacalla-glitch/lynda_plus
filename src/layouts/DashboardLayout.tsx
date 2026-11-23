import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  PlusCircle,
  Video,
  Users,
  HardDrive,
  Plug,
  CheckSquare,
  Settings,
  LogOut,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Clock,
  ChevronRight,
  Cloud,
} from 'lucide-react';
import BuyCreditsModal from '../components/BuyCreditsModal';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useResearch } from '../contexts/ResearchContext';
import { ASSETS } from '../data/mockData';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Overview',
  '/dashboard/create': 'Study Composer',
  '/dashboard/preview': 'Participant Preview',
  '/dashboard/sessions': 'Sessions',
  '/dashboard/panel': 'Customer Panel',
  '/dashboard/drive': 'Google Drive Vault',
  '/dashboard/integrations': 'Integrations & Handoff',
  '/dashboard/recruitment': 'External Recruiting',
  '/dashboard/tasks': 'Action Items',
  '/dashboard/inbox': 'Messages',
  '/dashboard/settings/team': 'Team & Governance',
};

const DashboardLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const { logout, currentUser, isDemoMode, signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { credits, addCredits, projects, participants, tasks, isCloudSynced } = useResearch();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobileNav = () => setIsSidebarOpen(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const openTasksCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);

  const currentSectionTitle = useMemo(() => {
    if (ROUTE_TITLES[location.pathname]) return ROUTE_TITLES[location.pathname];
    if (location.pathname.includes('/insights')) return 'Study Insights';
    if (location.pathname.includes('/session')) return 'Live Session';
    if (location.pathname.includes('/record')) return 'Recording Booth';
    return 'Workspace';
  }, [location.pathname]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const studyHits = projects
      .filter((p) => p.name.toLowerCase().includes(q) || p.method.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({
        id: `study-${p.id}`,
        label: p.name,
        meta: `Study · ${p.status}`,
        to: `/dashboard/projects/${p.id}/insights`,
      }));
    const participantHits = participants
      .filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
      .slice(0, 2)
      .map((p) => ({
        id: `part-${p.id}`,
        label: p.name,
        meta: `Panellist · ${p.role}`,
        to: '/dashboard/panel',
      }));
    const taskHits = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 2)
      .map((t) => ({
        id: `task-${t.id}`,
        label: t.title,
        meta: `Action · ${t.priority}`,
        to: '/dashboard/tasks',
      }));
    return [...studyHits, ...participantHits, ...taskHits];
  }, [searchQuery, projects, participants, tasks]);

  const handlePurchase = (amount: number) => {
    addCredits(amount);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleUpgradeToGoogleSync = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // Popup closed by user
    }
  };

  const displayName =
    currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Elena Rodriguez';
  const avatarSrc = currentUser?.photoURL || ASSETS.avatarElena;

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b border-[var(--sys-outline-variant)]">
        <Link
          to="/"
          className="text-base font-bold tracking-tight text-[var(--sys-on-surface)] no-underline whitespace-nowrap"
        >
          LyndaPlus
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden w-9 h-9 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)]"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Research
          </p>
          <nav aria-label="Workspace navigation" className="space-y-0.5">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutGrid className="w-4 h-4" />}
              label="Overview"
              onNavigate={closeMobileNav}
              end
            />
            <SidebarItem
              to="/dashboard/create"
              icon={<PlusCircle className="w-4 h-4" />}
              label="Study Composer"
              onNavigate={closeMobileNav}
            />
            <SidebarItem
              to="/dashboard/sessions"
              icon={<Video className="w-4 h-4" />}
              label="Sessions"
              onNavigate={closeMobileNav}
            />
            <SidebarItem
              to="/dashboard/panel"
              icon={<Users className="w-4 h-4" />}
              label="Customer Panel"
              onNavigate={closeMobileNav}
            />
          </nav>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Vault & Handoff
          </p>
          <nav aria-label="Vault and handoff navigation" className="space-y-0.5">
            <SidebarItem
              to="/dashboard/drive"
              icon={<HardDrive className="w-4 h-4" />}
              label="Google Drive Vault"
              onNavigate={closeMobileNav}
            />
            <SidebarItem
              to="/dashboard/integrations"
              icon={<Plug className="w-4 h-4" />}
              label="Integrations"
              onNavigate={closeMobileNav}
            />
            <SidebarItem
              to="/dashboard/tasks"
              icon={<CheckSquare className="w-4 h-4" />}
              label="Action Items"
              count={openTasksCount}
              onNavigate={closeMobileNav}
            />
            <SidebarItem
              to="/dashboard/settings/team"
              icon={<Settings className="w-4 h-4" />}
              label="Team & Governance"
              onNavigate={closeMobileNav}
            />
          </nav>
        </div>
      </div>

      {/* Bottom Workspace Storage, Synthesis Hours & Account */}
      <div className="p-3 border-t border-[var(--sys-outline-variant)] space-y-2">
        {isDemoMode && (
          <button
            type="button"
            onClick={() => void handleUpgradeToGoogleSync()}
            className="w-full p-2.5 rounded-[var(--sys-radius-md)] bg-[var(--sys-primary-container)] text-[var(--sys-on-primary-container)] text-left text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer hover:opacity-95 transition-opacity"
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <Cloud className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Connect Google & Cloud Sync</span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full p-3 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] hover:bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--sys-on-surface-secondary)]">
              <Clock className="w-3.5 h-3.5 text-[var(--sys-primary)]" />
              Synthesis Hours
            </span>
            <span className="font-mono font-semibold text-[var(--sys-on-surface)] tabular-nums">
              {credits.toFixed(1)}h
            </span>
          </div>
          <p className="text-[11px] text-[var(--sys-primary)] font-medium mt-1">
            Add hours →
          </p>
        </button>

        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={avatarSrc}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-[var(--sys-radius-sm)] object-cover border border-[var(--sys-outline-variant)] shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--sys-on-surface)] truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-[var(--sys-on-surface-tertiary)] truncate">
                {isCloudSynced ? 'Firestore UK/EU Synced' : 'Local Demo Preview'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="w-8 h-8 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-tertiary)] hover:text-[var(--sys-on-surface)] hover:bg-[var(--sys-surface-container)] transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--sys-surface-canvas)] text-[var(--sys-on-surface)]">
      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative z-10 w-[260px] max-w-[85vw] bg-[var(--sys-surface-lowest)] border-r border-[var(--sys-outline-variant)] h-full">
              {navContent}
            </aside>
          </div>,
          document.body
        )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-0 h-screen bg-[var(--sys-surface-lowest)] border-r border-[var(--sys-outline-variant)]">
        {navContent}
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-16 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 bg-[var(--sys-surface-canvas)]/90 backdrop-blur-md border-b border-[var(--sys-outline-variant)]">
          {/* Left: Mobile trigger + Breadcrumb trail */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface)] hover:bg-[var(--sys-surface-container)] cursor-pointer shrink-0"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
              <Link
                to="/dashboard"
                className="text-[var(--sys-on-surface-tertiary)] hover:text-[var(--sys-on-surface)] no-underline whitespace-nowrap shrink-0"
              >
                Workspace
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--sys-on-surface-quaternary)] shrink-0" />
              <span className="font-semibold text-[var(--sys-on-surface)] truncate">
                {currentSectionTitle}
              </span>
            </nav>
          </div>

          {/* Right: Live Search + Theme Toggle + Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative hidden md:block w-64 lg:w-72">
              <Search className="w-4 h-4 text-[var(--sys-on-surface-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Search studies, panellists..."
                aria-label="Search workspace"
                className="w-full h-10 pl-9 pr-3 text-xs sys-input"
              />

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 mt-2 w-80 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] shadow-lg overflow-hidden z-40">
                  {searchResults.length > 0 ? (
                    <ul className="divide-y divide-[var(--sys-outline-variant)]">
                      {searchResults.map((hit) => (
                        <li key={hit.id}>
                          <button
                            type="button"
                            onMouseDown={() => {
                              setSearchQuery('');
                              navigate(hit.to);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-[var(--sys-surface-low)] transition-colors cursor-pointer"
                          >
                            <p className="text-xs font-semibold text-[var(--sys-on-surface)] truncate">
                              {hit.label}
                            </p>
                            <p className="text-[11px] text-[var(--sys-on-surface-tertiary)]">
                              {hit.meta}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-xs text-[var(--sys-on-surface-tertiary)]">
                      No matching studies, panellists, or actions.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="w-10 h-10 rounded-[var(--sys-radius-sm)] sys-btn-secondary flex items-center justify-center cursor-pointer shrink-0"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <Link
              to="/dashboard/create"
              className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap shrink-0 no-underline"
            >
              New Study
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1280px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <BuyCreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  count?: number;
  onNavigate?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, end, count, onNavigate }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className={({ isActive }) =>
      `flex items-center justify-between gap-2.5 px-3 min-h-[40px] rounded-[var(--sys-radius-sm)] text-sm font-medium transition-colors no-underline ${
        isActive
          ? 'bg-[var(--sys-primary-container)] text-[var(--sys-on-primary-container)] font-semibold'
          : 'text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-low)] hover:text-[var(--sys-on-surface)]'
      }`
    }
  >
    <span className="flex items-center gap-2.5 min-w-0 truncate">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
    {typeof count === 'number' && count > 0 && (
      <span className="text-xs font-mono tabular-nums opacity-80 shrink-0">{count}</span>
    )}
  </NavLink>
);

export default DashboardLayout;
