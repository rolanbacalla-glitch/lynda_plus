import React from 'react';
import { Link } from 'react-router-dom';
import { mockProjects, mockParticipants } from '../data/mockData';

const ProjectList: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 animate-fade-in px-2 sm:px-0">
      {/* Center Column */}
      <div className="flex-1 min-w-0">
        {/* Banner Section */}
        <div className="banner-gradient rounded-[32px] p-6 sm:p-10 mb-8 sm:mb-10 text-white relative overflow-hidden shadow-xl shadow-brand-500/20">
          <div className="relative z-10 max-w-md">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight font-display flex items-center gap-3">
              Research Pulse <span className="material-symbols-rounded text-brand-200 text-2xl sm:text-3xl animate-pulse">insights</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-6 sm:mb-8">
              AI Summary: Your studies have seen a **12% increase** in sentiment positivity this week. **3 new friction points** were identified in 'Mobile Onboarding'.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-brand-600 px-6 sm:px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all">
                <span className="material-symbols-rounded text-brand-500">auto_awesome</span> Create Study
              </button>
              <Link to="/dashboard/create" className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 sm:px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform no-underline backdrop-blur-md">
                View All Insights <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
          {/* Decorative Sparkles */}
          <div className="absolute top-1/2 right-4 sm:right-20 -translate-y-1/2 opacity-10 material-symbols-rounded text-[120px] sm:text-[240px] select-none pointer-events-none text-white/30">auto_awesome</div>
        </div>

        {/* Progress Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10 sm:mb-12">
          {mockProjects.map((p, i) => {
            const icon = i % 3 === 0 ? 'assignment' : i % 3 === 1 ? 'group' : 'videocam';
            const color = i % 3 === 0 ? 'brand' : i % 3 === 1 ? 'emerald' : 'amber';
            return (
              <div key={p.id} className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-brand-200 transition-colors cursor-pointer group">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner bg-${color}-50 text-${color}-600`}>
                  <span className="material-symbols-rounded">{icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{p.status}</p>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{p.name}</p>
                      <div className="mt-2 h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-brand-500 transition-all duration-500" 
                          style={{ width: `${p.nps}%` }} 
                        />
                      </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Sessions (Continue Watching style) */}
        <div className="mb-10 sm:mb-12">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Sessions</h2>
            <div className="flex gap-2">
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-sm shadow-sm opacity-50 cursor-not-allowed">←</button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm shadow-md shadow-brand-500/20">→</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {mockParticipants.slice(0, 3).map((p, i) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-4 sm:mb-5 shadow-lg border border-slate-100">
                    <img 
                      src={`https://images.unsplash.com/photo-${[
                        '1573164713714-d95e436ab8d6',
                        '1551434678-e076c223a692',
                        '1581091226825-a6a2a5aee158'
                      ][i]}?auto=format&fit=crop&q=80&w=400`} 
                      alt={`Session recording for participant ${mockParticipants[i]?.name || 'User'}`}
                      title="View Session Highlights"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">Live</span>
                  </div>
                  <button className="absolute inset-0 m-auto w-12 h-12 bg-white/90 rounded-full shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                    <span className="material-symbols-rounded text-brand-600">play_arrow</span>
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{p.experience} Research with {p.name}</h3>
                <p className="text-xs text-slate-500">{p.role} • {p.joined}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Management Table */}
        <div className="mb-10 sm:mb-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your Research</h2>
            <button className="text-xs font-bold text-brand-600 hover:underline">See all</button>
          </div>
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr>
                    <th className="table-header py-5 px-6">Study Name</th>
                    <th className="table-header py-5 px-4 text-center">Type</th>
                    <th className="table-header py-5 px-4 text-center">Status</th>
                    <th className="table-header py-5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="table-cell py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                            <span className="material-symbols-rounded">folder</span>
                          </div>
                          <span className="font-bold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="table-cell py-5 px-4 text-center">
                        <span className="px-3 py-1 bg-indigo-50 text-brand-600 border border-indigo-100 rounded-full text-[10px] font-bold uppercase transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600">UI/UX Study</span>
                      </td>
                      <td className="table-cell py-5 px-4 text-center">
                        <span className={`text-[11px] font-bold ${p.status === 'Live' ? 'text-emerald-500' : 'text-slate-400'}`}>{p.status}</span>
                      </td>
                      <td className="table-cell py-5 px-6 text-right pt-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/dashboard/projects/${p.id}/session`} className="text-[10px] font-black text-brand-600 px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-600 hover:text-white transition-all uppercase tracking-widest no-underline">
                            Live
                          </Link>
                          <Link to={`/dashboard/projects/${p.id}/insights`} className="w-8 h-8 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center">
                            <span className="material-symbols-rounded text-sm">analytics</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Statistics & Mentors */}
      <div className="w-full lg:w-[340px] xl:w-[380px] space-y-8 sm:space-y-10">
        {/* Statistics Card */}
        <div className="bg-white p-6 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-900">Activity</h2>
            <button className="material-symbols-rounded text-slate-300 hover:text-slate-600 transition-colors">more_horiz</button>
          </div>
          
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="50%" cy="50%" r="45%" 
                  stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray="283%" 
                  className="text-brand-600 transition-all duration-1000" 
                  style={{ 
                    strokeDashoffset: `calc(283% - (283% * 74) / 100)`
                  }} 
                  strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 text-white text-[10px] font-bold rounded-full border-4 border-white flex items-center justify-center translate-x-2 -translate-y-2">74%</div>
            </div>
          </div>
          
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
            Keep it up, Jason! <span className="material-symbols-rounded text-orange-400">local_fire_department</span>
          </h3>
          <p className="text-xs text-slate-600 mb-8 sm:mb-10 leading-relaxed font-medium px-4">Your active studies have seen a 12% increase in sentiment positivity this week.</p>
          
          <div className="flex justify-between items-end gap-2 sm:gap-3 h-28 sm:h-32">
            {[40, 60, 35, 80, 50, 65, 45].map((h, i) => (
              <div key={i} className="flex-1 group">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 group-hover:bg-brand-600 ${i === 3 ? 'bg-brand-600' : 'bg-slate-100 opacity-80'}`} 
                  style={{ height: `${h}%` }} 
                />
                <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 mt-3">{['1-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31'][i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Participant Activity (Mentor style) */}
        <div>
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg font-bold text-slate-900 px-2 sm:px-0">Key Participants</h2>
            <button className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-600 transition-all">+</button>
          </div>
          <div className="space-y-5 sm:space-y-6 px-2 sm:px-0">
            {mockParticipants.map((p) => (
              <div key={p.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 tracking-tight">{p.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">{p.role}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-slate-600 shadow-sm hover:border-brand-600 hover:text-brand-600 transition-all active:scale-95">FOLLOW</button>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 sm:mt-10 py-3.5 sm:py-4 bg-slate-50 text-slate-500 rounded-[20px] sm:rounded-[24px] font-bold text-sm hover:bg-slate-100 transition-all active:scale-95">See All</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
