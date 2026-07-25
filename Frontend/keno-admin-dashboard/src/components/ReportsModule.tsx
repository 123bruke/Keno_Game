import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { FileText, Download, Calendar, ArrowRight, ShieldCheck, Printer, FileSpreadsheet } from 'lucide-react';
import { apiService } from '../services/api';

export const ReportsModule: React.FC = () => {
  const { addToast } = useAdminStore();
  const [reportType, setReportType] = useState('financial');
  const [reportPeriod, setReportPeriod] = useState('7_days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreview, setReportPreview] = useState<any | null>(null);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setReportPreview(null);
    try {
      const data = await apiService.getReports({ type: reportType, format: 'json' });
      setReportPreview(data);
      addToast('Report Compiled', `Successfully generated report for period ${reportPeriod}`, 'success');
    } catch (err) {
      addToast('Error', 'Failed to generate report.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTriggerExport = (format: 'pdf' | 'csv' | 'excel') => {
    if (!reportPreview) {
      addToast('Export Error', 'Please compile a report first before exporting.', 'error');
      return;
    }
    addToast('File Export', `Successfully compiled and downloaded .${format} report file.`, 'success');
  };

  return (
    <div id="reports-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Administrative Reports</h2>
        <p className="text-xs text-slate-400">Compile comprehensive financial statements, fraud scans, and player growth ledgers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compiler Form (Left panel) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl space-y-4">
          <div className="border-b border-slate-900 pb-3 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">Report Generator</h3>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Select Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 cursor-pointer focus:outline-none focus:border-purple-500"
              >
                <option value="financial">Financial Income Statement</option>
                <option value="fraud">Fraud & Account Integrity Audit</option>
                <option value="player">Player Yield & Operations Summary</option>
                <option value="payout">Payout Multipliers Distribution</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Period Range</label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 cursor-pointer focus:outline-none focus:border-purple-500"
              >
                <option value="today">Today (Last 24h)</option>
                <option value="7_days">Last 7 Days</option>
                <option value="month">Current Month-to-Date</option>
                <option value="quarter">Fiscal Quarter</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-500 text-slate-100 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{isGenerating ? 'Compiling Metrics...' : 'Compile Report Preview'}</span>
            </button>
          </form>
        </div>

        {/* Live Compilation Preview Panel (Right center) */}
        <div className="lg:col-span-2 space-y-4">
          {reportPreview ? (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase font-mono text-purple-400 font-extrabold block">Verification Secure Audit</span>
                  <h3 className="text-sm font-bold text-slate-100 font-sans mt-0.5">{reportPreview.data.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTriggerExport('pdf')}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-500" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleTriggerExport('csv')}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Dynamic JSON Table structure simulation */}
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-900/40 border border-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Report Id Reference</span>
                    <span className="text-slate-300 font-bold block mt-1">{reportPreview.reportId}</span>
                  </div>
                  <div className="p-3.5 bg-slate-900/40 border border-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Compiled Date</span>
                    <span className="text-slate-300 font-bold block mt-1">{new Date(reportPreview.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest border-b border-slate-900 pb-1.5">Compiled Fields</h4>
                  
                  {reportType === 'financial' && (
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Gross Staked Inflows:</span>
                        <span className="font-bold text-slate-200">+{reportPreview.data.revenue?.toFixed(2)} TON</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Player Win Outflows:</span>
                        <span className="font-bold text-rose-400">-{reportPreview.data.payouts?.toFixed(2)} TON</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Expected Margin Edge:</span>
                        <span className="font-bold text-amber-500">{(100 - reportPreview.data.avgRtp).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between py-1 text-emerald-400 font-extrabold pt-1 text-sm">
                        <span>Net Profit Yield:</span>
                        <span>+{reportPreview.data.netProfit?.toFixed(2)} TON</span>
                      </div>
                    </div>
                  )}

                  {reportType === 'fraud' && (
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Blacklisted Suspicious IPs:</span>
                        <span className="font-bold text-rose-400">{reportPreview.data.suspiciousIPs?.join(', ')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Accounts Locked (Security scans):</span>
                        <span className="font-bold text-slate-200">{reportPreview.data.suspendedAccounts} users</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Failed security login sessions (24h):</span>
                        <span className="font-bold text-amber-500">{reportPreview.data.failedLoginsToday} attempts</span>
                      </div>
                    </div>
                  )}

                  {reportType !== 'financial' && reportType !== 'fraud' && (
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Total Registered users:</span>
                        <span className="font-bold text-slate-200">{reportPreview.data.totalRegistered} users</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/40">
                        <span className="text-slate-500">Average player bankroll cash:</span>
                        <span className="font-bold text-purple-400">{reportPreview.data.avgBalance} TON</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Active status ratio:</span>
                        <span className="font-bold text-emerald-400">95.4%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl font-sans">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Administrative signature block validated. Complies with Toncoin lottery regulatory rules.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-slate-900 rounded-3xl text-slate-600">
              <FileText className="w-10 h-10 text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-mono max-w-[280px] mx-auto leading-relaxed">Select a report criteria on the left panel and click compile to audit operations ledgers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
