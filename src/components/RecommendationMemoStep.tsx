import React, { useState } from 'react';
import { 
  FileText, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, 
  Sparkles, Send, ShieldAlert, Award, MessageSquare, HelpCircle, Check
} from 'lucide-react';
import { BusinessCard, EventCard, ChallengeCard, StrategyCard, RoundStudentInput, MarketForce } from '../types';
import { CalculatedRoundData } from '../utils/gameLogic';
import { soundEffects } from '../utils/audio';

interface RecommendationMemoStepProps {
  business: BusinessCard;
  event: EventCard | null;
  challenge: ChallengeCard | null;
  chosenStrategy: StrategyCard;
  calcData: CalculatedRoundData;
  studentInput: RoundStudentInput;
  onUpdateInput: (updates: Partial<RoundStudentInput>) => void;
  onSubmitDecision: () => void;
  onBack: () => void;
}

export const RecommendationMemoStep: React.FC<RecommendationMemoStepProps> = ({
  business,
  event,
  challenge,
  chosenStrategy,
  calcData,
  studentInput,
  onUpdateInput,
  onSubmitDecision,
  onBack,
}) => {
  const memo = studentInput.memo;

  const marketForces: MarketForce[] = ['Costs', 'Price', 'Demand', 'Competition'];

  const handleMarketForceSelect = (force: MarketForce) => {
    soundEffects.playSelect();
    onUpdateInput({
      memo: {
        ...memo,
        marketForce: force,
      },
    });
  };

  const handleAutoFillPitch = () => {
    soundEffects.playCoin();
    const revStr = chosenStrategy.revenueChange >= 0 
      ? `+$${chosenStrategy.revenueChange}` 
      : `-$${Math.abs(chosenStrategy.revenueChange)}`;
    const expStr = chosenStrategy.expenseChange <= 0 
      ? `-$${Math.abs(chosenStrategy.expenseChange)} (savings)` 
      : `+$${chosenStrategy.expenseChange}`;

    onUpdateInput({
      memo: {
        teamRecommendation: chosenStrategy.title,
        whyBestDecision: chosenStrategy.pros.join('. ') + '.',
        marketForce: chosenStrategy.primaryMarketForce,
        riskTradeoff: chosenStrategy.riskTradeoff,
        miniPitch: `We recommend ${chosenStrategy.title} because it changes revenue by ${revStr} and expenses by ${expStr}. Our new profit is $${calcData.finalProfit}, so this is a smart decision because ${chosenStrategy.recommendedPitch}`,
      },
    });
  };

  const handleSubmit = () => {
    soundEffects.playSuccess();
    onSubmitDecision();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner Matching Page 3 Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/30">
              PBMF Week 2 • Recommendation Memo
            </span>
            <span className="text-slate-400 text-xs font-semibold">Page 3 • Step 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            The Profit Fix Challenge
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Write the business recommendation, identify market forces, weigh trade-offs, and deliver your mini pitch.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoFillPitch}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-Draft Pitch Template
        </button>
      </div>

      {/* Main Memo Form (Exact Structure from PDF Page 3) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase tracking-wider">
              Step 3
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Write the business recommendation
            </h2>
          </div>
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>

        {/* Form Field 1: Our team recommends */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 block">
            Our team recommends:
          </label>
          <input
            type="text"
            value={memo.teamRecommendation}
            onChange={(e) => onUpdateInput({ memo: { ...memo, teamRecommendation: e.target.value } })}
            placeholder={`e.g. ${chosenStrategy.title}`}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition"
          />
        </div>

        {/* Form Field 2: This is the best decision because */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 block">
            This is the best decision because:
          </label>
          <textarea
            rows={3}
            value={memo.whyBestDecision}
            onChange={(e) => onUpdateInput({ memo: { ...memo, whyBestDecision: e.target.value } })}
            placeholder="Explain why this fix creates the greatest healthy profit gain without unacceptable risks..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition"
          />
        </div>

        {/* Two-Column Callout Blocks: Market Force & Trade-Off (Exact layout from PDF Page 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Green Block: MARKET FORCE */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Market Force
              </span>
              <span className="text-xs text-emerald-800 font-semibold">Select Primary Force</span>
            </div>
            <p className="text-xs font-bold text-slate-800">
              Which factor does your fix respond to most?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {marketForces.map((force) => {
                const isSelected = memo.marketForce === force;
                return (
                  <button
                    key={force}
                    type="button"
                    onClick={() => handleMarketForceSelect(force)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                        : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/60'
                    }`}
                  >
                    <span>[ {isSelected ? '✓' : ' '} ] {force}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rose Block: TRADE-OFF */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Trade-off
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              What is one risk or trade-off with your fix?
            </p>

            <textarea
              rows={2}
              value={memo.riskTradeoff}
              onChange={(e) => onUpdateInput({ memo: { ...memo, riskTradeoff: e.target.value } })}
              placeholder="e.g. Higher upfront bulk orders tie up storage cash, or slight customer price resistance..."
              className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:border-rose-400 bg-white text-xs font-medium text-slate-800 outline-none transition"
            />
          </div>
        </div>

        {/* Bottom Callout Block: MINI PITCH (Page 3 Frame) */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
              Mini Pitch Frame
            </span>
            <MessageSquare className="w-5 h-5 text-cyan-400" />
          </div>

          <p className="text-xs text-slate-300 font-medium">
            Fill in or polish your 30-second executive pitch to the business owner:
          </p>

          <textarea
            rows={3}
            value={memo.miniPitch}
            onChange={(e) => onUpdateInput({ memo: { ...memo, miniPitch: e.target.value } })}
            placeholder="We recommend [Fix] because it changes revenue by [+$X] and expenses by [-$Y]. Our new profit is [$Z], so this is a smart decision because..."
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 text-slate-100 text-sm font-medium outline-none transition"
          />
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
          <ArrowLeft className="w-4 h-4" /> Back to Math Step
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 transition shadow-lg shadow-emerald-200 hover:-translate-y-0.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Submit Pitch to Board of Directors</span>
        </button>
      </div>
    </div>
  );
};
