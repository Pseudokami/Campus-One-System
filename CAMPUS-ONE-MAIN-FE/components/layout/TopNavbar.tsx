"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const [instituteName, setInstituteName] = useState<string>("Institute Name");

  useEffect(() => {
    fetch("/api/school")
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) setInstituteName(data.name);
      })
      .catch(() => {});
  }, []);

  return (
    <header className={cn("bg-white/80 backdrop-blur-sm border-b border-gray-200 h-20 flex items-center justify-end px-10 flex-shrink-0 shadow-sm sticky top-0 z-30", className)}>
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-10 w-px bg-gray-200"></div>
        <span className="font-semibold text-sm text-gray-900">{instituteName}</span>
      </div>
    </header>
  );
}
