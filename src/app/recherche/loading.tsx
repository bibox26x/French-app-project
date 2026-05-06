export default function SearchLoading() {
  return (
    <div className="flex-1 flex bg-gray-50 flex-col md:flex-row">
      {/* Sidebar skeleton */}
      <aside className="w-full md:w-64 lg:w-80 shrink-0 border-r border-border bg-white hidden md:block overflow-y-auto">
        <div className="p-6 space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-100 rounded-lg w-full" />
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1">
        <div className="bg-white border-b border-border p-4 md:px-6 hidden md:flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
