import { useQuery } from "@tanstack/react-query"
import { acquisitionQueryOptions } from "./acquisition.query-options"
import type { SourceAndUseRequest } from "./acquisition.types"

export function useSourceAndUse(params: SourceAndUseRequest | null) {
  return useQuery({
    ...acquisitionQueryOptions.sourceAndUse(params!),
    enabled: params !== null && params.purchasePrice > 0 && params.roomCount > 0,
  })
}
