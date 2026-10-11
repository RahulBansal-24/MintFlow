import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FinancialState, 
  CalculatedMetrics, 
  Transaction, 
  Commitment, 
  SavingsGoal, 
  SimulationDecision, 
  SimulationResult,
  ForecastDayPoint
} from '../engine/types';
import { calculateMetrics } from '../engine/financialEngine';
import { generateForecastData, StrategyComparison } from '../engine/forecastEngine';
import { generateMoneyInsights, MoneyInsight } from '../engine/insightsEngine';
import { 
  loadFinancialState, 
  saveFinancialState, 
  resetFinancialState, 
  loadProfileMode, 
  saveProfileMode, 
  ProfileMode 
} from '../engine/storage';
import { simulateDecision } from '../engine/scenarioEngine';

interface FinancialContextType {
  state: FinancialState;
  metrics: CalculatedMetrics;
  insights: MoneyInsight[];
  forecastData: {
    chartPoints: ForecastDayPoint[];
    strategies: StrategyComparison[];
  };
  profileMode: ProfileMode;
  switchProfileMode: (mode: ProfileMode) => void;
  resetToCurrentMode: () => void;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addCommitment: (comm: Omit<Commitment, 'id'>) => void;
  editCommitment: (id: string, updates: Partial<Commitment>) => void;
  payCommitment: (id: string) => void;
  cancelCommitment: (id: string) => void;
  deleteCommitment: (id: string) => void;

  addGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  withdrawFromGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;

  // Simulator actions
  commitSimulation: (decision: SimulationDecision) => void;
  
  // Navigation & Demo
  setCurrentDay: (day: number) => void;
  resetDemo: () => void;
  
  // Undo support
  canUndo: boolean;
  undoLastAction: () => void;
}

