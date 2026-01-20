"use client";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";

export default function Profile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        account.get().then(setUser).catch(console.error);
    }, []);

    if (!user) return <div className="p-8 animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.name || "User"}</h2>
                        <p className="text-zinc-500">{user.email}</p>
                    </div>
                </div>

                <dl className="space-y-4">
                    <div>
                        <dt className="text-sm font-medium text-zinc-500">User ID</dt>
                        <dd className="font-mono text-sm bg-zinc-50 dark:bg-zinc-800 p-2 rounded mt-1">{user.$id}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-zinc-500">Phone</dt>
                        <dd className="text-sm mt-1">{user.phone || "Not linked"}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-zinc-500">Registration Date</dt>
                        <dd className="text-sm mt-1">{new Date(user.$createdAt).toLocaleDateString()}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
