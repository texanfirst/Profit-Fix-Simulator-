import React from 'react';
import { 
  X, HelpCircle, Lightbulb, Calculator, TrendingUp, 
  DollarSign, ShieldAlert, Sparkles, BookOpen 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AdvisorHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorHelpModal: React.FC<AdvisorHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-2xl">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Consultant Pocket Playbook & Advisor
              </h3>
              <p className="text-xs text-slate-500 font-medium">Quick reference guide for independent business rescues</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close playbook modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-xs sm:text-sm text-slate-700">
          {/* THE GOLDEN FORMULA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-700" />
              <h4 className="font-extrabold text-emerald-950 text-sm">The Golden Formula</h4>
            </div>
            <div className="font-mono font-black text-base sm:text-lg text-emerald-800 bg-white p-3 rounded-xl border border-emerald-300 text-center shadow-inner">
              Revenue − Expenses = Profit (or Loss)
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs pt-1">
              <li><strong>Revenue:</strong> Total money collected from selling goods or services.</li>
              <li><strong>Expenses:</strong> All costs to operate (supplies, wages, rent, shipping, waste).</li>
              <li><strong>Profit:</strong> The money you actually get to keep after all costs are paid.</li>
            </ul>
          </div>

          {/* TWO WAYS TO FIX PROFIT */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-700">
              How To Increase Profit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">1. Boost Revenue (↑)</strong>
                <p className="text-slate-500">Raise prices slightly, create value bundles, run promotions, or increase sales volume.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">2. Cut Expenses (↓)</strong>
                <p className="text-slate-500">Buy in wholesale bulk, reduce ingredient waste, streamline labor bottlenecks, or eliminate slow sellers.</p>
              </div>
            </div>
          </div>

          {/* THE 4 MARKET FORCES */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
              The 4 Market Forces
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <strong className="text-amber-900 block">Costs</strong>
                <span className="text-slate-600">Cost of raw ingredients, parts, utilities, or supplies.</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <strong className="text-amber-900 block">Price</strong>
                <span className="text-slate-600">What customers are charged per item or service.</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <strong className="text-amber-900 block">Demand</strong>
                <span className="text-slate-600">How many customers want to buy right now.</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <strong className="text-amber-900 block">Competition</strong>
                <span className="text-slate-600">Other shops offering alternative options nearby.</span>
              </div>
            </div>
          </div>

          {/* TRADE-OFFS & RISKS */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5 text-xs text-rose-950">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>What is a Trade-off?</span>
            </div>
            <p className="text-slate-700">
              Every business choice has a trade-off (giving up one benefit to gain another). For example: <em>raising prices</em> increases revenue per item, but might make a few customers upset. A smart consultant always identifies the risk!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Got It, Back to Game!
          </button>
        </div>
      </div>
    </div>
  );
};
