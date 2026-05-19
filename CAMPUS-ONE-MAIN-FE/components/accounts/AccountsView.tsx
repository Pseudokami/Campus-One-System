"use client";

import { useState, useEffect } from "react";

type HeadType = "Income" | "Expense" | "";

interface ChartHead {
  id: string;
  name: string;
  type: HeadType;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  kind: "income" | "expense";
}

/* ── Shared card wrapper ── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ── Form field components ── */
function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="relative w-full">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400"
      />
    </div>
  );
}

function FloatingSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="relative w-full">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none"
      >
        <option value="">Select*</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

/* ── Submit button ── */
function SubmitBtn({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="mt-6 flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-500 hover:scale-[1.02] active:scale-[0.98]"
    >
      <span className="text-lg leading-none">+</span> {label}
    </button>
  );
}

/* ══════════════════════════════════════════════
   1. CHART OF ACCOUNT
══════════════════════════════════════════════ */
function ChartOfAccount({ heads, onAdd, onDelete }: { heads: ChartHead[], onAdd: (h: ChartHead) => void, onDelete: (id: string) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<HeadType>("");
  const [search, setSearch] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !type) return;
    onAdd({ id: crypto.randomUUID(), name, type });
    setName("");
    setType("");
  }

  const filtered = heads.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      {/* Form */}
      <Card className="p-6 h-fit sticky top-32">
        <h2 className="text-center text-xl font-bold text-gray-900 mb-6">Add chart of accounts</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput label="Head Name" value={name} onChange={setName} placeholder="Name Of Head*" required />
          <FloatingSelect label="Head Type" value={type} onChange={(v) => setType(v as HeadType)} options={["Income", "Expense"]} required />
          <SubmitBtn label="Save Head" />
        </form>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Show</span>
            <select className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Search:</label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-800 outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Name Of Head</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400 text-sm italic">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filtered.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{h.name}</td>
                    <td className="px-6 py-4 text-gray-600">{h.type}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onDelete(h.id)}
                        className="text-red-400 hover:text-red-600 text-[12px] font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[12px] text-gray-500">
            Showing {filtered.length === 0 ? "0 to 0 of 0" : `1 to ${filtered.length} of ${filtered.length}`} entries
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100">Previous</button>
            <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   2. ADD INCOME
