import { apiClient } from './apiClient';
import { ProvablyFairRecord } from '../types';

export const fairnessService = {
  getProvablyFairRecord: async (roundNumber?: number): Promise<ProvablyFairRecord> => {
    return apiClient.get('/games/keno/provably-fair', {
      params: { round: roundNumber },
    });
  },

  verifyRound: async (serverSeed: string, clientSeed: string, nonce: number): Promise<{ verified: boolean; winningNumbers: number[] }> => {
    return apiClient.post('/games/keno/provably-fair/verify', {
      serverSeed,
      clientSeed,
      nonce,
    });
  },
};
