"use client";
import { useState } from "react";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";

export default function PhoneLogin() {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlePhoneLogin(e: any) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            // userId is required; use unique() for new users
            const session = await account.createPhoneToken(ID.unique(), phone);
            const userId = session.userId;

            window.location.href = `/phone-login/verify?userId=${userId}`;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Phone Login</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Enter your phone number to receive an OTP
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="+91XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        />
                        <p className="text-xs text-zinc-500">Include country code (e.g., +1)</p>
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
                            "Send OTP"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
