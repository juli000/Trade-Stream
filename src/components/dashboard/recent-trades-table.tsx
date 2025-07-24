'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RecentTradesTableProps {
  data: Activity[];
}

export default function RecentTradesTable({ data }: RecentTradesTableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const trades = data.filter(activity => activity.activity_type === 'FILL');

  const formatDate = (dateString: string) => {
    if (!isClient) {
      return null; // Don't render date on server to avoid mismatch
    }
    return format(new Date(dateString), "PPp");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead className="text-right">Side</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">P/L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell>
              <div className="font-medium">{trade.symbol}</div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {formatDate(trade.transaction_time)}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {formatDate(trade.transaction_time)}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={trade.side === "buy" ? "default" : "secondary"}
                className={cn(
                  "capitalize",
                  trade.side === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                )}
              >
                {trade.side}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{trade.qty}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(trade.price))}
            </TableCell>
            <TableCell
              className={cn(
                "text-right font-medium",
                trade.pl && trade.pl > 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {trade.pl
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    signDisplay: "auto"
                  }).format(trade.pl)
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
