export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        <div className="lg:col-span-3 space-y-8">
                            <div className="h-96 bg-gray-300 rounded-2xl" />
                            <div className="h-16 bg-gray-300 rounded w-full" />
                            <div className="space-y-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-300 rounded w-full" />
                                ))}
                            </div>
                        </div>
                        <div className="h-96 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}