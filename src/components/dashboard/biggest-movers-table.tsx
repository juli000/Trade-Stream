'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BiggestMoversTableProps {
  data: Activity[];
}

export default function BiggestMoversTable({ data }: BiggestMoversTableProps) {
  const sellTrades = data.filter(activity => activity.activity_type === 'FILL' && activity.side === 'sell' && activity.pl != null);
  
  if (sellTrades.length === 0) {
      return <p className="text-sm text-muted-foreground">No recent sell trades to analyze.</p>
  }

  const sortedTrades = [...sellTrades].sort((a, b) => b.pl! - a.pl!);
  const biggestWins = sortedTrades.slice(0, 3);
  const biggestLosses = sortedTrades.slice(-3).reverse();

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return null;
    }
    return format(new Date(dateString), "PP");
  };

  return (
    <div className="space-y-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-sm font-semibold">Biggest Wins</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">P/L</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {biggestWins.map((trade) => (
                    <TableRow key={trade.id}>
                        <TableCell>
                            <div className="font-medium">{trade.symbol}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(trade.transaction_time)}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                             {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: 'always' }).format(trade.pl!)}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div>
            <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-semibold">Biggest Losses</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">P/L</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {biggestLosses.map((trade) => (
                    <TableRow key={trade.id}>
                        <TableCell>
                            <div className="font-medium">{trade.symbol}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(trade.transaction_time)}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                             {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: 'always' }).format(trade.pl!)}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    </div>
  );
}
