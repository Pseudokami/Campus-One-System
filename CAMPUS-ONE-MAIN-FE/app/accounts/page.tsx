import { getActiveChild } from "@/components/dashboard/data";
import { ResourceManager } from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/components/dashboard/resourceConfig";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubtabPanel } from "@/components/ui/SubtabPanel";

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
          action="Invite User"
        />
        <SubtabPanel
          parent="Accounts"
          active={activeTitle}
          description=""
        />
        <ResourceManager config={resourceConfigs.accounts} activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
