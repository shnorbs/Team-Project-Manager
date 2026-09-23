"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logOut } from "@/lib/auth";
import { User } from "@/types/users.types";

export default function TopBar({ user }: { user: User | null }) {
  const router = useRouter();

  function handleLogOut() {
    logOut();
    router.push("/sign-in");
  }

  return (
    <header className="flex items-center justify-between border-b-2 border-foreground/10 px-8 py-4">
      <div className="text-lg font-bold">Welcome {user?.username}!</div>
      <div className="flex items-center gap-3">
        <Link
          href="/add-project"
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          New Project
        </Link>
        <button
          type="button"
          onClick={handleLogOut}
          className="rounded-lg border-2 border-foreground/20 px-4 py-2 text-sm font-medium hover:bg-foreground/5"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
