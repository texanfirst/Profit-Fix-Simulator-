import React from 'react';
import { 
  Tv, Printer, Layers, Users, Volume2, VolumeX, 
  RotateCcw, Sparkles, Award, FileText, ChevronRight, CheckCircle2,
  Map, Lightbulb, Zap, User, DollarSign, ArrowLeft
} from 'lucide-react';
import { AppViewMode, GameStep, StudentProfile } from '../types';
import { TimerWidget } from './TimerWidget';
import { soundEffects } from '../utils/audio';
import { CONSULTANT_RANKS } from '../data/campaignMissions';

interface HeaderProps {
  viewMode: AppViewMode;
  gameStep: GameStep;
  profile: StudentProfile;
  activeMissionTitle?: string;
  isMuted: boolean;
  onSelectStep: (step: GameStep) => void;
  onToggleViewMode: (mode: AppViewMode) => void;
  onToggleMute: () => void;
  onOpenProfile: () => void;
  onOpenAdvisorHelp: () => void;
  onOpenDeckBuilder: () => void;
  onResetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  gameStep,
  profile,
  activeMissionTitle,
  isMuted,
  onSelectStep,
  onToggleViewMode,
  onToggleMute,
  onOpenProfile,
  onOpenAdvisorHelp,
  onOpenDeckBuilder,
  onResetGame,
}) => {
  const steps: { id: GameStep; label: string; pageLabel: string }[] = [
    { id: 'briefing', label: '1. Case File', pageLabel: 'Page 1' },
    { id: 'strategy_compare', label: '2. Compare Fixes', pageLabel: 'Page 2' },
    { id: 'show_math', label: '3. Prove Math', pageLabel: 'Page 2' },
    { id: 'recommendation_memo', label: '4. Executive Pitch', pageLabel: 'Page 3' },
    { id: 'exit_ticket', label: '5. Exit Ticket', pageLabel: 'Page 4' },
  ];

  const currentRank = CONSULTANT_RANKS.find((r) => r.level === profile.level) || CONSULTANT_RANKS[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur shadow-md font-sans">
      {/* Main Game Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Campaign Map Link */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              soundEffects.playSelect();
              onToggleViewMode('campaign_map');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="Return to Mission Map"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md group-hover:scale-105 transition">
              PF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight flex items-center gap-1.5">
                  The Profit Fix Tycoon
                </h1>
                <span className="px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider border border-cyan-500/30">
                  Game Mode
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                PBMF • Revenue − Expenses = Profit
              </p>
            </div>
          </div>
        </div>

        {/* Student Consultant Profile HUD */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mission Map Link Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onToggleViewMode('campaign_map');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border cursor-pointer ${
              viewMode === 'campaign_map'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Mission Map</span>
          </button>

          {/* Student Profile Pill with XP & Profit */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onOpenProfile();
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-bold transition shadow-xs group cursor-pointer"
            title="Open Consultant Profile & Badges"
          >
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm shadow-xs group-hover:scale-110 transition"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.avatar}
            </div>

            <div className="text-left leading-tight hidden xs:block">
              <div className="flex items-center gap-1">
                <span className="text-white text-xs font-bold group-hover:text-cyan-300 transition">
                  {profile.name}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  Lv.{profile.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">${profile.careerProfit}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-bold">{profile.xp} XP</span>
              </div>
            </div>
          </button>

          {/* Pocket Playbook / Advisor Hint */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onOpenAdvisorHelp();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            title="Open Formula & Help Playbook"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Playbook</span>
          </button>

          {/* Printable Worksheet View */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onToggleViewMode('worksheet_print');
            }}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
              viewMode === 'worksheet_print'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="View & Print 4-Page Classroom Worksheet Handout"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Handouts</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Step Tabs Matching the 4-Page Worksheet Progression or Tycoon Mode */}
      {viewMode === 'game' && (
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 py-1.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-max">
            <div className="flex items-center gap-2">
              {steps.map((s) => {
                const isCurrent = gameStep === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playSelect();
                      onSelectStep(s.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-black scale-102'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            {activeMissionTitle && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium pr-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Case File: <strong className="text-white">{activeMissionTitle}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'tycoon_sim' && (
        <div className="bg-slate-950/90 border-t border-cyan-500/30 px-4 sm:px-6 py-1.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                🎮 Live 5-Day Business Rescue Simulator
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">Set Price, Quality, Staffing & Upgrades Daily</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleViewMode('game')}
                className="text-slate-400 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Switch to Board Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

