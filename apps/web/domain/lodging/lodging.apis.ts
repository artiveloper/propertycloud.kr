import type {
  MarkersResponse,
  LodgingDetail,
  LodgingFiltersResponse,
  LodgingSearchResponse,
  FetchMarkersParams,
} from "./lodging.types"

const API_BASE_URL = "http://localhost:8080/api/v1"

export async function fetchLodgingMarkers({
  bounds,
  filters,
}: FetchMarkersParams): Promise<MarkersResponse> {
  const params = new URLSearchParams({
    minX: bounds.minX.toString(),
    maxX: bounds.maxX.toString(),
    minY: bounds.minY.toString(),
    maxY: bounds.maxY.toString(),
  })

  if (filters.businessType) {
    params.set("businessType", filters.businessType)
  }
  if (filters.minRoomCount !== undefined) {
    params.set("minRoomCount", String(filters.minRoomCount))
  }

  const response = await fetch(`${API_BASE_URL}/lodging/markers?${params}`)

  if (!response.ok) {
    throw new Error("Failed to fetch markers")
  }

  return response.json()
}

export async function fetchLodgingDetail(mngNo: string): Promise<LodgingDetail> {
  const response = await fetch(`${API_BASE_URL}/lodging/${mngNo}`)

  if (!response.ok) {
    throw new Error("Failed to fetch lodging detail")
  }

  return response.json()
}

export async function fetchLodgingFilters(): Promise<LodgingFiltersResponse> {
  const response = await fetch(`${API_BASE_URL}/lodging/filters`)

  if (!response.ok) {
    throw new Error("Failed to fetch lodging filters")
  }

  return response.json()
}

export type FetchLodgingSearchParams = {
  keyword: string
  size?: number
}

export async function fetchLodgingSearch({
  keyword,
  size = 50,
}: FetchLodgingSearchParams): Promise<LodgingSearchResponse> {
  const params = new URLSearchParams({
    keyword,
    size: String(size),
  })

  const response = await fetch(`${API_BASE_URL}/lodging/search?${params}`)

  if (!response.ok) {
    throw new Error("Failed to fetch search results")
  }

  return response.json()
}
