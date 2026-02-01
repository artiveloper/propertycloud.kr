"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useQueryStates } from "nuqs"
import { Card } from "@workspace/ui/components/card"
import { NaverMap } from "@/components/map/naver-map"
import { LodgingList } from "@/components/sidebar/lodging-list"
import { LodgingDetailView } from "@/components/sidebar/lodging-detail"
import { LodgingSearch } from "@/components/sidebar/search"
import { lodgingFilterParsers } from "@/domain/lodging"
import { useDebounce } from "@/hooks"
import type {
  LodgingMarker,
  LodgingDetail,
  MarkersResponse,
  LodgingFilterParams,
  Coordinate,
} from "@/types/lodging"

interface MapBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export default function Page() {
  const [filters, setFilters] = useQueryStates(lodgingFilterParsers, {
    shallow: false,
  })

  const debouncedMinRoomCount = useDebounce(filters.minRoomCount, 300)

  const [markers, setMarkers] = useState<LodgingMarker[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [detail, setDetail] = useState<LodgingDetail | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [panToPosition, setPanToPosition] = useState<Coordinate | null>(null)
  const boundsRef = useRef<MapBounds | null>(null)

  const fetchMarkers = useCallback(
    async (bounds: MapBounds, filterParams: LodgingFilterParams) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          minX: bounds.minX.toString(),
          maxX: bounds.maxX.toString(),
          minY: bounds.minY.toString(),
          maxY: bounds.maxY.toString(),
        })

        if (filterParams.businessType) {
          params.set("businessType", filterParams.businessType)
        }
        if (filterParams.isOpen !== undefined) {
          params.set("isOpen", String(filterParams.isOpen))
        }
        if (filterParams.minRoomCount !== undefined) {
          params.set("minRoomCount", String(filterParams.minRoomCount))
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/lodging/markers?${params}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch markers")
        }

        const data: MarkersResponse = await response.json()
        setMarkers(data.markers)
      } catch (error) {
        console.error("Error fetching markers:", error)
        setMarkers([])
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      boundsRef.current = bounds
      fetchMarkers(bounds, {
        businessType: filters.businessType ?? undefined,
        isOpen: filters.isOpen ?? undefined,
        minRoomCount: debouncedMinRoomCount ?? undefined,
      })
    },
    [fetchMarkers, filters.businessType, filters.isOpen, debouncedMinRoomCount]
  )

  // 필터 변경 시 마커 재조회
  useEffect(() => {
    if (boundsRef.current) {
      fetchMarkers(boundsRef.current, {
        businessType: filters.businessType ?? undefined,
        isOpen: filters.isOpen ?? undefined,
        minRoomCount: debouncedMinRoomCount ?? undefined,
      })
    }
  }, [filters.businessType, filters.isOpen, debouncedMinRoomCount, fetchMarkers])

  const handleFiltersChange = useCallback(
    (newFilters: LodgingFilterParams) => {
      setFilters({
        businessType: newFilters.businessType ?? null,
        isOpen: newFilters.isOpen ?? null,
        minRoomCount: newFilters.minRoomCount ?? null,
      })
    },
    [setFilters]
  )

  const fetchDetail = useCallback(async (mngNo: string) => {
    setIsDetailLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/lodging/${mngNo}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch detail")
      }

      const data: LodgingDetail = await response.json()
      setDetail(data)
    } catch (error) {
      console.error("Error fetching detail:", error)
      setDetail(null)
    } finally {
      setIsDetailLoading(false)
    }
  }, [])

  const handleMarkerSelect = useCallback(
    (marker: LodgingMarker) => {
      setSelectedMarker(marker.mngNo)
      setShowSearch(false)
      setShowDetail(true)
      fetchDetail(marker.mngNo)
      if (marker.coordinate) {
        setPanToPosition({ ...marker.coordinate })
      }
    },
    [fetchDetail]
  )

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setSelectedMarker(null)
    setDetail(null)
  }, [])

  const filterParams: LodgingFilterParams = {
    businessType: filters.businessType ?? undefined,
    isOpen: filters.isOpen ?? undefined,
    minRoomCount: filters.minRoomCount ?? undefined,
  }

  return (
    <div className="relative h-full">
      {/* 지도 - 전체 화면 */}
      <NaverMap
        markers={markers}
        onBoundsChange={handleBoundsChange}
        selectedMarker={selectedMarker}
        onMarkerClick={handleMarkerSelect}
        panToPosition={panToPosition}
      />

      {/* 플로팅 사이드바 - 리스트 */}
      <Card className="absolute bottom-4 left-4 top-4 w-96 gap-0 overflow-hidden p-0">
        {showSearch ? (
          <LodgingSearch
            onClose={() => setShowSearch(false)}
            onItemClick={handleMarkerSelect}
          />
        ) : (
          <LodgingList
            markers={markers}
            isLoading={isLoading}
            selectedMarker={selectedMarker}
            onItemClick={handleMarkerSelect}
            filters={filterParams}
            onFiltersChange={handleFiltersChange}
            onSearchClick={() => setShowSearch(true)}
          />
        )}
      </Card>

      {/* 상세 패널 - 사이드바 오른쪽 */}
      {showDetail && (
        <Card className="absolute bottom-4 left-[26rem] top-4 w-96 gap-0 overflow-hidden p-0">
          <LodgingDetailView
            detail={detail}
            isLoading={isDetailLoading}
            onClose={handleCloseDetail}
          />
        </Card>
      )}
    </div>
  )
}
