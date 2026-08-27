import React, { useEffect } from 'react';
import { 
  Award, Star, CheckCircle2, AlertTriangle, TrendingUp, 
  ArrowRight, RotateCcw, FileCheck, Share2, Printer, Sparkles,
  Zap, DollarSign, Map, Trophy
} from 'lucide-react';
import { BoardEvaluation, CalculatedRoundData } from '../utils/gameLogic';
import { BusinessCard, EventCard, ChallengeCard, StrategyCard, RoundStudentInput, StudentProfile } from '../types';
import { soundEffects } from '../utils/audio';
import { triggerConfetti, triggerBigCelebration } from '../utils/confetti';

interface RoundResultsModalProps {
  isOpen: boolean;
  business: BusinessCard;
  event: EventCard | null;
  challenge: ChallengeCard | null;
  chosenStrategy: StrategyCard;
  calcData: CalculatedRoundData;
  evaluation: BoardEvaluation;
  studentInput: RoundStudentInput;
  profile: StudentProfile;
  earnedXP: number;
  newBadgesEarned: string[];
  isCampaignMission?: boolean;
  onProceedToExitTicket: () => void;
  onProceedToMissionMap: () => void;
  onStartNextRound: () => void;
  onReplayRound: () => void;
}

export const RoundResultsModal: React.FC<RoundResultsModalProps> = ({
  isOpen,
  business,
  event,
  challenge,
  chosenStrategy,
  calcData,
  evaluation,
  studentInput,
  profile,
  earnedXP,
  newBadgesEarned,
  isCampaignMission = false,
  onProceedToExitTicket,
  onProceedToMissionMap,
  onStartNextRound,
  onReplayRound,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (evaluation.stars >= 4) {
        triggerBigCelebration();
        soundEffects.playSuccess();
      } else {
        triggerConfetti();
        soundEffects.playCoin();
      }
    }
  }, [isOpen, evaluation.stars]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-6">
        {/* Header Banner */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-emerald-700" />
            Turnaround Evaluation & Rewards
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {evaluation.stars >= 4 ? '🎉 Outstanding Business Rescue!' : 'Mission Completed!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Financial audit and board defense review for <strong>{business.title}</strong>
          </p>
        </div>

        {/* Score & Star Rating Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-6 text-center space-y-4 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-7 h-7 sm:w-9 sm:h-9 transition-all duration-300 ${
                  star <= evaluation.stars 
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-md' 
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {evaluation.score}
            </span>
            <span className="text-slate-400 font-bold text-sm sm:text-base">/ 100 PTS</span>
          </div>

          {/* Gamified Rewards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-700/60 text-xs">
            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Final Profit</span>
              <strong className="text-emerald-400 font-mono text-base font-bold">
                ${calcData.finalProfit}
              </strong>
            </div>

            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Profit Gain</span>
              <strong className={`font-mono text-base font-bold ${calcData.profitGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calcData.profitGain >= 0 ? `+$${calcData.profitGain}` : `-$${Math.abs(calcData.profitGain)}`}
              </strong>
            </div>

            <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Margin</span>
              <strong className="text-cyan-400 font-mono text-base font-bold">
                {calcData.profitMarginPct.toFixed(1)}%
              </strong>
            </div>

            <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-600/40">
              <span className="text-amber-300 block font-bold text-[10px] uppercase">XP Earned</span>
              <strong className="text-amber-400 font-mono text-base font-black flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{earnedXP}
              </strong>
            </div>
          </div>
        </div>

        {/* New Badges Notification */}
        {newBadgesEarned.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-center gap-3">
            <span className="text-2xl">🎖️</span>
            <div>
              <strong className="text-amber-950 text-xs font-bold block">New Achievement Unlocked!</strong>
              <p className="text-xs text-amber-800">{newBadgesEarned.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Challenge Goal Outcome */}
        {challenge && (
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
            evaluation.isChallengeCompleted 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            {evaluation.isChallengeCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px]">
                Challenge Condition: {challenge.title}
              </span>
              <p className="mt-0.5 font-medium">{evaluation.challengeStatusMessage}</p>
            </div>
          </div>
        )}

        {/* Board Strengths & Recommendations */}
        <div className="space-y-3 text-xs">
          {evaluation.strengths.length > 0 && (
            <div className="space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Board Commendations:
              </span>
              <ul className="space-y-1 text-emerald-900 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.tipsForImprovement.length > 0 && (
            <div className="space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Advisory Guidance for Future Missions:
              </span>
              <ul className="space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {evaluation.tipsForImprovement.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-medium">
                    <span className="text-amber-600 font-bold">→</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSelect();
              onReplayRound();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-test Strategy
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSelect();
                onProceedToExitTicket();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-initial"
            >
              <FileCheck className="w-4 h-4 text-cyan-700" />
              <span>Exit Ticket (Page 4)</span>
            </button>

            {isCampaignMission ? (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  onProceedToMissionMap();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-md shadow-emerald-200 cursor-pointer flex-1 sm:flex-initial"
              >
                <Map className="w-4 h-4" />
                <span>Next Mission Map</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playCardFlip();
                  onStartNextRound();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-md shadow-emerald-200 cursor-pointer flex-1 sm:flex-initial"
              >
                <span>Next Random Case</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

