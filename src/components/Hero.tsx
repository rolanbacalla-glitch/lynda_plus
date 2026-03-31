import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="py-24 md:py-36 text-center relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.08)_0%,transparent_60%)]">
      <div className="max-w-7xl mx-auto px-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-50 text-brand-600 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] mb-10 border border-indigo-100/50 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Now featuring Agentic AI Analysis
        </div>
        
        <h1 className="text-6xl md:text-8xl mb-8 max-w-[1000px] mx-auto font-display font-bold leading-[1.05] text-slate-900 tracking-tight">
          Meet Your New <span className="text-gradient">Agentic Research</span> Collaborator
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-[800px] mx-auto mb-14 leading-relaxed font-medium">
          Stop using passive tools. Lyssna-Plus uses Agentic AI to actively guide your research, detect subtle bias, and automate complex synthesis in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-0">
          <Link to="/dashboard" className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-bold shadow-premium hover:bg-brand-600 transition-all hover:shadow-brand-500/25 active:scale-95 text-lg no-underline">
            Start Free Trial
          </Link>
          <button className="glass px-10 py-4 rounded-2xl font-bold border border-indigo-100 hover:border-brand-600 transition-all text-lg text-slate-700 shadow-sm">
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
