"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Fetch user for Navbar profile display
        account.get().then(setUser).catch(() => { });
    }, []);

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/manage", label: "Manage RQs", icon: QrCode },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    async function handleLogout() {
        try {
            await account.deleteSession("current");
            router.push("/login");
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black/50 flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 fixed h-full z-20">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            R
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
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
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium shadow-sm"
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Navbar */}
                <DashboardNavbar
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    user={user}
                />

                {/* Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-zinc-900 shadow-xl p-6 flex flex-col animate-in slide-in-from-left duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    R
                                </div>
                                <span className="text-xl font-bold">RQ Code</span>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-zinc-100 rounded-full"
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
                                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
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
