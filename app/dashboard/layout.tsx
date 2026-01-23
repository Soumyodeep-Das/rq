"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { useAuthStore } from "@/store/useAuthStore";
import {
    LayoutDashboard,
    QrCode,
    BarChart3,
    User,
    Settings,
    LogOut,
    X,
} from "lucide-react";
import { DashboardNavbar } from "./_components/navbar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, fetchUser, loading } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/manage", label: "Manage RQs", icon: QrCode },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    async function handleLogout() {
        try {
            await account.deleteSession({ sessionId: "current" });
            router.push("/login");
        } catch (err: any) {
            toast.error(err.message || "Failed to logout");
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900/50 backdrop-blur-md border-r border-white/5 fixed h-full z-20">
                <div className="p-6 border-b border-white/5 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">
                            <QrCode size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            RQ Code
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    isActive
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-950">
                {/* Navbar */}
                <DashboardNavbar
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    user={user}
                />

                {/* Content */}
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-slate-900 border-r border-white/10 shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">
                                    <QrCode size={24} />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    RQ Code
                                </span>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                            isActive
                                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="pt-6 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
