'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Position } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OpenPositionsTableProps {
  data: Position[];
}

export default function OpenPositionsTable({ data }: OpenPositionsTableProps) {
    if (data.length === 0) {
        return <p className="text-sm text-muted-foreground">You have no open positions.</p>
    }

  const sortedData = [...data].sort((a, b) => Number(b.unrealized_pl) - Number(a.unrealized_pl));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Avg. Entry</TableHead>
          <TableHead className="text-right">Unrealized P/L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((pos) => (
          <TableRow key={pos.asset_id}>
            <TableCell>
              <div className="font-medium">{pos.symbol}</div>
              <div className="text-xs text-muted-foreground">{pos.asset_class.replace('_', ' ').toLocaleUpperCase()}</div>
            </TableCell>
            <TableCell className="text-right">{pos.qty}</TableCell>
            <TableCell className="text-right">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(pos.avg_entry_price))}
            </TableCell>
            <TableCell
              className={cn(
                "text-right font-medium",
                Number(pos.unrealized_pl) >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  signDisplay: "auto"
              }).format(Number(pos.unrealized_pl))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
