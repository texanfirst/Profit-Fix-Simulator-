import React from 'react';
import { 
  X, Award, Printer, Download, Sparkles, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { StudentProfile } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/campaignMissions';

interface OfficialCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const earnedBadges = ACHIEVEMENT_BADGES.filter((b) => profile.unlockedBadgeIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-10 shadow-2xl space-y-6 my-6 relative print:p-0 print:border-0 print:shadow-none">
        
        {/* Controls bar (hidden on print) */}
        <div className="print:hidden flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">Official Turnaround Consultant Certificate</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Frame */}
        <div className="border-8 border-double border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 bg-gradient-to-b from-amber-50/40 via-white to-sky-50/30 relative overflow-hidden font-serif">
          
          {/* Top Seal & Heading */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-slate-800 font-sans"
                style={{ backgroundColor: profile.avatarColor }}
              >
                {profile.avatar}
              </div>
            </div>
            
            <span className="text-[11px] font-sans font-extrabold uppercase tracking-widest text-cyan-800 block pt-2">
              Principles of Business, Marketing & Finance • Week 2 Certification
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Certificate of Business Rescue Mastery
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans italic">
              This official credential certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="border-b-2 border-slate-800 pb-2 max-w-md mx-auto">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-wide">
              {profile.name}
            </span>
          </div>

          {/* Body Text */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto font-sans">
            has successfully analyzed live business case files, tested multi-variable strategy fixes, solved the fundamental formula <strong className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">Revenue − Expenses = Profit</strong>, and defended executive recommendations in the classroom boardroom.
          </p>

          {/* Career Stats Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto font-sans text-xs">
            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultant Rank</span>
              <strong className="text-sm font-bold text-cyan-800">Lv. {profile.level} {profile.consultantRank}</strong>
            </div>
            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Career Profit</span>
              <strong className="text-sm font-mono font-bold text-emerald-700">${profile.careerProfit}</strong>
            </div>
            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Badges Unlocked</span>
              <strong className="text-sm font-bold text-amber-700">{profile.unlockedBadgeIds.length} Badges</strong>
            </div>
          </div>

          {/* Badges strip if earned */}
          {earnedBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-sans">
              {earnedBadges.slice(0, 6).map((b) => (
                <span key={b.id} className="px-2.5 py-1 bg-white border border-amber-200 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                  <span>{b.icon}</span> {b.title}
                </span>
              ))}
            </div>
          )}

          {/* Footer Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 max-w-md mx-auto font-sans text-xs">
            <div>
              <div className="border-b border-slate-400 pb-1 font-mono font-bold text-slate-800">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Date Completed</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-emerald-800 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Master
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">PBMF Board Seal</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
