import React from 'react';
import { Map, ShieldAlert, Cpu, FileText, CheckCircle2 } from 'lucide-react';

export default function WizardHeader({ currentStep, setStep }) {
  const steps = [
    { id: 1, name: 'Find House', icon: Map, desc: 'Map Polygon Drawing' },
    { id: 2, name: 'Check Roof', icon: ShieldAlert, desc: 'Roof & Soil Safety' },
    { id: 3, name: 'Setup & Sizing', icon: Cpu, desc: 'Tank & Pipe Engine' },
    { id: 4, name: 'Report & ROI', icon: FileText, desc: 'Financial Analytics' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setStep(step.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-gradient-to-r from-sky-950/80 to-slate-900 border-sky-500/80 shadow-lg shadow-sky-500/10'
                  : isCompleted
                  ? 'bg-slate-950/60 border-emerald-500/40 opacity-90 hover:opacity-100'
                  : 'bg-slate-950/30 border-slate-800 opacity-50 hover:opacity-75'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                    : isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                    Step 0{step.id}
                  </span>
                </div>
                <div
                  className={`text-xs font-bold truncate ${
                    isActive ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-400'
                  }`}
                >
                  {step.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{step.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
