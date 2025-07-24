import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: number;
  description?: string;
  icon: ReactNode;
  format?: 'currency' | 'percent' | 'number' | 'integer';
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
            return value.toString();
        default:
            return value.toString();
    }
}

export default function KpiCard({ title, value, description, icon, format = 'number' }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value, format)}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
