export const KLINK_DEFAULT_CUSTOMER = {
  customer_name: "JAJAJA AS",
  customer_org_number: "912398234",
  customer_email: "bernard@enterspace.no",
  customer_address: "Vulkan 9, 0178 OSLO",
} as const;

export type PopupInvoiceLineInput = {
  eventName: string;
  eventDate: string;
  totalRevenueNok: number;
  ourSharePercent: number;
  vatRate?: number;
};

export function calcOurShareNok(totalRevenueNok: number, ourSharePercent: number): number {
  return Math.round(totalRevenueNok * (ourSharePercent / 100));
}

export function mapPopupLineToInvoiceLine(line: PopupInvoiceLineInput) {
  const share = calcOurShareNok(line.totalRevenueNok, line.ourSharePercent);
  return {
    description: `Popup ${line.eventName} – Gold of Sicily andel ${line.ourSharePercent} % – ${line.eventDate}`,
    quantity: 1,
    unit_price: share,
    vat_rate: line.vatRate ?? 15,
  };
}

function plusDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function mapPopupSettlementToInvoiceInput(params: {
  issueDate?: string;
  dueDate?: string;
  lines: PopupInvoiceLineInput[];
}) {
  return {
    issue_date: params.issueDate ?? new Date().toISOString().slice(0, 10),
    due_date: params.dueDate ?? plusDaysISO(14),
    ...KLINK_DEFAULT_CUSTOMER,
    lines: params.lines.map(mapPopupLineToInvoiceLine),
  };
}
