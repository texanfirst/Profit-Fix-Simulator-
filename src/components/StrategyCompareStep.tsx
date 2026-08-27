import React from 'react';
import { 
  Check, ArrowRight, ArrowLeft, Layers, RefreshCw, Zap, 
  HelpCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import { BusinessCard, EventCard, StrategyCard } from '../types';
import { CardView } from './CardView';
import { soundEffects } from '../utils/audio';

interface StrategyCompareStepProps {
  business: BusinessCard;
  event: EventCard | null;
  availableStrategies: StrategyCard[];
  selectedStrategies: StrategyCard[];
  chosenStrategy: StrategyCard | null;
  onToggleSelectStrategy: (strategy: StrategyCard) => void;
  onSelectBestStrategy: (strategy: StrategyCard) => void;
  onDrawMoreStrategies: () => void;
  onBack: () => void;
  onProceedToShowMath: () => void;
}

export const StrategyCompareStep: React.FC<StrategyCompareStepProps> = ({
  business,
  event,
  availableStrategies,
  selectedStrategies,
  chosenStrategy,
  onToggleSelectStrategy,
  onSelectBestStrategy,
  onDrawMoreStrategies,
  onBack,
  onProceedToShowMath,
}) => {
  const eventRev = event ? event.revenueDelta : 0;
  const eventExp = event ? event.expenseDelta : 0;
  const startRev = Math.max(0, business.currentDay.revenue + eventRev);
  const startExp = Math.max(0, business.currentDay.expenses + eventExp);
  const startProfit = startRev - startExp;

  const handleCardClick = (strat: StrategyCard) => {
    soundEffects.playSelect();
    onToggleSelectStrategy(strat);
  };

  const handlePickBest = (strat: StrategyCard, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playCoin();
    onSelectBestStrategy(strat);
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Matching Page 2 Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-cyan-500/30">
              PBMF Week 2 • Pick a strategy and test it
            </span>
            <span className="text-slate-400 text-xs font-semibold">Page 2 • Step 1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            The Profit Fix Challenge
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Choose up to three possible fixes to test, compare the numbers, and pick your top recommendation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEffects.playCardFlip();
            onDrawMoreStrategies();
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Draw New Strategy Cards
        </button>
      </div>

      {/* Starting Numbers Reminder Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider">Active Baseline:</span>
          <span className="font-bold text-slate-900 text-sm">{business.title}</span>
          {event && (
            <span className="text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full font-semibold">
              Event: {event.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>Starting Rev: <strong className="text-slate-900">${startRev}</strong></span>
          <span>Starting Exp: <strong className="text-slate-900">${startExp}</strong></span>
          <span>Starting Profit: <strong className="text-emerald-700">${startProfit}</strong></span>
        </div>
      </div>

      {/* STEP 1: Comparison Table Box (Exact Layout from PDF Page 2) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider">
              Step 1
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Choose three possible fixes to compare
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Selected: {selectedStrategies.length} / 3
          </span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">Row</th>
                <th className="py-3 px-4">Possible Fix</th>
                <th className="py-3 px-4">Revenue Change</th>
                <th className="py-3 px-4">Expense Change</th>
                <th className="py-3 px-4">New Profit</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {[0, 1, 2].map((idx) => {
                const strat = selectedStrategies[idx];
                const letter = letters[idx];

                if (strat) {
                  const newRev = Math.max(0, startRev + strat.revenueChange);
                  const newExp = Math.max(0, startExp + strat.expenseChange);
                  const newProfit = newRev - newExp;
                  const profitGain = newProfit - startProfit;
                  const isBest = chosenStrategy?.id === strat.id;

                  return (
                    <tr 
                      key={strat.id} 
                      className={`transition ${isBest ? 'bg-emerald-50/70 font-semibold' : 'bg-white hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">{letter}.</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {strat.title}
                          {isBest && (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Chosen Best
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 line-clamp-1">{strat.description}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={strat.revenueChange > 0 ? 'text-emerald-600' : strat.revenueChange < 0 ? 'text-rose-600' : 'text-slate-500'}>
                          {strat.revenueChange > 0 ? `+$${strat.revenueChange}` : strat.revenueChange < 0 ? `-$${Math.abs(strat.revenueChange)}` : '$0'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={strat.expenseChange < 0 ? 'text-emerald-600' : strat.expenseChange > 0 ? 'text-rose-600' : 'text-slate-500'}>
                          {strat.expenseChange < 0 ? `-$${Math.abs(strat.expenseChange)}` : strat.expenseChange > 0 ? `+$${strat.expenseChange}` : '$0'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-base text-slate-900">${newProfit}</div>
                        <span className={`text-[11px] font-semibold ${profitGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          ({profitGain >= 0 ? `+$${profitGain}` : `-$${Math.abs(profitGain)}`} gain)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => handlePickBest(strat, e)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                            isBest 
                              ? 'bg-emerald-600 text-white shadow-emerald-200' 
                              : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                          }`}
                        >
                          {isBest ? 'Selected as Best' : 'Pick as Best'}
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={letter} className="bg-slate-50/40 text-slate-400">
                    <td className="py-4 px-4 text-center font-bold">{letter}.</td>
                    <td className="py-4 px-4 italic" colSpan={4}>
                      Click a strategy card below to add option {letter}...
                    </td>
                    <td className="py-4 px-4 text-center text-xs">Empty Slot</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Time Saver Callout (Exact from worksheet) */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 flex items-center gap-3">
          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
            Time Saver
          </span>
          <p className="text-xs text-rose-900 font-medium">
            If time is short in your class round, compare two fixes and move straight to the calculation and pitch step!
          </p>
        </div>
      </div>

      {/* Available Strategy Cards Deck to choose from */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Drawn Strategy Cards Hand (Click to Select / Deselect)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click any card to add to your comparison matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableStrategies.map((strat) => {
            const isSelected = selectedStrategies.some((s) => s.id === strat.id);
            const isBest = chosenStrategy?.id === strat.id;

            return (
              <div key={strat.id} className="relative group">
                <CardView
                  card={strat}
                  type="strategy"
                  isSelected={isSelected}
                  isBestChoice={isBest}
                  onSelect={() => handleCardClick(strat)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            soundEffects.playSelect();
            onBack();
          }}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm flex items-center gap-2 transition border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case File
        </button>

        <button
          type="button"
          disabled={!chosenStrategy}
          onClick={() => {
            soundEffects.playSelect();
            onProceedToShowMath();
          }}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition shadow-lg cursor-pointer ${
            chosenStrategy
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200 hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Step 2: Show Math for Best Option</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
