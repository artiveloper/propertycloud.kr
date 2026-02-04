import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@workspace/ui/components/card";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@workspace/ui/components/table";
import {InvestmentAsset} from "@/app/investments/data";


// 숫자 포맷팅 함수 (기존 코드 가정)
const number = (value: number | string) => {
    if (typeof value === 'string') return value;
    return value?.toLocaleString() ?? "-";
};

export default function SourceUseTabContent({asset}: { asset: InvestmentAsset }) {
    // Source와 Use 중 더 긴 배열의 길이를 구하여 행(Row) 수를 결정합니다.
    const sourceRows = asset.sourceUse.sources;
    const useRows = asset.sourceUse.uses;
    const maxRowCount = Math.max(sourceRows.length, useRows.length);

    // 렌더링을 위해 빈 배열을 만듭니다.
    const renderRows = Array.from({length: maxRowCount}, (_, i) => ({
        source: sourceRows[i] || null,
        use: useRows[i] || null,
    }));

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* ===== Source & Use (2열 차지) ===== */}
            <Card className="shadow-none rounded-sm md:col-span-2">
                <CardHeader>
                    <CardTitle>Sources & Uses</CardTitle>
                    <CardDescription>자산 취득을 위한 자금 조달 구조와 사용 내역 요약입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            {/* 상위 그룹 헤더 */}
                            <TableRow className="hover:bg-transparent">
                                <TableHead colSpan={3}
                                           className="text-center bg-muted/30 border-b border-r text-foreground font-semibold h-10">
                                    자금 조달 (Sources)
                                </TableHead>
                                <TableHead colSpan={2}
                                           className="text-center bg-muted/30 border-b text-foreground font-semibold h-10">
                                    자금 사용 (Uses)
                                </TableHead>
                            </TableRow>

                            {/* 컬럼 헤더 */}
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[20%] pl-4">구분</TableHead>
                                <TableHead className="w-[15%] text-right">금액</TableHead>
                                <TableHead className="w-[15%] text-right pr-6 border-r">비중</TableHead>

                                <TableHead className="w-[30%] pl-6">구분</TableHead>
                                <TableHead className="w-[20%] text-right pr-4">금액</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {renderRows.map((row, idx) => (
                                <TableRow key={idx} className="hover:bg-muted/30">
                                    {/* Source Columns */}
                                    <TableCell className="font-medium pl-4">
                                        {row.source?.label}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {row.source ? number(row.source.amount) : ""}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums border-r pr-6 text-muted-foreground">
                                        {row.source ? `${row.source.ratio}%` : ""}
                                    </TableCell>

                                    {/* Use Columns */}
                                    <TableCell className="font-medium pl-6">
                                        {row.use?.label}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums pr-4 text-muted-foreground">
                                        {row.use ? number(row.use.amount) : ""}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        <TableFooter className="bg-muted/50">
                            <TableRow>
                                <TableCell className="pl-4 font-bold text-foreground">합계</TableCell>
                                <TableCell className="text-right font-bold text-foreground tabular-nums">
                                    {number(asset.sourceUse.total)}
                                </TableCell>
                                <TableCell
                                    className="text-right font-bold text-foreground border-r pr-6">100%</TableCell>

                                <TableCell className="pl-6 font-bold text-foreground">합계</TableCell>
                                <TableCell className="text-right font-bold text-foreground tabular-nums pr-4">
                                    {number(asset.sourceUse.uses.reduce((acc: number, cur: any) => acc + cur.amount, 0))}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>

            {/* ===== Equity 구조 ===== */}
            <Card className="shadow-none rounded-sm">
                <CardHeader>
                    <CardTitle>Equity 구조</CardTitle>
                    <CardDescription>투입된 자기자본 구성과 지분 비율입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>구분</TableHead>
                                <TableHead className="text-right">투자금액</TableHead>
                                <TableHead className="text-right">비율</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="font-medium">총 Equity</TableCell>
                                <TableCell className="text-right tabular-nums text-muted-foreground">
                                    {number(asset.summary.investmentAmount)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-muted-foreground">100%</TableCell>
                            </TableRow>
                            {/* 필요시 투자자별 상세 내역 추가 가능 */}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ===== 대출 구조 ===== */}
            <Card className="shadow-none rounded-sm">
                <CardHeader>
                    <CardTitle>대출 구조</CardTitle>
                    <CardDescription>운영을 위해 조달한 대출 조건입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>구분</TableHead>
                                <TableHead className="text-right">금액</TableHead>
                                <TableHead className="text-right">금리</TableHead>
                                <TableHead className="text-right">만기</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {asset.loan.senior ? (
                                <TableRow className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="font-medium">선순위</div>
                                        <div className="text-xs text-muted-foreground">{asset.loan.senior.lender}</div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {number(asset.loan.senior.amount)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {asset.loan.senior.rate}%
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                        {asset.loan.senior.maturity}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell className="text-muted-foreground" colSpan={4}>선순위 대출 없음</TableCell>
                                </TableRow>
                            )}

                            {asset.loan.junior ? (
                                <TableRow className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="font-medium">후순위</div>
                                        <div className="text-xs text-muted-foreground">{asset.loan.junior.lender}</div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {number(asset.loan.junior.amount)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {asset.loan.junior.rate}%
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                        {asset.loan.junior.maturity}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell className="text-muted-foreground text-sm py-4" colSpan={4}>
                                        후순위 대출 정보가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ===== CAPEX 투자 현황 (2열 차지) ===== */}
            <Card className="shadow-none rounded-sm md:col-span-2">
                <CardHeader>
                    <CardTitle>CAPEX 투자 현황</CardTitle>
                    <CardDescription>가치 제고를 위한 주요 설비 투자 내역입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">구분</TableHead>
                                <TableHead className="text-right w-[150px]">금액</TableHead>
                                <TableHead className="text-center w-[120px]">지출 시기</TableHead>
                                <TableHead>주요 내용</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="font-medium">
                                    {asset.capex.label}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-muted-foreground">
                                    {number(asset.capex.amount)}
                                </TableCell>
                                <TableCell className="text-center text-muted-foreground">
                                    {asset.capex.spentAt}
                                </TableCell>
                                <TableCell className="text-muted-foreground max-w-md break-keep">
                                    {asset.capex.description}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
