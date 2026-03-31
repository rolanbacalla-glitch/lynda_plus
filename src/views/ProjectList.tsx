import React from 'react';
import { Link } from 'react-router-dom';
import { mockProjects, mockParticipants } from '../data/mockData';

const ProjectList: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-10 animate-fade-in">
      {/* Center Column */}
      <div className="flex-1 min-w-0">
        {/* Banner Section */}
        <div className="banner-gradient rounded-[32px] p-10 mb-10 text-white relative overflow-hidden shadow-xl shadow-brand-500/20">
          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight font-display flex items-center gap-3">
              Agentic Analysis <span className="material-symbols-rounded text-brand-200 text-3xl animate-pulse">auto_awesome</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed mb-8">
              Unlock the power of intelligence with our new AI-driven research pipeline.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-brand-600 px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                <span className="material-symbols-rounded text-brand-500">auto_awesome</span> Create with AI
              </button>
              <Link to="/dashboard/create" className="inline-flex items-center gap-2 bg-white/20 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">
                Join Now <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
          {/* Decorative Sparkles */}
          <div className="absolute top-1/2 right-20 -translate-y-1/2 opacity-10 material-symbols-rounded text-[240px] select-none pointer-events-none text-white/30">auto_awesome</div>
        </div>

        {/* Progress Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mockProjects.map((p, i) => {
            const icon = i % 3 === 0 ? 'assignment' : i % 3 === 1 ? 'group' : 'videocam';
            const color = i % 3 === 0 ? 'brand' : i % 3 === 1 ? 'emerald' : 'amber';
            return (
              <div key={p.id} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-brand-200 transition-colors cursor-pointer group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner bg-${color}-50 text-${color}-600`}>
                  <span className="material-symbols-rounded">{icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{p.status}</p>
                  <p className="text-sm font-bold text-slate-800">{p.name}</p>
                  <div className="mt-2 h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-${color}-500`} style={{ width: `${p.nps}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Sessions (Continue Watching style) */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">Recent Sessions</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-sm shadow-sm opacity-50 cursor-not-allowed">←</button>
              <button className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm shadow-md shadow-brand-500/20">→</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockParticipants.slice(0, 3).map((p, i) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-5 shadow-lg border border-slate-100">
                  <img 
                    src={`https://images.unsplash.com/photo-${[
                      '1573164713714-d95e436ab8d6',
                      '1551434678-e076c223a692',
                      '1581091226825-a6a2a5aee158'
                    ][i]}?auto=format&fit=crop&q=80&w=400`} 
                    alt="Session Thumbnail"
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
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{p.experience} Research with {p.name}</h3>
                <p className="text-xs text-slate-500">{p.role} • {p.joined}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Management Table */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Research</h2>
            <button className="text-xs font-bold text-brand-600 hover:underline">See all</button>
          </div>
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Study Name</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <span className="material-symbols-rounded">folder</span>
                        </div>
                        <span className="font-bold text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-3 py-1 bg-indigo-50 text-brand-600 border border-indigo-100 rounded-full text-[10px] font-bold uppercase">UI/UX Study</span>
                    </td>
                    <td className="table-cell">
                      <span className={`text-[11px] font-bold ${p.status === 'Live' ? 'text-emerald-600' : 'text-slate-400'}`}>{p.status}</span>
                    </td>
                    <td className="table-cell text-right">
                      <Link to={`/dashboard/projects/${p.id}/insights`} className="text-slate-400 hover:text-brand-600 transition-colors">
                        ↗️
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Statistics & Mentors */}
      <div className="w-full lg:w-[380px] space-y-10">
        {/* Statistics Card */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-900">Activity</h2>
            <button className="material-symbols-rounded text-slate-300 hover:text-slate-600 transition-colors">more_horiz</button>
          </div>
          
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * 74) / 100} className="text-brand-600" style={{ strokeLinecap: 'round' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden translate-y-1">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-0 right-0 w-10 h-10 bg-brand-600 text-white text-[10px] font-bold rounded-full border-4 border-white flex items-center justify-center translate-x-2 -translate-y-2">74%</div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
            Keep it up, Jason! <span className="material-symbols-rounded text-orange-400">local_fire_department</span>
          </h3>
          <p className="text-xs text-slate-400 mb-10 leading-relaxed font-medium">Your active studies have seen a 12% increase in sentiment positivity this week.</p>
          
          <div className="flex justify-between items-end gap-3 h-32">
            {[40, 60, 35, 80, 50, 65, 45].map((h, i) => (
              <div key={i} className="flex-1 group">
                <div className={`w-full rounded-t-lg transition-all duration-500 group-hover:bg-brand-600 ${i === 3 ? 'bg-brand-600' : 'bg-slate-100 opacity-80'}`} style={{ height: `${h}%` }} />
                <p className="text-[10px] font-bold text-slate-400 mt-3">{['1-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31'][i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Participant Activity (Mentor style) */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-900">Key Participants</h2>
            <button className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-600 transition-all">+</button>
          </div>
          <div className="space-y-6">
            {mockParticipants.map((p) => (
              <div key={p.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{p.role}</p>
                  </div>
                </div>
                <button className="px-5 py-2 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-slate-600 shadow-sm hover:border-brand-600 hover:text-brand-600 transition-all">FOLLOW</button>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 text-slate-500 rounded-[24px] font-bold text-sm hover:bg-slate-100 transition-all">See All</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
