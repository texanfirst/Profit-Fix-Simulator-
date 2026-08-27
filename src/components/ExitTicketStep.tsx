import React, { useState } from 'react';
import { 
  FileCheck, CheckCircle2, AlertCircle, ArrowLeft, Printer, 
  Sparkles, Check, HelpCircle, BookOpen, Send, Download
} from 'lucide-react';
import { RoundStudentInput } from '../types';
import { soundEffects } from '../utils/audio';

interface ExitTicketStepProps {
  studentInput: RoundStudentInput;
  onUpdateInput: (updates: Partial<RoundStudentInput>) => void;
  onBackToGame: () => void;
  onOpenPrintView: () => void;
}

export const ExitTicketStep: React.FC<ExitTicketStepProps> = ({
  studentInput,
  onUpdateInput,
  onBackToGame,
  onOpenPrintView,
}) => {
  const exitTicket = studentInput.exitTicket || {
    q1IsProfit: '',
    q1MathWork: '',
    q2ShouldDoIt: '',
    q2Reasoning: '',
    reflectionLearned: '',
    reflectionBusyNotProfitable: '',
  };

  const [submitted, setSubmitted] = useState(false);

  const updateExit = (fields: Partial<typeof exitTicket>) => {
    onUpdateInput({
      exitTicket: {
        ...exitTicket,
        ...fields,
      },
    });
  };

  const handleAutoFillAnswers = () => {
    soundEffects.playCoin();
    updateExit({
      q1IsProfit: 'profit',
      q1MathWork: '$520 (Revenue) − $475 (Expenses) = $45 Profit. Since Revenue is greater than Expenses, the business made money.',
      q2ShouldDoIt: 'no',
      q2Reasoning: 'No, because the new expenses ($45) exceed the new revenue ($30), which decreases total net profit by -$15.',
      reflectionLearned: 'Profit is what remains after all costs are paid. Higher sales volume alone does not guarantee success if expenses grow faster than income.',
      reflectionBusyNotProfitable: 'When customer foot traffic and item sales are high, but expensive ingredient waste, inefficient labor, or low prices wipe out the margin.',
    });
  };

  const handleSubmitTicket = () => {
    soundEffects.playSuccess();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner Matching Page 4 */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30">
              PBMF Week 2 • Exit Ticket
            </span>
            <span className="text-slate-400 text-xs font-semibold">Page 4 of 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            The Profit Fix Challenge
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Complete the quick check and final reflection to solidify your mastery of business profit fundamentals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFillAnswers}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample Answers
          </button>
          <button
            type="button"
            onClick={onOpenPrintView}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Worksheets
          </button>
        </div>
      </div>

      {/* Main Exit Ticket Form (Exact from PDF Page 4) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold uppercase tracking-wider">
              Quick Check
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              A business has $520 revenue and $475 expenses.
            </h2>
          </div>
          <BookOpen className="w-6 h-6 text-cyan-600" />
        </div>

        {/* Question 1: Is it a profit or loss? Show math */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            1. Is it a profit or loss? Show the math.
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateExit({ q1IsProfit: 'profit' })}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                exitTicket.q1IsProfit === 'profit'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              [ {exitTicket.q1IsProfit === 'profit' ? '✓' : ' '} ] It is a Profit (+$45)
            </button>
            <button
              type="button"
              onClick={() => updateExit({ q1IsProfit: 'loss' })}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                exitTicket.q1IsProfit === 'loss'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              [ {exitTicket.q1IsProfit === 'loss' ? '✓' : ' '} ] It is a Loss
            </button>
          </div>

          <textarea
            rows={2}
            value={exitTicket.q1MathWork}
            onChange={(e) => updateExit({ q1MathWork: e.target.value })}
            placeholder="Show your equation: Revenue - Expenses = Profit / Loss..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:border-cyan-500 outline-none transition"
          />
        </div>

        {/* Question 2: One fix raises revenue by $30 but raises expenses by $45. Should owner do it? */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="text-sm font-bold text-slate-900 block">
            2. One fix raises revenue by $30 but raises expenses by $45. Should the owner do it? Why?
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateExit({ q2ShouldDoIt: 'no' })}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                exitTicket.q2ShouldDoIt === 'no'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              [ {exitTicket.q2ShouldDoIt === 'no' ? '✓' : ' '} ] No, do not do it (Correct)
            </button>
            <button
              type="button"
              onClick={() => updateExit({ q2ShouldDoIt: 'yes' })}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                exitTicket.q2ShouldDoIt === 'yes'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              [ {exitTicket.q2ShouldDoIt === 'yes' ? '✓' : ' '} ] Yes, do it
            </button>
          </div>

          <textarea
            rows={2}
            value={exitTicket.q2Reasoning}
            onChange={(e) => updateExit({ q2Reasoning: e.target.value })}
            placeholder="Explain why comparing the change in revenue vs change in expenses matters..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:border-cyan-500 outline-none transition"
          />
        </div>

        {/* Section 2: Final Reflection (Page 4) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider">
              Final Reflection
            </span>
          </div>

          {/* Reflection 1 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">
              The most important thing I learned about profit is:
            </label>
            <textarea
              rows={3}
              value={exitTicket.reflectionLearned}
              onChange={(e) => updateExit({ reflectionLearned: e.target.value })}
              placeholder="Reflect on the difference between revenue (gross sales) and profit (net earnings)..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition"
            />
          </div>

          {/* Reflection 2 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">
              A business can be busy but still not profitable when:
            </label>
            <textarea
              rows={3}
              value={exitTicket.reflectionBusyNotProfitable}
              onChange={(e) => updateExit({ reflectionBusyNotProfitable: e.target.value })}
              placeholder="Explain how high costs, waste, or low prices can hide underneath high customer traffic..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition"
            />
          </div>
        </div>

        {submitted && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Exit Ticket saved and submitted! Great work demonstrating financial analysis skills.</span>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            soundEffects.playSelect();
            onBackToGame();
          }}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm flex items-center gap-2 transition border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmitTicket}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 transition shadow-lg shadow-emerald-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Save & Submit Exit Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
