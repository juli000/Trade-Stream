import type { Activity, PortfolioHistory } from './types';

export const calculateTotalReturn = (currentEquity: number, initialEquity: number) => {
  if (initialEquity === 0) {
    return { value: 0, percentage: 0 };
  }
  const absoluteReturn = currentEquity - initialEquity;
  const percentageReturn = (absoluteReturn / initialEquity) * 100;

  return { value: absoluteReturn, percentage: percentageReturn };
};

export const calculateWinRateAndAvgWinLoss = (activities: Activity[]) => {
  const trades = activities.filter(a => a.activity_type === 'FILL' && a.pl != null);
  if (trades.length === 0) {
    return { winRate: 0, avgWin: 0, avgLoss: 0, profitFactor: 0, winningTradesCount: 0, losingTradesCount: 0 };
  }

  const winningTrades = trades.filter(t => t.pl! > 0);
  const losingTrades = trades.filter(t => t.pl! < 0);

  const winningTradesCount = winningTrades.length;
  const losingTradesCount = losingTrades.length;

  const winRate = (winningTrades.length / (winningTradesCount + losingTradesCount)) * 100 || 0;

  const totalWinAmount = winningTrades.reduce((sum, t) => sum + t.pl!, 0);
  const totalLossAmount = Math.abs(losingTrades.reduce((sum, t) => sum + t.pl!, 0));

  const avgWin = winningTrades.length > 0 ? totalWinAmount / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? totalLossAmount / losingTrades.length : 0;
  
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : Infinity;

  return { winRate, avgWin, avgLoss, profitFactor, winningTradesCount, losingTradesCount };
};

export const calculateMaxDrawdown = (history: PortfolioHistory) => {
  let peak = -Infinity;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;

  history.equity.forEach(equityValue => {
    if (equityValue === null) return;
    if (equityValue > peak) {
      peak = equityValue;
    }
    const drawdown = peak - equityValue;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      if (peak !== 0) {
        maxDrawdownPercent = (maxDrawdown / peak) * 100;
      }
    }
  });

  return { value: maxDrawdown, percentage: maxDrawdownPercent };
};

// Assuming risk-free rate is 0 for simplicity. Sharpe = (Return - RiskFree) / StdDev
export const calculateSharpeRatio = (history: PortfolioHistory) => {
    const returns: number[] = [];
    for (let i = 1; i < history.equity.length; i++) {
        const prev = history.equity[i-1];
        const curr = history.equity[i];
        if (prev && curr && prev !== 0) {
            returns.push((curr - prev) / prev);
        }
    }

    if (returns.length < 2) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / returns.length);
    
    // Annualize Sharpe Ratio (assuming daily data)
    return stdDev > 0 ? (mean / stdDev) * Math.sqrt(252) : 0;
};
