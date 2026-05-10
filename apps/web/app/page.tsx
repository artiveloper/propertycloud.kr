"use client"

import { useCallback, useState, Suspense } from "react"
import { useQueryStates } from "nuqs"
import { Card } from "@workspace/ui/components/card"
import { NaverMap } from "@/components/map/naver-map"
import { LodgingList } from "@/components/sidebar/lodging-list"
import { LodgingDetailView } from "@/components/sidebar/lodging-detail"
import { LodgingSearch } from "@/components/sidebar/search"
import {
  lodgingFilterParsers,
  useLodgingMarkers,
  useLodgingDetail,
} from "@/domain/lodging"
import type {
  LodgingMarker,
  LodgingFilterParams,
  Coordinate,
  MapBounds,
} from "@/domain/lodging"
import { useDebounce } from "@/hooks"

export default function Page() {
    return (
        <Suspense>
            <PageContent />
        </Suspense>
    )
}

function PageContent() {
    const [filters, setFilters] = useQueryStates(lodgingFilterParsers, {
        shallow: false,
    })

    const debouncedMinRoomCount = useDebounce(filters.minRoomCount, 300)

    const [bounds, setBounds] = useState<MapBounds | null>(null)
    const [selectedMngNo, setSelectedMngNo] = useState<string | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [panToPosition, setPanToPosition] = useState<Coordinate | null>(null)

    const filterParams: LodgingFilterParams = {
        businessType: filters.businessType ?? undefined,
        minRoomCount: debouncedMinRoomCount ?? undefined,
    }

    const { data: markersData, isLoading: isMarkersLoading } = useLodgingMarkers(
        bounds ? { bounds, filters: filterParams } : null
    )

    const { data: detail, isLoading: isDetailLoading } = useLodgingDetail(selectedMngNo)

    const markers = markersData?.markers ?? []

    const handleBoundsChange = useCallback((newBounds: MapBounds) => {
        setBounds(newBounds)
    }, [])

    const handleFiltersChange = useCallback(
        (newFilters: LodgingFilterParams) => {
            setFilters({
                businessType: newFilters.businessType ?? null,
                minRoomCount: newFilters.minRoomCount ?? null,
            })
        },
        [setFilters]
    )

    const handleMarkerSelect = useCallback((marker: LodgingMarker) => {
        setSelectedMngNo(marker.mngNo)
        setShowSearch(false)
        setShowDetail(true)
        if (marker.coordinate) {
            setPanToPosition({ ...marker.coordinate })
        }
    }, [])

    const handleCloseDetail = useCallback(() => {
        setShowDetail(false)
        setSelectedMngNo(null)
    }, [])

    return (
        <div className="relative h-full">
            <NaverMap
                markers={markers}
                onBoundsChange={handleBoundsChange}
                selectedMarker={selectedMngNo}
                onMarkerClick={handleMarkerSelect}
                panToPosition={panToPosition}
            />

            <Card className="absolute bottom-4 left-4 top-4 w-96 gap-0 overflow-hidden p-0">
                {showSearch ? (
                    <LodgingSearch
                        onClose={() => setShowSearch(false)}
                        onItemClick={handleMarkerSelect}
                    />
                ) : (
                    <LodgingList
                        markers={markers}
                        isLoading={isMarkersLoading}
                        selectedMarker={selectedMngNo}
                        onItemClick={handleMarkerSelect}
                        filters={filterParams}
                        onFiltersChange={handleFiltersChange}
                        onSearchClick={() => setShowSearch(true)}
                    />
                )}
            </Card>

            {showDetail && (
                <Card className="absolute bottom-4 left-[26rem] top-4 w-96 gap-0 overflow-hidden p-0">
                    <LodgingDetailView
                        detail={detail ?? null}
                        isLoading={isDetailLoading}
                        onClose={handleCloseDetail}
                    />
                </Card>
            )}
        </div>
    )
}
