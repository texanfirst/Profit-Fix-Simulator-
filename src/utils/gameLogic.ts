import { BusinessCard, EventCard, ChallengeCard, StrategyCard, RoundStudentInput } from '../types';

export interface CalculatedRoundData {
  baseRevenue: number;
  baseExpenses: number;
  baseProfit: number;
  // After Event Card
  eventAdjustedRevenue: number;
  eventAdjustedExpenses: number;
  eventAdjustedProfit: number;
  // Chosen Strategy Results
  strategyRevenueDelta: number;
  strategyExpenseDelta: number;
  finalRevenue: number;
  finalExpenses: number;
  finalProfit: number;
  profitGain: number; // vs eventAdjustedProfit
  profitMarginPct: number;
  // Step 1 comparison table rows
  comparedOptions: {
    strategy: StrategyCard;
    revChange: number;
    expChange: number;
    newProfit: number;
    profitGain: number;
    marginPct: number;
  }[];
}

export function calculateRoundData(
  business: BusinessCard,
  event: EventCard | null,
  strategiesToCompare: StrategyCard[],
  chosenStrategy: StrategyCard | null
): CalculatedRoundData {
  const baseRevenue = business.currentDay.revenue;
  const baseExpenses = business.currentDay.expenses;
  const baseProfit = baseRevenue - baseExpenses;

  const eventRevDelta = event ? event.revenueDelta : 0;
  const eventExpDelta = event ? event.expenseDelta : 0;

  const eventAdjustedRevenue = Math.max(0, baseRevenue + eventRevDelta);
  const eventAdjustedExpenses = Math.max(0, baseExpenses + eventExpDelta);
  const eventAdjustedProfit = eventAdjustedRevenue - eventAdjustedExpenses;

  const comparedOptions = strategiesToCompare.map((strat) => {
    const revChange = strat.revenueChange;
    const expChange = strat.expenseChange;
    const optNewRev = Math.max(0, eventAdjustedRevenue + revChange);
    const optNewExp = Math.max(0, eventAdjustedExpenses + expChange);
    const optNewProfit = optNewRev - optNewExp;
    const profitGain = optNewProfit - eventAdjustedProfit;
    const marginPct = optNewRev > 0 ? (optNewProfit / optNewRev) * 100 : 0;

    return {
      strategy: strat,
      revChange,
      expChange,
      newProfit: optNewProfit,
      profitGain,
      marginPct,
    };
  });

  const stratRevDelta = chosenStrategy ? chosenStrategy.revenueChange : 0;
  const stratExpDelta = chosenStrategy ? chosenStrategy.expenseChange : 0;

  const finalRevenue = Math.max(0, eventAdjustedRevenue + stratRevDelta);
  const finalExpenses = Math.max(0, eventAdjustedExpenses + stratExpDelta);
  const finalProfit = finalRevenue - finalExpenses;
  const profitGain = finalProfit - eventAdjustedProfit;
  const profitMarginPct = finalRevenue > 0 ? (finalProfit / finalRevenue) * 100 : 0;

  return {
    baseRevenue,
    baseExpenses,
    baseProfit,
    eventAdjustedRevenue,
    eventAdjustedExpenses,
    eventAdjustedProfit,
    strategyRevenueDelta: stratRevDelta,
    strategyExpenseDelta: stratExpDelta,
    finalRevenue,
    finalExpenses,
    finalProfit,
    profitGain,
    profitMarginPct,
    comparedOptions,
  };
}

export interface BoardEvaluation {
  score: number; // 0 to 100
  stars: number; // 1 to 5
  isChallengeCompleted: boolean;
  challengeStatusMessage: string;
  mathAccuracyScore: number;
  mathFeedback: string;
  strategyFeedback: string;
  memoFeedback: string;
  strengths: string[];
  tipsForImprovement: string[];
}

