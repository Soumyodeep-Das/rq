"use client";
import { useState } from "react"; // Removed useEffect
import { useRouter } from "next/navigation";
import StyledQRCode from "@/components/StyledQRCode";
import { Trash2, Copy, Edit, Wifi, WifiOff, Palette, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QRStyleControls, { QRStyleState, DotType, CornerSquareType } from "@/components/QRStyleControls";
import QRCodeStyling, {
    CornerDotType,
} from "qr-code-styling";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuthStore } from "@/store/useAuthStore";
import { useRQCodes, useDeleteRQ, useUpdateRQ } from "@/hooks/useRQCodes";
import { cn } from "@/lib/utils";

export default function ManageRQs() {
    const { user } = useAuthStore();
    const { rqCodes, isLoading } = useRQCodes(user?.$id);
    const deleteMutation = useDeleteRQ();
    const updateMutation = useUpdateRQ();

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

    // No useEffect needed for fetching!

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this RQ Code?")) return;
        deleteMutation.mutate(id);
    }

    async function toggleActive(rq: any) {
        updateMutation.mutate({
            id: rq.$id,
            data: { isActive: !rq.isActive }
        });
    }

    async function handleUpdateContent(e: any) {
        e.preventDefault();
        if (!editingRq) return;

        updateMutation.mutate({
            id: editingRq.$id,
            data: { content: newContent }
        }, {
            onSuccess: () => {
                setEditingRq(null);
                setNewContent("");
            }
        });
    }

    async function handleSaveStyle() {
        if (!customizingRq) return;
        const qrOptions = JSON.stringify(qrStyle);

        updateMutation.mutate({
            id: customizingRq.$id,
            data: { qrOptions: qrOptions }
        }, {
            onSuccess: () => {
                setCustomizingRq(null);
            }
        });
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

    const handleQuickDownload = async (rq: any) => {
        try {
            const style = getQrStyle(rq);
            const qr = new QRCodeStyling({
                width: 300,
                height: 300,
                type: "svg",
                data: `${window.location.origin}/r/${rq.slug}`,
                margin: 10,
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 10,
                    crossOrigin: "anonymous",
                },
                dotsOptions: {
                    color: style.dotsColor || "#000000",
                    type: (style.dotsType || "extra-rounded") as DotType,
                },
                backgroundOptions: {
                    color: style.bgColor || "#ffffff",
                },
                cornersSquareOptions: {
                    type: (style.cornerType || "extra-rounded") as CornerSquareType,
                    color: style.cornerColor || style.dotsColor || "#000000",
                },
                cornersDotOptions: {
                    type: "dot" as CornerDotType,
                    color: style.cornerColor || style.dotsColor || "#000000",
                },
            });

            await qr.download({
                name: `rq-${rq.slug}`,
                extension: "png",
            });
            toast.success("Download started!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate download");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100">Manage RQs</h1>
                    <p className="text-slate-200 text-sm mt-1">View and manage all your generated RQ codes.</p>
                </div>
                <Link href="/dashboard/create" className={cn(
                    "flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all w-full md:w-auto",
                    "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:bg-cyan-500/20"
                )}>
                    <Plus size={18} />
                    Create New RQ
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
                            <Skeleton className="w-full aspect-square rounded-xl bg-slate-100 dark:bg-slate-800" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16 bg-slate-100 dark:bg-slate-800" />
                                    <Skeleton className="h-4 w-12 rounded-full bg-slate-100 dark:bg-slate-800" />
                                </div>
                                <Skeleton className="h-5 w-3/4 bg-slate-100 dark:bg-slate-800" />
                                <Skeleton className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800" />
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2">
                                <Skeleton className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800" />
                                <Skeleton className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800" />
                                <Skeleton className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {rqCodes?.map((rq) => {
                        const style = getQrStyle(rq);
                        return (
                            <div
                                key={rq.$id}
                                className={`group bg-slate-400 dark:bg-slate-900 rounded-2xl shadow-sm border flex flex-col overflow-hidden transition-all ${rq.isActive
                                    ? "border-cyan-500/20 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10"
                                    : "border-cyan-500/20 dark:border-slate-800 opacity-75 grayscale"
                                    }`}
                            >
                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 dark:border-slate-800 aspect-square flex items-center justify-center relative group-hover:shadow-inner transition-shadow shadow-sm">
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
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm rounded-xl">
                                            <button
                                                onClick={() => copyToClipboard(`${window.location.origin}/r/${rq.slug}`)}
                                                className="p-2 bg-white text-slate-900 rounded-lg hover:scale-110 transition-transform shadow-lg"
                                                title="Copy Link"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => openCustomizeModal(rq)}
                                                className="p-2 bg-white text-slate-900 rounded-lg hover:scale-110 transition-transform shadow-lg"
                                                title="Customize & Download"
                                            >
                                                <Palette size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleQuickDownload(rq)}
                                                className="p-2 bg-white text-slate-900 rounded-lg hover:scale-110 transition-transform shadow-lg"
                                                title="Quick Download PNG"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-medium text-slate-500">/{rq.slug}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${rq.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"}`}>
                                                {rq.isActive ? "Active" : "Disabled"}
                                            </span>
                                        </div>
                                        <div className="relative group/text">
                                            <p className="text-sm font-medium text-slate-100 dark:text-slate-100 line-clamp-2 break-all" title={rq.content}>
                                                {rq.content}
                                            </p>
                                        </div>
                                        <div className="text-xs text-slate-200 flex items-center gap-1">
                                            {rq.scanCount} scans • <span className="capitalize">{rq.contentType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex justify-between items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(rq)}
                                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title={rq.isActive ? "Disable" : "Enable"}
                                    >
                                        {rq.isActive ? <Wifi size={18} /> : <WifiOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(rq)}
                                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                        title="Edit Content"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rq.$id)}
                                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Customization Modal */}
            {customizingRq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-8 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto">
                        {/* Preview Section */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-200 dark:bg-black/20 rounded-xl p-8 border border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Live Preview</h3>
                            <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
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
                            <p className="text-xs text-slate-700 dark:text-slate-400 mt-4">Downloads will use the current style.</p>
                        </div>

                        {/* Controls Section using reusable component */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customize QR Code</h2>
                                    <p className="text-sm text-slate-500">/{customizingRq.slug}</p>
                                </div>
                                <button onClick={() => setCustomizingRq(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <span className="sr-only">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                                </button>
                            </div>

                            <QRStyleControls style={qrStyle} onChange={setQrStyle} />

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleSaveStyle}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all",
                                        "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:bg-cyan-500/20"
                                    )}
                                >
                                    Save Style Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Content Modal */}
            {editingRq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit RQ Content</h3>
                            <p className="text-sm text-slate-500">Update the destination for /{editingRq.slug}</p>
                        </div>
                        <form onSubmit={handleUpdateContent} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                    {editingRq.contentType === 'url' ? "URL" : "Text"}
                                </label>
                                {editingRq.contentType === 'url' ? (
                                    <input
                                        type="url"
                                        required
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-400"
                                    />
                                ) : (
                                    <textarea
                                        required
                                        rows={4}
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="flex w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none placeholder:text-slate-400"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingRq(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors text-slate-700 dark:text-slate-300"
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
