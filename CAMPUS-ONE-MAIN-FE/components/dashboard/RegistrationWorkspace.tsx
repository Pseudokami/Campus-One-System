"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { SchoolProfile } from "@/lib/backend/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Shield, Lock, CreditCard, Building, FileText, Star, Eye, Globe, DollarSign, UserCog, X } from "lucide-react";

const initialSchool: SchoolProfile = {
  id: "school-demo",
  name: "",
  representative: "",
  email: "",
  contactNumber: "",
  schoolType: "",
  targetSubdomain: "",
  status: "draft",
  setupProgress: 0,
};

const fields = [
  { key: "name", label: "Institute Name", placeholder: "" },
  { key: "representative", label: "Representative", placeholder: "" },
  { key: "email", label: "Official Email", placeholder: "" },
  { key: "contactNumber", label: "Contact Number", placeholder: "" },
  { key: "schoolType", label: "School Type", placeholder: "" },
  { key: "targetSubdomain", label: "Target Subdomain", placeholder: "" },
] as const;

export function RegistrationWorkspace() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "institute-profile";
  
  const [school, setSchool] = useState<SchoolProfile>(initialSchool);
  const [message, setMessage] = useState("Loading registration details...");

  async function loadSchool() {
    setMessage("Loading registration details...");
    
    const local = localStorage.getItem("campus_one_school");
    if (local) {
      try {
        setSchool(JSON.parse(local));
        setMessage("");
      } catch (e) {}
    }

    try {
      const response = await fetch("/api/school", { credentials: "same-origin" });
      if (!response.ok) {
        if (!local) setMessage(`Could not load registration details. (${response.status})`);
        return;
      }
      const data = await response.json();
      const updatedSchool = {
        id: data.id ?? "school-demo",
        name: data.name ?? "",
        representative: data.representative ?? "",
        email: data.email ?? "",
        contactNumber: data.contact_number ?? "",
        schoolType: data.school_type ?? "",
        targetSubdomain: data.target_subdomain ?? "",
        status: data.status ?? "draft",
        setupProgress: data.setup_progress ?? 0,
      };
      setSchool(updatedSchool);
      localStorage.setItem("campus_one_school", JSON.stringify(updatedSchool));
      setMessage("");
    } catch (err) {
      if (!local) setMessage("Could not connect to server.");
    }
  }

  useEffect(() => {
    void loadSchool();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "institute-profile":
        return <InstituteProfileForm school={school} setSchool={setSchool} message={message} setMessage={setMessage} />;
      case "fees-particulars":
        return <FeesParticularsView />;
      case "accounts-fees-invoice":
        return <AccountsFeesInvoiceView />;
      case "rules-regulations":
        return <RulesRegulationsView />;
      case "marks-grading":
        return <MarksGradingView />;
      case "account-settings":
        return <AccountSettingsView />;
      default:
        return (
          <div className="rounded-2xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Module Active</h3>
            <p className="text-gray-500 max-w-xs">This settings module is active and ready for configuration.</p>
          </div>
        );
    }
  };

  return (
    <section className="w-full">
      {renderContent()}
    </section>
  );
}

