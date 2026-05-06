import prisma from "@/lib/db"
import { SearchResults } from "./SearchResults"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { city?: string }
}) {
  const resolvedSearch = await searchParams
  const cityFilter = resolvedSearch.city || ""

  const listings = await prisma.listing.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex-1 flex bg-gray-50 flex-col md:flex-row">
      <SearchResults initialListings={listings} cityFilter={cityFilter} />
    </div>
  )
}
