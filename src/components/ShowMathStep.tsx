import React, { useState } from 'react';
import { 
  Calculator, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, 
  HelpCircle, Lightbulb, Sparkles, RefreshCw, Equal
} from 'lucide-react';
import { BusinessCard, EventCard, StrategyCard, RoundStudentInput } from '../types';
import { soundEffects } from '../utils/audio';

interface ShowMathStepProps {
  business: BusinessCard;
  event: EventCard | null;
  chosenStrategy: StrategyCard;
  studentInput: RoundStudentInput;
  onUpdateInput: (updates: Partial<RoundStudentInput>) => void;
  onBack: () => void;
  onProceedToMemo: () => void;
}

export const ShowMathStep: React.FC<ShowMathStepProps> = ({
  business,
  event,
  chosenStrategy,
  studentInput,
  onUpdateInput,
  onBack,
  onProceedToMemo,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const eventRev = event ? event.revenueDelta : 0;
  const eventExp = event ? event.expenseDelta : 0;
  const startRev = Math.max(0, business.currentDay.revenue + eventRev);
  const startExp = Math.max(0, business.currentDay.expenses + eventExp);
  const startProfit = startRev - startExp;

  const expectedRev = Math.max(0, startRev + chosenStrategy.revenueChange);
  const expectedExp = Math.max(0, startExp + chosenStrategy.expenseChange);
  const expectedProfit = expectedRev - expectedExp;

  const userRev = studentInput.userRevenueCalc;
  const userExp = studentInput.userExpenseCalc;
  const userProf = studentInput.userProfitCalc;

  const isRevFilled = userRev !== '' && userRev !== undefined;
  const isExpFilled = userExp !== '' && userExp !== undefined;
  const isProfFilled = userProf !== '' && userProf !== undefined;

  const isRevCorrect = isRevFilled && Number(userRev) === expectedRev;
  const isExpCorrect = isExpFilled && Number(userExp) === expectedExp;
  const isProfCorrect = isProfFilled && Number(userProf) === expectedProfit;

  const allCorrect = isRevCorrect && isExpCorrect && isProfCorrect;

  const handleAutoFill = () => {
    soundEffects.playCoin();
    onUpdateInput({
      userRevenueCalc: expectedRev,
      userExpenseCalc: expectedExp,
      userProfitCalc: expectedProfit,
    });
    setAutoFilled(true);
  };

  const handleNext = () => {
    soundEffects.playSuccess();
    onProceedToMemo();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner Matching Page 2 */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30">
              PBMF Week 2 • Math Breakdown
            </span>
            <span className="text-slate-400 text-xs font-semibold">Page 2 • Step 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            The Profit Fix Challenge
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Prove the numbers for your chosen strategy fix before drafting the recommendation memo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoFill}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-Calculate / Check
        </button>
      </div>

      {/* Main Worksheet Math Card (Exact layout from PDF Page 2 Step 2) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              Step 2
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Show the math for your best option
            </h2>
          </div>
          <Calculator className="w-6 h-6 text-amber-600" />
        </div>

        {/* Starting Baseline Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 font-medium block">Starting Revenue:</span>
            <strong className="text-slate-900 font-mono text-base sm:text-lg">${startRev}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Starting Expenses:</span>
            <strong className="text-slate-900 font-mono text-base sm:text-lg">${startExp}</strong>
          </div>
          <div>
            <span className="text-emerald-700 font-medium block">Starting Profit:</span>
            <strong className="text-emerald-700 font-mono text-base sm:text-lg">${startProfit}</strong>
          </div>
        </div>

        {/* Chosen Fix Banner */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Chosen Best Fix:
            </span>
            <span className="text-xs font-bold text-emerald-700">
              {chosenStrategy.category.toUpperCase()}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-emerald-950">
            {chosenStrategy.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {chosenStrategy.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold">
            <span className="text-slate-600">
              Revenue Change: <strong className={chosenStrategy.revenueChange > 0 ? 'text-emerald-700' : 'text-slate-700'}>
                {chosenStrategy.revenueChange > 0 ? `+$${chosenStrategy.revenueChange}` : chosenStrategy.revenueChange < 0 ? `-$${Math.abs(chosenStrategy.revenueChange)}` : '$0'}
              </strong>
            </span>
            <span>•</span>
            <span className="text-slate-600">
              Expense Change: <strong className={chosenStrategy.expenseChange < 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {chosenStrategy.expenseChange < 0 ? `-$${Math.abs(chosenStrategy.expenseChange)} (Savings)` : chosenStrategy.expenseChange > 0 ? `+$${chosenStrategy.expenseChange}` : '$0'}
              </strong>
            </span>
          </div>
        </div>

        {/* Step-by-Step Math Inputs */}
        <div className="space-y-4 pt-2">
          {/* Row 1: New Revenue */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-slate-800 block">New revenue: $</label>
              <span className="text-xs text-slate-500 font-mono">
                Calculation: ${startRev} {chosenStrategy.revenueChange >= 0 ? `+ $${chosenStrategy.revenueChange}` : `- $${Math.abs(chosenStrategy.revenueChange)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={userRev ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    onUpdateInput({ userRevenueCalc: val });
                  }}
                  placeholder="0"
                  className={`w-32 pl-7 pr-3 py-2 rounded-xl font-mono font-bold text-base border focus:outline-none transition ${
                    isRevFilled 
                      ? isRevCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-rose-400 bg-rose-50 text-rose-900' 
                      : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500'
                  }`}
                />
              </div>
              {isRevFilled && (
                isRevCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <span className="text-xs font-bold text-rose-600">Expected ${expectedRev}</span>
                )
              )}
            </div>
          </div>

          {/* Row 2: New Expenses */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-slate-800 block">New expenses: $</label>
              <span className="text-xs text-slate-500 font-mono">
                Calculation: ${startExp} {chosenStrategy.expenseChange >= 0 ? `+ $${chosenStrategy.expenseChange}` : `- $${Math.abs(chosenStrategy.expenseChange)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={userExp ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    onUpdateInput({ userExpenseCalc: val });
                  }}
                  placeholder="0"
                  className={`w-32 pl-7 pr-3 py-2 rounded-xl font-mono font-bold text-base border focus:outline-none transition ${
                    isExpFilled 
                      ? isExpCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-rose-400 bg-rose-50 text-rose-900' 
                      : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500'
                  }`}
                />
              </div>
              {isExpFilled && (
                isExpCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <span className="text-xs font-bold text-rose-600">Expected ${expectedExp}</span>
                )
              )}
            </div>
          </div>

          {/* Row 3: Formula Equation (New Revenue - New Expenses = New Profit) */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-emerald-950 block">
                New profit / loss equation:
              </label>
              <span className="text-xs font-mono font-bold text-emerald-800">
                Revenue - Expenses = Profit
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-base sm:text-lg font-bold text-slate-800">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-inner">
                ${userRev !== '' && userRev !== undefined ? userRev : expectedRev}
              </div>
              <span className="text-slate-500 font-bold">−</span>
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-inner">
                ${userExp !== '' && userExp !== undefined ? userExp : expectedExp}
              </div>
              <span className="text-slate-500 font-bold">=</span>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  value={userProf ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    onUpdateInput({ userProfitCalc: val });
                  }}
                  placeholder="Profit"
                  className={`w-32 pl-7 pr-3 py-2 rounded-xl font-mono font-bold text-base border focus:outline-none transition ${
                    isProfFilled 
                      ? isProfCorrect ? 'border-emerald-500 bg-emerald-100 text-emerald-950' : 'border-rose-400 bg-rose-50 text-rose-900' 
                      : 'border-emerald-300 bg-white text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              {isProfFilled && (
                isProfCorrect ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 ml-2">
                    <CheckCircle2 className="w-4 h-4" /> Correct Profit!
                  </div>
                ) : (
                  <span className="text-xs font-bold text-rose-600 ml-2">Expected ${expectedProfit}</span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Hint toggle */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-cyan-700 hover:text-cyan-900 font-bold underline"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? 'Hide formula hint' : 'Need a math hint?'}
          </button>
          <span>Profit Margin = (New Profit / New Revenue) × 100%</span>
        </div>

        {showHint && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 space-y-1">
            <p className="font-bold">Formula Guide:</p>
            <p>1. New Revenue = Starting Revenue (${startRev}) + Strategy Revenue Change (${chosenStrategy.revenueChange}) = ${expectedRev}</p>
            <p>2. New Expenses = Starting Expenses (${startExp}) + Strategy Expense Change (${chosenStrategy.expenseChange}) = ${expectedExp}</p>
            <p>3. New Profit = ${expectedRev} − ${expectedExp} = <strong>${expectedProfit}</strong></p>
          </div>
        )}
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
          <ArrowLeft className="w-4 h-4" /> Back to Strategy Comparison
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Step 3: Recommendation Memo & Pitch</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
