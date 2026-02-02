import { QueryClient } from "@tanstack/react-query"
import { lodgingQueryOptions } from "./lodging.query-options"
import type { FetchMarkersParams } from "./lodging.types"

export const lodgingPrefetch = {
  async markers(queryClient: QueryClient, params: FetchMarkersParams) {
    await queryClient.prefetchQuery(lodgingQueryOptions.markers(params))
  },

  async detail(queryClient: QueryClient, mngNo: string) {
    await queryClient.prefetchQuery(lodgingQueryOptions.detail(mngNo))
  },
}
