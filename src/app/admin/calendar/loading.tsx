import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col p-6">
            <div className="flex justify-between items-end mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-10 w-[150px]" />
            </div>

            <div className="flex-1 border border-white/5 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-[200px]" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-4 h-full">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-32 w-full opacity-50" />
                            <Skeleton className="h-20 w-full opacity-30" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
