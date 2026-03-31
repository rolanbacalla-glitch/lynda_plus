import React, { useState } from 'react';

interface Criteria {
  role: string;
  skills: string;
  experience: string;
  location: string;
}

const RecruitmentEngine: React.FC = () => {
  const [criteria, setCriteria] = useState<Criteria>({
    role: 'Senior Product Designer',
    skills: 'Figma, React, SaaS',
    experience: '5+ Years',
    location: 'Remote / Global'
  });

  const [isMatching, setIsMatching] = useState(false);

  const startMatching = () => {
    setIsMatching(true);
    setTimeout(() => setIsMatching(false), 2500);
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium p-10 space-y-10 relative overflow-hidden group">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-50/20 rounded-full -mr-[250px] -mt-[250px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="flex items-start justify-between relative">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-brand-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">Agentic Mode</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Recruitment Targeting</h2>
          <p className="text-slate-500 max-w-sm font-medium">Define your target persona and let the agentic recruiter source the perfect matches.</p>
        </div>
        <div className="w-16 h-16 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
          <span className="material-symbols-rounded text-brand-600 text-3xl">psychology</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className="space-y-6">
          {/* Inputs */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1">Primary Role</label>
            <input
              type="text"
              value={criteria.role}
              onChange={(e) => setCriteria({ ...criteria, role: e.target.value })}
              className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 text-sm font-bold text-slate-800 transition-all shadow-sm"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1">Key Skills & Stack</label>
            <input
              type="text"
              value={criteria.skills}
              onChange={(e) => setCriteria({ ...criteria, skills: e.target.value })}
              className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 text-sm font-bold text-slate-800 transition-all shadow-sm"
              placeholder="e.g. React, Node, AI"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1">Experience</label>
              <select 
                title="Select Experience Level"
                aria-label="Experience Level"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 text-sm font-bold text-slate-800 transition-all shadow-sm"
              >
                <option>Intern / Junior</option>
                <option>Mid-Level</option>
                <option selected>Senior / Lead</option>
                <option>Executive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1">Region</label>
              <select 
                title="Select Target Region"
                aria-label="Target Region"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 text-sm font-bold text-slate-800 transition-all shadow-sm"
              >
                <option>North America</option>
                <option>Europe</option>
                <option selected>Remote Global</option>
                <option>APAC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-6 relative group/card overflow-hidden shadow-2xl">
          {/* Matching Animation State */}
          {isMatching ? (
            <div className="space-y-6 animate-pulse">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-indigo-400/30">
                <span className="material-symbols-rounded text-white text-4xl animate-spin">sync</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Analysing Global Panel...</h4>
                <p className="text-indigo-200/60 text-xs font-medium uppercase tracking-widest">Sourcing candidates from 12k+ nodes</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex -space-x-4 mb-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-xl transform group-hover/card:scale-110 transition-transform">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                      alt={`Potential Participant ${i}`}
                      title={`Potential Participant Match ${i}`}
                      className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-xl">
                  +12
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-white">44 Potential<br />Matches Found</h4>
                <p className="text-slate-200 text-sm font-medium">Estimated 94% fit based on AI resonance scores.</p>
              </div>
              <button
                onClick={startMatching}
                className="bg-brand-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20 w-full"
              >
                Match Participants
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentEngine;
