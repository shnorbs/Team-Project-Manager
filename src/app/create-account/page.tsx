"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";

export default function CreateAccount() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      setError("Username must be between 3 and 30 characters.");
      return;
    }
    if (!trimmedEmail) {
      setError("Email cannot be empty.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const success = signUp(trimmedUsername, trimmedEmail, password);
    if (!success) {
      setError("Username or email is already taken.");
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Create account</h1>
        </div>

        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="modal-field w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modal-field w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="modal-field w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-foreground px-4 py-3 font-medium text-background hover:opacity-90"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
