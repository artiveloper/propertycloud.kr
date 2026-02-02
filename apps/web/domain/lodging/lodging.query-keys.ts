import type { FetchMarkersParams } from "./lodging.types"

export const lodgingQueryKeys = {
  all: ["lodging"] as const,

  markers: (params: FetchMarkersParams) =>
    [...lodgingQueryKeys.all, "markers", params] as const,

  detail: (mngNo: string) =>
    [...lodgingQueryKeys.all, "detail", mngNo] as const,
}
