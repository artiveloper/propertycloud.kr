"use client"

import {useState} from "react"
import {X} from "lucide-react"
import {Button} from "@workspace/ui/components/button"
import {ScrollArea} from "@workspace/ui/components/scroll-area"
import {Skeleton} from "@workspace/ui/components/skeleton"
import {formatToEok} from "@/utils/number-format"
import type {LodgingDetail} from "@/types/lodging"
import {DetailSection, DetailItem} from "./detail-item"
import {BuildingRegisterSection} from "./building-register-section"
import {BuildingFloorSection} from "./building-floor-section"
import {PotentialValueDialog} from "./potential-value-dialog"

type Props = {
    detail: LodgingDetail | null
    isLoading: boolean
    onClose: () => void
}

export function LodgingDetailView({detail, isLoading, onClose}: Props) {
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
                            <BuildingFloorSection floorInfos={detail.floorOutlineInfos}/>
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
