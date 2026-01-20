"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface DashboardNavbarProps {
    onMenuClick: () => void;
    user?: any;
}

export function DashboardNavbar({ onMenuClick, user }: DashboardNavbarProps) {
    const pathname = usePathname();

    // Get the current page name from path (e.g., /dashboard/manage -> Manage)
    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Overview";
        const segments = pathname.split("/");
        if (segments.length > 2) {
            return segments[2].charAt(0).toUpperCase() + segments[2].slice(1);
        }
        return "Dashboard";
    };

    return (
        <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-slate-900/50 px-6 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 sticky top-0 z-10 w-full text-slate-200">
            <button
                className="inline-flex md:hidden items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-white/10 hover:text-white h-10 w-10 -ml-2"
                onClick={onMenuClick}
            >
                <Menu size={20} />
                <span className="sr-only">Toggle Menu</span>
            </button>

            <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg font-semibold text-white tracking-tight">
                    {getPageTitle()}
                </h1>

                <div className="flex items-center gap-4">
                    {/* Placeholder for Search or other top-nav items */}

                    {user && (
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none text-white">{user.name || "User"}</p>
                                <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs ring-2 ring-transparent group-hover:ring-cyan-500/20 transition-all">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
