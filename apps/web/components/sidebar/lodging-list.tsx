"use client"

import {Search} from "lucide-react"
import {Badge} from "@workspace/ui/components/badge"
import {ScrollArea} from "@workspace/ui/components/scroll-area"
import {Skeleton} from "@workspace/ui/components/skeleton"
import {LodgingFilter} from "./filter"
import type {LodgingFilterParams, LodgingMarker} from "@/domain/lodging"

interface LodgingListProps {
    markers: LodgingMarker[]
    isLoading: boolean
    selectedMarker?: string | null
    onItemClick?: (marker: LodgingMarker) => void
    filters: LodgingFilterParams
    onFiltersChange: (filters: LodgingFilterParams) => void
    onSearchClick?: () => void
}

export function LodgingList({
                                markers,
                                isLoading,
                                selectedMarker,
                                onItemClick,
                                filters,
                                onFiltersChange,
                                onSearchClick,
                            }: LodgingListProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="shrink-0 border-b px-4 py-3">
                <button
                    type="button"
                    onClick={onSearchClick}
                    className="flex h-9 w-full items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                >
                    <Search className="h-4 w-4"/>
                    <span>업소명, 주소로 검색</span>
                </button>
                <p className="mt-2 text-sm text-muted-foreground">
                    현재 지도 영역 {markers.length}개
                </p>
            </div>

            <LodgingFilter filters={filters} onFiltersChange={onFiltersChange}/>

            {isLoading ? (
                <div className="flex-1 space-y-3 p-4">
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-5 w-3/4"/>
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-3 w-1/2"/>
                        </div>
                    ))}
                </div>
            ) : markers.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-4">
                    <p className="text-center text-muted-foreground">
                        현재 지도 영역에 표시할 숙박업소가 없습니다.
                    </p>
                </div>
            ) : (
                <ScrollArea className="min-h-0 flex-1">
                    <ul>
                        {markers.map((marker) => (
                            <li key={marker.mngNo}>
                                <button
                                    type="button"
                                    onClick={() => onItemClick?.(marker)}
                                    className={`w-full overflow-hidden border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                                        selectedMarker === marker.mngNo ? "bg-muted" : ""
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1 overflow-hidden">
                                            <h3 className="line-clamp-2 font-medium leading-snug">
                                                {marker.businessName}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {marker.roadAddress}
                                            </p>
                                            {marker.businessTypeName && (
                                                <Badge variant="outline" className="mt-1">
                                                    {marker.businessTypeName}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>
                      객실: {marker.roomCount.korean + marker.roomCount.western}개
                      (한실 {marker.roomCount.korean} / 양실{" "}
                        {marker.roomCount.western})
                    </span>
                                        {(marker.floorCount.ground > 0 ||
                                            marker.floorCount.underground > 0) && (
                                            <span>
                        층수: 지상 {marker.floorCount.ground}층
                                                {marker.floorCount.underground > 0 &&
                                                    ` / 지하 ${marker.floorCount.underground}층`}
                      </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            )}
        </div>
    )
}
