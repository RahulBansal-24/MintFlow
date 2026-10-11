import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, X, Shield, Sliders, Zap, Wallet } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      icon: <Wallet className="w-8 h-8 text-mint" />,
      tag: 'Step 1 of 4',
      title: 'Your ₹10,000 Monthly Budget',
      description: 'You are currently on Day 8 of your 30-day cycle. You have ₹8,561 in hand, but not all of it is spendable right away. We ring-fence upcoming commitments so you never face a mid-month cash crunch.',
      badge: '₹10,000 Baseline'
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan" />,
      tag: 'Step 2 of 4',
      title: 'Daily Safe Allowance: ₹218/day',
      description: 'Instead of guessing what you can spend, MINTFLOW dynamically computes your daily flexible allowance across the remaining 23 days after reserving your scheduled bills and savings goals.',
      badge: 'Deterministic Math'
    },
    {
      icon: <Sliders className="w-8 h-8 text-lavender" />,
      tag: 'Step 3 of 4',
      title: 'Test Before You Spend',
      description: 'Every financial move has an interconnected domino effect. Use the Spend Simulator to test purchases, subscriptions, or emergency expenses in an isolated sandbox with instant verdicts and smart alternatives.',
      badge: 'Zero Regrets'
    },
    {
      icon: <Shield className="w-8 h-8 text-amber" />,
      tag: 'Step 4 of 4',
      title: 'Financial Health & Risk Engine',
      description: 'Track your transparent 0–100 Health Score, forecast Day 30 trajectories under different spending strategies, and catch hidden subscription leakage before it drains your budget.',
      badge: 'Gen Z Financial Peace'
    }
  ];

  const current = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#0D1220] to-[#080B12] border border-white/10 p-6 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <span className="text-[11px] font-mono uppercase text-mint font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-mint" />
            <span>Welcome to MINTFLOW</span>
          </span>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Skip Tour
          </button>
        </div>

        <div className="text-center py-4 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-background-elevated/80 border border-white/10 flex items-center justify-center shadow-glass">
            {current.icon}
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 font-medium">
              {current.badge}
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-2">
              {current.title}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
              {current.description}
            </p>
          </div>
        </div>

        {/* Step dots & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === step ? 'w-6 bg-mint' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mint text-black font-semibold text-xs hover:bg-mint/90 transition-all shadow-glow-mint"
          >
            <span>{step === slides.length - 1 ? "Let's Get Started" : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
