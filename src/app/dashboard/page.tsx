import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card";
import RecentTradesTable from "@/components/dashboard/recent-trades-table";
import { getAccount, getActivities, getPositions } from "@/services/alpaca";
import { 
  calculateTotalReturn, 
  calculateWinRateAndAvgWinLoss, 
} from "@/lib/statistics";
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, MinusCircle, Activity as ActivityIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import OpenPositionsTable from "@/components/dashboard/open-positions-table";
import BiggestMoversTable from "@/components/dashboard/biggest-movers-table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { isToday } from "date-fns";
import DashboardRefresher from "@/components/dashboard/dashboard-refresher";
import type { Position } from "@/lib/types";

export const revalidate = 0;

export default async function DashboardPage() {
  try {
    const [account, activities, positions] = await Promise.all([
      getAccount(),
      getActivities(),
      getPositions(),
    ]);

    const validActivities = Array.isArray(activities) ? activities : [];

    const initialBalance = 100000;
    const { winRate, avgWin, avgLoss, profitFactor, winningTradesCount, losingTradesCount } = calculateWinRateAndAvgWinLoss(validActivities);
    const todaysPnl = parseFloat(account.equity) - parseFloat(account.last_equity);
    const todaysPnlPct = (todaysPnl / parseFloat(account.last_equity)) * 100;
    const allTrades = validActivities.filter(a => a.activity_type === 'FILL');
    const totalTrades = allTrades.length;
    const tradesToday = allTrades.filter(a => a.transaction_time && isToday(new Date(a.transaction_time))).length;

    const {value: totalReturnValue, percentage: totalReturnPct} = calculateTotalReturn(parseFloat(account.equity), initialBalance);


    return (
      <div className="space-y-8">
        <DashboardRefresher />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Alpaca Portfolio Tracker.</p>
        </div>
        {!process.env.API_KEY && (
             <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-600">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Mock Data Mode</AlertTitle>
                <AlertDescription>
                   You are currently viewing mock data because your Alpaca API credentials are not set. To connect to your real account, please create a
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">.env.local</code> 
                    file in the root of your project and add your <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">API_KEY</code> and <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">API_SECRET</code>.
                </AlertDescription>
            </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Portfolio Value"
            value={parseFloat(account.equity)}
            format="currency"
            icon={<DollarSign className="h-4 w-4 text-blue-500" />}
            description={
              <span className={cn(totalReturnValue >= 0 ? "text-green-500" : "text-red-500", "flex items-center gap-1")}>
                  <TrendingUp className="h-4 w-4"/>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', signDisplay: 'always' }).format(totalReturnValue)}
                  ({totalReturnPct.toFixed(2)}%)
              </span>
            }
          />
          <KpiCard
            title="Today's P/L"
            value={todaysPnl}
            format="currency"
            icon={<TrendingUp className={cn("h-4 w-4", todaysPnl >= 0 ? "text-green-500" : "text-red-500")} />}
            valueClassName={cn(todaysPnl >= 0 ? "text-green-500" : "text-red-500")}
            description={
                 <Badge variant="outline" className={cn(todaysPnl >= 0 ? "text-green-500 border-green-500" : "text-red-500 border-red-500")}>
                    {todaysPnlPct ? todaysPnlPct.toFixed(2) : '0.00'}%
                </Badge>
            }
          />
          <KpiCard
            title="Total Trades"
            value={totalTrades}
            format="integer"
            icon={<ActivityIcon className="h-4 w-4 text-cyan-500" />}
            description={<span className="text-cyan-500">{tradesToday} today</span>}
          />
           <KpiCard
            title="Win Rate"
            value={winRate}
            format="percent"
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
            description={<Progress value={winRate} className="h-2" indicatorClassName="bg-green-500" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>Your currently held assets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OpenPositionsTable data={positions as Position[]} />
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Biggest Movers</CardTitle>
                    <CardDescription>Your top 3 winning and losing trades.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BiggestMoversTable data={validActivities} />
                </CardContent>
            </Card>
        </div>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
              title="Average Win"
              value={avgWin}
              format="currency"
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              description="Avg of winning trades :)"
          />
          <KpiCard
              title="Average Loss"
              value={avgLoss}
              format="currency"
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              description="Avg of losing trades :("
          />
           <KpiCard
              title="Winning Trades"
              value={winningTradesCount}
              format="integer"
              icon={<PlusCircle className="h-4 w-4 text-green-500" />}
              description="Total winning trades"
          />
          <KpiCard
              title="Losing Trades"
              value={losingTradesCount}
              format="integer"
              icon={<MinusCircle className="h-4 w-4 text-red-500" />}
              description="Total losing trades"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Actions</CardTitle>
            <CardDescription>A list of your most recent trade activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTradesTable data={validActivities} />
          </CardContent>
        </Card>

      </div>
    );
  } catch (error: any) {
    return (
       <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Alpaca Portfolio Tracker.</p>
        </div>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Failed to connect to the Alpaca API. Please ensure your API_KEY and API_SECRET are set correctly in a 
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env.local</code> file.
            <p className="mt-2"><strong>Error:</strong> {error.message}</p>
          </AlertDescription>
        </Alert>
       </div>
    )
  }
}
