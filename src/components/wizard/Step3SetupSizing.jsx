import React from 'react';
import { Cpu, ArrowRight, ArrowLeft, CheckCircle2, DollarSign, Layers, Wrench, Cylinder } from 'lucide-react';
import { calculateHydrology } from '../../utils/hydrologicalEngine';

export default function Step3SetupSizing({ wizardData, updateWizardData, onNext, onPrev }) {
  const hydro = calculateHydrology(
    wizardData.roofArea,
    wizardData.rainfall,
    wizardData.runoffCoeff,
    wizardData.householdMembers,
    wizardData.soilType
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <span>Step 3: System Sizing Engine & Itemized Cost Breakdown</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Optimal storage tank capacity, filter cylinder specs, downpipe sizing, and itemized pricing.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
          Target Storage: {hydro.tankCapacity.toLocaleString()} L
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: System Sizing & Visual Showcase */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Visual Card with uploaded Rainwater Harvesting Photo */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden bg-slate-900/90">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
                <img
                  src="/rainwater_system.jpg"
                  alt="Rainwater Harvesting System Setup"
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 uppercase tracking-wider">
                    Target Setup
                  </span>
                  <span className="text-[10px] font-mono text-sky-300 font-semibold bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700">
                    Multi-Stage Filter System
                  </span>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Cylinder className="w-4 h-4 text-sky-400" />
                  Recommended System Specs
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Poly Tank Capacity:</span>
                    <span className="font-mono font-bold text-sky-300">{hydro.tankCapacity.toLocaleString()} Liters</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Filter Cylinder:</span>
                    <span className="font-mono font-bold text-emerald-300">Gravel + Sand + Charcoal</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">PVC Downpipe Size:</span>
                    <span className="font-mono font-bold text-slate-200">{hydro.downpipeDiameter}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Gutters:</span>
                    <span className="font-mono font-bold text-slate-200">{hydro.gutterLength} meters</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Recharge Pit Size:</span>
                    <span className="font-mono font-bold text-amber-300">{hydro.pitDimensions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Component Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-sky-400 font-bold uppercase mb-1">Catchment Pipe</div>
              <div className="text-sm font-extrabold text-white">{hydro.downpipeDiameter}</div>
              <p className="text-[10.5px] text-slate-400 mt-1">Handles peak monsoon flow without back-pressure overflow.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase mb-1">Filtration Unit</div>
              <div className="text-sm font-extrabold text-white">Dual-Chamber Media</div>
              <p className="text-[10.5px] text-slate-400 mt-1">Removes debris, silt, and heavy particulate matter.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-amber-400 font-bold uppercase mb-1">Aquifer Pit</div>
              <div className="text-sm font-extrabold text-white">{hydro.pitVolumeM3} m³ Recharge</div>
              <p className="text-[10.5px] text-slate-400 mt-1">Pumps clean excess runoff directly to groundwater table.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Itemized Costing Table (Member 2 Deliverable) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                Itemized Cost Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                Member 2 API
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Polyethylene Tank ({hydro.tankCapacity}L)</span>
                <span className="font-mono font-bold text-white">₹ {hydro.pricing.tankCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Multi-Stage Charcoal Filter</span>
                <span className="font-mono font-bold text-white">₹ {hydro.pricing.filterCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                <span className="text-slate-300">PVC Pipes & Gutters ({hydro.gutterLength}m)</span>
                <span className="font-mono font-bold text-white">₹ {hydro.pricing.pipingCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Pit Excavation & Gravel Liner</span>
                <span className="font-mono font-bold text-white">₹ {hydro.pricing.excavationCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Labor & Plumbing Installation</span>
                <span className="font-mono font-bold text-white">₹ {hydro.pricing.laborCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Total Cost Display Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Total Estimated Turnkey Cost
              </div>
              <div className="text-3xl font-extrabold text-sky-400 font-mono tracking-tight mt-1">
                ₹ {hydro.pricing.totalCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">
                Includes 1-Year Maintenance & Warranty
              </div>
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
              <span>View ROI & Report</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
