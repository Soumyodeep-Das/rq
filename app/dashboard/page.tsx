"use client";
import { useEffect, useState } from "react";
import { account, databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Activity, QrCode, Zap } from "lucide-react";

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

    if (loading) return <div className="p-8 animate-pulse">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Welcome back, {user?.name || user?.email}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <QrCode size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total RQs</p>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Codes</p>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.active}</h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Scans</p>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalScans}</h2>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder - could be expanded to show actual recent items */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="text-center py-10 text-zinc-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No recent activity detailed yet.</p>
                </div>
            </div>
        </div>
    )
}
