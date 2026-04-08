import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    // Cleanup on unmount or state change
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="glass sticky top-0 z-[1000] py-4 md:py-5 border-b border-indigo-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group decoration-none no-underline relative z-[1001]">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-brand-600 rounded-xl grid place-items-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xs md:text-sm">L+</span>
          </div>
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Lynda<span className="text-brand-500 pr-0.5">Plus</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-1 gap-x-10 items-center font-semibold text-sm">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-slate-500 hover:text-brand-600 transition-colors no-underline">
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-2">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-slate-500 hover:text-brand-600 transition-colors no-underline">
                  Log In
                </Link>
                <Link to="/dashboard" className="bg-slate-950 text-white px-7 py-3 rounded-2xl shadow-premium hover:bg-brand-600 transition-all hover:shadow-brand-500/20 active:scale-95 no-underline">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-slate-500 hover:text-brand-600 transition-colors no-underline">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-slate-900/5 text-slate-900 px-6 py-3 rounded-2xl border border-slate-200/50 hover:bg-brand-50 hover:text-brand-600 transition-all active:scale-95 font-bold"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden relative z-[10001] w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none group"
          aria-label="Toggle Menu"
        >
          <span className={`w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-500 origin-center ${isMenuOpen ? 'rotate-[45deg] translate-y-[4px]' : 'group-hover:w-7'}`} />
          <span className={`w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-500 origin-center ${isMenuOpen ? 'rotate-[-45deg] -translate-y-[4px]' : 'group-hover:w-5'}`} />
        </button>

        {/* Mobile Overlay (Portal) */}
        {createPortal(
          <div
            className={`fixed inset-0 bg-white/99 backdrop-blur-[40px] z-[10000] transition-all duration-700 md:hidden flex flex-col pt-24 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
          >
            {/* Mobile Overlay Header Info (Branding) */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-xl grid place-items-center">
                <span className="text-white font-bold text-xs">L+</span>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Lynda<span className="text-brand-500">Plus</span></span>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow gap-8 px-10">
              {navLinks.map((link, i) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ transitionDelay: `${i * 75}ms` }}
                  className={`text-3xl font-bold text-slate-900 transition-all duration-500 hover:text-brand-600 no-underline ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div
              className={`mt-auto p-10 border-t border-slate-100 flex flex-col gap-4 transition-all duration-700 delay-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
            >
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-5 rounded-2xl font-bold text-slate-500 hover:text-brand-600 transition-colors no-underline"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-slate-950 text-white py-5 rounded-2xl font-bold shadow-premium hover:bg-brand-600 transition-all active:scale-95 text-center no-underline"
                  >
                    Get Started Free
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-5 rounded-2xl font-bold text-slate-600 hover:text-brand-600 transition-colors no-underline"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-slate-100 text-slate-900 py-5 rounded-2xl font-bold transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-rounded text-lg">logout</span>
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    </nav>
  );
};

export default Navbar;
