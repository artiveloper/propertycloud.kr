import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog"
import {numberToHangulMixed} from "es-hangul"
import type {LodgingDetail} from "@/types/lodging"
import {DetailItem} from "./detail-item"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    detail: LodgingDetail
}

export function PotentialValueDialog({open, onOpenChange, detail}: Props) {
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
                        <div className="flex items-end gap-2">
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
