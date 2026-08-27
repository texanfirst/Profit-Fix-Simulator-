import React, { useState } from 'react';
import { 
  X, User, Award, DollarSign, TrendingUp, Sparkles, 
  Check, Shield, Zap, FileText, ChevronRight 
} from 'lucide-react';
import { StudentProfile, AchievementBadge } from '../types';
import { ACHIEVEMENT_BADGES, CONSULTANT_RANKS } from '../data/campaignMissions';
import { soundEffects } from '../utils/audio';

interface ConsultantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onOpenCertificate: () => void;
}

const AVATAR_OPTIONS = ['🦊', '🚀', '💼', '⚡', '👑', '🎯', '🐯', '🦅', '🤖', '🧙', '🌟', '🍕'];
const COLOR_OPTIONS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#3b82f6', '#14b8a6'];

export const ConsultantProfileModal: React.FC<ConsultantProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenCertificate,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [selectedColor, setSelectedColor] = useState(profile.avatarColor);
  const [activeTab, setActiveTab] = useState<'profile' | 'badges'>('profile');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSuccess();
    onUpdateProfile({
      name: nameInput.trim() || 'Consultant',
      avatar: selectedAvatar,
      avatarColor: selectedColor,
    });
  };

  const currentRankInfo = CONSULTANT_RANKS.find((r) => r.level === profile.level) || CONSULTANT_RANKS[0];
  const nextRankInfo = CONSULTANT_RANKS.find((r) => r.level === profile.level + 1);
  const xpNeeded = nextRankInfo ? nextRankInfo.minXP - currentRankInfo.minXP : 500;
  const currentLevelXP = profile.xp - currentRankInfo.minXP;
  const xpPercent = Math.min(100, Math.max(0, (currentLevelXP / (xpNeeded || 1)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.avatar}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                {profile.name}
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                  Lv. {profile.level} {profile.consultantRank}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Independent Business Rescue Consultant Profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 border-b border-slate-100 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Character & Career Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'badges' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Badges & Achievements ({profile.unlockedBadgeIds.length}/{ACHIEVEMENT_BADGES.length})
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">Career Profit</span>
                <strong className="text-xl font-mono font-black text-emerald-800">${profile.careerProfit}</strong>
              </div>
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-cyan-700 tracking-wider block">Total XP</span>
                <strong className="text-xl font-mono font-black text-cyan-800">{profile.xp} XP</strong>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">Missions Done</span>
                <strong className="text-xl font-mono font-black text-amber-800">{profile.completedMissionIds.length}</strong>
              </div>
            </div>

            {/* Level & XP Progress Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Level {profile.level}: {profile.consultantRank}
                </span>
                <span className="text-slate-500 font-mono">
                  {currentLevelXP} / {xpNeeded} XP to {nextRankInfo ? nextRankInfo.title : 'Max'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Customize Name & Avatar Form */}
            <form onSubmit={handleSave} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Consultant Name / Nickname</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={24}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Choose Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        soundEffects.playSelect();
                        setSelectedAvatar(av);
                      }}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border ${
                        selectedAvatar === av
                          ? 'border-cyan-500 bg-cyan-50 scale-110 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Choose Avatar Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        soundEffects.playSelect();
                        setSelectedColor(c);
                      }}
                      className={`w-8 h-8 rounded-full transition border-2 ${
                        selectedColor === c ? 'border-slate-900 scale-110 shadow-md' : 'border-white'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCertificate();
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition border border-indigo-200"
                >
                  <FileText className="w-3.5 h-3.5" /> View Official Certificate
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <Check className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-xs text-slate-500 font-medium">
              Complete challenges, prove math equations, and optimize profits to unlock achievements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENT_BADGES.map((badge) => {
                const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                      isUnlocked
                        ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked ? 'bg-amber-400/30' : 'bg-slate-200'
                    }`}>
                      {badge.icon}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900">{badge.title}</h4>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">Locked</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
