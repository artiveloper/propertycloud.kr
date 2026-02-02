import type { SourceAndUseRequest } from "./acquisition.types"

export const acquisitionQueryKeys = {
  all: ["acquisition"] as const,

  sourceAndUse: (params: SourceAndUseRequest) =>
    [...acquisitionQueryKeys.all, "sourceAndUse", params] as const,
}
