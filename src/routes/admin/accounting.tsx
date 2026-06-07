import { createFileRoute } from "@tanstack/react-router";
import { AccountingTabs } from "@/components/accounting/AccountingTabs";

export const Route = createFileRoute("/admin/accounting")({
  head: () => ({
    meta: [
      { title: "Regnskap — Gold of Sicily" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountingPage,
});

function AccountingPage() {
  return <AccountingTabs />;
}
