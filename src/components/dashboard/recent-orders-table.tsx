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
import type { Order } from "@alpacahq/alpaca-trade-api/dist/resources/order";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface RecentOrdersTableProps {
  data: Order[];
}

const ORDERS_PER_PAGE = 6;

const STATUS_STYLES: { [key: string]: string } = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  partially_filled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  filled: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  done_for_day: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  canceled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  expired: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  replaced: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  stopped: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  suspended: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  pending_new: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
};


export default function RecentOrdersTable({ data }: RecentOrdersTableProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const totalPages = Math.ceil(data.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const currentOrders = data.slice(startIndex, endIndex);

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
            <TableHead className="hidden sm:table-cell">Submitted</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Side</TableHead>
            <TableHead className="text-right">Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {currentOrders.map((order) => (
            <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.symbol}</div>
                   <div className="text-xs text-muted-foreground sm:hidden">
                    {formatDate(order.submitted_at)}
                </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(order.submitted_at)}
                </TableCell>
                <TableCell className="capitalize">{order.type.replace('_', ' ')}</TableCell>
                 <TableCell className="text-right">{order.qty}</TableCell>
                <TableCell className="text-right">
                  <Badge
                      variant={order.side === "buy" ? "default" : "secondary"}
                      className={cn(
                      "capitalize",
                      order.side === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      )}
                  >
                      {order.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <Badge className={cn("capitalize", STATUS_STYLES[order.status] || "bg-gray-200")}>
                        {order.status.replace('_', ' ')}
                    </Badge>
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
