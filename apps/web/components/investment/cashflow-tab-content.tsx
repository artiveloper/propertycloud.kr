import {InvestmentAsset} from "@/app/investments/data";
import {Card, CardContent, CardHeader, CardTitle} from "@workspace/ui/components/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@workspace/ui/components/table";
import {cn} from "@workspace/ui/lib/utils";

// 숫자 포맷팅 함수 (기존 코드 가정)
const number = (value: number | string) => {
    if (typeof value === 'string') return value;
    return value?.toLocaleString() ?? "-";
};

export default function CashflowTabContent({asset}: { asset: InvestmentAsset }) {
    return (
        <Card className="shadow-none rounded-sm">
            <CardHeader>
                <CardTitle>현금흐름</CardTitle>
            </CardHeader>
            <CardContent>
                {/* 가로 스크롤을 위한 래퍼 */}
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* 첫 번째 컬럼: 구분 (Sticky) */}
                                <TableHead
                                    className="w-[120px] sticky left-0 z-20 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                                    구분
                                </TableHead>
                                {/* 날짜 헤더 */}
                                {asset.cashflow.dates.map((d: string) => (
                                    <TableHead key={d} className="min-w-[100px] text-right whitespace-nowrap">
                                        {d}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {asset.cashflow.rows.map((row: any, idx: number) => {
                                // variant에 따른 스타일 정의
                                const isHeader = row.variant === 'header';
                                const isItem = row.variant === 'item';
                                const isTotal = row.variant === 'total';
                                const isResult = row.variant === 'result';

                                return (
                                    <TableRow
                                        key={idx}
                                        className={cn(
                                            "hover:bg-muted/30",
                                            // 합계(Total)나 결과(Result) 행 상단 테두리 강조
                                            (isTotal || isResult) && "border-t-2 border-muted",
                                            // 결과행(NOI, Net Income) 배경 강조
                                            isResult && "bg-slate-50 hover:bg-slate-100"
                                        )}
                                    >
                                        {/* 첫 번째 컬럼: 라벨 (Sticky & 계층 스타일) */}
                                        <TableCell
                                            className={cn(
                                                "sticky left-0 z-10 bg-background transition-colors", // 스크롤 시 겹침 방지용 배경색
                                                "font-medium whitespace-nowrap border-r", // 우측 구분선 추가

                                                // 들여쓰기 및 폰트 스타일링
                                                isHeader && "text-foreground font-bold",
                                                isItem && "text-muted-foreground pl-8", // 하위 항목 들여쓰기
                                                isTotal && "text-foreground font-semibold pl-8 bg-slate-50/50", // 소계도 들여쓰기 유지
                                                isResult && "text-primary font-bold bg-slate-50" // 결과값 강조
                                            )}
                                        >
                                            {row.label}
                                        </TableCell>

                                        {/* 데이터 값 렌더링 */}
                                        {row.values.map((v: number | string, i: number) => (
                                            <TableCell
                                                key={i}
                                                className={cn(
                                                    "text-right tabular-nums",
                                                    isHeader && "text-transparent select-none", // 헤더 행의 값은 숨김 처리
                                                    isItem && "text-muted-foreground",
                                                    (isTotal || isResult) && "text-foreground font-medium"
                                                )}
                                            >
                                                {/* 헤더이면서 값이 없을 때는 빈 문자열, 아니면 포맷팅 */}
                                                {isHeader && v === "" ? "" : number(v)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* 하단 코멘트 영역 */}
                <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
                    {asset.cashflow.comment}
                </div>
            </CardContent>
        </Card>
    )
}
