import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="py-20 md:py-36 text-center relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.08)_0%,transparent_60%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 animate-fade-in text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] mb-8 md:mb-10 border border-indigo-100/50 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Now featuring Agentic AI Analysis
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-[1] md:leading-[0.9]">
          Lynda<span className="text-gradient">Plus</span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-500 max-w-[800px] mx-auto mb-10 md:mb-14 leading-relaxed font-medium px-4 md:px-0">
          Stop using passive tools. LyndaPlus uses Agentic AI to actively guide your research, detect subtle bias, and automate complex synthesis in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center">
          <Link to="/dashboard" className="w-full sm:w-auto bg-slate-950 text-white px-10 py-4 rounded-2xl font-bold shadow-premium hover:bg-brand-600 transition-all hover:shadow-brand-500/25 active:scale-95 text-lg no-underline">
            Start Free Trial
          </Link>
          <Link to="/login" className="w-full sm:w-auto glass px-10 py-4 rounded-2xl font-bold border border-indigo-100 hover:border-brand-600 transition-all text-lg text-slate-700 shadow-sm no-underline inline-block">
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
