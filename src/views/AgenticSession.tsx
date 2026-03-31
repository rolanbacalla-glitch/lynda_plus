import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PrivacyOverlay from '../components/PrivacyOverlay';
import BiasPanel from '../components/BiasPanel';

const AgenticSession: React.FC = () => {
  const { projectId } = useParams();
  const [sentiment, setSentiment] = useState<'neutral' | 'positive' | 'frustrated'>('neutral');
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>('');
  const [showPrivacyShield, setShowPrivacyShield] = useState(true);

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
    <div className="view-container animate-fade-in p-12 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="material-symbols-rounded animate-pulse relative z-10">videocam</span>
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
          <button 
            onClick={() => setShowPrivacyShield(!showPrivacyShield)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
              showPrivacyShield 
              ? 'bg-brand-50 border-brand-100 text-brand-600' 
              : 'bg-white border-slate-100 text-slate-600'
            }`}
          >
            {showPrivacyShield ? 'Privacy Shield On' : 'Privacy Shield Off'}
          </button>
          <button className="bg-rose-500 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95">
            End Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Video Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="aspect-video bg-slate-950 rounded-[48px] shadow-2xl border-[12px] border-white relative overflow-hidden flex items-center justify-center group/video">
            <div className="absolute top-8 left-8 flex items-center gap-3 z-30">
              <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  720p HD Stream
                </p>
              </div>
            </div>

            {/* Privacy Shield Overlay */}
            {showPrivacyShield && <PrivacyOverlay />}

            {/* Simulated sentiment overlay */}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-1000 bg-sentiment-${sentiment}`} />

            <div className="text-white opacity-20 text-center animate-pulse group-hover/video:opacity-40 transition-opacity">
              <span className="material-symbols-rounded text-9xl">face</span>
              <p className="font-mono mt-4">Participant Stream Simulation</p>
            </div>

            {/* AI Sentiment Bar Overlay */}
            <div className="absolute bottom-10 left-10 right-10 z-30 flex items-center justify-between pointer-events-none translate-y-4 opacity-0 group-hover/video:translate-y-0 group-hover/video:opacity-100 transition-all duration-500">
              <div className="p-6 rounded-[32px] bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center gap-8 min-w-[300px] shadow-2xl">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Emotion</p>
                  <p className={`text-sm font-bold transition-all duration-500 uppercase ${sentiment === 'frustrated' ? 'text-rose-400' : sentiment === 'positive' ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {sentiment}
                  </p>
                </div>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${sentiment === 'frustrated' ? 'bg-rose-400 w-[85%]' : sentiment === 'positive' ? 'bg-emerald-400 w-[40%]' : 'bg-slate-400 w-[60%]'}`} />
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Engagement</p>
                  <p className="text-sm font-bold text-brand-400 uppercase">92% High</p>
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white border-4 border-white shadow-premium">
                <span className="font-black">92</span>
              </div>
            </div>
          </div>

          <div className="card glass p-10 md:p-12 border border-slate-100 bg-white hover:border-brand-100 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight">Session Transcript (Real-time)</h3>
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-widest">Live Extraction</span>
            </div>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 font-bold text-xs shadow-sm">P</div>
                <div className="space-y-1">
                  <p className="text-[15px] text-slate-700 font-medium leading-relaxed italic">"I'm trying to find the checkout button, but it seems there are too many steps in this onboarding flow. Is there any way to skip?"</p>
                  <p className="text-[10px] text-slate-400 font-bold">12:45 PM • FRUSTRATION DETECTED</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0 font-bold text-xs border border-brand-200 shadow-sm">M</div>
                <p className="text-[15px] text-slate-800 font-bold leading-relaxed">"That's valuable. Can you tell me more about which steps felt most unnecessary?"</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Sidebar */}
        <div className="space-y-8 lg:col-span-4">
          <div className="card glass p-8 md:p-10 bg-slate-900 border-none shadow-premium-dark relative overflow-hidden group/copilot">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 group-hover:h-2 transition-all" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-brand-500/30">
                <span className="material-symbols-rounded text-sm">psychology</span>
              </div>
              <h4 className="font-bold text-white text-sm uppercase tracking-widest italic tracking-tight">Agentic Co-pilot</h4>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Recommendation</p>
                <div className="p-6 rounded-[24px] bg-brand-100/50 border border-brand-200 text-brand-900 text-sm font-semibold leading-relaxed shadow-sm">
                  {suggestedQuestion || "Analysing participant's micro-hesitation..."}
                </div>
              </div>

              <button className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-500 hover:-translate-y-1 transition-all shadow-lg shadow-brand-500/20 active:scale-95">
                Apply AI Follow-up
              </button>
            </div>
          </div>

          <BiasPanel />

          <div className="card glass p-8 md:p-10 border border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest italic tracking-tight underline decoration-rose-200 underline-offset-4">Insights Engine</h4>
              <span className="w-6 h-6 rounded-full bg-rose-50 text-[10px] font-bold text-rose-500 flex items-center justify-center border border-rose-100">3</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 group/item cursor-pointer hover:bg-rose-100 transition-colors">
                <span className="material-symbols-rounded text-rose-400 text-sm group-hover:scale-125 transition-transform">report</span>
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-tight">Onboarding Fatigue</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3 group/item cursor-pointer hover:bg-amber-100 transition-colors">
                <span className="material-symbols-rounded text-amber-400 text-sm group-hover:scale-125 transition-transform">help_outline</span>
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
