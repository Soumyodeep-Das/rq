"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function VerifyOTP() {
    const params = useSearchParams();
    const userId = params.get("userId");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleVerify(e: any) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await account.createSession(userId!, otp);
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Verify OTP</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Enter the 6-digit code sent to your phone
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            One-Time Password
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="123456"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-center tracking-widest text-lg font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            "Verify & Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
