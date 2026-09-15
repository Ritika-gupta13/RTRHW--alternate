import React from 'react';
import { ArrowRight, LogOut, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenAuth, onStartWizard, currentView, user, onLogout }) {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl glass-pill rounded-full px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/85 transition-all duration-300">
      {/* Brand Logo */}
      <div 
        onClick={() => onStartWizard('landing')}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <img 
          src="/savjal_emblem.png" 
          alt="Savjal Emblem" 
          className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
        />
        <span className="font-extrabold text-xl sm:text-2xl tracking-wide text-white drop-shadow-md">
          Savjal
        </span>
      </div>

      {/* Simplified Uniform Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider text-slate-200">
        <button 
          onClick={() => onStartWizard('landing')} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          Platform
        </button>

        <button 
          onClick={() => onStartWizard('wizard')} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          Live GIS Assessment
        </button>

        <a 
          href="#features" 
          className="hover:text-white transition-colors cursor-pointer"
        >
          Impact
        </a>

        <a 
          href="#features" 
          className="hover:text-white transition-colors cursor-pointer"
        >
          Sizing Engine
        </a>
      </div>

      {/* Action Buttons & Auth / Logout */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2.5">
            {/* User Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-sky-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[120px]">{user.name || 'Evaluator'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-950/50 hover:bg-red-900/70 border border-red-500/30 hover:border-red-500/60 text-red-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onOpenAuth()}
            className="text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Sign in
          </button>
        )}

        <button
          onClick={() => onStartWizard('wizard')}
          className="group relative flex items-center gap-2 px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-sky-500/30 transition-all transform hover:scale-105 cursor-pointer"
        >
          <span>Get started</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
}
