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
import { Button } from "@/components/ui/button";

interface RecentTradesTableProps {
  data: Activity[];
}

const TRADES_PER_PAGE = 6;

export default function RecentTradesTable({ data }: RecentTradesTableProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const trades = data.filter(activity => activity.activity_type === 'FILL');
  
  const totalPages = Math.ceil(trades.length / TRADES_PER_PAGE);
  const startIndex = (currentPage - 1) * TRADES_PER_PAGE;
  const endIndex = startIndex + TRADES_PER_PAGE;
  const currentTrades = trades.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    if (!isClient || !dateString) {
      return null;
    }
    return format(new Date(dateString), "PPp");
  };

  return (
    <div>
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
            {currentTrades.map((trade) => (
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
                    trade.pl && trade.side === 'sell'
                        ? trade.pl > 0 ? "text-green-600" : "text-red-600"
                        : ""
                )}
                >
                {trade.side === 'sell' && trade.pl
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        signDisplay: "auto"
                    }).format(trade.pl)
                    : null}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    </div>
  );
}