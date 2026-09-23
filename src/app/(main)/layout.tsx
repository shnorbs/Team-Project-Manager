"use client";

import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, checked } = useRequireAuth();

  if (!checked) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar user={user} />
      {children}
    </div>
  );
}
