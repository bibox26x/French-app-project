export default function ListingLoading() {
  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-6xl">
        <div className="mb-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>
        </div>

        {/* Photo grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] mb-10 rounded-xl overflow-hidden animate-pulse">
          <div className="col-span-1 md:col-span-2 bg-gray-200 h-full" />
          <div className="hidden md:block col-span-1 bg-gray-200 h-full" />
          <div className="hidden md:block col-span-1 bg-gray-200 h-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10 animate-pulse">
            <div className="flex items-center gap-4 pb-10 border-b border-border">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div>
                <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-32" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border border-border rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-10 bg-gray-100 rounded-lg w-full mb-4" />
              <div className="h-10 bg-gray-100 rounded-lg w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
