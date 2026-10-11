import { 
  FinancialState, 
  SimulationDecision, 
  SimulationResult, 
  SmartAlternative,
  Transaction,
  Commitment 
} from './types';
import { calculateMetrics } from './financialEngine';
import { formatINR } from './currency';

export function simulateDecision(currentState: FinancialState, decision: SimulationDecision): SimulationResult {
  const before = calculateMetrics(currentState);

  // Create isolated clone of state
  const simulatedState: FinancialState = JSON.parse(JSON.stringify(currentState));
  const currentDay = simulatedState.cycle.currentDay;

  // Apply simulated decision
  switch (decision.type) {
    case 'buy_now':
    case 'add_expense': {
      const newTx: Transaction = {
        id: 'sim-tx-' + Date.now(),
        description: decision.title || 'Simulated Purchase',
        amount: Math.max(0, decision.amount),
        category: decision.category,
        type: 'expense',
        date: `Day ${decision.day || currentDay}`,
        day: decision.day || currentDay,
        isEssential: decision.isEssential,
        notes: decision.notes
      };
      simulatedState.transactions.push(newTx);
      break;
    }

    case 'emergency': {
      const emergencyTx: Transaction = {
        id: 'sim-emergency-' + Date.now(),
        description: decision.title || 'Unexpected Expense',
        amount: Math.max(0, decision.amount),
        category: decision.category || 'health',
        type: 'expense',
        date: `Day ${currentDay}`,
        day: currentDay,
        isEssential: true,
        notes: 'Emergency scenario simulation'
      };
      simulatedState.transactions.push(emergencyTx);
      break;
    }

    case 'add_income': {
      const incomeTx: Transaction = {
        id: 'sim-inc-' + Date.now(),
        description: decision.title || 'Additional Income',
        amount: Math.max(0, decision.amount),
        category: 'other',
        type: 'income',
        date: `Day ${decision.day || currentDay}`,
        day: decision.day || currentDay,
        isEssential: false,
        notes: decision.notes
      };
      simulatedState.transactions.push(incomeTx);
      break;
    }

    case 'save_goal': {
      const targetGoal = simulatedState.goals.find(g => g.id === decision.targetGoalId) || simulatedState.goals[0];
      if (targetGoal) {
        targetGoal.savedAmount += Math.max(0, decision.amount);
      }
      break;
    }

    case 'subscribe': {
      const newComm: Commitment = {
        id: 'sim-comm-' + Date.now(),
        name: decision.title || 'New Subscription',
        amount: Math.max(0, decision.amount),
        category: decision.category,
        dueDay: Math.min(30, currentDay + 7),
        isEssential: decision.isEssential,
        status: 'upcoming',
        isSubscription: true,
        frequency: 'monthly',
        notes: 'Simulated recurring commitment'
      };
      simulatedState.commitments.push(newComm);
      break;
    }

    case 'cancel_subscription': {
      const target = simulatedState.commitments.find(c => c.id === decision.targetCommitmentId);
      if (target) {
        target.status = 'cancelled';
      }
      break;
    }

    case 'pay_bill': {
      const targetBill = simulatedState.commitments.find(c => c.id === decision.targetCommitmentId);
      if (targetBill && targetBill.status === 'upcoming') {
        targetBill.status = 'paid';
        // Convert reservation into actual paid expense
        simulatedState.transactions.push({
          id: 'sim-bill-pay-' + Date.now(),
          description: `Paid Bill: ${targetBill.name}`,
          amount: targetBill.amount,
          category: targetBill.category,
          type: 'expense',
          date: `Day ${currentDay}`,
          day: currentDay,
          isEssential: targetBill.isEssential,
          notes: 'Bill payment settlement'
        });
      }
      break;
    }

    case 'reduce_purchase': {
      const reducedTx: Transaction = {
        id: 'sim-reduced-' + Date.now(),
        description: decision.title || 'Optimized Purchase',
        amount: Math.max(0, decision.amount),
        category: decision.category,
        type: 'expense',
        date: `Day ${currentDay}`,
        day: currentDay,
        isEssential: decision.isEssential,
        notes: decision.notes
      };
      simulatedState.transactions.push(reducedTx);
      break;
    }
  }

  const after = calculateMetrics(simulatedState);

  // Calculate deltas
  const deltaAvailableCash = after.availableCash - before.availableCash;
  const deltaUncommittedCash = after.uncommittedCash - before.uncommittedCash;
  const deltaDailyAllowance = after.dailyAllowance - before.dailyAllowance;
  const deltaProjectedBalance = after.projectedMonthEndBalance - before.projectedMonthEndBalance;
  const deltaHealthScore = after.healthScore - before.healthScore;

  // Formulate Verdict
  let verdict: SimulationResult['verdict'] = {
    title: 'Comfortable within your budget',
    tone: 'safe',
    explanation: `This move leaves ₹${formatINR(after.uncommittedCash, { hideSymbol: true })} uncommitted and maintains a sustainable ₹${Math.round(after.dailyAllowance)}/day allowance.`
  };

  if (after.projectedMonthEndBalance < 0) {
    verdict = {
      title: 'Deficit Alert: Month-End Balance Goes Negative',
      tone: 'danger',
      explanation: `This decision pushes your cycle projection to -₹${formatINR(Math.abs(after.projectedMonthEndBalance), { hideSymbol: true })}. You will run out of cash before Day 30.`
    };
  } else if (after.availableCash < after.unpaidReservedCommitments) {
    verdict = {
      title: 'Warning: Puts Upcoming Commitments at Risk',
      tone: 'danger',
      explanation: `Your remaining cash (₹${formatINR(after.availableCash, { hideSymbol: true })}) will fall below your upcoming bills (₹${formatINR(after.unpaidReservedCommitments, { hideSymbol: true })}).`
    };
  } else if (after.dailyAllowance < 100) {
    verdict = {
      title: 'Pinch Alert: Tight Daily Spending Allowance',
      tone: 'caution',
      explanation: `Your flexible daily allowance drops from ₹${Math.round(before.dailyAllowance)} to ₹${Math.round(after.dailyAllowance)}/day. Routine college expenses may feel tight.`
    };
  } else if (decision.type === 'cancel_subscription') {
    verdict = {
      title: 'Smart Optimization: Frees Up Reserved Cash',
      tone: 'positive',
      explanation: `Cancelling frees up ₹${formatINR(Math.abs(deltaUncommittedCash), { hideSymbol: true })}, boosting your daily allowance by +₹${Math.round(Math.abs(deltaDailyAllowance))}/day.`
    };
  } else if (decision.type === 'add_income') {
    verdict = {
      title: 'Runway Expansion: Financial Health Boost',
      tone: 'positive',
      explanation: `Receiving ₹${formatINR(decision.amount, { hideSymbol: true })} expands your daily allowance by +₹${Math.round(deltaDailyAllowance)}/day and strengthens reserves.`
    };
  } else if (decision.type === 'save_goal') {
    verdict = {
      title: 'Goal Accelerating: Future Self Wins',
      tone: 'positive',
      explanation: `Allocating ₹${formatINR(decision.amount, { hideSymbol: true })} accelerates your target without adding any consumption debt.`
    };
  }

  // Consequence timeline
  const consequenceTimeline: SimulationResult['consequenceTimeline'] = [
    {
      timeframe: 'Today (Immediate)',
      impact: deltaAvailableCash !== 0 
        ? `Available cash changes by ${deltaAvailableCash > 0 ? '+' : ''}${formatINR(deltaAvailableCash)}` 
        : `Uncommitted buffer changes by ${deltaUncommittedCash > 0 ? '+' : ''}${formatINR(deltaUncommittedCash)}`,
      severity: deltaAvailableCash < -1000 ? 'caution' : deltaAvailableCash < 0 ? 'neutral' : 'positive'
    },
    {
      timeframe: 'Next 7 Days (Pacing)',
      impact: `Daily flexible spend shifts from ₹${Math.round(before.dailyAllowance)}/d to ₹${Math.round(after.dailyAllowance)}/d (${deltaDailyAllowance >= 0 ? '+' : ''}₹${Math.round(deltaDailyAllowance)}/d)`,
      severity: after.dailyAllowance < 100 ? 'danger' : after.dailyAllowance < 150 ? 'caution' : 'neutral'
    },
    {
      timeframe: 'Day 12 & 24 (Bills Coverage)',
      impact: after.availableCash >= after.unpaidReservedCommitments
        ? `All upcoming bills (₹${formatINR(after.unpaidReservedCommitments)}) remain 100% funded`
        : `Deficit of ₹${formatINR(after.unpaidReservedCommitments - after.availableCash)} on scheduled bill dates`,
      severity: after.availableCash >= after.unpaidReservedCommitments ? 'positive' : 'danger'
    },
    {
      timeframe: 'Day 30 (Cycle Close)',
      impact: `Projected month-end balance: ${formatINR(after.projectedMonthEndBalance)} (${deltaProjectedBalance >= 0 ? '+' : ''}${formatINR(deltaProjectedBalance)})`,
      severity: after.projectedMonthEndBalance < 0 ? 'danger' : after.projectedMonthEndBalance < 1000 ? 'caution' : 'positive'
    }
  ];

  // Smart Alternatives
  const smartAlternatives: SmartAlternative[] = [];

  if (decision.amount > 500 && (decision.type === 'buy_now' || decision.type === 'add_expense' || decision.type === 'emergency')) {
    // 1. Reduced amount alternative
    const reducedAmount = Math.round(decision.amount * 0.6);
    const saved = decision.amount - reducedAmount;
    smartAlternatives.push({
      id: 'alt-reduce',
      title: `Pick Value Edition (${Math.round(decision.amount * 0.6)} instead of ${decision.amount})`,
      description: `Save ₹${saved} upfront. Keeps your daily allowance at ₹${Math.round(before.dailyAllowance - (reducedAmount / before.remainingDays))}/day instead of ₹${Math.round(after.dailyAllowance)}/day.`,
      adjustedAmount: reducedAmount,
      savedRupees: saved,
      actionType: 'reduce'
    });

    // 2. Delay purchase alternative
    smartAlternatives.push({
      id: 'alt-delay',
      title: 'Split or Delay until Day 14 (Post-Hostel Bill)',
      description: 'Clear your ₹800 hostel maintenance bill first on Day 12 to eliminate risk of unpaid bill charges.',
      adjustedAmount: decision.amount,
      savedRupees: 0,
      actionType: 'delay'
    });

    // 3. Cancel non-essential subscription trade-off
    const discSub = currentState.commitments.find(c => c.isSubscription && !c.isEssential && c.status === 'upcoming');
    if (discSub) {
      smartAlternatives.push({
        id: 'alt-cancel-sub',
        title: `Offset with ${discSub.name} (Free up ₹${discSub.amount})`,
        description: `Cancelling ${discSub.name} covers ${Math.round((discSub.amount / decision.amount) * 100)}% of this purchase automatically.`,
        adjustedAmount: decision.amount - discSub.amount,
        savedRupees: discSub.amount,
        actionType: 'cancel_sub',
        targetCommitmentId: discSub.id
      });
    }
  }

  return {
    before,
    after,
    deltaAvailableCash,
    deltaUncommittedCash,
    deltaDailyAllowance,
    deltaProjectedBalance,
    deltaHealthScore,
    verdict,
    consequenceTimeline,
    smartAlternatives
  };
}
