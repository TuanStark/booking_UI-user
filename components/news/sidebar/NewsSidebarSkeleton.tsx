export default function NewsSidebarSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="relative">
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-4">
                    <div className="h-7 bg-white/30 rounded w-32" />
                </div>
                <div className="divide-y divide-gray-100">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="px-6 py-4 flex justify-between">
                            <div className="h-5 bg-gray-200 rounded w-24" />
                            <div className="h-5 bg-gray-200 rounded w-12" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-4">
                    <div className="h-7 bg-white/30 rounded w-40" />
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-24 mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}