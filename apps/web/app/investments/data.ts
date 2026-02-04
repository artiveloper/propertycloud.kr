// app/investments/data.ts

export interface CashflowRow {
    label: string;
    values: (number | string)[]; // CoC 표기를 위해 string 허용
}

export interface InvestmentAsset {
    id: string;
    name: string;
    status: string;
    summary: {
        investmentAmount: number;
        investedAt: string;
        exitedAt: string;
        coc: number | null;
        irr: number | null;
    };
    sourceUse: {
        total: number;
        sources: { label: string; amount: number; ratio: number }[];
        uses: { label: string; amount: number }[];
    };
    loan: {
        senior: {
            amount: number;
            rate: number;
            maturity: string;
            lender: string;
        } | null;
        junior: {
            amount: number;
            rate: number;
            maturity: string;
            lender: string;
        } | null;
    };
    capex: {
        label: string;
        amount: number;
        spentAt: string;
        description: string;
    };
    cashflow: {
        dates: string[];
        rows: CashflowRow[];
        comment: string;
    };
    dividend: {
        history: {
            dates: string[];
            rows: CashflowRow[];
        },
        comment: string;
    }
}

export const mockAssets: InvestmentAsset[] = [
    {
        id: "asset-1",
        name: "서울 ○○ 호텔",
        status: "운용중",

        summary: {
            investmentAmount: 866_333_333,
            investedAt: "2026.01.31",
            exitedAt: "-",
            coc: 3.51,
            irr: null,
        },

        sourceUse: {
            total: 2_866_333_333,
            sources: [
                {label: "대출금", amount: 2_000_000_000, ratio: 70},
                {label: "Equity", amount: 866_333_333, ratio: 30},
            ],
            uses: [
                {label: "매매가", amount: 2_000_000_000},
                {label: "취등록세 및 등기비", amount: 96_000_000},
                {label: "리모델링비", amount: 682_000_000},
                {label: "금융비", amount: 58_333_333},
                {label: "예비비", amount: 30_000_000},
            ],
        },

        loan: {
            senior: {
                amount: 2_000_000_000,
                rate: 4.5,
                maturity: "2027.06.30",
                lender: "xx은행",
            },
            junior: null,
        },

        capex: {
            label: "리모델링",
            amount: 682_000_000,
            spentAt: "2026.01.31",
            description: "**",
        },

        // 1월부터 시작하도록 날짜 확장 (1~6월: 공사기간/매출없음, 7월~: 운영)
        cashflow: {
            dates: [
                "2026.1.31",
                "2026.2.28",
                "2026.3.31",
                "2026.4.30",
                "2026.5.31",
                "2026.6.30",
                "2026.7.31",
                "2026.8.31",
                "2026.9.30",
                "2026.10.31",
                "2026.11.30",
                "2026.12.31",
            ],
            rows: [
                {
                    label: "숙박 매출",
                    values: [0, 0, 0, 0, 0, 0, 0, 47053255, 47053255, 47053255, 47053255, 47053255],
                },
                {
                    label: "대실 매출",
                    values: [0, 0, 0, 0, 0, 0, 0, 16161333, 16161333, 16161333, 16161333, 16161333],
                },
                {
                    label: "매출계",
                    values: [0, 0, 0, 0, 0, 0, 0, 63214589, 63214589, 63214589, 63214589, 63214589],
                },
                {
                    label: "운영비용",
                    values: [0, 0, 0, 0, 0, 0, 0, 25285835, 25285835, 25285835, 25285835, 25285835],
                },
                {
                    label: "NOI",
                    values: [0, 0, 0, 0, 0, 0, 0, 37928753, 37928753, 37928753, 37928753, 37928753],
                },
                {
                    label: "금융비용",
                    values: [0, 0, 0, 0, 0, 0, 0, 7561644, 7561644, 7561644, 7561644, 7561644],
                },
                {
                    label: "Net Income",
                    values: [0, 0, 0, 0, 0, 0, 0, 30367109, 30367109, 30367109, 30367109, 30367109],
                },
            ],
            comment: "운영 현황 Comment",
        },

        dividend: {
            history: {
                dates: [
                    "2026.1.31",
                    "2026.2.28",
                    "2026.3.31",
                    "2026.4.30",
                    "2026.5.31",
                    "2026.6.30",
                    "2026.7.31",
                    "2026.8.31",
                    "2026.9.30",
                    "2026.10.31",
                    "2026.11.30",
                    "2026.12.31",
                ],
                rows: [
                    {
                        label: "에쿼티 잔액",
                        values: [866333333, 866333333, 866333333, 866333333, 866333333, 866333333, 866333333, 866333333, 866333333, 866333333, 866333333, 866333333]
                    },
                    {
                        label: "배당액",
                        values: [0, 0, 0, 0, 0, 0, 0, 30367109, 30367109, 30367109, 30367109, 30367109]
                    },
                    {
                        label: "CoC",
                        values: ["-", "-", "-", "-", "-", "-", "-", "3.51%", "3.51%", "3.51%", "3.51%", "3.51%"]
                    }
                ]
            },
            comment: "향후 운용 전략 Comment",
        },
    },
];