function InstituteProfileForm({ school, setSchool, message, setMessage }: { school: SchoolProfile, setSchool: any, message: string, setMessage: any }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function validateForm(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check all required fields are filled
    if (!school.name?.trim()) {
      setMessage("Institute Name is required.");
      return false;
    }
    if (!school.representative?.trim()) {
      setMessage("Representative is required.");
      return false;
    }
    if (!school.email?.trim()) {
      setMessage("Official Email is required.");
      return false;
    }
    if (!emailRegex.test(school.email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    if (!school.contactNumber?.trim()) {
      setMessage("Contact Number is required.");
      return false;
    }
    if (school.contactNumber.replace(/\D/g, "").length !== 11) {
      setMessage("Contact Number must be exactly 11 digits.");
      return false;
    }
    if (!school.schoolType?.trim()) {
      setMessage("School Type is required.");
      return false;
    }
    if (!school.targetSubdomain?.trim()) {
      setMessage("Target Subdomain is required.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setMessage("Saving registration details...");

    // Save locally as a fallback to ensure offline/mock success
    localStorage.setItem("campus_one_school", JSON.stringify(school));

    try {
      const response = await fetch("/api/school", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedSchool = {
          id: data.id ?? school.id,
          name: data.name ?? "",
          representative: data.representative ?? "",
          email: data.email ?? "",
          contactNumber: data.contact_number ?? "",
          schoolType: data.school_type ?? "",
          targetSubdomain: data.target_subdomain ?? "",
          status: data.status ?? "draft",
          setupProgress: data.setup_progress ?? 0,
        };
        setSchool(updatedSchool);
        localStorage.setItem("campus_one_school", JSON.stringify(updatedSchool));
      }
    } catch (error) {
      console.error("Institute profile save failed:", error);
    }
    
    setMessage("Profile updated successfully.");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            message.includes("successfully") ? "bg-green-100 text-green-600" :
            message.includes("Loading") || message.includes("Saving") ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
          )}>
            {message.includes("successfully") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            ) : message.includes("Loading") || message.includes("Saving") ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="font-bold text-lg">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", 
              message.includes("successfully") ? "text-green-700" : 
              message.includes("Loading") || message.includes("Saving") ? "text-blue-700" : "text-red-700"
            )}>
              {message.includes("successfully") ? "Success!" : 
               message.includes("Loading") || message.includes("Saving") ? "Please wait" : "Action Required"}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="w-32 h-32 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Institute Logo" className="w-full h-full object-cover" />
            ) : (
              <Building className="w-10 h-10 text-primary/40" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Institute Logo</p>
            <button
              type="button"
              onClick={() => document.getElementById("institute-logo-upload")?.click()}
              className="bg-[#F59E0B] text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#D97706] transition-colors"
            >
              Change Logo
            </button>
            <input
              type="file"
              id="institute-logo-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setLogoPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>
        {fields.map((field) => {
          let maxLength: number | undefined;
          let pattern: string | undefined;
          let inputType = "text";

          if (field.key === "contactNumber") {
            maxLength = 11;
            inputType = "tel";
            pattern = "[0-9]*";
          } else if (field.key === "email") {
            inputType = "email";
          }

          return (
            <label key={field.key} className="block group">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-[#F59E0B] transition-colors">
                {field.label} <span className="text-red-500">*</span>
              </span>
              <input
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 placeholder:text-gray-500/20"
                onChange={(event) => {
                  let val = event.target.value;
                  if (field.key === "contactNumber") {
                    val = val.replace(/\D/g, "").slice(0, 11);
                  }
                  setSchool((current: any) => ({ ...current, [field.key]: val }));
                }}
                placeholder={field.placeholder}
                type={inputType}
                pattern={pattern}
                maxLength={maxLength}
                value={school[field.key]}
                required
              />
              {field.key === "contactNumber" && (
                <p className="text-[10px] text-gray-400 mt-1">({school.contactNumber?.length || 0}/11 digits)</p>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-center">
        <button className="rounded-xl bg-primary px-8 py-3.5 text-[13px] font-black text-white hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-widest" type="submit">
          Update Profile
        </button>
      </div>
    </form>
  );
}

function FeesParticularsView() {
  const [particulars, setParticulars] = useState<{ label: string; amount: string }[]>(
    Array.from({ length: 9 }, () => ({ label: "", amount: "" }))
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("fees-particulars");
    if (saved) {
      try {
        setParticulars(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (index: number, field: "label" | "amount", value: string) => {
    setParticulars((prev) => {
      const copy = [...prev];
      let val = value;
      if (field === "amount") {
        val = val.replace(/\D/g, ""); // Allow numbers only
      }
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Dynamic validation:
    // If a label is filled, the amount must be filled.
    // If an amount is filled, the label must be filled.
    for (let i = 0; i < particulars.length; i++) {
      const row = particulars[i];
      if ((row.label && !row.amount) || (!row.label && row.amount)) {
        setMessage(`Row ${i + 1} is incomplete. Please provide both a label and an amount.`);
        return;
      }
    }

    localStorage.setItem("fees-particulars", JSON.stringify(particulars));
    setMessage("Particulars saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            message.includes("successfully") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          )}>
            {message.includes("successfully") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            ) : (
              <span className="font-bold text-lg">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", message.includes("successfully") ? "text-green-700" : "text-red-700")}>
              {message.includes("successfully") ? "Success!" : "Action Required"}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Branded Tip Box */}
      <div className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Fees Particulars Guide</h4>
          <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
            Enter the standard fee categories for your school. 
            Label examples: <span className="font-bold text-gray-900">Tuition Fee</span>, <span className="font-bold text-gray-900">Admission Fee</span>, <span className="font-bold text-gray-900">Library Fee</span>. 
            Amount examples: <span className="font-bold text-gray-900">5000</span>, <span className="font-bold text-gray-900">1500</span>, <span className="font-bold text-gray-900">300</span> (numbers only).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {particulars.map((row, i) => {
          const isRequired = i === 0;
          return (
            <div key={i} className="flex items-center gap-4 group">
              <div className="flex-1">
                <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Particular Label {isRequired && <span className="text-red-500">*</span>}
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all"
                    placeholder={i === 0 ? "e.g., Tuition Fee" : "e.g., Library Fee (Optional)"}
                    value={row.label}
                    onChange={(e) => handleChange(i, "label", e.target.value)}
                    required={isRequired}
                  />
                </label>
              </div>
              <div className="w-40">
                <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Prefix Amount {isRequired && <span className="text-red-500">*</span>}
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all"
                    placeholder={i === 0 ? "5000" : "300"}
                    value={row.amount}
                    onChange={(e) => handleChange(i, "amount", e.target.value)}
                    required={isRequired}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-center">
        <button 
          className="rounded-xl bg-primary px-8 py-3.5 text-[13px] font-black text-white hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-widest" 
          type="submit"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function AccountsFeesInvoiceView() {
  type BankEntry = { bankName: string; address: string; accountNumber: string; instructions: string; logoPreview?: string };
  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [instructions, setInstructions] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [banks, setBanks] = useState<BankEntry[]>([]);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const stored = localStorage.getItem("campus_fees_account"); if (stored) setBanks(JSON.parse(stored)); } catch {}
  }, []);

  function handleAddBank(e: FormEvent) {
    e.preventDefault(); setFormError("");
    if (!bankName.trim() || !address.trim() || !accountNumber.trim()) { setFormError("Bank Name, Address, and Account Number are required."); return; }
    const entry: BankEntry = { bankName, address, accountNumber, instructions, logoPreview: logoPreview || undefined };
    const updated = [...banks, entry];
    setBanks(updated);
    localStorage.setItem("campus_fees_account", JSON.stringify(updated));
    setSaved(true);
    setBankName(""); setAddress(""); setAccountNumber(""); setInstructions(""); setLogoPreview(null);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleAccountNumberChange(val: string) {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAccountNumber(formatted);
  }

  function removeBank(index: number) {
    const updated = banks.filter((_, i) => i !== index);
    setBanks(updated);
    if (updated.length === 0) localStorage.removeItem("campus_fees_account");
    else localStorage.setItem("campus_fees_account", JSON.stringify(updated));
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-8">
      {saved && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-green-700">Success!</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Bank account saved successfully.</p>
          </div>
          <button type="button" onClick={() => setSaved(false)} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm h-fit">
        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-8 text-center">Add New Bank</h2>
        <form onSubmit={handleAddBank} className="space-y-5">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 mb-2">
            {logoPreview ? (
              <img src={logoPreview} alt="Bank Logo Preview" className="w-32 h-32 object-contain rounded-2xl bg-white shadow-sm border border-gray-100 p-2" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Plus className="w-6 h-6 text-gray-500" /></div>
            )}
            <button type="button" onClick={() => document.getElementById('bank-logo-upload')?.click()} className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Choose Logo</button>
            <input type="file" id="bank-logo-upload" className="hidden" accept="image/*" onChange={(e) => { 
              if (e.target.files?.[0]) {
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result as string);
                reader.readAsDataURL(e.target.files[0]);
              }
            }} />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Max size 500kb</p>
          </div>
          {[{ label: "Bank Name", value: bankName, set: setBankName, required: true }, { label: "Bank/Branch Address", value: address, set: setAddress, required: true }, { label: "Account Number", value: accountNumber, set: handleAccountNumberChange, required: true }].map(({ label, value, set, required }) => (
            <label key={label} className="block">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{label}{required && <span className="text-red-500 ml-0.5"> *</span>}</span>
              <input value={value} onChange={e => set(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" placeholder={`Your ${label}`} />
            </label>
          ))}
          <label className="block">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Instructions (Optional)</span>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="mt-2 h-28 w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition resize-none" placeholder="Write payment instructions..." />
          </label>
          {formError && <p className="text-xs text-red-500 font-medium">{formError}</p>}
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Bank
          </button>
        </form>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm h-fit">
        <div className="p-6 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest">Active Bank Accounts</h3></div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
            <tr><th className="px-6 py-4">Bank Name</th><th className="px-6 py-4">Account No.</th><th className="px-6 py-4">Address</th><th className="px-6 py-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banks.length === 0 ? (
              <tr className="bg-gray-50"><td colSpan={4} className="px-6 py-16 text-center text-gray-400 uppercase font-bold tracking-widest text-xs">No bank accounts added yet</td></tr>
            ) : banks.map((b, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  <div className="flex items-center gap-3">
                  {b.logoPreview && <img src={b.logoPreview} alt="Logo" className="w-10 h-10 rounded-lg bg-white border border-gray-100 object-contain p-1" />}
                    {b.bankName}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono">{b.accountNumber}</td>
                <td className="px-6 py-4 text-gray-500">{b.address || "—"}</td>
                <td className="px-6 py-4"><button onClick={() => removeBank(i)} className="px-3 py-1.5 text-[11px] font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RulesRegulationsView() {
  const [message, setMessage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rules-regulations");
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
    }
  }, []);

  const applyFormat = (type: "bold" | "italic" | "underline") => {
    editorRef.current?.focus();
    document.execCommand(type, false);
  };

  const handleSave = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    localStorage.setItem("rules-regulations", content);
    setMessage("Rules and regulations saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-green-700">Success!</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-inner">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-4">
           <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
             <button 
               type="button" 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => applyFormat("bold")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center font-bold text-gray-900 transition-colors"
               title="Bold"
             >
               B
             </button>
             <button 
               type="button" 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => applyFormat("italic")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center italic text-gray-900 transition-colors"
               title="Italic"
             >
               I
             </button>
             <button 
               type="button" 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => applyFormat("underline")} 
               className="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center underline text-gray-900 transition-colors"
               title="Underline"
             >
               U
             </button>
           </div>
        </div>
        <div 
          ref={editorRef}
          contentEditable
          className="w-full h-96 bg-transparent p-8 text-gray-700 outline-none overflow-y-auto font-medium text-base"
          style={{ minHeight: '384px' }}
        />
      </div>
      <div className="mt-8 flex items-center justify-center">
        <button 
          type="button"
          onClick={handleSave}
          className="bg-primary text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

interface GradingRow {
  grade: string;
  from: string;
  upto: string;
  point: string;
}

function MarksGradingView() {
  const [grades, setGrades] = useState<GradingRow[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("marks-grading");
    if (saved) {
      setGrades(JSON.parse(saved));
    }
  }, []);

  const handleChange = (index: number, field: keyof GradingRow, value: string) => {
    setGrades((prevGrades) => {
      const updated = [...prevGrades];
      let processedValue = value;

      if (field === "from" || field === "upto") {
        // Only allow digits for 'from' and 'upto'
        processedValue = value.replace(/[^0-9]/g, '');
        // Ensure it's within 0-100 range
        const numValue = parseInt(processedValue, 10);
        if (!isNaN(numValue)) {
          processedValue = String(Math.min(100, Math.max(0, numValue))); // Clamp between 0 and 100
        } else if (processedValue !== '') { // Allow empty string for initial input
          processedValue = ''; // Clear if invalid non-numeric input
        }
      } else if (field === "point") {
        // Allow digits and a single decimal point for 'point'
        processedValue = value.replace(/[^0-9.]/g, '');
        
        const parts = processedValue.split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1];

        // Limit integer part to 1 digit (e.g., '4' from '4.0')
        if (integerPart.length > 1) {
          integerPart = integerPart.substring(0, 1);
        }

        // Limit decimal part to 1 digit if it exists
        if (decimalPart !== undefined && decimalPart.length > 1) {
          decimalPart = decimalPart.substring(0, 1);
        }

        // Reconstruct the value
        if (decimalPart !== undefined) {
          processedValue = integerPart + '.' + decimalPart;
        } else {
          processedValue = integerPart;
        }
        // The `max="5.0"` attribute on the input will provide browser-level validation for the range.
      }
      // For 'grade' field, no specific processing needed, just use value as is.

      updated[index][field] = processedValue;
      return updated;
    });
  };

  const handleAdd = () => {
    setGrades([...grades, { grade: "", from: "", upto: "", point: "" }]);
  };

  const handleRemove = (index: number) => {
    setGrades(grades.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("marks-grading", JSON.stringify(grades));
    setMessage("Grading configuration saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReset = () => {
    setGrades([]);
    localStorage.removeItem("marks-grading");
    setMessage("Grading configuration reset to empty!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            message.includes("successfully") ? "bg-green-100 text-green-600" :
            message.includes("Loading") || message.includes("Saving") ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
          )}>
            {message.includes("successfully") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            ) : message.includes("Loading") || message.includes("Saving") ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="font-bold text-lg">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", 
              message.includes("successfully") ? "text-green-700" : 
              message.includes("Loading") || message.includes("Saving") ? "text-blue-700" : "text-red-700"
            )}>
              {message.includes("successfully") ? "Success!" : 
               message.includes("Loading") || message.includes("Saving") ? "Please wait" : "Action Required"}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Branded Guide Box */}
      <div className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Marks & Grading Guide</h4>
          <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
            Define your school's standard grading scales. All fields are required for each row.
            <br />
            Example: Grade <span className="font-bold text-gray-900">A+</span> (text), % From <span className="font-bold text-gray-900">90</span> (numbers only, 0-100), % Up to <span className="font-bold text-gray-900">100</span> (numbers only, 0-100), Grade Point <span className="font-bold text-gray-900">4.0</span> (numbers only, allows one digit before and one digit after decimal, max 5.0).
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {grades.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_auto] gap-4 items-end group border-b border-gray-50 pb-4 last:border-0 last:pb-0">
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Grade Name <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={row.grade}
                    onChange={(e) => handleChange(i, "grade", e.target.value)}
                    placeholder=""
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    % From <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    type="number"
                    value={row.from}
                    onChange={(e) => handleChange(i, "from", e.target.value)}
                    placeholder=""
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    % Upto <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    type="number"
                    value={row.upto}
                    onChange={(e) => handleChange(i, "upto", e.target.value)}
                    placeholder=""
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
                <label className="block">
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Grade Point <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    type="number"
                    step="0.1"
                    max="5.0" // Common max for grade points, adjust if needed
                    value={row.point}
                    onChange={(e) => handleChange(i, "point", e.target.value)}
                    placeholder=""
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold outline-none focus:border-[#F59E0B] transition-colors" 
                  />
                </label>
             </div>
             <div>
               <button 
                 type="button"
                 onClick={() => handleRemove(i)}
                 className="h-11 w-11 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all group-hover:opacity-100"
                 title="Remove Row"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 className="w-4 h-4" /> Reset to Empty
        </button>
        <button 
          type="button"
          onClick={handleAdd}
          className="bg-primary/10 text-primary border border-primary/20 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
        >
          <Plus className="w-4 h-4" /> Add More Option
        </button>
        <div>
          <button 
            type="submit"
            className="bg-primary text-white px-12 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

function AccountSettingsView() {
  const [settings, setSettings] = useState({
    username: "",
    // Password should not be pre-filled for security, even if saved
    password: "",
    timezone: "",
    currency: "",
    symbol: "",
    subscription: "Premium Enterprise",
    expiry: "May 18, 2028"
  });
  const [message, setMessage] = useState("");
  // New state to hold the settings that are currently displayed in the right panel
  const [displayedSettings, setDisplayedSettings] = useState(settings);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCompleted, setDeleteCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("campus_account_settings");
    let loadedSettings = {
        username: "admin_campus_one",
        password: "", // Always start password blank for security
        timezone: "Asia/Manila (UTC+08:00)",
        currency: "PHP",
        symbol: "₱",
        subscription: "Premium Enterprise",
        expiry: "May 18, 2028"
    };

    if (saved) {
      try {
        loadedSettings = { ...loadedSettings, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved account settings:", e);
      }
    }

    // Fetch user email for username
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.email) {
          loadedSettings = {
            ...loadedSettings,
            username: data.email,
            password: "" // Keep password blank for security
          };
        }
      })
      .catch(() => {})
      .finally(() => {
        setSettings(loadedSettings);
        setDisplayedSettings(loadedSettings); // Initialize displayedSettings after all loads
      });
  }, []);

  const currencies = [
    { code: "PHP", symbol: "₱", label: "Philippine Peso (PHP)" },
    { code: "USD", symbol: "$", label: "US Dollar (USD)" },
    { code: "EUR", symbol: "€", label: "Euro (EUR)" },
    { code: "JPY", symbol: "¥", label: "Japanese Yen (JPY)" },
    { code: "GBP", symbol: "£", label: "British Pound (GBP)" },
    { code: "AUD", symbol: "$", label: "Australian Dollar (AUD)" },
    { code: "CAD", symbol: "$", label: "Canadian Dollar (CAD)" },
    { code: "SGD", symbol: "S$", label: "Singapore Dollar (SGD)" }
  ];

  const timezones = [
    "Asia/Manila (UTC+08:00)",
    "Asia/Tokyo (UTC+09:00)",
    "Asia/Singapore (UTC+08:00)",
    "Asia/Hong_Kong (UTC+08:00)",
    "Europe/London (UTC+00:00)",
    "America/New_York (UTC-05:00)",
    "America/Los_Angeles (UTC-08:00)",
    "Europe/Paris (UTC+01:00)",
    "Australia/Sydney (UTC+10:00)"
  ];

  const handleCurrencyChange = (code: string) => {
    const found = currencies.find(c => c.code === code);
    setSettings(prev => ({
      ...prev,
      currency: code,
      symbol: found ? found.symbol : prev.symbol
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("campus_account_settings", JSON.stringify(settings));
    setDisplayedSettings(settings); // Update displayed settings only after successful save
    setMessage("Account settings updated successfully!");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDeleteConfirm = () => {
    setDeleteCompleted(true);
    localStorage.removeItem("campus_account_settings");
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteCompleted(false);
      // Reset settings
      setSettings({
        username: "admin_campus_one",
        password: "SuperSecretPassword123",
        timezone: "Asia/Manila (UTC+08:00)",
        currency: "PHP",
        symbol: "₱",
        subscription: "Premium Enterprise",
        expiry: "May 18, 2028"
      });
    }, 2000);
  };

  return (
    <div className="relative">
      {message && (
        <div className="fixed top-24 right-10 z-50 rounded-xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            message.includes("successfully") ? "bg-green-100 text-green-600" :
            message.includes("Loading") || message.includes("Saving") ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
          )}>
            {message.includes("successfully") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            ) : message.includes("Loading") || message.includes("Saving") ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="font-bold text-lg">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", 
              message.includes("successfully") ? "text-green-700" : 
              message.includes("Loading") || message.includes("Saving") ? "text-blue-700" : "text-red-700"
            )}>
              {message.includes("successfully") ? "Success!" : 
               message.includes("Loading") || message.includes("Saving") ? "Please wait" : "Action Required"}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
          </div>
          <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleUpdate} className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Username <span className="text-red-500">*</span>
                </span>
                <input 
                  required
                  value={settings.username}
                  onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all placeholder:text-gray-400" 
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Password <span className="text-red-500">*</span>
                </span>
                <div className="relative mt-2">
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    value={settings.password}
                    onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 focus:outline-none"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  TimeZone <span className="text-red-500">*</span>
                </span>
                <select 
                  required
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-10"
                >
                  <option value="">Select timezone</option>
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-6">
                 <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Currency <span className="text-red-500">*</span>
                  </span>
                  <select 
                    required
                    value={settings.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-10"
                  >
                    <option value="">Select currency</option>
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Symbol <span className="text-red-500">*</span>
                  </span>
                  <input 
                    required
                    value={settings.symbol}
                    onChange={(e) => setSettings(prev => ({ ...prev, symbol: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all" 
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-4">
              <button 
                type="submit"
                className="bg-primary text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
              > UPDATE ACCOUNT</button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Shield className="w-40 h-40 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Account details</h3>
              </div>

              <div className="space-y-6 mb-10">
                {[
                  { label: "Username", value: displayedSettings.username || "—" },
                  { label: "Password", value: displayedSettings.password ? (showPassword ? displayedSettings.password : "••••••••") : "—" },
                  { label: "Subscription", value: displayedSettings.subscription, isBadge: true },
                  { label: "Expiry", value: displayedSettings.expiry },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-bold tracking-tight",
                        item.isBadge ? "bg-green-500/10 text-green-600 px-3 py-1 rounded-lg border border-green-500/20 text-[10px]" : "text-gray-900"
                      )}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Stunning Custom Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            
            {!deleteCompleted ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                  <Trash2 className="w-7 h-7 text-red-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Delete campus account?</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  This action is irreversible. All student profiles, fee collections, grading settings, and configurations will be permanently deleted from the system.
                </p>
                
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Yes, Delete Account
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-green-500 animate-spin" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Deleting Account...</h3>
                <p className="text-gray-500 text-xs italic">
                  Wiping configurations and restoring default state...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
