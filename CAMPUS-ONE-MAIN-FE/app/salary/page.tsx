import { getActiveChild } from "@/components/dashboard/data";
import { ResourceManager } from "@/components/dashboard/ResourceManager";
import { resourceConfigs } from "@/components/dashboard/resourceConfig";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubtabPanel } from "@/components/ui/SubtabPanel";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function SalaryPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/salary", tab);
  const activeTitle = activeSubtab?.label ?? "Payroll Setup";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Salary / ${activeTitle}` : "Salary"}
          description=""
          action="Prepare Payroll"
        />
        <SubtabPanel
          parent="Salary"
          active={activeTitle}
          description=""
        />
        <ResourceManager config={resourceConfigs.salary} activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
