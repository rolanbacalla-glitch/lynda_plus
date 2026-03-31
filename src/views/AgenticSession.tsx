import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const AgenticSession: React.FC = () => {
  const { projectId } = useParams();
  const [sentiment, setSentiment] = useState<'neutral' | 'positive' | 'frustrated'>('neutral');
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>('');

  const suggestions = useMemo(() => [
    "It seems they hesitated when mentioned 'Pricing'. Ask: 'What specifically about the pricing feels unclear?'",
    "Positive signal detected on the 'Clean UI'. Ask: 'Compared to your current tool, what feels simplified here?'",
    "Frustration spike during address search. Ask: 'Did you expect a direct input field rather than a dropdown?'"
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      const sentiments: ('neutral' | 'positive' | 'frustrated')[] = ['neutral', 'positive', 'frustrated'];
      const sent = sentiments[Math.floor(Math.random() * sentiments.length)];
      setSentiment(sent);
      setSuggestedQuestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }, 4000);
    return () => clearInterval(timer);
  }, [suggestions]);

  return (
    <div className="view-container animate-fade-in p-12">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl">
            <span className="material-symbols-rounded animate-pulse">videocam</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight leading-none mb-2">Live Session Analysis</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Recording: Participant #48 (Mobile Onboarding) • {projectId}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-white border-2 border-slate-100 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:border-brand-600 hover:text-brand-600 transition-all">
            Add Bookmark
          </button>
          <button className="bg-rose-500 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
            End Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Live Video Feed */}
        <div className="lg:col-span-3 space-y-8">
          <div className="aspect-video bg-slate-950 rounded-[48px] shadow-2xl border-[12px] border-white relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
              <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  720p HD Stream
                </p>
              </div>
            </div>

            {/* Simulated sentiment overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-1000"
              style={{ backgroundColor: sentiment === 'frustrated' ? 'rgba(244, 63, 94, 0.05)' : sentiment === 'positive' ? 'rgba(52, 211, 153, 0.05)' : 'transparent' }} />

            <div className="text-white opacity-20 text-center animate-pulse">
              <span className="material-symbols-rounded text-9xl">face</span>
              <p className="font-mono mt-4">Participant Stream Simulation</p>
            </div>

            {/* AI Sentiment Bar Overlay */}
            <div className="absolute bottom-10 left-10 right-10 z-20 flex items-center justify-between pointer-events-none">
              <div className="p-6 rounded-[32px] bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center gap-8 min-w-[300px]">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Emotion</p>
                  <p className={`text-sm font-bold transition-all duration-500 uppercase ${sentiment === 'frustrated' ? 'text-rose-400' : sentiment === 'positive' ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {sentiment}
                  </p>
                </div>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${sentiment === 'frustrated' ? 'bg-rose-400 w-[85%]' : sentiment === 'positive' ? 'bg-emerald-400 w-[40%]' : 'bg-slate-400 w-[60%]'}`} />
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Engagement</p>
                  <p className="text-sm font-bold text-brand-400 uppercase">92% High</p>
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white border-4 border-white shadow-premium animate-bounce">
                <span className="font-black">92</span>
              </div>
            </div>
          </div>

          <div className="card glass p-10 md:p-12 border border-slate-100 bg-white">
            <h3 className="text-xl font-bold mb-6 text-slate-900 font-display tracking-tight">Session Transcript (Real-time Extraction)</h3>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 font-bold text-xs">P</div>
                <p className="text-[15px] text-slate-700 font-medium leading-relaxed italic">"I'm trying to find the checkout button, but it seems there are too many steps in this onboarding flow. Is there any way to skip?"</p>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0 font-bold text-xs border border-brand-200">M</div>
                <p className="text-[15px] text-slate-800 font-bold leading-relaxed">"That's valuable. Can you tell me more about which steps felt most unnecessary?"</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Sidebar */}
        <div className="space-y-8 lg:col-span-1">
          <div className="card glass p-8 md:p-10 bg-slate-900 border-none shadow-premium-dark relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 animate-pulse" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-brand-500/30">
                <span className="material-symbols-rounded text-sm">psychology</span>
              </div>
              <h4 className="font-bold text-white text-sm uppercase tracking-widest italic tracking-tight">Agentic Co-pilot</h4>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Recommendation</p>
                <div className="p-6 rounded-[24px] bg-brand-500/10 border border-brand-500/20 text-brand-100 text-sm font-medium leading-relaxed shadow-inner">
                  {suggestedQuestion || "Analyzing participant's micro-hesitation..."}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Moderator Bias Check</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <span className="material-symbols-rounded text-sm">verified</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.1em]">Neutral tone detected</p>
                </div>
              </div>

              <div className="pt-8">
                <button className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-500 hover:-translate-y-1 transition-all shadow-lg shadow-brand-500/20 active:scale-95">
                  Apply AI Follow-up
                </button>
              </div>
            </div>
          </div>

          <div className="card glass p-8 md:p-10 border border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest italic tracking-tight underline decoration-rose-200 underline-offset-4">Issues Found</h4>
              <span className="w-6 h-6 rounded-full bg-rose-50 text-[10px] font-bold text-rose-500 flex items-center justify-center border border-rose-100">3</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
                <span className="material-symbols-rounded text-rose-400 text-sm">report</span>
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-tight">Onboarding Fatigue</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                <span className="material-symbols-rounded text-amber-400 text-sm">help_outline</span>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-tight">Search Confusion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenticSession;
