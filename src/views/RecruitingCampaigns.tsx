import React from 'react';
import RecruitmentEngine from '../components/RecruitmentEngine';

const RecruitingCampaigns: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-indigo-50/50 pb-8 uppercase">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-display text-slate-900">Research Campaigns</h1>
          <p className="text-slate-500 max-w-md font-medium tracking-normal lowercase first-letter:uppercase">Launch and monitor targeted participant recruitment campaigns with agentic precision.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group">
            <span className="material-symbols-rounded group-hover:rotate-90 transition-transform">add</span>
            <span className="text-sm">New Campaign</span>
          </button>
        </div>
      </div>

      {/* Main Targeting Engine */}
      <RecruitmentEngine />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Campaign Card 1 */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-10 border border-slate-100 shadow-premium space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-600">
                <span className="material-symbols-rounded">bar_chart_4_bars</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">Checkout V2 Study</h3>
                <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">ID: CMP-129-X</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100/50 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live & Sourcing
            </span>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center space-y-1 group-hover:bg-indigo-50/30 transition-colors">
                <p className="text-2xl font-black text-slate-900 leading-none">1,248</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Invited</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center space-y-1 group-hover:bg-brand-50/30 transition-colors">
                <p className="text-2xl font-black text-brand-600 leading-none">84</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Screened</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center space-y-1 group-hover:bg-emerald-50/30 transition-colors">
                <p className="text-2xl font-black text-emerald-600 leading-none">32</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Confirmed</p>
              </div>
            </div>

            {/* Funnel Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <span>Funnel Performance</span>
                <span className="text-brand-600">64% To Goal</span>
              </div>
              <div className="h-4 bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner p-1">
                <div className="h-full bg-slate-900 rounded-full w-[64%] shadow-[0_0_15px_rgba(15,23,42,0.1)] transition-all duration-1000" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Mini-Card: Global Panel Health */}
        <div className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-premium flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227, 211, 211, 0.1),transparent)] pointer-events-none" />
          <div className="space-y-8 relative">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Global Panel Health</h3>
              <p className="text-slate-200 text-xs font-medium">Monitoring reliability resonance scores across 12k participants.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-white leading-none">94%</p>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest pt-1 leading-none">Resonance Score</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-500 transition-colors duration-500">
                  <span className="material-symbols-rounded text-indigo-400 group-hover:text-white transition-colors">sensors</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[94%]" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-200 font-bold uppercase tracking-widest leading-none">Automatic Drift Correction Active</p>
              </div>
            </div>
          </div>

          <button className="w-full py-4 rounded-xl text-white font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all mt-8 relative">
            Recalibrate Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitingCampaigns;
