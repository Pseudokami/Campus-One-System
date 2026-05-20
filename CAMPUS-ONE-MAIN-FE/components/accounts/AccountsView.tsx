"use client";

import { useMemo, useState } from "react";
import { Edit3, Eye, MailPlus, RotateCcw, Search, ShieldCheck, Trash2, UserPlus, Users, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string;
  status: "Active" | "Limited" | "Pending";
};

type PermissionRow = {
  id: string;
  module: string;
  owner: string;
  access: string;
  status: "Enabled" | "Review";
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  invitedBy: string;
  status: "Sent" | "Accepted" | "Expired";
};

type AdminRecord = AdminUser | PermissionRow | Invitation;
type ActiveAction = "view" | "edit";

const adminUsers: AdminUser[] = [
  { id: "ADM-1001", name: "Mara Santos", email: "mara.santos@campusone.edu", role: "Super Admin", access: "All modules", status: "Active" },
  { id: "ADM-1002", name: "Luis Reyes", email: "luis.reyes@campusone.edu", role: "Registrar", access: "Students, Classes, Attendance", status: "Active" },
  { id: "ADM-1003", name: "Ela Cruz", email: "ela.cruz@campusone.edu", role: "Finance Admin", access: "Fees, Salary, Accounts", status: "Limited" },
  { id: "ADM-1004", name: "Noah Lim", email: "noah.lim@campusone.edu", role: "HR Staff", access: "Employees, Payroll", status: "Pending" },
];

const permissions: PermissionRow[] = [
  { id: "PERM-01", module: "Students Management", owner: "Registrar", access: "View, Add, Edit, Print", status: "Enabled" },
  { id: "PERM-02", module: "Payroll Setup", owner: "Finance Admin", access: "View, Generate Payslip", status: "Enabled" },
  { id: "PERM-03", module: "Attendance Reports", owner: "Registrar", access: "View, Export, Print", status: "Enabled" },
  { id: "PERM-04", module: "Admin Users", owner: "Super Admin", access: "Invite, Edit, Remove", status: "Review" },
];

const invitations: Invitation[] = [
  { id: "INV-2301", email: "anne.delacruz@campusone.edu", role: "Admission Staff", invitedBy: "Mara Santos", status: "Sent" },
  { id: "INV-2302", email: "payroll@campusone.edu", role: "Payroll Clerk", invitedBy: "Ela Cruz", status: "Accepted" },
  { id: "INV-2303", email: "records@campusone.edu", role: "Records Assistant", invitedBy: "Luis Reyes", status: "Expired" },
];

function statusClass(status: string) {
  if (["Active", "Enabled", "Accepted"].includes(status)) return "bg-green-50 text-green-700 border-green-200";
  if (["Pending", "Sent", "Review"].includes(status)) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-600 border-gray-200";
}

function AdminToolbar({
  activeSubtab,
  search,
  actionMessage,
  onSearch,
}: {
  activeSubtab: string;
  search: string;
  actionMessage: string;
  onSearch: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-black text-gray-900">{activeSubtab}</h2>
        {actionMessage ? <p className="mt-1 text-xs font-bold text-primary">{actionMessage}</p> : null}
      </div>
      <label className="relative block w-full md:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="Search users, roles, modules..."
          type="search"
        />
      </label>
    </div>
  );
}

function recordTitle(record: AdminRecord) {
  if ("name" in record) return record.name;
  if ("module" in record) return record.module;
  return record.email;
}

