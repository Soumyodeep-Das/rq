"use client";
import { useEffect, useState } from "react";
import { tables, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [rqData, setRqData] = useState<any[]>([]);
    const { user } = useAuthStore();

    useEffect(() => {
        async function fetchData() {
            if (!user) return;
            try {
                const response = await tables.listRows({
                    databaseId: DATABASE_ID,
                    tableId: COLLECTION_ID,
                    queries: [Query.equal("userId", user.$id), Query.orderDesc("scanCount"), Query.limit(5)]
                });

                // Format data for chart
                const formattedData = response.rows.map(doc => ({
                    name: `/${doc.slug}`,
                    scans: doc.scanCount,
                    fullSlug: doc.slug
                }));
                setRqData(formattedData);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="col-span-3 h-[400px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Top RQs Chart */}
                <Card className="col-span-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">Top Performing RQs</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            Your content with the most engagement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            {rqData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={rqData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                backgroundColor: '#0f172a', /* slate-900 */
                                                color: '#f8fafc',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
                                            }}
                                        />
                                        <Bar
                                            dataKey="scans"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">
                                    No scan data available yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Placeholder for Recent Activity or Other Stats */}
                <Card className="col-span-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">Activity Summary</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            Quick insights into your performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {rqData.slice(0, 3).map((item, index) => (
                                <div key={item.fullSlug} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{item.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.scans} total scans</p>
                                    </div>
                                    <div className="ml-auto font-medium text-slate-900 dark:text-slate-100">#{index + 1}</div>
                                </div>
                            ))}
                            {rqData.length === 0 && <div className="text-slate-400 text-sm">No activity to show.</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
