import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import confetti from 'canvas-confetti';
import { calculateHydrology } from '../../utils/hydrologicalEngine';
import { calculateFinancialAnalysis } from '../../services/financialApi';

const API_BASE = 'http://localhost:3001';

export default function Step4Report({ wizardData = {}, token, onReset }) {
  const [financialData, setFinancialData] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const area = wizardData.roofArea || 145;
  const rainfall = wizardData.annualRainfall || wizardData.rainfall || 950;
  const coeff = wizardData.runoffCoeff || 0.85;
  const members = wizardData.householdMembers || 4;
  const soil = wizardData.soilType || 'Loamy';

  const hydro = calculateHydrology(area, rainfall, coeff, members, soil);

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        const result = await calculateFinancialAnalysis({
          totalCost: hydro.pricing?.totalCost || 50000,
          harvestedWater: hydro.annualHarvest || 0,
          waterRate: hydro.financials?.waterRatePerLiter || 0.2
        });
        setFinancialData(result);
      } catch (error) {
        console.error('Financial API Error:', error);
      }
    }

    fetchFinancialData();
  }, [area, rainfall, coeff, members, soil, hydro.annualHarvest, hydro.pricing?.totalCost, hydro.financials?.waterRatePerLiter]);

  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const financialChartData = financialData?.chart_data?.labels?.map((month, index) => ({
    month: month.substring(0, 3),
    savings: financialData.chart_data.monthly_savings_inr?.[index] || 0
  })) || [];

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setPdfError('');

    try {
      const activeToken = token || localStorage.getItem('savjal_token');

      const response = await fetch(`${API_BASE}/api/report/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify(wizardData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SAVJAL_Municipal_Compliance_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('PDF Service API Call Failed, falling back to print window:', err.message);
      setPdfError(`Backend Service Notice: ${err.message}. Using browser print fallback.`);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Step 4: Financial ROI Analytics & Municipal PDF Blueprint</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete hydrological evaluation report, 12-month water balance chart, financial analytics, and downloadable PDF blueprint.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-500 hover:from-emerald-300 hover:to-sky-400 text-slate-950 font-extrabold text-xs tracking-wide uppercase shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Download className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Export PDF Blueprint'}</span>
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
          {pdfError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Annual Harvest Potential</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {(hydro.annualHarvest || 0).toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal"> L/yr</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-2 font-medium">100% Catchment Efficiency</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Annual Utility Bill Savings</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            ₹ {(financialData?.annual_savings ?? hydro.financials?.annualSavings ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-medium">Calculated by financial analytics service</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">System Payback Timeline</div>
          <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">
            {(financialData?.payback_period_years ?? hydro.financials?.paybackYears ?? 0)}
            <span className="text-xs text-slate-400 font-sans font-normal"> Years</span>
          </div>
          <div className="text-[10px] text-sky-400 mt-2 font-medium">ROI: {financialData?.roi_percent ?? 0}%</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Water Self-Sufficiency</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {hydro.selfSufficiencyPct || 0}%
          </div>
          <div className="text-[10px] text-amber-400 mt-2 font-medium">Annual Household Independence</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                12-Month Water Balance & Demand Forecasting
              </h3>
              <p className="text-[11px] text-slate-400">
                Monthly monsoon harvest volume vs household consumption (Liters)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
              Recharts Data Pipeline
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hydro.monthlyData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#F8FAFC'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="harvested" name="Harvested Rain (L)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demand" name="Household Demand (L)" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Financial Optimization Recommendations</span>
            </h3>

            <div className="space-y-3">
              {(financialData?.recommendations || hydro.aiRecommendations || []).map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug text-[11.5px]">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>SAVJAL Compliance</span>
            </div>
            <p className="text-[10.5px] opacity-80">
              Frontend app shell state ready. Seamlessly integrates with sizing, financial, GIS, and PDF services.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              12-Month Financial Savings Forecast
            </h3>
            <p className="text-[11px] text-slate-400">
              Estimated monthly utility bill savings generated from harvested rainwater
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Financial Analytics
          </span>
        </div>

        {financialChartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#F8FAFC'
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Estimated Savings']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="savings" name="Estimated Savings (₹)" fill="#10B981" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading financial analytics...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
