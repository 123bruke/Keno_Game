import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// In-Memory Database for demonstration
interface ServerWallet {
  balance: number;
  currency: string;
  address: string;
}

interface ServerTicket {
  id: string;
  roundNumber: number;
  betAmount: number;
  selectedNumbers: number[];
  winningNumbers: number[];
  matches: number[];
  prizeAmount: number;
  multiplier: number;
  status: 'won' | 'lost' | 'pending';
  createdAt: string;
}

// Global server state
let wallet: ServerWallet = {
  balance: 1000,
  currency: 'TON',
  address: 'EQA1_Keno_Telegram_MiniApp_DemoWallet_Address_xyz',
};

let currentRound = 2048;
let serverSeed = crypto.randomBytes(16).toString('hex');
let clientSeed = 'keno_telegram_mini_app';
let nonce = 1;
const history: ServerTicket[] = [];

// Helper to generate SHA256 hash
function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Generate winning numbers deterministically (Provably Fair)
function generateWinningNumbers(sSeed: string, cSeed: string, roundNonce: number): number[] {
  const winning: number[] = [];
  let index = 0;
  
  // Deterministic draw of 20 unique numbers out of 80
  while (winning.length < 20) {
    const hash = crypto.createHash('sha256')
      .update(`${sSeed}:${cSeed}:${roundNonce}:${index}`)
      .digest('hex');
    
    // Convert first 8 hex characters to an integer
    const val = parseInt(hash.substring(0, 8), 16);
    const num = (val % 80) + 1;
    
    if (!winning.includes(num)) {
      winning.push(num);
    }
    index++;
  }
  
  return winning.sort((a, b) => a - b);
}

// Seed history with some sample tickets so the history page looks beautiful right away
function seedInitialHistory() {
  const sampleClientSeeds = ['telegram_app_user_1', 'lucky_draw_seed', 'casino_fever'];
  for (let i = 0; i < 5; i++) {
    const round = currentRound - 5 + i;
    const sSeedSeed = crypto.randomBytes(16).toString('hex');
    const cSeedSeed = sampleClientSeeds[i % sampleClientSeeds.length];
    const rNonce = i + 1;
    const wins = generateWinningNumbers(sSeedSeed, cSeedSeed, rNonce);
    
    // Pick 5 to 8 random numbers
    const selectCount = 5 + Math.floor(Math.random() * 4);
    const selected: number[] = [];
    while (selected.length < selectCount) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!selected.includes(num)) {
        selected.push(num);
      }
    }
    selected.sort((a, b) => a - b);
    
    const matches = selected.filter(n => wins.includes(n));
    const matchCount = matches.length;
    
    // Simpler multipliers for sample seeding
    let mult = 0;
    if (selectCount === 5) {
      if (matchCount === 2) mult = 1.5;
      else if (matchCount === 3) mult = 4;
      else if (matchCount === 4) mult = 15;
      else if (matchCount === 5) mult = 250;
    } else if (selectCount === 6) {
      if (matchCount === 3) mult = 2.5;
      else if (matchCount === 4) mult = 7;
      else if (matchCount === 5) mult = 60;
      else if (matchCount === 6) mult = 1000;
    } else {
      if (matchCount === 2) mult = 1;
      else if (matchCount === 3) mult = 2;
      else if (matchCount === 4) mult = 5;
      else if (matchCount === 5) mult = 12;
      else if (matchCount >= 6) mult = 50;
    }
    
    const bet = 10 * (1 + Math.floor(Math.random() * 5));
    const prize = parseFloat((bet * mult).toFixed(2));
    
    history.unshift({
      id: crypto.randomBytes(8).toString('hex'),
      roundNumber: round,
      betAmount: bet,
      selectedNumbers: selected,
      winningNumbers: wins,
      matches,
      prizeAmount: prize,
      multiplier: mult,
      status: prize > 0 ? 'won' : 'lost',
      createdAt: new Date(Date.now() - (5 - i) * 10 * 60000).toISOString(),
    });
  }
}

