import React from 'react';
import { Sun, CloudRain, Wind, Droplets, ShieldCheck } from 'lucide-react';

export default function WeatherWidget({ location = 'JAIPUR LIVE', rainfall = '950 mm/yr' }) {
  return (
    <div className="glass-card rounded-2xl p-4 w-72 text-left border border-slate-700/80 shadow-2xl backdrop-blur-xl bg-slate-900/80 relative overflow-hidden group hover:border-sky-500/40 transition-all">
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all"></div>

      {/* Location header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">
            {location}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Mock GIS</span>
      </div>

      {/* Main weather summary */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            32°
          </div>
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5">
            <span>Mainly Clear</span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
          <Sun className="w-6 h-6 stroke-[1.8]" />
        </div>
      </div>

      {/* Stats breakdown */}
      <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center mb-3">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
            <CloudRain className="w-2.5 h-2.5 text-sky-400" />
            Cloud
          </div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">25%</div>
        </div>

        <div className="border-x border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
            <Wind className="w-2.5 h-2.5 text-emerald-400" />
            Wind
          </div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">15 km/h</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
            <Droplets className="w-2.5 h-2.5 text-blue-400" />
            Humid
          </div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">45%</div>
        </div>
      </div>

      {/* AI Readiness status bar */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="leading-tight text-[10.5px]">
          AI: Monsoon optimal — catchment nominal
        </span>
      </div>
    </div>
  );
}
