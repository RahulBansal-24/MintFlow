import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, RefreshCw, CheckCircle2, ShieldCheck, Compass, Info } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { setExperienceChosen, ProfileMode } from '../engine/storage';

interface ExperienceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExperienceSelectorModal: React.FC<ExperienceSelectorModalProps> = ({ isOpen, onClose }) => {
  const { switchProfileMode } = useFinancial();

  if (!isOpen) return null;

  const handleSelect = (mode: ProfileMode) => {
    switchProfileMode(mode);
    setExperienceChosen(true);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="mode-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0D1220] to-[#080B12] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 select-none"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-mint text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MINTFLOW • Choose Your Starting Mode</span>
          </div>
          <h2 id="mode-modal-title" className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            How would you like to begin?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Choose a starting mode. You can switch between demo data and a fresh clean slate at any time.
          </p>
        </div>

        {/* 2 Options Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* OPTION 1: Explore Demo (Recommended) */}
          <div 
            role="button"
            tabIndex={0}
            onClick={() => handleSelect('demo')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect('demo'); } }}
            aria-label="Explore Demo Mode: Day 8 of 30 seeded scenario"
            className="relative p-5 rounded-2xl bg-gradient-to-b from-mint/10 via-[#111827] to-[#0D1220] border-2 border-mint/50 hover:border-mint focus:outline-none focus:ring-2 focus:ring-mint shadow-glow-mint flex flex-col justify-between gap-4 cursor-pointer group transition-all transform hover:-translate-y-1"
          >
            {/* Recommended Pill */}
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-mint text-black font-heading font-bold text-[10px] tracking-wider uppercase shadow-md">
              Recommended for Hackathons
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-mint/20 border border-mint/40 flex items-center justify-center text-mint">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-mint transition-colors">
                    Explore Demo
                  </h3>
                  <span className="text-[11px] font-mono text-mint">Day 8 of 30 • Seeded Scenario</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Loads a realistic, mathematically consistent Gen Z college scenario with ₹1,439 in past food & metro records, upcoming hostel bills, and ₹2,200 locked in savings goals.
              </p>

              <div className="space-y-1.5 pt-1 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint shrink-0" />
                  <span>₹8,561 in hand • ₹218/day safe allowance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint shrink-0" />
                  <span>₹1,338 reserved bills (Hostel, Jio, YouTube)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint shrink-0" />
                  <span>Instant decision testing & scenario lab</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-mint">
              <span>Launch Demo Profile</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OPTION 2: Start Fresh */}
          <div 
            role="button"
            tabIndex={0}
            onClick={() => handleSelect('fresh')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect('fresh'); } }}
            aria-label="Start Fresh Mode: Day 1 of 30 clean slate with 10,000 rupee budget"
            className="relative p-5 rounded-2xl bg-gradient-to-b from-cyan/5 via-[#111827] to-[#0D1220] border border-white/15 hover:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan flex flex-col justify-between gap-4 cursor-pointer group transition-all transform hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan/20 border border-cyan/40 flex items-center justify-center text-cyan">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan transition-colors">
                    Start Fresh
                  </h3>
                  <span className="text-[11px] font-mono text-cyan">Day 1 of 30 • Clean Slate</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Begin on Day 1 with your full ₹10,000 starting budget, 0 past transactions, and an open runway to track your own real-world financial moves.
              </p>

              <div className="space-y-1.5 pt-1 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan shrink-0" />
                  <span>Full ₹10,000 available & uncommitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan shrink-0" />
                  <span>₹333/day baseline allowance over 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan shrink-0" />
                  <span>Create custom transactions & commitments</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-cyan">
              <span>Start With ₹10k Clean Slate</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Informational Disclaimer Footer */}
        <div className="p-3 rounded-xl bg-background-elevated/40 border border-white/[0.04] text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Demo records are labeled as simulated sample data. You can switch between demo and clean slate at any time from the sidebar.
          </span>
        </div>
      </motion.div>
    </div>
  );
};
