import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Users, Smile, Frown, 
  Zap, Star, Play, Pause, FastForward, RotateCcw, AlertTriangle, 
  CheckCircle2, Sparkles, Trophy, ShoppingBag, ChefHat, Megaphone, 
  ArrowRight, Flame, ShieldAlert, Award, FileText, ChevronRight,
  Info, Clock, HelpCircle, Map
} from 'lucide-react';
import { 
  SimGameState, SimDayResult, SimQualityTier, SimStaffingLevel, 
  SimMarketingCampaign, SimUpgrade, SimDailyDilemma, StudentProfile,
  CampaignMission
} from '../types';
import { BusinessSimConfig, BUSINESS_SIM_CONFIGS, AVAILABLE_SIM_UPGRADES, SIM_DILEMMAS } from '../data/simGameData';
import { simulateSingleDay } from '../utils/simEngine';
import { soundEffects } from '../utils/audio';
import { triggerConfetti, triggerBigCelebration } from '../utils/confetti';

interface TycoonGameViewProps {
  profile: StudentProfile;
  activeMission?: CampaignMission | null;
  onFinishSprint: (finalProfit: number, stars: number, xpEarned: number) => void;
  onSwitchToBoardMode: () => void;
  onReturnToMap: () => void;
}

export const TycoonGameView: React.FC<TycoonGameViewProps> = ({
  profile,
  activeMission,
  onFinishSprint,
  onSwitchToBoardMode,
  onReturnToMap,
}) => {
  // Determine business config from active mission or default
  const configKey = activeMission?.business.id.includes('boba') ? 'snack-stand' :
                    activeMission?.business.id.includes('pizza') ? 'pizza-parlor' :
                    activeMission?.business.id.includes('screen') || activeMission?.business.id.includes('repair') ? 'tech-repair' :
                    activeMission?.business.id.includes('merch') ? 'apparel-depot' :
                    activeMission?.business.id.includes('food') || activeMission?.business.id.includes('truck') ? 'food-truck' :
                    'pizza-parlor';

  const config: BusinessSimConfig = BUSINESS_SIM_CONFIGS[configKey] || BUSINESS_SIM_CONFIGS['pizza-parlor'];

  // Game Engine State
  const [gameState, setGameState] = useState<SimGameState>(() => ({
    missionId: activeMission?.id || 'sandbox-sim',
    businessTitle: activeMission?.business.title || config.name,
    businessIcon: config.icon,
    businessCategory: config.category,
    targetProfitGoal: config.turnaroundTargetProfit5Days,
    minSatisfactionGoal: 70,
    currentDay: 1,
    totalDays: 5,
    cash: config.initialCash,
    startingCash: config.initialCash,
    cumulativeProfit: 0,
    satisfaction: 75,
    reputation: 3.8,
    dayHistory: [],
    unlockedUpgrades: [],
    phase: 'planning',
  }));

  // Daily Planning Form Inputs
  const [price, setPrice] = useState<number>(config.idealPrice);
  const [quality, setQuality] = useState<SimQualityTier>('standard');
  const [staffing, setStaffing] = useState<SimStaffingLevel>('balanced');
  const [marketing, setMarketing] = useState<SimMarketingCampaign>('none');
  
  // Live Simulation State
  const [simHour, setSimHour] = useState<number>(8); // 8 AM to 20 (8 PM)
  const [simProgress, setSimProgress] = useState<number>(0); // 0 to 100%
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x or 2x
  const [liveRevenue, setLiveRevenue] = useState<number>(0);
  const [liveExpenses, setLiveExpenses] = useState<number>(0);
  const [liveCustomersServed, setLiveCustomersServed] = useState<number>(0);
  const [liveWalkouts, setLiveWalkouts] = useState<number>(0);
  const [activeCustomers, setActiveCustomers] = useState<{ id: string; emoji: string; text: string; type: 'happy' | 'walkout' | 'paying' }[]>([]);
  
  // Active Mid-Day Dilemma
  const [activeDilemma, setActiveDilemma] = useState<SimDailyDilemma | null>(null);
  const [chosenDilemmaIndex, setChosenDilemmaIndex] = useState<number | null>(null);
  
  // Simulation calculation cache for current day
  const [currentDayResult, setCurrentDayResult] = useState<SimDayResult | null>(null);

  // Sound effects & ticker interval ref
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Unit Economics helper calculations for UI
  const unitCostMultiplier = quality === 'budget' ? 0.68 : quality === 'premium' ? 1.42 : 1.0;
  const bulkDiscount = gameState.unlockedUpgrades.includes('bulk_supplier_deal') ? 0.85 : 1.0;
  const estimatedUnitCost = Number((config.baseUnitCost * unitCostMultiplier * bulkDiscount).toFixed(2));
  const estimatedMarginPerUnit = Number((price - estimatedUnitCost).toFixed(2));
  const marginPct = price > 0 ? (estimatedMarginPerUnit / price) * 100 : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  // Handle Buy Upgrade
  const handleBuyUpgrade = (upgrade: SimUpgrade) => {
    if (gameState.cash >= upgrade.cost && !gameState.unlockedUpgrades.includes(upgrade.id)) {
      soundEffects.playSuccess();
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - upgrade.cost,
        unlockedUpgrades: [...prev.unlockedUpgrades, upgrade.id],
      }));
    } else {
      soundEffects.playError();
    }
  };

  // Start Live Simulation Run
  const handleStartSimulation = () => {
    soundEffects.playSelect();

    // Check if a dilemma triggers on this day (e.g. Day 1, 2, 4 have dilemmas)
    const dilemmaPool = SIM_DILEMMAS;
    const possibleDilemma = dilemmaPool[(gameState.currentDay - 1) % dilemmaPool.length];

    // Compute expected day end result
    const preResult = simulateSingleDay({
      dayNumber: gameState.currentDay,
      config,
      price,
      quality,
      staffing,
      marketing,
      unlockedUpgradeIds: gameState.unlockedUpgrades,
      currentReputation: gameState.reputation,
    });
    setCurrentDayResult(preResult);

    // Reset live counters
    setSimHour(8);
    setSimProgress(0);
    setLiveRevenue(0);
    setLiveExpenses(Math.round(preResult.fixedRentExpenses + preResult.laborExpenses + preResult.marketingExpenses));
    setLiveCustomersServed(0);
    setLiveWalkouts(0);
    setActiveCustomers([]);
    setActiveDilemma(null);
    setChosenDilemmaIndex(null);

    setGameState((prev) => ({ ...prev, phase: 'simulating' }));

    // Start Simulation Loop
    runSimulationLoop(preResult, possibleDilemma);
  };

  // Run the tick animation
  const runSimulationLoop = (preResult: SimDayResult, possibleDilemma: SimDailyDilemma | null) => {
    let currentStep = 0;
    const totalSteps = 24; // 8 AM to 8 PM in 30-min ticks
    let dilemmaTriggered = false;

    if (simTimerRef.current) clearInterval(simTimerRef.current);

    simTimerRef.current = setInterval(() => {
      currentStep++;
      const progress = (currentStep / totalSteps) * 100;
      const hour = 8 + Math.floor(currentStep / 2);
      
      setSimProgress(progress);
      setSimHour(hour);

      // Interpolate financials
      const fraction = currentStep / totalSteps;
      const curServed = Math.round(preResult.servedCustomers * fraction);
      const curWalkouts = Math.round(preResult.walkouts * fraction);
      const curRev = Math.round(preResult.revenue * fraction);
      const curExp = Math.round(
        (preResult.fixedRentExpenses + preResult.laborExpenses + preResult.marketingExpenses) +
        (preResult.cogsExpenses * fraction)
      );

      setLiveCustomersServed(curServed);
      setLiveWalkouts(curWalkouts);
      setLiveRevenue(curRev);
      setLiveExpenses(curExp);

      // Customer sprite bubble animation
      if (Math.random() > 0.35) {
        soundEffects.playCoin();
        const emojis = ['🧑‍🎓', '👩‍💼', '🧔', '👧', '🧑‍🔬', '🏃‍♂️', '👩‍🎨'];
        const reactions: Array<{ text: string; type: 'happy' | 'paying' | 'walkout' }> = [
          { text: `+$${price.toFixed(2)}`, type: 'paying' },
          { text: '😍 Delicious!', type: 'happy' },
          { text: '⚡ Super fast!', type: 'happy' },
          { text: '⭐ 5 Stars!', type: 'happy' },
        ];
        if (preResult.walkouts > 5 && Math.random() > 0.6) {
          reactions.push({ text: '😡 Line too long!', type: 'walkout' });
        }
        if (price > config.idealPrice * 1.3 && Math.random() > 0.5) {
          reactions.push({ text: '💸 Pricey!', type: 'walkout' });
        }

        const pickedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const pickedReaction = reactions[Math.floor(Math.random() * reactions.length)];

        setActiveCustomers((prev) => [
          ...prev.slice(-4),
          { id: `c-${Date.now()}-${Math.random()}`, emoji: pickedEmoji, text: pickedReaction.text, type: pickedReaction.type },
        ]);
      }

      // Check Dilemma Trigger
      if (possibleDilemma && hour >= possibleDilemma.triggerHour && !dilemmaTriggered) {
        dilemmaTriggered = true;
        if (simTimerRef.current) clearInterval(simTimerRef.current);
        soundEffects.playAlert();
        setActiveDilemma(possibleDilemma);
        setGameState((prev) => ({ ...prev, phase: 'dilemma' }));
      }

      // End of Day
      if (currentStep >= totalSteps) {
        if (simTimerRef.current) clearInterval(simTimerRef.current);
        completeDaySimulation(preResult, null);
      }
    }, 450 / simSpeed);
  };

  // Handle player choice on Dilemma
  const handleResolveDilemma = (choiceIndex: number) => {
    if (!activeDilemma) return;
    soundEffects.playSuccess();
    setChosenDilemmaIndex(choiceIndex);

    // Re-calculate day with dilemma impact
    const finalDayResult = simulateSingleDay({
      dayNumber: gameState.currentDay,
      config,
      price,
      quality,
      staffing,
      marketing,
      unlockedUpgradeIds: gameState.unlockedUpgrades,
      currentReputation: gameState.reputation,
      dilemmaChoice: {
        dilemma: activeDilemma,
        choiceIndex,
      },
    });

    setCurrentDayResult(finalDayResult);
    setActiveDilemma(null);

    // Resume simulation to close the day
    completeDaySimulation(finalDayResult, activeDilemma.choices[choiceIndex].outcomeText);
  };

  // Finalize Day Audit
  const completeDaySimulation = (result: SimDayResult, dilemmaNote: string | null) => {
    soundEffects.playSuccess();
    if (result.netProfit > 50) {
      triggerConfetti();
    }

    setLiveRevenue(result.revenue);
    setLiveExpenses(result.totalExpenses);
    setLiveCustomersServed(result.servedCustomers);
    setLiveWalkouts(result.walkouts);

    // Update Game State
    setGameState((prev) => {
      const nextCash = prev.cash + result.netProfit;
      const nextCumulativeProfit = prev.cumulativeProfit + result.netProfit;
      const nextSatisfaction = Math.round((prev.satisfaction * 0.4) + (result.satisfactionPct * 0.6));
      const nextReputation = Number(((prev.reputation * 0.6) + (result.reputationStars * 0.4)).toFixed(1));

      return {
        ...prev,
        cash: nextCash,
        cumulativeProfit: nextCumulativeProfit,
        satisfaction: nextSatisfaction,
        reputation: nextReputation,
        dayHistory: [...prev.dayHistory, result],
        phase: prev.currentDay >= prev.totalDays ? 'sprint_complete' : 'day_audit',
      };
    });
  };

  // Move to next day in 5-day sprint
  const handleProceedToNextDay = () => {
    soundEffects.playSelect();
    setGameState((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      phase: 'planning',
    }));
  };

  // Restart 5-day sprint
  const handleRestartSprint = () => {
    soundEffects.playCardFlip();
    setGameState({
      missionId: activeMission?.id || 'sandbox-sim',
      businessTitle: activeMission?.business.title || config.name,
      businessIcon: config.icon,
      businessCategory: config.category,
      targetProfitGoal: config.turnaroundTargetProfit5Days,
      minSatisfactionGoal: 70,
      currentDay: 1,
      totalDays: 5,
      cash: config.initialCash,
      startingCash: config.initialCash,
      cumulativeProfit: 0,
      satisfaction: 75,
      reputation: 3.8,
      dayHistory: [],
      unlockedUpgrades: [],
      phase: 'planning',
    });
  };

  // Finish Sprint & Award XP
  const handleClaimSprintRewards = () => {
    let stars = 3;
    if (gameState.cumulativeProfit >= config.turnaroundTargetProfit5Days && gameState.satisfaction >= 75) {
      stars = 5;
      triggerBigCelebration();
    } else if (gameState.cumulativeProfit >= config.turnaroundTargetProfit5Days * 0.8) {
      stars = 4;
      triggerConfetti();
    }

    const xp = stars * 150 + Math.max(0, Math.round(gameState.cumulativeProfit / 2));
    onFinishSprint(gameState.cumulativeProfit, stars, xp);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Turnaround HUD Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg border border-cyan-400/40 shrink-0">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  {gameState.businessCategory} • 5-Day Turnaround Sprint
                </span>
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {gameState.reputation} / 5.0 Rep
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                {gameState.businessTitle}
              </h1>
            </div>
          </div>

          {/* Real-time Metric Dials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Cash in Bank */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Cash Bank</span>
              <div className="text-emerald-400 font-mono font-black text-lg flex items-center justify-center gap-0.5">
                <DollarSign className="w-4 h-4" /> {gameState.cash}
              </div>
            </div>

            {/* Total Profit */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">5-Day Profit</span>
              <div className={`font-mono font-black text-lg flex items-center justify-center gap-0.5 ${
                gameState.cumulativeProfit >= 0 ? 'text-cyan-400' : 'text-rose-400'
              }`}>
                ${gameState.cumulativeProfit}
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Satisfaction</span>
              <div className={`font-mono font-black text-lg flex items-center justify-center gap-1 ${
                gameState.satisfaction >= 75 ? 'text-emerald-400' : gameState.satisfaction >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                <Smile className="w-4 h-4" /> {gameState.satisfaction}%
              </div>
            </div>

            {/* Turnaround Goal Progress */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Target Goal</span>
              <div className="text-amber-400 font-mono font-black text-lg">
                ${config.turnaroundTargetProfit5Days}
              </div>
            </div>
          </div>
        </div>

        {/* Day Tracker Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((d) => (
              <div
                key={d}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  d === gameState.currentDay && gameState.phase !== 'sprint_complete'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : d < gameState.currentDay || gameState.phase === 'sprint_complete'
                    ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-300'
                    : 'bg-slate-800/60 text-slate-500 border border-slate-700/40'
                }`}
              >
                <span>Day {d}</span>
                {d < gameState.currentDay && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToBoardMode}
              className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1 transition underline cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Board Pitch Mode
            </button>
            <button
              type="button"
              onClick={onReturnToMap}
              className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1 transition underline cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" /> Mission Map
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: MORNING OPERATIONS & STRATEGY DECK (PLANNING PHASE)               */}
      {/* ========================================================================= */}
      {gameState.phase === 'planning' && (
        <div className="space-y-6">
          {/* Action Decision Hub */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-cyan-700 uppercase tracking-wider">
                  Day {gameState.currentDay} of 5 Morning Operations
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Set Today's Levers: Pricing, Quality & Staffing
                </h2>
              </div>
              <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl">
                Formula: <span className="font-mono font-bold text-slate-800">Revenue − Expenses = Profit</span>
              </div>
            </div>

            {/* 1. Pricing Slider & Elasticity Meter */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-bold text-slate-900 block">1. Set Unit Sale Price ($)</strong>
                  <span className="text-xs text-slate-500">
                    Baseline Market Standard: ${config.idealPrice.toFixed(2)} | Estimated Unit Cost: ${estimatedUnitCost}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-cyan-700">${price.toFixed(2)}</span>
                  <span className="block text-[11px] font-bold text-emerald-700">
                    Margin: +${estimatedMarginPerUnit} ({marginPct.toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={config.minPrice}
                  max={config.maxPrice}
                  step={0.25}
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
              </div>

              {/* Elasticity Feedback Callout */}
              <div className="text-xs flex items-center justify-between pt-1 text-slate-600">
                <span>🔻 Bargain ($ {config.minPrice.toFixed(2)})</span>
                <span className="font-bold text-slate-800">
                  {price > config.idealPrice * 1.35
                    ? '⚠️ High Price: High profit per item, but lower customer volume!'
                    : price < config.idealPrice * 0.8
                    ? '⚡ Bargain Price: Massive crowd volume, but slim profit margin!'
                    : '✅ Sweet Spot: Balanced customer volume and healthy margin.'}
                </span>
                <span>Premium ($ {config.maxPrice.toFixed(2)}) 🔺</span>
              </div>
            </div>

            {/* 2. Product Quality Tier (Ingredient & Materials) */}
            <div className="space-y-2">
              <strong className="text-sm font-bold text-slate-900 block">2. Select Quality Tier</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    tier: 'budget' as const,
                    title: 'Discount / Budget',
                    costDelta: '-32% Unit Cost',
                    satDelta: '-14% Satisfaction',
                    desc: 'Cuts ingredient costs, but risks negative reviews from picky eaters.',
                    icon: '📦',
                  },
                  {
                    tier: 'standard' as const,
                    title: 'Standard Grade',
                    costDelta: 'Normal Unit Cost',
                    satDelta: 'Balanced Satisfaction',
                    desc: 'Reliable, consistent everyday quality with standard customer reviews.',
                    icon: '👍',
                  },
                  {
                    tier: 'premium' as const,
                    title: 'Organic / Premium',
                    costDelta: '+42% Unit Cost',
                    satDelta: '+18% Satisfaction',
                    desc: 'Top-tier gourmet quality. Enables high price tolerance and glowing reviews!',
                    icon: '🌟',
                  },
                ].map((q) => (
                  <button
                    key={q.tier}
                    type="button"
                    onClick={() => {
                      soundEffects.playSelect();
                      setQuality(q.tier);
                    }}
                    className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                      quality === q.tier
                        ? 'border-cyan-600 bg-cyan-50/70 shadow-sm ring-2 ring-cyan-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{q.icon}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        q.tier === 'budget' ? 'bg-emerald-100 text-emerald-800' :
                        q.tier === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {q.costDelta}
                      </span>
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block">{q.title}</strong>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{q.desc}</p>
                    <span className="text-[11px] font-bold text-cyan-800 block mt-2">{q.satDelta}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Daily Staffing & Labor Level */}
            <div className="space-y-2">
              <strong className="text-sm font-bold text-slate-900 block">3. Set Staffing & Labor Schedule</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    lvl: 'understaffed' as const,
                    title: 'Understaffed (Solo)',
                    payroll: '$35 Daily Payroll',
                    capacity: 'Max 50 Orders/Day',
                    desc: 'Cuts labor costs to bone. Beware: Long queues cause angry customer walkouts!',
                    icon: '🏃',
                  },
                  {
                    lvl: 'balanced' as const,
                    title: 'Balanced Crew',
                    payroll: '$80 Daily Payroll',
                    capacity: 'Max 95 Orders/Day',
                    desc: 'Smooth regular operations and steady service speeds during normal hours.',
                    icon: '👥',
                  },
                  {
                    lvl: 'rush_ready' as const,
                    title: 'Rush Hour Ready',
                    payroll: '$135 Daily Payroll',
                    capacity: 'Max 160 Orders/Day',
                    desc: 'Extra staff on deck. Zero customer wait times and handles big surges easily.',
                    icon: '⚡',
                  },
                ].map((s) => (
                  <button
                    key={s.lvl}
                    type="button"
                    onClick={() => {
                      soundEffects.playSelect();
                      setStaffing(s.lvl);
                    }}
                    className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                      staffing === s.lvl
                        ? 'border-cyan-600 bg-cyan-50/70 shadow-sm ring-2 ring-cyan-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {s.payroll}
                      </span>
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block">{s.title}</strong>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                    <span className="text-[11px] font-bold text-emerald-700 block mt-2">{s.capacity}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Marketing Campaign */}
            <div className="space-y-2">
              <strong className="text-sm font-bold text-slate-900 block">4. Marketing & Promo Push</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    camp: 'none' as const,
                    title: 'Word of Mouth ($0)',
                    cost: '$0 Expense',
                    boost: 'Standard Organic Traffic',
                    icon: '🗣️',
                  },
                  {
                    camp: 'social_media' as const,
                    title: 'Social Media Blitz ($30)',
                    cost: '$30 Expense',
                    boost: '+28% Customer Foot Traffic',
                    icon: '📱',
                  },
                  {
                    camp: 'influencer' as const,
                    title: 'Local Influencer Drop ($75)',
                    cost: '$75 Expense',
                    boost: '+65% Huge Traffic Surge',
                    icon: '✨',
                  },
                ].map((m) => (
                  <button
                    key={m.camp}
                    type="button"
                    onClick={() => {
                      soundEffects.playSelect();
                      setMarketing(m.camp);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      marketing === m.camp
                        ? 'border-cyan-600 bg-cyan-50/70 shadow-sm ring-2 ring-cyan-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">{m.title}</strong>
                        <span className="text-[11px] text-cyan-800 font-bold">{m.boost}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Simulation Call-to-Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Ready to test today's decisions against real customer demand?
              </div>
              <button
                type="button"
                onClick={handleStartSimulation}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Simulate Day {gameState.currentDay}</span>
              </button>
            </div>
          </div>

          {/* Upgrades & Equipment Shop */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Equipment & Automation Upgrades
                </span>
                <h3 className="text-lg font-black text-white">Invest Business Cash in Permanent Improvements</h3>
              </div>
              <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-400">
                Available Cash: ${gameState.cash}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {AVAILABLE_SIM_UPGRADES.map((u) => {
                const isUnlocked = gameState.unlockedUpgrades.includes(u.id);
                const canAfford = gameState.cash >= u.cost;

                return (
                  <div
                    key={u.id}
                    className={`p-4 rounded-2xl border transition ${
                      isUnlocked
                        ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{u.icon}</span>
                      {isUnlocked ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Active ✓
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-black text-amber-400">${u.cost}</span>
                      )}
                    </div>
                    <strong className="text-xs font-bold text-white block">{u.title}</strong>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{u.description}</p>
                    
                    {!isUnlocked && (
                      <button
                        type="button"
                        onClick={() => handleBuyUpgrade(u)}
                        disabled={!canAfford}
                        className={`mt-3 w-full py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? `Purchase ($${u.cost})` : `Need $${u.cost - gameState.cash} more`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: LIVE DAY SIMULATION VISUALIZER                                     */}
      {/* ========================================================================= */}
      {gameState.phase === 'simulating' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          {/* Live Timeline & Speed Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono text-cyan-400 flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
                {simHour > 12 ? `${simHour - 12}:00 PM` : `${simHour}:00 AM`}
              </span>
              <span className="text-xs text-slate-400 font-bold bg-slate-800 px-3 py-1 rounded-full">
                Simulating Day {gameState.currentDay} ({currentDayResult?.dayName})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimSpeed((prev) => (prev === 1 ? 2 : 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5 text-cyan-400" /> {simSpeed}x Speed
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${simProgress}%` }}
            />
          </div>

          {/* Live Interactive Storefront Stage */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl p-6 border border-slate-800 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
            {/* Storefront Header */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <ChefHat className="w-4 h-4 text-amber-400" /> Storefront Active Queue
              </span>
              <span>Price: ${price.toFixed(2)} | Staff: {staffing}</span>
            </div>

            {/* Animated Customer Reaction Bubbles */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-6 min-h-[100px]">
              {activeCustomers.map((c) => (
                <div
                  key={c.id}
                  className={`animate-bounce px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg border ${
                    c.type === 'paying'
                      ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200'
                      : c.type === 'walkout'
                      ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                      : 'bg-cyan-950/90 border-cyan-500 text-cyan-200'
                  }`}
                >
                  <span className="text-base">{c.emoji}</span>
                  <span>{c.text}</span>
                </div>
              ))}
              {activeCustomers.length === 0 && (
                <span className="text-slate-500 text-xs italic">Customers entering the doors...</span>
              )}
            </div>

            {/* Live Formula Ticker Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-center">
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Served</span>
                <strong className="text-cyan-400 font-mono text-base">{liveCustomersServed}</strong>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Walkouts</span>
                <strong className="text-rose-400 font-mono text-base">{liveWalkouts}</strong>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Revenue</span>
                <strong className="text-emerald-400 font-mono text-base">+${liveRevenue}</strong>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Live Profit</span>
                <strong className={`font-mono text-base ${liveRevenue - liveExpenses >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${liveRevenue - liveExpenses}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: MID-DAY CRISIS DILEMMA POPUP                                      */}
      {/* ========================================================================= */}
      {gameState.phase === 'dilemma' && activeDilemma && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-3xl">
              {activeDilemma.icon}
            </div>
            <div>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                Live Decision Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{activeDilemma.title}</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-800">
            {activeDilemma.description}
          </p>

          <div className="space-y-3">
            <strong className="text-xs uppercase tracking-wider text-slate-400 block font-bold">
              Choose Your Response Strategy:
            </strong>
            <div className="grid grid-cols-1 gap-3">
              {activeDilemma.choices.map((choice, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleResolveDilemma(idx)}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500 text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {choice.label}
                    </strong>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold">
                      {choice.cost !== 0 && (
                        <span className={choice.cost > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                          {choice.cost > 0 ? `-$${choice.cost} Cash` : `+$${Math.abs(choice.cost)} Saved`}
                        </span>
                      )}
                      {choice.satBonus !== 0 && (
                        <span className={choice.satBonus > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {choice.satBonus > 0 ? `+${choice.satBonus}% Sat` : `${choice.satBonus}% Sat`}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{choice.detail}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4: EVENING FINANCIAL AUDIT & CUSTOMER REVIEWS                        */}
      {/* ========================================================================= */}
      {gameState.phase === 'day_audit' && currentDayResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                End of Day {currentDayResult.dayNumber} Financial Audit
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentDayResult.dayName} Results & Customer Sentiment
              </h2>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">
              Formula: Rev (${currentDayResult.revenue}) − Exp (${currentDayResult.totalExpenses}) = Profit (${currentDayResult.netProfit})
            </div>
          </div>

          {/* Golden Equation Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Total Revenue</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-950 mt-1">
                ${currentDayResult.revenue}
              </div>
              <span className="text-xs text-emerald-700 font-medium">
                {currentDayResult.servedCustomers} orders @ ${currentDayResult.price.toFixed(2)}
              </span>
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
              <span className="text-xs font-bold text-rose-800 uppercase block">Total Expenses</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-rose-950 mt-1">
                ${currentDayResult.totalExpenses}
              </div>
              <span className="text-xs text-rose-700 font-medium">
                Rent + Labor + Ingredients + Ads
              </span>
            </div>

            <div className={`rounded-2xl p-4 border ${
              currentDayResult.netProfit >= 0 ? 'bg-cyan-50 border-cyan-200' : 'bg-rose-100 border-rose-300'
            }`}>
              <span className="text-xs font-bold text-slate-700 uppercase block">Net Daily Profit</span>
              <div className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${
                currentDayResult.netProfit >= 0 ? 'text-cyan-950' : 'text-rose-900'
              }`}>
                ${currentDayResult.netProfit}
              </div>
              <span className="text-xs font-bold text-slate-600">
                {currentDayResult.revenue > 0 ? `${((currentDayResult.netProfit / currentDayResult.revenue) * 100).toFixed(1)}% Margin` : '0%'}
              </span>
            </div>
          </div>

          {/* Detailed Itemized P&L Expense Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
            <strong className="text-slate-800 uppercase tracking-wider font-bold block mb-2">Itemized Expense Breakdown:</strong>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
              <div>Fixed Facility Rent: <strong className="font-mono text-slate-900">${currentDayResult.fixedRentExpenses}</strong></div>
              <div>Staff Labor: <strong className="font-mono text-slate-900">${currentDayResult.laborExpenses}</strong></div>
              <div>Ingredients/COGS: <strong className="font-mono text-slate-900">${currentDayResult.cogsExpenses}</strong></div>
              <div>Marketing & Ads: <strong className="font-mono text-slate-900">${currentDayResult.marketingExpenses}</strong></div>
            </div>
          </div>

          {/* Customer Reviews Feed */}
          <div className="space-y-3">
            <strong className="text-xs uppercase tracking-wider text-slate-700 font-bold block flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-amber-500" /> Customer Reviews from Today's Crowd:
            </strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentDayResult.customerReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span>{rev.avatar}</span> {rev.author}
                    </span>
                    <div className="flex text-amber-400">
                      {'★'.repeat(rev.stars)}
                      <span className="text-slate-300">{'★'.repeat(5 - rev.stars)}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Proceed Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleProceedToNextDay}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>Plan Day {gameState.currentDay + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 5: 5-DAY TURNAROUND VICTORY / SPRINT COMPLETE                       */}
      {/* ========================================================================= */}
      {gameState.phase === 'sprint_complete' && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-2xl space-y-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40">
            <Trophy className="w-4 h-4 text-emerald-400" />
            5-Day Turnaround Completed!
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {gameState.cumulativeProfit >= config.turnaroundTargetProfit5Days ? '🎉 Business Rescued Successfully!' : 'Turnaround Sprint Finished!'}
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            You guided {config.name} through 5 consecutive days of operational decisions, pricing adjustments, and crisis dilemmas!
          </p>

          {/* Cumulative Score Card */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-lg mx-auto grid grid-cols-3 gap-3">
            <div>
              <span className="text-slate-400 text-[10px] font-black uppercase block">Total 5-Day Profit</span>
              <strong className="text-emerald-400 font-mono text-xl sm:text-2xl font-black">${gameState.cumulativeProfit}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-black uppercase block">Avg Satisfaction</span>
              <strong className="text-cyan-400 font-mono text-xl sm:text-2xl font-black">{gameState.satisfaction}%</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-black uppercase block">Final Rep</span>
              <strong className="text-amber-400 font-mono text-xl sm:text-2xl font-black">⭐ {gameState.reputation}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestartSprint}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay 5-Day Sprint
            </button>

            <button
              type="button"
              onClick={onSwitchToBoardMode}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Draft Board Memo & Exit Ticket</span>
            </button>

            <button
              type="button"
              onClick={handleClaimSprintRewards}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Claim XP & Return to Map</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
