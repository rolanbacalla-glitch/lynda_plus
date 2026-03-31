import React from 'react';

const AgenticReasoning: React.FC = () => {
  const reasoningSteps = [
    {
      step: 1,
      title: 'Multimodal Fusion',
      desc: 'Correlated 127 mouse-click clusters with verbal frustration timestamps in Checkout sessions.',
      status: 'complete',
      confidence: 94
    },
    {
      step: 2,
      title: 'Contextual Grounding',
      desc: 'Cross-referenced user errors with HIPAA address-validation constraints in the UK region.',
      status: 'complete',
      confidence: 89
    },
    {
      step: 3,
      title: 'Hypothesis Synthesis',
      desc: 'Identified that the "Search" field is being confused with "Manual Address Entry" due to visual proximity.',
      status: 'active',
      confidence: 92
    },
    {
      step: 4,
      title: 'Strategic Recommendation',
      desc: 'Isolate the manual entry secondary CTA. Relocate to Footer of current viewport.',
      status: 'pending',
      confidence: 0
    }
  ];

  return (
    <div className="card glass p-10 md:p-12 relative overflow-hidden bg-slate-900 text-white min-h-[500px]">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/10 blur-[100px] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <span className="material-symbols-rounded text-white">psychology_alt</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display tracking-tight leading-none mb-2">Agentic Reasoning Engine</h3>
            <div className="flex items-center gap-2">
              <span className="flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status: Live Inference (Gemini 1.5 Pro)</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {reasoningSteps.map((step, i) => (
            <div key={i} className={`flex gap-8 relative ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
              {i !== reasoningSteps.length - 1 && (
                <div className="absolute left-4 top-10 bottom-[-20px] w-0.5 bg-slate-800" />
              )}
              
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                step.status === 'complete' ? 'bg-brand-600 border-brand-600' : 
                step.status === 'active' ? 'bg-slate-900 border-brand-500 animate-pulse' : 
                'bg-slate-900 border-slate-700'
              }`}>
                {step.status === 'complete' ? '✓' : step.step}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold transition-colors duration-500 ${step.status === 'active' ? 'text-brand-400' : 'text-white'}`}>
                    {step.title}
                  </h4>
                  {step.confidence > 0 && (
                    <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-slate-400 tracking-wider font-mono">
                      CONF_LVL: {step.confidence}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 p-6 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/20 flex items-center justify-center">
                <span className="material-symbols-rounded text-brand-400">auto_awesome</span>
             </div>
             <p className="text-sm font-bold text-slate-300">Proceed with auto-generated Project Task?</p>
          </div>
          <button className="bg-white text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-500 hover:text-white transition-all">
            Accept & Scale
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgenticReasoning;
