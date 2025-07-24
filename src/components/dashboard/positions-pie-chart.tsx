'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import type { Position } from '@/lib/types';
import { useTheme } from 'next-themes';

interface PositionsPieChartProps {
  data: Position[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function PositionsPieChart({ data }: PositionsPieChartProps) {
    const { theme } = useTheme();

    const chartData = data.map(position => ({
        name: position.symbol,
        value: parseFloat(position.market_value),
    }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip
          content={<ChartTooltipContent 
            formatter={(value, name) => 
                (<div>
                    <p className="font-medium">{name}</p>
                    <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}</p>
                </div>)
            }
            nameKey="name" 
            hideIndicator 
            />}
        />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
          outerRadius={110}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={theme === 'dark' ? 'hsl(var(--background))' : 'hsl(var(--card))'} />
          ))}
        </Pie>
        <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
      </PieChart>
    </ResponsiveContainer>
  );
}
