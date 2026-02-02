"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { numberToHangulMixed } from "es-hangul"
import type { LodgingDetail } from "@/domain/lodging"
import { useSourceAndUse } from "@/domain/acquisition"
import { useDebounce } from "@/hooks"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: LodgingDetail
}

export function InvestmentSimulationDialog({ open, onOpenChange, detail }: Props) {
  const roomCount = detail.roomCount.korean + detail.roomCount.western
  const [purchasePrice, setPurchasePrice] = useState("")

  useEffect(() => {
    if (open) {
      setPurchasePrice("")
    }
  }, [open])

  const purchasePriceNumber = parseInt(purchasePrice.replace(/,/g, ""), 10) || 0
  const debouncedPurchasePrice = useDebounce(purchasePriceNumber, 500)

  const { data, isLoading, isFetching } = useSourceAndUse(
    debouncedPurchasePrice > 0 && roomCount > 0
      ? { purchasePrice: debouncedPurchasePrice, roomCount }
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


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>투자 시뮬레이션</DialogTitle>
          <DialogDescription>{detail.businessName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 입력 폼 */}
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
                  {numberToHangulMixed(purchasePriceNumber, { spacing: true })}원
                </p>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">객실 수</span>
              <span className="font-medium">{roomCount}개</span>
            </div>
          </div>

          {/* 결과 */}
          {(isLoading || isFetching) && debouncedPurchasePrice > 0 && roomCount > 0 && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {data && !isFetching && (
            <>
              {/* 자금 사용 (Uses) */}
              <div>
                <h3 className="mb-3 text-base font-semibold">자금 사용 (Uses)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      매매가
                      <span className="ml-1 text-xs">({data.uses.purchasePriceDescription})</span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.uses.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      취등록세
                      <span className="ml-1 text-xs">({data.uses.acquisitionTaxDescription})</span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.uses.acquisitionTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      리모델링비
                      <span className="ml-1 text-xs">({data.uses.remodelingCostDescription})</span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.uses.remodelingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      금융비
                      <span className="ml-1 text-xs">
                        ({data.uses.financeCostDescription}, 금리 {data.uses.interestRate}%)
                      </span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.uses.financeCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      예비비
                      <span className="ml-1 text-xs">({data.uses.contingencyDescription})</span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.uses.contingency)}</span>
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>합계</span>
                      <span className="text-primary">{formatCurrency(data.uses.total)}</span>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">
                      {numberToHangulMixed(data.uses.total, { spacing: true })}원
                    </p>
                  </div>
                </div>
              </div>

              {/* 자금 조달 (Sources) */}
              <div>
                <h3 className="mb-3 text-base font-semibold">자금 조달 (Sources)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      대출금
                      <span className="ml-1 text-xs">
                        ({data.sources.loanDescription}, {data.sources.loanRatio.toFixed(1)}%)
                      </span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.sources.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      자기자본
                      <span className="ml-1 text-xs">({data.sources.equityRatio.toFixed(1)}%)</span>
                    </span>
                    <span className="font-medium">{formatCurrency(data.sources.equity)}</span>
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>합계</span>
                      <span className="text-primary">{formatCurrency(data.sources.total)}</span>
                    </div>
                      <p className="text-right text-xs text-muted-foreground">
                      {numberToHangulMixed(data.sources.total, { spacing: true })}원
                      </p>
                  </div>
                </div>
              </div>

              {/* 필요 자기자본 강조 */}
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground">필요 자기자본</div>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(data.sources.equity)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {numberToHangulMixed(data.sources.equity, { spacing: true })}원
                </p>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
