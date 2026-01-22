import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, DATABASE_ID, COLLECTION_ID, client } from "@/lib/appwrite"; // Added client export to lib/appwrite.ts needed
import { Query } from "appwrite";
import { useEffect } from "react";
import { toast } from "sonner";

export function useRQCodes(userId?: string) {
    const queryClient = useQueryClient();
    const queryKey = ["rqCodes", userId];

    const { data: rqCodes, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!userId) return [];
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
            );
            return response.documents;
        },
        enabled: !!userId,
    });

    // Realtime Subscription
    useEffect(() => {
        if (!userId) return;

        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
            (response) => {
                if (response.events.some(event => event.includes("create") || event.includes("update") || event.includes("delete"))) {
                    // Optimistic updates are hard with list filtering, so invalidation is safer and easier.
                    // Appwrite Realtime is fast enough.
                    queryClient.invalidateQueries({ queryKey });
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [userId, queryClient, queryKey]);

    return { rqCodes, isLoading, error };
}


export function useDeleteRQ() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        },
        onSuccess: () => {
            toast.success("RQ Code deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["rqCodes"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to delete");
        }
    });
}

export function useUpdateRQ() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, data);
        },
        onSuccess: () => {
            toast.success("Updated successfully");
            queryClient.invalidateQueries({ queryKey: ["rqCodes"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to update");
        }
    });
}
