import { getActiveChild } from "@/components/dashboard/data";
import { ReferenceView } from "@/components/dashboard/ReferenceView";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubtabPanel } from "@/components/ui/SubtabPanel";

type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export default async function AttendancePage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeSubtab = getActiveChild("/attendance", tab);
  const activeTitle = activeSubtab?.label ?? "Students Attendance";

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title={activeSubtab ? `Attendance / ${activeTitle}` : "Attendance"}
          description=""
          action="Create Report"
        />
        <SubtabPanel
          parent="Attendance"
          active={activeTitle}
          description=""
        />
        <ReferenceView parent="Attendance" activeSubtab={activeTitle} />
      </div>
    </AppLayout>
  );
}
