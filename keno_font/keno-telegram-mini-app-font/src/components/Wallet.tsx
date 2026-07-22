import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Coins, Check, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { walletService } from '../services/walletService';
import { Modal } from './UI';
import { tgWebApp } from '../utils/telegram';

export function WalletCard() {
  const { wallet, setWallet, showToast, setIsLoading } = useGameStore();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Deposit States
  const [depositAmount, setDepositAmount] = useState<string>('50');
  const depositPresets = ['10', '50', '100', '500', '1000'];

  // Withdraw States
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string>('');

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return;
    }

    try {
      setIsLoading(true);
      tgWebApp.haptic.notification('success');
      const updatedWallet = await walletService.deposit(amount);
      setWallet(updatedWallet);
      setIsDepositOpen(false);
      showToast(`Successfully deposited ${amount} TON!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Deposit failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Enter a valid amount');
      return;
    }
    if (amount > wallet.balance) {
      setWithdrawError('Insufficient balance');
      return;
    }
    if (!withdrawAddress || withdrawAddress.trim().length < 10) {
      setWithdrawError('Enter a valid TON wallet address');
      return;
    }

    setWithdrawError('');
    try {
      setIsLoading(true);
      tgWebApp.haptic.notification('success');
      const updatedWallet = await walletService.withdraw(amount, withdrawAddress);
      setWallet(updatedWallet);
      setIsWithdrawOpen(false);
      showToast(`Withdrew ${amount} TON successfully!`, 'success');
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (err: any) {
      showToast(err.message || 'Withdrawal failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl glass-card p-5 border border-violet-500/10">
        {/* Ambient glow */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20">
              <Wallet className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Account Balance</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-bold font-mono text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-extrabold text-blue-400 tracking-wider font-display">{wallet.currency}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 block">CONNECTED WALLET</span>
            <span className="text-[11px] font-mono text-violet-400 bg-violet-950/20 border border-violet-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
              {wallet.address ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}` : 'No wallet'}
            </span>
          </div>
        </div>

        {/* Buttons Action Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={() => {
              tgWebApp.haptic.impact('light');
              setIsDepositOpen(true);
            }}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 text-sm font-bold text-white shadow-md hover:shadow-violet-600/20 cursor-pointer active:scale-[0.98]"
          >
            <ArrowDownCircle className="w-4 h-4 text-violet-200" />
            <span>Deposit</span>
          </button>

          <button
            onClick={() => {
              tgWebApp.haptic.impact('light');
              setIsWithdrawOpen(true);
            }}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 text-sm font-bold text-gray-300 hover:text-white cursor-pointer active:scale-[0.98]"
          >
            <ArrowUpCircle className="w-4 h-4 text-gray-400" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} title="Fund Casino Balance">
        <form onSubmit={handleDeposit} className="space-y-5">
          <div className="p-4 rounded-xl bg-violet-950/15 border border-violet-500/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-violet-400" />
              <div>
                <span className="text-xs text-gray-400">Current Balance</span>
                <p className="text-base font-bold font-mono text-gray-200">{wallet.balance.toFixed(2)} TON</p>
              </div>
            </div>
            <span className="text-[10px] text-violet-400 uppercase font-bold tracking-wider font-display bg-violet-500/10 px-2 py-1 rounded">MOCK NETWORK</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-display">Deposit Preset Chips</label>
            <div className="grid grid-cols-5 gap-2">
              {depositPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    tgWebApp.haptic.impact('soft');
                    setDepositAmount(preset);
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    depositAmount === preset
                      ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                      : 'bg-gray-900 text-gray-400 border border-gray-800/80 hover:border-violet-500/20'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-display">Custom Amount (TON)</label>
            <div className="relative rounded-xl border border-gray-800 focus-within:border-violet-500/50 bg-gray-950 overflow-hidden">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent border-0 focus:outline-none px-4 py-3 text-lg font-mono font-bold text-white"
                min="1"
                step="any"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-400 font-display">TON</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors text-sm font-bold text-white shadow-md casino-glow-purple flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4 text-violet-200" />
            <span>Deposit and Fund Balance</span>
          </button>
        </form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title="Withdraw Earnings">
        <form onSubmit={handleWithdraw} className="space-y-5">
          <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-500/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">Withdrawable Balance</span>
              <p className="text-lg font-bold font-mono text-gray-200">{wallet.balance.toFixed(2)} TON</p>
            </div>
            <Coins className="w-7 h-7 text-blue-400" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-display">Withdrawal Amount (TON)</label>
            <div className="relative rounded-xl border border-gray-800 focus-within:border-blue-500/50 bg-gray-950 overflow-hidden">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent border-0 focus:outline-none px-4 py-3 text-lg font-mono font-bold text-white"
                min="0.1"
                step="any"
                required
              />
              <button
                type="button"
                onClick={() => {
                  tgWebApp.haptic.impact('soft');
                  setWithdrawAmount(wallet.balance.toString());
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-xs font-extrabold text-blue-400 hover:text-blue-300 font-display uppercase"
              >
                MAX
              </button>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-blue-400 font-display">TON</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-display">Destination TON Address</label>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              placeholder="EQA1_Keno_DestinationWallet..."
              className="w-full rounded-xl border border-gray-800 focus:border-blue-500/50 bg-gray-950 px-4 py-3 text-xs font-mono text-white placeholder-gray-600 focus:outline-none"
              required
            />
          </div>

          {withdrawError && (
            <div className="flex items-center space-x-2 text-rose-400 text-xs p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{withdrawError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors text-sm font-bold text-white shadow-md casino-glow-purple flex items-center justify-center space-x-2"
          >
            <ArrowUpCircle className="w-4 h-4 text-blue-200" />
            <span>Process Withdrawal</span>
          </button>
        </form>
      </Modal>
    </>
  );
}
