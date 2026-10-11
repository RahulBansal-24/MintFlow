import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, DollarSign, Tag, Calendar, FileText } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { TransactionCategory, TransactionType } from '../engine/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, state } = useFinancial();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [type, setType] = useState<TransactionType>('expense');
  const [day, setDay] = useState<number>(state.cycle.currentDay);
  const [isEssential, setIsEssential] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    addTransaction({
      description,
      amount: Number(amount),
      category,
      type,
      date: `Day ${day}`,
      day,
      isEssential,
      notes: notes || undefined
    });

    onClose();
    // reset form
    setDescription('');
    setAmount('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#0D1220] to-[#080B12] border border-white/10 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-base font-heading font-bold text-white">Record Transaction</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg font-medium border transition-colors ${
                type === 'expense'
                  ? 'bg-coral/20 border-coral text-white font-semibold'
                  : 'bg-background-elevated border-white/10 text-slate-400'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg font-medium border transition-colors ${
                type === 'income'
                  ? 'bg-mint/20 border-mint text-white font-semibold'
                  : 'bg-background-elevated border-white/10 text-slate-400'
              }`}
            >
              Income (+)
            </button>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Campus Lunch, Books, Freelance Pay"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-mint"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="1"
                required
                placeholder="250"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-mint"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Day of Cycle</label>
              <input
                type="number"
                min="1"
                max="30"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-mint"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full bg-background-elevated border border-white/10 rounded-lg px-2.5 py-2 text-white capitalize focus:outline-none focus:border-mint"
              >
                <option value="food">Food & Dining</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="education">Education</option>
                <option value="bills">Bills</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Necessity</label>
              <button
                type="button"
                onClick={() => setIsEssential(!isEssential)}
                className={`w-full py-2 rounded-lg border font-medium transition-colors ${
                  isEssential ? 'bg-cyan/15 border-cyan text-cyan' : 'bg-background-elevated border-white/10 text-slate-400'
                }`}
              >
                {isEssential ? 'Essential Need' : 'Discretionary'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Optional Note</label>
            <input
              type="text"
              placeholder="Tag or location detail"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background-elevated border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-mint"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-mint hover:bg-mint/90 text-black font-semibold shadow-glow-mint transition-colors"
            >
              Save Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
