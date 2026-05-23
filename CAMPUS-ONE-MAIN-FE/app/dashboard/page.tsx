import { RegistrationSummary } from "@/components/dashboard/RegistrationSummary";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { getSchoolForUser, readDb } from "@/lib/backend/store";
import { cookies } from "next/headers";
import Link from "next/link";

function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(1)}k`;
  return `₱${amount.toLocaleString()}`;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value ?? "";
  const [db, school] = await Promise.all([readDb(), getSchoolForUser(userId)]);

  const revenue = db.fees.reduce((sum, f) => sum + parseAmount(f.amount ?? "0"), 0);
  const expenses = db.salary.reduce((sum, s) => sum + parseAmount(s.baseSalary ?? "0"), 0);
  const profit = revenue - expenses;

  return (
    <AppLayout>
      <div className="space-y-10">
        <SectionHeader
          title="Dashboard"
          description="Welcome back."
        />

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Students" value={String(db.students.length)} detail="" />
          <StatCard label="Total Employees" value={String(db.employees.length)} detail="" />
          <StatCard label="Revenue" value={formatCurrency(revenue)} detail="" />
          <StatCard label="Total Profit" value={formatCurrency(profit)} detail="" />
        </div>

        {/* Registration Summary Section */}
        <RegistrationSummary school={school} />

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-8">
          <DashboardCard title="Welcome to Campus One">
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  school.status === 'submitted' ? 'bg-green-50 text-green-600 border border-green-200' :
                  school.status === 'approved' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                  'bg-amber-50 text-[#F59E0B] border border-amber-200'
                }`}>
                  {school.status || 'draft'}
                </span>
              </div>
              <p className="text-3xl font-bold tracking-tight leading-tight mb-4 text-gray-900">
                {school.name
                  ? `${school.name} onboarding is ${school.status === 'submitted' ? 'under review' : 'in progress'}.`
                  : "Complete your school profile to get started."}
              </p>
              <Link href="/general-settings?tab=institute-profile" className="mt-8 inline-block rounded-xl bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#D97706] transition-colors">
                {school.name ? "Edit Profile" : "Complete Profile"}
              </Link>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Activity">
            <div className="space-y-3">
              {(() => {
                const activities: string[] = [];
                if (school.name) activities.push(`Institute "${school.name}" profile created`);
                if (school.status === 'submitted') activities.push('School registration submitted for review');
                if (school.targetSubdomain) activities.push(`Subdomain "${school.targetSubdomain}" reserved`);
                if (db.students.length > 0) activities.push(`${db.students.length} student record(s) imported`);
                if (db.employees.length > 0) activities.push(`${db.employees.length} employee record(s) added`);
                if (revenue > 0) activities.push(`Fee collection started — ${formatCurrency(revenue)} recorded`);
                if (activities.length === 0) activities.push('Welcome! Complete your school profile to get started.');

                return activities.map((activity, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-[13px] font-medium text-gray-600 transition-all hover:bg-amber-50 hover:text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/40 group-hover:bg-[#F59E0B] transition-colors shrink-0" />
                      {activity}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </DashboardCard>
        </div>
      </div>
    </AppLayout>
  );
}