const FinancialContext = createContext<FinancialContextType | null>(null);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileMode, setProfileMode] = useState<ProfileMode>(() => loadProfileMode());
  const [state, setState] = useState<FinancialState>(() => loadFinancialState());
  const [history, setHistory] = useState<FinancialState[]>([]);

  // Keep localStorage in sync
  useEffect(() => {
    saveFinancialState(state);
  }, [state]);

  const saveHistorySnapshot = useCallback(() => {
    setHistory(prev => [...prev.slice(-10), JSON.parse(JSON.stringify(state))]);
  }, [state]);

  // Derived metrics
  const metrics = useMemo(() => calculateMetrics(state), [state]);
  const insights = useMemo(() => generateMoneyInsights(state, metrics), [state, metrics]);
  const forecastData = useMemo(() => generateForecastData(state), [state]);

  // Switch profile mode (Demo vs Fresh)
  const switchProfileMode = useCallback((newMode: ProfileMode) => {
    saveProfileMode(newMode);
    setProfileMode(newMode);
    const freshState = resetFinancialState(newMode);
    setState(freshState);
    setHistory([]);
  }, []);

  const resetToCurrentMode = useCallback(() => {
    const freshState = resetFinancialState(profileMode);
    setState(freshState);
    setHistory([]);
  }, [profileMode]);

  // Transaction Actions
  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    saveHistorySnapshot();
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
    };
    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
  }, [saveHistorySnapshot]);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, [saveHistorySnapshot]);

  const deleteTransaction = useCallback((id: string) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  }, [saveHistorySnapshot]);

  // Commitment Actions
  const addCommitment = useCallback((comm: Omit<Commitment, 'id'>) => {
    saveHistorySnapshot();
    const newComm: Commitment = {
      ...comm,
      id: 'comm-' + Date.now()
    };
    setState(prev => ({
      ...prev,
      commitments: [...prev.commitments, newComm]
    }));
  }, [saveHistorySnapshot]);

  const editCommitment = useCallback((id: string, updates: Partial<Commitment>) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  }, [saveHistorySnapshot]);

  const payCommitment = useCallback((id: string) => {
    saveHistorySnapshot();
    setState(prev => {
      const comm = prev.commitments.find(c => c.id === id);
      if (!comm || comm.status === 'paid') return prev;

      // 1. Mark commitment as paid
      const updatedCommitments = prev.commitments.map(c => 
        c.id === id ? { ...c, status: 'paid' as const } : c
      );

      // 2. Add as transaction so cash flows smoothly from reservation to actual expense
      const newTx: Transaction = {
        id: 'tx-bill-' + Date.now(),
        description: `Bill Paid: ${comm.name}`,
        amount: comm.amount,
        category: comm.category,
        type: 'expense',
        date: `Day ${prev.cycle.currentDay}`,
        day: prev.cycle.currentDay,
        isEssential: comm.isEssential,
        notes: 'Cleared from commitments schedule'
      };

      return {
        ...prev,
        commitments: updatedCommitments,
        transactions: [newTx, ...prev.transactions]
      };
    });
  }, [saveHistorySnapshot]);

  const cancelCommitment = useCallback((id: string) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => c.id === id ? { ...c, status: 'cancelled' as const } : c)
    }));
  }, [saveHistorySnapshot]);

  const deleteCommitment = useCallback((id: string) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.filter(c => c.id !== id)
    }));
  }, [saveHistorySnapshot]);

  // Goals Actions
  const addGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => {
    saveHistorySnapshot();
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'goal-' + Date.now(),
      savedAmount: 0
    };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  }, [saveHistorySnapshot]);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, savedAmount: g.savedAmount + amount } : g)
    }));
  }, [saveHistorySnapshot]);

  const withdrawFromGoal = useCallback((id: string, amount: number) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, savedAmount: Math.max(0, g.savedAmount - amount) } : g)
    }));
  }, [saveHistorySnapshot]);

  const deleteGoal = useCallback((id: string) => {
    saveHistorySnapshot();
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  }, [saveHistorySnapshot]);

  // Simulator Commit
  const commitSimulation = useCallback((decision: SimulationDecision) => {
    saveHistorySnapshot();
    const currentDay = state.cycle.currentDay;

    setState(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as FinancialState;

      switch (decision.type) {
        case 'buy_now':
        case 'add_expense':
        case 'emergency':
        case 'reduce_purchase': {
          next.transactions.unshift({
            id: 'tx-sim-' + Date.now(),
            description: decision.title || 'Simulated Purchase',
            amount: Math.max(0, decision.amount),
            category: decision.category,
            type: 'expense',
            date: `Day ${decision.day || currentDay}`,
            day: decision.day || currentDay,
            isEssential: decision.isEssential,
            notes: decision.notes || 'Committed from Spend Simulator'
          });
          break;
        }

        case 'add_income': {
          next.transactions.unshift({
            id: 'tx-inc-' + Date.now(),
            description: decision.title || 'Extra Income',
            amount: Math.max(0, decision.amount),
            category: 'other',
            type: 'income',
            date: `Day ${decision.day || currentDay}`,
            day: decision.day || currentDay,
            isEssential: false,
            notes: decision.notes || 'Income deposited'
          });
          break;
        }

        case 'save_goal': {
          let target = next.goals.find(g => g.id === decision.targetGoalId);
          if (!target) target = next.goals[0];
          if (target) {
            target.savedAmount += Math.max(0, decision.amount);
          } else {
            next.goals.push({
              id: 'goal-sim-' + Date.now(),
              name: decision.title || 'Emergency Cushion',
              targetAmount: Math.max(decision.amount * 1.5, 2000),
              savedAmount: Math.max(0, decision.amount),
              targetDay: 30,
              icon: 'shield',
              status: 'active',
              color: '#65F5B4'
            });
          }
          break;
        }

        case 'subscribe': {
          next.commitments.push({
            id: 'comm-sub-' + Date.now(),
            name: decision.title || 'New Subscription',
            amount: Math.max(0, decision.amount),
            category: decision.category,
            dueDay: Math.min(30, currentDay + 7),
            isEssential: decision.isEssential,
            status: 'upcoming',
            isSubscription: true,
            frequency: 'monthly',
            notes: 'Added from simulator'
          });
          break;
        }

        case 'cancel_subscription': {
          const target = next.commitments.find(c => c.id === decision.targetCommitmentId);
          if (target) {
            target.status = 'cancelled';
          }
          break;
        }

        case 'pay_bill': {
          const target = next.commitments.find(c => c.id === decision.targetCommitmentId);
          if (target && target.status === 'upcoming') {
            target.status = 'paid';
            next.transactions.unshift({
              id: 'tx-bill-' + Date.now(),
              description: `Paid: ${target.name}`,
              amount: target.amount,
              category: target.category,
              type: 'expense',
              date: `Day ${currentDay}`,
              day: currentDay,
              isEssential: target.isEssential,
              notes: 'Settled via simulator'
            });
          }
          break;
        }
      }

      return next;
    });
  }, [saveHistorySnapshot, state.cycle.currentDay]);

  // Timeline Navigation
  const setCurrentDay = useCallback((day: number) => {
    setState(prev => ({
      ...prev,
      cycle: {
        ...prev.cycle,
        currentDay: Math.max(1, Math.min(30, day))
      }
    }));
  }, []);

  // Reset Demo to Day 8 seed
  const resetDemo = useCallback(() => {
    switchProfileMode('demo');
  }, [switchProfileMode]);

  // Undo
  const undoLastAction = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setState(last);
  }, [history]);

  return (
    <FinancialContext.Provider
      value={{
        state,
        metrics,
        insights,
        forecastData,
        profileMode,
        switchProfileMode,
        resetToCurrentMode,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addCommitment,
        editCommitment,
        payCommitment,
        cancelCommitment,
        deleteCommitment,
        addGoal,
        contributeToGoal,
        withdrawFromGoal,
        deleteGoal,
        commitSimulation,
        setCurrentDay,
        resetDemo,
        canUndo: history.length > 0,
        undoLastAction
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
