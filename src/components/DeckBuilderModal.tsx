import React, { useState } from 'react';
import { 
  X, Plus, Layers, Store, Sparkles, Target, Zap, 
  Trash2, Download, Upload, Check, RefreshCw 
} from 'lucide-react';
import { BusinessCard, EventCard, ChallengeCard, StrategyCard, MarketForce } from '../types';
import { soundEffects } from '../utils/audio';

interface DeckBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessCards: BusinessCard[];
  eventCards: EventCard[];
  challengeCards: ChallengeCard[];
  strategyCards: StrategyCard[];
  onAddBusinessCard: (card: BusinessCard) => void;
  onAddEventCard: (card: EventCard) => void;
  onAddChallengeCard: (card: ChallengeCard) => void;
  onAddStrategyCard: (card: StrategyCard) => void;
  onResetToDefaults: () => void;
}

export const DeckBuilderModal: React.FC<DeckBuilderModalProps> = ({
  isOpen,
  onClose,
  businessCards,
  eventCards,
  challengeCards,
  strategyCards,
  onAddBusinessCard,
  onAddEventCard,
  onAddChallengeCard,
  onAddStrategyCard,
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'business' | 'event' | 'challenge' | 'strategy'>('business');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [bTitle, setBTitle] = useState('');
  const [bCategory, setBCategory] = useState('Campus Store');
  const [bStory, setBStory] = useState('');
  const [bProblem, setBProblem] = useState('');
  const [bRevenue, setBRevenue] = useState(500);
  const [bExpenses, setBExpenses] = useState(420);

  const [eTitle, setETitle] = useState('');
  const [eDescription, setEDescription] = useState('');
  const [eRevDelta, setERevDelta] = useState(0);
  const [eExpDelta, setEExpDelta] = useState(50);
  const [eQuote, setEQuote] = useState('');

  const [sTitle, setSTitle] = useState('');
  const [sDescription, setSDescription] = useState('');
  const [sRevChange, setSRevChange] = useState(60);
  const [sExpChange, setSExpChange] = useState(0);
  const [sMarketForce, setSMarketForce] = useState<MarketForce>('Price');
  const [sRisk, setSRisk] = useState('');

  if (!isOpen) return null;

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim()) return;
    soundEffects.playSuccess();
    const newCard: BusinessCard = {
      id: `custom-b-${Date.now()}`,
      title: bTitle,
      subtitle: bCategory,
      iconName: 'Store',
      category: bCategory,
      scenarioStory: bStory || 'A busy local shop facing high operational costs.',
      problem: bProblem || 'Costs are too high, leaving little profit.',
      currentDay: {
        revenue: Number(bRevenue),
        expenses: Number(bExpenses),
        profit: Number(bRevenue) - Number(bExpenses),
      },
      targetTip: 'I can use evidence and calculations to recommend a business decision that improves profit.',
      standardTip: 'Revenue - Expenses = Profit. A smart fix improves what remains.',
    };
    onAddBusinessCard(newCard);
    setBTitle('');
    setShowAddForm(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle.trim()) return;
    soundEffects.playSuccess();
    const newCard: EventCard = {
      id: `custom-e-${Date.now()}`,
      title: eTitle,
      category: eExpDelta !== 0 ? 'cost' : 'demand',
      description: eDescription || 'A sudden market shift occurs this round.',
      revenueDelta: Number(eRevDelta),
      expenseDelta: Number(eExpDelta),
      flavorQuote: eQuote || '"Unexpected conditions hit our business!"',
      iconName: 'Sparkles',
      tag: 'Market Shift',
    };
    onAddEventCard(newCard);
    setETitle('');
    setShowAddForm(false);
  };

  const handleCreateStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim()) return;
    soundEffects.playSuccess();
    const newCard: StrategyCard = {
      id: `custom-s-${Date.now()}`,
      title: sTitle,
      category: sRevChange !== 0 ? 'pricing' : 'cost_cutting',
      revenueChange: Number(sRevChange),
      expenseChange: Number(sExpChange),
      description: sDescription || 'A targeted business fix to improve margins.',
      pros: ['Improves overall net margin'],
      cons: ['Requires strategic management'],
      primaryMarketForce: sMarketForce,
      riskTradeoff: sRisk || 'Requires monitoring customer reaction.',
      recommendedPitch: 'it smartly balances revenue and expenses.',
    };
    onAddStrategyCard(newCard);
    setSTitle('');
    setShowAddForm(false);
  };

  const handleExportJson = () => {
    const data = {
      businesses: businessCards,
      events: eventCards,
      challenges: challengeCards,
      strategies: strategyCards,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-fix-custom-decks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Custom Card Deck & Library Builder</h3>
              <p className="text-xs text-slate-500 font-medium">Add, customize, or inspect business cases, events, and strategy cards for your classroom.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => { setActiveTab('business'); setShowAddForm(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'business' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Businesses ({businessCards.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('event'); setShowAddForm(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'event' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Events ({eventCards.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('strategy'); setShowAddForm(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'strategy' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Strategies ({strategyCards.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Card
            </button>
          </div>
        </div>

        {/* Modal Body / Card List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Add Forms */}
          {showAddForm && activeTab === 'business' && (
            <form onSubmit={handleCreateBusiness} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Create New Business Case Baseline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  placeholder="Business Title (e.g. Campus Coffee Cart)"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  required
                />
                <input
                  type="text"
                  value={bCategory}
                  onChange={(e) => setBCategory(e.target.value)}
                  placeholder="Category (e.g. Food & Beverage)"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
              <textarea
                rows={2}
                value={bStory}
                onChange={(e) => setBStory(e.target.value)}
                placeholder="Scenario description / story..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
              <input
                type="text"
                value={bProblem}
                onChange={(e) => setBProblem(e.target.value)}
                placeholder="Identified Problem (e.g. Too much inventory spoilage)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Starting Revenue ($)</label>
                  <input
                    type="number"
                    value={bRevenue}
                    onChange={(e) => setBRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Starting Expenses ($)</label>
                  <input
                    type="number"
                    value={bExpenses}
                    onChange={(e) => setBExpenses(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Save Business Card to Deck
              </button>
            </form>
          )}

          {showAddForm && activeTab === 'event' && (
            <form onSubmit={handleCreateEvent} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Create New Market Event Card</h4>
              <input
                type="text"
                value={eTitle}
                onChange={(e) => setETitle(e.target.value)}
                placeholder="Event Title (e.g. Friday Pep Rally)"
                className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs text-slate-900 bg-white"
                required
              />
              <textarea
                rows={2}
                value={eDescription}
                onChange={(e) => setEDescription(e.target.value)}
                placeholder="Event description..."
                className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs text-slate-900 bg-white"
              />
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Revenue Change (+/- $)</label>
                  <input
                    type="number"
                    value={eRevDelta}
                    onChange={(e) => setERevDelta(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Expense Change (+/- $)</label>
                  <input
                    type="number"
                    value={eExpDelta}
                    onChange={(e) => setEExpDelta(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-slate-900 bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs"
              >
                Save Event Card to Deck
              </button>
            </form>
          )}

          {showAddForm && activeTab === 'strategy' && (
            <form onSubmit={handleCreateStrategy} className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Create New Strategy Card</h4>
              <input
                type="text"
                value={sTitle}
                onChange={(e) => setSTitle(e.target.value)}
                placeholder="Strategy Title (e.g. Introduce Bulk Smoothie Pack)"
                className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-xs text-slate-900 bg-white"
                required
              />
              <textarea
                rows={2}
                value={sDescription}
                onChange={(e) => setSDescription(e.target.value)}
                placeholder="Strategy description..."
                className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-xs text-slate-900 bg-white"
              />
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Revenue Change (+/- $)</label>
                  <input
                    type="number"
                    value={sRevChange}
                    onChange={(e) => setSRevChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Expense Change (+/- $)</label>
                  <input
                    type="number"
                    value={sExpChange}
                    onChange={(e) => setSExpChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-indigo-300 text-slate-900 bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs"
              >
                Save Strategy Card to Deck
              </button>
            </form>
          )}

          {/* Render List based on Active Tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeTab === 'business' && (
              businessCards.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>{b.title}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{b.category}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{b.scenarioStory}</p>
                  <div className="flex gap-4 font-mono font-bold text-slate-800 pt-1">
                    <span>Rev: ${b.currentDay.revenue}</span>
                    <span>Exp: ${b.currentDay.expenses}</span>
                    <span className="text-emerald-700">Profit: ${b.currentDay.profit}</span>
                  </div>
                </div>
              ))
            )}

            {activeTab === 'event' && (
              eventCards.map((e) => (
                <div key={e.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-sm text-amber-950">
                    <span>{e.title}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">{e.tag}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{e.description}</p>
                  <div className="flex gap-4 font-mono font-bold text-slate-800 pt-1">
                    <span>Rev Δ: {e.revenueDelta >= 0 ? `+$${e.revenueDelta}` : `-$${Math.abs(e.revenueDelta)}`}</span>
                    <span>Exp Δ: {e.expenseDelta >= 0 ? `+$${e.expenseDelta}` : `-$${Math.abs(e.expenseDelta)}`}</span>
                  </div>
                </div>
              ))
            )}

            {activeTab === 'strategy' && (
              strategyCards.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>{s.title}</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{s.primaryMarketForce}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{s.description}</p>
                  <div className="flex gap-4 font-mono font-bold text-slate-800 pt-1">
                    <span className={s.revenueChange > 0 ? 'text-emerald-700' : 'text-slate-600'}>
                      Rev: {s.revenueChange >= 0 ? `+$${s.revenueChange}` : `-$${Math.abs(s.revenueChange)}`}
                    </span>
                    <span className={s.expenseChange < 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      Exp: {s.expenseChange <= 0 ? `-$${Math.abs(s.expenseChange)}` : `+$${s.expenseChange}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onResetToDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold underline"
          >
            Reset All Decks to Classroom Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
