"use client";

import UserSettingsForm from "@/components/UserSettingsForm";

interface UserSettingsModalProps {
  onClose: () => void;
}

export default function UserSettingsModal({ onClose }: UserSettingsModalProps) {
  return (
    <div
      className="modal-backdrop-enter fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-settings-title"
        className="modal-scrollbar modal-fall-enter max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl border-2 border-foreground/20 bg-background p-4 shadow-xl sm:max-w-lg sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="user-settings-title" className="text-2xl font-bold">
            User Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close user settings dialog"
            className="rounded-full px-3 py-1 text-xl leading-none hover:bg-foreground/10"
          >
            &times;
          </button>
        </div>
        <UserSettingsForm />
      </div>
    </div>
  );
}
