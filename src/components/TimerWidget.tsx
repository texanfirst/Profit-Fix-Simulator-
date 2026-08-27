import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Volume2, Bell } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface TimerWidgetProps {
  initialSeconds?: number;
  onTimeUp?: () => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ initialSeconds = 120, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(initialSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            soundEffects.playAlert();
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, onTimeUp]);

  const toggleTimer = () => {
    soundEffects.playSelect();
    setIsActive(!isActive);
  };

  const resetTimer = (duration = selectedDuration) => {
    soundEffects.playSelect();
    setIsActive(false);
    setSecondsLeft(duration);
    setSelectedDuration(duration);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const isWarning = secondsLeft <= 30 && secondsLeft > 0;
  const isExpired = secondsLeft === 0;

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-md backdrop-blur">
      <div className="flex items-center gap-1.5">
        <Clock className={`w-4 h-4 ${isWarning ? 'text-amber-400 animate-pulse' : isExpired ? 'text-rose-400' : 'text-cyan-400'}`} />
        <span className={`font-mono font-bold text-sm tracking-wider ${isWarning ? 'text-amber-300' : isExpired ? 'text-rose-400' : 'text-slate-100'}`}>
          {formatTime(secondsLeft)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTimer}
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-200 transition"
          title={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          type="button"
          onClick={() => resetTimer()}
          aria-label="Reset timer"
          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-1 border-l border-slate-700 pl-2">
        <button
          type="button"
          onClick={() => resetTimer(60)}
          className={`px-1.5 py-0.5 text-xs rounded font-medium transition ${selectedDuration === 60 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          1m
        </button>
        <button
          type="button"
          onClick={() => resetTimer(120)}
          className={`px-1.5 py-0.5 text-xs rounded font-medium transition ${selectedDuration === 120 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          2m
        </button>
        <button
          type="button"
          onClick={() => resetTimer(300)}
          className={`px-1.5 py-0.5 text-xs rounded font-medium transition ${selectedDuration === 300 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          5m
        </button>
      </div>
    </div>
  );
};
