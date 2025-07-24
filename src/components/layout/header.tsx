'use client';

import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MARKET_OPEN_HOUR_EST = 9;
const MARKET_OPEN_MINUTE_EST = 30;
const MARKET_CLOSE_HOUR_EST = 16;

const isMarketHours = () => {
    const now = new Date();
    const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    const dayOfWeek = estDate.getDay(); // Sunday = 0, Saturday = 6
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false; // Market is closed on weekends
    }

    const currentHour = estDate.getHours();
    const currentMinute = estDate.getMinutes();

    const marketOpenTime = MARKET_OPEN_HOUR_EST * 60 + MARKET_OPEN_MINUTE_EST;
    const marketCloseTime = MARKET_CLOSE_HOUR_EST * 60;
    const currentTime = currentHour * 60 + currentMinute;
    
    return currentTime >= marketOpenTime && currentTime < marketCloseTime;
};


export default function Header() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(isMarketHours());
    const interval = setInterval(() => {
        setIsLive(isMarketHours());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">Trade Stream</span>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">Algorithmic Trading Intelligence</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 w-full items-center justify-end gap-4">
        <ThemeSwitcher />
        <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
                {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                <span className={cn("relative inline-flex rounded-full h-3 w-3", isLive ? 'bg-red-500' : 'bg-gray-400')}></span>
            </div>
            <span className="font-semibold text-sm">{isLive ? 'Live' : 'Offline'}</span>
        </div>
      </div>
    </header>
  );
}
