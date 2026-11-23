import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, ArrowLeft, Moon, Sun, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (message: string) => {
    if (message.includes('auth/api-key-not-valid') || message.includes('API key not valid')) {
      return 'Live authentication is paused in this preview environment. Use Instant Demo Access below to enter the workspace.';
    }
    if (message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
      return 'Invalid email or password. Try again or use Instant Demo Access.';
    }
    return message || 'Unable to sign in. Please try again or use Instant Demo Access.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        await auth.loginAsDemo();
        navigate('/dashboard');
        return;
      }
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Check your credentials.';
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
              Sign in to your workspace
            </h1>
            <p className="text-sm text-[var(--sys-on-surface-secondary)]">
              Access active studies, participant panels, and synthesis reports.
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

            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full min-h-[44px] px-5 py-3 text-sm sys-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enter Demo Workspace Instantly</span>
            </button>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-[var(--sys-outline-variant)]" />
              <span className="px-3 text-xs text-[var(--sys-on-surface-tertiary)]">
                or sign in with work email
              </span>
              <div className="flex-1 border-t border-[var(--sys-outline-variant)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
                >
                  Work Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm sys-input"
                  placeholder="researcher@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm sys-input"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] px-5 py-2.5 text-sm sys-btn-secondary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In with Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
