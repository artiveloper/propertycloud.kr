"use client"

import {useState} from "react"
import {X} from "lucide-react"
import {Button} from "@workspace/ui/components/button"
import {ScrollArea} from "@workspace/ui/components/scroll-area"
import {Skeleton} from "@workspace/ui/components/skeleton"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog"
import {formatToEok} from "@/utils/number-format"
import type {LodgingDetail, BuildingRegisterGeneralInfo, BuildingFloorOutlineInfo} from "@/types/lodging"
import {numberToHangulMixed} from "es-hangul"

interface LodgingDetailViewProps {
    detail: LodgingDetail | null
    isLoading: boolean
    onClose: () => void
}

export function LodgingDetailView({
                                      detail,
                                      isLoading,
                                      onClose,
                                  }: LodgingDetailViewProps) {
    const [isValueDialogOpen, setIsValueDialogOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="flex h-full flex-col">
                <div className="shrink-0 border-b px-4 py-3">
                    <Skeleton className="h-4 w-20"/>
                </div>
                <div className="flex-1 space-y-4 p-4">
                    <div className="flex items-start justify-between">
                        <Skeleton className="h-6 w-32"/>
                        <Skeleton className="h-5 w-14"/>
                    </div>
                    <Skeleton className="h-4 w-24"/>
                    <div className="space-y-4 pt-4">
                        {Array.from({length: 4}).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20"/>
                                <Skeleton className="h-20 w-full rounded-lg"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!detail) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-muted-foreground">
                    정보를 불러올 수 없습니다.
                </p>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">상세 정보</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4"/>
                </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="p-4">
                    <div className="space-y-6">
                        {/* 잠재가치추정 */}
                        {detail.potentialValue && (
                            <div className="rounded-lg bg-primary/5 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">잠재가치추정</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                                        onClick={() => setIsValueDialogOpen(true)}
                                    >
                                        상세보기
                                    </Button>
                                </div>
                                <p className="mt-1 text-2xl font-bold text-primary">
                                    {formatToEok(detail.potentialValue.result.assetValue)}
                                </p>
                            </div>
                        )}

                        <DetailSection title="기본 정보">
                            <DetailItem label="사업장명" value={detail.businessName}/>
                            {detail.businessTypeName && (
                                <DetailItem label="업태구분" value={detail.businessTypeName}/>
                            )}
                            <DetailItem
                                label="객실수"
                                value={`총 ${detail.roomCount.korean + detail.roomCount.western}개 (한실 ${detail.roomCount.korean} / 양실 ${detail.roomCount.western})`}
                            />
                            <DetailItem
                                label="층수"
                                value={`지상 ${detail.floorCount.ground}층${detail.floorCount.underground > 0 ? ` / 지하 ${detail.floorCount.underground}층` : ""}`}
                            />
                            {detail.licenseDate && (
                                <DetailItem label="허가일" value={detail.licenseDate}/>
                            )}
                        </DetailSection>

                        <DetailSection title="주소">
                            {detail.address.roadAddress && (
                                <DetailItem label="도로명" value={detail.address.roadAddress}/>
                            )}
                            {detail.address.jibunAddress && (
                                <DetailItem label="지번" value={detail.address.jibunAddress}/>
                            )}
                            {detail.address.roadZipCode && (
                                <DetailItem label="우편번호" value={detail.address.roadZipCode}/>
                            )}
                        </DetailSection>

                        {detail.buildingRegisterGeneralInfo && (
                            <BuildingRegisterSection info={detail.buildingRegisterGeneralInfo}/>
                        )}

                        {detail.floorOutlineInfos && detail.floorOutlineInfos.length > 0 && (
                            <BuildingCrossSectionView floorInfos={detail.floorOutlineInfos}/>
                        )}

                        <DetailSection title="기타 정보">
                            {detail.lastModifiedAt && (
                                <DetailItem label="최종 수정일" value={detail.lastModifiedAt}/>
                            )}
                        </DetailSection>
                    </div>
                </div>
            </ScrollArea>

            <PotentialValueDialog
                open={isValueDialogOpen}
                onOpenChange={setIsValueDialogOpen}
                detail={detail}
            />
        </div>
    )
}

