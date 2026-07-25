import { apiClient } from './apiClient';
import { Wallet } from '../types';

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    return apiClient.get('/wallet');
  },

  deposit: async (amount: number): Promise<Wallet> => {
    return apiClient.post('/wallet/deposit', { amount });
  },

  withdraw: async (amount: number, address: string): Promise<Wallet> => {
    return apiClient.post('/wallet/withdraw', { amount, address });
  },
};
