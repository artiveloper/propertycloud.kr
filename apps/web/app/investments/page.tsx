import Link from "next/link";
import { mockAssets } from "./data";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

export default function InvestmentsPage() {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">내 투자자산</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockAssets.map((asset) => (
                    <Link key={asset.id} href={`/investments/${asset.id}`}>
                        <Card className="cursor-pointer transition shadow-none">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {asset.name}
                                    <Badge>{asset.status}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-1 text-sm text-muted-foreground">
                                <div>
                                    투자금액: {asset.summary.investmentAmount.toLocaleString()}원
                                </div>
                                <div>투자시기: {asset.summary.investedAt}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
