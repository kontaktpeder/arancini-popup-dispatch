import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AccountingLang = "no" | "en";

const STORAGE_KEY = "accounting-lang";

const dict = {
  no: {
    loading: "Laster regnskap…",
    creatingDefault: "Oppretter standard regnskap…",
    back: "Tilbake",
    title: "Regnskap",
    uploadReceipt: "Last opp kvittering",
    analyzing: "AI analyserer kvitteringen…",
    aiReady: "AI-forslag klart",
    aiFailed: "AI-analyse feilet",
    uploadFailed: "Opplasting feilet",
    csv: "CSV",
    kpi: {
      income: "Inntekter",
      expense: "Utgifter",
      result: "Resultat",
      unpaid: "Ubetalt",
      pendingInvoice: "Mangler faktura",
      missingAttachment: "Mangler bilag",
    },
    show: "Vis:",
    filter: {
      all: "Alle poster",
      pre: "Kun før selskapsstiftelse",
      ordinary: "Kun ordinære poster",
    },
    preHelp:
      "Poster merket «Før selskapsstiftelse» ble registrert før selskapet ble etablert. Registreringen brukes for å dokumentere oppstartskostnader og historikk. Om kostnaden senere kan overføres til selskapet må vurderes separat.",
    expenses: "Utgifter",
    incomes: "Inntekter",
    newRow: "Ny rad",
    noRows: "Ingen rader ennå.",
    col: {
      voucher: "Bilag",
      date: "Dato",
      description: "Beskrivelse",
      category: "Kategori",
      counterparty: "Motpart",
      amount: "Beløp (kr)",
      paid: "Betalt",
      invoice: "Faktura",
      attachment: "Bilag",
      pre: "Før stift.",
    },
    placeholder: {
      description: "Beskrivelse",
      category: "Kategori",
      counterparty: "Leverandør / kunde",
    },
    badgePre: "Før selskapsstiftelse",
    payment: {
      unpaid: "Ubetalt",
      paid: "Betalt",
      partial: "Delvis",
      cancelled: "Kansellert",
    },
    invoice: {
      pending: "Mangler",
      received: "Mottatt",
      not_required: "Ikke nødvendig",
    },
    view: "Vis",
    upload: "Last opp",
    uploading: "Laster…",
    attachmentUploaded: "Bilag lastet opp",
    deleteRow: "Slett denne raden?",
    aria: { pre: "Før selskapsstiftelse" },
    // receipt review
    review: {
      title: "Kontroller AI-forslag",
      warning:
        "AI kan tolke feil. Du må kontrollere at beløp, dato, leverandør og MVA stemmer før posten lagres.",
      aiError: "AI-feil",
      analyzing: "AI analyserer dokumentet…",
      noPreview: "Ingen forhåndsvisning",
      approveAll: "Godkjenn alle",
      approved: "Godkjent",
      approve: "Godkjenn",
      type: "Type",
      typeExpense: "Utgift",
      typeIncome: "Inntekt",
      date: "Dato",
      counterparty: "Leverandør / motpart",
      description: "Beskrivelse",
      category: "Kategori",
      gross: "Totalbeløp (kr)",
      vatRate: "MVA-sats",
      vatAmount: "MVA-beløp (kr)",
      paymentStatus: "Betalingsstatus",
      invoiceStatus: "Fakturastatus",
      pre: "Før selskapsstiftelse",
      yes: "Ja",
      no: "Nei",
      reject: "Avvis forslag",
      saveCreate: "Godkjenn og opprett post",
      rejected: "Forslag avvist",
      saveError: "Kunne ikke lagre",
      created: "Regnskapspost opprettet",
      fillRequired: "Fyll inn beskrivelse eller leverandør",
      amountRequired: "Beløp må være større enn 0",
      open: "Åpne",
      drafts: "AI-utkast som venter på godkjenning",
      check: "Kontroller",
      rejectedBadge: "Avvist",
      deleteDraft: "Slett utkast?",
      analyzingShort: "Analyserer…",
      aiReady: "AI-forslag klart",
      errorPrefix: "Feil",
    },
  },
  en: {
    loading: "Loading accounting…",
    creatingDefault: "Creating default book…",
    back: "Back",
    title: "Accounting",
    uploadReceipt: "Upload receipt",
    analyzing: "AI is analyzing the receipt…",
    aiReady: "AI suggestion ready",
    aiFailed: "AI analysis failed",
    uploadFailed: "Upload failed",
    csv: "CSV",
    kpi: {
      income: "Income",
      expense: "Expenses",
      result: "Result",
      unpaid: "Unpaid",
      pendingInvoice: "Missing invoice",
      missingAttachment: "Missing receipt",
    },
    show: "Show:",
    filter: {
      all: "All entries",
      pre: "Only pre-incorporation",
      ordinary: "Only regular entries",
    },
    preHelp:
      "Entries marked “Pre-incorporation” were recorded before the company was formally established. They are kept to document start-up costs and history. Whether the cost can later be transferred to the company must be evaluated separately.",
    expenses: "Expenses",
    incomes: "Income",
    newRow: "New row",
    noRows: "No rows yet.",
    col: {
      voucher: "Voucher",
      date: "Date",
      description: "Description",
      category: "Category",
      counterparty: "Counterparty",
      amount: "Amount (NOK)",
      paid: "Paid",
      invoice: "Invoice",
      attachment: "Receipt",
      pre: "Pre-inc.",
    },
    placeholder: {
      description: "Description",
      category: "Category",
      counterparty: "Supplier / customer",
    },
    badgePre: "Pre-incorporation",
    payment: {
      unpaid: "Unpaid",
      paid: "Paid",
      partial: "Partial",
      cancelled: "Cancelled",
    },
    invoice: {
      pending: "Missing",
      received: "Received",
      not_required: "Not required",
    },
    view: "View",
    upload: "Upload",
    uploading: "Uploading…",
    attachmentUploaded: "Receipt uploaded",
    deleteRow: "Delete this row?",
    aria: { pre: "Pre-incorporation" },
    review: {
      title: "Review AI suggestion",
      warning:
        "AI can misinterpret. Verify amount, date, supplier and VAT before saving the entry.",
      aiError: "AI error",
      analyzing: "AI is analyzing the document…",
      noPreview: "No preview",
      approveAll: "Approve all",
      approved: "Approved",
      approve: "Approve",
      type: "Type",
      typeExpense: "Expense",
      typeIncome: "Income",
      date: "Date",
      counterparty: "Supplier / counterparty",
      description: "Description",
      category: "Category",
      gross: "Total amount (NOK)",
      vatRate: "VAT rate",
      vatAmount: "VAT amount (NOK)",
      paymentStatus: "Payment status",
      invoiceStatus: "Invoice status",
      pre: "Pre-incorporation",
      yes: "Yes",
      no: "No",
      reject: "Reject suggestion",
      saveCreate: "Approve and create entry",
      rejected: "Suggestion rejected",
      saveError: "Could not save",
      created: "Accounting entry created",
      fillRequired: "Enter description or supplier",
      amountRequired: "Amount must be greater than 0",
      open: "Open",
      drafts: "AI drafts awaiting approval",
      check: "Review",
      rejectedBadge: "Rejected",
      deleteDraft: "Delete draft?",
      analyzingShort: "Analyzing…",
      aiReady: "AI suggestion ready",
      errorPrefix: "Error",
    },
  },
};

export type AccountingDict = typeof dict.no;

const Ctx = createContext<{ lang: AccountingLang; setLang: (l: AccountingLang) => void; t: AccountingDict }>({
  lang: "no",
  setLang: () => {},
  t: dict.no,
});

export function AccountingI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AccountingLang>("no");

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "no" || v === "en") setLangState(v);
    } catch {}
  }, []);

  const setLang = (l: AccountingLang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  return (
    <Ctx.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAccountingT() {
  return useContext(Ctx);
}
