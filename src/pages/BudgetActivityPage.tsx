import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Filter, 
  Search, 
  Trash2, 
  PieChart as PieIcon,
  Layers,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatINR } from '../engine/currency';
import { TransactionCategory, TransactionType } from '../engine/types';
import { AddTransactionModal } from '../components/AddTransactionModal';

export const BudgetActivityPage: React.FC = () => {
  const { state, metrics, deleteTransaction } = useFinancial();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');

  // Allocation bar percentages
  const pctSpent = Math.round((metrics.actualExpenses / metrics.totalFunds) * 100);
  const pctReserved = Math.round((metrics.unpaidReservedCommitments / metrics.totalFunds) * 100);
  const pctSaved = Math.round((metrics.unspentGoalAllocations / metrics.totalFunds) * 100);
  const pctFree = Math.max(0, 100 - pctSpent - pctReserved - pctSaved);

  const filteredTransactions = state.transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                        (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchType = selectedType === 'all' || t.type === selectedType;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Macro Budget Allocation Visualization */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] shadow-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-mint" />
              <h2 className="text-base font-heading font-bold text-white">
                30-Day ₹10,000 Budget Allocation Anatomy
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Distinguishing actual paid cash from earmarked commitments and flexible runway.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Total Capital:</span>
            <span className="text-base font-heading font-bold text-white ml-2 tabular-nums">
              {formatINR(metrics.totalFunds)}
            </span>
          </div>
        </div>

        {/* Stacked Allocation Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
            <div 
              style={{ width: `${pctSpent}%` }} 
              className="bg-coral h-full transition-all" 
              title={`Paid Expenses: ${formatINR(metrics.actualExpenses)} (${pctSpent}%)`} 
            />
            <div 
              style={{ width: `${pctReserved}%` }} 
              className="bg-cyan h-full transition-all" 
              title={`Reserved Bills: ${formatINR(metrics.unpaidReservedCommitments)} (${pctReserved}%)`} 
            />
            <div 
              style={{ width: `${pctSaved}%` }} 
              className="bg-lavender h-full transition-all" 
              title={`Savings Goals: ${formatINR(metrics.unspentGoalAllocations)} (${pctSaved}%)`} 
            />
            <div 
              style={{ width: `${pctFree}%` }} 
              className="bg-mint h-full transition-all" 
              title={`Uncommitted Cash: ${formatINR(metrics.uncommittedCash)} (${pctFree}%)`} 
            />
          </div>

          {/* Allocation Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-background-elevated/40 border border-coral/20">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-coral" />
                <span>Paid Out ({pctSpent}%)</span>
              </div>
              <div className="text-sm font-heading font-bold text-white mt-1 tabular-nums">
                {formatINR(metrics.actualExpenses)}
              </div>
              <span className="text-[10px] text-slate-400">Actual consumption</span>
            </div>

            <div className="p-2.5 rounded-xl bg-background-elevated/40 border border-cyan/20">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
                <span>Bills Reserved ({pctReserved}%)</span>
              </div>
              <div className="text-sm font-heading font-bold text-white mt-1 tabular-nums">
                {formatINR(metrics.unpaidReservedCommitments)}
              </div>
              <span className="text-[10px] text-slate-400">Earmarked upcoming</span>
            </div>

            <div className="p-2.5 rounded-xl bg-background-elevated/40 border border-lavender/20">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-lavender" />
                <span>Goals Locked ({pctSaved}%)</span>
              </div>
              <div className="text-sm font-heading font-bold text-white mt-1 tabular-nums">
                {formatINR(metrics.unspentGoalAllocations)}
              </div>
              <span className="text-[10px] text-slate-400">Target funds saved</span>
            </div>

            <div className="p-2.5 rounded-xl bg-background-elevated/40 border border-mint/20">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-mint" />
                <span>Free Runway ({pctFree}%)</span>
              </div>
              <div className="text-sm font-heading font-bold text-mint mt-1 tabular-nums">
                {formatINR(metrics.uncommittedCash)}
              </div>
              <span className="text-[10px] text-slate-400">Spendable with peace</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Transactions Ledger Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] shadow-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
          <div>
            <h3 className="text-base font-heading font-bold text-white">Transactions Ledger</h3>
            <p className="text-xs text-slate-400">
              Complete historical record of incoming and outgoing capital.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-mint text-black font-semibold text-xs hover:bg-mint/90 transition-all shadow-glow-mint"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Move</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by description or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background-elevated/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-mint placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-background-elevated border border-white/10 rounded-xl px-3 py-2 text-white capitalize focus:outline-none focus:border-mint"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="bills">Bills</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-background-elevated border border-white/10 rounded-xl px-3 py-2 text-white capitalize focus:outline-none focus:border-mint"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
            </select>
          </div>
        </div>

        {/* Table / List */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredTransactions.map((t) => {
            const isExpense = t.type === 'expense';
            return (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-background-elevated/50 border border-white/[0.04] hover:border-white/[0.1] flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    isExpense ? 'bg-coral/10 border-coral/20 text-coral' : 'bg-mint/10 border-mint/20 text-mint'
                  }`}>
                    {isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{t.description}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-white/[0.06] text-slate-300">
                        {t.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {t.date} • {t.isEssential ? 'Essential Need' : 'Discretionary'} {t.notes ? `• ${t.notes}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-heading font-bold tabular-nums ${
                    isExpense ? 'text-white' : 'text-mint'
                  }`}>
                    {isExpense ? '-' : '+'}{formatINR(t.amount)}
                  </span>

                  <button
                    type="button"
                    title="Delete record"
                    onClick={() => deleteTransaction(t.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-coral hover:bg-coral/15 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
