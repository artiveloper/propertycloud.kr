import type {BuildingRegisterGeneralInfo} from "@/domain/lodging"
import {DetailSection, DetailItem} from "./detail-item"

type Props = {
    info: BuildingRegisterGeneralInfo
}

export function BuildingRegisterSection({info}: Props) {
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