seedInitialHistory();

// Official Casino Keno Multipliers
const MULTIPLIERS: { [key: number]: { [match: number]: number } } = {
  1: { 0: 0, 1: 3.0 },
  2: { 0: 0, 1: 1.0, 2: 9.0 },
  3: { 0: 0, 1: 1.0, 2: 2.5, 3: 16.0 },
  4: { 0: 0, 1: 0.5, 2: 2.0, 3: 5.0, 4: 50.0 },
  5: { 0: 0, 1: 0, 2: 1.5, 3: 3.5, 4: 15.0, 5: 250.0 },
  6: { 0: 0, 1: 0, 2: 1.0, 3: 2.5, 4: 7.0, 5: 60.0, 6: 1000.0 },
  7: { 0: 0, 1: 0, 2: 1.0, 3: 1.5, 4: 5.0, 5: 20.0, 6: 150.0, 7: 3000.0 },
  8: { 0: 0, 1: 0, 2: 0.5, 3: 1.0, 4: 4.0, 5: 10.0, 6: 50.0, 7: 500.0, 8: 10000.0 },
  9: { 0: 0, 1: 0, 2: 0, 3: 1.0, 4: 2.5, 5: 5.0, 6: 25.0, 7: 150.0, 8: 1000.0, 9: 25000.0 },
  10: { 0: 0, 1: 0, 2: 0, 3: 1.0, 4: 1.5, 5: 4.0, 6: 15.0, 7: 80.0, 8: 500.0, 9: 2500.0, 10: 100000.0 },
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === API ENDPOINTS ===

  // 1. Get wallet state
  app.get('/api/wallet', (req, res) => {
    res.json(wallet);
  });

  // Deposit
  app.post('/api/wallet/deposit', (req, res) => {
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Invalid deposit amount' });
      return;
    }
    wallet.balance = parseFloat((wallet.balance + amount).toFixed(2));
    res.json(wallet);
  });

  // Withdraw
  app.post('/api/wallet/withdraw', (req, res) => {
    const { amount, address } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Invalid withdrawal amount' });
      return;
    }
    if (!address || typeof address !== 'string' || address.trim() === '') {
      res.status(400).json({ message: 'Invalid withdrawal address' });
      return;
    }
    if (amount > wallet.balance) {
      res.status(400).json({ message: 'Insufficient balance' });
      return;
    }
    wallet.balance = parseFloat((wallet.balance - amount).toFixed(2));
    res.json(wallet);
  });

  // 2. Get current game round info
  app.get('/api/games/keno/current', (req, res) => {
    res.json({
      currentRound,
      maxSelectableNumbers: 10,
    });
  });

  // 3. Play Keno (Draw Numbers)
  app.post('/api/games/keno/play', (req, res) => {
    const { selectedNumbers, betAmount, clientSeed: customClientSeed } = req.body;

    // Validate inputs
    if (!Array.isArray(selectedNumbers) || selectedNumbers.length === 0 || selectedNumbers.length > 10) {
      res.status(400).json({ message: 'Select between 1 and 10 numbers.' });
      return;
    }

    const uniqueSelected = Array.from(new Set(selectedNumbers));
    if (uniqueSelected.length !== selectedNumbers.length) {
      res.status(400).json({ message: 'Duplicate numbers are not allowed.' });
      return;
    }

    if (selectedNumbers.some(n => typeof n !== 'number' || n < 1 || n > 80)) {
      res.status(400).json({ message: 'All selected numbers must be between 1 and 80.' });
      return;
    }

    if (typeof betAmount !== 'number' || betAmount <= 0) {
      res.status(400).json({ message: 'Invalid bet amount.' });
      return;
    }

    if (betAmount > wallet.balance) {
      res.status(400).json({ message: 'Insufficient wallet balance.' });
      return;
    }

    // Update active client seed if provided
    if (customClientSeed && typeof customClientSeed === 'string' && customClientSeed.trim() !== '') {
      clientSeed = customClientSeed;
    }

    // Deduct bet amount
    wallet.balance = parseFloat((wallet.balance - betAmount).toFixed(2));

    // Draw 20 numbers deterministically using current seeds
    const wins = generateWinningNumbers(serverSeed, clientSeed, nonce);

    // Calculate matches
    const matches = selectedNumbers.filter(n => wins.includes(n));
    const matchCount = matches.length;
    const selectCount = selectedNumbers.length;

    // Determine multiplier
    const table = MULTIPLIERS[selectCount] || {};
    const multiplier = table[matchCount] !== undefined ? table[matchCount] : 0;
    const prizeAmount = parseFloat((betAmount * multiplier).toFixed(2));

    // Update balance on win
    if (prizeAmount > 0) {
      wallet.balance = parseFloat((wallet.balance + prizeAmount).toFixed(2));
    }

    // Save previous seed details for Verification, then roll seeds
    const oldServerSeed = serverSeed;
    const oldNonce = nonce;

    // Create ticket record
    const ticket: ServerTicket = {
      id: crypto.randomBytes(8).toString('hex'),
      roundNumber: currentRound,
      betAmount,
      selectedNumbers: selectedNumbers.sort((a, b) => a - b),
      winningNumbers: wins,
      matches: matches.sort((a, b) => a - b),
      prizeAmount,
      multiplier,
      status: prizeAmount > 0 ? 'won' : 'lost',
      createdAt: new Date().toISOString(),
    };

    history.unshift(ticket);

    // Roll round, nonce and generate a new server seed for next play
    currentRound++;
    nonce++;
    serverSeed = crypto.randomBytes(16).toString('hex');

    res.json({
      ticket,
      provablyFair: {
        previousServerSeed: oldServerSeed,
        previousClientSeed: clientSeed,
        previousNonce: oldNonce,
        nextServerSeedHash: sha256(serverSeed),
        nextClientSeed: clientSeed,
        nextNonce: nonce,
      }
    });
  });

  // 4. Get individual ticket result
  app.get('/api/games/keno/result/:id', (req, res) => {
    const { id } = req.params;
    const ticket = history.find(t => t.id === id);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }
    res.json(ticket);
  });

  // 5. Get complete history with pagination
  app.get('/api/games/keno/history', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedHistory = history.slice(startIndex, endIndex);
    
    const totalGames = history.length;
    const totalWinnings = history.reduce((sum, t) => sum + (t.status === 'won' ? t.prizeAmount : 0), 0);
    const totalBets = history.reduce((sum, t) => sum + t.betAmount, 0);

    res.json({
      history: paginatedHistory,
      totalGames,
      totalWinnings: parseFloat(totalWinnings.toFixed(2)),
      totalBets: parseFloat(totalBets.toFixed(2)),
    });
  });

  // 6. Get Provably Fair details
  app.get('/api/games/keno/provably-fair', (req, res) => {
    res.json({
      roundNumber: currentRound,
      serverSeedHash: sha256(serverSeed),
      clientSeed,
      nonce,
    });
  });

  // 7. Verify an absolute draw manually
  app.post('/api/games/keno/provably-fair/verify', (req, res) => {
    const { serverSeed: sSeed, clientSeed: cSeed, nonce: rNonce } = req.body;
    if (!sSeed || !cSeed || !rNonce || typeof rNonce !== 'number') {
      res.status(400).json({ message: 'Incomplete parameters for verification' });
      return;
    }
    try {
      const winningNumbers = generateWinningNumbers(sSeed, cSeed, rNonce);
      res.json({
        verified: true,
        winningNumbers,
      });
    } catch (e: any) {
      res.status(500).json({ message: 'Verification failed: ' + e.message });
    }
  });


  // === VITE ASSET INJECTION / CLIENT FALLBACK ===

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Keno Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Keno Backend] Startup failed:', err);
});
