"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const [instituteName, setInstituteName] = useState<string>("Institute Name");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch("/api/school", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) setInstituteName(data.name);
      })
      .catch(() => {});
  }, []);

  return (
    <header className={cn("bg-white/80 backdrop-blur-sm border-b border-gray-200 h-20 flex items-center justify-end px-10 flex-shrink-0 shadow-sm sticky top-0 z-30", className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">1 New</span>
              </div>
              <div className="p-0 max-h-[300px] overflow-y-auto">
                <div className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors">
                  <p className="text-sm font-medium text-gray-900">Welcome to Campus One!</p>
                  <p className="text-xs text-gray-500 mt-1">Please complete your institute profile to get started.</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Just now</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-xs font-bold text-primary hover:underline">Mark all as read</button>
              </div>
            </div>
          )}
        </div>
        <div className="h-10 w-px bg-gray-200"></div>
        <span className="font-semibold text-sm text-gray-900">{instituteName}</span>
      </div>
    </header>
  );
}
