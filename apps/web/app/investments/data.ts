export interface CashflowRow {
    label: string;
    values: (number | string)[];
    variant?: 'header' | 'item' | 'total' | 'result'; // 스타일링을 위한 옵션
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
                "2026.01.31", "2026.02.28", "2026.03.31", "2026.04.30", "2026.05.31", "2026.06.30",
                "2026.07.31", "2026.08.31", "2026.09.30", "2026.10.31", "2026.11.30", "2026.12.31",
            ],
            // 2. 엑셀의 계층 구조를 반영하여 데이터를 구성합니다.
            rows: [
                // [매출 섹션]
                {
                    label: "매출",
                    values: Array(12).fill(""), // 값 없음 (제목행)
                    variant: "header"
                },
                {
                    label: "숙박",
                    values: [0, 0, 0, 0, 0, 0, 0, 47053255, 47053255, 47053255, 47053255, 47053255],
                    variant: "item" // 들여쓰기 적용
                },
                {
                    label: "대실",
                    values: [0, 0, 0, 0, 0, 0, 0, 16161333, 16161333, 16161333, 16161333, 16161333],
                    variant: "item" // 들여쓰기 적용
                },
                {
                    label: "매출계",
                    values: [0, 0, 0, 0, 0, 0, 0, 63214589, 63214589, 63214589, 63214589, 63214589],
                    variant: "total" // 상단 테두리 및 강조
                },

                // [운영비용]
                {
                    label: "운영비용",
                    values: [0, 0, 0, 0, 0, 0, 0, 25285835, 25285835, 25285835, 25285835, 25285835],
                    variant: "header" // 혹은 item으로 처리 가능하나 최상위 항목이므로 header 느낌
                },

                // [NOI - 결과값]
                {
                    label: "NOI",
                    values: [0, 0, 0, 0, 0, 0, 0, 37928753, 37928753, 37928753, 37928753, 37928753],
                    variant: "result" // 배경색 강조
                },

                // [금융비용]
                {
                    label: "금융비용",
                    values: [0, 0, 0, 0, 0, 0, 0, 7561644, 7561644, 7561644, 7561644, 7561644],
                    variant: "header"
                },

                // [Net Income - 최종 결과]
                {
                    label: "Net Income",
                    values: [0, 0, 0, 0, 0, 0, 0, 30367109, 30367109, 30367109, 30367109, 30367109],
                    variant: "result" // 진하게 강조
                },
            ],
            comment: "본 자산은 숙박 및 대실 매출이 안정적으로 발생하며 월 평균 약 6.3억 원 수준의 매출을 유지하고 있습니다. 운영비용은 매출 대비 약 40% 수준으로 관리되고 있어, NOI는 월 약 3.8억 원 규모를 지속적으로 시현 중입니다. 금융비용을 차감한 이후에도 월 약 3.0억 원 내외의 순이익이 발생하고 있어, 투자자 배당 및 원리금 상환 재원 측면에서 안정적인 현금흐름 구조를 보이고 있습니다.",
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
            comment: "상반기에는 초기 운영 안정화 및 유동성 확보를 위해 배당을 유보하였으며, 하반기부터는 안정적인 NOI 및 순이익 창출을 기반으로 월 정기 배당을 개시하였습니다. 현재의 운영 성과 및 현금흐름을 고려할 때, 향후에도 보수적인 비용 관리 기조를 유지하면서 안정적인 배당 지급을 지속할 계획입니다. 시장 환경 및 자산 운영 성과에 따라 배당 수준은 탄력적으로 조정하되, 투자자 수익의 안정성과 예측 가능성을 최우선으로 운용할 예정입니다.",
        },
    },
];
