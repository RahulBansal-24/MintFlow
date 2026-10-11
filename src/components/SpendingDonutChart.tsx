import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { TransactionCategory } from '../engine/types';
import { formatINR } from '../engine/currency';

interface SpendingDonutChartProps {
  onSelectCategory?: (category: TransactionCategory) => void;
}

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  food: '#65F5B4',
  transport: '#55DDF5',
  shopping: '#FFC66D',
  entertainment: '#A89BFA',
  education: '#38BDF8',
  bills: '#F472B6',
  health: '#FF777D',
  other: '#94A3B8'
};

export const SpendingDonutChart: React.FC<SpendingDonutChartProps> = ({ onSelectCategory }) => {
  const { metrics } = useFinancial();

  const data = Object.entries(metrics.categoryBreakdown)
    .filter(([_, item]) => item.amount > 0)
    .map(([cat, item]) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      category: cat as TransactionCategory,
      value: item.amount,
      percentage: item.percentage,
      color: CATEGORY_COLORS[cat as TransactionCategory] || '#94A3B8'
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-5 shadow-glass flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-mint/10 border border-mint/20 text-mint">
            <PieIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Category Breakdown</span>
        </div>
        <span className="text-xs font-mono text-slate-400">Total: {formatINR(metrics.actualExpenses)}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
        {/* Donut Chart */}
        <div className="sm:col-span-6 h-48 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="rgba(13, 18, 32, 0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-background-elevated border border-white/10 px-2.5 py-1.5 rounded-lg shadow-xl text-xs">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-mint font-mono">{formatINR(item.value)} ({item.percentage}%)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Spent</span>
            <span className="text-base font-heading font-bold text-white tabular-nums">
              {formatINR(metrics.actualExpenses)}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="sm:col-span-6 space-y-2">
          {data.slice(0, 4).map((entry) => (
            <button
              key={entry.category}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(entry.category)}
              className="w-full flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors group text-left"
            >
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-slate-300 group-hover:text-white transition-colors">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400 text-[11px]">{entry.percentage}%</span>
                <span className="font-semibold text-white">{formatINR(entry.value)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
