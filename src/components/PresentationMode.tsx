import React, { useState } from 'react';
import { 
  Tv, Play, ChevronRight, ChevronLeft, Sparkles, Target, 
  Layers, Users, CheckCircle2, RotateCcw, Volume2, Maximize2, Minimize2 
} from 'lucide-react';
import { BusinessCard, EventCard, ChallengeCard, StrategyCard, RoundStudentInput } from '../types';
import { CardView } from './CardView';
import { TimerWidget } from './TimerWidget';
import { soundEffects } from '../utils/audio';

interface PresentationModeProps {
  business: BusinessCard;
  event: EventCard | null;
  challenge: ChallengeCard | null;
  availableStrategies: StrategyCard[];
  selectedStrategies: StrategyCard[];
  chosenStrategy: StrategyCard | null;
  roundNumber: number;
  onExitPresentation: () => void;
  onDrawRandomEvent: () => void;
  onDrawRandomChallenge: () => void;
  onSelectBestStrategy: (strat: StrategyCard) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  business,
  event,
  challenge,
  availableStrategies,
  selectedStrategies,
  chosenStrategy,
  roundNumber,
  onExitPresentation,
  onDrawRandomEvent,
  onDrawRandomChallenge,
  onSelectBestStrategy,
}) => {
  const [slide, setSlide] = useState<'brief' | 'event' | 'challenge' | 'strategies' | 'math_reveal'>('brief');
  const [revealMath, setRevealMath] = useState(false);

  const startRev = business.currentDay.revenue;
  const startExp = business.currentDay.expenses;
  const startProfit = business.currentDay.profit;

  const eventRev = event ? event.revenueDelta : 0;
  const eventExp = event ? event.expenseDelta : 0;
  const adjRev = Math.max(0, startRev + eventRev);
  const adjExp = Math.max(0, startExp + eventExp);
  const adjProfit = adjRev - adjExp;

  const handleNextSlide = () => {
    soundEffects.playSelect();
    if (slide === 'brief') setSlide('event');
    else if (slide === 'event') setSlide('challenge');
    else if (slide === 'challenge') setSlide('strategies');
    else if (slide === 'strategies') setSlide('math_reveal');
  };

  const handlePrevSlide = () => {
    soundEffects.playSelect();
    if (slide === 'math_reveal') setSlide('strategies');
    else if (slide === 'strategies') setSlide('challenge');
    else if (slide === 'challenge') setSlide('event');
    else if (slide === 'event') setSlide('brief');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden select-none">
      {/* Top Projector Controls Bar */}
      <header className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5" /> Classroom Projector View • Round {roundNumber}
          </div>
          <h2 className="text-lg font-bold text-white hidden sm:block">
            {business.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <TimerWidget initialSeconds={180} />
          <button
            type="button"
            onClick={onExitPresentation}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            Exit Fullscreen View
          </button>
        </div>
      </header>

      {/* Main Slide Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
        {slide === 'brief' && (
          <div className="w-full space-y-8 animate-fade-in text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold uppercase tracking-wider border border-emerald-500/30">
              Starting Case File
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {business.title}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium">
              "{business.scenarioStory}"
            </p>

            <div className="grid grid-cols-3 gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl">
              <div>
                <span className="text-slate-400 text-sm font-semibold block uppercase">Revenue</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-white">${startRev}</span>
              </div>
              <div>
                <span className="text-slate-400 text-sm font-semibold block uppercase">Expenses</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-white">${startExp}</span>
              </div>
              <div>
                <span className="text-emerald-400 text-sm font-semibold block uppercase">Profit</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">${startProfit}</span>
              </div>
            </div>

            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-base font-semibold">
              Problem: {business.problem}
            </div>
          </div>
        )}

        {slide === 'event' && (
          <div className="w-full space-y-6 animate-fade-in text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-bold uppercase tracking-wider border border-amber-500/30">
              <Sparkles className="w-4 h-4" /> Market Event Drawn
            </div>

            {event ? (
              <div className="space-y-6">
                <CardView card={event} type="event" interactive={false} size="lg" />
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-slate-200 text-sm">
                  Class Question: Does this market event make the business more or less vulnerable? How does it change our starting profit?
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-400">No event currently drawn.</p>
                <button
                  type="button"
                  onClick={onDrawRandomEvent}
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-base transition shadow-lg"
                >
                  Draw Market Event Card
                </button>
              </div>
            )}
          </div>
        )}

        {slide === 'challenge' && (
          <div className="w-full space-y-6 animate-fade-in text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold uppercase tracking-wider border border-indigo-500/30">
              <Target className="w-4 h-4" /> Round Challenge Goal
            </div>

            {challenge ? (
              <div className="space-y-6">
                <CardView card={challenge} type="challenge" interactive={false} size="lg" />
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-slate-200 text-sm">
                  Class Constraint: Your team cannot win this round unless you satisfy the goal above!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-400">No challenge modifier active.</p>
                <button
                  type="button"
                  onClick={onDrawRandomChallenge}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition shadow-lg"
                >
                  Draw Challenge Card
                </button>
              </div>
            )}
          </div>
        )}

        {slide === 'strategies' && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-bold uppercase tracking-wider border border-cyan-500/30">
                <Layers className="w-4 h-4" /> Compare Strategy Cards
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Which Business Fix Should We Choose?
              </h2>
              <p className="text-sm text-slate-400">
                Discuss with your team and vote on the best strategy card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {availableStrategies.slice(0, 3).map((strat) => {
                const isBest = chosenStrategy?.id === strat.id;
                return (
                  <div 
                    key={strat.id} 
                    onClick={() => {
                      soundEffects.playCoin();
                      onSelectBestStrategy(strat);
                    }}
                    className={`cursor-pointer transition transform hover:-translate-y-1 rounded-2xl ${
                      isBest ? 'ring-4 ring-emerald-500 shadow-2xl' : ''
                    }`}
                  >
                    <CardView card={strat} type="strategy" isBestChoice={isBest} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {slide === 'math_reveal' && chosenStrategy && (
          <div className="w-full space-y-6 animate-fade-in text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold uppercase tracking-wider border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Live Math Calculation Reveal
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Testing Strategy: {chosenStrategy.title}
            </h2>

            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 text-xs font-bold uppercase block">New Revenue</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
                    ${adjRev} {chosenStrategy.revenueChange >= 0 ? `+ $${chosenStrategy.revenueChange}` : `- $${Math.abs(chosenStrategy.revenueChange)}`}
                    <span className="text-emerald-400 block sm:inline sm:ml-2">
                      = ${Math.max(0, adjRev + chosenStrategy.revenueChange)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 text-xs font-bold uppercase block">New Expenses</span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
                    ${adjExp} {chosenStrategy.expenseChange >= 0 ? `+ $${chosenStrategy.expenseChange}` : `- $${Math.abs(chosenStrategy.expenseChange)}`}
                    <span className="text-rose-400 block sm:inline sm:ml-2">
                      = ${Math.max(0, adjExp + chosenStrategy.expenseChange)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">
                  Final Profit Calculation
                </span>
                <div className="text-3xl sm:text-5xl font-mono font-black text-emerald-400">
                  ${Math.max(0, adjRev + chosenStrategy.revenueChange)} − ${Math.max(0, adjExp + chosenStrategy.expenseChange)} = ${Math.max(0, adjRev + chosenStrategy.revenueChange) - Math.max(0, adjExp + chosenStrategy.expenseChange)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Stage Navigation */}
      <footer className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          disabled={slide === 'brief'}
          onClick={handlePrevSlide}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Slide
        </button>

        <div className="flex items-center gap-2">
          {(['brief', 'event', 'challenge', 'strategies', 'math_reveal'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                soundEffects.playSelect();
                setSlide(s);
              }}
              className={`w-2.5 h-2.5 rounded-full transition ${
                slide === s ? 'bg-cyan-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={slide === 'math_reveal'}
          onClick={handleNextSlide}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 transition"
        >
          Next Slide <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
