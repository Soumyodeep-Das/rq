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
        <header className="flex h-16 items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 px-6 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10 w-full">
            <button
                className="inline-flex md:hidden items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-100 hover:text-zinc-900 h-10 w-10 -ml-2"
                onClick={onMenuClick}
            >
                <Menu size={20} />
                <span className="sr-only">Toggle Menu</span>
            </button>

            <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {getPageTitle()}
                </h1>

                <div className="flex items-center gap-4">
                    {/* Placeholder for Search or other top-nav items */}

                    {user && (
                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