function ActionButtons({
  onView,
  onEdit,
  onRemove,
}: {
  onView: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {[
        { label: "View", icon: Eye, className: "text-gray-600 hover:bg-gray-100", onClick: onView },
        { label: "Edit", icon: Edit3, className: "text-primary hover:bg-primary/10", onClick: onEdit },
        { label: "Remove", icon: Trash2, className: "text-red-500 hover:bg-red-50", onClick: onRemove },
      ].map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            className={cn("rounded-lg p-2 transition", action.className)}
            onClick={action.onClick}
            title={action.label}
            type="button"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

function AdminUsersTable({
  rows,
  onView,
  onEdit,
  onRemove,
}: {
  rows: AdminUser[];
  onView: (row: AdminUser) => void;
  onEdit: (row: AdminUser) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-primary text-[11px] font-black uppercase tracking-wider text-white">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Access</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900">{row.name}</td>
              <td className="px-6 py-4 text-gray-600">{row.email}</td>
              <td className="px-6 py-4 text-gray-900">{row.role}</td>
              <td className="px-6 py-4 text-gray-600">{row.access}</td>
              <td className="px-6 py-4">
                <span className={cn("rounded-full border px-3 py-1 text-[11px] font-bold", statusClass(row.status))}>{row.status}</span>
              </td>
              <td className="px-6 py-4">
                <ActionButtons onView={() => onView(row)} onEdit={() => onEdit(row)} onRemove={() => onRemove(row.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermissionsTable({
  rows,
  onView,
  onEdit,
  onRemove,
}: {
  rows: PermissionRow[];
  onView: (row: PermissionRow) => void;
  onEdit: (row: PermissionRow) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-primary text-[11px] font-black uppercase tracking-wider text-white">
          <tr>
            <th className="px-6 py-4">Module</th>
            <th className="px-6 py-4">Role Owner</th>
            <th className="px-6 py-4">Allowed Actions</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900">{row.module}</td>
              <td className="px-6 py-4 text-gray-600">{row.owner}</td>
              <td className="px-6 py-4 text-gray-600">{row.access}</td>
              <td className="px-6 py-4">
                <span className={cn("rounded-full border px-3 py-1 text-[11px] font-bold", statusClass(row.status))}>{row.status}</span>
              </td>
              <td className="px-6 py-4">
                <ActionButtons onView={() => onView(row)} onEdit={() => onEdit(row)} onRemove={() => onRemove(row.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvitationActions({
  status,
  onView,
  onResend,
  onCancel,
  onRemove,
}: {
  status: Invitation["status"];
  onView: () => void;
  onResend: () => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100" onClick={onView} title="View" type="button">
        <Eye className="h-4 w-4" />
      </button>
      {status !== "Accepted" ? (
        <button className="rounded-lg p-2 text-primary transition hover:bg-primary/10" onClick={onResend} title="Resend invitation" type="button">
          <RotateCcw className="h-4 w-4" />
        </button>
      ) : null}
      {status === "Sent" ? (
        <button className="rounded-lg p-2 text-red-500 transition hover:bg-red-50" onClick={onCancel} title="Cancel invitation" type="button">
          <XCircle className="h-4 w-4" />
        </button>
      ) : (
        <button className="rounded-lg p-2 text-red-500 transition hover:bg-red-50" onClick={onRemove} title="Remove" type="button">
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function InvitationsTable({
  rows,
  onView,
  onResend,
  onCancel,
  onRemove,
}: {
  rows: Invitation[];
  onView: (row: Invitation) => void;
  onResend: (row: Invitation) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-primary text-[11px] font-black uppercase tracking-wider text-white">
          <tr>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Invited By</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900">{row.email}</td>
              <td className="px-6 py-4 text-gray-600">{row.role}</td>
              <td className="px-6 py-4 text-gray-600">{row.invitedBy}</td>
              <td className="px-6 py-4">
                <span className={cn("rounded-full border px-3 py-1 text-[11px] font-bold", statusClass(row.status))}>{row.status}</span>
              </td>
              <td className="px-6 py-4">
                <InvitationActions
                  status={row.status}
                  onView={() => onView(row)}
                  onResend={() => onResend(row)}
                  onCancel={() => onCancel(row.id)}
                  onRemove={() => onRemove(row.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccountsView({ activeSubtab }: { activeSubtab: string }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(adminUsers);
  const [permissionRows, setPermissionRows] = useState(permissions);
  const [invitationRows, setInvitationRows] = useState(invitations);
  const [activeRecord, setActiveRecord] = useState<AdminRecord | null>(null);
  const [activeAction, setActiveAction] = useState<ActiveAction>("view");
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [actionMessage, setActionMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Admission Staff");
  const needle = search.trim().toLowerCase();

  const filteredUsers = useMemo(
    () => users.filter((row) => [row.name, row.email, row.role, row.access, row.status].some((value) => value.toLowerCase().includes(needle))),
    [needle, users],
  );
  const filteredPermissions = useMemo(
    () => permissionRows.filter((row) => [row.module, row.owner, row.access, row.status].some((value) => value.toLowerCase().includes(needle))),
    [needle, permissionRows],
  );
  const filteredInvitations = useMemo(
    () => invitationRows.filter((row) => [row.email, row.role, row.invitedBy, row.status].some((value) => value.toLowerCase().includes(needle))),
    [needle, invitationRows],
  );

  function openAction(action: ActiveAction, record: AdminRecord) {
    setActiveAction(action);
    setActiveRecord(record);
    setEditForm(Object.fromEntries(Object.entries(record).map(([key, value]) => [key, String(value)])));
    setActionMessage(action === "edit" ? `Editing ${recordTitle(record)}` : `Viewing ${recordTitle(record)}`);
  }

  function removeRecord(id: string) {
    if (!window.confirm("Remove this record from the table?")) return;
    if (activeSubtab === "Admin Users") setUsers((current) => current.filter((row) => row.id !== id));
    if (activeSubtab === "Permissions") setPermissionRows((current) => current.filter((row) => row.id !== id));
    if (activeSubtab === "Invitations") setInvitationRows((current) => current.filter((row) => row.id !== id));
    if (activeRecord?.id === id) setActiveRecord(null);
    setActionMessage("Record removed");
  }

  function sendInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviteEmail.trim() || !inviteRole.trim()) return;
    const nextInvitation: Invitation = {
      id: `INV-${Date.now().toString().slice(-5)}`,
      email: inviteEmail.trim(),
      role: inviteRole.trim(),
      invitedBy: "Institute Admin",
      status: "Sent",
    };
    setInvitationRows((current) => [nextInvitation, ...current]);
    setInviteEmail("");
    setInviteRole("Admission Staff");
    setActionMessage(`Invitation sent to ${nextInvitation.email}`);
  }

  function resendInvitation(row: Invitation) {
    setInvitationRows((current) => current.map((item) => item.id === row.id ? { ...item, status: "Sent" } : item));
    setActionMessage(`Invitation resent to ${row.email}`);
  }

  function cancelInvitation(id: string) {
    setInvitationRows((current) => current.map((row) => row.id === id ? { ...row, status: "Expired" } : row));
    setActionMessage("Invitation cancelled");
  }

  function saveEdit() {
    if (!activeRecord) return;
    if ("name" in activeRecord) {
      setUsers((current) => current.map((row) => row.id === activeRecord.id ? { ...row, ...editForm, status: editForm.status as AdminUser["status"] } : row));
    }
    if ("module" in activeRecord) {
      setPermissionRows((current) => current.map((row) => row.id === activeRecord.id ? { ...row, ...editForm, status: editForm.status as PermissionRow["status"] } : row));
    }
    if ("email" in activeRecord && "invitedBy" in activeRecord) {
      setInvitationRows((current) => current.map((row) => row.id === activeRecord.id ? { ...row, ...editForm, status: editForm.status as Invitation["status"] } : row));
    }
    setActiveRecord(null);
    setActionMessage("Record updated");
  }

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Admin Users", value: users.length, icon: Users },
          { label: "Permission Sets", value: permissionRows.length, icon: ShieldCheck },
          { label: "Open Invitations", value: invitationRows.filter((row) => row.status === "Sent").length, icon: UserPlus },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <AdminToolbar activeSubtab={activeSubtab} search={search} actionMessage={actionMessage} onSearch={setSearch} />
        {activeSubtab === "Invitations" ? (
          <form onSubmit={sendInvitation} className="grid grid-cols-1 gap-3 border-b border-gray-200 bg-white p-5 md:grid-cols-[1fr_240px_auto]">
            <label className="block">
              <span className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</span>
              <input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary"
                placeholder="name@campusone.edu"
                type="email"
              />
            </label>
            <label className="block">
              <span className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</span>
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary"
              >
                <option>Admission Staff</option>
                <option>Payroll Clerk</option>
                <option>Records Assistant</option>
                <option>Registrar</option>
                <option>Finance Admin</option>
              </select>
            </label>
            <button className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary/90" type="submit">
              <MailPlus className="h-4 w-4" />
              Send Invitation
            </button>
          </form>
        ) : null}
        {activeSubtab === "Permissions" ? <PermissionsTable rows={filteredPermissions} onView={(row) => openAction("view", row)} onEdit={(row) => openAction("edit", row)} onRemove={removeRecord} /> : null}
        {activeSubtab === "Invitations" ? <InvitationsTable rows={filteredInvitations} onView={(row) => openAction("view", row)} onResend={resendInvitation} onCancel={cancelInvitation} onRemove={removeRecord} /> : null}
        {activeSubtab === "Admin Users" ? <AdminUsersTable rows={filteredUsers} onView={(row) => openAction("view", row)} onEdit={(row) => openAction("edit", row)} onRemove={removeRecord} /> : null}
      </div>

      {activeRecord ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{activeAction === "edit" ? "Edit Record" : "View Record"}</p>
                <h3 className="mt-1 text-xl font-black text-gray-900">{recordTitle(activeRecord)}</h3>
              </div>
              <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50" onClick={() => setActiveRecord(null)} type="button">
                Close
              </button>
            </div>

            {activeAction === "view" ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(activeRecord).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{key}</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveEdit();
                }}
              >
                {Object.entries(editForm).map(([key, value]) => (
                  <label key={key} className="block">
                    <span className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{key}</span>
                    <input
                      value={value}
                      onChange={(event) => setEditForm((current) => ({ ...current, [key]: event.target.value }))}
                      readOnly={key === "id"}
                      className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-primary disabled:bg-gray-50 read-only:bg-gray-50"
                    />
                  </label>
                ))}
                <div className="flex justify-end gap-3 pt-2">
                  <button className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => setActiveRecord(null)} type="button">
                    Cancel
                  </button>
                  <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90" type="submit">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
