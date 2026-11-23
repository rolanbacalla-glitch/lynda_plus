import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Moon, ShieldCheck, Sun, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (message: string) => {
    if (message.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in popup was closed before finishing. Try again or enter Demo Workspace below.';
    }
    if (message.includes('auth/popup-blocked')) {
      return 'Your browser blocked the Google sign-in popup. Allow popups for this site and try again.';
    }
    if (message.includes('auth/unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return `“${host}” is not yet in Firebase Authorised Domains. Use Preview Demo Workspace below (100% local & free) or add this domain in Firebase Auth Settings.`;
    }
    return message || 'Unable to sign in. Please try again or enter Demo Workspace.';
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await auth.signInWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(getFriendlyErrorMessage(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    try {
      setError('');
      setLoading(true);
      await auth.loginAsDemo();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getFriendlyErrorMessage(err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--sys-surface-canvas)] text-[var(--sys-on-surface)]">
      {/* Minimal Top Bar */}
      <header className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-[var(--sys-outline-variant)]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--sys-on-surface)] no-underline hover:text-[var(--sys-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>LyndaPlus</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--sys-radius-sm)] sys-btn-secondary cursor-pointer"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--sys-on-surface)]">
              Sign in to LyndaPlus
            </h1>
            <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
              Connect with Google to sync studies to sovereign UK/EU Firestore storage and access your Google Drive research vault.
            </p>
          </div>

          <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
            {error && (
              <div
                role="alert"
                className="p-4 rounded-[var(--sys-radius-md)] border border-[var(--sys-outline-variant)] flex items-start gap-3 text-sm"
                style={{
                  backgroundColor: 'var(--sys-danger-bg)',
                  color: 'var(--sys-danger-fg)',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                disabled={loading}
                label={loading ? 'Connecting Google...' : 'Sign in with Google'}
              />
              <p className="text-xs text-[var(--sys-on-surface-tertiary)] text-center">
                Enables Cloud Firestore sync (europe-west2) and Google Drive Vault access.
              </p>
            </div>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-[var(--sys-outline-variant)]" />
              <span className="px-3 text-xs text-[var(--sys-on-surface-tertiary)]">
                or explore locally
              </span>
              <div className="flex-1 border-t border-[var(--sys-outline-variant)]" />
            </div>

            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full min-h-[44px] px-5 py-2.5 text-sm sys-btn-secondary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Preview Demo Workspace</span>
            </button>

            <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex items-start gap-2.5 text-xs text-[var(--sys-on-surface-secondary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)] shrink-0 mt-0.5" />
              <span>
                Google Drive tokens are held strictly in browser memory for your active session and never written to local storage.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
