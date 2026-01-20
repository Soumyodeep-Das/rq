"use client";
import { useEffect, useState, use } from "react";
import { databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function RedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rqCode, setRqCode] = useState<any>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchAndRedirect = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("slug", slug)]
                );

                if (response.documents.length === 0) {
                    setError("RQ Code not found");
                    setLoading(false);
                    return;
                }

                const doc = response.documents[0];

                if (!doc.isActive) {
                    setError("This RQ Code has been disabled by the owner");
                    setLoading(false);
                    return;
                }

                setRqCode(doc);

                // Increment scan count
                await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                    scanCount: (doc.scanCount || 0) + 1,
                });

                if (doc.contentType === "url") {
                    // Add https:// if missing
                    let url = doc.content;
                    if (!/^https?:\/\//i.test(url)) {
                        url = "https://" + url;
                    }
                    window.location.href = url;
                } else {
                    setLoading(false);
                }
            } catch (err: any) {
                console.error(err);
                setError("An error occurred while resolving the RQ Code");
                setLoading(false);
            }
        };

        fetchAndRedirect();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 animate-pulse">Redirecting...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black p-6">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {error}
                    </h1>
                    <p className="text-zinc-500">
                        The link you are trying to access is invalid or currently unavailable.
                    </p>
                </div>
            </div>
        );
    }

    // Display Text Content
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-6">
            <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-sm text-zinc-400 font-medium uppercase tracking-wider">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" x2="8" y1="13" y2="13" />
                            <line x1="16" x2="8" y1="17" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        Text Content
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-lg md:text-xl text-zinc-800 dark:text-zinc-200 leading-relaxed">
                            {rqCode?.content}
                        </p>
                    </div>
                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                        <p className="text-xs text-zinc-400">Powered by RQ Code</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
