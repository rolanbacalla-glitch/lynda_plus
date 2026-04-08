import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProvider, setSimulatedProvider] = useState<'google' | 'facebook' | 'apple' | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (message: string) => {
    if (message.includes('auth/api-key-not-valid') || message.includes('API key not valid')) {
      return "The connection to our secure server is currently paused for this demo. Please use the 'Demo' button or social login to proceed.";
    }
    if (message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
      return "Invalid email or password. Please try again or use the Demo account.";
    }
    return message || "Something went wrong. Please try again or use the Demo button.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Check your credentials.';
      setError(getFriendlyErrorMessage(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setError('');
      
      // If no API key is present, provide a premium simulated login experience
      if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        setSimulatedProvider(provider);
        setIsSimulating(true);
        // Add a slight delay to allow the beautiful animation to shine
        await new Promise(resolve => setTimeout(resolve, 1800));
        await auth.loginAsDemo();
        navigate('/dashboard');
        return;
      }

      setLoading(true);
      const { signInWithGoogle, signInWithFacebook, signInWithApple } = auth;
      if (provider === 'google') await signInWithGoogle();
      if (provider === 'facebook') await signInWithFacebook();
      if (provider === 'apple') await signInWithApple();
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(getFriendlyErrorMessage(errorMessage));
    } finally {
      if (!isSimulating) setLoading(false);
    }
  };

  const auth = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6 font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse delay-700" />
      
      <div className="w-full max-w-[480px] relative z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 no-underline group mb-6">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-brand-500/30 group-hover:rotate-12 transition-transform">
              <span className="font-bold text-xl">L+</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Lynda<span className="text-brand-500">Plus</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">Welcome back</h1>
          <p className="text-slate-500 font-medium mt-2">Enter your credentials to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="glass p-10 md:p-12 rounded-[40px] border border-white/40 shadow-premium bg-white/60 backdrop-blur-2xl">
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[11px] font-bold uppercase tracking-tight">
              <span className="material-symbols-rounded text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-lg">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/70 border border-slate-100 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-medium text-slate-700"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest no-underline">Forgot?</a>
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-lg">lock</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/70 border border-slate-100 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-medium text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-700 active:scale-[0.98] transition-all shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <span className="material-symbols-rounded text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    await auth.loginAsDemo();
                    navigate('/dashboard');
                  } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    setError(getFriendlyErrorMessage(errorMessage));
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full h-14 bg-white/40 border border-brand-200 text-brand-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-50 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-rounded text-lg">person_check</span>
                Demo Access
              </button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
              <span className="px-4 bg-[#FDFCFF] text-slate-400 rounded-full">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="flex items-center justify-center h-14 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="Sign in with Google"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            </button>
            <button 
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="flex items-center justify-center h-14 rounded-2xl bg-black hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="Sign in with Apple"
            >
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5 h-5 invert" alt="Apple" />
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="flex items-center justify-center h-14 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="Sign in with Facebook"
            >
                <svg fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100/50">
            <p className="text-center text-sm text-slate-500 font-medium">
              Don't have an account? <Link to="#" className="text-brand-600 font-bold hover:underline">Start free trial</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Premium Simulated Authentication Overlay */}
      {isSimulating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-3xl animate-fade-in">
          <div className="w-full max-w-sm p-8 text-center">
            <div className="relative mb-10 inline-block">
              <div className="absolute inset-0 bg-brand-500/20 blur-[40px] animate-pulse-brand rounded-full" />
              <div className="relative w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center animate-pulse-brand ring-1 ring-white/50">
                {simulatedProvider === 'google' && (
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-10 h-10" alt="Google" />
                )}
                {simulatedProvider === 'apple' && (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-10 h-10" alt="Apple" />
                )}
                {simulatedProvider === 'facebook' && (
                  <svg fill="#1877F2" viewBox="0 0 24 24" className="w-12 h-12">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Connecting as Jason
            </h3>
            <p className="text-slate-200/70 text-sm font-medium mb-8">
              Securely handshaking with {simulatedProvider === 'google' ? 'Google' : simulatedProvider === 'apple' ? 'Apple' : 'Facebook'}...
            </p>
            
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-400 rounded-full"
                style={{ 
                  animation: 'progress-loading 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards' 
                }}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <span className="material-symbols-rounded text-xs animate-spin">sync</span>
              Encrypted Session Initializing
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
