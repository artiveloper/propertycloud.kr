/**
 * 인수 분석 요청
 */
export type SourceAndUseRequest = {
  purchasePrice: number
  roomCount: number
  lodgingAdr: number
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
 * 수익률 추정 가정 값
 */
export type Assumptions = {
  operatingPeriodYears: number
  refinanceInterestRate: number
  lodgingAdr: number
  partTimeAdr: number
  occupancyRate: number
}

/**
 * 반기별 운영 현금흐름
 */
export type SemiAnnualCashFlow = {
  period: string
  lodgingRevenue: number
  partTimeRevenue: number
  totalRevenue: number
  operatingExpense: number
  noi: number
  financeCost: number
  netIncome: number
}

/**
 * 매각 차익 분석
 */
export type DisposalAnalysis = {
  year3Noi: number
  disposalPrice: number
  disposalFee: number
  totalInvestment: number
  capitalGain: number
  capRate: number
  disposalFeeRate: number
}

/**
 * 투자자 현금흐름
 */
export type InvestorCashFlow = {
  period: string
  equityInvestment: number
  operatingDividend: number
  capitalGainDividend: number
  total: number
  coc: number
}

/**
 * Equity 수익률 추정
 */
export type EquityReturn = {
  assumptions: Assumptions
  semiAnnualCashFlows: SemiAnnualCashFlow[]
  disposalAnalysis: DisposalAnalysis
  investorCashFlows: InvestorCashFlow[]
  coc: number
  irr: number
}

/**
 * Source & Use (자금 조달 및 사용)
 */
export type SourceAndUse = {
  sources: Sources
  uses: Uses
}

/**
 * 인수 분석 응답 (Source & Use)
 */
export type SourceAndUseResponse = {
  sourceAndUse: SourceAndUse
  equityReturn: EquityReturn
}