export function evaluateStudentSubmission(
  business: BusinessCard,
  event: EventCard | null,
  challenge: ChallengeCard | null,
  chosenStrategy: StrategyCard | null,
  calcData: CalculatedRoundData,
  studentInput: RoundStudentInput
): BoardEvaluation {
  let score = 0;
  const strengths: string[] = [];
  const tips: string[] = [];

  // 1. Math verification
  const expectedRev = calcData.finalRevenue;
  const expectedExp = calcData.finalExpenses;
  const expectedProfit = calcData.finalProfit;

  const userRev = Number(studentInput.userRevenueCalc);
  const userExp = Number(studentInput.userExpenseCalc);
  const userProf = Number(studentInput.userProfitCalc);

  let mathAccurate = true;
  let mathFeedback = 'All calculations are mathematically accurate!';
  let mathScore = 30;

  if (studentInput.userRevenueCalc !== '' && userRev !== expectedRev) {
    mathAccurate = false;
    mathScore -= 10;
    tips.push(`Revenue check: Expected $${expectedRev} (Starting $${calcData.eventAdjustedRevenue} + $${calcData.strategyRevenueDelta}), but got $${userRev}.`);
  }
  if (studentInput.userExpenseCalc !== '' && userExp !== expectedExp) {
    mathAccurate = false;
    mathScore -= 10;
    tips.push(`Expenses check: Expected $${expectedExp} (Starting $${calcData.eventAdjustedExpenses} + $${calcData.strategyExpenseDelta}), but got $${userExp}.`);
  }
  if (studentInput.userProfitCalc !== '' && userProf !== expectedProfit) {
    mathAccurate = false;
    mathScore -= 10;
    tips.push(`Profit check: Expected $${expectedProfit} ($${expectedRev} - $${expectedExp}), but got $${userProf}.`);
  }

  if (mathAccurate) {
    strengths.push('Flawless business math: Revenue - Expenses = Profit correctly demonstrated.');
  } else {
    mathFeedback = 'Some calculations differed from the standard formula. Review the step-by-step math.';
  }
  score += Math.max(0, mathScore);

  // 2. Challenge Completion Check
  let isChallengeCompleted = true;
  let challengeStatusMessage = 'No active challenge restriction.';

  if (challenge) {
    if (challenge.ruleType === 'min_margin_pct' && challenge.targetValue) {
      isChallengeCompleted = calcData.profitMarginPct >= challenge.targetValue;
      challengeStatusMessage = isChallengeCompleted
        ? `Challenge Met: Achieved ${calcData.profitMarginPct.toFixed(1)}% profit margin (Target: ${challenge.targetValue}%).`
        : `Challenge Missed: Final margin is ${calcData.profitMarginPct.toFixed(1)}% (Target was ${challenge.targetValue}%).`;
    } else if (challenge.ruleType === 'profit_boost' && challenge.targetValue) {
      isChallengeCompleted = calcData.profitGain >= challenge.targetValue;
      challengeStatusMessage = isChallengeCompleted
        ? `Challenge Met: Gained +$${calcData.profitGain} profit boost (Target: +$${challenge.targetValue}).`
        : `Challenge Missed: Gained +$${calcData.profitGain} (Target was +$${challenge.targetValue}).`;
    } else if (challenge.ruleType === 'min_profit' && challenge.targetValue) {
      isChallengeCompleted = calcData.finalProfit >= challenge.targetValue;
      challengeStatusMessage = isChallengeCompleted
        ? `Challenge Met: Reached $${calcData.finalProfit} total profit (Target: $${challenge.targetValue}).`
        : `Challenge Missed: Reached $${calcData.finalProfit} (Target was $${challenge.targetValue}).`;
    } else if (challenge.ruleType === 'no_cost_cuts') {
      const isLaborCut = chosenStrategy?.category === 'operations' && chosenStrategy.expenseChange < -30;
      isChallengeCompleted = !isLaborCut;
      challengeStatusMessage = isChallengeCompleted
        ? 'Challenge Met: Maintained team integrity and avoided excessive staff cuts.'
        : 'Challenge Missed: Strategy applied aggressive labor cuts.';
    } else if (challenge.ruleType === 'protect_reputation') {
      const isCheapSubstitute = chosenStrategy?.id === 'strat-trim-slow-items';
      isChallengeCompleted = true; // Most strategies are balanced
      challengeStatusMessage = 'Challenge Met: Quality standard preserved.';
    }

    if (isChallengeCompleted) {
      score += 35;
      strengths.push(`Objective Fulfilled: ${challenge.title}`);
    } else {
      score += 15;
      tips.push(`Challenge Goal: Review how alternative fixes could hit the target (${challenge.targetGoal}).`);
    }
  } else {
    score += 35;
  }

  // 3. Strategic Decision & Memo Quality
  let strategyScore = 20;
  if (chosenStrategy) {
    if (calcData.profitGain > 0) {
      strengths.push(`Profitable choice: '${chosenStrategy.title}' improved bottom line by +$${calcData.profitGain}.`);
      strategyScore += 5;
    } else if (calcData.profitGain === 0) {
      tips.push('Break-even decision: This fix kept profit identical.');
    } else {
      tips.push('Warning: This decision decreased net profits compared to the starting baseline.');
      strategyScore -= 10;
    }
  }
  score += strategyScore;

  // 4. Recommendation Memo completeness
  let memoScore = 0;
  if (studentInput.memo.teamRecommendation.trim().length > 5) memoScore += 3;
  if (studentInput.memo.whyBestDecision.trim().length > 10) memoScore += 3;
  if (studentInput.memo.marketForce) memoScore += 2;
  if (studentInput.memo.riskTradeoff.trim().length > 8) memoScore += 2;

  score += memoScore;

  const totalScore = Math.min(100, Math.max(10, score));
  const stars = totalScore >= 90 ? 5 : totalScore >= 75 ? 4 : totalScore >= 60 ? 3 : totalScore >= 45 ? 2 : 1;

  const strategyFeedback = chosenStrategy
    ? `Your team selected "${chosenStrategy.title}". It brings final revenue to $${calcData.finalRevenue} and expenses to $${calcData.finalExpenses}, netting $${calcData.finalProfit} profit (${calcData.profitMarginPct.toFixed(1)}% margin).`
    : 'No strategy was selected for this round.';

  const memoFeedback = studentInput.memo.marketForce
    ? `Addressed the ${studentInput.memo.marketForce} market force with clear risk defense.`
    : 'Complete the market force and pitch fields to maximize your executive pitch score.';

  return {
    score: totalScore,
    stars,
    isChallengeCompleted,
    challengeStatusMessage,
    mathAccuracyScore: mathScore,
    mathFeedback,
    strategyFeedback,
    memoFeedback,
    strengths,
    tipsForImprovement: tips,
  };
}
