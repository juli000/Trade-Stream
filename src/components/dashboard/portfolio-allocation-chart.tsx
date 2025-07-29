
'use client';

import * as React from 'react';
import { Pie, PieChart, Sector, TooltipPayload } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PortfolioAllocationChartProps {
    cash: number;
    invested: number;
}

const chartConfig = {
  invested: {
    label: 'Invested',
    color: 'hsl(var(--primary))',
  },
  cash: {
    label: 'Cash',
    color: 'hsl(var(--accent))',
  },
};

export default function PortfolioAllocationChart({ cash, invested }: PortfolioAllocationChartProps) {
  const chartData = [
    { type: 'invested', value: invested, label: 'Invested', fill: 'var(--color-invested)' },
    { type: 'cash', value: cash, label: 'Cash', fill: 'var(--color-cash)' },
  ];
  const total = cash + invested;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = payload[0].value as number;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {data.label}
              </span>
              <span className="font-bold text-foreground">
                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<CustomTooltip />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="type"
          innerRadius={60}
          strokeWidth={5}
           labelLine={false}
           label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
        >
        </Pie>
         <ChartLegend
            content={<ChartLegendContent nameKey="label" />}
            className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
