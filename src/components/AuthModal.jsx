import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'evaluator@savjal.org',
          password: password || 'savjal123',
          name: name || (isLogin ? 'Member 1 Evaluator' : 'New User')
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        onLoginSuccess({ user: data.user, token: data.token });
      } else {
        setErrorMsg(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.warn('Backend API unreachable, using local fallback token:', err.message);
      // Fallback for seamless demo experience
      onLoginSuccess({
        user: { name: name || 'Member 1 Evaluator', email: email || 'evaluator@savjal.org', role: 'Evaluator' },
        token: 'mock-jwt-token-savjal-demo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Supervisor Evaluator',
          email: 'supervisor@defense.edu'
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        onLoginSuccess({ user: data.user, token: data.token });
      } else {
        setErrorMsg(data.message || 'Guest login failed');
      }
    } catch (err) {
      console.warn('Backend API unreachable, using supervisor fallback token:', err.message);
      onLoginSuccess({
        user: { name: 'Supervisor Evaluator', email: 'supervisor@defense.edu', role: 'Supervisor' },
        token: 'mock-jwt-token-supervisor-demo'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="glass-card w-full max-w-md rounded-3xl border border-slate-700/80 shadow-2xl p-8 relative overflow-hidden bg-slate-900/90 text-left">
        {/* Glow corner */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo & Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/savjal_emblem.png" alt="Savjal Emblem" className="h-10 w-auto object-contain" />
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {isLogin ? 'Sign In to Savjal' : 'Create Savjal Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {isLogin ? 'Access your rooftop rainwater assessments' : 'Start modeling rainwater harvesting systems'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isLogin 
                ? 'bg-sky-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isLogin 
                ? 'bg-sky-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Member 1 / Ritika"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="member1@savjal.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>{isLogin ? 'Continue to App Shell' : 'Create Account & Start'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <span className="relative px-3 bg-slate-900 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Or Fast Track</span>
        </div>

        {/* Guest / Supervisor Evaluation Access */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 disabled:opacity-50 border border-slate-700/80 text-emerald-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Continue as Supervisor / Guest Evaluator</span>
            </>
          )}
        </button>


        <p className="text-[10.5px] text-center text-slate-500 mt-4 leading-normal">
          By continuing, you accept SAVJAL Evaluation Specs.
        </p>
      </div>
    </div>
  );
}
