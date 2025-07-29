'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AllocationBarProps {
    invested: number;
    cash: number;
}

export default function AllocationBar({ invested, cash }: AllocationBarProps) {
    const total = invested + cash;
    if (total === 0) {
        return <div className="h-8 w-full rounded-full bg-secondary flex items-center justify-center text-sm text-muted-foreground">No funds available</div>
    }

    const investedPct = (invested / total) * 100;
    const cashPct = (cash / total) * 100;

    return (
        <TooltipProvider>
            <div className="flex w-full h-8 rounded-full overflow-hidden bg-secondary">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div 
                            className="bg-primary h-full transition-all duration-500" 
                            style={{ width: `${investedPct}%` }}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Invested: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invested)} ({investedPct.toFixed(1)}%)</p>
                    </TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <div 
                            className="bg-accent h-full transition-all duration-500" 
                            style={{ width: `${cashPct}%` }}
                        />
                    </TooltipTrigger>
                     <TooltipContent>
                        <p>Cash: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cash)} ({cashPct.toFixed(1)}%)</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
