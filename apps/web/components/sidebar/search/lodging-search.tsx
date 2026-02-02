"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useDebounce } from "@/hooks"
import { fetchLodgingSearch } from "@/domain/lodging"
import type { LodgingMarker } from "@/domain/lodging"

interface LodgingSearchProps {
  onClose: () => void
  onItemClick: (marker: LodgingMarker) => void
}

export function LodgingSearch({ onClose, onItemClick }: LodgingSearchProps) {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<LodgingMarker[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const debouncedKeyword = useDebounce(keyword, 300)

  const performSearch = useCallback(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setResults([])
      setTotalCount(0)
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    try {
      const data = await fetchLodgingSearch({ keyword: searchKeyword, size: 50 })
      setResults(data.content)
      setTotalCount(data.totalElements)
    } catch (error) {
      console.error("Error fetching search results:", error)
      setResults([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    performSearch(debouncedKeyword)
  }, [debouncedKeyword, performSearch])

  const handleItemClick = (marker: LodgingMarker) => {
    onItemClick(marker)
    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="업소명, 주소로 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-9 pl-9 text-sm"
              autoFocus
            />
          </div>
        </div>
        {hasSearched && !isLoading && (
          <p className="mt-2 text-sm text-muted-foreground">
            검색 결과 {totalCount.toLocaleString()}개
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center text-muted-foreground">
            검색어를 입력해주세요
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center text-muted-foreground">
            검색 결과가 없습니다
          </p>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <ul>
            {results.map((marker) => (
              <li key={marker.mngNo}>
                <button
                  type="button"
                  onClick={() => handleItemClick(marker)}
                  className="w-full border-b px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium">
                          {marker.businessName}
                        </h3>
                        <Badge
                          variant={marker.isOpen ? "default" : "secondary"}
                          className={
                            marker.isOpen
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : ""
                          }
                        >
                          {marker.isOpen ? "영업중" : "폐업"}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {marker.roadAddress}
                      </p>
                      {marker.businessTypeName && (
                        <Badge variant="outline" className="mt-1">
                          {marker.businessTypeName}
                        </Badge>
                      )}
                    </div>
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
