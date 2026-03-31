import React from 'react';

const AgenticInsight: React.FC = () => {
  const pillars = [
    {
      title: 'Active Bias Detection',
      description: 'Our agent doesn\'t just find bias after the study. It flags leading questions as you type them, suggesting neutral alternatives in real-time.',
      icon: '🎯'
    },
    {
      title: 'Dynamic Follow-ups',
      description: 'During live sessions, the Agentic Co-pilot analyzes participant sentiment and suggests the "Why" questions you didn\'t know you needed to ask.',
      icon: '⚡'
    },
    {
      title: 'Thematic Reasoning',
      description: 'Move beyond simple tags. Our agent reasons over hours of video to map findings directly to your product roadmap goals.',
      icon: '🧠'
    }
  ];

  return (
    <section className="py-24 md:py-36 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 animate-fade-in relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm border border-brand-100/50">
            The Agentic Edge
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6">
            Beyond Passive AI
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Competitors offer summaries. LyndaPlus offers a collaborator that works alongside you to ensure research integrity and depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pillars.map((pillar, i) => (
            <div 
              key={i} 
              className="group p-10 md:p-12 rounded-[40px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-premium transition-all duration-500 cursor-default"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
                {pillar.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                Explore Tech <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgenticInsight;
