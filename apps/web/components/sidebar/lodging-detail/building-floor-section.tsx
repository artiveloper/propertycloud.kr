import type {BuildingFloorOutlineInfo} from "@/domain/lodging"

type FloorType = "rooftop" | "ground" | "basement"

type ParsedFloor = {
    type: FloorType
    number: number
    label: string
}

type GroupedFloor = {
    floor: ParsedFloor
    items: BuildingFloorOutlineInfo[]
    totalArea: number
    hasExcludedArea: boolean
}

function parseFloorName(floorNumberName: string | null): ParsedFloor {
    if (!floorNumberName) {
        return {type: "ground", number: 0, label: "-"}
    }

    // 옥탑층: "옥탑1층", "옥탑2층" 등
    const rooftopMatch = floorNumberName.match(/옥탑(\d+)층/)
    if (rooftopMatch && rooftopMatch[1]) {
        return {
            type: "rooftop",
            number: parseInt(rooftopMatch[1], 10),
            label: `옥탑${rooftopMatch[1]}층`,
        }
    }

    // 지하층: "지1층", "지2층" 등
    const basementMatch = floorNumberName.match(/지(\d+)층/)
    if (basementMatch && basementMatch[1]) {
        return {
            type: "basement",
            number: parseInt(basementMatch[1], 10),
            label: `B${basementMatch[1]}`,
        }
    }

    // 지상층: "1층", "2층" 등
    const groundMatch = floorNumberName.match(/(\d+)층/)
    if (groundMatch && groundMatch[1]) {
        return {
            type: "ground",
            number: parseInt(groundMatch[1], 10),
            label: `${groundMatch[1]}F`,
        }
    }

    return {type: "ground", number: 0, label: floorNumberName}
}

function groupAndSortFloors(floorInfos: BuildingFloorOutlineInfo[]): GroupedFloor[] {
    const floorMap = new Map<string, GroupedFloor>()

    for (const info of floorInfos) {
        const parsed = parseFloorName(info.floorNumberName)
        const key = `${parsed.type}-${parsed.number}`

        if (!floorMap.has(key)) {
            floorMap.set(key, {
                floor: parsed,
                items: [],
                totalArea: 0,
                hasExcludedArea: false,
            })
        }

        const group = floorMap.get(key)!
        group.items.push(info)
        if (info.area !== null) {
            group.totalArea += info.area
        }
        if (info.areaExclusionYn === "1") {
            group.hasExcludedArea = true
        }
    }

    const groups = Array.from(floorMap.values())

    // 정렬: 옥탑(높은순) > 지상(높은순) > 지하(낮은순)
    groups.sort((a, b) => {
        const typeOrder: Record<FloorType, number> = {rooftop: 0, ground: 1, basement: 2}
        const typeA = typeOrder[a.floor.type]
        const typeB = typeOrder[b.floor.type]

        if (typeA !== typeB) {
            return typeA - typeB
        }

        // 같은 타입 내에서 정렬
        if (a.floor.type === "basement") {
            // 지하: 숫자가 작을수록 위 (B1이 B2보다 위)
            return a.floor.number - b.floor.number
        }
        // 옥탑/지상: 숫자가 클수록 위
        return b.floor.number - a.floor.number
    })

    return groups
}

type Props = {
    floorInfos: BuildingFloorOutlineInfo[]
}

export function BuildingFloorSection({floorInfos}: Props) {
    const groupedFloors = groupAndSortFloors(floorInfos)
    const firstBasementIndex = groupedFloors.findIndex((g) => g.floor.type === "basement")

    return (
        <div>
            <h3 className="mb-3 text-base font-semibold">층별 정보</h3>
            <div className="overflow-hidden rounded-lg border">
                {groupedFloors.map((group, index) => {
                    const isRooftop = group.floor.type === "rooftop"
                    const isBasement = group.floor.type === "basement"
                    const isFirstBasement = index === firstBasementIndex

                    return (
                        <div
                            key={`${group.floor.type}-${group.floor.number}`}
                            className={`
                                flex border-b last:border-b-0
                                ${isRooftop ? "bg-slate-50" : ""}
                                ${isBasement ? "bg-amber-50/50" : ""}
                                ${isFirstBasement && !isRooftop ? "border-t-2 border-t-amber-300" : ""}
                            `}
                        >
                            {/* 층 라벨 */}
                            <div
                                className={`
                                    flex w-16 shrink-0 items-center justify-center border-r px-2 py-3 text-sm font-semibold
                                    ${isRooftop ? "bg-slate-100 text-slate-600" : ""}
                                    ${isBasement ? "bg-amber-100/50 text-amber-700" : ""}
                                    ${!isRooftop && !isBasement ? "bg-blue-50 text-blue-700" : ""}
                                `}
                            >
                                {group.floor.label}
                            </div>

                            {/* 층별 상세 */}
                            <div className="min-w-0 flex-1 px-3 py-2">
                                {group.items.map((item, itemIndex) => {
                                    const isExcluded = item.areaExclusionYn === "1"
                                    const purposeDisplay = item.mainPurposeName || item.etcPurpose || "-"

                                    return (
                                        <div
                                            key={itemIndex}
                                            className={`
                                                flex items-center justify-between gap-2 text-sm
                                                ${itemIndex > 0 ? "mt-1 border-t border-dashed pt-1" : ""}
                                                ${isExcluded ? "text-muted-foreground" : ""}
                                            `}
                                        >
                                            <span className="truncate">
                                                {purposeDisplay}
                                                {isExcluded && (
                                                    <span className="ml-1 text-xs text-orange-500">(면적제외)</span>
                                                )}
                                            </span>
                                            <span className="shrink-0 font-medium tabular-nums">
                                                {item.area !== null ? `${item.area.toLocaleString()}㎡` : "-"}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 범례 */}
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded border bg-slate-100"/>
                    <span>옥탑</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded border bg-blue-50"/>
                    <span>지상</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded border bg-amber-100/50"/>
                    <span>지하</span>
                </div>
            </div>
        </div>
    )
}
