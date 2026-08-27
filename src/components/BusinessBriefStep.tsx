import React from 'react';
import { 
  Target, CheckCircle2, ArrowRight, RefreshCw, Sparkles, 
  Layers, HelpCircle, AlertCircle, TrendingUp, DollarSign,
  MessageSquare, User, Zap
} from 'lucide-react';
import { BusinessCard, EventCard, ChallengeCard, CampaignMission } from '../types';
import { CardView } from './CardView';
import { soundEffects } from '../utils/audio';

interface BusinessBriefStepProps {
  business: BusinessCard;
  event: EventCard | null;
  challenge: ChallengeCard | null;
  activeMission?: CampaignMission | null;
  onDrawRandomBusiness: () => void;
  onDrawRandomEvent: () => void;
  onDrawRandomChallenge: () => void;
  onProceedToStep1: () => void;
}

export const BusinessBriefStep: React.FC<BusinessBriefStepProps> = ({
  business,
  event,
  challenge,
  activeMission,
  onDrawRandomBusiness,
  onDrawRandomEvent,
  onDrawRandomChallenge,
  onProceedToStep1,
}) => {
  const handleNext = () => {
    soundEffects.playSelect();
    onProceedToStep1();
  };

  const startingRevenue = business.currentDay.revenue;
  const startingExpenses = business.currentDay.expenses;
  const startingProfit = business.currentDay.profit;
  const profitMarginPct = startingRevenue > 0 ? (startingProfit / startingRevenue) * 100 : 0;

  // After event adjustment
  const eventRev = event ? event.revenueDelta : 0;
  const eventExp = event ? event.expenseDelta : 0;
  const currentAdjustedRev = Math.max(0, startingRevenue + eventRev);
  const currentAdjustedExp = Math.max(0, startingExpenses + eventExp);
  const currentAdjustedProfit = currentAdjustedRev - currentAdjustedExp;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Top Banner Matching Page 1 Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-cyan-500/30">
                {activeMission ? `Campaign Level ${activeMission.levelNumber} • ${activeMission.title}` : 'PBMF Week 2 • How Businesses Make Money'}
              </span>
              <span className="text-slate-400 text-xs font-semibold">Page 1 of 4</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              The Profit Fix Challenge
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5 max-w-2xl">
              Choose a fix, test the numbers, and defend your business recommendation with evidence.
            </p>
          </div>

          {!activeMission && (
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playCardFlip();
                  onDrawRandomBusiness();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 shadow-sm cursor-pointer"
                title="Shuffle Business Baseline Card"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change Business
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playCardFlip();
                  onDrawRandomEvent();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition border border-amber-700/60 shadow-sm cursor-pointer"
                title="Draw a new Market Event Card"
              >
                <Sparkles className="w-3.5 h-3.5" /> Draw Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Client Dialogue Box (If in Campaign Mode) */}
      {activeMission && (
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-indigo-700/50 shadow-md flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-800/80 border border-indigo-600 flex items-center justify-center text-3xl shrink-0 shadow-md">
            {activeMission.clientAvatar}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-base text-cyan-300 font-bold">{activeMission.clientName}</strong>
              <span className="text-xs text-slate-400">({activeMission.clientRole})</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{activeMission.storyDialog}"
            </p>
          </div>
        </div>
      )}

      {/* Target & Standard Callout Cards (Page 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TARGET BOX */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-bold uppercase tracking-wider">
              Target
            </span>
            <CheckCircle2 className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-slate-800 font-semibold text-sm sm:text-base leading-snug">
            {business.targetTip || 'I can use evidence and calculations to recommend a business decision that improves profit.'}
          </p>
        </div>

        {/* STANDARD BOX */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider">
              Standard
            </span>
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-black text-lg sm:text-xl text-slate-900 tracking-tight">
              Revenue − Expenses = Profit
            </div>
            <p className="text-slate-700 text-xs sm:text-sm font-medium">
              {business.standardTip || 'A smart fix improves what remains.'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Starting Case File (Page 1) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Starting Case File
            </span>
            <h2 className="text-xl font-bold text-slate-900">{business.title}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Starting Margin:</span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {profitMarginPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Business Rescue Description */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Business Rescue Brief</span>
          <p className="text-slate-700 text-sm leading-relaxed font-medium">
            {business.scenarioStory}
          </p>
        </div>

        {/* Starting Baseline Data Table (Exact layout from worksheet Page 1) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Case Fact</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Expenses</th>
                <th className="py-3 px-4">Profit / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              <tr className="bg-white">
                <td className="py-3.5 px-4 font-bold text-slate-900">Current Day Baseline</td>
                <td className="py-3.5 px-4 text-slate-800 font-mono">${startingRevenue}</td>
                <td className="py-3.5 px-4 text-slate-800 font-mono">${startingExpenses}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs ${
                    startingProfit > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    ${startingProfit} profit
                  </span>
                </td>
              </tr>
              <tr className="bg-slate-50/60 text-xs text-slate-600">
                <td className="py-3 px-4 font-semibold text-rose-700">Identified Problem</td>
                <td className="py-3 px-4">Lots of sales volume</td>
                <td className="py-3 px-4">Costs are too high</td>
                <td className="py-3 px-4 font-semibold text-rose-700">Profit is too thin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Modifiers (Event Card + Challenge Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drawn Market Event */}
        {event ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Round Market Event</span>
              {!activeMission && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playCardFlip();
                    onDrawRandomEvent();
                  }}
                  className="text-xs text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                >
                  Re-draw Event
                </button>
              )}
            </div>
            <CardView card={event} type="event" interactive={false} />
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center space-y-2">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <h4 className="font-bold text-sm text-slate-800">No Market Event Drawn</h4>
            <p className="text-xs text-slate-500">Draw a market condition to test your business against real world surprises!</p>
            <button
              type="button"
              onClick={() => {
                soundEffects.playCardFlip();
                onDrawRandomEvent();
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Draw Event Card
            </button>
          </div>
        )}

        {/* Drawn Challenge Card */}
        {challenge ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Round Challenge Goal</span>
              {!activeMission && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playCardFlip();
                    onDrawRandomChallenge();
                  }}
                  className="text-xs text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                >
                  Re-draw Challenge
                </button>
              )}
            </div>
            <CardView card={challenge} type="challenge" interactive={false} />
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center space-y-2">
            <Target className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-sm text-slate-800">No Challenge Modifier</h4>
            <p className="text-xs text-slate-500">Add an objective or constraint rule for bonus boardroom score!</p>
            <button
              type="button"
              onClick={() => {
                soundEffects.playCardFlip();
                onDrawRandomChallenge();
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Draw Challenge Card
            </button>
          </div>
        )}
      </div>

      {/* Adjusted State Summary before Strategies */}
      {event && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold text-amber-950">
              Condition-Adjusted Baseline for Round:
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono font-bold text-slate-800">
            <span>Rev: ${currentAdjustedRev}</span>
            <span>•</span>
            <span>Exp: ${currentAdjustedExp}</span>
            <span>•</span>
            <span className="text-emerald-700">Starting Profit: ${currentAdjustedProfit}</span>
          </div>
        </div>
      )}

      {/* Action Footer to Move to Step 1 */}
      <div className="flex items-center justify-end pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Step 1: Choose 3 Fixes to Compare</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

