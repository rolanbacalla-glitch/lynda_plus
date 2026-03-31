import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="glass sticky top-0 z-[1000] py-5 border-b border-indigo-50/50">
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group decoration-none no-underline">
          <div className="w-9 h-9 bg-brand-600 rounded-xl grid place-items-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm">L+</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Lynda<span className="text-brand-500">Plus</span></span>
        </Link>

        <div className="hidden md:flex gap-10 items-center font-semibold text-sm">
          <a href="#features" className="text-slate-500 hover:text-brand-600 transition-colors">Features</a>
          <a href="#solutions" className="text-slate-500 hover:text-brand-600 transition-colors">Solutions</a>
          <a href="#roadmap" className="text-slate-500 hover:text-brand-600 transition-colors">Roadmap</a>
          <a href="#pricing" className="text-slate-500 hover:text-brand-600 transition-colors">Pricing</a>
          <Link to="/dashboard" className="bg-slate-950 text-white px-7 py-3 rounded-2xl shadow-premium hover:bg-brand-600 transition-all hover:shadow-brand-500/20 active:scale-95">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
