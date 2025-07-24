'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import type { PortfolioHistory } from '@/lib/types';
import { useTheme } from 'next-themes';

interface EquityChartProps {
  data: PortfolioHistory;
}

export default function EquityChart({ data }: EquityChartProps) {
  const { theme } = useTheme();

  const chartData = data.timestamp.map((ts, index) => ({
    date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    equity: data.equity[index],
  }));

  const primaryColor = 'hsl(var(--primary))';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
          content={<ChartTooltipContent
            formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
            cursor={false}
            labelClassName="font-bold"
           />}
        />
        <Area
            type="monotone"
            dataKey="equity"
            stroke={primaryColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEquity)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
