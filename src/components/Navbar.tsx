import React, { useState } from 'react';
import { 
  Bell, 
  Sparkles, 
  Sliders, 
  Menu, 
  X, 
  Undo2
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { NavigationPage } from './Sidebar';
import { formatINR } from '../engine/currency';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenDemoModal: () => void;
  onOpenSimulatorModal: () => void;
  onOpenExperienceSelector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenDemoModal,
  onOpenSimulatorModal,
  onOpenExperienceSelector
}) => {
  const { state, metrics, canUndo, undoLastAction, profileMode } = useFinancial();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const upcomingBills = state.commitments.filter(c => c.status === 'upcoming');

  const pageTitles: Record<NavigationPage, string> = {
    overview: 'Financial Command Center',
    simulator: 'Spend Simulator & Decision Lab',
    budget: 'Budget Allocation & Records',
    goals: 'Savings Goals & Milestones',
    commitments: 'Fixed Commitments & Subscriptions',
    health: 'Financial Health & Risk Forecast'
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080B12]/85 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 py-3 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-background-card border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-heading font-bold text-white tracking-wide">
                {pageTitles[currentPage]}
              </h1>
              {/* Profile Mode Pill */}
              <button
                type="button"
                onClick={onOpenExperienceSelector}
                className={`px-2 py-0.5 rounded-full border text-[10px] font-mono transition-colors ${
                  profileMode === 'demo'
                    ? 'bg-amber/10 border-amber/30 text-amber hover:bg-amber/20'
                    : 'bg-mint/10 border-mint/30 text-mint hover:bg-mint/20'
                }`}
                title="Click to switch starting profile"
              >
                {profileMode === 'demo' ? 'Demo Mode (Day 8 Seed)' : 'Clean Slate (Day 1)'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Day {state.cycle.currentDay} of 30 • {metrics.remainingDays} days remaining in cycle
            </p>
          </div>
        </div>

        {/* Right: Quick Action CTAs & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Undo Action Button */}
          {canUndo && (
            <button
              type="button"
              onClick={undoLastAction}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 font-mono transition-colors"
              title="Undo last action"
            >
              <Undo2 className="w-3.5 h-3.5 text-mint" />
              <span className="hidden md:inline">Undo</span>
            </button>
          )}

          {/* Quick Metrics Chips */}
          <div className="hidden md:flex items-center gap-2">
            <div className="px-3 py-1 rounded-xl bg-background-card border border-white/[0.06] text-xs">
              <span className="text-slate-400 font-mono text-[10px] block">Safe Allowance</span>
              <span className="font-heading font-bold text-mint tabular-nums">
                ₹{Math.round(metrics.dailyAllowance)}/d
              </span>
            </div>

            <div className="px-3 py-1 rounded-xl bg-background-card border border-white/[0.06] text-xs">
              <span className="text-slate-400 font-mono text-[10px] block">Health Index</span>
              <span className="font-heading font-bold text-lavender tabular-nums">
                {metrics.healthScore}/100
              </span>
            </div>
          </div>

          {/* Quick Simulate CTA */}
          <button
            type="button"
            onClick={onOpenSimulatorModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mint hover:bg-mint/90 text-black font-semibold text-xs transition-all shadow-glow-mint"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Move</span>
          </button>

          {/* Hackathon Demo Button */}
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-medium text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            <span>Demo Scenarios</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="View commitment notifications"
              aria-expanded={notificationsOpen}
              className="relative p-2 rounded-xl bg-background-card border border-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-mint"
            >
              <Bell className="w-4 h-4" />
              {upcomingBills.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral animate-ping" />
              )}
            </button>

            {/* Notification Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-background-elevated border border-white/10 p-3 shadow-2xl space-y-2 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] font-semibold text-white">
                  <span>Commitment Alerts</span>
                  <span className="text-[10px] font-mono text-cyan">{upcomingBills.length} Upcoming</span>
                </div>
                {upcomingBills.length === 0 ? (
                  <div className="py-3 text-center text-slate-400 text-xs">
                    No upcoming commitments pending!
                  </div>
                ) : (
                  upcomingBills.map(b => (
                    <div key={b.id} className="p-2 rounded-lg bg-background-card border border-white/[0.04]">
                      <div className="font-medium text-white">{b.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                        <span>Due Day {b.dueDay}</span>
                        <span className="font-bold text-mint">{formatINR(b.amount)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-mint to-cyan p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-mint font-heading">
                RF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/[0.08] space-y-2 pb-2">
          <div className="px-3 py-1 flex items-center justify-between bg-white/[0.03] rounded-lg mb-2">
            <span className="text-[11px] font-mono text-slate-400">Profile:</span>
            <button
              onClick={() => {
                onOpenExperienceSelector();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-mint font-semibold underline"
            >
              {profileMode === 'demo' ? 'Demo Mode (Switch)' : 'Clean Slate (Switch)'}
            </button>
          </div>
          {(['overview', 'simulator', 'budget', 'goals', 'commitments', 'health'] as NavigationPage[]).map((page) => (
            <button
              key={page}
              onClick={() => {
                onNavigate(page);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                currentPage === page ? 'bg-mint text-black font-bold' : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              {page === 'overview' ? 'Command Center (Overview)' :
               page === 'simulator' ? 'Spend Simulator & Lab' :
               page === 'budget' ? 'Budget & Activity' :
               page === 'goals' ? 'Savings Goals' :
               page === 'commitments' ? 'Commitments & Subscriptions' : 'Financial Health'}
            </button>
          ))}
          <div className="pt-2 border-t border-white/[0.08] space-y-1">
            <button
              onClick={() => {
                onOpenDemoModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-cyan font-semibold"
            >
              ✨ Open Hackathon Demo Scenarios
            </button>
            <button
              onClick={() => {
                onOpenExperienceSelector();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber font-semibold"
            >
              🔄 Change Starting Experience Mode
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
