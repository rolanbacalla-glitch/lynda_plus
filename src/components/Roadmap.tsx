import React from 'react';

const Roadmap: React.FC = () => {
  const steps = [
    { phase: 'Weeks 1-4', title: 'Foundation', desc: 'Core UI/IA & Participant Panel Integration' },
    { phase: 'Weeks 5-10', title: 'Intelligence', desc: 'Gemini 1.5 Pro Video & Synthesis Pipeline' },
    { phase: 'Weeks 11-16', title: 'Scale', desc: 'Multi-modal Analytics & Global Rollout' },
  ];

  return (
    <section id="roadmap" className="py-20 md:py-36 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 animate-fade-in">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6">
            The 16-Week <span className="text-gradient">Roadmap</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A phased transformation to the future of research.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, i) => (
            <div key={i} className="group glass p-8 md:p-14 rounded-[32px] md:rounded-[40px] text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-premium border border-indigo-50/50">
              <div className="inline-block px-5 py-2 rounded-full bg-slate-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-lg group-hover:bg-brand-600 transition-colors">
                {step.phase}
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-6 tracking-tight group-hover:text-brand-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-[15px] md:text-[17px] text-slate-500 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
