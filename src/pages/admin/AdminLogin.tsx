import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabaseConfigStatus } from '../../lib/supabase';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { CrestLogo, IslamicStarIcon } from '../../components/IslamicPattern';

interface AdminLoginProps {
  onNavigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  const { login, resetPassword, user, role, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Password Reset view state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const configStatus = getSupabaseConfigStatus();

  // If already logged in with a valid role, forward to /admin
  useEffect(() => {
    if (user && role && !isLoading) {
      onNavigate('/admin');
    }
  }, [user, role, isLoading, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your institutional email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Login failed. Please verify your credentials.');
    } else {
      // Login succeeded
      onNavigate('/admin');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!resetEmail.trim()) {
      setResetError('Please enter your institutional email address.');
      return;
    }

    setResetSubmitting(true);
    const result = await resetPassword(resetEmail);
    setResetSubmitting(false);

    if (result.success) {
      setResetSuccess(true);
    } else {
      setResetError(result.error || 'Failed to dispatch password recovery email.');
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between selection:bg-forest selection:text-white">
      
      {/* Top Bar */}
      <header className="border-b border-forest/10 bg-white/70 backdrop-blur-md py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-charcoal hover:text-forest transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Portal</span>
          </button>

          <div className="flex items-center space-x-2 text-xs text-charcoal-muted">
            <span className="font-arabic text-sm text-forest" dir="rtl">
              بوابة الإدارة الأكاديمية
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Diagnostic Banner if Supabase connection has configuration issues */}
          {!configStatus.isConfigured && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Supabase Configuration Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {configStatus.error || 'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'}
              </p>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-forest/15 shadow-elevated p-8 sm:p-10 space-y-6 relative overflow-hidden">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-forest via-gold to-emerald-deep"></div>

            {/* Header / Department Identity */}
            <div className="text-center space-y-3">
              <div className="flex flex-col items-center justify-center space-y-2">
                <CrestLogo size={56} className="bg-white border-gold/60 shadow-md" />
                <img 
                  src="/dief-title.png" 
                  alt="Department of Islamic Economics and Finance" 
                  className="h-10 sm:h-12 w-auto object-contain mt-1"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-gold-dark uppercase font-sans">
                  Institutional CMS &amp; Back-Office
                </span>
                <h1 className="text-xl sm:text-2xl font-editorial font-bold text-forest tracking-tight mt-0.5">
                  Department Admin Login
                </h1>
                <p className="text-[11px] text-charcoal-light mt-1">
                  Under Kulliyya of Sharia, Darul Huda Islamic University
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest uppercase tracking-wider block">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@darulhudaiu.ac.in"
                    disabled={isSubmitting}
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-ivory/50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-forest focus:bg-white focus:outline-none transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                      setResetSuccess(false);
                      setResetError(null);
                    }}
                    className="text-[11px] text-gold-dark hover:text-forest font-semibold transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-ivory/50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-forest focus:bg-white focus:outline-none transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !configStatus.isConfigured}
                  className="w-full py-3.5 px-4 bg-forest hover:bg-emerald-deep text-white text-xs sm:text-sm font-bold rounded-xl shadow-elevated hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin Hub</span>
                      <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Notice: Public registration disabled */}
            <div className="pt-3 border-t border-gray-100 text-center space-y-1.5">
              <div className="inline-flex items-center space-x-1 text-[11px] text-charcoal-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                <span>Protected Role-Based Gateway</span>
              </div>
              <p className="text-[11px] text-charcoal-light leading-relaxed">
                Public registration is disabled. Administrative access accounts are provisioned exclusively by the Department Super Administrator.
              </p>
            </div>

          </div>

          {/* Quick Help Card */}
          <div className="bg-surface-lightGreen/60 rounded-2xl p-4 border border-forest/10 text-xs text-charcoal-muted flex items-start space-x-3">
            <KeyRound className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-forest block">Role-Based Clearance:</strong>
              Accounts are verified against the Supabase <code className="bg-white/80 px-1 py-0.2 rounded font-mono text-forest">admin_roles</code> database table. Unassigned users are denied access.
            </div>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-forest/20 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Account Recovery
                </span>
                <h3 className="font-editorial text-xl font-bold text-forest">
                  Reset Administrative Password
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-charcoal p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="space-y-1">
                  <div className="font-bold text-sm">Recovery Link Dispatched</div>
                  <p className="text-[11px] leading-relaxed">
                    If an administrative profile matches <span className="font-mono font-semibold">{resetEmail}</span>, a secure password reset link has been dispatched to your inbox.
                  </p>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Enter your registered institutional email address. You will receive an email containing a secure link to reset your administrative password.
                </p>

                {resetError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {resetError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-forest uppercase tracking-wider block">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@darulhudaiu.ac.in"
                    required
                    disabled={resetSubmitting}
                    className="w-full px-3.5 py-2.5 bg-ivory/60 border border-gray-200 rounded-xl text-xs focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetSubmitting}
                    className="flex-1 py-2.5 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                  >
                    {resetSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-charcoal-muted border-t border-forest/5">
        Department of Islamic Economics and Finance • Darul Huda Islamic University, Kerala
      </footer>

    </div>
  );
};
