"use client";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const AuthNavbar = () => {
    // Same styling as Navbar but simplified content
    return (
        <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white cursor-pointer">
                    <div className="text-cyan-400">
                        <QrCode size={24} />
                    </div>
                    <span>RQ Code</span>
                </Link>
                {/* No other links for auth pages */}
            </div>
        </nav>
    );
};
