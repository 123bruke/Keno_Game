import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Plus, Edit2, Trash2, Check, X, ToggleLeft, ToggleRight, Download, Upload, Percent } from 'lucide-react';
import { PayoutRule } from '../types';

interface PayoutManagementProps {
  payoutRules: PayoutRule[];
  onCreate: (rule: Omit<PayoutRule, 'id'>) => Promise<void>;
  onUpdate: (id: string, rule: Partial<PayoutRule>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const PayoutManagement: React.FC<PayoutManagementProps> = ({ 
  payoutRules, onCreate, onUpdate, onDelete, isLoading 
}) => {
  const { addToast } = useAdminStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add rule form state
  const [newSelected, setNewSelected] = useState('10');
  const [newMatched, setNewMatched] = useState('5');
  const [newMultiplier, setNewMultiplier] = useState('5');

  // Edit row form state
  const [editMultiplier, setEditMultiplier] = useState('');

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const sel = parseInt(newSelected);
    const match = parseInt(newMatched);
    const mult = parseFloat(newMultiplier);

    if (isNaN(sel) || isNaN(match) || isNaN(mult)) {
      addToast('Validation', 'Please provide valid numbers.', 'error');
      return;
    }
    if (match > sel) {
      addToast('Validation', 'Matched balls cannot exceed selected balls count.', 'error');
      return;
    }

    try {
      await onCreate({
        selected: sel,
        matched: match,
        multiplier: mult,
        status: 'enabled'
      });
      setIsAdding(false);
      addToast('Rule Added', `Created rule for matches: ${match}/${sel} -> x${mult}`, 'success');
    } catch (err) {
      addToast('Error', 'Failed to create payout rule.', 'error');
    }
  };

  const handleStartEdit = (rule: PayoutRule) => {
    setEditingId(rule.id);
    setEditMultiplier(rule.multiplier.toString());
  };

  const handleSaveEdit = async (rule: PayoutRule) => {
    const mult = parseFloat(editMultiplier);
    if (isNaN(mult) || mult < 0) {
      addToast('Validation', 'Please provide a valid multiplier.', 'error');
      return;
    }

    try {
      await onUpdate(rule.id, { multiplier: mult });
      setEditingId(null);
      addToast('Rule Updated', `Updated Match ${rule.matched}/${rule.selected} multiplier to x${mult}`, 'success');
    } catch (err) {
      addToast('Error', 'Failed to update rule.', 'error');
    }
  };

  const handleToggleStatus = async (rule: PayoutRule) => {
    const nextStatus = rule.status === 'enabled' ? 'disabled' : 'enabled';
    try {
      await onUpdate(rule.id, { status: nextStatus });
      addToast('Rule Status', `Rule is now ${nextStatus}`, 'info');
    } catch (err) {
      addToast('Error', 'Failed to toggle status.', 'error');
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this multiplier rule?')) return;
    try {
      await onDelete(id);
      addToast('Rule Deleted', 'Multiplier row removed successfully.', 'warning');
    } catch (err) {
      addToast('Error', 'Failed to delete rule.', 'error');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payoutRules, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "keno_payout_table.json");
    dlAnchor.click();
    addToast('Payout Matrix', 'Multiplier configurations exported successfully', 'success');
  };

  const handleImportMock = () => {
    addToast('Payout Matrix', 'Import trigger ready. Select configuration file... (Demo)', 'info');
  };

  // Group rules by selected count for structured layout view
  const groupedSelections = (Array.from(new Set(payoutRules.map(r => r.selected))) as number[]).sort((a,b)=> b - a);

  return (
    <div id="payout-management-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Payout Multipliers</h2>
          <p className="text-xs text-slate-400">Configure match multiplier metrics that govern all player winnings.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button
            onClick={handleImportMock}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 cursor-pointer transition-all"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-slate-100 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Rule</span>
          </button>
        </div>
      </div>

      {/* Inline Adding form container */}
      {isAdding && (
        <form onSubmit={handleCreateRule} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 items-end animate-in slide-in-from-top-3 duration-200">
          <div>
            <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Numbers Selected</label>
            <input
              type="number"
              value={newSelected}
              onChange={(e) => setNewSelected(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Numbers Matched</label>
            <input
              type="number"
              value={newMatched}
              onChange={(e) => setNewMatched(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Multiplier Factor (e.g. 150)</label>
            <input
              type="number"
              step="0.1"
              value={newMultiplier}
              onChange={(e) => setNewMultiplier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-slate-100 text-xs py-2 rounded-xl font-semibold cursor-pointer transition-all"
            >
              Save Rule
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs py-2 rounded-xl cursor-pointer transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Multipliers List organized by selection count groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupedSelections.map((selCount) => {
          const rules = payoutRules.filter(r => r.selected === selCount).sort((a,b)=> b.matched - a.matched);
          return (
            <div key={selCount} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-3 mb-4">
                <Percent className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                  Game Cards: Selecting <span className="text-purple-400 font-extrabold">{selCount} Numbers</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-900/60 pb-2">
                      <th className="pb-2 font-medium">Matches</th>
                      <th className="pb-2 font-medium">Multiplier</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40">
                    {rules.map((rule) => {
                      const isEditing = editingId === rule.id;
                      return (
                        <tr key={rule.id} className="hover:bg-slate-900/10 transition-all">
                          <td className="py-2.5">
                            <span className="px-2.5 py-0.5 bg-slate-900 text-purple-400 rounded-md font-bold text-[11px] border border-slate-800">
                              {rule.matched} Match{rule.matched !== 1 && 'es'}
                            </span>
                          </td>
                          <td className="py-2.5">
                            {isEditing ? (
                              <div className="flex items-center space-x-1 max-w-[100px]">
                                <span className="text-slate-500">x</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={editMultiplier}
                                  onChange={(e) => setEditMultiplier(e.target.value)}
                                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-slate-200 w-full focus:outline-none"
                                />
                              </div>
                            ) : (
                              <span className="font-bold text-amber-400">x{rule.multiplier}</span>
                            )}
                          </td>
                          <td className="py-2.5">
                            <button
                              onClick={() => handleToggleStatus(rule)}
                              className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
                              title="Toggle Active Status"
                            >
                              {rule.status === 'enabled' ? (
                                <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded-full font-sans">
                                  <span>Enabled</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 text-rose-400 text-[10px] bg-rose-950/20 border border-rose-900/40 px-2 py-0.5 rounded-full font-sans">
                                  <span>Disabled</span>
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="py-2.5 text-right space-x-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(rule)}
                                  className="p-1 rounded bg-purple-900/40 text-purple-200 hover:bg-purple-950 transition cursor-pointer"
                                  title="Save Changes"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 transition cursor-pointer"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(rule)}
                                  className="p-1 rounded hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                                  title="Edit Multiplier"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRule(rule.id)}
                                  className="p-1 rounded hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                                  title="Delete Multiplier"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
