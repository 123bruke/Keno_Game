import React from 'react';
import { useAdminStore } from '../store/useStore';
import { 
  Play, Pause, Zap, RotateCcw, HelpCircle, 
  Clock, Users, Coins, Percent, Award, AlertOctagon 
} from 'lucide-react';
import { LiveGameRound } from '../types';

interface LiveGameMonitoringProps {
  currentRound: LiveGameRound;
  onStartDraw: () => Promise<void>;
  onPauseDraw: () => Promise<void>;
  onResumeDraw: () => Promise<void>;
  onEndDraw: () => Promise<void>;
  onCancelRound: () => Promise<void>;
  isLoading: boolean;
}

export const LiveGameMonitoring: React.FC<LiveGameMonitoringProps> = ({
  currentRound, onStartDraw, onPauseDraw, onResumeDraw, onEndDraw, onCancelRound, isLoading
}) => {
  const { addToast } = useAdminStore();

  const handleStartDraw = async () => {
    try {
      await onStartDraw();
      addToast('Game Command', 'Betting window closed. Random drawing initiated.', 'success');
    } catch (err) {
      addToast('Control Error', 'Failed to trigger draw.', 'error');
    }
  };

  const handlePauseDraw = async () => {
    try {
      await onPauseDraw();
      addToast('Game Command', 'Auto countdown timer paused.', 'warning');
    } catch (err) {
      addToast('Control Error', 'Failed to pause game.', 'error');
    }
  };

  const handleResumeDraw = async () => {
    try {
      await onResumeDraw();
      addToast('Game Command', 'Game timers resumed successfully.', 'success');
    } catch (err) {
      addToast('Control Error', 'Failed to resume game.', 'error');
    }
  };

  const handleEndDraw = async () => {
    try {
      await onEndDraw();
      addToast('Game Command', 'Forcing draw sequential completion and processing tickets.', 'success');
    } catch (err) {
      addToast('Control Error', 'Failed to force end draw.', 'error');
    }
  };

  const handleCancelRound = async () => {
    if (!window.confirm('CRITICAL: Cancel current round and refund ALL active stakes to user wallets? This is irreversible.')) return;
    try {
      await onCancelRound();
      addToast('Game Cancelled', 'Round voided. Refunding bets completed.', 'error');
    } catch (err) {
      addToast('Control Error', 'Failed to cancel round.', 'error');
    }
  };

  // Generate 80 numbers for board preview
  const balls = Array.from({ length: 80 }, (_, i) => i + 1);

  return (
    <div id="live-games-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Live Draw Console</h2>
          <p className="text-xs text-slate-400">Monitor active drawing states, view countdown loops, and manually control draws.</p>
        </div>
        
        {/* Live Indicator */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${
            currentRound.status === 'drawing' ? 'bg-amber-500 animate-ping' :
            currentRound.status === 'betting' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
          }`}></span>
          <span className="text-slate-400">Engine State:</span>
          <span className="font-bold text-slate-200 uppercase">{currentRound.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Monitor Panel (Left & Center) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Keno Board Matrix */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Draw Grid Board</span>
                <span className="text-[10px] text-slate-500 normal-case font-normal">(1 - 80)</span>
              </h3>
              <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-[0_0_8px_#8b5cf6]"></span>Drawn ({currentRound.drawProgress}/20)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></span>Pending</span>
              </div>
            </div>

            {/* Board Grid */}
            <div className="grid grid-cols-10 gap-2">
              {balls.map((num) => {
                const isDrawn = currentRound.winningNumbers.includes(num);
                const isRecent = currentRound.winningNumbers[currentRound.winningNumbers.length - 1] === num;
                return (
                  <div
                    key={num}
                    id={`keno-ball-${num}`}
                    className={`aspect-square flex items-center justify-center rounded-xl border font-mono text-[11px] font-extrabold transition-all duration-300 ${
                      isDrawn 
                        ? isRecent 
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-300 text-slate-950 scale-105 shadow-[0_0_15px_#f59e0b]'
                          : 'bg-gradient-to-tr from-purple-600 to-indigo-600 border-purple-400 text-slate-100 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                        : 'bg-slate-900/40 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-400'
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sequential Drawn list preview */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider mb-3">Drawn Balls Sequence</h3>
            {currentRound.winningNumbers.length > 0 ? (
              <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
                {currentRound.winningNumbers.map((num, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-slate-100 text-xs font-bold flex items-center justify-center font-mono shadow-[0_2px_8px_rgba(139,92,246,0.3)] border border-purple-400/30"
                  >
                    {num}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center border border-dashed border-slate-900 rounded-xl">
                <p className="text-xs text-slate-500 font-mono">No numbers drawn yet. Betting window is open...</p>
              </div>
            )}
          </div>
        </div>

        {/* Round details, Stats & Action controls (Right Sidepanel) */}
        <div className="space-y-6">
          
          {/* Telemetry metrics */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl space-y-4">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Round telemetry</h3>
              <p className="text-lg font-black text-slate-200 tracking-tight font-mono mt-1"># {currentRound.roundNumber}</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-900/50">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> Countdown Timer</span>
                <span className={`font-bold ${currentRound.countdown <= 10 && currentRound.status === 'betting' ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                  {currentRound.status === 'drawing' ? 'Drawing...' : currentRound.status === 'paused' ? 'Paused' : `${currentRound.countdown}s`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-900/50">
                <span className="text-slate-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> Active Tickets</span>
                <span className="font-bold text-slate-200">{currentRound.activePlayersCount} tickets</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-900/50">
                <span className="text-slate-400 flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-slate-500" /> Wagered Volume</span>
                <span className="font-bold text-purple-400">{currentRound.totalBetsAmount} TON</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-slate-500" /> Expected RTP Pool</span>
                <span className="font-bold text-emerald-400">{currentRound.totalPrizePool} TON</span>
              </div>
            </div>
          </div>

          {/* Core admin action controls */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-2">Manual Override Controls</h3>
            
            <div className="space-y-2.5">
              
              {/* Start Draw Trigger */}
              {currentRound.status === 'betting' && (
                <button
                  onClick={handleStartDraw}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-slate-100 text-xs py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-100" />
                  <span>Start Draw (Force Betting Close)</span>
                </button>
              )}

              {/* Pause & Resume toggle buttons */}
              {currentRound.status === 'betting' && (
                <button
                  onClick={handlePauseDraw}
                  disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Timer Countdown</span>
                </button>
              )}

              {currentRound.status === 'paused' && (
                <button
                  onClick={handleResumeDraw}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-100 text-xs py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition cursor-pointer animate-pulse"
                >
                  <Play className="w-4 h-4 fill-slate-100" />
                  <span>Resume Timer Countdown</span>
                </button>
              )}

              {/* Force complete draw */}
              {(currentRound.status === 'drawing' || currentRound.status === 'betting') && (
                <button
                  onClick={handleEndDraw}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-100 text-xs py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg"
                >
                  <Zap className="w-4 h-4 fill-slate-100 text-amber-200" />
                  <span>End Draw (Force Draw Sequence)</span>
                </button>
              )}

              {/* Cancel round / refund active stakes */}
              {currentRound.status !== 'completed' && currentRound.status !== 'cancelled' && (
                <button
                  onClick={handleCancelRound}
                  disabled={isLoading}
                  className="w-full bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/50 text-rose-400 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Cancel Round (Refund Stakes)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
