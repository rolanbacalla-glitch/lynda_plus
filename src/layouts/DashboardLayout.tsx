import { Outlet, NavLink, Link } from 'react-router-dom';
import { mockTeamMembers } from '../data/mockData';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform">
              <span className="font-bold text-lg">L+</span>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Lynda<span className="text-brand-500">Plus</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="mb-8">
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Overview</p>
            <nav className="space-y-1">
              <SidebarLink to="/dashboard" icon="grid_view" label="Dashboard" end />
              <SidebarLink to="/dashboard/inbox" icon="mail" label="Inbox" />
              <SidebarLink to="/dashboard/panel" icon="group" label="Participants" />
              <SidebarLink to="/dashboard/sessions" icon="videocam" label="Sessions" />
              <SidebarLink to="/dashboard/tasks" icon="assignment" label="Tasks" />
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Team Members</p>
            <div className="space-y-4 px-4">
              {mockTeamMembers.map((member) => (
                <TeamMember key={member.id} name={member.name} status={member.role} avatar={member.avatar} />
              ))}
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Settings</p>
            <nav className="space-y-1">
              <SidebarLink to="/dashboard/settings" icon="settings" label="Setting" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-semibold text-sm hover:bg-rose-50 hover:text-rose-600 transition-all group">
                <span className="material-symbols-rounded text-rose-400 group-hover:text-rose-600 transition-colors">logout</span> Logout
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[100px] flex items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-50">
          <div className="flex-1 max-w-2xl relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-600">search</span>
            <input
              type="text"
              placeholder="Search studies, participants, or insights..."
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-500/10 placeholder-slate-400 text-sm font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                <span className="material-symbols-rounded text-slate-500">mail</span>
              </button>
              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm hover:shadow-md transition-all relative">
                <span className="material-symbols-rounded text-slate-500">notifications</span>
                <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
              </button>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">Jason Ranti</p>
                <p className="text-[11px] text-brand-600 font-bold uppercase tracking-wider">Project Lead</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 border-2 border-white shadow-premium overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" alt="User Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
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
        <span className={`material-symbols-rounded ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'} transition-colors`}>
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
      <p className="text-[10px] text-slate-400 font-medium">{status}</p>
    </div>
  </div>
);

export default DashboardLayout;
