import { queryOptions } from "@tanstack/react-query"
import { acquisitionQueryKeys } from "./acquisition.query-keys"
import { fetchSourceAndUse } from "./acquisition.apis"
import type { SourceAndUseRequest } from "./acquisition.types"

export const acquisitionQueryOptions = {
  sourceAndUse: (params: SourceAndUseRequest) =>
    queryOptions({
      queryKey: acquisitionQueryKeys.sourceAndUse(params),
      queryFn: () => fetchSourceAndUse(params),
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
    }),
}
