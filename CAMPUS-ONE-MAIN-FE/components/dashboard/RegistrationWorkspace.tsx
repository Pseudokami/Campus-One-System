"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { SchoolProfile } from "@/lib/backend/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Shield, Lock, CreditCard, Building, FileText, Star, Eye, Globe, DollarSign, UserCog } from "lucide-react";

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
    const response = await fetch("/api/school");
    if (!response.ok) { setMessage(""); return; }
    const data = await response.json();
    setSchool({
      id: data.id ?? "school-demo",
      name: data.name ?? "",
      representative: data.representative ?? "",
      email: data.email ?? "",
      contactNumber: data.contact_number ?? "",
      schoolType: data.school_type ?? "",
      targetSubdomain: data.target_subdomain ?? "",
      status: data.status ?? "draft",
      setupProgress: data.setup_progress ?? 0,
    });
    setMessage("");
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
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving registration details...");
    const response = await fetch("/api/school", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(school),
    });
    if (response.ok) {
      const data = await response.json();
      setSchool({
        id: data.id ?? school.id,
        name: data.name ?? "",
        representative: data.representative ?? "",
        email: data.email ?? "",
        contactNumber: data.contact_number ?? "",
        schoolType: data.school_type ?? "",
        targetSubdomain: data.target_subdomain ?? "",
        status: data.status ?? "draft",
        setupProgress: data.setup_progress ?? 0,
      });
      setMessage("Profile updated successfully.");
    } else {
      setMessage("Failed to save. Please try again.");
    }
  }

  return (
    <form className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">General Settings</p>
        <h2 className="mt-2 text-2xl font-black text-gray-900 tracking-tight uppercase">Update Profile</h2>
        <p className="mt-2 text-[13px] text-gray-500 font-medium max-w-lg">
          Complete your institute's basic identification details.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center">
            <Building className="w-10 h-10 text-primary/40" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-2">Institute Logo*</p>
            <button type="button" className="bg-primary text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider">Change Logo</button>
          </div>
        </div>
        {fields.map((field) => (
          <label key={field.key} className="block group">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-primary transition-colors">{field.label}*</span>
            <input
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#F59E0B] focus:ring-4 focus:ring-primary/10 placeholder:text-gray-500/20"
              onChange={(event) => setSchool((current: any) => ({ ...current, [field.key]: event.target.value }))}
              placeholder={field.placeholder}
              type="text"
              value={school[field.key]}
            />
          </label>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest italic">{message}</p>
        <button className="rounded-xl bg-primary px-8 py-3.5 text-[13px] font-black text-white hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-widest" type="submit">
          Update Profile
        </button>
      </div>
    </form>
  );
}

function FeesParticularsView() {
  const rows = Array.from({ length: 9 });
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Settings</p>
        <h2 className="mt-2 text-2xl font-black text-gray-900 tracking-tight uppercase">Change Fee Particulars</h2>
      </div>
      <div className="space-y-4">
        {rows.map((_, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="flex-1">
              <div className="bg-primary/10 inline-block px-3 py-1 rounded-t-lg border-x border-t border-primary/20">
                <span className="text-[9px] font-black uppercase text-primary tracking-widest">Particular Label*</span>
              </div>
              <input
                className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
            <div className="w-40">
              <div className="bg-white/5 inline-block px-3 py-1 rounded-t-lg border-x border-t border-gray-200">
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Prefix Amount*</span>
              </div>
              <input
                className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountsFeesInvoiceView() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm h-fit">
        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-8 text-center">Add New Bank</h2>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 mb-8">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
               <Plus className="w-6 h-6 text-gray-500" />
             </div>
             <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest">Choose Logo</button>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Max size 500kb</p>
          </div>
          {["Bank Name", "Bank/Branch Address", "Account Number", "Instructions"].map((label) => (
            <label key={label} className="block">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest px-1">{label}*</span>
              {label === "Instructions" ? (
                <textarea className="mt-2 h-32 w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:border-[#F59E0B]" placeholder="Write instructions..." />
              ) : (
                <input className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-[#F59E0B]" placeholder={`Your ${label}`} />
              )}
            </label>
          ))}
          <button className="w-full bg-primary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-4">
            <Plus className="w-4 h-4" /> Add Bank
          </button>
        </div>
      </div>
      
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm h-fit">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
           <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest">Active Bank Accounts</h3>
           <div className="flex items-center gap-2">
             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Show</span>
             <select className="bg-white border border-gray-200 rounded-lg text-[10px] px-2 py-1 outline-none text-gray-900 font-bold">
               <option>10</option>
             </select>
           </div>
        </div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Bank Name</th>
              <th className="px-6 py-4">Logo</th>
              <th className="px-6 py-4">Account No.</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="bg-gray-50">
              <td colSpan={4} className="px-6 py-20 text-center text-gray-500 uppercase font-bold tracking-widest opacity-30">No data available in table</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RulesRegulationsView() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Institute Rules & Regulations</h2>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> <span className="text-[10px] font-bold text-gray-500 uppercase">Required</span></div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /> <span className="text-[10px] font-bold text-gray-500 uppercase">Optional</span></div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-inner">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-4">
           <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
             <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center font-bold text-gray-900">B</button>
             <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center italic text-gray-900">I</button>
             <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center underline text-gray-900">U</button>
           </div>
           <div className="flex items-center gap-2">
             <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center"><FileText className="w-4 h-4 text-gray-900" /></button>
             <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center"><Star className="w-4 h-4 text-gray-900" /></button>
           </div>
        </div>
        <textarea 
          className="w-full h-96 bg-transparent p-8 text-gray-500 outline-none resize-none font-medium text-base"
          placeholder="Type institute rules and regulations here..."
        />
      </div>
      <button className="mt-8 bg-primary text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">Save Changes</button>
    </div>
  );
}

function MarksGradingView() {
  const rows = Array.from({ length: 7 });
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Customize Grading</h2>
        <div className="mt-4 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> <span className="text-[10px] font-bold text-gray-500 uppercase">Required</span></div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /> <span className="text-[10px] font-bold text-gray-500 uppercase">Optional</span></div>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {rows.map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr] gap-4 items-end group">
             <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-t-md ml-1">Grade*</span>
                <input className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold" />
             </div>
             <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-t-md ml-1">% From*</span>
                <input className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold" />
             </div>
             <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-t-md ml-1">% Upto*</span>
                <input className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold" />
             </div>
             <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-t-md ml-1">Status*</span>
                <input className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 font-bold" />
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-center gap-4">
        <button className="bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-[#111] transition-all">
          <Plus className="w-4 h-4" /> Add More Option
        </button>
        <button className="bg-white/5 text-gray-900 border border-gray-200 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all">
          <Trash2 className="w-4 h-4" /> Remove
        </button>
      </div>
      
      <div className="mt-10 flex justify-center">
        <button className="bg-primary text-white px-12 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">Save Changes</button>
      </div>
    </div>
  );
}

function AccountSettingsView() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-10 flex items-center gap-4">
           <UserCog className="w-6 h-6 text-primary" />
           <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Account Settings</h2>
        </div>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 bg-primary/10 py-1 rounded-t-lg border-x border-t border-primary/20">Username*</span>
              <input className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all" />
            </label>

            <label className="block">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 bg-primary/10 py-1 rounded-t-lg border-x border-t border-primary/20">Password*</span>
              <div className="relative">
                <input type="password" className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all pr-12" />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </label>

            <label className="block">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 bg-primary/10 py-1 rounded-t-lg border-x border-t border-primary/20">TimeZone*</span>
              <select className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all appearance-none">
                <option value="">Select timezone</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-6">
               <label className="block">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 bg-primary/10 py-1 rounded-t-lg border-x border-t border-primary/20">Currency*</span>
                <select className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all appearance-none">
                  <option value="">Select currency</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 bg-primary/10 py-1 rounded-t-lg border-x border-t border-primary/20">Symbol*</span>
                <input className="h-12 w-full rounded-b-xl rounded-tr-xl border border-gray-200 bg-white px-5 text-sm text-gray-900 outline-none focus:border-[#F59E0B] transition-all" />
              </label>
            </div>
          </div>
          
          <button className="w-full bg-primary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2">
            <Globe className="w-4 h-4" /> Update Settings
          </button>
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
                { label: "Username", value: "—" },
                { label: "Password", value: "—", isPassword: true },
                { label: "Subscription", value: "—", isBadge: true },
                { label: "Expiry", value: "—" },
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
                    {item.isPassword && <Eye className="w-3.5 h-3.5 text-gray-500 opacity-50" />}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Need help with your account?</p>
           <button className="mt-4 text-[12px] font-black text-primary uppercase tracking-widest hover:underline">Contact Support</button>
        </div>
      </div>
    </div>
  );
}