function PotentialValueDialog({
                                  open,
                                  onOpenChange,
                                  detail,
                              }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    detail: LodgingDetail
}) {
    const formatCurrency = (value: number) =>
        Math.round(value).toLocaleString() + "원"

    const potentialValue = detail.potentialValue

    if (!potentialValue) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>잠재가치추정</DialogTitle>
                        <DialogDescription>
                            {detail.businessName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">
                            잠재가치 정보를 불러올 수 없습니다.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    const {input, result} = potentialValue

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>잠재가치추정</DialogTitle>
                    <DialogDescription>
                        {detail.businessName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* 기본 정보 */}
                    <div>
                        <h3 className="mb-3 text-base font-semibold">기본 정보</h3>
                        <div className="space-y-2">
                            <DetailItem label="객실수" value={`${input.roomCount}개`}/>
                            <DetailItem label="영업일수" value={`${input.operatingDays}일`}/>
                            <DetailItem label="ADR (숙박)" value={formatCurrency(input.adr)}/>
                            <DetailItem label="OCC" value={`${input.occ}%`}/>
                            <DetailItem label="ADR (대실)" value={`${input.adrDaesil.toLocaleString()}원`}/>
                            <DetailItem label="영업비용율" value={`${input.opexRatio}%`}/>
                            <DetailItem label="Cap Rate" value={`${input.capRate}%`}/>
                        </div>
                    </div>

                    {/* 계산 결과 */}
                    <div>
                        <h3 className="mb-3 text-base font-semibold">계산 결과</h3>
                        <div className="space-y-2">
                            <DetailItem label="연매출" value={formatCurrency(result.annualRevenue)}/>
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="shrink-0 text-muted-foreground">영업비용 ({input.opexRatio}%)</span>
                                <span className="break-words text-right font-medium text-red-600">
                                    -{formatCurrency(result.operatingExpense)}
                                </span>
                            </div>
                            <DetailItem label="NOI" value={formatCurrency(result.noi)}/>
                        </div>
                    </div>

                    {/* 자산가치 추정 */}
                    <div>
                        <div className="mb-3 flex items-baseline gap-2">
                            <h3 className="text-base font-semibold">자산가치추정</h3>
                            <span className="text-xs text-muted-foreground">
                                NOI ÷ Cap Rate
                            </span>
                        </div>
                        <div className="flex gap-2 items-end">
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(result.assetValue)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {numberToHangulMixed(result.assetValue, {spacing: true})}원
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function DetailSection({
                           title,
                           children,
                       }: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div>
            <h3 className="mb-3 text-base font-semibold">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    )
}

function DetailItem({label, value}: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="break-words text-right font-medium">{value}</span>
        </div>
    )
}

function BuildingRegisterSection({info}: { info: BuildingRegisterGeneralInfo }) {
    const formatArea = (value: number | null) =>
        value !== null ? `${value.toLocaleString()}㎡` : null

    const formatRatio = (value: number | null) =>
        value !== null ? `${value}%` : null

    const formatCount = (value: number | null) =>
        value !== null ? `${value}대` : null

    return (
        <DetailSection title="건축물대장">
            {info.landArea !== null && (
                <DetailItem label="대지면적" value={formatArea(info.landArea)!}/>
            )}
            {info.architectureArea !== null && (
                <DetailItem label="건축면적" value={formatArea(info.architectureArea)!}/>
            )}
            {info.buildingCoverageRatio !== null && (
                <DetailItem label="건폐율" value={formatRatio(info.buildingCoverageRatio)!}/>
            )}
            {info.totalArea !== null && (
                <DetailItem label="연면적" value={formatArea(info.totalArea)!}/>
            )}
            {info.floorAreaRatioCalcArea !== null && (
                <DetailItem label="용적률산정연면적" value={formatArea(info.floorAreaRatioCalcArea)!}/>
            )}
            {info.floorAreaRatio !== null && (
                <DetailItem label="용적률" value={formatRatio(info.floorAreaRatio)!}/>
            )}
            {info.mainPurposeName && (
                <DetailItem label="주용도" value={info.mainPurposeName}/>
            )}
            {info.etcPurpose && (
                <DetailItem label="기타용도" value={info.etcPurpose}/>
            )}
            {info.totalParkingCount !== null && (
                <DetailItem label="총주차수" value={formatCount(info.totalParkingCount)!}/>
            )}
            {info.indoorMechanicalCount !== null && (
                <DetailItem label="옥내기계식" value={formatCount(info.indoorMechanicalCount)!}/>
            )}
            {info.indoorSelfParkingCount !== null && (
                <DetailItem label="옥내자주식" value={formatCount(info.indoorSelfParkingCount)!}/>
            )}
            {info.outdoorSelfParkingCount !== null && (
                <DetailItem label="옥외자주식" value={formatCount(info.outdoorSelfParkingCount)!}/>
            )}
            {info.permitDate && (
                <DetailItem label="허가일" value={info.permitDate}/>
            )}
            {info.constructionStartDate && (
                <DetailItem label="착공일" value={info.constructionStartDate}/>
            )}
            {info.useApprovalDate && (
                <DetailItem label="사용승인일" value={info.useApprovalDate}/>
            )}
        </DetailSection>
    )
}

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

function BuildingCrossSectionView({floorInfos}: { floorInfos: BuildingFloorOutlineInfo[] }) {
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
