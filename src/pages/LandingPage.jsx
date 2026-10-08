import React from 'react';
import Navbar from '../components/Navbar';
import { ChevronDown } from 'lucide-react';

export default function LandingPage({ onOpenAuth, onStartWizard, user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950">
      {/* Floating Pill Navbar */}
      <Navbar onOpenAuth={onOpenAuth} onStartWizard={onStartWizard} currentView="landing" user={user} onLogout={onLogout} />

      {/* Hero Section with Bright Visible Rainwater Harvesting Background */}
      <section className="relative min-h-screen pt-32 pb-16 px-6 flex flex-col items-center justify-center text-center my-auto">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/rainwater_system.jpg"
            alt="Rainwater Harvesting System Background"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/25 to-slate-950/90"></div>
        </div>

        
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center space-y-8 my-auto">
          {/* Pure White Bold Hero Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-2xl">
            Smart Rooftop Rainwater <br className="hidden sm:inline" />
            Harvesting & Filtration
          </h1>

          
          <p className="text-base sm:text-xl text-slate-100 max-w-3xl leading-relaxed font-medium drop-shadow-md">
            An AI-powered rooftop catchment assessment, multi-stage filtration sizing, and aquifer storage calculator designed to harvest every drop of rain.
          </p>

          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartWizard('wizard')}
              className="glass-card hover:bg-slate-900/90 text-white font-bold text-sm px-7 py-4 rounded-full border border-white/30 transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md shadow-lg"
            >
              <span>Start Rooftop Analysis</span>
            </button>
          </div>

          
          <div className="pt-16 text-xs font-mono tracking-widest text-slate-300 uppercase flex flex-col items-center gap-2 drop-shadow">
            <span>Scroll for feature breakdown</span>
            <ChevronDown className="w-4 h-4 text-sky-400 animate-bounce" />
          </div>
        </div>
      </section>

      
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900 relative z-10 bg-slate-950">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
            SAVJAL SYSTEM FEATURES
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            Single-Page 4-Step Horizontal Wizard
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-left space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-white flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="text-base font-extrabold text-white">Map Polygon Canvas</h4>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-left space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-white flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="text-base font-extrabold text-white">Roof & Soil Rules</h4>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-left space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-white flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="text-base font-extrabold text-white">System Sizing Engine</h4>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-left space-y-3 glass-card-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-white flex items-center justify-center font-bold">
              04
            </div>
            <h4 className="text-base font-extrabold text-white">ROI & PDF Blueprint</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
