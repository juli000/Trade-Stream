
'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PortfolioHistory } from "@/lib/types";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface EquityCurveChartProps {
    history: PortfolioHistory;
}

export default function EquityCurveChart({ history }: EquityCurveChartProps) {
    if (!history || !history.timestamp || history.timestamp.length === 0) {
        return (
             <Card>
                <CardHeader />
                <CardContent>
                    <p className="text-muted-foreground">No historical data available yet.</p>
                </CardContent>
            </Card>
        )
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);

    const filteredData = useMemo(() => {
        if (!history || !history.timestamp) return [];
        return history.timestamp.map((ts, index) => {
            return {
                timestamp: ts,
                equity: history.equity[index]
            }
        }).filter(d => d.timestamp >= sevenDaysAgoTimestamp);
    }, [history, sevenDaysAgoTimestamp]);
    

    const chartData = useMemo(() => {
        return filteredData.map((data) => {
            const pointDate = new Date(data.timestamp * 1000);
            return {
                date: pointDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
                fullDate: pointDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                equity: data.equity,
            }
        }).filter(d => d.equity !== null);
    }, [filteredData]);

     if (chartData.length === 0) {
        return (
             <Card>
                <CardHeader />
                <CardContent>
                    <p className="text-muted-foreground">There is no portfolio history for the selected time range.</p>
                </CardContent>
            </Card>
        )
    }

     const chartConfig = {
        equity: {
            label: "Equity",
            color: "hsl(var(--chart-6))",
        },
     };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
               <div />
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 0,
                                right: 0,
                                top: 20,
                                bottom: 10
                            }}
                        >
                             <defs>
                                <linearGradient id="fillEquity" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-equity)"
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-equity)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value, index) => {
                                    if (chartData.length > 10 && index % Math.floor(chartData.length / 5) !== 0) return '';
                                    return value;
                                }}
                            />
                            <YAxis
                                domain={[95000, 'auto']}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                orientation="left"
                                tickFormatter={(value) => `$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)}`}
                            />
                            <ChartTooltip
                                cursor={true}
                                content={<ChartTooltipContent 
                                    labelFormatter={(label, payload) => {
                                        return payload?.[0]?.payload?.fullDate || label;
                                    }}
                                    formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
                                    indicator="dot"
                                />}
                            />
                            <Area
                                dataKey="equity"
                                type="linear"
                                fill="url(#fillEquity)"
                                stroke="var(--color-equity)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
