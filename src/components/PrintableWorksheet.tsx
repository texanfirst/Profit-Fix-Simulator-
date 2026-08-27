import React from 'react';
import { Printer, ArrowLeft, Download, Check, Sparkles } from 'lucide-react';
import { BusinessCard, EventCard, ChallengeCard, StrategyCard, RoundStudentInput } from '../types';

interface PrintableWorksheetProps {
  business: BusinessCard;
  event: EventCard | null;
  challenge: ChallengeCard | null;
  selectedStrategies: StrategyCard[];
  chosenStrategy: StrategyCard | null;
  studentInput?: RoundStudentInput;
  onBack: () => void;
}

export const PrintableWorksheet: React.FC<PrintableWorksheetProps> = ({
  business,
  event,
  challenge,
  selectedStrategies,
  chosenStrategy,
  studentInput,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const startRev = business.currentDay.revenue;
  const startExp = business.currentDay.expenses;
  const startProfit = business.currentDay.profit;

  const eventRev = event ? event.revenueDelta : 0;
  const eventExp = event ? event.expenseDelta : 0;
  const adjRev = Math.max(0, startRev + eventRev);
  const adjExp = Math.max(0, startExp + eventExp);
  const adjProfit = adjRev - adjExp;

  const memo = studentInput?.memo;
  const exitTicket = studentInput?.exitTicket;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Print Controls Bar (hidden during actual window.print()) */}
      <div className="print:hidden bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Game
          </button>
          <div>
            <h3 className="font-bold text-sm text-white">Printable Classroom Worksheets</h3>
            <p className="text-xs text-slate-400">Formatted for standard 8.5" × 11" classroom handouts & PDF export.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-200 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save to PDF
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 print:border-0 print:p-0 text-slate-900 space-y-12 shadow-sm font-sans">
        
        {/* ================= PAGE 1 ================= */}
        <section className="space-y-6 border-b-2 border-dashed border-slate-300 pb-10 print:border-none print:pb-0 print:break-after-page">
          {/* Top Header Banner */}
          <div className="bg-[#1e293b] text-white rounded-2xl p-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">The Profit Fix Challenge</h1>
              <p className="text-xs text-slate-300 mt-1">Choose a fix, test the numbers, defend the decision</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase block">PBMF WEEK 2 THURSDAY</span>
              <span className="text-xs font-semibold text-slate-300">page 1</span>
            </div>
          </div>

          {/* Student Info Lines */}
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-600 pt-1">
            <div className="border-b border-slate-300 pb-1">Name: ______________________</div>
            <div className="border-b border-slate-300 pb-1">Period: ____________________</div>
            <div className="border-b border-slate-300 pb-1">Date: ______________________</div>
          </div>

          {/* BUSINESS RESCUE BOX */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-2 bg-slate-50/50">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
              Business Rescue
            </span>
            <h2 className="text-lg font-bold text-slate-900">{business.title}: {business.problem}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your team has been hired to recommend one business fix. Use the numbers to prove whether your idea improves profit.
            </p>
          </div>

          {/* TARGET & STANDARD */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-sky-200 bg-sky-50/60 rounded-2xl p-4 space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-sky-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Target
              </span>
              <p className="text-xs font-medium text-slate-800">
                I can use evidence and calculations to recommend a business decision that improves profit.
              </p>
            </div>

            <div className="border border-amber-200 bg-amber-50/60 rounded-2xl p-4 space-y-1">
              <span className="px-2 py-0.5 rounded bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Standard
              </span>
              <div className="font-mono font-bold text-sm text-slate-900">Revenue − Expenses = Profit</div>
              <p className="text-[11px] text-slate-600">A smart fix improves what remains.</p>
            </div>
          </div>

          {/* STARTING CASE FILE TABLE */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Starting Case File
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Mission: Improve profit without making a decision that would obviously hurt the business later.
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Case fact</th>
                  <th className="p-2.5">Revenue</th>
                  <th className="p-2.5">Expenses</th>
                  <th className="p-2.5">Profit/loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold">Current day baseline</td>
                  <td className="p-2.5 font-mono">${startRev}</td>
                  <td className="p-2.5 font-mono">${startExp}</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-700">${startProfit} profit</td>
                </tr>
                <tr className="text-slate-500">
                  <td className="p-2.5 font-semibold text-rose-700">Problem</td>
                  <td className="p-2.5">Lots of sales</td>
                  <td className="p-2.5">Costs are high</td>
                  <td className="p-2.5 text-rose-700 font-semibold">Profit is too thin</td>
                </tr>
              </tbody>
            </table>

            {event && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-amber-900">Drawn Market Event: {event.title}</strong>
                  <p className="text-slate-600 text-[11px]">{event.description}</p>
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 shrink-0">
                  Rev {event.revenueDelta >= 0 ? `+$${event.revenueDelta}` : `-$${Math.abs(event.revenueDelta)}`} | 
                  Exp {event.expenseDelta >= 0 ? `+$${event.expenseDelta}` : `-$${Math.abs(event.expenseDelta)}`}
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400">
            PBMF Week 2 • How Businesses Make Money
          </div>
        </section>

        {/* ================= PAGE 2 ================= */}
        <section className="space-y-6 border-b-2 border-dashed border-slate-300 pb-10 print:border-none print:pb-0 print:break-after-page">
          <div className="bg-[#1e293b] text-white rounded-2xl p-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">The Profit Fix Challenge</h2>
              <p className="text-xs text-slate-300 mt-1">Pick a strategy and test it</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase block">PBMF WEEK 2 THURSDAY</span>
              <span className="text-xs font-semibold text-slate-300">page 2</span>
            </div>
          </div>

          {/* STEP 1: Choose three possible fixes to compare */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-700 text-white text-[10px] font-bold uppercase tracking-wider">
              Step 1
            </span>
            <h3 className="text-sm font-bold text-slate-900">Choose three possible fixes to compare.</h3>

            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Possible fix</th>
                  <th className="p-2.5">Revenue change</th>
                  <th className="p-2.5">Expense change</th>
                  <th className="p-2.5">New profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {['A', 'B', 'C'].map((letter, idx) => {
                  const strat = selectedStrategies[idx];
                  return (
                    <tr key={letter} className="h-10">
                      <td className="p-2.5 font-medium">{letter}. {strat ? strat.title : '______________________'}</td>
                      <td className="p-2.5 font-mono">{strat ? (strat.revenueChange >= 0 ? `+$${strat.revenueChange}` : `-$${Math.abs(strat.revenueChange)}`) : '________'}</td>
                      <td className="p-2.5 font-mono">{strat ? (strat.expenseChange <= 0 ? `-$${Math.abs(strat.expenseChange)}` : `+$${strat.expenseChange}`) : '________'}</td>
                      <td className="p-2.5 font-mono font-bold">{strat ? `$${Math.max(0, adjRev + strat.revenueChange) - Math.max(0, adjExp + strat.expenseChange)}` : '________'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* STEP 2: Show the math for your best option */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider">
              Step 2
            </span>
            <h3 className="text-sm font-bold text-slate-900">Show the math for your best option.</h3>

            <div className="flex gap-6 text-xs text-slate-700 font-mono">
              <span>Starting revenue: <strong>${adjRev}</strong></span>
              <span>Starting expenses: <strong>${adjExp}</strong></span>
              <span>Starting profit: <strong>${adjProfit}</strong></span>
            </div>

            <div className="text-xs space-y-2 pt-2">
              <div>Chosen fix: <strong>{chosenStrategy ? chosenStrategy.title : '________________________________________________'}</strong></div>
              <div>New revenue: <strong>${chosenStrategy ? Math.max(0, adjRev + chosenStrategy.revenueChange) : '__________'}</strong></div>
              <div>New expenses: <strong>${chosenStrategy ? Math.max(0, adjExp + chosenStrategy.expenseChange) : '__________'}</strong></div>
              <div className="font-mono pt-1">
                New profit/loss: $<strong>{chosenStrategy ? Math.max(0, adjRev + chosenStrategy.revenueChange) : '______'}</strong> − $<strong>{chosenStrategy ? Math.max(0, adjExp + chosenStrategy.expenseChange) : '______'}</strong> = $<strong>{chosenStrategy ? Math.max(0, adjRev + chosenStrategy.revenueChange) - Math.max(0, adjExp + chosenStrategy.expenseChange) : '______'}</strong>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-center gap-2">
              <span className="font-bold uppercase text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded">Time Saver</span>
              <span>If time is short, compare only two fixes and move straight to the recommendation page.</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            PBMF Week 2 • How Businesses Make Money
          </div>
        </section>

        {/* ================= PAGE 3 ================= */}
        <section className="space-y-6 border-b-2 border-dashed border-slate-300 pb-10 print:border-none print:pb-0 print:break-after-page">
          <div className="bg-[#1e293b] text-white rounded-2xl p-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">The Profit Fix Challenge</h2>
              <p className="text-xs text-slate-300 mt-1">Recommendation memo</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase block">PBMF WEEK 2 THURSDAY</span>
              <span className="text-xs font-semibold text-slate-300">page 3</span>
            </div>
          </div>

          {/* STEP 3: Write the business recommendation */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider">
              Step 3
            </span>
            <h3 className="text-sm font-bold text-slate-900">Write the business recommendation.</h3>

            <div className="text-xs space-y-3">
              <div className="border-b border-slate-300 pb-1">
                Our team recommends: <strong>{memo?.teamRecommendation || '________________________________________________'}</strong>
              </div>
              <div className="space-y-1">
                <div>This is the best decision because:</div>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic">
                  {memo?.whyBestDecision || '____________________________________________________________________________________'}
                </div>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic">
                  {!memo?.whyBestDecision && '____________________________________________________________________________________'}
                </div>
              </div>
            </div>
          </div>

          {/* MARKET FORCE & TRADE OFF */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Market Force
              </span>
              <p className="font-bold text-slate-800">Which factor does your fix respond to most?</p>
              <div className="space-y-1 text-slate-700">
                <div>[{memo?.marketForce === 'Costs' ? '✓' : ' '}] Costs</div>
                <div>[{memo?.marketForce === 'Price' ? '✓' : ' '}] Price</div>
                <div>[{memo?.marketForce === 'Demand' ? '✓' : ' '}] Demand</div>
                <div>[{memo?.marketForce === 'Competition' ? '✓' : ' '}] Competition</div>
              </div>
            </div>

            <div className="border border-rose-200 bg-rose-50/50 rounded-2xl p-4 space-y-2">
              <span className="px-2 py-0.5 rounded bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Trade-off
              </span>
              <p className="font-bold text-slate-800">What is one risk or trade-off with your fix?</p>
              <div className="border-b border-slate-300 pb-1 text-slate-700 italic mt-3">
                {memo?.riskTradeoff || '____________________________________________________'}
              </div>
              <div className="border-b border-slate-300 pb-1 text-slate-700 italic">
                {!memo?.riskTradeoff && '____________________________________________________'}
              </div>
            </div>
          </div>

          {/* MINI PITCH */}
          <div className="border border-slate-200 bg-slate-50/80 rounded-2xl p-5 space-y-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider">
              Mini Pitch
            </span>
            <p className="font-bold text-slate-800">Pitch frame:</p>
            <p className="text-slate-700 leading-relaxed italic">
              {memo?.miniPitch || 'We recommend ________ because it changes revenue by ________ and expenses by ________. Our new profit is ________, so this is a smart decision because ________.'}
            </p>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            PBMF Week 2 • How Businesses Make Money
          </div>
        </section>

        {/* ================= PAGE 4 ================= */}
        <section className="space-y-6 print:pb-0">
          <div className="bg-[#1e293b] text-white rounded-2xl p-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">The Profit Fix Challenge</h2>
              <p className="text-xs text-slate-300 mt-1">Exit ticket</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase block">PBMF WEEK 2 THURSDAY</span>
              <span className="text-xs font-semibold text-slate-300">page 4</span>
            </div>
          </div>

          {/* QUICK CHECK */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-700 text-white text-[10px] font-bold uppercase tracking-wider">
              Quick Check
            </span>
            <h3 className="font-bold text-slate-900">A business has $520 revenue and $475 expenses.</h3>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-800">1. Is it a profit or loss? Show the math.</p>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic mt-1">
                  {exitTicket?.q1MathWork || '____________________________________________________________________________________'}
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800">2. One fix raises revenue by $30 but raises expenses by $45. Should the owner do it? Why?</p>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic mt-1">
                  {exitTicket?.q2Reasoning || '____________________________________________________________________________________'}
                </div>
              </div>
            </div>
          </div>

          {/* FINAL REFLECTION */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider">
              Final Reflection
            </span>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-800">The most important thing I learned about profit is:</p>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic mt-1">
                  {exitTicket?.reflectionLearned || '____________________________________________________________________________________'}
                </div>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic">
                  {!exitTicket?.reflectionLearned && '____________________________________________________________________________________'}
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800">A business can be busy but still not profitable when:</p>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic mt-1">
                  {exitTicket?.reflectionBusyNotProfitable || '____________________________________________________________________________________'}
                </div>
                <div className="border-b border-slate-300 pb-1 text-slate-700 italic">
                  {!exitTicket?.reflectionBusyNotProfitable && '____________________________________________________________________________________'}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            PBMF Week 2 • How Businesses Make Money
          </div>
        </section>

      </div>
    </div>
  );
};
