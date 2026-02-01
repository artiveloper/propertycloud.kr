import type { SelectOption } from './common'

export type Coordinate = {
  x: number
  y: number
}

export type RoomCount = {
  korean: number
  western: number
}

export type FloorCount = {
  ground: number
  underground: number
}

export type LodgingMarker = {
  mngNo: string
  businessName: string
  roadAddress: string
  isOpen: boolean
  businessTypeName: string | null
  roomCount: RoomCount
  floorCount: FloorCount
  coordinate: Coordinate | null
}

export type MarkersResponse = {
  count: number
  markers: LodgingMarker[]
}

export type AddressInfo = {
  sido: string | null
  roadAddress: string | null
  roadZipCode: string | null
  jibunAddress: string | null
}

export type BuildingRegisterGeneralInfo = {
  landArea: number | null
  architectureArea: number | null
  buildingCoverageRatio: number | null
  totalArea: number | null
  floorAreaRatioCalcArea: number | null
  floorAreaRatio: number | null
  mainPurposeName: string | null
  etcPurpose: string | null
  totalParkingCount: number | null
  indoorMechanicalCount: number | null
  indoorSelfParkingCount: number | null
  outdoorSelfParkingCount: number | null
  permitDate: string | null
  constructionStartDate: string | null
  useApprovalDate: string | null
}

export type BuildingFloorOutlineInfo = {
  dongName: string | null
  floorNumberName: string | null
  structureName: string | null
  etcStructure: string | null
  mainPurposeName: string | null
  etcPurpose: string | null
  area: number | null
  mainAttachmentCategoryName: string | null
  areaExclusionYn: string | null
}

export type LodgingDetail = {
  mngNo: string
  businessName: string
  isOpen: boolean
  salesStatusName: string | null
  businessTypeName: string | null
  sanitationBusinessType: string | null
  roomCount: RoomCount
  floorCount: FloorCount
  coordinate: Coordinate | null
  address: AddressInfo
  licenseDate: string | null
  lastModifiedAt: string | null
  buildingRegisterGeneralInfo: BuildingRegisterGeneralInfo | null
  floorOutlineInfos: BuildingFloorOutlineInfo[] | null
}

export type LodgingFiltersResponse = {
  sidos: SelectOption[]
  businessTypes: SelectOption[]
}

export type LodgingFilterParams = {
  businessType?: string
  minRoomCount?: number
}

export type LodgingSearchResponse = {
  content: LodgingMarker[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

