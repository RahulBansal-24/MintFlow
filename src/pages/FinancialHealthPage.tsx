import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  HelpCircle, 
  Sparkles, 
  Compass, 
  Layers 
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';

export const FinancialHealthPage: React.FC = () => {
  const { metrics, forecastData, state } = useFinancial();
  const { riskAssessment } = metrics;
  const [activeStrategyIndex, setActiveStrategyIndex] = useState(0);

  const levelColor = {
    Stable: 'text-mint border-mint/30 bg-mint/10',
    Watchful: 'text-cyan border-cyan/30 bg-cyan/10',
    Elevated: 'text-amber border-amber/30 bg-amber/10',
    Critical: 'text-coral border-coral/30 bg-coral/10'
  }[riskAssessment.level];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Health Score & Risk Level Diagnostics Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D1220] via-[#111827] to-[#0A0E17] border border-white/[0.08] shadow-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-lavender/15 border border-lavender/25 text-lavender shadow-glow-lavender">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-bold text-white">
                  Financial Health & Risk Diagnostic
                </h2>
                <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold ${levelColor}`}>
                  {riskAssessment.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent 0–100 weighted index based on discipline, coverage, savings, runway, and resilience.
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 bg-background-elevated/70 px-4 py-2 rounded-xl border border-white/[0.05]">
            <span className="text-3xl font-heading font-bold text-white tabular-nums">
              {riskAssessment.score}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 100 Overall Score</span>
          </div>
        </div>

        {/* 5 Weighted Component Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {riskAssessment.factors.map((f, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-background-elevated/50 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">{f.factor}</span>
                <span className="text-[9px] font-mono text-slate-500">{f.weight}%</span>
              </div>
              <div className={`text-xs font-semibold ${
                f.impact === 'positive' ? 'text-mint' : f.impact === 'negative' ? 'text-coral' : 'text-slate-300'
              }`}>
                {f.impact === 'positive' ? 'Healthy' : f.impact === 'negative' ? 'Pinch Alert' : 'Neutral'}
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2">
                {f.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Multi-Scenario 30-Day Forecast Smooth Area Chart */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] shadow-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan" />
              <h3 className="text-base font-heading font-bold text-white">
                Month-End Projected Cash Balance (Days 1–30)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical actuals (Days 1–7) seamlessly leading into three deterministic forward trajectories.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-mint">
              <span className="w-2.5 h-2.5 rounded-full bg-mint" />
              <span>Optimistic</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
              <span>Expected Pace</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber">
              <span className="w-2.5 h-2.5 rounded-full bg-amber" />
              <span>Conservative</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData.chartPoints}>
              <defs>
                <linearGradient id="gradOptimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#65F5B4" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#65F5B4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#55DDF5" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#55DDF5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradConservative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC66D" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#FFC66D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis 
                dataKey="dayLabel" 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background-elevated border border-white/10 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                        <div className="font-heading font-bold text-white">{label} {data.eventLabel ? `• ${data.eventLabel}` : ''}</div>
                        <div className="text-mint font-mono">Optimistic: {formatINR(data.optimisticBalance)}</div>
                        <div className="text-cyan font-mono">Expected: {formatINR(data.expectedBalance)}</div>
                        <div className="text-amber font-mono">Conservative: {formatINR(data.conservativeBalance)}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {data.isHistorical ? 'Recorded History' : 'Forward Projection'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="optimisticBalance" 
                stroke="#65F5B4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#gradOptimistic)" 
              />
              <Area 
                type="monotone" 
                dataKey="expectedBalance" 
                stroke="#55DDF5" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#gradExpected)" 
              />
              <Area 
                type="monotone" 
                dataKey="conservativeBalance" 
                stroke="#FFC66D" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#gradConservative)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Three Strategy Comparison Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider font-mono">
          Compare Spending Strategies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {forecastData.strategies.map((strat, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border ${
                idx === activeStrategyIndex ? 'border-mint shadow-glow-mint' : 'border-white/[0.08]'
              } shadow-glass space-y-3 cursor-pointer transition-all`}
              onClick={() => setActiveStrategyIndex(idx)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold" style={{ color: strat.color }}>
                  {strat.tagline}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                  Strategy {idx + 1}
                </span>
              </div>

              <h4 className="text-base font-heading font-bold text-white">{strat.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {strat.description}
              </p>

              <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Day 30 Balance</span>
                  <span className="text-base font-heading font-bold text-white tabular-nums">
                    {formatINR(strat.endBalance)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Daily Allowance</span>
                  <span className="text-base font-heading font-bold text-mint tabular-nums">
                    ₹{strat.dailyAllowance}/d
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
