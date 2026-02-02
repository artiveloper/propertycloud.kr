"use client"

import {useState, useEffect} from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog"
import {Input} from "@workspace/ui/components/input"
import {Label} from "@workspace/ui/components/label"
import {Skeleton} from "@workspace/ui/components/skeleton"
import {numberToHangulMixed} from "es-hangul"
import type {LodgingDetail} from "@/domain/lodging"
import {useSourceAndUse} from "@/domain/acquisition"
import {useDebounce} from "@/hooks"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    detail: LodgingDetail
}

export function InvestmentSimulationDialog({open, onOpenChange, detail}: Props) {
    const roomCount = detail.roomCount.korean + detail.roomCount.western
    const lodgingAdr = detail.marketStats?.avgAdr ?? 0
    const [purchasePrice, setPurchasePrice] = useState("")

    useEffect(() => {
        if (open) {
            setPurchasePrice("")
        }
    }, [open])

    const purchasePriceNumber = parseInt(purchasePrice.replace(/,/g, ""), 10) || 0
    const debouncedPurchasePrice = useDebounce(purchasePriceNumber, 500)

    const {data, isLoading, isFetching} = useSourceAndUse(
        debouncedPurchasePrice > 0 && roomCount > 0 && lodgingAdr > 0
            ? {purchasePrice: debouncedPurchasePrice, roomCount, lodgingAdr}
            : null
    )

    const formatCurrency = (value: number) =>
        Math.round(value).toLocaleString() + "원"

    const handlePurchasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "")
        if (value) {
            setPurchasePrice(parseInt(value, 10).toLocaleString())
        } else {
            setPurchasePrice("")
        }
    }

    console.log('data:', data)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>투자 시뮬레이션</DialogTitle>
                    <DialogDescription>{detail.businessName}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* 시뮬레이션 입력 */}
                    <div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">매매가 (원)</Label>
                                <Input
                                    id="purchasePrice"
                                    placeholder="예: 1,000,000,000"
                                    value={purchasePrice}
                                    onChange={handlePurchasePriceChange}
                                />
                                {purchasePriceNumber > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {numberToHangulMixed(purchasePriceNumber, {spacing: true})}원
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">객실 수</span>
                                <span className="font-medium">{roomCount}개</span>
                            </div>
                        </div>
                    </div>

                    {/* 로딩 */}
                    {(isLoading || isFetching) && debouncedPurchasePrice > 0 && roomCount > 0 && (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-32"/>
                            <Skeleton className="h-24 w-full"/>
                            <Skeleton className="h-6 w-32"/>
                            <Skeleton className="h-32 w-full"/>
                        </div>
                    )}

                    {data && !isFetching && (
                        <>
                            <hr className="border-t"/>

                            {/* 인수 시 Source & Use */}
                            <div>
                                <h3 className="mb-4 text-base font-semibold">인수 시 Source & Use</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* 자금 조달 (Sources) */}
                                    <div>
                                        <h4 className="mb-3 text-sm font-semibold text-muted-foreground">자금 조달 (Sources)</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    대출금
                                                    <span className="ml-1 text-xs">
                                                        ({data.sourceAndUse.sources.loanDescription}, {data.sourceAndUse.sources.loanRatio.toFixed(1)}%)
                                                    </span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.sources.loanAmount)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    자기자본
                                                    <span className="ml-1 text-xs">({data.sourceAndUse.sources.equityRatio.toFixed(1)}%)</span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.sources.equity)}</span>
                                            </div>
                                            <div className="mt-2 border-t pt-2">
                                                <div className="flex justify-between font-semibold">
                                                    <span>합계</span>
                                                    <span className="text-primary">{formatCurrency(data.sourceAndUse.sources.total)}</span>
                                                </div>
                                                <p className="text-right text-xs text-muted-foreground">
                                                    {numberToHangulMixed(data.sourceAndUse.sources.total, {spacing: true})}원
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 자금 사용 (Uses) */}
                                    <div>
                                        <h4 className="mb-3 text-sm font-semibold text-muted-foreground">자금 사용 (Uses)</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    매매가
                                                    <span className="ml-1 text-xs">({data.sourceAndUse.uses.purchasePriceDescription})</span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.uses.purchasePrice)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    취등록세
                                                    <span className="ml-1 text-xs">({data.sourceAndUse.uses.acquisitionTaxDescription})</span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.uses.acquisitionTax)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    리모델링비
                                                    <span className="ml-1 text-xs">({data.sourceAndUse.uses.remodelingCostDescription})</span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.uses.remodelingCost)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    금융비
                                                    <span className="ml-1 text-xs">
                                                        ({data.sourceAndUse.uses.financeCostDescription}, 금리 {data.sourceAndUse.uses.interestRate}%)
                                                    </span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.uses.financeCost)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    예비비
                                                    <span className="ml-1 text-xs">({data.sourceAndUse.uses.contingencyDescription})</span>
                                                </span>
                                                <span className="font-medium">{formatCurrency(data.sourceAndUse.uses.contingency)}</span>
                                            </div>
                                            <div className="mt-2 border-t pt-2">
                                                <div className="flex justify-between font-semibold">
                                                    <span>합계</span>
                                                    <span className="text-primary">{formatCurrency(data.sourceAndUse.uses.total)}</span>
                                                </div>
                                                <p className="text-right text-xs text-muted-foreground">
                                                    {numberToHangulMixed(data.sourceAndUse.uses.total, {spacing: true})}원
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-t"/>

                            {/* Equity 수익률 추정 */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="mb-4 text-base font-semibold">Equity 수익률 추정</h3>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">운영기간</span>
                                            <span className="font-medium">{data.equityReturn.assumptions.operatingPeriodYears}년</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">리파이낸싱 금리</span>
                                            <span className="font-medium">{data.equityReturn.assumptions.refinanceInterestRate}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">숙박 ADR</span>
                                            <span className="font-medium">{lodgingAdr.toLocaleString()}원</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">대실 ADR</span>
                                            <span className="font-medium">{data.equityReturn.assumptions.partTimeAdr.toLocaleString()}원</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">OCC</span>
                                            <span className="font-medium">{data.equityReturn.assumptions.occupancyRate}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 예상 운영 현금흐름 */}
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">예상 운영 현금흐름</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b text-muted-foreground">
                                                    <th className="pb-2 pr-2 text-left" colSpan={2}>구분</th>
                                                    <th className="pb-2 px-2 text-right whitespace-nowrap">인수시점</th>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <th key={cf.period} className="pb-2 px-2 text-right whitespace-nowrap">{cf.period}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b">
                                                    <td rowSpan={3} className="py-1.5 pr-2 text-muted-foreground align-top">매출</td>
                                                    <td className="py-1.5 pr-2 text-muted-foreground">숙박</td>
                                                    <td className="py-1.5 px-2 text-right">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right">{cf.lodgingRevenue.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="py-1.5 pr-2 text-muted-foreground">대실</td>
                                                    <td className="py-1.5 px-2 text-right">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right">{cf.partTimeRevenue.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b bg-muted/30">
                                                    <td className="py-1.5 pr-2 font-medium">매출계</td>
                                                    <td className="py-1.5 px-2 text-right font-medium">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right font-medium">{cf.totalRevenue.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="py-1.5 pr-2 text-muted-foreground">운영비용</td>
                                                    <td className="py-1.5 pr-2 text-muted-foreground text-xs">매출의 40%</td>
                                                    <td className="py-1.5 px-2 text-right">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right text-red-600">-{cf.operatingExpense.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b bg-muted/30">
                                                    <td colSpan={2} className="py-1.5 pr-2 font-medium">NOI</td>
                                                    <td className="py-1.5 px-2 text-right font-medium">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right font-medium">{cf.noi.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b">
                                                    <td colSpan={2} className="py-1.5 pr-2 text-muted-foreground">금융비용</td>
                                                    <td className="py-1.5 px-2 text-right">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right text-red-600">-{cf.financeCost.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                                <tr className="bg-muted/50">
                                                    <td colSpan={2} className="py-1.5 pr-2 font-semibold">Net Income</td>
                                                    <td className="py-1.5 px-2 text-right font-semibold">-</td>
                                                    {data.equityReturn.semiAnnualCashFlows.map((cf) => (
                                                        <td key={cf.period} className="py-1.5 px-2 text-right font-semibold">{cf.netIncome.toLocaleString()}</td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 투자자 현금흐름 */}
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">투자자 현금흐름</h4>
                                    <div className="grid gap-6 lg:grid-cols-[1fr,auto]">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b text-muted-foreground">
                                                        <th className="pb-2 pr-2 text-left">구분</th>
                                                        {data.equityReturn.investorCashFlows.map((cf) => (
                                                            <th key={cf.period} className="pb-2 px-2 text-right whitespace-nowrap">{cf.period}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b">
                                                        <td className="py-1.5 pr-2 text-muted-foreground">Equity</td>
                                                        {data.equityReturn.investorCashFlows.map((cf) => (
                                                            <td key={cf.period} className="py-1.5 px-2 text-right">
                                                                {cf.equityInvestment !== 0 ? (
                                                                    <span className={cf.equityInvestment < 0 ? "text-red-600" : "text-green-600"}>
                                                                        {cf.equityInvestment.toLocaleString()}
                                                                    </span>
                                                                ) : "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="py-1.5 pr-2 text-muted-foreground">운영 배당</td>
                                                        {data.equityReturn.investorCashFlows.map((cf) => (
                                                            <td key={cf.period} className="py-1.5 px-2 text-right">
                                                                {cf.operatingDividend !== 0 ? cf.operatingDividend.toLocaleString() : "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="py-1.5 pr-2 text-muted-foreground">매각 차익 배당</td>
                                                        {data.equityReturn.investorCashFlows.map((cf) => (
                                                            <td key={cf.period} className="py-1.5 px-2 text-right">
                                                                {cf.capitalGainDividend !== 0 ? (
                                                                    <span className="text-green-600">{cf.capitalGainDividend.toLocaleString()}</span>
                                                                ) : "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr className="bg-muted/50">
                                                        <td className="py-1.5 pr-2 font-semibold">합계</td>
                                                        {data.equityReturn.investorCashFlows.map((cf) => (
                                                            <td key={cf.period} className="py-1.5 px-2 text-right font-semibold">
                                                                <span className={cf.total < 0 ? "text-red-600" : ""}>
                                                                    {cf.total.toLocaleString()}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr className="border-t">
                                                        <td className="py-1.5 pr-2 text-muted-foreground">CoC</td>
                                                        {data.equityReturn.investorCashFlows.map((cf) => (
                                                            <td key={cf.period} className="py-1.5 px-2 text-right">
                                                                {cf.coc > 0 ? `${cf.coc.toFixed(1)}%` : "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* 매각 차익 계산 */}
                                        <div className="rounded-lg bg-muted/30 p-4 text-xs">
                                            <div className="mb-2 font-semibold">매각 차익 계산</div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">3년차 NOI</span>
                                                    <span>{data.equityReturn.disposalAnalysis.year3Noi.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        매각 금액 <span className="text-xs">(Cap {data.equityReturn.disposalAnalysis.capRate}%)</span>
                                                    </span>
                                                    <span>{data.equityReturn.disposalAnalysis.disposalPrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        매각 부대비 <span className="text-xs">(매각 비용의 {data.equityReturn.disposalAnalysis.disposalFeeRate}%)</span>
                                                    </span>
                                                    <span className="text-red-600">-{data.equityReturn.disposalAnalysis.disposalFee.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">투입 원가</span>
                                                    <span>{data.equityReturn.disposalAnalysis.totalInvestment.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between gap-4 border-t pt-1.5 font-semibold">
                                                    <span>매각 차익</span>
                                                    <span className="text-primary">{data.equityReturn.disposalAnalysis.capitalGain.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 투자 수익률 */}
                                <div className="border-t pt-4">
                                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">투자 수익률</h4>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <div className="text-sm text-muted-foreground">CoC (Cash on Cash)</div>
                                            <div className="text-2xl font-bold text-primary">{data.equityReturn.coc.toFixed(2)}%</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">IRR (내부수익률)</div>
                                            <div className="text-2xl font-bold text-primary">{data.equityReturn.irr.toFixed(2)}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!data && !isLoading && purchasePriceNumber === 0 && (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">
                                매매가를 입력하면 투자 시뮬레이션 결과를 확인할 수 있습니다.
                            </p>
                        </div>
                    )}

                    {!data && !isLoading && purchasePriceNumber > 0 && lodgingAdr === 0 && (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">
                                숙박 ADR 정보가 없어 시뮬레이션을 할 수 없습니다.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
