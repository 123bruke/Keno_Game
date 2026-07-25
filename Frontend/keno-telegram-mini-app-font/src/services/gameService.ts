import { apiClient } from './apiClient';
import { Ticket, KenoHistoryResponse } from '../types';

export const gameService = {
  getCurrentGame: async (): Promise<{ currentRound: number; maxSelectableNumbers: number }> => {
    return apiClient.get('/games/keno/current');
  },

  play: async (selectedNumbers: number[], betAmount: number): Promise<{ ticket: Ticket }> => {
    return apiClient.post('/games/keno/play', { selectedNumbers, betAmount });
  },

  getResult: async (id: string): Promise<Ticket> => {
    return apiClient.get(`/games/keno/result/${id}`);
  },

  getHistory: async (page: number = 1, limit: number = 10): Promise<KenoHistoryResponse> => {
    return apiClient.get(`/games/keno/history?page=${page}&limit=${limit}`);
  },
};
