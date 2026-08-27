import React from 'react';
import { 
  Store, Shirt, Smartphone, Coffee, Car, Cookie, 
  TrendingUp, Sparkles, CloudRain, Users, Trophy, Wrench, BadgePercent, Star,
  DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck, Target, Zap, 
  Briefcase, CheckCircle2, AlertTriangle, HelpCircle
} from 'lucide-react';
import { BusinessCard, EventCard, ChallengeCard, StrategyCard } from '../types';

interface CardViewProps {
  card: BusinessCard | EventCard | ChallengeCard | StrategyCard;
  type: 'business' | 'event' | 'challenge' | 'strategy';
  isSelected?: boolean;
  isBestChoice?: boolean;
  onSelect?: () => void;
  onViewDetails?: () => void;
  showMetrics?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  type,
  isSelected = false,
  isBestChoice = false,
  onSelect,
  showMetrics = true,
  size = 'md',
  interactive = true,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Store': return <Store className="w-5 h-5 text-emerald-600" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-indigo-600" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-cyan-600" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'Car': return <Car className="w-5 h-5 text-blue-600" />;
      case 'Cookie': return <Cookie className="w-5 h-5 text-orange-600" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-rose-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-violet-600" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-600" />;
      case 'Users': return <Users className="w-5 h-5 text-purple-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-red-600" />;
      case 'BadgePercent': return <BadgePercent className="w-5 h-5 text-emerald-600" />;
      case 'Star': return <Star className="w-5 h-5 text-yellow-600" />;
      default: return <Briefcase className="w-5 h-5 text-slate-600" />;
    }
  };

  if (type === 'business') {
    const bCard = card as BusinessCard;
    return (
      <div 
        onClick={interactive && onSelect ? onSelect : undefined}
        className={`relative rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
          isSelected ? 'ring-2 ring-emerald-600 border-emerald-600' : 'border-slate-200'
        } ${interactive ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
      >
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-xl">
              {getIcon(bCard.iconName)}
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">Case Baseline</span>
              <h3 className="text-lg font-bold tracking-tight text-white leading-tight">{bCard.title}</h3>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
            {bCard.category}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            {bCard.scenarioStory}
          </p>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">Problem to Fix:</span>
              <p className="text-xs text-rose-800 font-medium mt-0.5 leading-normal">{bCard.problem}</p>
            </div>
          </div>

          {showMetrics && (
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] font-semibold text-slate-500 block">Revenue</span>
                <span className="text-base font-bold text-slate-900">${bCard.currentDay.revenue}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] font-semibold text-slate-500 block">Expenses</span>
                <span className="text-base font-bold text-slate-900">${bCard.currentDay.expenses}</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-center">
                <span className="text-[11px] font-semibold text-emerald-700 block">Profit</span>
                <span className="text-base font-bold text-emerald-700">${bCard.currentDay.profit}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'event') {
    const eCard = card as EventCard;
    const isCostSpike = eCard.expenseDelta > 0;
    const isRevGain = eCard.revenueDelta > 0;
    const isRevLoss = eCard.revenueDelta < 0;

    return (
      <div 
        onClick={interactive && onSelect ? onSelect : undefined}
        className={`relative rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
          isSelected ? 'ring-2 ring-amber-500 border-amber-500' : 'border-amber-200'
        } ${interactive ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
      >
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-950/60 rounded-lg">
              {getIcon(eCard.iconName)}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300">Market Event</span>
              <h4 className="text-base font-bold tracking-tight text-white leading-tight">{eCard.title}</h4>
            </div>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-200 font-semibold border border-amber-700">
            {eCard.tag}
          </span>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {eCard.description}
          </p>

          <blockquote className="text-xs italic text-slate-500 bg-slate-50 border-l-2 border-amber-400 pl-2.5 py-1">
            {eCard.flavorQuote}
          </blockquote>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">Condition Impact:</span>
            {eCard.revenueDelta !== 0 && (
              <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${
                isRevGain ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isRevGain ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                Rev {eCard.revenueDelta > 0 ? `+$${eCard.revenueDelta}` : `-$${Math.abs(eCard.revenueDelta)}`}
              </span>
            )}
            {eCard.expenseDelta !== 0 && (
              <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${
                isCostSpike ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isCostSpike ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                Exp {eCard.expenseDelta > 0 ? `+$${eCard.expenseDelta}` : `-$${Math.abs(eCard.expenseDelta)}`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'challenge') {
    const cCard = card as ChallengeCard;
    return (
      <div 
        onClick={interactive && onSelect ? onSelect : undefined}
        className={`relative rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
          isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-indigo-200'
        } ${interactive ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
      >
        <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-900/80 rounded-lg">
              <Target className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-300">Round Challenge</span>
              <h4 className="text-base font-bold tracking-tight text-white leading-tight">{cCard.title}</h4>
            </div>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-800 text-indigo-200 font-semibold border border-indigo-700">
            {cCard.badge}
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2.5">
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">Target Condition:</span>
            <p className="text-xs font-semibold text-indigo-950 mt-0.5">{cCard.targetGoal}</p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {cCard.description}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'strategy') {
    const sCard = card as StrategyCard;
    const isBest = isBestChoice;

    return (
      <div 
        onClick={interactive && onSelect ? onSelect : undefined}
        className={`relative rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
          isBest 
            ? 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/20' 
            : isSelected 
            ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/20' 
            : 'border-slate-200'
        } ${interactive ? 'cursor-pointer hover:-translate-y-1' : ''}`}
      >
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 rounded-lg">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">Strategy Fix</span>
              <h4 className="text-sm font-bold tracking-tight text-white leading-tight">{sCard.title}</h4>
            </div>
          </div>

          {isBest ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> Best Fix
            </span>
          ) : isSelected ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">
              Comparing
            </span>
          ) : (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {sCard.primaryMarketForce}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed">
            {sCard.description}
          </p>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Revenue Impact</span>
              <span className={`text-xs font-bold ${sCard.revenueChange > 0 ? 'text-emerald-700' : sCard.revenueChange < 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                {sCard.revenueChange > 0 ? `+$${sCard.revenueChange}` : sCard.revenueChange < 0 ? `-$${Math.abs(sCard.revenueChange)}` : '$0 (No change)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Expense Impact</span>
              <span className={`text-xs font-bold ${sCard.expenseChange < 0 ? 'text-emerald-700' : sCard.expenseChange > 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                {sCard.expenseChange < 0 ? `-$${Math.abs(sCard.expenseChange)} (Savings)` : sCard.expenseChange > 0 ? `+$${sCard.expenseChange}` : '$0 (No change)'}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-start gap-1.5 text-emerald-800">
              <span className="font-bold text-emerald-600 shrink-0">✓ Pro:</span>
              <span className="line-clamp-1">{sCard.pros[0]}</span>
            </div>
            <div className="flex items-start gap-1.5 text-amber-900">
              <span className="font-bold text-amber-600 shrink-0">⚠ Trade-off:</span>
              <span className="line-clamp-1">{sCard.riskTradeoff}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
