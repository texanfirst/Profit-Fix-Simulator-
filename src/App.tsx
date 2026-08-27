/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppViewMode, GameStep, BusinessCard, EventCard, 
  ChallengeCard, StrategyCard, RoundStudentInput, TeamScore,
  StudentProfile, CampaignMission 
} from './types';
import { 
  DEFAULT_BUSINESS_CARDS, DEFAULT_EVENT_CARDS, 
  DEFAULT_CHALLENGE_CARDS, DEFAULT_STRATEGY_CARDS 
} from './data/defaultDecks';
import { CAMPAIGN_MISSIONS, CONSULTANT_RANKS, ACHIEVEMENT_BADGES } from './data/campaignMissions';
import { calculateRoundData, evaluateStudentSubmission, BoardEvaluation } from './utils/gameLogic';
import { soundEffects } from './utils/audio';

import { Header } from './components/Header';
import { CampaignMapView } from './components/CampaignMapView';
import { BusinessBriefStep } from './components/BusinessBriefStep';
import { StrategyCompareStep } from './components/StrategyCompareStep';
import { ShowMathStep } from './components/ShowMathStep';
import { RecommendationMemoStep } from './components/RecommendationMemoStep';
import { ExitTicketStep } from './components/ExitTicketStep';
import { RoundResultsModal } from './components/RoundResultsModal';
import { ConsultantProfileModal } from './components/ConsultantProfileModal';
import { AdvisorHelpModal } from './components/AdvisorHelpModal';
import { OfficialCertificateModal } from './components/OfficialCertificateModal';
import { PresentationMode } from './components/PresentationMode';
import { PrintableWorksheet } from './components/PrintableWorksheet';
import { DeckBuilderModal } from './components/DeckBuilderModal';
import { TycoonGameView } from './components/TycoonGameView';

const STORAGE_KEY = 'profit_fix_student_profile_v1';

const INITIAL_PROFILE: StudentProfile = {
  name: 'Alex Turner',
  avatar: '🎓',
  avatarColor: 'from-cyan-500 to-blue-600',
  consultantRank: 'Junior Turnaround Analyst',
  level: 1,
  xp: 0,
  careerProfit: 0,
  streak: 1,
  completedMissionIds: [],
  unlockedBadgeIds: ['first_turnaround'],
  missionStars: {},
};

