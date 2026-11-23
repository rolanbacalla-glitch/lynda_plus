import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BiasAlertDemo from './components/BiasAlertDemo';
import AgenticInsight from './components/AgenticInsight';
import Comparison from './components/Comparison';
import Solutions from './components/Solutions';
import Pricing from './components/Pricing';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--sys-surface-canvas)] text-[var(--sys-on-surface)]">
      <Navbar />
      <main>
        <Hero />
        <BiasAlertDemo />
        <AgenticInsight />
        <Comparison />
        <Solutions />
        <Pricing />
      </main>

      <footer className="py-12 border-t border-[var(--sys-outline-variant)] bg-[var(--sys-surface-canvas)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-base font-bold text-[var(--sys-on-surface)] tracking-tight">
              LyndaPlus
            </span>
            <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
              © 2026 LyndaPlus Research Systems. All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-xs font-medium text-[var(--sys-on-surface-secondary)]">
            <a href="#bias-audit" className="hover:text-[var(--sys-on-surface)] no-underline">
              Bias Audit
            </a>
            <a href="#capabilities" className="hover:text-[var(--sys-on-surface)] no-underline">
              Capabilities
            </a>
            <a href="#solutions" className="hover:text-[var(--sys-on-surface)] no-underline">
              Solutions
            </a>
            <a href="#pricing" className="hover:text-[var(--sys-on-surface)] no-underline">
              Pricing
            </a>
            <Link to="/login" className="hover:text-[var(--sys-on-surface)] no-underline">
              Sign In
            </Link>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 min-h-[38px] px-3.5 py-1.5 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
