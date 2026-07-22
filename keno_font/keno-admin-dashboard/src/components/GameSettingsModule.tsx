import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Sliders, Save, RotateCcw, AlertCircle, Info, Coins, Cpu, Target } from 'lucide-react';
import { GameSettings } from '../types';

interface GameSettingsModuleProps {
  initialSettings: GameSettings;
  onSave: (settings: GameSettings) => Promise<void>;
  isSaving: boolean;
}

export const GameSettingsModule: React.FC<GameSettingsModuleProps> = ({ initialSettings, onSave, isSaving }) => {
  const { addToast } = useAdminStore();
  const [settings, setSettings] = useState<GameSettings>({ ...initialSettings });

  const handleInputChange = (field: keyof GameSettings, value: string | number | 'auto' | 'manual') => {
    setSettings(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'gameMode' ? parseFloat(value) || 0 : value
    }));
  };

  const handleRtpChange = (rtp: number) => {
    // Automatically recalculate house edge
    const houseEdge = parseFloat((100 - rtp).toFixed(2));
    setSettings(prev => ({
      ...prev,
      rtpPercentage: rtp,
      houseEdge: houseEdge
    }));
  };

  const handleHouseEdgeChange = (edge: number) => {
    // Automatically recalculate RTP
    const rtp = parseFloat((100 - edge).toFixed(2));
    setSettings(prev => ({
      ...prev,
      rtpPercentage: rtp,
      houseEdge: edge
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.numberRangeMin >= settings.numberRangeMax) {
      addToast('Validation Error', 'Minimum number range must be strictly less than maximum number range.', 'error');
      return;
    }
    if (settings.minBet > settings.maxBet) {
      addToast('Validation Error', 'Minimum bet limit cannot be higher than maximum bet limit.', 'error');
      return;
    }
    if (settings.maxSelection > (settings.numberRangeMax - settings.numberRangeMin)) {
      addToast('Validation Error', 'Maximum number selection cannot exceed the total pool size.', 'error');
      return;
    }

    try {
      await onSave(settings);
      addToast('Settings Saved', 'Global Keno gameplay configurations committed successfully.', 'success');
    } catch (err) {
      addToast('Save Failed', 'Failed to update game parameters.', 'error');
    }
  };

  const handleReset = () => {
    setSettings({ ...initialSettings });
    addToast('Settings Reset', 'Form parameters reverted to active database parameters.', 'info');
  };

  return (
    <div id="game-settings-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Keno Game Settings</h2>
        <p className="text-xs text-slate-400">Configure core mathematics, lottery draw boundaries, and stake limits.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Mathematical Config Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Draw Parameters & Range</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Number Range Min</label>
                <input
                  type="number"
                  value={settings.numberRangeMin}
                  onChange={(e) => handleInputChange('numberRangeMin', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Number Range Max</label>
                <input
                  type="number"
                  value={settings.numberRangeMax}
                  onChange={(e) => handleInputChange('numberRangeMax', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Maximum Selection Count</label>
                <input
                  type="number"
                  value={settings.maxSelection}
                  onChange={(e) => handleInputChange('maxSelection', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Maximum picks allowed on single ticket.</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Total Drawn Count</label>
                <input
                  type="number"
                  value={settings.drawCount}
                  onChange={(e) => handleInputChange('drawCount', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Standard balls count drawn per round (usually 20).</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Draw Interval (Seconds)</label>
                <input
                  type="number"
                  value={settings.drawIntervalSeconds}
                  onChange={(e) => handleInputChange('drawIntervalSeconds', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Countdown timer duration in seconds for auto betting.</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Ticket Limits Per User</label>
                <input
                  type="number"
                  value={settings.ticketLimits}
                  onChange={(e) => handleInputChange('ticketLimits', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Max simultaneous tickets allowed per round.</span>
              </div>
            </div>
          </div>

          {/* Staking & Betting limits Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
              <Coins className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Stake and Currency Limits</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Minimum Bet Size (TON)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.minBet}
                  onChange={(e) => handleInputChange('minBet', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Maximum Bet Size (TON)</label>
                <input
                  type="number"
                  step="1"
                  value={settings.maxBet}
                  onChange={(e) => handleInputChange('maxBet', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Game Core Mode</label>
                <select
                  value={settings.gameMode}
                  onChange={(e) => handleInputChange('gameMode', e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="auto">Auto-recurring Draw Interval</option>
                  <option value="manual">Manual Triggered Drawing</option>
                </select>
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">In manual mode, drawing only fires upon admin action.</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">Progressive Jackpot Seed (TON)</label>
                <input
                  type="number"
                  value={settings.jackpotAmount}
                  onChange={(e) => handleInputChange('jackpotAmount', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Math Payout Curve / House Advantage Sidepanel */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
              <Target className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Theoretical Mathematics</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">Return To Player (RTP)</span>
                  <span className="font-mono font-bold text-emerald-400">{settings.rtpPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="99"
                  step="0.1"
                  value={settings.rtpPercentage}
                  onChange={(e) => handleRtpChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Expected lifetime payout percentage to players.</span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">House Advantage Edge</span>
                  <span className="font-mono font-bold text-amber-500">{settings.houseEdge}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={settings.houseEdge}
                  onChange={(e) => handleHouseEdgeChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Expected mathematical edge retained by house.</span>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-2">
                <div className="flex items-start space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-300 leading-normal">
                    Adjusting RTP / House edge parameters directly recalculates the mathematical multiplier matrix curves simulated on live tickets generator. Keep RTP between 95% and 98% for optimum community retention.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Actions Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Commit Changes</h3>
            
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-100 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all duration-200"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              <span>{isSaving ? 'Saving Configurations...' : 'Save Settings'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-2 cursor-pointer transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Values</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
