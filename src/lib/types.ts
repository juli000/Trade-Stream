export interface Account {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  buying_power: string;
  regt_buying_power: string;
  daytrading_buying_power: string;
  cash: string;
  portfolio_value: string;
  equity: string;
  last_equity: string;
  long_market_value: string;
  short_market_value: string;
  initial_margin: string;
  maintenance_margin: string;
  last_maintenance_margin: string;
  sma: string;
  daytrade_count: number;
  created_at: string;
}

export interface Activity {
  id: string;
  activity_type: 'FILL' | 'CASH' | 'DIV';
  transaction_time: string;
  type: 'fill' | 'cash_deposit';
  price: string | null;
  qty: string | null;
  side: 'buy' | 'sell';
  symbol: string | null;
  leaves_qty: string | null;
  order_id: string | null;
  cum_qty: string | null;
  net_amount: string | null; // For cash activities
  per_share_amount: string | null; // For dividends
  description: string;
  status?: string;
  pl?: number; // Manually calculated P/L
}

export interface PortfolioHistory {
  timestamp: number[];
  equity: (number | null)[];
  profit_loss: (number | null)[];
  profit_loss_pct: (number | null)[];
  base_value: number;
  timeframe: string;
}

export interface Position {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  avg_entry_price: string;
  qty: string;
  side: string;
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}
