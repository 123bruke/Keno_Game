import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/useStore';
import { 
  Settings, Shield, Lock, Terminal, Save, RotateCcw, 
  Search, ShieldAlert, ShieldCheck, Database, Bot, RefreshCw, Key
} from 'lucide-react';
import { apiService } from '../services/api';
import { AdminUser, SecuritySession, SystemLog, SystemSettings } from '../types';

interface SettingsAndSecurityProps {
  initialSystemSettings: SystemSettings;
  onSaveSystemSettings: (settings: SystemSettings) => Promise<void>;
  isSaving: boolean;
}

export const SettingsAndSecurity: React.FC<SettingsAndSecurityProps> = ({
  initialSystemSettings, onSaveSystemSettings, isSaving
}) => {
  const { addToast } = useAdminStore();
  const [subTab, setSubTab] = useState<'system' | 'users' | 'security' | 'logs'>('system');

  // Tab 1: System Settings state
  const [sysSettings, setSysSettings] = useState<SystemSettings>({ ...initialSystemSettings });

  // Tab 2: Admin Users state
  const [adminsList, setAdminsList] = useState<AdminUser[]>([]);
  const [adminSearch, setAdminSearch] = useState('');

  // Tab 3: Security states
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [mfa, setMfa] = useState(true);

  // Tab 4: Logs states
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logSource, setLogSource] = useState('all');
  const [logLevel, setLogLevel] = useState('all');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Fetch subtab dynamic data on mount / subtab switch
  useEffect(() => {
    if (subTab === 'users') {
      apiService.getUsers().then(res => setAdminsList(res.admins)).catch(() => {});
    } else if (subTab === 'security') {
      apiService.getSecurity().then(res => {
        setSessions(res.sessions);
        setMfa(res.mfaEnabled);
      }).catch(() => {});
    } else if (subTab === 'logs') {
      fetchLogs();
    }
  }, [subTab]);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const data = await apiService.getLogs({ source: logSource, level: logLevel, search: logSearch });
      setLogs(data);
    } catch (err) {
      // quiet fallback
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Trigger search on logs change
  useEffect(() => {
    if (subTab === 'logs') {
      fetchLogs();
    }
  }, [logSource, logLevel, logSearch]);

  const handleSaveSysSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveSystemSettings(sysSettings);
      addToast('Integrations Saved', 'System connection settings updated successfully.', 'success');
    } catch (err) {
      addToast('Error', 'Failed to save system settings.', 'error');
    }
  };

  const handleAdminStatusToggle = (adminId: string, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setAdminsList(prev => prev.map(a => a.id === adminId ? { ...a, status: nextStatus } : a));
    addToast('Admin Role Modified', `Updated administrative status to: ${nextStatus.toUpperCase()}`, 'warning');
  };

  // Filter admins
  const filteredAdmins = adminsList.filter(a => 
    a.username.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div id="settings-security-unified" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans font-sans">System & Security Management</h2>
        <p className="text-xs text-slate-400">Configure bot integrations, manage credential boundaries, view server logs, and audit sessions.</p>
      </div>

      {/* Internal Nav Header */}
      <div className="flex border-b border-slate-900 pb-px space-x-6 text-xs font-mono">
        <button
          onClick={() => setSubTab('system')}
          className={`pb-3 font-semibold transition cursor-pointer flex items-center gap-1.5 ${subTab === 'system' ? 'text-purple-400 border-b-2 border-purple-500 font-extrabold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </button>
        <button
          onClick={() => setSubTab('users')}
          className={`pb-3 font-semibold transition cursor-pointer flex items-center gap-1.5 ${subTab === 'users' ? 'text-purple-400 border-b-2 border-purple-500 font-extrabold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin User Roles</span>
        </button>
        <button
          onClick={() => setSubTab('security')}
          className={`pb-3 font-semibold transition cursor-pointer flex items-center gap-1.5 ${subTab === 'security' ? 'text-purple-400 border-b-2 border-purple-500 font-extrabold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Lock className="w-4 h-4" />
          <span>Security Audit</span>
        </button>
        <button
          onClick={() => setSubTab('logs')}
          className={`pb-3 font-semibold transition cursor-pointer flex items-center gap-1.5 ${subTab === 'logs' ? 'text-purple-400 border-b-2 border-purple-500 font-extrabold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Console Logs</span>
        </button>
      </div>

      {/* Subtab Contents */}
      <div className="mt-4">
        
        {/* Sub-tab 1: System settings form */}
        {subTab === 'system' && (
          <form onSubmit={handleSaveSysSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 space-y-6">
              
              {/* General app setting */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Bot and Telegram Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Telegram Bot Token</label>
                    <input
                      type="password"
                      value={sysSettings.telegramBotToken}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Telegram Bot Username</label>
                    <input
                      type="text"
                      value={sysSettings.telegramBotUsername}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, telegramBotUsername: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Infrastructure variables */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                  <Database className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Database & Connection Pools</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">PostgreSQL DB Cluster String</label>
                    <input
                      type="text"
                      value={sysSettings.postgresHost}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, postgresHost: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Active PostgreSQL Schema Database</label>
                    <input
                      type="text"
                      value={sysSettings.postgresDb}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, postgresDb: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Redis Host string</label>
                    <input
                      type="text"
                      value={sysSettings.redisHost}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, redisHost: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Redis port connection</label>
                    <input
                      type="number"
                      value={sysSettings.redisPort}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, redisPort: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* General Side toggles (Right panel) */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4 text-xs font-mono">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-2">Platform status</h3>
                
                <div className="space-y-4">
                  {/* Maintenance mode toggle */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <span className="text-slate-300 font-bold block">Maintenance Mode</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block">Halt all live betting and draws.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSysSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${sysSettings.maintenanceMode ? 'bg-amber-600 text-slate-100' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                    >
                      {sysSettings.maintenanceMode ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-900/60 pt-3">
                    <div>
                      <span className="text-slate-300 font-bold block">App Name branding</span>
                      <input
                        type="text"
                        value={sysSettings.appName}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, appName: e.target.value }))}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 mt-1 block"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-slate-900/60 pt-3">
                    <div>
                      <span className="text-slate-500 text-[10px] block">App Currency</span>
                      <select
                        value={sysSettings.currency}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, currency: e.target.value }))}
                        className="bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-200 mt-1 w-full"
                      >
                        <option value="TON">TON (Toncoin)</option>
                        <option value="USDT">USDT (Tether)</option>
                        <option value="BTC">BTC (Bitcoin)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Timezone Clock</span>
                      <input
                        type="text"
                        value={sysSettings.timeZone}
                        disabled
                        className="bg-slate-900 border border-slate-950 rounded p-1 text-[11px] text-slate-500 mt-1 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-slate-100 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-lg cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving parameters...' : 'Commit System Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Sub-tab 2: User management (Admin list) */}
        {subTab === 'users' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search administrative usernames..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-900 pb-3">
                    <th className="pb-3 font-medium">Username</th>
                    <th className="pb-3 font-medium">Email Reference</th>
                    <th className="pb-3 font-medium">Role Assignment</th>
                    <th className="pb-3 font-medium">Active Status</th>
                    <th className="pb-3 text-right font-medium">Modify Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-900/10">
                      <td className="py-3 font-sans font-semibold text-slate-200">@{admin.username}</td>
                      <td className="py-3 text-slate-400">{admin.email}</td>
                      <td className="py-3 text-purple-400 font-bold">{admin.role}</td>
                      <td className="py-3">
                        {admin.status === 'active' ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded-full">Active</span>
                        ) : (
                          <span className="text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/40 px-2 py-0.5 rounded-full">Suspended</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleAdminStatusToggle(admin.id, admin.status)}
                          className="px-2.5 py-1 text-[10px] font-semibold rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-purple-400 transition cursor-pointer"
                        >
                          Toggle lock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sub-tab 3: Security Telemetry (Active Login sessions) */}
        {subTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Session Logs (Left Column) */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider border-b border-slate-950 pb-2">Active Admin Login History</h3>
              
              <div className="space-y-3 font-mono text-xs">
                {sessions.map((sess) => (
                  <div key={sess.id} className="p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-200 font-sans block">User: @{sess.username}</span>
                      <span className="text-[10px] text-slate-500 block">Location: {sess.location} ({sess.ipAddress})</span>
                      <span className="text-[9px] text-slate-500 block">Device: {sess.device}</span>
                    </div>

                    <div className="text-right space-y-1">
                      {sess.status === 'success' ? (
                        <span className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded-full font-sans font-semibold">Success</span>
                      ) : (
                        <span className="text-[9px] text-rose-400 bg-rose-950/20 border border-rose-900/40 px-2 py-0.5 rounded-full font-sans font-semibold">Failed Attempt</span>
                      )}
                      <span className="text-[9px] text-slate-500 block mt-1">{new Date(sess.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Config panels (Right Column) */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg space-y-4 text-xs font-mono">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-2">Security parameters</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">Two-Factor Auth (MFA)</span>
                      <span className="text-[9px] text-slate-500 block">Forces 2FA on admins.</span>
                    </div>
                    <button
                      onClick={() => { setMfa(!mfa); addToast('Security Update', 'MFA settings modified', 'info'); }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${mfa ? 'bg-emerald-600 text-slate-100' : 'bg-slate-900 text-slate-500'}`}
                    >
                      {mfa ? 'ENFORCED' : 'OPTIONAL'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                    <div>
                      <span className="font-bold text-slate-200 block">Session Expiration</span>
                      <span className="text-[9px] text-slate-500 block">Auto-timeout hours.</span>
                    </div>
                    <span className="font-bold text-purple-400">12 hours</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                    <div>
                      <span className="font-bold text-slate-200 block">Failed Attempts Threshold</span>
                      <span className="text-[9px] text-slate-500 block">Forces IP lock.</span>
                    </div>
                    <span className="font-bold text-rose-400">5 attempts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 4: Real-time System Console Logs */}
        {subTab === 'logs' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search/filters and trigger */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search logs message body..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-4 items-center w-full sm:w-auto justify-end text-xs font-mono">
                <select
                  value={logSource}
                  onChange={(e) => setLogSource(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 cursor-pointer"
                >
                  <option value="all">All Sources</option>
                  <option value="game_engine">Game Engine</option>
                  <option value="wallet_service">Wallet Service</option>
                  <option value="admin_action">Admin Action</option>
                  <option value="system">System core</option>
                </select>

                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="info">Info</option>
                  <option value="warn">Warn</option>
                  <option value="error">Error</option>
                </select>

                <button
                  onClick={fetchLogs}
                  disabled={isLoadingLogs}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-purple-400 border border-slate-800 transition"
                  title="Manual Refresh Console"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Terminal console */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 text-xs font-mono space-y-2 h-[400px] overflow-y-auto scrollbar-thin shadow-inner border-t-4 border-t-purple-900/60 flex flex-col-reverse">
              <div className="space-y-2 pb-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2.5 pb-1 border-b border-slate-900/10 leading-relaxed text-[11px] animate-in slide-in-from-bottom-2 duration-150">
                    <span className="text-slate-500 font-normal shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    
                    <span className={`font-bold shrink-0 uppercase text-[9px] px-1.5 py-px rounded-md border ${
                      log.level === 'info' ? 'text-blue-400 bg-blue-950/10 border-blue-900/20' :
                      log.level === 'warn' ? 'text-amber-400 bg-amber-950/10 border-amber-900/20' :
                      'text-rose-400 bg-rose-950/10 border-rose-900/20'
                    }`}>
                      {log.level}
                    </span>

                    <span className="text-purple-400 font-bold shrink-0 font-sans">({log.source}):</span>
                    
                    <span className="text-slate-300 flex-1">{log.message}</span>
                  </div>
                ))}

                {logs.length === 0 && (
                  <p className="text-center text-slate-500 py-12">No terminal entries logged in current filters.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
