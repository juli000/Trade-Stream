
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { PortfolioHistory } from '@/lib/types';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface EquityChartProps {
  data: PortfolioHistory;
}

export default function EquityChart({ data }: EquityChartProps) {
  const chartData = data.timestamp.map((ts, index) => ({
    date: format(new Date(ts * 1000), 'MMM d'),
    equity: data.equity[index],
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  }

  return (
    <ChartContainer config={{
        equity: {
            label: "Equity",
            color: "hsl(var(--chart-2))",
        }
    }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
            tickFormatter={(value) => formatCurrency(value)}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip 
            cursor={false}
            content={<ChartTooltipContent 
                formatter={(value) => formatCurrency(value as number)} 
                indicator="dot"
             />}
          />
          <Line
            dataKey="equity"
            type="monotone"
            stroke="var(--color-equity)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
