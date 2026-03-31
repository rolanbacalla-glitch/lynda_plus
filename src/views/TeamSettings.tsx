import React, { useState } from 'react';
import { mockTeamMembers } from '../data/mockData';

const TeamSettings: React.FC = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const roles = [
    { name: 'Admin', desc: 'Full access to workspace settings and billing.' },
    { name: 'Editor', desc: 'Can create and edit studies, view all insights.' },
    { name: 'Viewer', desc: 'Can only view studies and shared reports.' },
  ];

  return (
    <div className="view-container animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="view-title">Workspace Settings</h1>
          <p className="view-subtitle">Manage your research team and global permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="bg-brand-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
        >
          <span className="material-symbols-rounded">person_add</span> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Team Roster */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card glass">
            <h3 className="section-title mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-600 flex items-center justify-center">
                <span className="material-symbols-rounded">group</span>
              </span>
              Active Research Team
            </h3>
            
            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="p-6 rounded-[32px] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'editing' ? 'bg-brand-500' : 'bg-slate-300'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{member.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${member.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {member.role}
                      </span>
                      {member.status === 'editing' && (
                        <p className="text-[10px] font-bold text-brand-500 mt-1 animate-pulse">Editing Studies</p>
                      )}
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:border-slate-300 transition-all">
                      <span className="material-symbols-rounded">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roles & Info Sidebar */}
        <div className="space-y-8">
          <div className="card glass bg-slate-900 text-white">
            <h3 className="text-lg font-bold mb-6 font-display">Role Definitions</h3>
            <div className="space-y-6">
              {roles.map((role) => (
                <div key={role.name} className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-brand-400">{role.name}</p>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{role.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10 italic text-xs text-slate-400">
              "Research teams with balanced roles report 32% faster insight synthesis."
            </div>
          </div>

          <div className="card glass overflow-hidden relative">
            <h3 className="text-lg font-bold mb-2 text-slate-900">Security Audit</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">Last verified: 14 mins ago</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                <span className="material-symbols-rounded text-lg">verified_user</span>
                SSO: Enforced
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">
                <span className="material-symbols-rounded text-lg">history</span>
                Audit Logging: Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal Overlay */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsInviteOpen(false)} />
          <div className="bg-white rounded-[48px] p-12 w-full max-w-xl relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors" onClick={() => setIsInviteOpen(false)}>
              <span className="material-symbols-rounded text-3xl">close</span>
            </button>
            
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-rounded text-4xl">mail</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 font-display">Expand the Team</h2>
              <p className="text-slate-500 font-medium mt-2">Send an encrypted invitation to your colleagues.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Colleague Email</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-600 focus:bg-white rounded-[24px] p-5 outline-none transition-all font-medium text-slate-900" 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {['Viewer', 'Editor', 'Admin'].map(r => (
                   <button key={r} className="p-4 rounded-2xl border-2 border-slate-100 hover:border-brand-600 hover:bg-brand-50 text-xs font-bold text-slate-600 transition-all">
                     {r}
                   </button>
                ))}
              </div>
              
              <button className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSettings;
