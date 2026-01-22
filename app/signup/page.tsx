"use client";
import { useState } from "react";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputField } from "@/components/auth/InputField";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { AuthNavbar } from "@/components/auth/AuthNavbar";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // Auto-login after signup
            await account.createEmailPasswordSession({
                email,
                password,
            });

            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Global Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <AuthNavbar />

            <AuthLayout
                title="Create an account"
                subtitle="Start creating dynamic QRs today."
                linkText="Already have an account?"
                linkActionText="Log in"
                linkHref="/login"
            >
                <div className="space-y-4">
                    <SocialLogin />

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">Or register with</span>
                        <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSignup}>
                        <InputField
                            type="text"
                            placeholder="Full Name"
                            icon={User}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <InputField
                            type="email"
                            placeholder="name@example.com"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <InputField
                            type="password"
                            placeholder="Create a Password"
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-start gap-3">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 border border-slate-700 rounded bg-slate-900 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 text-cyan-600 accent-cyan-500"
                                />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-400">
                                I agree to the <Link href="#" className="text-slate-300 hover:text-white underline">Terms</Link> and <Link href="#" className="text-slate-300 hover:text-white underline">Privacy Policy</Link>.
                            </label>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Create Account"}
                        </button>
                    </form>
                </div>
            </AuthLayout>
        </div>
    );
}
