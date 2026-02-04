import {Card, CardContent, CardHeader, CardTitle} from "@workspace/ui/components/card";
import {InvestmentAsset} from "@/app/investments/data";

// 숫자 포맷팅 함수 (기존 코드 가정)
const number = (value: number | string) => {
    if (typeof value === 'string') return value;
    return value?.toLocaleString() ?? "-";
};

export default function DividendTabContent({ asset }: { asset: InvestmentAsset }) {
    return (
        <Card className="shadow-none rounded-sm">
            <CardHeader>
                <CardTitle>투자자 배당 내역</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div>
                    {/* 월별 배당 테이블 */}
                    <table className="w-full border-collapse text-sm">
                        <thead>
                        <tr>
                            <th className="min-w-[100px] bg-muted/50 p-2 text-left sticky left-0 z-10">구분</th>
                            {asset.dividend.history.dates.map((d) => (
                                <th key={d} className="min-w-[100px] p-2 text-right whitespace-nowrap">
                                    {d}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {asset.dividend.history.rows.map((row) => (
                            <tr key={row.label} className="border-t hover:bg-muted/50">
                                <td className="bg-background p-2 font-medium sticky left-0 z-10">{row.label}</td>
                                {row.values.map((v, i) => (
                                    <td key={i} className="p-2 text-right text-muted-foreground">
                                        {number(v)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* 하단 코멘트 영역 */}
                    <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
                        {asset.dividend.comment}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
