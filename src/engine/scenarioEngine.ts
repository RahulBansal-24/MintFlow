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

/**
 * Runs a pure, isolated what-if financial simulation without mutating real application state.
 *
 * Workflow:
 * 1. Computes baseline metrics ('before') from the committed state.
 * 2. Deep-clones currentState to guarantee strict sandbox isolation.
 * 3. Applies the proposed decision (purchase, emergency, goal transfer, subscription cut, or bill pay).
 * 4. Computes re-calculated metrics ('after') from the simulated state.
 * 5. Generates deltas (available cash, daily allowance, month-end projection, health score).
 * 6. Synthesizes a contextual verdict, consequence timeline, and smart actionable alternatives.
 *
 * @param currentState - The active FinancialState (remains completely untouched).
 * @param decision - The proposed SimulationDecision parameters.
 * @returns SimulationResult - Before/after metrics, deltas, verdict, timeline, and alternatives.
 */
export function simulateDecision(currentState: FinancialState, decision: SimulationDecision): SimulationResult {
  const before = calculateMetrics(currentState);

  // Create isolated clone of state
  const simulatedState: FinancialState = JSON.parse(JSON.stringify(currentState));
  const currentDay = simulatedState.cycle.currentDay;

  // Apply simulated decision non-destructively
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
      let targetGoal = simulatedState.goals.find(g => g.id === decision.targetGoalId);
      if (!targetGoal) {
        targetGoal = simulatedState.goals[0];
      }
      if (targetGoal) {
        targetGoal.savedAmount += Math.max(0, decision.amount);
      } else {
        // If no goal exists, add one
        simulatedState.goals.push({
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
  } else if (decision.type === 'save_goal') {
    if (after.uncommittedCash < 0) {
      verdict = {
        title: 'Over-Allocation Alert: Zero Flexible Runway',
        tone: 'danger',
        explanation: `Locking ₹${formatINR(decision.amount, { hideSymbol: true })} into savings pushes your uncommitted cash into negative (${formatINR(after.uncommittedCash)}). You will have no money left for routine daily needs.`
      };
    } else if (after.dailyAllowance < 100) {
      verdict = {
        title: 'Tight Squeeze: Savings Goal Strains Daily Allowance',
        tone: 'caution',
        explanation: `Transferring ₹${formatINR(decision.amount, { hideSymbol: true })} to savings leaves ₹${formatINR(after.uncommittedCash, { hideSymbol: true })} uncommitted (₹${Math.round(after.dailyAllowance)}/day). Daily college expenses may feel tight.`
      };
    } else {
      verdict = {
        title: 'Savings Goal Funded: Safe Runway Intact',
        tone: 'positive',
        explanation: `Transferring ₹${formatINR(decision.amount, { hideSymbol: true })} to your emergency cushion is fully sustainable. You retain ₹${formatINR(after.uncommittedCash, { hideSymbol: true })} uncommitted (₹${Math.round(after.dailyAllowance)}/day) for remaining days.`
      };
    }
  } else if (after.dailyAllowance < 100) {
    verdict = {
      title: 'Pinch Alert: Tight Daily Spending Allowance',
      tone: 'caution',
      explanation: `Your flexible daily allowance drops from ₹${Math.round(before.dailyAllowance)} to ₹${Math.round(after.dailyAllowance)}/day. Routine expenses will feel constrained.`
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
  }

  // Consequence timeline
  const nextCommitment = currentState.commitments.find(c => c.status === 'upcoming' && c.dueDay >= currentDay);
  const nextBillDate = nextCommitment ? `Day ${nextCommitment.dueDay} (${nextCommitment.name.split(' ')[0]})` : 'Day 12 & 24 (Bills)';

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
      timeframe: `${nextBillDate} Coverage`,
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
    // 1. Value/Cheaper alternative (60% cost)
    const reducedAmount = Math.round(decision.amount * 0.6);
    const saved = decision.amount - reducedAmount;
    smartAlternatives.push({
      id: 'alt-reduce',
      title: `Pick Value Edition (₹${reducedAmount} instead of ₹${decision.amount})`,
      description: `Save ₹${saved} upfront. Preserves ₹${Math.round(before.dailyAllowance - (reducedAmount / before.remainingDays))}/day daily allowance instead of dropping to ₹${Math.round(after.dailyAllowance)}/day.`,
      adjustedAmount: reducedAmount,
      savedRupees: saved,
      actionType: 'reduce'
    });

    // 2. Delay purchase alternative post-bill
    if (nextCommitment) {
      smartAlternatives.push({
        id: 'alt-delay',
        title: `Delay Purchase to Day ${Math.min(30, nextCommitment.dueDay + 2)} (Post-${nextCommitment.name.split(' ')[0]} Bill)`,
        description: `Clear your ₹${nextCommitment.amount} bill on Day ${nextCommitment.dueDay} first to eliminate risk of missed payments.`,
        adjustedAmount: decision.amount,
        savedRupees: 0,
        actionType: 'delay'
      });
    }

    // 3. Cancel non-essential subscription trade-off
    const discSub = currentState.commitments.find(c => c.isSubscription && !c.isEssential && c.status === 'upcoming');
    if (discSub) {
      smartAlternatives.push({
        id: 'alt-cancel-sub',
        title: `Offset by Cancelling ${discSub.name} (+₹${discSub.amount})`,
        description: `Cancelling ${discSub.name} permanently recovers ${Math.round((discSub.amount / decision.amount) * 100)}% of this purchase.`,
        adjustedAmount: decision.amount - discSub.amount,
        savedRupees: discSub.amount,
        actionType: 'cancel_sub',
        targetCommitmentId: discSub.id
      });
    }
  } else if (decision.type === 'save_goal' && decision.amount > 1000) {
    // Smart alternative for goal transfer: Split into two halves
    const halfAmount = Math.round(decision.amount / 2);
    smartAlternatives.push({
      id: 'alt-split-goal',
      title: `Transfer ₹${halfAmount} now, ₹${halfAmount} on Day 18`,
      description: `Protects your daily flexible allowance at ₹${Math.round(before.dailyAllowance - (halfAmount / before.remainingDays))}/day while steadily building your cushion.`,
      adjustedAmount: halfAmount,
      savedRupees: decision.amount - halfAmount,
      actionType: 'split_goal'
    });
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
