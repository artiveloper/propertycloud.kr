import { queryOptions } from "@tanstack/react-query"
import { lodgingQueryKeys } from "./lodging.query-keys"
import { fetchLodgingMarkers, fetchLodgingDetail } from "./lodging.apis"
import type { FetchMarkersParams } from "./lodging.types"

export const lodgingQueryOptions = {
  markers: (params: FetchMarkersParams) =>
    queryOptions({
      queryKey: lodgingQueryKeys.markers(params),
      queryFn: () => fetchLodgingMarkers(params),
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    }),

  detail: (mngNo: string) =>
    queryOptions({
      queryKey: lodgingQueryKeys.detail(mngNo),
      queryFn: () => fetchLodgingDetail(mngNo),
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
    }),
}
