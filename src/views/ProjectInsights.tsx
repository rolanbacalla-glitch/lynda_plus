import React from 'react';
import { useParams } from 'react-router-dom';
import { mockInsights, mockThemes } from '../data/mockData';
import AgenticReasoning from '../components/AgenticReasoning';

const ProjectInsights: React.FC = () => {
  const { projectId } = useParams();

  return (
    <div className="view-container animate-fade-in px-12 py-12">
      <div className="header-section mb-14">
        <h1 className="text-4xl font-bold font-display text-slate-900 tracking-tight mb-2 italic">Automated Insights</h1>
        <p className="text-xl text-slate-400 font-medium tracking-tight">Agentic Multimodal Synthesis for Project #{projectId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Insights Timeline */}
        <div className="lg:col-span-2 space-y-10">
          <AgenticReasoning />
          
          <div className="card glass p-10 md:p-12 relative overflow-hidden bg-white border border-slate-100 shadow-premium">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-3 font-display tracking-tight">
              <span className="p-3 bg-brand-50 rounded-2xl animate-pulse">✨</span>
              Key "Aha!" Moments
            </h3>
            <div className="space-y-6">
              {mockInsights.map((insight) => (
                <div key={insight.id} className="p-6 rounded-[32px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl transition-all duration-500 group/item relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover/item:text-brand-600 transition-colors uppercase italic">{insight.title}</h4>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${insight.type === 'Critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-[15px] text-slate-500 font-medium leading-relaxed mb-6 leading-relaxed">{insight.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                       <span>Inference Engine: Gemini 1.5 Pro</span>
                    </div>
                    <span>{insight.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass p-10 md:p-12 border border-slate-100 shadow-premium bg-white">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 font-display tracking-tight italic uppercase">Video-to-Insight Synthesis</h3>
            <div className="aspect-video rounded-[40px] bg-slate-900 flex items-center justify-center relative shadow-2xl group cursor-pointer overflow-hidden border-8 border-white">
              <div className="text-center z-10 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center mx-auto mb-6 shadow-brand-500/30 group-hover:scale-110 active:scale-95 transition-all">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                </div>
                <p className="text-white font-bold text-lg tracking-tight uppercase italic">Play Insight Highlight Reel</p>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">AI-Synthesized from 12 hrs footage</p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(79,70,229,0.2)_0%,transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-10">
          <div className="card glass p-10 md:p-12 border border-slate-100 shadow-premium bg-white">
            <h3 className="text-xl font-bold mb-8 text-slate-900 font-display tracking-tight underline decoration-4 decoration-brand-200 underline-offset-8 italic uppercase">Thematic Analysis</h3>
            <div className="space-y-6">
              {mockThemes.map((theme) => (
                <div key={theme.name} className="space-y-2 group/theme cursor-default">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] group-hover/theme:text-brand-600 transition-colors">
                    <span>{theme.name}</span>
                    <span className="text-slate-400">{theme.count} mentions</span>
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                    <div 
                      className={`h-full rounded-2xl shadow-sm transition-all duration-1000 ${theme.sentiment === 'Positive' ? 'bg-emerald-400' : theme.sentiment === 'Negative' ? 'bg-rose-400' : 'bg-slate-300'}`}
                      style={{ width: `${(theme.count / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 rounded-2xl border-2 border-indigo-50 font-bold text-sm text-slate-700 hover:border-brand-600 hover:text-brand-600 hover:bg-brand-50/50 transition-all active:scale-95 shadow-sm">View Affinity Map</button>
          </div>

          <div className="card glass p-10 md:p-12 bg-slate-950 text-white relative overflow-hidden group shadow-premium-dark">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold mb-3 font-display italic tracking-tight uppercase">Multimodal Correlation</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium mb-6 leading-relaxed">System correlated verbal frustration with mouse-click clusters in the "Checkout" view.</p>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-[13px] font-mono leading-relaxed text-brand-300">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] block mb-2 opacity-50">System Logs:</span>
              "High confidence (92%) that address validation is the primary barrier."
            </div>
          </div>

          <div className="card glass overflow-hidden">
            <h3 className="font-bold mb-4 text-slate-800">Engagement Heatmap</h3>
            <div className="aspect-square rounded-lg bg-slate-50 heatmap-box border border-slate-100 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click Density Layer</p>
                <div className="w-full h-px bg-slate-200 my-2"></div>
                <p className="text-[10px] text-slate-400">Gemini 3.1 Synthesis</p>
              </div>
            </div>
          </div>

          <div className="card glass">
            <h3 className="font-bold mb-4 text-slate-800">Card Sort Dendrogram</h3>
            <div className="h-40 relative flex items-center">
              <svg className="w-full h-full">
                <path d="M 0 20 L 50 20 L 50 60 L 100 60" className="dendrogram-line" />
                <path d="M 50 20 L 50 0 L 100 0" className="dendrogram-line" />
                <path d="M 0 100 L 40 100 L 40 80 L 100 80" className="dendrogram-line" />
                <path d="M 40 100 L 40 120 L 100 120" className="dendrogram-line" />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-between py-2 text-[10px] text-slate-400 pl-24">
                <span>Category A</span>
                <span>Category B</span>
                <span>Category C</span>
                <span>Category D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInsights;
