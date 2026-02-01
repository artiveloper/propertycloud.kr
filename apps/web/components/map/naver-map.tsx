"use client"

import { useEffect, useRef, useState } from "react"
import type { LodgingMarker } from "@/types/lodging"

interface MapBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

interface Coordinate {
  x: number
  y: number
}

interface NaverMapProps {
  markers: LodgingMarker[]
  onBoundsChange: (bounds: MapBounds) => void
  selectedMarker?: string | null
  onMarkerClick?: (marker: LodgingMarker) => void
  panToPosition?: Coordinate | null
}

export function NaverMap({
  markers,
  onBoundsChange,
  selectedMarker,
  onMarkerClick,
  panToPosition,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const markersRef = useRef<naver.maps.Marker[]>([])
  const onBoundsChangeRef = useRef(onBoundsChange)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastBoundsRef = useRef<MapBounds | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const prevSelectedMarkerRef = useRef<string | null>(null)

  // ref 업데이트
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange
  }, [onBoundsChange])

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
    if (!clientId) {
      console.error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is not defined")
      return
    }

    if (window.naver && window.naver.maps) {
      setIsMapReady(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
    script.async = true
    script.onload = () => setIsMapReady(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!isMapReady || !mapRef.current || mapInstanceRef.current) return

    const mapOptions: naver.maps.MapOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 시청
      zoom: 14,
      minZoom: 10,
      maxZoom: 19,
    }

    const map = new window.naver.maps.Map(mapRef.current, mapOptions)
    mapInstanceRef.current = map

    const notifyBoundsChange = (bounds: MapBounds) => {
      // 이전 bounds와 비교하여 의미있는 변경인지 확인
      const last = lastBoundsRef.current
      if (last) {
        const threshold = 0.0001
        const isSame =
          Math.abs(last.minX - bounds.minX) < threshold &&
          Math.abs(last.maxX - bounds.maxX) < threshold &&
          Math.abs(last.minY - bounds.minY) < threshold &&
          Math.abs(last.maxY - bounds.maxY) < threshold
        if (isSame) return
      }
      lastBoundsRef.current = bounds
      onBoundsChangeRef.current(bounds)
    }

    // 초기 bounds 전달
    const initialBounds = map.getBounds()
    notifyBoundsChange({
      minX: initialBounds.getMin().x,
      maxX: initialBounds.getMax().x,
      minY: initialBounds.getMin().y,
      maxY: initialBounds.getMax().y,
    })

    // bounds 변경 이벤트 리스너 (디바운스 적용)
    window.naver.maps.Event.addListener(map, "idle", () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        const newBounds = map.getBounds()
        notifyBoundsChange({
          minX: newBounds.getMin().x,
          maxX: newBounds.getMax().x,
          minY: newBounds.getMin().y,
          maxY: newBounds.getMax().y,
        })
      }, 300)
    })

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [isMapReady])

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // 새 마커 생성
    markers.forEach((lodging) => {
      if (!lodging.coordinate) return

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          lodging.coordinate.y,
          lodging.coordinate.x
        ),
        map: mapInstanceRef.current!,
        title: lodging.businessName,
        icon: {
          content: `
            <div class="marker ${selectedMarker === lodging.mngNo ? "selected" : ""} ${lodging.isOpen ? "open" : "closed"}">
              <span>${lodging.roomCount.korean + lodging.roomCount.western}</span>
            </div>
          `,
          anchor: new window.naver.maps.Point(20, 20),
        },
      })

      window.naver.maps.Event.addListener(marker, "click", () => {
        onMarkerClick?.(lodging)
      })

      markersRef.current.push(marker)
    })
  }, [markers, isMapReady, selectedMarker, onMarkerClick])

  // 선택된 마커로 이동 (selectedMarker가 실제로 변경될 때만)
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedMarker) {
      prevSelectedMarkerRef.current = selectedMarker ?? null
      return
    }

    // selectedMarker가 실제로 변경된 경우에만 이동 실행
    if (prevSelectedMarkerRef.current === selectedMarker) return
    prevSelectedMarkerRef.current = selectedMarker

    const lodging = markers.find((m) => m.mngNo === selectedMarker)
    if (lodging?.coordinate) {
      const targetPosition = new window.naver.maps.LatLng(
        lodging.coordinate.y,
        lodging.coordinate.x
      )
      const focusZoomLevel = 17
      mapInstanceRef.current.morph(targetPosition, focusZoomLevel)
    }
  }, [selectedMarker, markers])

  // panToPosition으로 이동 (검색 결과 선택 시)
  useEffect(() => {
    if (!mapInstanceRef.current || !panToPosition) return

    mapInstanceRef.current.panTo(
      new window.naver.maps.LatLng(panToPosition.y, panToPosition.x)
    )
  }, [panToPosition])

  if (!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">
          네이버 지도 API 키를 설정해주세요.
        </p>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        .marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }
        .marker.closed {
          background-color: #9ca3af;
        }
        .marker.selected {
          transform: scale(1.2);
          background-color: #1d4ed8;
          z-index: 100;
        }
        .marker:hover {
          transform: scale(1.1);
        }
      `}</style>
      <div ref={mapRef} className="h-full w-full" />
    </>
  )
}
