"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";

export default function Profile() {
    const { user } = useAuthStore();

    if (!user) return (
        <div className="max-w-2xl space-y-6">
            <Skeleton className="h-8 w-48 bg-slate-200 dark:bg-slate-800" />
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <Skeleton className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>

            <div className="bg-slate-200 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/20">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name || "User"}</h2>
                        <p className="text-slate-500">{user.email}</p>
                    </div>
                </div>

                <dl className="space-y-4">
                    <div>
                        <dt className="text-sm font-medium text-slate-500">User ID</dt>
                        <dd className="font-mono text-sm bg-slate-500 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mt-1 dark:text-slate-300">{user.$id}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-slate-500">Phone</dt>
                        <dd className="text-sm mt-1 text-slate-900 dark:text-slate-200">{user.phone || "Not linked"}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-slate-500">Registration Date</dt>
                        <dd className="text-sm mt-1 text-slate-900 dark:text-slate-200">{new Date(user.$createdAt).toLocaleDateString()}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
