import { getActiveChild } from "@/components/dashboard/data";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubtabPanel } from "@/components/ui/SubtabPanel";
import { AccountsView } from "@/components/accounts/AccountsView";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function AccountsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/accounts", tab);
  const activeTitle = activeSubtab?.label ?? "Admin Users";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Accounts / ${activeTitle}` : "Accounts"}
          description=""
        />
        <SubtabPanel
          parent="Accounts"
          active={activeTitle}
          description=""
        />
        <AccountsView activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
