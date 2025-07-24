'use client';

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { PortfolioHistory } from '@/lib/types';

interface EquityChartProps {
  data: PortfolioHistory;
}

const chartConfig = {
  equity: {
    label: 'Equity',
    color: 'hsl(var(--chart-1))',
  },
};

export default function EquityChart({ data }: EquityChartProps) {
  const chartData = data.timestamp.map((ts, index) => ({
    date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    equity: data.equity[index],
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        accessibilityLayer
      >
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-equity)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-equity)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent
            formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
            labelClassName="font-bold"
           />}
        />
        <Area
            type="monotone"
            dataKey="equity"
            strokeWidth={2}
            stroke="var(--color-equity)"
            fillOpacity={1}
            fill="url(#colorEquity)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
