import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  aiHealthService,
  CreateAiHealthScanPayload,
  dashboardService,
  petService,
  healthRecordService,
  affiliateService,
  normalizeAiHealthScan,
} from "../services/services";

/* ── Dashboard Hooks ─────────────────────────────── */
export const useDashboardSummary = () =>
  useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => dashboardService.summary(),
  });

export const usePetDashboard = (petId: string) =>
  useQuery({
    queryKey: ["petDashboard", petId],
    queryFn: () => dashboardService.petDashboard(petId),
    enabled: !!petId,
  });

export const useRiskScore = (petId: string) =>
  useQuery({
    queryKey: ["riskScore", petId],
    queryFn: () => dashboardService.riskScore(petId),
    enabled: !!petId,
  });

export const useDiscountEstimate = (petId: string) =>
  useQuery({
    queryKey: ["discountEstimate", petId],
    queryFn: () => dashboardService.discountEstimate(petId),
    enabled: !!petId,
  });

/* ── Pet Hooks ───────────────────────────────────── */
export const usePets = () =>
  useQuery({
    queryKey: ["pets"],
    queryFn: () => petService.list(),
  });

export const usePet = (petId: string) =>
  useQuery({
    queryKey: ["pet", petId],
    queryFn: () => petService.get(petId),
    enabled: !!petId,
  });

export const useCreatePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => petService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
};

export const useDeletePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
};

/* ── Health Record Hooks ─────────────────────────── */
export const useHealthRecords = (petId: string, params?: { type?: string }) =>
  useQuery({
    queryKey: ["healthRecords", petId, params],
    queryFn: () => healthRecordService.list(petId, params),
    enabled: !!petId,
  });

export const useCreateHealthRecord = (petId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => healthRecordService.create(petId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["healthRecords", petId] });
      qc.invalidateQueries({ queryKey: ["petDashboard", petId] });
    },
  });
};

/* ── Affiliate Hooks ─────────────────────────────── */
export const useAffiliateOffers = () =>
  useQuery({
    queryKey: ["affiliateOffers"],
    queryFn: () => affiliateService.offers(),
  });

export const useLogAffiliateClick = () =>
  useMutation({
    mutationFn: (offerId: string) => affiliateService.logClick(offerId),
  });

export const useCreateAiHealthScan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAiHealthScanPayload) => aiHealthService.create(payload),
    onSuccess: (data) => {
      const normalized = normalizeAiHealthScan(data);

      if (normalized.id) {
        qc.setQueryData(["aiHealthScan", normalized.id], normalized);
      }
    },
  });
};

export const useAiHealthScan = (scanId: string | null) =>
  useQuery({
    queryKey: ["aiHealthScan", scanId],
    queryFn: async () => {
      const data = await aiHealthService.get(scanId!);
      return normalizeAiHealthScan(data, scanId);
    },
    enabled: Boolean(scanId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "completed" || status === "failed") {
        return false;
      }

      return 2500;
    },
  });
