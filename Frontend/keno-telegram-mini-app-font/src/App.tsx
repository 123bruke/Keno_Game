import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from './store/useGameStore';
import { walletService } from './services/walletService';
import { gameService } from './services/gameService';
import { NavigationBar, BottomTabBar } from './components/Navigation';
import { LobbyView } from './components/LobbyView';
import { SelectionView } from './components/SelectionView';
import { DrawAnimation, PrizeCard, MatchCounter } from './components/Draw';
import { HistoryView } from './components/HistoryView';
import { FairnessView } from './components/FairnessView';
import { Toast, Modal } from './components/UI';
import { tgWebApp } from './utils/telegram';
import { Settings, Volume2, VolumeX, Shield, Zap, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    gameStatus,
    setGameStatus,
    selectedNumbers,
    betAmount,
    setWallet,
    showToast,
    winningNumbers,
    setWinningNumbers,
    drawnNumbers,
    addDrawnNumber,
    setCurrentDrawBall,
    setDrawnNumbers,
    setLastTicket,
    addTicketToHistory,
    settings,
    updateSettings,
  } = useGameStore();

  // Tab View Controller
  const [activeTab, setActiveTab] = useState<'lobby' | 'play' | 'history' | 'fairness'>('lobby');
  
  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize initial balance and configurations
  const syncWalletAndCurrentRound = async () => {
    try {
      const walletState = await walletService.getWallet();
      setWallet(walletState);
    } catch (err) {
      console.error('Initial sync failed', err);
    }
  };

  useEffect(() => {
    // Notify Telegram that the Mini App is fully loaded
    tgWebApp.ready();
    tgWebApp.expand();
    
    syncWalletAndCurrentRound();
  }, []);

  // Update tab mapping on gameStatus change
  useEffect(() => {
    if (gameStatus === 'lobby') {
      setActiveTab('lobby');
    } else if (gameStatus === 'selection') {
      setActiveTab('play');
    }
  }, [gameStatus]);

  // Handle Tab changes
  const handleTabChange = (tab: 'lobby' | 'play' | 'history' | 'fairness') => {
    setActiveTab(tab);
    if (tab === 'lobby') {
      setGameStatus('lobby');
    } else if (tab === 'play') {
      setGameStatus('selection');
    } else {
      setGameStatus('result'); // If they navigate to other tabs, suppress drawings
    }
  };

  // --- CORE GAME CYCLE - DRAW REVEAL INTERVAL ---
  const handlePlayRound = async () => {
    try {
      // 1. Fire play draw Axios call to backend
      const res = await gameService.play(selectedNumbers, betAmount);
      const ticket = res.ticket;

      // 2. Clear state and setup drawing stage
      setWinningNumbers(ticket.winningNumbers);
      setLastTicket(ticket);
      setDrawnNumbers([]);
      setCurrentDrawBall(null);
      setGameStatus('drawing');
      
      // Sync wallet balance to reflect bet deduction
      const tempWallet = await walletService.getWallet();
      setWallet(tempWallet);

      // 3. Sequential ball drawing loop
      const delay = settings.speed === 'fast' ? 250 : 650;
      let revealedCount = 0;

      const drawNextBall = () => {
        if (revealedCount < ticket.winningNumbers.length) {
          const nextBall = ticket.winningNumbers[revealedCount];
          
          // Play haptic feedback pulses
          const isMatchHit = selectedNumbers.includes(nextBall);
          if (isMatchHit) {
            // Success hit! Heavy feedback vibration and visual spark
            tgWebApp.haptic.notification('success');
            if (settings.soundEnabled) {
              // Sound trigger placeholder
              console.log('[Audio Synth] MATCH HIT pitch-up tone');
            }
          } else {
            tgWebApp.haptic.impact('light');
            if (settings.soundEnabled) {
              console.log('[Audio Synth] Standard ball drop tick');
            }
          }

          setCurrentDrawBall(nextBall);
          addDrawnNumber(nextBall);
          revealedCount++;
          
          setTimeout(drawNextBall, delay);
        } else {
          // Drawing complete! Dramatic pause before results reveal
          setTimeout(async () => {
            // Update latest wallet from backend (includes final winning payouts!)
            const finalWallet = await walletService.getWallet();
            setWallet(finalWallet);
            
            // Add ticket to local history
            addTicketToHistory(ticket);

            // Celebrate win or show loss
            if (ticket.status === 'won') {
              tgWebApp.haptic.notification('success');
            } else {
              tgWebApp.haptic.notification('warning');
            }

            setGameStatus('result');
          }, 1200);
        }
      };

      // Start sequential draw queue
      setTimeout(drawNextBall, 1000);

    } catch (err: any) {
      showToast(err.message || 'Game placement failed. Check balance.', 'error');
      setGameStatus('selection');
    }
  };

  // Determine which page viewport to render
  const renderViewContent = () => {
    if (gameStatus === 'drawing') {
      return (
        <div className="space-y-5 py-2">
          {/* Active Title bar */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold font-display text-white animate-pulse">LOTTERY DRAW ACTIVE</h2>
            <p className="text-xs text-gray-500">Secured via cryptographic server seed hashes</p>
          </div>

          <DrawAnimation />
          <MatchCounter />
        </div>
      );
    }

    if (gameStatus === 'result') {
      return <PrizeCard />;
    }

    switch (activeTab) {
      case 'lobby':
        return <LobbyView onRoute={handleTabChange} onPlayRound={handlePlayRound} />;
      case 'play':
        return <SelectionView onPlayRound={handlePlayRound} />;
      case 'history':
        return <HistoryView />;
      case 'fairness':
        return <FairnessView />;
      default:
        return <LobbyView onRoute={handleTabChange} onPlayRound={handlePlayRound} />;
    }
  };

  return (
    <div className="min-h-screen bg-casino-dark flex flex-col justify-between select-none">
      {/* Toast Notification Container */}
      <Toast />

      {/* Top sticky Navigation Header */}
      <NavigationBar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main viewport Container */}
      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameStatus === 'drawing' || gameStatus === 'result' ? gameStatus : activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            {renderViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom sticky tab bar navigation menu */}
      {gameStatus !== 'drawing' && gameStatus !== 'result' && (
        <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Settings Modal popups */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Casino Settings">
        <div className="space-y-6 pb-4">
          {/* Sound configuration */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-violet-950/40 border border-violet-500/10">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-violet-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-200 font-display block">Sound Effects</span>
                <span className="text-[10px] text-gray-500 block">Synthesizer audio clicks</span>
              </div>
            </div>

            <button
              onClick={() => {
                tgWebApp.haptic.impact('soft');
                updateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                settings.soundEnabled ? 'bg-violet-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Speed configuration */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-violet-950/40 border border-violet-500/10">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-200 font-display block">Draw Reveal Speed</span>
                <span className="text-[10px] text-gray-500 block">Time delay between revealed balls</span>
              </div>
            </div>

            <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800">
              <button
                onClick={() => {
                  tgWebApp.haptic.impact('soft');
                  updateSettings({ speed: 'normal' });
                }}
                className={`py-1 px-2 rounded-md text-[10px] font-mono font-bold transition-all ${
                  settings.speed === 'normal' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => {
                  tgWebApp.haptic.impact('soft');
                  updateSettings({ speed: 'fast' });
                }}
                className={`py-1 px-2 rounded-md text-[10px] font-mono font-bold transition-all ${
                  settings.speed === 'fast' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Turbo
              </button>
            </div>
          </div>

          {/* App Info Credit Lines */}
          <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-900 text-left space-y-1.5 text-[10px] text-gray-500 leading-normal font-medium">
            <div className="flex items-center space-x-1 font-bold text-violet-400 uppercase tracking-wider font-display mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Developer Diagnostics</span>
            </div>
            <p>
              This application is hosted inside a secure sandbox on port 3000. It is fully integrated with a local in-memory Express backend utilizing cryptographic seed hashes to prove lottery fair play.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
