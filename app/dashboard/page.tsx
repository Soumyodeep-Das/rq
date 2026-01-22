"use client";
import { useEffect, useState } from "react";
import { account, databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Activity, QrCode, Zap, Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverview() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        totalScans: 0
    });
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const session = await account.get();
                setUser(session);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("userId", session.$id)]
                );

                const docs = response.documents;
                const totalScans = docs.reduce((acc: number, doc: any) => acc + (doc.scanCount || 0), 0);

                setStats({
                    total: docs.length,
                    active: docs.filter((d: any) => d.isActive).length,
                    totalScans: totalScans
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-4 w-64 bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name || user?.email}</p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/25"
                >
                    <Plus size={20} />
                    Create New RQ
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <QrCode size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total RQs</p>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Codes</p>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.active}</h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Scans</p>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalScans}</h2>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Recent Activity</h3>
                <div className="text-center py-10 text-slate-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No recent activity detailed yet.</p>
                </div>
            </div>
        </div>
    )
}
