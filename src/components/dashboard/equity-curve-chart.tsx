
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
import { Button } from "../ui/button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

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

    const filteredData = useMemo(() => {
        return history.timestamp.map((ts, index) => {
            return {
                timestamp: ts,
                equity: history.equity[index]
            }
        }).filter(d => d.timestamp >= sevenDaysAgoTimestamp);
    }, [history, sevenDaysAgoTimestamp]);
    

    const chartData = useMemo(() => {
        return filteredData.map((data) => {
            return {
                date: new Date(data.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                time: new Date(data.timestamp * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                equity: data.equity === 0 ? 100000 : data.equity,
            }
        }).filter(d => d.equity !== null);
    }, [filteredData]);

     const latestDataPoint = chartData[chartData.length - 1];
     const firstDataPoint = chartData[0];
     const dailyChange = latestDataPoint.equity - (chartData[chartData.length - 2]?.equity || firstDataPoint.equity);
     const dailyChangePct = ((latestDataPoint.equity / (chartData[chartData.length - 2]?.equity || firstDataPoint.equity)) - 1) * 100;


     const chartConfig = {
        equity: {
            label: "Equity",
            color: "hsl(var(--chart-4))",
        },
     };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
                <div>
                    <div className="flex items-baseline gap-2 pt-2">
                         <p className="text-3xl font-bold tracking-tight">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestDataPoint.equity)}
                        </p>
                        <span className={cn("font-semibold", dailyChange >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {dailyChange >= 0 ? '+' : ''}{dailyChangePct.toFixed(2)}%
                        </span>
                    </div>
                     <p className="text-sm text-muted-foreground pt-1">
                        {latestDataPoint.date}, {latestDataPoint.time} EDT
                    </p>
                </div>
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
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value, index) => {
                                    // Show fewer ticks on the X-axis for clarity
                                    if (chartData.length > 10 && index % Math.floor(chartData.length / 5) !== 0) return '';
                                    return value.replace(/:\d\d\s/, ' '); // 4 AM
                                }}
                            />
                            <YAxis
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
                                        return `${payload?.[0]?.payload?.date}, ${payload?.[0]?.payload?.time}` || label;
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
