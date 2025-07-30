
'use client';

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PortfolioHistory } from "@/lib/types";

interface EquityCurveChartProps {
    history: PortfolioHistory;
}

export default function EquityCurveChart({ history }: EquityCurveChartProps) {
    if (!history || !history.timestamp || history.timestamp.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Equity Curve</CardTitle>
                    <CardDescription>Your portfolio value over the last month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No historical data available yet.</p>
                </CardContent>
            </Card>
        )
    }

    const chartData = history.timestamp.map((ts, index) => {
        const equity = history.equity[index];
        return {
            date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            equity: equity === 0 ? 100000 : equity,
        }
    }).filter(d => d.equity !== null);

     const chartConfig = {
        equity: {
            label: "Equity",
            color: "hsl(var(--primary))",
        },
     };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>
                    Your portfolio value over the last month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 10,
                                bottom: 10
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={['dataMin - 100', 'dataMax + 100']}
                                tickFormatter={(value) => `$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)}`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent 
                                    labelFormatter={(label, payload) => {
                                        return payload?.[0]?.payload?.date || label;
                                    }}
                                    formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
                                    indicator="dot"
                                />}
                            />
                            <defs>
                                <linearGradient id="fillEquity" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                    offset="5%"
                                    stopColor="var(--color-equity)"
                                    stopOpacity={0.8}
                                    />
                                    <stop
                                    offset="95%"
                                    stopColor="var(--color-equity)"
                                    stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="equity"
                                type="linear"
                                fill="url(#fillEquity)"
                                fillOpacity={0.4}
                                stroke="var(--color-equity)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
