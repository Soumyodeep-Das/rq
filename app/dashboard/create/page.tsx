"use client";
import { useState } from "react";
import { tables, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import QRStyleControls, { QRStyleState, DotType, CornerSquareType } from "@/components/QRStyleControls";
import StyledQRCode from "@/components/StyledQRCode";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function CreateRQ() {
    const { user } = useAuthStore();
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState<"url" | "text">("url");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Style State
    const [qrStyle, setQrStyle] = useState<QRStyleState>({
        dotsColor: "#000000",
        dotsType: "extra-rounded",
        bgColor: "#ffffff",
        cornerType: "extra-rounded",
        cornerColor: "#000000"
    });

    const router = useRouter();

    async function handleCreate(e: any) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!user) {
            setError("You must be logged in to create a code");
            setLoading(false);
            return;
        }

        try {
            const slug = nanoid(6);

            // Serialize options
            const qrOptions = JSON.stringify(qrStyle);

            await tables.createRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: ID.unique(),
                data: {
                    userId: user.$id,
                    slug: slug,
                    content: content,
                    contentType: contentType,
                    isActive: true,
                    scanCount: 0,
                    qrOptions: qrOptions // Saving the style
                }
            });

            router.push("/dashboard/manage");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create RQ Code");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create New RQ</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Set up your content and style.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Preview Section - Sticky on Desktop */}
                <div className="lg:w-1/3 order-2 lg:order-1">
                    <div className="sticky top-8 space-y-4">
                        <div className="bg-slate-900/5 dark:bg-black/20 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
                            <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-black/5">
                                <StyledQRCode
                                    data={content || "https://rqcode.example.com"}
                                    dotsOptions={{
                                        color: qrStyle.dotsColor,
                                        type: qrStyle.dotsType,
                                    }}
                                    backgroundOptions={{
                                        color: qrStyle.bgColor
                                    }}
                                    cornersSquareOptions={{
                                        type: qrStyle.cornerType,
                                        color: qrStyle.cornerColor
                                    }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 text-center font-medium">
                                Live Preview
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Form Section */}
                <div className="lg:w-2/3 order-1 lg:order-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-8">
                            {/* Content Settings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">1. Content</h3>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200">Content Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setContentType("url")}
                                            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${contentType === "url"
                                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                }`}
                                        >
                                            URL Redirect
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setContentType("text")}
                                            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${contentType === "text"
                                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                }`}
                                        >
                                            Plain Text
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200">
                                        {contentType === "url" ? "Destination URL" : "Text Content"}
                                    </label>
                                    {contentType === "url" ? (
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://example.com"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="flex h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                        />
                                    ) : (
                                        <textarea
                                            required
                                            placeholder="Enter your message here..."
                                            rows={4}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="flex w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Styling Settings */}
                            <div className="space-y-4 pt-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">2. Custom Style</h3>
                                <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <QRStyleControls style={qrStyle} onChange={setQrStyle} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25 flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        "Create RQ Code"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
