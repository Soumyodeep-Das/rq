"use client";
import { useEffect, useState } from "react";
import { account, databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { Query } from "appwrite";
import StyledQRCode from "@/components/StyledQRCode";
import { Trash2, Copy, Edit, Wifi, WifiOff, Palette, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QRStyleControls, { QRStyleState, DotType, CornerSquareType } from "@/components/QRStyleControls";
import { toast } from "sonner";

export default function ManageRQs() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [rqCodes, setRqCodes] = useState<any[]>([]);

    // Edit Content State
    const [editingRq, setEditingRq] = useState<any>(null);
    const [newContent, setNewContent] = useState("");

    // Customization State
    const [customizingRq, setCustomizingRq] = useState<any>(null);
    const [qrStyle, setQrStyle] = useState({
        dotsColor: "#000000",
        dotsType: "extra-rounded" as DotType,
        bgColor: "#ffffff",
        cornerType: "extra-rounded" as CornerSquareType,
        cornerColor: "#000000"
    });

    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const session = await account.get();
            setUser(session);
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal("userId", session.$id), Query.orderDesc("$createdAt")]
            );
            setRqCodes(response.documents);
        } catch (err) {
            // Error handling
        } finally {
            setLoading(false);
        }
    }

    // ... existing CRUD handlers (handleDelete, toggleActive, handleUpdateContent) ...
    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this RQ Code?")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
            setRqCodes((prev) => prev.filter((rq) => rq.$id !== id));
        } catch (err: any) {
            toast.error(err.message || "Failed to delete RQ Code");
        }
    }

    async function toggleActive(rq: any) {
        try {
            const updated = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                rq.$id,
                { isActive: !rq.isActive }
            );
            setRqCodes((prev) =>
                prev.map((item) => (item.$id === rq.$id ? updated : item))
            );
        } catch (err: any) {
            toast.error(err.message || "Failed to update status");
        }
    }

    async function handleUpdateContent(e: any) {
        e.preventDefault();
        if (!editingRq) return;
        try {
            const updated = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                editingRq.$id,
                { content: newContent }
            );
            setRqCodes((prev) =>
                prev.map((item) => (item.$id === editingRq.$id ? updated : item))
            );
            setEditingRq(null);
            setNewContent("");
        } catch (err: any) {
            toast.error(err.message || "Failed to update content");
        }
    }

    async function handleSaveStyle() {
        if (!customizingRq) return;
        try {
            const qrOptions = JSON.stringify(qrStyle);
            const updated = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                customizingRq.$id,
                { qrOptions: qrOptions }
            );
            setRqCodes((prev) =>
                prev.map((item) => (item.$id === customizingRq.$id ? updated : item))
            );
            setCustomizingRq(null);
            toast.success("Style saved successfully!");
        } catch (err: any) {
            toast.error(err.message || "Failed to save style");
        }
    }


    const openCustomizeModal = (rq: any) => {
        setCustomizingRq(rq);
        // Load existing style or default
        if (rq.qrOptions) {
            try {
                const parsed = JSON.parse(rq.qrOptions);
                setQrStyle(parsed);
            } catch (e) {
                // Fallback if parse error
                setQrStyle({
                    dotsColor: "#000000",
                    dotsType: "extra-rounded",
                    bgColor: "#ffffff",
                    cornerType: "extra-rounded",
                    cornerColor: "#000000"
                });
            }
        } else {
            setQrStyle({
                dotsColor: "#000000",
                dotsType: "extra-rounded",
                bgColor: "#ffffff",
                cornerType: "extra-rounded",
                cornerColor: "#000000"
            });
        }
    }

    // Helper to extract style safely for grid view
    const getQrStyle = (rq: any) => {
        if (rq.qrOptions) {
            try {
                return JSON.parse(rq.qrOptions);
            } catch { return {}; }
        }
        return {};
    }

    // Helper to copy to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy to clipboard");
        }
    };

    const openEditModal = (rq: any) => {
        setEditingRq(rq);
        setNewContent(rq.content || "");
    };

    // ... (rest of render)


    return (
        <div className="space-y-6">
            {/* Header ... */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rqCodes.map((rq) => {
                    const style = getQrStyle(rq);
                    return (
                        <div
                            key={rq.$id}
                            className={`group bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border flex flex-col overflow-hidden transition-all ${rq.isActive
                                ? "border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50"
                                : "border-zinc-200 dark:border-zinc-800 opacity-75"
                                }`}
                        >
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div className="bg-white p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 aspect-square flex items-center justify-center relative group-hover:shadow-inner transition-shadow">
                                    <div className="w-full h-full max-w-[150px]">
                                        <StyledQRCode
                                            data={`${window.location.origin}/r/${rq.slug}`}
                                            width={300}
                                            height={300}
                                            className="w-full"
                                            dotsOptions={{
                                                color: style.dotsColor || "#000000",
                                                type: style.dotsType || "extra-rounded"
                                            }}
                                            backgroundOptions={{
                                                color: style.bgColor || "#ffffff"
                                            }}
                                            cornersSquareOptions={{
                                                type: style.cornerType || "extra-rounded",
                                                color: style.cornerColor || style.dotsColor || "#000000"
                                            }}
                                        />
                                    </div>
                                    {/* Overlay Actions ... */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm rounded-xl">
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/r/${rq.slug}`)}
                                            className="p-2 bg-white text-zinc-900 rounded-lg hover:scale-110 transition-transform"
                                            title="Copy Link"
                                        >
                                            <Copy size={18} />
                                        </button>
                                        <button
                                            onClick={() => openCustomizeModal(rq)}
                                            className="p-2 bg-white text-zinc-900 rounded-lg hover:scale-110 transition-transform"
                                            title="Customize & Download"
                                        >
                                            <Palette size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* ... Content Info ... */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs font-medium text-zinc-500">/{rq.slug}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rq.isActive ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"}`}>
                                            {rq.isActive ? "Active" : "Disabled"}
                                        </span>
                                    </div>
                                    <div className="relative group/text">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 break-all" title={rq.content}>
                                            {rq.content}
                                        </p>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {rq.scanCount} scans • {rq.contentType}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer ... */}
                            {/* ... */}
                            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center gap-2">
                                <button
                                    onClick={() => toggleActive(rq)}
                                    className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title={rq.isActive ? "Disable" : "Enable"}
                                >
                                    {rq.isActive ? <Wifi size={18} /> : <WifiOff size={18} />}
                                </button>
                                <button
                                    onClick={() => openEditModal(rq)}
                                    className="p-2 text-zinc-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                    title="Edit Content"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(rq.$id)}
                                    className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Customization Modal */}
            {customizingRq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-8 flex flex-col md:flex-row gap-8">
                        {/* Preview Section */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black/50 rounded-xl p-8 border border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <StyledQRCode
                                    data={`${window.location.origin}/r/${customizingRq.slug}`}
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
                            <p className="text-xs text-zinc-500 mt-4">Downloads will use the current style.</p>
                        </div>

                        {/* Controls Section using reusable component */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">Customize QR Code</h2>
                                    <p className="text-sm text-zinc-500">/{customizingRq.slug}</p>
                                </div>
                                <button onClick={() => setCustomizingRq(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                                    <span className="sr-only">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                                </button>
                            </div>

                            <QRStyleControls style={qrStyle} onChange={setQrStyle} />

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <Button onClick={handleSaveStyle} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save Style Changes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Content Modal (Existing) */}
            {editingRq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold">Edit RQ Content</h3>
                            <p className="text-sm text-zinc-500">Update the destination for /{editingRq.slug}</p>
                        </div>
                        <form onSubmit={handleUpdateContent} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {editingRq.contentType === 'url' ? "URL" : "Text"}
                                </label>
                                {editingRq.contentType === 'url' ? (
                                    <input
                                        type="url"
                                        required
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <textarea
                                        required
                                        rows={4}
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="flex w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingRq(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
