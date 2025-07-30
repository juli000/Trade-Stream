
'use client';

import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);

    const filteredData = history.timestamp.map((ts, index) => {
        return {
            timestamp: ts,
            equity: history.equity[index]
        }
    }).filter(d => d.timestamp >= sevenDaysAgoTimestamp);

    const chartData = filteredData.map((data) => {
        return {
            date: new Date(data.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            equity: data.equity === 0 ? 100000 : data.equity,
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
                    Your portfolio value over the last 7 days.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig}>
                        <LineChart
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
                            <Line
                                dataKey="equity"
                                type="linear"
                                stroke="var(--color-equity)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
