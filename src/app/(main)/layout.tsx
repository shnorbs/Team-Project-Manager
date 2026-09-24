"use client";

import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, checked } = useRequireAuth();

  if (!checked) return null;

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">
      <TopBar user={user} />
      {children}
    </div>
  );
}
