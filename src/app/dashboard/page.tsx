import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card";
import RecentTradesTable from "@/components/dashboard/recent-trades-table";
import { getAccount, getActivities, getPortfolioHistory, getPositions } from "@/services/alpaca";
import { 
  calculateTotalReturn, 
  calculateWinRateAndAvgWinLoss, 
  calculateSharpeRatio 
} from "@/lib/statistics";
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, Target, PlusCircle, MinusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import OpenPositionsTable from "@/components/dashboard/open-positions-table";
import BiggestMoversTable from "@/components/dashboard/biggest-movers-table";


export default async function DashboardPage() {
  try {
    const [account, portfolioHistory, activities, positions] = await Promise.all([
      getAccount(),
      getPortfolioHistory(),
      getActivities(),
      getPositions(),
    ]);

    const initialBalance = 100000;
    const totalReturn = calculateTotalReturn(parseFloat(account.equity), initialBalance);
    const { winRate, avgWin, avgLoss, profitFactor, winningTradesCount, losingTradesCount } = calculateWinRateAndAvgWinLoss(activities as any[]);
    const sharpeRatio = calculateSharpeRatio(portfolioHistory);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Alpaca Portfolio Tracker.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Current Equity"
            value={parseFloat(account.equity)}
            format="currency"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description={`Buying Power: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(account.buying_power))}`}
          />
          <KpiCard
            title="Total Return"
            value={totalReturn.percentage}
            format="percent"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description={`${totalReturn.value >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalReturn.value)} all time (vs $100k)`}
          />
          <KpiCard
            title="Win Rate"
            value={winRate}
            format="percent"
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
            description={`Profit Factor: ${profitFactor.toFixed(2)} (Simulated)`}
          />
          <KpiCard
            title="Sharpe Ratio"
            value={sharpeRatio}
            format="number"
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            description="Annualized (daily returns)"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>Your currently held assets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OpenPositionsTable data={positions} />
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Biggest Movers</CardTitle>
                    <CardDescription>Your top 3 winning and losing trades.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BiggestMoversTable data={activities as any[]} />
                </CardContent>
            </Card>
        </div>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
              title="Average Win"
              value={avgWin}
              format="currency"
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              description="Avg P/L of winning trades (Simulated)"
          />
          <KpiCard
              title="Average Loss"
              value={avgLoss}
              format="currency"
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              description="Avg P/L of losing trades (Simulated)"
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
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>A list of your most recent trade activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTradesTable data={activities as any[]} />
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
            Failed to connect to the Alpaca API. Please ensure your API keys are set correctly in a 
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env.local</code> file.
            <p className="mt-2"><strong>Error:</strong> {error.message}</p>
          </AlertDescription>
        </Alert>
       </div>
    )
  }
}
