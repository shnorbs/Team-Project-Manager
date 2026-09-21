"use client";

import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-5">
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
            placeholder="you@example.com"
            required
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
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
            placeholder="Enter your password"
            required
            className="w-full rounded-lg border-2 border-foreground/50 bg-background p-3 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-2 rounded-lg bg-foreground px-4 py-3 font-medium text-background hover:opacity-90"
          >
            Sign In
          </button>
        </div>
        <p className="text-center text-sm text-foreground/60">
          Don't have an account?{" "}
          <Link
            href="/create-account"
            className="font-medium text-foreground underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
