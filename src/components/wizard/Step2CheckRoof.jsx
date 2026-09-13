import React from 'react';
import { ShieldAlert, CloudRain, Users, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { calculateHydrology } from '../../utils/hydrologicalEngine';

export default function Step2CheckRoof({ wizardData, updateWizardData, onNext, onPrev }) {
  const roofMaterials = [
    { id: 'concrete', name: 'Reinforced Concrete Flat Slab', coeff: 0.85, desc: 'Popular smooth flat roof catchment surface' },
    { id: 'tile', name: 'Clay / Terracotta Tiles', coeff: 0.75, desc: 'Sloped tile roof with moderate absorption loss' },
    { id: 'metal', name: 'Corrugated Metal / Tin Sheet', coeff: 0.90, desc: 'High efficiency smooth hydrophobic runoff surface' }
  ];

  const soilTypes = [
    { id: 'Loamy', name: 'Loamy Soil', desc: 'Balanced percolation (10-50 mm/hr) — suitable for both tanks & recharge pits' },
    { id: 'Clayey', name: 'Clayey Soil', desc: 'Low percolation (<10 mm/hr) — ENFORCES Above-Ground Storage Tanks' },
    { id: 'Sandy', name: 'Sandy Soil', desc: 'High percolation (>50 mm/hr) — ideal for aquifer injection pits' }
  ];

  const currentArea = wizardData.roofArea || 145;
  const currentRainfall = wizardData.rainfall || 950;
  const currentCoeff = wizardData.runoffCoeff || 0.85;
  const currentSoil = wizardData.soilType || 'Loamy';
  const currentMembers = wizardData.householdMembers || 4;

  const hydro = calculateHydrology(currentArea, currentRainfall, currentCoeff, currentMembers, currentSoil);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Step Header */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <span>Step 2: Roof Surface Characteristics & GIS Soil Safety</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Specify roof material runoff coefficients and inspect geographic soil percolation safety rules.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-sky-300">
          Area: {currentArea} m²
        </div>
      </div>

      {/* Safety Alert Banner (GIS Member 4 Safety Engine Rule) */}
      {hydro.safetyAlert && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
          hydro.safetyAlert.type === 'warning'
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
        }`}>
          {hydro.safetyAlert.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
              GIS Safety Rule Enforced: {hydro.safetyAlert.title}
            </h4>
            <p className="text-xs opacity-90 leading-relaxed">
              {hydro.safetyAlert.message}
            </p>
          </div>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Roof Material Selector */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 mb-3">
              1. Select Roof Surface Catchment Material
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roofMaterials.map((mat) => {
                const isSelected = currentCoeff === mat.coeff;
                return (
                  <button
                    key={mat.id}
                    onClick={() => updateWizardData({ runoffCoeff: mat.coeff, roofMaterial: mat.name })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950/80 border-sky-400 shadow-lg shadow-sky-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{mat.name.split(' ')[0]}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 font-bold border border-sky-500/20">
                        C = {mat.coeff}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-tight">{mat.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Rainfall & Household Demand */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  Annual Rainfall (mm/year)
                </span>
                <span className="text-sky-400 font-mono font-bold">{currentRainfall} mm</span>
              </label>
              <input
                type="range"
                min="400"
                max="2500"
                step="25"
                value={currentRainfall}
                onChange={(e) => updateWizardData({ rainfall: Number(e.target.value) })}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>400 mm (Arid)</span>
                <span>950 mm (Jaipur Avg)</span>
                <span>2500 mm (Monsoon)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Household Occupants
                </span>
                <span className="text-emerald-400 font-mono font-bold">{currentMembers} Persons</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={currentMembers}
                onChange={(e) => updateWizardData({ householdMembers: Number(e.target.value) })}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1 Person</span>
                <span>4 (Std Family)</span>
                <span>12 Persons</span>
              </div>
            </div>
          </div>

          {/* 3. Soil Classification */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 mb-3">
              3. Soil Type & Infiltration Safety Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {soilTypes.map((soil) => {
                const isSelected = currentSoil === soil.id;
                return (
                  <button
                    key={soil.id}
                    onClick={() => updateWizardData({ soilType: soil.id })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? soil.id === 'Clayey'
                          ? 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-1">{soil.name}</div>
                    <p className="text-[10.5px] text-slate-400 leading-tight">{soil.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Hydrological Potential
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 font-semibold">
                Formula L/yr
              </span>
            </div>

            {/* Annual Harvest Calculation Box */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center mb-5">
              <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mb-1">
                Annual Water Harvest Potential
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {hydro.annualHarvest.toLocaleString()} <span className="text-sm text-slate-400 font-sans font-normal">Liters / year</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                {Math.round(hydro.annualHarvest / 365).toLocaleString()} L / day avg catchment
              </div>
            </div>

            {/* Self-Sufficiency Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 mb-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Water Self-Sufficiency</span>
                <span className="text-sky-400 font-mono">{hydro.selfSufficiencyPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${hydro.selfSufficiencyPct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">
                Fulfills {hydro.selfSufficiencyPct}% of total household demand ({hydro.annualDemand.toLocaleString()} L/yr).
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={onNext}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Sizing Engine</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
