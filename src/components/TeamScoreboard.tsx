import React, { useState } from 'react';
import { 
  Users, Trophy, Plus, Trash2, Award, DollarSign, 
  TrendingUp, Sparkles, Check, Edit3 
} from 'lucide-react';
import { TeamScore } from '../types';
import { soundEffects } from '../utils/audio';

interface TeamScoreboardProps {
  teams: TeamScore[];
  activeTeamId: string;
  onSelectActiveTeam: (teamId: string) => void;
  onAddTeam: (teamName: string) => void;
  onRemoveTeam: (teamId: string) => void;
}

export const TeamScoreboard: React.FC<TeamScoreboardProps> = ({
  teams,
  activeTeamId,
  onSelectActiveTeam,
  onAddTeam,
  onRemoveTeam,
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    soundEffects.playSuccess();
    onAddTeam(newTeamName.trim());
    setNewTeamName('');
    setShowAddForm(false);
  };

  const sortedTeams = [...teams].sort((a, b) => b.totalProfit - a.totalProfit);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Trophy className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Classroom Team Leaderboard</h3>
            <p className="text-xs text-slate-500 font-medium">Track total accumulated business profit across rounds.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Student Team
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="e.g. Finance Hawks, Team Titan, Alpha Profit..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 outline-none focus:border-indigo-600"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            Add Team
          </button>
        </form>
      )}

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTeams.map((team, idx) => {
          const isActive = team.id === activeTeamId;
          const isLeader = idx === 0 && team.totalProfit > 0;

          return (
            <div
              key={team.id}
              onClick={() => {
                soundEffects.playSelect();
                onSelectActiveTeam(team.id);
              }}
              className={`relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
                isActive
                  ? 'ring-2 ring-indigo-600 border-indigo-500 bg-indigo-50/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              {isLeader && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3 h-3 fill-slate-950" /> 1st Place
                </span>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: team.color || '#4f46e5' }}
                >
                  {team.avatar || team.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    {team.name}
                    {isActive && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Rounds Played: {team.roundHistories.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Profit</span>
                  <strong className="text-base font-mono font-bold text-emerald-700">
                    ${team.totalProfit}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Rounds Solved</span>
                  <strong className="text-base font-mono font-bold text-indigo-700">
                    {team.roundsWon}
                  </strong>
                </div>
              </div>

              {teams.length > 1 && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playAlert();
                      onRemoveTeam(team.id);
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
