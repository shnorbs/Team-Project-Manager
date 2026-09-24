"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logIn } from "@/lib/auth";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const success = logIn(email.trim(), password);
    if (!success) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Sign in</h1>
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
            autoComplete="current-password"
            required
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="modal-field w-full rounded-lg p-3 text-foreground placeholder:text-foreground/40"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-2 rounded-lg bg-foreground px-4 py-3 font-medium text-background hover:opacity-90"
          >
            Sign In
          </button>
        </div>
        <p className="text-center text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/create-account"
            className="font-medium text-foreground underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
