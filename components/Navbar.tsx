"use client";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white cursor-pointer">
                    <div className="text-cyan-400">
                        <QrCode size={24} />
                    </div>
                    <span>RQ Code</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <Link href="/#features" className="hover:text-cyan-400 transition-colors">Features</Link>
                    <Link href="/#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</Link>
                    <Link href="/#tech" className="hover:text-cyan-400 transition-colors">Tech Stack</Link>
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-white transition-colors flex items-center">
                        Log in
                    </Link>
                    <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};
