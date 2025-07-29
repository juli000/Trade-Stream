'use client';

import * as React from 'react';
import { Pie, PieChart, Sector } from 'recharts';
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
    color: 'hsl(var(--chart-1))',
  },
  cash: {
    label: 'Cash',
    color: 'hsl(var(--chart-2))',
  },
};

export default function PortfolioAllocationChart({ cash, invested }: PortfolioAllocationChartProps) {
  const chartData = [
    { type: 'invested', value: invested, label: 'Invested', fill: 'var(--color-invested)' },
    { type: 'cash', value: cash, label: 'Cash', fill: 'var(--color-cash)' },
  ];
  const total = cash + invested;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="type"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }) => (
             <g>
                <Sector {...props} outerRadius={outerRadius} />
                <Sector
                    {...props}
                    outerRadius={outerRadius + 10}
                    innerRadius={outerRadius + 4}
                />
            </g>
          )}
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
