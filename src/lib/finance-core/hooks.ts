import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getAccountingStatus,
  sendKlinkSettlement,
  sendManualEntry,
  sendTestIncome,
  uploadAttachment,
} from "./functions";

export function useAccountingStatus() {
  const fn = useServerFn(getAccountingStatus);
  return useQuery({
    queryKey: ["finance-core", "status"],
    queryFn: () => fn(),
    staleTime: 15_000,
  });
}

export function useSendTestIncome() {
  const fn = useServerFn(sendTestIncome);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fn(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance-core"] }),
  });
}

export interface ManualEntryData {
  entry_type: "income" | "expense";
  entry_date: string;
  description: string;
  amount_gross: number;
  category?: string;
  counterparty?: string;
  notes?: string;
}

export function useSendManualEntry() {
  const fn = useServerFn(sendManualEntry);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ManualEntryData) => fn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance-core"] }),
  });
}

export interface KlinkSettlementData {
  eventSlug: string;
  eventName: string;
  settlementDate: string;
  totalRevenueNok: number;
  ourSharePercent: number;
  reportUrl?: string;
}

export function useSendKlinkSettlement() {
  const fn = useServerFn(sendKlinkSettlement);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: KlinkSettlementData) => fn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance-core"] }),
  });
}

export function useUploadAttachment() {
  const fn = useServerFn(uploadAttachment);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => fn({ data: form }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance-core"] }),
  });
}

export const FINANCE_CORE_BASE_URL =
  (import.meta.env.VITE_FINANCE_CORE_BASE_URL as string | undefined) ??
  "https://project--71d47bcd-142c-4661-be6b-2d7bcddce79c.lovable.app";
export const FINANCE_CORE_ORG_ID =
  (import.meta.env.VITE_FINANCE_CORE_ORGANIZATION_ID as string | undefined) ??
  "bbc194b3-3067-4eb9-9918-87bed9ab7670";

export function financeCoreOrgUrl() {
  return `${FINANCE_CORE_BASE_URL.replace(/\/+$/, "")}/orgs/${FINANCE_CORE_ORG_ID}`;
}
