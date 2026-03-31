import React from 'react';

interface ParticipantCardProps {
  participant: {
    id: string;
    name: string;
    role: string;
    experience: string;
    age: number;
    avatar: string;
    status: string;
    reliability: number;
    tags: string[];
  };
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[32px] border border-indigo-50/50 p-6 shadow-premium hover:shadow-2xl hover:scale-[1.02] hover:bg-white transition-all duration-500 group relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="flex items-start justify-between mb-6 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-indigo-50 overflow-hidden shadow-sm group-hover:rotate-3 transition-transform duration-500">
              <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
            </div>
            {participant.status === 'Active' && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-slate-900 text-lg mb-0.5 truncate">{participant.name}</h3>
            <p className="text-xs font-semibold text-brand-600 truncate uppercase tracking-wider">
              {participant.role}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Reliability</div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-sm font-bold text-slate-900">{participant.reliability}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="flex flex-wrap gap-2">
          {participant.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white border border-indigo-50 text-slate-600 rounded-xl text-[10px] font-bold shadow-sm group-hover:border-brand-100 transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-slate-600 text-lg">calendar_today</span>
            <span className="text-xs font-bold text-slate-500">{participant.experience}</span>
          </div>
          <button className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4 decoration-brand-200">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;
