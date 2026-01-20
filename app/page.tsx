"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    account
      .get()
      .then(setUser)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gradient-to-b from-transparent to-black/5">
        <div className="animate-pulse text-xl text-gray-500 font-medium">
          Loading amazing experience...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center gap-8 max-w-2xl text-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            RQ Code
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Secure, fast, and modern authentication for your next big project.
            Experience the future of login today.
          </p>
        </div>

        {user ? (
          <div className="flex flex-col items-center gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                Welcome back, {user.email ?? user.phone}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform relative z-10"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-white dark:bg-white/10 text-gray-900 dark:text-white rounded-xl font-semibold border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-sm hover:shadow-md text-center"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/30 text-center"
            >
              Create Account
            </Link>

            <Link
              href="/phone-login"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-purple-500/30 text-center flex items-center justify-center gap-2"
            >
              <span>Phone Login</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
