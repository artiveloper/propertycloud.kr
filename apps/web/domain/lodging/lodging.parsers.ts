import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

export const lodgingFilterParsers = {
  businessType: parseAsString,
  minRoomCount: parseAsInteger,
}

export const lodgingFilterCache = createSearchParamsCache(lodgingFilterParsers)
