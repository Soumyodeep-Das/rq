"use client";
import { useState } from "react";
import { databases, DATABASE_ID, COLLECTION_ID, account } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import QRStyleControls, { QRStyleState, DotType, CornerSquareType } from "@/components/QRStyleControls";
import StyledQRCode from "@/components/StyledQRCode";

export default function CreateRQ() {
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

        try {
            const user = await account.get();
            const slug = nanoid(6);

            // Serialize options
            const qrOptions = JSON.stringify(qrStyle);

            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    slug: slug,
                    content: content,
                    contentType: contentType,
                    isActive: true,
                    scanCount: 0,
                    qrOptions: qrOptions // Saving the style
                }
            );

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create RQ Code");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black/50 p-6 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row overflow-hidden">

                {/* Left: Preview Section */}
                <div className="md:w-1/3 bg-zinc-50 dark:bg-black/20 p-8 border-r border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <StyledQRCode
                            data={content || "https://rqcode.example.com"} // Live preview of content or placeholder
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
                    <p className="text-xs text-zinc-500 text-center">
                        This is how your QR code will look.
                    </p>
                </div>

                {/* Right: Form Section */}
                <div className="md:w-2/3 p-8 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Create New RQ</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Set up your content and style.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="space-y-8">
                        {/* Content Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">1. Content</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setContentType("url")}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all border ${contentType === "url"
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                            }`}
                                    >
                                        URL Redirect
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContentType("text")}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all border ${contentType === "text"
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                            }`}
                                    >
                                        Plain Text
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    {contentType === "url" ? "Destination URL" : "Text Content"}
                                </label>
                                {contentType === "url" ? (
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://example.com"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-base md:text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                    />
                                ) : (
                                    <textarea
                                        required
                                        placeholder="Enter your message here..."
                                        rows={3}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="flex w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-base md:text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Styling Settings */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">2. Custom Style</h3>
                            <QRStyleControls style={qrStyle} onChange={setQrStyle} />
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 px-4 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25 flex justify-center items-center"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Create RQ"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
