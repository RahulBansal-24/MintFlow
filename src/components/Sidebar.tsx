import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Receipt, 
  Target, 
  CalendarClock, 
  Activity, 
  Sparkles, 
  RotateCcw,
  Compass,
  ChevronRight
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export type NavigationPage = 
  | 'overview' 
  | 'simulator' 
  | 'budget' 
  | 'goals' 
  | 'commitments' 
  | 'health';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenDemoModal: () => void;
  onOpenSimulatorModal: () => void;
  onOpenExperienceSelector: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenDemoModal,
  onOpenSimulatorModal,
  onOpenExperienceSelector
}) => {
  const { state, profileMode, resetToCurrentMode, setCurrentDay, metrics } = useFinancial();

  const navItems = [
    { id: 'overview' as NavigationPage, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'simulator' as NavigationPage, label: 'Spend Simulator', icon: <Sliders className="w-4 h-4" />, badge: 'Lab' },
    { id: 'budget' as NavigationPage, label: 'Budget & Records', icon: <Receipt className="w-4 h-4" /> },
    { id: 'goals' as NavigationPage, label: 'Savings Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'commitments' as NavigationPage, label: 'Commitments & Subs', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'health' as NavigationPage, label: 'Health & Forecasts', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 bg-[#080B12] border-r border-white/[0.07] p-5 select-none z-30">
      <div className="space-y-5">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mint to-cyan flex items-center justify-center shadow-glow-mint">
            <span className="font-heading font-black text-black text-lg">M</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-white text-base tracking-wide">MINTFLOW</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-mint/15 text-mint font-semibold uppercase">PRO</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans tracking-tight">Your Money. Your Moves.</p>
          </div>
        </div>

        {/* Profile Mode Indicator Badge */}
        <div className="p-2.5 rounded-xl bg-background-card border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${profileMode === 'demo' ? 'bg-amber animate-pulse' : 'bg-mint'}`} />
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block leading-tight">
                Current Profile
              </span>
              <span className={`text-xs font-semibold ${profileMode === 'demo' ? 'text-amber' : 'text-mint'}`}>
                {profileMode === 'demo' ? 'Demo Profile (Seeded)' : 'Clean Slate (Day 1)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenExperienceSelector}
            className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors text-[10px] font-mono"
            title="Switch Profile Mode"
          >
            Switch
          </button>
        </div>

        {/* 30-Day Cycle Stepper Pill */}
        <div className="p-3 rounded-xl bg-background-card border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 text-[11px]">Financial Cycle</span>
            <span className="font-mono text-mint font-semibold text-[11px]">Day {state.cycle.currentDay} of 30</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-mint to-cyan h-full rounded-full transition-all"
              style={{ width: `${(state.cycle.currentDay / 30) * 100}%` }}
            />
          </div>

          {/* Day stepper controls */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <button
              type="button"
              onClick={() => setCurrentDay(state.cycle.currentDay - 1)}
              disabled={state.cycle.currentDay <= 1}
              className="hover:text-white disabled:opacity-30 transition-colors"
            >
              ◀ Prev Day
            </button>
            <span className="font-mono text-slate-500">{metrics.remainingDays}d Left</span>
            <button
              type="button"
              onClick={() => setCurrentDay(state.cycle.currentDay + 1)}
              disabled={state.cycle.currentDay >= 30}
              className="hover:text-white disabled:opacity-30 transition-colors"
            >
              Next Day ▶
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-mint/15 to-transparent border border-mint/30 text-white font-semibold shadow-glow-mint'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-mint' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-mint/20 text-mint font-semibold uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Hackathon Demo & Reset */}
      <div className="space-y-2 pt-4 border-t border-white/[0.07]">
        <button
          type="button"
          onClick={onOpenDemoModal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan/15 via-lavender/10 to-transparent border border-cyan/30 text-xs font-semibold text-white hover:border-cyan transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan animate-pulse" />
            <span>Hackathon Demo (5 Scenarios)</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </button>

        <button
          type="button"
          onClick={resetToCurrentMode}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-mono text-slate-400 hover:text-coral hover:bg-coral/10 border border-transparent hover:border-coral/20 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset {profileMode === 'demo' ? 'Day 8 Demo' : 'Clean Slate'}</span>
        </button>
      </div>
    </aside>
  );
};
