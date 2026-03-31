import React from 'react';

const pricingTiers = [
  {
    name: "Starter",
    price: "£49",
    period: "/mo",
    description: "Perfect for independent consultants and solo practitioners.",
    features: [
      "Basic Observer Bias Detector",
      "5 Hours /mo AI Synthesis",
      "Standard Study Templates",
      "Email Support",
      "Unlimited Public Studies"
    ],
    useCase: "Real Case: An independent UX consultant uses Starter to audit their research scripts for leading questions before presenting to early-stage startups.",
    featured: false
  },
  {
    name: "Pro",
    price: "£199",
    period: "/mo",
    description: "The core intelligence suite for high-velocity product teams.",
    features: [
      "Full Observer Bias Detector (Gemini 1.5 Pro)",
      "Real-time Privacy Shield (PII Masking)",
      "Unlimited AI Synthesis & Highlights",
      "Priority Support (2h Slack)",
      "Custom Thematic Models"
    ],
    useCase: "Real Case: A FinTech startup uses Pro to conduct regulated user testing sessions while the Privacy Shield automatically masks sensitive credit card data in real-time.",
    featured: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Advanced agentic orchestration for global organizations.",
    features: [
      "Custom Antigravity Orchestrator Workflows",
      "Data Sovereignty (London/EU Regions)",
      "On-premise LLM Deployment Options",
      "SSO & Advanced Governance",
      "Dedicated Agentic AI Specialist"
    ],
    useCase: "Real Case: A global healthcare provider uses Enterprise to orchestrate cross-continental research while maintaining strict HIPAA compliance via localized storage.",
    featured: false
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 md:py-36 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 animate-fade-in">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl mb-6 font-display font-bold text-slate-900 tracking-tight">
            Predictable Pricing for <span className="text-gradient">Agentic Workflows</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-[800px] mx-auto leading-relaxed">
            Whether you're a solo researcher or a global enterprise, Lyssna-Plus scales with your need for speed and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`flex flex-col p-10 md:p-14 rounded-[40px] transition-all duration-500 hover:-translate-y-3 relative overflow-hidden ${
                tier.featured 
                  ? 'bg-white border-2 border-brand-500 shadow-2xl scale-[1.05] z-10' 
                  : 'bg-slate-50/50 border border-indigo-50/50 hover:bg-white hover:shadow-premium'
              }`}
            >
              {tier.featured && (
                <div className="absolute top-8 right-8 bg-brand-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] shadow-lg animate-pulse">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-sm font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">{tier.name}</div>
              
              <div className="text-5xl md:text-6xl font-bold mb-4 font-display text-slate-950 tracking-tighter">
                {tier.price}<span className="text-lg text-slate-400 font-medium tracking-normal ml-1">{tier.period}</span>
              </div>
              
              <div className="text-slate-500 mb-10 min-h-[4rem] leading-relaxed font-medium">{tier.description}</div>
              
              <ul className="space-y-5 mb-12">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-4 text-[14px] text-slate-600 font-medium">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8 border-t border-indigo-50 text-[13px] leading-relaxed text-slate-400 italic">
                <strong className="not-italic text-slate-900 font-bold block mb-2 uppercase tracking-widest text-[10px]">Actual Case Study</strong> {tier.useCase}
              </div>

              <button className={`mt-12 w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                tier.featured 
                  ? 'bg-slate-950 text-white shadow-lg hover:shadow-brand-500/25 hover:bg-brand-600 active:scale-[0.98]' 
                  : 'bg-white border border-indigo-100 text-slate-900 hover:border-brand-600 hover:text-brand-600 hover:shadow-premium active:scale-[0.98]'
              }`}>
                {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
