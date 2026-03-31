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
    <section className="py-24 md:py-36 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-10 animate-fade-in text-center">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6">
            Legacy Workflow vs. <span className="text-gradient">Agentic Future</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Traditional platforms give you data. LyndaPlus gives you the answer.
          </p>
        </div>
        
        <div className="glass rounded-[40px] overflow-hidden shadow-premium border border-white/50 relative">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/5 backdrop-blur-sm">
                <th className="px-8 md:px-12 py-8 text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] border-b border-indigo-50/50">Capability</th>
                <th className="px-8 md:px-12 py-8 text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] border-b border-indigo-50/50">Legacy Platforms</th>
                <th className="px-8 md:px-12 py-8 text-[11px] font-bold text-brand-600 uppercase tracking-[0.2em] border-b border-brand-100/50">LyndaPlus</th>
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
      </div>
    </section>
  );
};

export default Comparison;
