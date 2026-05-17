"use client";

import { cn } from "@/lib/utils";

type SubtabPanelProps = {
  parent: string;
  active: string;
  description: string;
};

export function SubtabPanel({ parent, active, description }: SubtabPanelProps) {
  return (
    <section className="bg-amber-50 rounded-2xl border border-amber-200 px-8 py-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">
        Selected subtab
      </p>
      <h2 className="mt-2 text-xl font-bold text-gray-900 tracking-tight">
        {parent} / {active}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 font-medium">{description}</p>
    </section>
  );
}
