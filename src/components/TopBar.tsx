"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logOut } from "@/lib/auth";
import { TOPBAR_BACKGROUND_STYLE } from "@/lib/topbar-styles";
import { User } from "@/types/users.types";
import ProjectModal from "@/components/ProjectModal";
import UserSettingsModal from "@/components/UserSettingsModal";

export default function TopBar({ user }: { user: User | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogOut() {
    logOut();
    router.push("/sign-in");
  }

  return (
    <header className="relative flex w-full min-w-0 flex-wrap items-center justify-between gap-3 border-b-2 border-accent/40 px-4 py-3 sm:px-8 sm:py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-no-repeat opacity-10 invert"
        style={TOPBAR_BACKGROUND_STYLE}
      />
      <div className="relative z-1 min-w-0 truncate text-base font-bold sm:text-lg">
        Welcome {user?.username}!
      </div>
      <div className="relative z-1 flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setShowProjectModal(true)}
          className="rounded-full bg-foreground px-3 py-2 text-xs font-medium text-background hover:opacity-90 sm:px-5 sm:text-sm"
        >
          New Project
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full bg-black px-3 py-2 text-xs font-medium hover:bg-foreground/5 sm:px-5 sm:text-sm"
          >
            Account
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border-2 border-foreground/50 bg-background p-1 shadow-lg">
              <button
                type="button"
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-foreground/5"
                onClick={() => {
                  setOpen(false);
                  setShowSettingsModal(true);
                }}
              >
                User Settings
              </button>

              <div className="my-1 border-t border-foreground/20" />

              <button
                type="button"
                onClick={handleLogOut}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onSaved={() => {
            setShowProjectModal(false);
            router.push("/");
          }}
        />
      )}
      {showSettingsModal && (
        <UserSettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </header>
  );
}
