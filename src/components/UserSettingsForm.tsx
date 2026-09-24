"use client";

import { useEffect, useState } from "react";
import {
  getCurrentUser,
  updateEmail,
  updateName,
  updatePassword,
} from "@/lib/auth";
import { User } from "@/types/users.types";

export default function UserSettingsForm() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setUsername(currentUser?.username ?? "");
      setEmail(currentUser?.email ?? "");
      setLoadingUser(false);
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  function handleUsernameSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      setUsernameStatus("Username must be between 3 and 30 characters.");
      return;
    }
    const success = updateName(trimmedUsername);
    setUsernameStatus(
      success ? "Username updated." : "That username is already taken.",
    );
    if (success) setUser(getCurrentUser());
  }

  function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailStatus("Email cannot be empty.");
      return;
    }
    const success = updateEmail(trimmedEmail);
    setEmailStatus(
      success ? "Email updated." : "That email is already in use.",
    );
    if (success) setUser(getCurrentUser());
  }

  function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword.length < 8 || newPassword.length > 128) {
      setPasswordStatus("Password must be between 8 and 128 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus("Passwords do not match.");
      return;
    }
    updatePassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("Password updated.");
  }

  if (loadingUser) {
    return (
      <div className="flex items-center gap-3 text-foreground/60">
        <span className="loading-spinner" /> Loading user settings...
      </div>
    );
  }

  if (!user)
    return <p className="text-foreground/60">Unable to load user settings.</p>;

  const inputClassName =
    "modal-field w-full rounded-lg bg-background p-3 text-foreground";
  const buttonClassName =
    "rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90";

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleUsernameSubmit}
        className="space-y-2 border-b border-foreground/20 pb-8"
      >
        <label htmlFor="settings-username" className="text-sm font-medium">
          Username
        </label>
        <input
          className={inputClassName}
          id="settings-username"
          type="text"
          required
          minLength={3}
          maxLength={30}
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setUsernameStatus(null);
          }}
        />
        {usernameStatus && (
          <p className="text-sm text-foreground/60">{usernameStatus}</p>
        )}
        <button type="submit" className={buttonClassName}>
          Save Username
        </button>
      </form>

      <form
        onSubmit={handleEmailSubmit}
        className="space-y-2 border-b border-foreground/20 pb-8"
      >
        <label htmlFor="settings-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="settings-email"
          type="email"
          className={inputClassName}
          required
          maxLength={254}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailStatus(null);
          }}
        />
        {emailStatus && (
          <p className="text-sm text-foreground/60">{emailStatus}</p>
        )}
        <button type="submit" className={buttonClassName}>
          Save Email
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium">
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          className={inputClassName}
          required
          minLength={8}
          maxLength={128}
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setPasswordStatus(null);
          }}
        />
        <label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type="password"
          className={inputClassName}
          required
          minLength={8}
          maxLength={128}
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setPasswordStatus(null);
          }}
        />
        {passwordStatus && (
          <p className="text-sm text-foreground/60">{passwordStatus}</p>
        )}
        <button type="submit" className={buttonClassName}>
          Save Password
        </button>
      </form>
    </div>
  );
}
