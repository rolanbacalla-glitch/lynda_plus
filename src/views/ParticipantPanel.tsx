import React from 'react';
import { mockParticipants } from '../data/mockData';

const ParticipantPanel: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex justify-between items-end border-b border-indigo-50 pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight font-display text-slate-900">Recruit Panel</h1>
          <p className="text-slate-500 max-w-md">Manage and target your pool of verified research participants with agentic precision.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl font-semibold border border-indigo-100/50 shadow-premium hover:border-brand-600 transition-all group">
            <span className="material-symbols-rounded text-slate-400 group-hover:text-brand-600 transition-colors">download</span> Import CSV
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockParticipants.map((participant) => (
          <div key={participant.id} className="bg-white/60 backdrop-blur-sm rounded-3xl border border-indigo-50/50 p-6 shadow-premium hover:shadow-xl hover:scale-[1.02] hover:bg-white transition-all duration-300 group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-indigo-50 overflow-hidden shadow-sm group-hover:rotate-3 transition-transform">
                <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-slate-900 text-lg mb-0.5 truncate">{participant.name}</h3>
                <p className="text-xs font-medium text-slate-500 truncate mb-3">
                  {participant.role} • {participant.experience}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    Age {participant.age}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State / Add Card */}
        <button className="rounded-3xl border-2 border-dashed border-indigo-100 hover:border-brand-600 hover:bg-brand-50/20 transition-all duration-500 group min-h-[140px] flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
              <span className="material-symbols-rounded text-slate-400 group-hover:text-brand-600">add</span>
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors">Recruit More</p>
              <p className="text-xs text-slate-500 font-medium">Targeted participant sourcing</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ParticipantPanel;
