import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PrivacyOverlay from '../components/PrivacyOverlay';
import BiasPanel from '../components/BiasPanel';
import { getSessionAnalysis, getConnectionStatus } from '../data/geminiService';
import type { AIResponse } from '../data/geminiService';

const AgenticSession: React.FC = () => {
  const { projectId } = useParams();
  const [sentiment, setSentiment] = useState<'neutral' | 'positive' | 'frustrated'>('neutral');
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>('');
  const [showPrivacyShield, setShowPrivacyShield] = useState(true);
  const [engagement, setEngagement] = useState<number>(92);
  const [thinkingLog, setThinkingLog] = useState<string[]>([]);

  const status = getConnectionStatus();

  useEffect(() => {
    const fetchAnalysis = async () => {
      // Simulate real-time processing
      const response: AIResponse = await getSessionAnalysis("Transcript snippet...");
      setSentiment(response.sentiment);
      setSuggestedQuestion(response.content);
      setEngagement(response.engagementScore);

      // Update thinking log with proactive agent thoughts
      const potentialThoughts = [
        "Analyzing participant's eye movement cadence...",
        "Detected 350ms hesitation on CTA button.",
        "Cross-referencing with Pricing Objection model...",
        "Sentiment shifting based on linguistic markers.",
        "Refining follow-up question for maximum clarity.",
        "Scanning for micro-expressions in video feed...",
        "Comparing current flow with Participant #12 history.",
        "Synthesizing theme: 'Onboarding Friction'."
      ];

      // Add 1-2 new random thoughts to the top
      setThinkingLog(prev => {
        const newThoughts = [...potentialThoughts]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1);
        return [...newThoughts, ...prev].slice(0, 12);
      });
    };

    const timer = setInterval(() => {
      fetchAnalysis();
    }, 6000);

    fetchAnalysis(); // Initial call

    return () => clearInterval(timer);
  }, []);

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
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Recording: Participant #48 • {projectId || 'DEMO-PROJECT'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPrivacyShield(!showPrivacyShield)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${showPrivacyShield
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
        {/* Live Video Feed Column */}
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

            {showPrivacyShield && <PrivacyOverlay />}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-1000 bg-sentiment-${sentiment}`} />

            <div className="text-white opacity-20 text-center animate-pulse group-hover/video:opacity-40 transition-opacity">
              <span className="material-symbols-rounded text-9xl">face</span>
              <p className="font-mono mt-4">Participant Stream Simulation</p>
            </div>

            {/* AI Sentiment Bar Overlay */}
            <div className="absolute bottom-10 left-10 right-10 z-30 flex items-center justify-between pointer-events-none translate-y-4 opacity-0 group-hover/video:translate-y-0 group-hover/video:opacity-100 transition-all duration-500">
              <div className="p-6 rounded-[32px] bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center gap-8 min-w-[300px] shadow-2xl">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Emotion</p>
                  <p className={`text-sm font-bold uppercase ${sentiment === 'frustrated' ? 'text-rose-400' : sentiment === 'positive' ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {sentiment}
                  </p>
                </div>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${sentiment === 'frustrated' ? 'bg-rose-400 w-[85%]' : sentiment === 'positive' ? 'bg-emerald-400 w-[40%]' : 'bg-slate-400 w-[60%]'}`} />
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Engagement</p>
                  <p className="text-sm font-bold text-brand-400 uppercase">{engagement}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Panel */}
          <div className="card glass p-10 border border-slate-100 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">Session Transcript</h3>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 font-bold text-xs shadow-sm">P</div>
                <div className="space-y-1">
                  <p className="text-[15px] text-slate-700 font-medium leading-relaxed italic">"I'm trying to find the checkout button, but it seems there are too many steps..."</p>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-normal">12:45 PM • FRUSTRATION DETECTED</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0 font-bold text-xs border border-brand-200 shadow-sm">M</div>
                <p className="text-[15px] text-slate-800 font-medium leading-relaxed">"That's valuable. Which steps felt most unnecessary?"</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card glass p-8 bg-slate-900 border-none shadow-premium-dark relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-brand-500/30">
                  <span className="material-symbols-rounded text-sm animate-spin-slow">psychology</span>
                </div>
                <h4 className="font-bold text-white text-sm uppercase tracking-widest tracking-tight">Agentic Co-pilot</h4>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                <p className={`text-[10px] font-bold uppercase tracking-tight ${status.labelColor}`}>
                  {status.isConnected ? 'Connected' : 'Demo Mode'}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Recommendation</p>
                <div className="p-6 rounded-[24px] bg-white/10 border border-white/10 text-slate-200 text-sm font-semibold leading-relaxed shadow-sm">
                  {suggestedQuestion || "Initializing AI analysis engine..."}
                </div>
              </div>
              <button className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-500 transition-all shadow-xl shadow-brand-500/20 active:scale-95">
                Apply AI Follow-up
              </button>
            </div>
          </div>

          {/* Thinking Trace Card */}
          <div className="card glass p-8 bg-slate-950 border border-white/5 rounded-[40px] shadow-premium-dark">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <span className="material-symbols-rounded text-emerald-400 text-xs animate-spin-slow">sync</span>
              </div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest tracking-tight">AI Thinking Trace</h4>
            </div>

            <div className="space-y-5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {thinkingLog.map((thought, i) => (
                <div key={i} className="flex gap-4 group animate-fade-in-up">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                  <p className="text-[12px] font-medium text-slate-300 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {thought}
                  </p>
                </div>
              ))}
              {thinkingLog.length === 0 && (
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter animate-pulse text-center py-4">Synchronizing with stream...</p>
              )}
            </div>
          </div>

          <BiasPanel />
        </div>
      </div>
    </div>
  );
};

export default AgenticSession;
