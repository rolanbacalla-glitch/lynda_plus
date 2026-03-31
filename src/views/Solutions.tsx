import React from 'react';
import { Link } from 'react-router-dom';

const Solutions: React.FC = () => {
  return (
    <div className="animate-fade-in py-6">
      <header className="mb-14">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display tracking-tight">Discovery Hub</h1>
        <p className="text-lg text-slate-600 font-semibold max-w-2xl leading-relaxed">
          Browse our research templates and discovery flows to find the perfect methodology for your project objectives.
        </p>
      </header>

      {/* Featured Template Banner */}
      <div 
        className="card banner-gradient shadow-xl shadow-brand-500/20 p-16 mb-20 relative overflow-hidden border-none group text-white"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-3xl rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-10 border border-white/30">Alpha Template</span>
          <h2 className="text-5xl font-bold mb-6 font-display leading-[1.1] tracking-tight text-white">Master Five Second Testing</h2>
          <p className="text-lg text-white/90 mb-12 font-medium leading-relaxed max-w-lg">
            Quickly measure first impressions of your designs. Learn how to craft questions that reveal immediate visual hierarchy and clarity.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-brand-600 px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:bg-brand-50 hover:scale-105 transition-all text-sm">
              Add to Projects <span className="material-symbols-rounded">add_circle</span>
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-40 pointer-events-none skew-x-12 bg-white/5" />
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-30 pointer-events-none skew-x-12">
          <div className="w-full h-full bg-gradient-to-l from-white/20 via-transparent to-transparent" />
          <span className="material-symbols-rounded text-[400px] absolute top-1/2 -right-40 -translate-y-1/2 text-white/20 select-none">speed</span>
        </div>
        {/* Animated Accent */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {/* Solution Category 1: For Role */}
        <div className="col-span-full mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-5 tracking-tight">
            <span className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20 shadow-sm">
              <span className="material-symbols-rounded text-xl">person_search</span>
            </span>
            By Professional Role
          </h2>
        </div>
        {[
          { title: 'Product Managers', desc: 'Prioritize roadmaps with high-confidence user intent data.', icon: 'analytics', color: 'indigo' },
          { title: 'UX Designers', desc: 'Optimize user flows and visual hierarchy with rapid feedback.', icon: 'layers', color: 'brand' },
          { title: 'Marketers', desc: 'Test messaging and conversion intent before launching campaigns.', icon: 'campaign', color: 'rose' },
          { title: 'Researchers', desc: 'Advanced unmoderated and moderated multi-stage study patterns.', icon: 'psychology', color: 'emerald' }
        ].map((item) => (
          <div key={item.title} className="card bg-white hover:border-brand-500/30 group cursor-pointer flex flex-col items-start p-10 shadow-premium border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-brand-600 mb-10 transition-all border border-slate-100 shadow-inner">
              <span className="material-symbols-rounded text-3xl font-light">{item.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors tracking-tight">{item.title}</h3>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed mb-10">{item.desc}</p>
            <Link to="/dashboard/create" className="mt-auto group/btn flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-800 transition-colors">
              Use Template <span className="material-symbols-rounded text-base group-hover/btn:translate-x-2 transition-transform">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Solution Category 2: Use Case Focus */}
        <div className="col-span-full mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-5 tracking-tight">
            <span className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-sm">
              <span className="material-symbols-rounded text-xl">fact_check</span>
            </span>
            By High-Impact Use Case
          </h2>
        </div>
        {[
          { title: 'Concept Validation', icon: 'lightbulb', color: 'emerald', detail: 'Validate vision before writing code.' },
          { title: 'Information Architecture', icon: 'account_tree', color: 'indigo', detail: 'Optimize navigation and labeling.' },
          { title: 'Prototype Testing', icon: 'touch_app', color: 'amber', detail: 'Measure task success in interactive mockups.' },
          { title: 'Preference Testing', icon: 'view_carousel', color: 'brand', detail: 'Decide between design variations with data.' }
        ].map((item) => (
          <div key={item.title} className="card bg-white flex items-center gap-10 hover:border-slate-200 transition-all p-12 shadow-premium border border-slate-100 group">
            <div className={`w-28 h-28 rounded-[32px] bg-slate-50 text-slate-500 group-hover:text-brand-600 flex items-center justify-center flex-shrink-0 shadow-inner border border-slate-100 transition-all`}>
              <span className="material-symbols-rounded text-5xl font-light group-hover:scale-110 transition-transform">{item.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{item.title}</h3>
              <p className="text-slate-600 text-sm font-semibold mb-8 leading-relaxed">{item.detail}</p>
              <button className="text-brand-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:text-brand-800 transition-colors">Configure Flow <span className="material-symbols-rounded text-base">settings</span></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solutions;
