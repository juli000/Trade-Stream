import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: number;
  description?: string | ReactNode;
  icon: ReactNode;
  format?: 'currency' | 'percent' | 'number' | 'integer';
  valueClassName?: string;
  cardClassName?: string;
}

const formatValue = (value: number, format: KpiCardProps['format']) => {
    switch (format) {
        case 'currency':
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        case 'percent':
            return `${value.toFixed(2)}%`;
        case 'number':
            return value.toFixed(2);
        case 'integer':
            return new Intl.NumberFormat('en-US').format(value);
        default:
            return value.toString();
    }
}

export default function KpiCard({ title, value, description, icon, format = 'number', valueClassName, cardClassName }: KpiCardProps) {
  return (
    <Card className={cn(cardClassName)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{formatValue(value, format)}</div>
        {description && <div className="text-xs text-muted-foreground pt-1">{description}</div>}
      </CardContent>
    </Card>
  );
}
