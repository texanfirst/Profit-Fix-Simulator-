import React from 'react';
import { 
  Play, Lock, Star, Trophy, Sparkles, Zap, 
  ChevronRight, Award, Shield, DollarSign, Store, Coffee, Smartphone, Shirt, Truck 
} from 'lucide-react';
import { CampaignMission, StudentProfile } from '../types';
import { CAMPAIGN_MISSIONS } from '../data/campaignMissions';
import { soundEffects } from '../utils/audio';

interface CampaignMapViewProps {
  profile: StudentProfile;
  onSelectMission: (mission: CampaignMission) => void;
  onStartTycoonSim: (mission?: CampaignMission) => void;
  onStartSandbox: () => void;
  onOpenProfile: () => void;
}

export const CampaignMapView: React.FC<CampaignMapViewProps> = ({
  profile,
  onSelectMission,
  onStartTycoonSim,
  onStartSandbox,
  onOpenProfile,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Top context banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/15 text-cyan-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-cyan-500/25">
                Game Dashboard
              </span>
              <span className="text-slate-400 text-xs font-semibold">This top bar is just your dashboard.</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              The Profit Fix Challenge
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Your actual first choice is below: pick a game mode, then rescue a business using revenue, expenses, and profit.
            </p>
          </div>

          {/* Quick Profile Summary Card */}
          <div 
            onClick={() => {
              soundEffects.playSelect();
              onOpenProfile();
            }}
            className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition shrink-0 group"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  Player Profile
                </strong>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-1.5 py-0.2 rounded font-bold">
                  Lv.{profile.level}
                </span>
              </div>
              <span className="text-xs text-slate-400 block">{profile.name} - not the start button</span>
              <div className="flex items-center gap-2 mt-1 text-xs font-mono font-bold">
                <span className="text-emerald-400">${profile.careerProfit}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400">{profile.xp} XP</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </div>
        </div>
      </div>

      {/* Featured Mode Select */}
      <div className="space-y-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-200 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            <Zap className="w-4 h-4" />
            Start Here
          </div>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Choose one of these two options
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Want a fast game with business decisions? Pick the tycoon sim. Want a class assignment with written proof? Pick the case pitch.
          </p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card A: 5-Day Live Tycoon Simulation */}
        <div className="bg-gradient-to-br from-cyan-900/40 via-slate-900 to-slate-900 border-2 border-cyan-500/70 rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <span className="absolute right-4 top-4 bg-cyan-300 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
            Option 1
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                <Play className="w-4 h-4 fill-cyan-400" />
              </span>
              <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider">Live Tycoon Simulation</span>
            </div>
            <h3 className="text-lg font-black text-white">5-Day Turnaround Sprint</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Play like a business owner. Set prices, hire help, buy upgrades, handle surprises, and watch profit change day by day.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onStartTycoonSim();
            }}
            className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Launch Live 5-Day Tycoon Sim</span>
          </button>
        </div>

        {/* Card B: Classroom Board Case Study */}
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 flex flex-col justify-between shadow-lg relative">
          <span className="absolute right-4 top-4 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
            Option 2
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Trophy className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">Curriculum Case Study</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">Executive Pitch & Proofs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Work like a consultant. Compare strategy cards, show the math for Revenue - Expenses = Profit, and explain your recommendation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onStartSandbox();
            }}
            className="mt-4 w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <span>Start Case Pitch Mode</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>

      {/* Campaign Mission Cards Grid / Path */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Choose a Business to Rescue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAMPAIGN_MISSIONS.map((mission, idx) => {
            const isUnlocked = profile.level >= mission.unlockRequirementLevel;
            const isCompleted = profile.completedMissionIds.includes(mission.id);
            const stars = profile.missionStars[mission.id] || (isCompleted ? 3 : 0);

            return (
              <div
                key={mission.id}
                className={`relative rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                    : 'bg-slate-100/80 border-slate-200 opacity-75'
                }`}
              >
                {/* Level Tag & Stars */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      mission.levelNumber === 5
                        ? 'bg-rose-600 text-white'
                        : isUnlocked
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-400 text-white'
                    }`}>
                      {mission.levelNumber === 5 ? '🔥 Boss Level 5' : `Level ${mission.levelNumber}`}
                    </span>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Client & Story Brief */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                      {mission.clientAvatar}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                        {mission.title}
                      </h3>
                      <span className="text-xs text-slate-500 block font-medium">
                        Client: {mission.clientName} ({mission.clientRole})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 italic">
                    "{mission.storyDialog}"
                  </p>

                  {/* Business & Reward Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/70 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting</span>
                      <strong className="text-slate-800 font-mono">
                        ${mission.business.currentDay.revenue} Rev • ${mission.business.currentDay.profit} Prof
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Mission Reward</span>
                      <strong className="text-amber-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +{mission.rewardXP} XP
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Launch Actions (Sim vs Case) */}
                <div className="space-y-2">
                  {isUnlocked ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playSelect();
                          onStartTycoonSim(mission);
                        }}
                        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>🎮 Play 5-Day Tycoon Sim</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playSelect();
                          onSelectMission(mission);
                        }}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <span>📋 Board Case & Pitch</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" /> Unlock at Level {mission.unlockRequirementLevel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
