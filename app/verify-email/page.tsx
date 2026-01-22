"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { AuthNavbar } from "@/components/auth/AuthNavbar";

export default function VerifyEmailPage() {
    const params = useSearchParams();
    const router = useRouter();
    const userId = params.get("userId");
    const secret = params.get("secret");
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("Verifying your email address...");

    useEffect(() => {
        async function verify() {
            if (!userId || !secret) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {
                await account.updateEmailVerification({ userId, secret });
                setStatus("success");
                setMessage("Email verified successfully! You can now login.");

                // Optional: Auto redirect after few seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } catch (err: any) {
                setStatus("error");
                setMessage(err.message || "Failed to verify email.");
            }
        }

        verify();
    }, [userId, secret, router]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Global Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <AuthNavbar />

            <AuthLayout
                title="Email Verification"
                subtitle="We are verifying your email address."
                linkText={status === 'success' ? "Redirecting to login..." : "Back to"}
                linkActionText={status === 'success' ? "" : "Login"}
                linkHref="/login"
            >
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    {status === "verifying" && (
                        <>
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                            <p className="text-slate-400">{message}</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="text-white font-medium text-lg">{message}</p>
                            <p className="text-slate-500 text-sm">Redirecting you to login page...</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-400 font-medium">{message}</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                </div>
            </AuthLayout>
        </div>
    );
}
