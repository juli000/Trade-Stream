import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KpiCard from "@/components/dashboard/kpi-card";
import EquityChart from "@/components/dashboard/equity-chart";
import RecentTradesTable from "@/components/dashboard/recent-trades-table";
import { mockAccount, mockActivities, mockPortfolioHistory } from "@/lib/mock-data";
import { 
  calculateTotalReturn, 
  calculateWinRateAndAvgWinLoss, 
  calculateMaxDrawdown,
  calculateSharpeRatio 
} from "@/lib/statistics";
import { DollarSign, Percent, TrendingUp, TrendingDown, CheckCircle, XCircle, Target } from "lucide-react";

export default async function DashboardPage() {
  // Data fetching and calculations would happen here in a real app
  const account = mockAccount;
  const portfolioHistory = mockPortfolioHistory;
  const activities = mockActivities;

  const totalReturn = calculateTotalReturn(portfolioHistory);
  const { winRate, avgWin, avgLoss, profitFactor } = calculateWinRateAndAvgWinLoss(activities);
  const maxDrawdown = calculateMaxDrawdown(portfolioHistory);
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
          description={`${totalReturn.value >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalReturn.value)} all time`}
        />
        <KpiCard
          title="Win Rate"
          value={winRate}
          format="percent"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          description={`Profit Factor: ${profitFactor.toFixed(2)}`}
        />
        <KpiCard
          title="Sharpe Ratio"
          value={sharpeRatio}
          format="number"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          description="Annualized (daily returns)"
        />
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
            <CardDescription>Your portfolio value over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EquityChart data={portfolioHistory} />
          </CardContent>
        </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
            title="Average Win"
            value={avgWin}
            format="currency"
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
            description="Average P/L of winning trades"
        />
        <KpiCard
            title="Average Loss"
            value={avgLoss}
            format="currency"
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
            description="Average P/L of losing trades"
        />
        <KpiCard
            title="Max Drawdown"
            value={maxDrawdown.value}
            format="currency"
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
            description={`${maxDrawdown.percentage.toFixed(2)}% of peak equity`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>A list of your most recent trade activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTradesTable data={activities} />
        </CardContent>
      </Card>

    </div>
  );
}
