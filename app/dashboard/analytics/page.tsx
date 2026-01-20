"use client";
import { useEffect, useState } from "react";
import { account, databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [rqData, setRqData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const session = await account.get();
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("userId", session.$id), Query.orderDesc("scanCount"), Query.limit(5)]
                );

                // Format data for chart
                const formattedData = response.documents.map(doc => ({
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

    if (loading) return <div className="p-8 animate-pulse">Loading analytics...</div>;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Top RQs Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Top Performing RQs</CardTitle>
                        <CardDescription>
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
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar
                                            dataKey="scans"
                                            fill="#2563eb"
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-zinc-400">
                                    No scan data available yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Placeholder for Recent Activity or Other Stats */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Activity Summary</CardTitle>
                        <CardDescription>
                            Quick insights into your performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {rqData.slice(0, 3).map((item, index) => (
                                <div key={item.fullSlug} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-sm text-zinc-500">{item.scans} total scans</p>
                                    </div>
                                    <div className="ml-auto font-medium">#{index + 1}</div>
                                </div>
                            ))}
                            {rqData.length === 0 && <div className="text-zinc-400 text-sm">No activity to show.</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
