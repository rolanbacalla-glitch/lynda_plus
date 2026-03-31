import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BiasAlertDemo from './components/BiasAlertDemo';
import Comparison from './components/Comparison';
import Roadmap from './components/Roadmap';
import AgenticInsight from './components/AgenticInsight';

import Pricing from './components/Pricing';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <BiasAlertDemo />
        <AgenticInsight />
        <Comparison />
        <Roadmap />
        <Pricing />
      </main>
      
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-display font-bold text-xs uppercase">L+</div>
            <span className="font-display font-bold text-slate-900 tracking-tight">Lyssna-Plus</span>
          </div>
          
          <nav className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#roadmap" className="hover:text-brand-600 transition-colors">Roadmap</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Pricing</a>
            <a href="/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</a>
          </nav>

          <p className="text-sm text-slate-400 font-medium">
            &copy; 2026 Lyssna-Plus. Built with <span className="text-brand-600 font-bold">Agentic AI</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
