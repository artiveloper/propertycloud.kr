import {mockAssets} from "../data";
import {Badge} from "@workspace/ui/components/badge";
import {Card, CardContent, CardHeader, CardTitle,} from "@workspace/ui/components/card";
import {notFound} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@workspace/ui/components/tabs";
import SourceUseTabContent from "@/components/investment/source-use-tab-content";
import DividendTabContent from "@/components/investment/dividend-tab-content";
import CashflowTabContent from "@/components/investment/cashflow-tab-content";

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

            <Tabs defaultValue="sources_uses">
                <TabsList>
                    <TabsTrigger value="sources_uses">sources & uses</TabsTrigger>
                    <TabsTrigger value="cashflow">현금흐름</TabsTrigger>
                    <TabsTrigger value="dividend">투자자 배당 내역</TabsTrigger>
                </TabsList>
                <TabsContent value="sources_uses" className="space-y-8">
                    <SourceUseTabContent asset={asset}/>
                </TabsContent>
                <TabsContent value="cashflow">
                    <CashflowTabContent asset={asset}/>
                </TabsContent>
                <TabsContent value="dividend">
                    <DividendTabContent asset={asset}/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