export default function App() {
  // Student Profile State (with LocalStorage persistence)
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROFILE;
  });

  // App views
  const [viewMode, setViewMode] = useState<AppViewMode>('campaign_map');
  const [gameStep, setGameStep] = useState<GameStep>('briefing');
  const [isMuted, setIsMuted] = useState(false);

  // Active Campaign Mission (null = Sandbox Quick Play)
  const [activeMission, setActiveMission] = useState<CampaignMission | null>(CAMPAIGN_MISSIONS[0]);

  // Deck Libraries
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>(DEFAULT_BUSINESS_CARDS);
  const [eventCards, setEventCards] = useState<EventCard[]>(DEFAULT_EVENT_CARDS);
  const [challengeCards, setChallengeCards] = useState<ChallengeCard[]>(DEFAULT_CHALLENGE_CARDS);
  const [strategyCards, setStrategyCards] = useState<StrategyCard[]>(DEFAULT_STRATEGY_CARDS);

  // Modals
  const [isDeckBuilderOpen, setIsDeckBuilderOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdvisorHelpOpen, setIsAdvisorHelpOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  // Active Round Cards
  const [currentBusiness, setCurrentBusiness] = useState<BusinessCard>(CAMPAIGN_MISSIONS[0].business);
  const [drawnEvent, setDrawnEvent] = useState<EventCard | null>(CAMPAIGN_MISSIONS[0].event);
  const [drawnChallenge, setDrawnChallenge] = useState<ChallengeCard | null>(CAMPAIGN_MISSIONS[0].challenge);
  
  // Drawn Strategies available in current round
  const [availableStrategies, setAvailableStrategies] = useState<StrategyCard[]>(DEFAULT_STRATEGY_CARDS.slice(0, 6));
  const [selectedStrategies, setSelectedStrategies] = useState<StrategyCard[]>(DEFAULT_STRATEGY_CARDS.slice(0, 3));
  const [chosenStrategy, setChosenStrategy] = useState<StrategyCard | null>(DEFAULT_STRATEGY_CARDS[0]);

  // Student inputs for current round
  const [studentInput, setStudentInput] = useState<RoundStudentInput>({
    selectedStrategyIds: [DEFAULT_STRATEGY_CARDS[0].id, DEFAULT_STRATEGY_CARDS[1].id, DEFAULT_STRATEGY_CARDS[2].id],
    chosenStrategyId: DEFAULT_STRATEGY_CARDS[0].id,
    userRevenueCalc: '',
    userExpenseCalc: '',
    userProfitCalc: '',
    memo: {
      teamRecommendation: DEFAULT_STRATEGY_CARDS[0].title,
      whyBestDecision: '',
      marketForce: 'Price',
      riskTradeoff: '',
      miniPitch: '',
    },
    exitTicket: {
      q1IsProfit: '',
      q1MathWork: '',
      q2ShouldDoIt: '',
      q2Reasoning: '',
      reflectionLearned: '',
      reflectionBusyNotProfitable: '',
    },
  });

  // Board Evaluation & Rewards
  const [evaluation, setEvaluation] = useState<BoardEvaluation | null>(null);
  const [lastEarnedXP, setLastEarnedXP] = useState(0);
  const [newBadgesEarned, setNewBadgesEarned] = useState<string[]>([]);

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Active calculated round data
  const calcData = calculateRoundData(
    currentBusiness,
    drawnEvent,
    selectedStrategies,
    chosenStrategy
  );

  // Sound mute sync
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

  // Launch a Mission from the Map
  const handleSelectMission = (mission: CampaignMission) => {
    soundEffects.playCardFlip();
    setActiveMission(mission);
    setCurrentBusiness(mission.business);
    setDrawnEvent(mission.event);
    setDrawnChallenge(mission.challenge);

    // Shuffle and pick 6 strategies
    const shuffled = [...strategyCards].sort(() => 0.5 - Math.random());
    const hand = shuffled.slice(0, 6);
    setAvailableStrategies(hand);
    setSelectedStrategies(hand.slice(0, 3));
    setChosenStrategy(hand[0]);

    // Reset student inputs
    setStudentInput({
      selectedStrategyIds: [hand[0].id, hand[1].id, hand[2].id],
      chosenStrategyId: hand[0].id,
      userRevenueCalc: '',
      userExpenseCalc: '',
      userProfitCalc: '',
      memo: {
        teamRecommendation: hand[0].title,
        whyBestDecision: '',
        marketForce: hand[0].primaryMarketForce,
        riskTradeoff: '',
        miniPitch: '',
      },
      exitTicket: {
        q1IsProfit: '',
        q1MathWork: '',
        q2ShouldDoIt: '',
        q2Reasoning: '',
        reflectionLearned: '',
        reflectionBusyNotProfitable: '',
      },
    });

    setGameStep('briefing');
    setViewMode('game');
  };

  // Launch 5-Day Tycoon Simulation
  const handleStartTycoonSim = (mission?: CampaignMission) => {
    soundEffects.playCardFlip();
    if (mission) {
      setActiveMission(mission);
      setCurrentBusiness(mission.business);
      setDrawnEvent(mission.event);
      setDrawnChallenge(mission.challenge);
    }
    setViewMode('tycoon_sim');
  };

  // Handle Finish of 5-Day Tycoon Sprint
  const handleFinishSprint = (finalProfit: number, stars: number, xpEarned: number) => {
    setProfile((prev) => {
      const totalXP = prev.xp + xpEarned;
      let newLevel = prev.level;
      let rankTitle = prev.consultantRank;

      for (const rank of CONSULTANT_RANKS) {
        if (totalXP >= rank.minXP && rank.level >= newLevel) {
          newLevel = rank.level;
          rankTitle = rank.title;
        }
      }

      const completedIds = activeMission 
        ? Array.from(new Set([...prev.completedMissionIds, activeMission.id]))
        : prev.completedMissionIds;

      const updatedStars = { ...prev.missionStars };
      if (activeMission) {
        const bestStars = Math.max(updatedStars[activeMission.id] || 0, stars);
        updatedStars[activeMission.id] = bestStars;
      }

      const currentUnlocked = new Set(prev.unlockedBadgeIds);
      if (!currentUnlocked.has('first_turnaround')) currentUnlocked.add('first_turnaround');
      if (finalProfit >= 400 && !currentUnlocked.has('profit_titan')) currentUnlocked.add('profit_titan');
      if (stars >= 5 && !currentUnlocked.has('defense_master')) currentUnlocked.add('defense_master');

      return {
        ...prev,
        level: newLevel,
        consultantRank: rankTitle,
        xp: totalXP,
        careerProfit: prev.careerProfit + finalProfit,
        streak: prev.streak + 1,
        completedMissionIds: completedIds,
        unlockedBadgeIds: Array.from(currentUnlocked),
        missionStars: updatedStars,
      };
    });

    setViewMode('campaign_map');
  };

  // Start Sandbox Quick Play
  const handleStartQuickPlay = () => {
    soundEffects.playSelect();
    setActiveMission(null);
    drawRandomBusiness();
    drawRandomEvent();
    drawRandomChallenge();
    drawMoreStrategies();
    setGameStep('briefing');
    setViewMode('game');
  };

  // Card Draw helpers
  const drawRandomBusiness = () => {
    const remaining = businessCards.filter((b) => b.id !== currentBusiness.id);
    const pool = remaining.length > 0 ? remaining : businessCards;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCurrentBusiness(random);
  };

  const drawRandomEvent = () => {
    const remaining = eventCards.filter((e) => e.id !== drawnEvent?.id);
    const pool = remaining.length > 0 ? remaining : eventCards;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setDrawnEvent(random);
  };

  const drawRandomChallenge = () => {
    const remaining = challengeCards.filter((c) => c.id !== drawnChallenge?.id);
    const pool = remaining.length > 0 ? remaining : challengeCards;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setDrawnChallenge(random);
  };

  const drawMoreStrategies = () => {
    const shuffled = [...strategyCards].sort(() => 0.5 - Math.random());
    const newAvailable = shuffled.slice(0, 6);
    setAvailableStrategies(newAvailable);
    setSelectedStrategies(newAvailable.slice(0, 3));
    setChosenStrategy(newAvailable[0]);
  };

  // Strategy selection handlers
  const handleToggleSelectStrategy = (strat: StrategyCard) => {
    if (selectedStrategies.some((s) => s.id === strat.id)) {
      setSelectedStrategies(selectedStrategies.filter((s) => s.id !== strat.id));
      if (chosenStrategy?.id === strat.id) {
        const remaining = selectedStrategies.filter((s) => s.id !== strat.id);
        setChosenStrategy(remaining.length > 0 ? remaining[0] : null);
      }
    } else {
      if (selectedStrategies.length < 3) {
        setSelectedStrategies([...selectedStrategies, strat]);
        if (!chosenStrategy) {
          setChosenStrategy(strat);
        }
      } else {
        const newSelected = [selectedStrategies[0], selectedStrategies[1], strat];
        setSelectedStrategies(newSelected);
      }
    }
  };

  const handleSelectBestStrategy = (strat: StrategyCard) => {
    if (!selectedStrategies.some((s) => s.id === strat.id)) {
      if (selectedStrategies.length < 3) {
        setSelectedStrategies([...selectedStrategies, strat]);
      } else {
        setSelectedStrategies([selectedStrategies[0], selectedStrategies[1], strat]);
      }
    }
    setChosenStrategy(strat);
    setStudentInput((prev) => ({
      ...prev,
      chosenStrategyId: strat.id,
      memo: {
        ...prev.memo,
        teamRecommendation: strat.title,
        marketForce: strat.primaryMarketForce,
      },
    }));
  };

  const handleUpdateStudentInput = (updates: Partial<RoundStudentInput>) => {
    setStudentInput((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Turnaround submission & gamification reward calculation
  const handleSubmitDecision = () => {
    const evalResult = evaluateStudentSubmission(
      currentBusiness,
      drawnEvent,
      drawnChallenge,
      chosenStrategy,
      calcData,
      studentInput
    );
    setEvaluation(evalResult);

    // Calculate XP
    let earnedXP = 300; // base turnaround reward
    if (evalResult.stars >= 4) earnedXP += 150;
    if (evalResult.stars === 5) earnedXP += 100;
    if (evalResult.isChallengeCompleted) earnedXP += 100;
    setLastEarnedXP(earnedXP);

    // Calculate new badges unlocked
    const newBadges: string[] = [];
    const currentUnlocked = new Set(profile.unlockedBadgeIds);

    if (!currentUnlocked.has('first_turnaround')) {
      currentUnlocked.add('first_turnaround');
      newBadges.push('First Turnaround');
    }
    if (calcData.profitMarginPct >= 25 && !currentUnlocked.has('margin_magician')) {
      currentUnlocked.add('margin_magician');
      newBadges.push('Margin Magician (25%+ Margin)');
    }
    if (calcData.finalProfit > 100 && !currentUnlocked.has('profit_titan')) {
      currentUnlocked.add('profit_titan');
      newBadges.push('Profit Titan ($100+ Profit)');
    }
    if (evalResult.stars === 5 && !currentUnlocked.has('defense_master')) {
      currentUnlocked.add('defense_master');
      newBadges.push('Master of Defense');
    }
    if (chosenStrategy?.expenseChange && chosenStrategy.expenseChange <= -40 && !currentUnlocked.has('cost_slasher')) {
      currentUnlocked.add('cost_slasher');
      newBadges.push('Cost Slasher');
    }

    setNewBadgesEarned(newBadges);

    // Update Profile
    setProfile((prev) => {
      const totalXP = prev.xp + earnedXP;
      let newLevel = prev.level;
      let rankTitle = prev.consultantRank;

      // Check level upgrades
      for (const rank of CONSULTANT_RANKS) {
        if (totalXP >= rank.minXP && rank.level >= newLevel) {
          newLevel = rank.level;
          rankTitle = rank.title;
        }
      }

      const completedIds = activeMission 
        ? Array.from(new Set([...prev.completedMissionIds, activeMission.id]))
        : prev.completedMissionIds;

      const updatedStars = { ...prev.missionStars };
      if (activeMission) {
        const bestStars = Math.max(updatedStars[activeMission.id] || 0, evalResult.stars);
        updatedStars[activeMission.id] = bestStars;
      }

      return {
        ...prev,
        level: newLevel,
        consultantRank: rankTitle,
        xp: totalXP,
        careerProfit: prev.careerProfit + calcData.finalProfit,
        streak: prev.streak + 1,
        completedMissionIds: completedIds,
        unlockedBadgeIds: Array.from(currentUnlocked),
        missionStars: updatedStars,
      };
    });

    setIsResultsModalOpen(true);
  };

  // Next round start
  const handleStartNextRound = () => {
    setIsResultsModalOpen(false);
    handleStartQuickPlay();
  };

  const handleUpdateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleResetProfile = () => {
    setProfile(INITIAL_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleResetToDefaults = () => {
    setBusinessCards(DEFAULT_BUSINESS_CARDS);
    setEventCards(DEFAULT_EVENT_CARDS);
    setChallengeCards(DEFAULT_CHALLENGE_CARDS);
    setStrategyCards(DEFAULT_STRATEGY_CARDS);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans selection:bg-cyan-200">
      {/* Top Student HUD */}
      <Header
        viewMode={viewMode}
        gameStep={gameStep}
        profile={profile}
        activeMissionTitle={activeMission?.title}
        isMuted={isMuted}
        onSelectStep={(step) => setGameStep(step)}
        onToggleViewMode={(mode) => setViewMode(mode)}
        onToggleMute={toggleMute}
        onOpenDeckBuilder={() => setIsDeckBuilderOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdvisorHelp={() => setIsAdvisorHelpOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onReturnToMap={() => setViewMode('campaign_map')}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* VIEW 1: Campaign Map (Main Hub for Independent Play) */}
        {viewMode === 'campaign_map' && (
          <CampaignMapView
            profile={profile}
            onSelectMission={handleSelectMission}
            onStartTycoonSim={handleStartTycoonSim}
            onStartSandbox={handleStartQuickPlay}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* VIEW 2: 5-Day Interactive Tycoon Simulator (Real-Time Game Mode) */}
        {viewMode === 'tycoon_sim' && (
          <TycoonGameView
            profile={profile}
            activeMission={activeMission}
            onFinishSprint={handleFinishSprint}
            onSwitchToBoardMode={() => {
              setGameStep('briefing');
              setViewMode('game');
            }}
            onReturnToMap={() => setViewMode('campaign_map')}
          />
        )}

        {/* VIEW 3: Standard Interactive 5-Step Turnaround Case */}
        {viewMode === 'game' && (
          <div>
            {gameStep === 'briefing' && (
              <BusinessBriefStep
                business={currentBusiness}
                event={drawnEvent}
                challenge={drawnChallenge}
                activeMission={activeMission}
                onDrawRandomBusiness={drawRandomBusiness}
                onDrawRandomEvent={drawRandomEvent}
                onDrawRandomChallenge={drawRandomChallenge}
                onProceedToStep1={() => setGameStep('strategy_compare')}
              />
            )}

            {gameStep === 'strategy_compare' && (
              <StrategyCompareStep
                business={currentBusiness}
                event={drawnEvent}
                availableStrategies={availableStrategies}
                selectedStrategies={selectedStrategies}
                chosenStrategy={chosenStrategy}
                onToggleSelectStrategy={handleToggleSelectStrategy}
                onSelectBestStrategy={handleSelectBestStrategy}
                onDrawMoreStrategies={drawMoreStrategies}
                onBack={() => setGameStep('briefing')}
                onProceedToShowMath={() => setGameStep('show_math')}
              />
            )}

            {gameStep === 'show_math' && chosenStrategy && (
              <ShowMathStep
                business={currentBusiness}
                event={drawnEvent}
                chosenStrategy={chosenStrategy}
                studentInput={studentInput}
                onUpdateInput={handleUpdateStudentInput}
                onBack={() => setGameStep('strategy_compare')}
                onProceedToMemo={() => setGameStep('recommendation_memo')}
              />
            )}

            {gameStep === 'recommendation_memo' && chosenStrategy && (
              <RecommendationMemoStep
                business={currentBusiness}
                event={drawnEvent}
                challenge={drawnChallenge}
                chosenStrategy={chosenStrategy}
                calcData={calcData}
                studentInput={studentInput}
                onUpdateInput={handleUpdateStudentInput}
                onSubmitDecision={handleSubmitDecision}
                onBack={() => setGameStep('show_math')}
              />
            )}

            {gameStep === 'exit_ticket' && (
              <ExitTicketStep
                studentInput={studentInput}
                onUpdateInput={handleUpdateStudentInput}
                onBackToGame={() => setGameStep('briefing')}
                onOpenPrintView={() => setViewMode('worksheet_print')}
              />
            )}
          </div>
        )}

        {/* VIEW 3: Printable Worksheets */}
        {viewMode === 'worksheet_print' && (
          <PrintableWorksheet
            business={currentBusiness}
            event={drawnEvent}
            challenge={drawnChallenge}
            selectedStrategies={selectedStrategies}
            chosenStrategy={chosenStrategy}
            studentInput={studentInput}
            onBack={() => setViewMode('game')}
          />
        )}
      </main>

      {/* Fullscreen View Mode 4: Teacher / Projector Mode */}
      {viewMode === 'presentation' && (
        <PresentationMode
          business={currentBusiness}
          event={drawnEvent}
          challenge={drawnChallenge}
          availableStrategies={availableStrategies}
          selectedStrategies={selectedStrategies}
          chosenStrategy={chosenStrategy}
          roundNumber={profile.missionsCompleted + 1}
          onExitPresentation={() => setViewMode('game')}
          onDrawRandomEvent={drawRandomEvent}
          onDrawRandomChallenge={drawRandomChallenge}
          onSelectBestStrategy={handleSelectBestStrategy}
        />
      )}

      {/* Board Review & Results Modal */}
      {evaluation && chosenStrategy && (
        <RoundResultsModal
          isOpen={isResultsModalOpen}
          business={currentBusiness}
          event={drawnEvent}
          challenge={drawnChallenge}
          chosenStrategy={chosenStrategy}
          calcData={calcData}
          evaluation={evaluation}
          studentInput={studentInput}
          profile={profile}
          earnedXP={lastEarnedXP}
          newBadgesEarned={newBadgesEarned}
          isCampaignMission={Boolean(activeMission)}
          onProceedToExitTicket={() => {
            setIsResultsModalOpen(false);
            setGameStep('exit_ticket');
          }}
          onProceedToMissionMap={() => {
            setIsResultsModalOpen(false);
            setViewMode('campaign_map');
          }}
          onStartNextRound={handleStartNextRound}
          onReplayRound={() => {
            setIsResultsModalOpen(false);
            setGameStep('strategy_compare');
          }}
        />
      )}

      {/* Consultant Profile & Badges Modal */}
      <ConsultantProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProfile}
        onOpenCertificate={() => {
          setIsProfileModalOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      {/* In-Game Advisor Playbook Modal */}
      <AdvisorHelpModal
        isOpen={isAdvisorHelpOpen}
        onClose={() => setIsAdvisorHelpOpen(false)}
      />

      {/* Official Turnaround Certificate Modal */}
      <OfficialCertificateModal
        isOpen={isCertificateOpen}
        profile={profile}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Deck Builder & Custom Card Creator Modal */}
      <DeckBuilderModal
        isOpen={isDeckBuilderOpen}
        onClose={() => setIsDeckBuilderOpen(false)}
        businessCards={businessCards}
        eventCards={eventCards}
        challengeCards={challengeCards}
        strategyCards={strategyCards}
        onAddBusinessCard={(card) => setBusinessCards([...businessCards, card])}
        onAddEventCard={(card) => setEventCards([...eventCards, card])}
        onAddChallengeCard={(card) => setChallengeCards([...challengeCards, card])}
        onAddStrategyCard={(card) => setStrategyCards([...strategyCards, card])}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}