══════════════════════════════════════════════ */
function AddIncome({ onAdd }: { onAdd: (t: Transaction) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !amount) return;
    onAdd({ id: crypto.randomUUID(), date, description, amount: parseFloat(amount), kind: "income" });
    setDate(today);
    setDescription("");
    setAmount("");
    alert("Income added successfully!");
  }

  return (
    <div className="flex justify-center">
      <Card className="p-8 w-full max-w-2xl">
        <h2 className="text-center text-xl font-bold text-gray-900 mb-8">Add income</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput label="Date" value={date} onChange={setDate} type="date" required />
          <FloatingInput label="Description" value={description} onChange={setDescription} placeholder="Income Description" required />
          <FloatingInput label="Amount" value={amount} onChange={setAmount} placeholder="Income Amount" type="number" required />
          <div className="flex justify-center">
            <SubmitBtn label="Add Income" />
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   3. ADD EXPENSE
══════════════════════════════════════════════ */
function AddExpense({ onAdd }: { onAdd: (t: Transaction) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !amount) return;
    onAdd({ id: crypto.randomUUID(), date, description, amount: parseFloat(amount), kind: "expense" });
    setDate(today);
    setDescription("");
    setAmount("");
    alert("Expense added successfully!");
  }

  return (
    <div className="flex justify-center">
      <Card className="p-8 w-full max-w-2xl">
        <h2 className="text-center text-xl font-bold text-gray-900 mb-8">Add expense</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput label="Date" value={date} onChange={setDate} type="date" required />
          <FloatingInput label="Description" value={description} onChange={setDescription} placeholder="Expense Description" required />
          <FloatingInput label="Amount" value={amount} onChange={setAmount} placeholder="Expense Amount" type="number" required />
          <div className="flex justify-center">
            <SubmitBtn label="Add Expense" />
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════
   4. ACCOUNT STATEMENT
══════════════════════════════════════════════ */
function AccountStatement({ transactions, onReset }: { transactions: Transaction[], onReset: () => void }) {
  const [search, setSearch] = useState("");
  const [showRefs, setShowRefs] = useState(false);

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const today = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const filtered = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  let runningBalance = 0;
  const rows = filtered.map(t => {
    runningBalance += (t.kind === "income" ? t.amount : -t.amount);
    return { ...t, runningBalance };
  });

  const totalCredit = filtered.filter(t => t.kind === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalDebt = filtered.filter(t => t.kind === "expense").reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalCredit - totalDebt;

  return (
    <Card className="overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-100">
        {/* Date range */}
        <button className="flex items-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {firstOfMonth} – {today}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <div
              onClick={() => setShowRefs((v) => !v)}
              className={`h-4 w-4 rounded-full border-2 transition ${showRefs ? "border-primary bg-primary" : "border-gray-300 bg-white"}`}
            />
            Show References
          </label>
          <button onClick={onReset} className="flex items-center gap-2 rounded-xl border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
            </svg>
            Reset Profit
          </button>
          <button onClick={onReset} className="flex items-center gap-2 rounded-xl border border-red-400 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
            Delete All
          </button>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          {["Copy", "CSV", "Excel", "PDF", "Print"].map((btn) => (
            <button
              key={btn}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              {btn}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Search:</label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-800 outline-none focus:border-primary w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Debt</th>
              <th className="px-6 py-4">Credit</th>
              <th className="px-6 py-4">Net Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm italic">
                  No data available in table
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{row.date}</td>
                  <td className="px-6 py-4 text-gray-600">{row.description}</td>
                  <td className="px-6 py-4 text-gray-600">{row.kind === "expense" ? `$${row.amount.toFixed(2)}` : "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{row.kind === "income" ? `$${row.amount.toFixed(2)}` : "-"}</td>
                  <td className={`px-6 py-4 font-bold ${row.runningBalance >= 0 ? "text-green-600" : "text-red-500"}`}>
                    ${row.runningBalance.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="border-t border-gray-200 bg-gray-50 font-bold text-gray-700 text-sm">
            <tr>
              <td className="px-6 py-3" />
              <td className="px-6 py-3" />
              <td className="px-6 py-3">${totalDebt.toFixed(2)}</td>
              <td className="px-6 py-3">${totalCredit.toFixed(2)}</td>
              <td className={`px-6 py-3 ${netBalance >= 0 ? "text-green-600" : "text-red-500"}`}>${netBalance.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="px-6 py-3 text-[12px] text-gray-400 border-t border-gray-100">
        Showing {rows.length === 0 ? "0 to 0 of 0" : `1 to ${rows.length} of ${rows.length}`} entries
      </p>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   ROOT EXPORT — switches on activeSubtab
══════════════════════════════════════════════ */
export function AccountsView({ activeSubtab }: { activeSubtab: string }) {
  const [heads, setHeads] = useState<ChartHead[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedHeads = localStorage.getItem("campus_heads");
    const storedTx = localStorage.getItem("campus_tx");
    if (storedHeads) setHeads(JSON.parse(storedHeads));
    if (storedTx) setTransactions(JSON.parse(storedTx));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("campus_heads", JSON.stringify(heads));
      localStorage.setItem("campus_tx", JSON.stringify(transactions));
    }
  }, [heads, transactions, isLoaded]);

  function handleAddHead(h: ChartHead) {
    setHeads(prev => [...prev, h]);
  }
  function handleDeleteHead(id: string) {
    setHeads(prev => prev.filter(h => h.id !== id));
  }
  function handleAddTransaction(t: Transaction) {
    setTransactions(prev => [...prev, t]);
  }
  function handleReset() {
    if (confirm("Are you sure you want to delete all transactions?")) {
      setTransactions([]);
    }
  }

  if (!isLoaded) return null; // prevent hydration mismatch

  switch (activeSubtab) {
    case "Chart Of Account":
      return <ChartOfAccount heads={heads} onAdd={handleAddHead} onDelete={handleDeleteHead} />;
    case "Add Income":
      return <AddIncome onAdd={handleAddTransaction} />;
    case "Add Expense":
      return <AddExpense onAdd={handleAddTransaction} />;
    case "Account Statement":
      return <AccountStatement transactions={transactions} onReset={handleReset} />;
    default:
      return <ChartOfAccount heads={heads} onAdd={handleAddHead} onDelete={handleDeleteHead} />;
  }
}
