import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Search, Download, Eye, X, Filter, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { KenoTicket } from '../types';

interface TicketManagementProps {
  tickets: KenoTicket[];
  isLoading: boolean;
}

export const TicketManagement: React.FC<TicketManagementProps> = ({ tickets, isLoading }) => {
  const { addToast } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roundFilter, setRoundFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<KenoTicket | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.telegramId.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesRound = !roundFilter || t.roundNumber.toString() === roundFilter;

    return matchesSearch && matchesStatus && matchesRound;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Telegram ID', 'Username', 'Selected Numbers', 'Bet (TON)', 'Matches', 'Prize (TON)', 'Status', 'Created Time', 'Round Number'];
    const rows = filteredTickets.map(t => [
      t.ticketId,
      t.telegramId,
      t.username,
      `"${t.selectedNumbers.join(',')}"`,
      t.betAmount,
      t.matches,
      t.prize,
      t.status,
      t.createdTime,
      t.roundNumber
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `keno_tickets_round_${roundFilter || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Export', `Exported ${filteredTickets.length} tickets successfully`, 'success');
  };

  const handleOpenInspector = (ticket: KenoTicket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div id="ticket-management-module" className="space-y-6 select-none animate-in fade-in duration-300">
      
      {/* Header section with export button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Ticket Log Manager</h2>
          <p className="text-xs text-slate-400">Review all active and historical player lottery stakes, inspect selection counts, and audit payouts.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Advanced Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Ticket ID or TG user..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Options filters */}
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          <input
            type="number"
            placeholder="Round Number (e.g. 10244)"
            value={roundFilter}
            onChange={(e) => { setRoundFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 w-44 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Tickets Logs Table */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-900/60 pb-3">
                <th className="pb-3 font-medium">Ticket ID</th>
                <th className="pb-3 font-medium">Round</th>
                <th className="pb-3 font-medium">Player</th>
                <th className="pb-3 font-medium">Selections</th>
                <th className="pb-3 font-medium">Wager Size</th>
                <th className="pb-3 font-medium">Matches</th>
                <th className="pb-3 font-medium">Payout</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40">
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.ticketId} className="hover:bg-slate-900/10 transition-all">
                  <td className="py-3 text-slate-300 font-bold">{ticket.ticketId}</td>
                  <td className="py-3 text-slate-400">#{ticket.roundNumber}</td>
                  <td className="py-3 text-slate-200 font-sans font-semibold">@{ticket.username}</td>
                  <td className="py-3">
                    <span className="text-[10px] text-purple-400 font-bold bg-purple-950/20 border border-purple-900/30 px-2 py-0.5 rounded-md">
                      {ticket.selectedNumbers.length} picks
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 font-bold">{ticket.betAmount} TON</td>
                  <td className="py-3 text-slate-400 font-bold">{ticket.matches}/{ticket.selectedNumbers.length}</td>
                  <td className="py-3 font-extrabold text-slate-200">
                    {ticket.status === 'won' ? (
                      <span className="text-emerald-400">+{ticket.prize} TON</span>
                    ) : (
                      <span className="text-slate-500">0.00 TON</span>
                    )}
                  </td>
                  <td className="py-3">
                    {ticket.status === 'won' && (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-0.5 rounded-full font-sans">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Won</span>
                      </span>
                    )}
                    {ticket.status === 'lost' && (
                      <span className="inline-flex items-center space-x-1 text-slate-400 text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full font-sans">
                        <AlertCircle className="w-3 h-3 text-slate-500" />
                        <span>Lost</span>
                      </span>
                    )}
                    {ticket.status === 'pending' && (
                      <span className="inline-flex items-center space-x-1 text-amber-400 text-[10px] bg-amber-950/20 border border-amber-900/30 px-2.5 py-0.5 rounded-full font-sans animate-pulse">
                        <HelpCircle className="w-3 h-3 text-amber-500" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleOpenInspector(ticket)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-purple-400 border border-slate-800 transition-all cursor-pointer"
                      title="Inspect Ticket Matrix"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No tickets found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400">
            <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Inspector Modal (glowing grid preview) */}
      {selectedTicket && (
        <div id="ticket-inspector-backdrop" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div id="ticket-inspector-modal" className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold font-mono tracking-wider text-purple-400 uppercase mb-1">Ticket Inspector</h3>
            <p className="text-[11px] text-slate-400 font-mono mb-4">Inspection for ticket: {selectedTicket.ticketId}</p>

            {/* Ticket details summary panel */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-900 space-y-2.5 text-xs font-mono mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Player Profile:</span>
                <span className="font-bold text-slate-300">@{selectedTicket.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Round context:</span>
                <span className="font-bold text-slate-300">#{selectedTicket.roundNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stake amount:</span>
                <span className="font-bold text-purple-400">{selectedTicket.betAmount} TON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matched outcomes:</span>
                <span className="font-bold text-amber-400">{selectedTicket.matches} Hits</span>
              </div>
              {selectedTicket.status === 'won' && (
                <div className="flex justify-between border-t border-slate-900 pt-2 text-emerald-400">
                  <span>Winnings awarded:</span>
                  <span className="font-black">+{selectedTicket.prize} TON</span>
                </div>
              )}
            </div>

            {/* Micro 1-80 preview matrix */}
            <h4 className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-2 text-center">Numbers Selected Map</h4>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
                const isSelected = selectedTicket.selectedNumbers.includes(num);
                return (
                  <div
                    key={num}
                    className={`aspect-square rounded-md flex items-center justify-center font-mono text-[9px] font-extrabold border ${
                      isSelected 
                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 border-purple-400 text-slate-100 shadow-[0_0_8px_#8b5cf6]'
                        : 'bg-slate-900/20 border-slate-950 text-slate-700'
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full mt-6 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
