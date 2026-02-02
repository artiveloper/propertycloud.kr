import { useQuery } from "@tanstack/react-query"
import { lodgingQueryOptions } from "./lodging.query-options"
import type { FetchMarkersParams } from "./lodging.types"

export function useLodgingMarkers(
  params: FetchMarkersParams | null
) {
  return useQuery({
    ...lodgingQueryOptions.markers(params!),
    enabled: params !== null,
  })
}

export function useLodgingDetail(mngNo: string | null) {
  return useQuery({
    ...lodgingQueryOptions.detail(mngNo!),
    enabled: mngNo !== null,
  })
}
