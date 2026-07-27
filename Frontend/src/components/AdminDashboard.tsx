import { useState } from "react";
import {
  useAdminAnalytics,
  useAdminSettings,
  useAdminReports,
  useAdminUsers,
  useUpdateAdminSettings,
  useUpdateUserStatus,
  useUpdateUserRole,
} from "../lib/hooks";
import { useAppStore } from "../lib/store";
import {
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  BarChart2,
  Shield,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  Award,
  UserCog,
  KeyRound,
  LayoutDashboard,
  Gamepad2,
  LogOut,
} from "lucide-react";

export default function AdminDashboard({ onSwitchToPlayer }: { onSwitchToPlayer?: () => void }) {
  const [adminTab, setAdminTab] = useState<"analytics" | "settings" | "users" | "reports">("analytics");
  const { currentUser, setShowDevLogin } = useAppStore();

  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useAdminAnalytics();
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = useAdminSettings();
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = useAdminReports();

  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useAdminUsers(userPage, 12, userSearch);

  const updateSettings = useUpdateAdminSettings();
  const updateUserStatus = useUpdateUserStatus();
  const updateUserRole = useUpdateUserRole();

  // Settings form state
  const [minBet, setMinBet] = useState<number | undefined>(undefined);
  const [maxBet, setMaxBet] = useState<number | undefined>(undefined);
  const [rtp, setRtp] = useState<number | undefined>(undefined);
  const [houseEdge, setHouseEdge] = useState<number | undefined>(undefined);
  const [drawInterval, setDrawInterval] = useState<number | undefined>(undefined);
  const [statusMsg, setStatusMsg] = useState("");

  const handleUpdateSettings = () => {
    updateSettings.mutate(
      {
        ...(minBet !== undefined && { minBet }),
        ...(maxBet !== undefined && { maxBet }),
        ...(rtp !== undefined && { rtpPercentage: rtp }),
        ...(houseEdge !== undefined && { houseEdge }),
        ...(drawInterval !== undefined && { drawIntervalSec: drawInterval }),
      },
      {
        onSuccess: () => {
          setStatusMsg("Settings saved successfully!");
          setTimeout(() => setStatusMsg(""), 3000);
        },
      }
    );
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    updateUserStatus.mutate({ userId, status: newStatus });
  };

  const handleToggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    updateUserRole.mutate({ userId, role: newRole });
  };

  const refreshAll = () => {
    refetchAnalytics();
    refetchSettings();
    refetchReports();
    refetchUsers();
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-100 flex flex-col font-sans selection:bg-[#C084FC] selection:text-black">
      {/* Full-Screen Admin Header */}
      <header className="w-full bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C084FC] to-[#22D3EE] flex items-center justify-center font-black text-black text-lg shadow-lg shadow-[#C084FC]/30">
            K
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-white bg-clip-text text-transparent">
              KENO CASINO ADMIN PORTAL
            </h1>
            <p className="text-xs text-slate-400 font-medium">Production Management & Analytics Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#12121c] px-3 py-1.5 rounded-full border border-white/10 text-xs">
            <span className="text-slate-300 font-semibold">@{currentUser?.username || "Admin"}</span>
            <span className="text-[#22D3EE] font-bold">[ADMIN]</span>
          </div>

          <button
            onClick={() => setShowDevLogin(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C084FC] bg-[#12121c] px-3 py-1.5 rounded-full border border-[#C084FC]/30 hover:bg-[#C084FC]/20 transition-all"
          >
            <KeyRound size={14} />
            Dev Auth
          </button>

          {onSwitchToPlayer && (
            <button
              onClick={onSwitchToPlayer}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all"
            >
              <Gamepad2 size={14} className="text-[#22D3EE]" />
              Player View
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex bg-[#09090b] p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          {[
            { id: "analytics", label: "Financial Analytics", icon: TrendingUp },
            { id: "settings", label: "Game Settings & Limits", icon: Settings },
            { id: "users", label: "User Management & Roles", icon: Users },
            { id: "reports", label: "Reports & Statistics", icon: BarChart2 },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = adminTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setAdminTab(t.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-[#C084FC] to-[#22D3EE] text-black shadow-lg shadow-[#C084FC]/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 1. FINANCIAL ANALYTICS */}
        {adminTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Gross Revenue</span>
                  <DollarSign size={18} className="text-[#C084FC]" />
                </div>
                <div className="text-2xl font-black text-white">
                  {Number(analytics?.revenue || 0).toFixed(2)} <span className="text-xs text-slate-400 font-normal">ETB</span>
                </div>
                <div className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1">
                  Profit: +{Number(analytics?.profit || 0).toFixed(2)} ETB
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Actual RTP %</span>
                  <TrendingUp size={18} className="text-[#22D3EE]" />
                </div>
                <div className="text-2xl font-black text-[#22D3EE]">
                  {Number(analytics?.actualRtpPercentage || 95)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  House Margin: {(100 - Number(analytics?.actualRtpPercentage || 95)).toFixed(1)}%
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Total Wagers Placed</span>
                  <BarChart2 size={18} className="text-white" />
                </div>
                <div className="text-2xl font-black text-white">
                  {Number(analytics?.totalBets || 0).toFixed(0)} <span className="text-xs text-slate-400 font-normal">ETB</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">Across all tickets</div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Total Tickets Issued</span>
                  <Users size={18} className="text-[#C084FC]" />
                </div>
                <div className="text-2xl font-black text-[#C084FC]">
                  {analytics?.totalTicketsCount ?? 0}
                </div>
                <div className="text-xs text-emerald-400 mt-2 font-semibold">
                  Payouts: {Number(analytics?.totalPayouts || 0).toFixed(0)} ETB
                </div>
              </div>
            </div>

            {/* Largest Win Record */}
            {analytics?.largestWin && (
              <div className="glass-card rounded-3xl p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                  <span className="text-emerald-400 font-extrabold flex items-center gap-2 text-base">
                    <Award size={20} /> All-Time Largest Jackpot Record
                  </span>
                  <span>{new Date(analytics.largestWin.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-slate-100">User @{analytics.largestWin.username}</span>
                  <span className="text-emerald-400 font-mono text-2xl font-black">+{Number(analytics.largestWin.payout || 0).toFixed(2)} ETB</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Wagered {analytics.largestWin.betAmount} ETB @ {analytics.largestWin.multiplier}x Multiplier ({analytics.largestWin.matches} matches hit)
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. GAME SETTINGS & LIMITS */}
        {adminTab === "settings" && (
          <div className="glass-card rounded-3xl p-6 space-y-6 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Settings className="text-[#C084FC]" size={24} />
                <div>
                  <h3 className="text-base font-extrabold text-white">Game Settings & Financial Configuration</h3>
                  <p className="text-xs text-slate-400">Updates live system configurations in PostgreSQL database & Redis cache</p>
                </div>
              </div>
              <button onClick={refreshAll} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400">
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">Min Bet (ETB)</label>
                <input
                  type="number"
                  placeholder={String(settings?.minBet || 1)}
                  value={minBet ?? ""}
                  onChange={(e) => setMinBet(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-white/10 text-white font-mono text-sm focus:border-[#C084FC]"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">Max Bet (ETB)</label>
                <input
                  type="number"
                  placeholder={String(settings?.maxBet || 10000)}
                  value={maxBet ?? ""}
                  onChange={(e) => setMaxBet(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-white/10 text-white font-mono text-sm focus:border-[#C084FC]"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">Target RTP (%)</label>
                <input
                  type="number"
                  placeholder={String(settings?.rtpPercentage || 95)}
                  value={rtp ?? ""}
                  onChange={(e) => setRtp(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-white/10 text-white font-mono text-sm focus:border-[#22D3EE]"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">House Edge (%)</label>
                <input
                  type="number"
                  placeholder={String(settings?.houseEdge || 5)}
                  value={houseEdge ?? ""}
                  onChange={(e) => setHouseEdge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-white/10 text-white font-mono text-sm focus:border-[#22D3EE]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1.5 font-bold">Classic Round Interval (Seconds)</label>
                <input
                  type="number"
                  placeholder={String(settings?.drawIntervalSec || 30)}
                  value={drawInterval ?? ""}
                  onChange={(e) => setDrawInterval(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-white/10 text-white font-mono text-sm focus:border-[#C084FC]"
                />
              </div>
            </div>

            {statusMsg && (
              <div className="text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-xl text-center flex items-center justify-center gap-2 font-bold">
                <CheckCircle2 size={16} />
                {statusMsg}
              </div>
            )}

            <button
              onClick={handleUpdateSettings}
              disabled={updateSettings.isPending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C084FC] via-[#22D3EE] to-[#C084FC] text-black font-black text-sm shadow-xl shadow-[#C084FC]/25 transition-all hover:scale-[1.005] active:scale-[0.995] disabled:opacity-50"
            >
              {updateSettings.isPending ? "Saving Settings to Database & Redis..." : "Save Admin Settings"}
            </button>
          </div>
        )}

        {/* 3. USER MANAGEMENT & ROLE CHANGE */}
        {adminTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search user by username..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs focus:border-[#C084FC]"
                />
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Total Users: <strong className="text-white">{usersData?.total ?? 0}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {usersData?.items?.map((u: any) => {
                const isSuspended = u.status === "SUSPENDED";
                const isAdmin = u.role === "ADMIN";
                const totalBal = Number(u.wallet?.playBalance || 0) + Number(u.wallet?.mainBalance || 0);

                return (
                  <div
                    key={u.id}
                    className="glass-card rounded-2xl p-4 space-y-3 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-white">@{u.username || "Anonymous"}</span>
                        <div className="flex gap-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                              isAdmin ? "bg-[#22D3EE]/20 text-[#22D3EE]" : "bg-white/10 text-slate-400"
                            }`}
                          >
                            {u.role}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                              isSuspended ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 font-mono space-y-0.5">
                        <div>Telegram ID: {u.telegramId?.toString()}</div>
                        <div>
                          Wallet Balance: <strong className="text-emerald-400">{totalBal.toFixed(2)} ETB</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        disabled={updateUserRole.isPending}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isAdmin
                            ? "bg-[#22D3EE]/20 text-[#22D3EE] hover:bg-[#22D3EE]/30"
                            : "bg-[#C084FC]/20 text-[#C084FC] hover:bg-[#C084FC]/30"
                        }`}
                      >
                        <UserCog size={14} />
                        {isAdmin ? "Demote to USER" : "Promote to ADMIN"}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        disabled={updateUserStatus.isPending}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          isSuspended
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                        }`}
                        title={isSuspended ? "Activate Account" : "Suspend Account"}
                      >
                        {isSuspended ? <UserCheck size={16} /> : <UserX size={16} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {usersData?.items?.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">No registered users found matching search.</div>
            )}
          </div>
        )}

        {/* 4. REPORTS & STATS */}
        {adminTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="text-slate-400 text-xs font-medium">Daily Games Count</div>
                <div className="font-black text-white text-2xl mt-1">{reports?.dailyGames ?? 0}</div>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="text-slate-400 text-xs font-medium">Active Players Today</div>
                <div className="font-black text-[#22D3EE] text-2xl mt-1">{reports?.activeUsersToday ?? 0}</div>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="text-slate-400 text-xs font-medium">Average Bet Size</div>
                <div className="font-black text-[#C084FC] text-2xl mt-1">
                  {Number(reports?.averageBetAmount || 0).toFixed(2)} ETB
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/10">
              <h4 className="text-sm font-extrabold text-slate-200">Most Popular Picked Numbers (Frequency Analysis 1-80)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                {reports?.popularNumbers?.map((p: any) => (
                  <div key={p.number} className="flex justify-between items-center bg-[#000000] p-3 rounded-xl border border-white/10">
                    <span className="font-extrabold text-[#22D3EE] text-sm">#{p.number}</span>
                    <span className="text-slate-400 font-mono">{p.count} picks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
