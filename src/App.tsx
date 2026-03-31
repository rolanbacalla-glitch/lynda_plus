import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BiasAlertDemo from './components/BiasAlertDemo';
import AgenticInsight from './components/AgenticInsight';
import Comparison from './components/Comparison';
import Solutions from './components/Solutions';
import Roadmap from './components/Roadmap';
import Pricing from './components/Pricing';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <BiasAlertDemo />
        <AgenticInsight />
        <Comparison />
        <Solutions />
        <Roadmap />
        <Pricing />
      </main>

      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-display font-bold text-xs uppercase">L+</div>
            <span className="font-display font-bold text-slate-900 tracking-tight">LyndaPlus</span>
          </div>

          <nav className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-brand-600 transition-colors">Solutions</a>
            <a href="#roadmap" className="hover:text-brand-600 transition-colors">Roadmap</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Pricing</a>
            <Link to="/dashboard" className="hover:text-brand-600 transition-colors decoration-none no-underline">Dashboard</Link>
          </nav>

          <p className="text-sm text-slate-600 font-medium">
            &copy; 2026 LyndaPlus. Built with <span className="text-brand-600 font-bold">Agentic AI</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
