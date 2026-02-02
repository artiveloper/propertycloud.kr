/**
 * 인수 분석 요청
 */
export type SourceAndUseRequest = {
  purchasePrice: number
  roomCount: number
}

/**
 * 자금 조달 (Sources)
 */
export type Sources = {
  loanAmount: number
  loanRatio: number
  loanDescription: string
  equity: number
  equityRatio: number
  total: number
}

/**
 * 자금 사용 (Uses)
 */
export type Uses = {
  interestRate: number
  purchasePrice: number
  purchasePriceDescription: string
  acquisitionTax: number
  acquisitionTaxDescription: string
  remodelingCost: number
  remodelingCostDescription: string
  financeCost: number
  financeCostDescription: string
  contingency: number
  contingencyDescription: string
  total: number
}

/**
 * 인수 분석 응답 (Source & Use)
 */
export type SourceAndUseResponse = {
  sources: Sources
  uses: Uses
}
