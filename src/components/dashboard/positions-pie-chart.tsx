'use client';

import { Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Position } from '@/lib/types';
import { useTheme } from 'next-themes';

interface PositionsPieChartProps {
  data: Position[];
}

export default function PositionsPieChart({ data }: PositionsPieChartProps) {
    const { theme } = useTheme();

    const chartData = data.map((position, index) => ({
        name: position.symbol,
        value: parseFloat(position.market_value),
        fill: `hsl(var(--chart-${index + 1}))`,
    }));

    const chartConfig = data.reduce((acc, position, index) => {
        acc[position.symbol] = {
            label: position.symbol,
            color: `hsl(var(--chart-${index + 1}))`,
        };
        return acc;
    }, {});

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <PieChart accessibilityLayer>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent 
            formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
            nameKey="name" 
            hideIndicator 
            />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          outerRadius={110}
          innerRadius={60}
          paddingAngle={2}
          strokeWidth={2}
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={theme === 'dark' ? 'hsl(var(--background))' : 'hsl(var(--card))'}/>
          ))}
        </Pie>
        <Legend contentStyle={{fontSize: "0.875rem"}}/>
      </PieChart>
    </ChartContainer>
  );
}
