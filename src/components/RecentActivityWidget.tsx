import React, { useState } from 'react';
import { History, Plus, Trash2, Search, ArrowDownRight, ArrowUpRight, Filter } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { TransactionCategory } from '../engine/types';
import { formatINR } from '../engine/currency';

interface RecentActivityWidgetProps {
  onOpenAddModal?: () => void;
  selectedCategoryFilter?: TransactionCategory | 'all';
  onFilterChange?: (cat: TransactionCategory | 'all') => void;
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ 
  onOpenAddModal,
  selectedCategoryFilter = 'all',
  onFilterChange 
}) => {
  const { state, deleteTransaction } = useFinancial();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TransactionCategory | 'all'>(selectedCategoryFilter);

  const activeFilter = onFilterChange ? selectedCategoryFilter : filter;
  const setActualFilter = (val: TransactionCategory | 'all') => {
    if (onFilterChange) onFilterChange(val);
    else setFilter(val);
  };

  const filtered = state.transactions
    .filter(t => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                          (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
      const matchCat = activeFilter === 'all' || t.category === activeFilter;
      return matchSearch && matchCat;
    });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1220] to-[#111827] border border-white/[0.08] p-5 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-mint/10 border border-mint/20 text-mint">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Activity & Records</span>
            <div className="text-[11px] text-slate-500 font-sans">{state.transactions.length} total entries recorded</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background-elevated/70 border border-white/10 rounded-lg pl-7 pr-2.5 py-1 text-xs text-white focus:outline-none focus:border-mint placeholder-slate-500 w-36 sm:w-44"
            />
          </div>

          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mint text-black font-semibold text-xs hover:bg-mint/90 transition-colors shadow-glow-mint"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {(['all', 'food', 'transport', 'shopping', 'entertainment', 'bills', 'education'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActualFilter(cat)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono capitalize whitespace-nowrap transition-colors ${
              activeFilter === cat 
                ? 'bg-mint text-black font-bold' 
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.05]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transactions Feed */}
      <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No transactions match your search or filter.
          </div>
        ) : (
          filtered.map((t) => {
            const isExpense = t.type === 'expense';
            return (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-background-elevated/50 border border-white/[0.04] hover:border-white/[0.1] flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${
                    isExpense 
                      ? 'bg-coral/10 border-coral/20 text-coral' 
                      : 'bg-mint/10 border-mint/20 text-mint'
                  }`}>
                    {isExpense ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{t.description}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-white/[0.05] text-slate-400">
                        {t.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {t.date} • {t.isEssential ? 'Essential' : 'Discretionary'} {t.notes ? `• ${t.notes}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-heading font-bold tabular-nums ${
                    isExpense ? 'text-slate-100' : 'text-mint'
                  }`}>
                    {isExpense ? '-' : '+'}{formatINR(t.amount)}
                  </span>

                  <button
                    type="button"
                    title="Delete record"
                    onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-coral/20 hover:text-coral text-slate-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
