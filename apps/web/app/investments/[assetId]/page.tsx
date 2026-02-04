// app/investments/[id]/page.tsx
import {mockAssets} from "../data";
import {Badge} from "@workspace/ui/components/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import {
    Card,
    CardContent, CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {notFound} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@workspace/ui/components/tabs";

const number = (v: number | string) => {
    if (typeof v === 'string') return v;
    return v.toLocaleString();
};

interface IProps {
    params: Promise<{ assetId: string }>;
}

export default async function AssetDetailPage({params}: IProps) {
    const {assetId} = await params;
    const asset = mockAssets.find((assets) => assets.id === assetId);

    if (!asset) {
        return notFound();
    }

    return (
        <div className="space-y-8 p-8">
            {/* ===== Header ===== */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{asset.name}</h1>
                <Badge>{asset.status}</Badge>
            </div>

            {/* ===== Summary ===== */}
            <Card className="shadow-none rounded-sm">
                <CardHeader>
                    <CardTitle>투자 요약</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
                    <div>
                        <p className="text-muted-foreground">투자금액</p>
                        <p className="font-semibold">
                            {number(asset.summary.investmentAmount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">투자시기</p>
                        <p>{asset.summary.investedAt}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">청산시기</p>
                        <p>{asset.summary.exitedAt}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">CoC</p>
                        <p>{asset.summary.coc}%</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">IRR</p>
                        <p>{asset.summary.irr}</p>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="source_use" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="source_use">source&use</TabsTrigger>
                    <TabsTrigger value="cashflow">현금흐름</TabsTrigger>
                    <TabsTrigger value="dividend">투자자 배당 내역</TabsTrigger>
                </TabsList>
                <TabsContent value="source_use">
                    {/* ===== Source & Use ===== */}
                    <Card className="shadow-none rounded-sm">
                        <CardHeader>
                            <CardTitle>Source & Use</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    {/* 그룹 헤더 */}
                                    <TableRow className="border-t-0">
                                        <TableHead colSpan={3}>
                                            Sources
                                        </TableHead>
                                        <TableHead colSpan={2}>
                                            Uses
                                        </TableHead>
                                    </TableRow>

                                    {/* 컬럼 헤더 */}
                                    <TableRow>
                                        <TableHead>구분</TableHead>
                                        <TableHead className="text-right">금액</TableHead>
                                        <TableHead className="text-right">비중</TableHead>

                                        <TableHead className="border-l">구분</TableHead>
                                        <TableHead className="text-right">금액</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {/* Row 1 */}
                                    <TableRow>
                                        <TableCell>대출금</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.sources[0].amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {asset.sourceUse.sources[0].ratio}%
                                        </TableCell>

                                        <TableCell className="border-l">매매가</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.uses[0].amount)}
                                        </TableCell>
                                    </TableRow>

                                    {/* Row 2 */}
                                    <TableRow>
                                        <TableCell>Equity</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.sources[1].amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {asset.sourceUse.sources[1].ratio}%
                                        </TableCell>

                                        <TableCell className="border-l">취등록세 및 등기비</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.uses[1].amount)}
                                        </TableCell>
                                    </TableRow>

                                    {/* Row 3 */}
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>

                                        <TableCell className="border-l">리모델링비</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.uses[2].amount)}
                                        </TableCell>
                                    </TableRow>

                                    {/* Row 4 */}
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>

                                        <TableCell className="border-l">금융비</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.uses[3].amount)}
                                        </TableCell>
                                    </TableRow>

                                    {/* Row 5 */}
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>

                                        <TableCell className="border-l">예비비</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.sourceUse.uses[4].amount)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                                <TableFooter>
                                    <TableRow>
                                        <TableCell>합계</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {number(
                                                asset.sourceUse.sources.reduce((sum, s) => sum + s.amount, 0)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">100%</TableCell>

                                        <TableCell className="border-l font-semibold">합계</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {number(
                                                asset.sourceUse.uses.reduce((sum, u) => sum + u.amount, 0)
                                            )}
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
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>구분</TableHead>
                                        <TableHead className="text-right">총 Equity</TableHead>
                                        <TableHead className="text-right">투자자 투자금액</TableHead>
                                        <TableHead className="text-right">Equity 비율</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Equity</TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.summary.investmentAmount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {number(asset.summary.investmentAmount)}
                                        </TableCell>
                                        <TableCell className="text-right">100%</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none rounded-sm">
                        <CardHeader>
                            <CardTitle>대출 구조</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left">구분</th>
                                    <th className="p-2 text-right">금액</th>
                                    <th className="p-2 text-right">금리</th>
                                    <th className="p-2 text-right">만기</th>
                                    <th className="p-2 text-left">대출기관</th>
                                </tr>
                                </thead>
                                <tbody>
                                {asset.loan.senior && (
                                    <tr className="border-b">
                                        <td className="p-2">선순위 대출</td>
                                        <td className="p-2 text-right">{number(asset.loan.senior.amount)}</td>
                                        <td className="p-2 text-right">{asset.loan.senior.rate}%</td>
                                        <td className="p-2 text-right">{asset.loan.senior.maturity}</td>
                                        <td className="p-2">{asset.loan.senior.lender}</td>
                                    </tr>
                                )}
                                {!asset.loan.junior && (
                                    <tr>
                                        <td className="p-2">후순위 대출</td>
                                        <td className="p-2 text-right">-</td>
                                        <td className="p-2 text-right">-</td>
                                        <td className="p-2 text-right">-</td>
                                        <td className="p-2">-</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none rounded-sm">
                        <CardHeader>
                            <CardTitle>CAPEX 투자 현황</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left">구분</th>
                                    <th className="p-2 text-right">금액</th>
                                    <th className="p-2 text-right">지출 시기</th>
                                    <th className="p-2 text-left">주요 시공 내역</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="p-2">{asset.capex.label}</td>
                                    <td className="p-2 text-right">{number(asset.capex.amount)}</td>
                                    <td className="p-2 text-right">{asset.capex.spentAt}</td>
                                    <td className="p-2">{asset.capex.description}</td>
                                </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="cashflow">
                    {/* ===== Cashflow ===== */}
                    <Card className="shadow-none rounded-sm">
                        <CardHeader>
                            <CardTitle>현금흐름 (Cashflow)</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <div>
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                    <tr>
                                        <th className="min-w-[100px] bg-muted/50 p-2 text-left sticky left-0 z-10">구분</th>
                                        {asset.cashflow.dates.map((d) => (
                                            <th key={d} className="min-w-[100px] p-2 text-right whitespace-nowrap">
                                                {d}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {asset.cashflow.rows.map((row) => (
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
                                <p className="mt-4 p-4 bg-gray-50 rounded text-sm">{asset.cashflow.comment}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="dividend">
                    {/* ===== Dividend History ===== */}
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
                                <p className="mt-4 p-4 bg-gray-50 rounded text-sm">{asset.dividend.comment}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
