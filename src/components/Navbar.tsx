import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { name: 'Capabilities', href: '#capabilities' },
  { name: 'Bias Audit', href: '#bias-audit' },
  { name: 'Solutions', href: '#solutions' },
  { name: 'Pricing', href: '#pricing' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleOpenWorkspace = async () => {
    setIsMenuOpen(false);
    if (!currentUser) {
      await loginAsDemo();
    }
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--sys-outline-variant)] bg-[var(--sys-surface-canvas)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[var(--sys-on-surface)] whitespace-nowrap shrink-0 no-underline"
        >
          LyndaPlus
        </Link>

        {/* Zone 2: 4 single-line navigation links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--sys-on-surface-secondary)]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="whitespace-nowrap shrink-0 hover:text-[var(--sys-on-surface)] transition-colors no-underline py-1 border-b border-transparent hover:border-[var(--sys-primary)]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleOpenWorkspace}
            className="hidden md:inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Workspace
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[var(--sys-radius-sm)] text-[var(--sys-on-surface)] hover:bg-[var(--sys-surface-container)] transition-colors"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen &&
        createPortal(
          <div className="fixed inset-0 top-16 z-40 bg-[var(--sys-surface-canvas)] md:hidden flex flex-col justify-between p-6 border-t border-[var(--sys-outline-variant)]">
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3.5 px-4 text-lg font-semibold text-[var(--sys-on-surface)] rounded-[var(--sys-radius-md)] hover:bg-[var(--sys-surface-container)] no-underline"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="py-3.5 px-4 text-base font-medium text-[var(--sys-on-surface-secondary)] rounded-[var(--sys-radius-md)] hover:bg-[var(--sys-surface-container)] no-underline"
              >
                Sign In
              </Link>
            </nav>

            <button
              type="button"
              onClick={handleOpenWorkspace}
              className="w-full min-h-[48px] px-6 py-3 text-sm sys-btn-primary cursor-pointer"
            >
              Open Workspace
            </button>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Navbar;
