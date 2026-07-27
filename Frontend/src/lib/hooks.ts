import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi, gameApi, adminApi } from "./api";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: walletApi.get,
    staleTime: 3000,
    retry: 2,
  });
}

export function useDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, reference }: { amount: number; reference?: string }) =>
      walletApi.deposit(amount, reference),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet"] }),
  });
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, reference }: { amount: number; reference?: string }) =>
      walletApi.withdraw(amount, reference),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet"] }),
  });
}

export function useCurrentRound() {
  return useQuery({
    queryKey: ["currentRound"],
    queryFn: gameApi.current,
    staleTime: 5000,
  });
}

export function usePlayKeno() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      selectedNumbers,
      betAmount,
      mode,
    }: {
      selectedNumbers: number[];
      betAmount: number;
      mode?: "INSTANT" | "CLASSIC";
    }) => gameApi.play(selectedNumbers, betAmount, mode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["history"] });
      qc.invalidateQueries({ queryKey: ["currentRound"] });
    },
  });
}

export function useQuickPick() {
  return useMutation({
    mutationFn: (count: number) => gameApi.quickPick(count),
  });
}

export function useHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["history", page, limit],
    queryFn: () => gameApi.history(page, limit),
  });
}

export function useProvablyFair(gameId?: string) {
  return useQuery({
    queryKey: ["provablyFair", gameId],
    queryFn: () => gameApi.provablyFair(gameId),
  });
}

export function useVerify() {
  return useMutation({
    mutationFn: ({
      serverSeed,
      clientSeed,
      nonce,
    }: {
      serverSeed: string;
      clientSeed: string;
      nonce: number;
    }) => gameApi.verify(serverSeed, clientSeed, nonce),
  });
}

// Admin Hooks
export function useAdminSettings() {
  return useQuery({
    queryKey: ["adminSettings"],
    queryFn: adminApi.settings,
  });
}

export function useUpdateAdminSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminApi.updateSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminSettings"] }),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: adminApi.analytics,
  });
}

export function useAdminUsers(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ["adminUsers", page, limit, search],
    queryFn: () => adminApi.users(page, limit, search),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "ACTIVE" | "SUSPENDED" }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminUsers"] }),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "USER" | "ADMIN" }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminUsers"] }),
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ["adminReports"],
    queryFn: adminApi.reports,
  });
}
