import React, { useState } from 'react';

const BiasAlertDemo: React.FC = () => {
  const [question, setQuestion] = useState("Explain how much you enjoyed using this application.");
  
  return (
    <section id="features" className="py-24 md:py-36 bg-slate-50/50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-10 relative z-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl mb-8 font-display font-bold text-slate-900 tracking-tight leading-tight">
              Stop Bias Before It <span className="text-gradient">Starts.</span>
            </h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-[540px]">
              Our proprietary Agentic engine monitors study creation in real-time, flagging leading questions and surfacing potential sampling bias immediately.
            </p>
            <ul className="grid gap-5">
              {['Real-time Leading Question Detection', 'Sentiment Mirroring Analysis', 'Inclusive Language Auditing'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 font-semibold group">
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass p-8 md:p-12 rounded-[40px] shadow-premium relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-indigo-500/20 rounded-[42px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative">
              <div className="mb-8">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Live Research Guardrail</label>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full h-[120px] p-6 rounded-2xl bg-white/50 border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-sans text-lg text-slate-800 resize-none shadow-sm"
                  placeholder="Type your research question here..."
                />
              </div>
              
              <div className="animate-fade-in p-6 bg-rose-50/50 border border-rose-100 rounded-2xl flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">⚠️</div>
                <div>
                  <h4 className="text-rose-600 font-bold mb-1 uppercase tracking-wider text-[11px]">Leading Question Detected</h4>
                  <p className="text-[15px] text-rose-500 leading-relaxed font-medium">
                    The phrase "how much you enjoyed" assumes a positive experience. Try: <span className="text-rose-700 underline underline-offset-4 decoration-rose-300">"What was your experience using this application?"</span>
                  </p>
                </div>
              </div>
              
              <button className="mt-10 w-full py-4 bg-slate-950 text-white rounded-2xl font-bold text-lg hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all active:scale-[0.98]">
                Run AI AI-Guard Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiasAlertDemo;
