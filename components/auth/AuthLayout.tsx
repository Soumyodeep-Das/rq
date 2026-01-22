import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    linkText: string;
    linkActionText: string;
    linkHref: string;
}

export const AuthLayout = ({ title, subtitle, children, linkText, linkHref, linkActionText }: AuthLayoutProps) => (
    <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
        <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Glow effect inside card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-slate-400">{subtitle}</p>
                </div>

                {children}

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-400 text-sm">
                        {linkText}{' '}
                        <Link href={linkHref} className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
                            {linkActionText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
);
