import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { mockTeamMembers } from '../data/mockData';
import BuyCreditsModal from '../components/BuyCreditsModal';
import AgenticAssistant from '../components/AgenticAssistant';
import { useAuth } from '../hooks/useAuth';


const DashboardLayout: React.FC = () => {
  const [credits, setCredits] = useState(2.4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on navigation (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handlePurchase = (amount: number) => {
    setCredits(prev => prev + amount);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans antialiased">
      {/* Mobile Sidebar Overlay/Backdrop */}
      {isSidebarOpen && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1999] xl:hidden pointer-events-auto transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />,
        document.body
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[2000] w-[280px] bg-white border-r border-slate-100 flex flex-col 
        transition-transform duration-300 ease-in-out
        xl:sticky xl:top-0 xl:h-screen xl:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform">
              <span className="font-bold text-lg">L+</span>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight pr-1">Lynda<span className="text-brand-500">Plus</span></span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="xl:hidden w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 scrollbar-hide">
          <div className="mb-8">
            <p className="px-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-4">Overview</p>
            <nav className="space-y-1">
              <SidebarLink to="/dashboard" icon="grid_view" label="Dashboard" end />
              <SidebarLink to="/dashboard/inbox" icon="mail" label="Inbox" />
              <SidebarLink to="/dashboard/panel" icon="group" label="Participants" />
              <SidebarLink to="/dashboard/recruitment" icon="campaign" label="Recruitment" />
              <SidebarLink to="/dashboard/sessions" icon="videocam" label="Sessions" />
              <SidebarLink to="/dashboard/tasks" icon="assignment" label="Tasks" />
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-4">Team Members</p>
            <div className="space-y-4 px-4">
              {mockTeamMembers.map((member) => (
                <TeamMember key={member.id} name={member.name} status={member.role} avatar={member.avatar} />
              ))}
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-4">Settings</p>
            <nav className="space-y-1">
              <SidebarLink to="/dashboard/settings/team" icon="settings" label="Team Settings" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-semibold text-sm hover:bg-rose-50 hover:text-rose-600 transition-all group"
              >
                <span className="material-symbols-rounded text-rose-400 group-hover:text-rose-600 transition-colors">logout</span> Logout
              </button>
            </nav>
          </div>

          <div className="mt-8">
            <AgenticAssistant />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-[72px] xl:h-[100px] flex items-center justify-between px-4 sm:px-6 xl:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="xl:hidden w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-rounded">menu</span>
            </button>
            <div className="flex-1 relative hidden sm:block">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Search research..."
                className="w-full h-12 xl:h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-500/10 placeholder-slate-400 text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* AI Credits Indicator */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl border transition-all active:scale-95 group shadow-sm ${credits < 5
                ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                : 'bg-brand-50 border-brand-100 text-brand-600 hover:bg-brand-100'
                }`}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shadow-inner ${credits < 5 ? 'bg-rose-500 text-white' : 'bg-brand-600 text-white'
                }`}>
                <span className="material-symbols-rounded text-xs sm:text-sm animate-pulse">psychology</span>
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-80 leading-none mb-0.5 sm:mb-1">AI Credits</p>
                <p className="text-xs sm:text-sm font-bold leading-none tracking-tight">{credits.toFixed(1)} hrs</p>
              </div>
              <div className={`hidden sm:flex ml-1 sm:ml-2 w-6 h-6 rounded-lg items-center justify-center transition-all ${
                credits < 5 
                ? 'text-rose-600 bg-rose-100/50 group-hover:bg-rose-500 group-hover:text-white' 
                : 'bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white'
              }`}>
                <span className="material-symbols-rounded text-xs">add</span>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden sm:flex w-10 h-10 xl:w-12 xl:h-12 rounded-2xl bg-white border border-slate-100 items-center justify-center shadow-sm hover:shadow-md transition-all">
                <span className="material-symbols-rounded text-slate-500 text-lg">notifications</span>
              </button>
              <div className="flex items-center gap-3 xl:pl-6 xl:border-l xl:border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {currentUser?.displayName || (currentUser?.email?.split('@')[0]) || 'User'}
                  </p>
                  <p className="text-[11px] text-brand-600 font-bold uppercase tracking-wider">Project Lead</p>
                </div>
                <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-2xl bg-indigo-100 border-2 border-white shadow-premium overflow-hidden">
                  <img src={currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"} alt="User Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 xl:p-12 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
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

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group
      ${isActive
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
        : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50'}
    `}
  >
    {({ isActive }) => (
      <>
        <span className={`material-symbols-rounded ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-brand-600'} transition-colors`}>
          {icon}
        </span>
        {label}
      </>
    )}
  </NavLink>
);

const TeamMember: React.FC<{ name: string; status: string; avatar: string }> = ({ name, status, avatar }) => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">{name}</p>
      <p className="text-[10px] text-slate-700 font-medium">{status}</p>
    </div>
  </div>
);

export default DashboardLayout;
