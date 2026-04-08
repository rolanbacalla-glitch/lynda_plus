import React from 'react';

const Comparison: React.FC = () => {
  const comparisons = [
    { feature: 'Search Strategy', legacy: 'Keyword & Manual Tags', lynda: 'Agentic Semantic Mapping' },
    { feature: 'Bias Detection', legacy: 'Delayed (Post-Study)', lynda: 'Active (Real-time Co-pilot)' },
    { feature: 'Insight Speed', legacy: 'Days (Manual Synthesis)', lynda: 'Minutes (Agentic Reasoning)' },
    { feature: 'Transcription', legacy: 'Passive Text Output', lynda: 'Actionable Highlight Reels' },
    { feature: 'Follow-ups', legacy: 'Static Scripts', lynda: 'Dynamic Agentic Prompting' },
  ];

  return (
    <section className="py-20 md:py-36 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10 animate-fade-in text-center">
        <div className="mb-14 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Legacy Workflow vs. <span className="text-gradient">Agentic Future</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            Traditional platforms give you data. LyndaPlus gives you the answer.
          </p>
        </div>
        
        {/* Desktop Table: Hidden on Mobile */}
        <div className="hidden md:block glass rounded-[40px] overflow-hidden shadow-premium border border-white/50 relative">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/5 backdrop-blur-sm">
                <th className="px-8 md:px-12 py-8 text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] border-b border-indigo-50/50">Capability</th>
                <th className="px-8 md:px-12 py-8 text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] border-b border-indigo-50/50">Legacy Platforms</th>
                <th className="px-8 md:px-12 py-8 text-[11px] font-bold text-brand-600 uppercase tracking-[0.2em] border-b border-brand-100/50 pr-0.5">LyndaPlus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/50">
              {comparisons.map((item, i) => (
                <tr key={i} className="hover:bg-brand-50/30 transition-colors group">
                  <td className="px-8 md:px-12 py-8 text-lg font-bold text-slate-900 tracking-tight">{item.feature}</td>
                  <td className="px-8 md:px-12 py-8 text-[15px] font-medium text-slate-600">{item.legacy}</td>
                  <td className="px-8 md:px-12 py-8 text-[15px] font-bold text-slate-800 underline decoration-2 decoration-brand-200 underline-offset-8 group-hover:decoration-brand-500 transition-all">{item.lynda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards (Hidden on Desktop) */}
        <div className="md:hidden space-y-6">
          {comparisons.map((item, i) => (
            <div key={i} className="glass p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black">0{i+1}</span>
                {item.feature}
              </h3>
              
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Legacy Workflow</span>
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{item.legacy}</p>
                </div>
                
                <div className="p-5 rounded-2xl bg-brand-50 border border-brand-100">
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mb-2 pr-0.5">LyndaPlus Agentic</span>
                  <p className="text-[14px] text-brand-900 font-bold leading-relaxed">{item.lynda}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Comparison;
