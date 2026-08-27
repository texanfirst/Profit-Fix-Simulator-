export type CardCategory = 'business' | 'event' | 'challenge' | 'strategy';

export type MarketForce = 'Costs' | 'Price' | 'Demand' | 'Competition';

export interface BusinessCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  scenarioStory: string;
  currentDay: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  problem: string;
  category: string;
  targetTip?: string;
  standardTip?: string;
}

export interface EventCard {
  id: string;
  title: string;
  category: 'market' | 'cost' | 'demand' | 'surprise';
  description: string;
  revenueDelta: number; // e.g. +$80 or -$50
  expenseDelta: number; // e.g. +$40 or -$20
  flavorQuote: string;
  iconName: string;
  tag: string;
}

export interface ChallengeCard {
  id: string;
  title: string;
  targetGoal: string;
  ruleType: 'min_profit' | 'min_margin_pct' | 'profit_boost' | 'no_cost_cuts' | 'protect_reputation';
  targetValue?: number;
  description: string;
  badge: string;
}

export interface StrategyCard {
  id: string;
  title: string;
  category: 'pricing' | 'cost_cutting' | 'operations' | 'marketing' | 'product';
  revenueChange: number;
  expenseChange: number;
  description: string;
  pros: string[];
  cons: string[];
  primaryMarketForce: MarketForce;
  riskTradeoff: string;
  recommendedPitch: string;
}

export interface RoundStudentInput {
  selectedStrategyIds: string[]; // up to 3 for comparison (Step 1)
  chosenStrategyId: string | null; // best pick (Step 2)
  userRevenueCalc?: number | '';
  userExpenseCalc?: number | '';
  userProfitCalc?: number | '';
  memo: {
    teamRecommendation: string;
    whyBestDecision: string;
    marketForce: MarketForce | '';
    riskTradeoff: string;
    miniPitch: string;
  };
  exitTicket?: {
    q1IsProfit: 'profit' | 'loss' | '';
    q1MathWork: string;
    q2ShouldDoIt: 'yes' | 'no' | '';
    q2Reasoning: string;
    reflectionLearned: string;
    reflectionBusyNotProfitable: string;
  };
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'math' | 'strategy' | 'career' | 'mastery';
  unlockedAt?: string;
}

export interface StudentProfile {
  name: string;
  avatar: string; // e.g. '🦊' | '🚀' | '💼' | '⚡' | '👑' | '🎯'
  avatarColor: string;
  consultantRank: string;
  level: number;
  xp: number;
  careerProfit: number;
  streak: number;
  unlockedBadgeIds: string[];
  completedMissionIds: string[];
  missionStars: Record<string, number>; // missionId -> 1..5 stars
}

export interface CampaignMission {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  clientName: string;
  clientRole: string;
  clientAvatar: string;
  storyDialog: string;
  business: BusinessCard;
  event: EventCard;
  challenge: ChallengeCard;
  unlockRequirementLevel: number;
  rewardXP: number;
}

export interface TeamScore {
  id: string;
  name: string;
  color: string;
  avatar: string;
  totalProfit: number;
  roundsWon: number;
  roundHistories: {
    round: number;
    businessTitle: string;
    finalProfit: number;
    profitGain: number;
    score: number;
  }[];
}

// Live Tycoon Simulation Engine Types
export type SimQualityTier = 'budget' | 'standard' | 'premium';
export type SimStaffingLevel = 'understaffed' | 'balanced' | 'rush_ready';
export type SimMarketingCampaign = 'none' | 'social_media' | 'influencer';

export interface SimUpgrade {
  id: string;
  title: string;
  description: string;
  cost: number;
  dailyLaborSaving?: number;
  dailyDemandBonus?: number;
  satisfactionBonus?: number;
  priceToleranceBonus?: number;
  icon: string;
  category: 'efficiency' | 'marketing' | 'quality' | 'upsell';
}

export interface SimDailyDilemma {
  id: string;
  title: string;
  triggerHour: number; // 8 to 20
  icon: string;
  description: string;
  choices: {
    label: string;
    detail: string;
    cost: number;
    revBonus: number;
    satBonus: number; // e.g. +10 or -15
    outcomeText: string;
  }[];
}

export interface SimCustomerReview {
  id: string;
  author: string;
  avatar: string;
  stars: number;
  comment: string;
  tag: 'price' | 'quality' | 'speed' | 'vibe';
}

export interface SimDayResult {
  dayNumber: number;
  dayName: string;
  price: number;
  quality: SimQualityTier;
  staffing: SimStaffingLevel;
  marketing: SimMarketingCampaign;
  activeUpgradeIds: string[];
  totalCustomers: number;
  servedCustomers: number;
  walkouts: number;
  unitCost: number;
  revenue: number;
  fixedRentExpenses: number;
  cogsExpenses: number;
  laborExpenses: number;
  marketingExpenses: number;
  dilemmaExpenses: number;
  totalExpenses: number;
  netProfit: number;
  satisfactionPct: number;
  reputationStars: number;
  customerReviews: SimCustomerReview[];
  dilemmaResolved?: {
    title: string;
    chosenOption: string;
    outcomeText: string;
  };
}

export interface SimGameState {
  missionId: string;
  businessTitle: string;
  businessIcon: string;
  businessCategory: string;
  targetProfitGoal: number;
  minSatisfactionGoal: number;
  currentDay: number; // 1 to 5
  totalDays: number;
  cash: number;
  startingCash: number;
  cumulativeProfit: number;
  satisfaction: number; // 0 to 100
  reputation: number; // 1.0 to 5.0
  dayHistory: SimDayResult[];
  unlockedUpgrades: string[];
  phase: 'planning' | 'simulating' | 'dilemma' | 'day_audit' | 'sprint_complete';
}

export type AppViewMode = 
  | 'game'
  | 'tycoon_sim'
  | 'campaign_map'
  | 'badges'
  | 'certificate'
  | 'presentation'
  | 'worksheet_print'
  | 'deck_library'
  | 'custom_builder';

export type GameStep = 
  | 'briefing'          // Page 1: Case File, Standard, Target, Event & Challenge
  | 'strategy_compare'  // Page 2: Step 1 Compare 3 Fixes
  | 'show_math'         // Page 2: Step 2 Calculate the numbers
  | 'recommendation_memo'// Page 3: Step 3 Pitch & Defense
  | 'round_results'     // Feedback & Score
  | 'exit_ticket';      // Page 4: Exit ticket & reflections

