import type { Account, Activity, PortfolioHistory, Position } from './types';

export const mockAccount: Account = {
  id: 'mock-account-id',
  account_number: 'PA35401Z',
  status: 'ACTIVE',
  currency: 'USD',
  buying_power: '250000.00',
  regt_buying_power: '250000.00',
  daytrading_buying_power: '250000.00',
  cash: '95000.00',
  portfolio_value: '105320.50',
  equity: '105320.50',
  last_equity: '104820.50',
  long_market_value: '10320.50',
  short_market_value: '0.00',
  initial_margin: '5160.25',
  maintenance_margin: '3096.15',
  last_maintenance_margin: '3000.00',
  sma: '100000',
  daytrade_count: 0,
  created_at: '2023-01-01T00:00:00Z',
};

const generatePortfolioHistory = (): PortfolioHistory => {
  const history: PortfolioHistory = {
    timestamp: [],
    equity: [],
    profit_loss: [],
    profit_loss_pct: [],
    base_value: 100000,
    timeframe: '1M',
  };

  const now = new Date();
  let currentEquity = 100000;

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    history.timestamp.push(Math.floor(date.getTime() / 1000));
    
    currentEquity += (Math.random() - 0.48) * 500;
    history.equity.push(parseFloat(currentEquity.toFixed(2)));
    const pl = currentEquity - history.base_value;
    history.profit_loss.push(parseFloat(pl.toFixed(2)));
    history.profit_loss_pct.push(parseFloat((pl / history.base_value).toFixed(4)));
  }
  
  // Ensure the last data point matches the account equity
  history.equity[history.equity.length - 1] = parseFloat(mockAccount.equity);

  return history;
};

export const mockPortfolioHistory = generatePortfolioHistory();

export const mockActivities: Activity[] = [
  { id: 't-1', activity_type: 'FILL', transaction_time: new Date().toISOString(), type: 'fill', price: '180.50', qty: '10', side: 'buy', symbol: 'AAPL', pl: undefined, leaves_qty: '0', order_id: 'o-1', cum_qty: '10', net_amount: null, per_share_amount: null, description: 'Partial fill of buy 10 shares of AAPL' },
  { id: 't-2', activity_type: 'FILL', transaction_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '175.48', qty: '10', side: 'sell', symbol: 'AAPL', pl: 120.80, leaves_qty: '0', order_id: 'o-2', cum_qty: '10', net_amount: null, per_share_amount: null, description: 'Partial fill of sell 10 shares of AAPL' },
  { id: 't-3', activity_type: 'FILL', transaction_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '580.10', qty: '5', side: 'buy', symbol: 'TSLA', pl: undefined, leaves_qty: '0', order_id: 'o-3', cum_qty: '5', net_amount: null, per_share_amount: null, description: 'Fill of buy 5 shares of TSLA' },
  { id: 't-4', activity_type: 'FILL', transaction_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '595.12', qty: '5', side: 'sell', symbol: 'TSLA', pl: 75.10, leaves_qty: '0', order_id: 'o-4', cum_qty: '5', net_amount: null, per_share_amount: null, description: 'Fill of sell 5 shares of TSLA' },
  { id: 't-5', activity_type: 'FILL', transaction_time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '340.00', qty: '15', side: 'buy', symbol: 'NVDA', pl: undefined, leaves_qty: '0', order_id: 'o-5', cum_qty: '15', net_amount: null, per_share_amount: null, description: 'Fill of buy 15 shares of NVDA' },
  { id: 't-6', activity_type: 'FILL', transaction_time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '335.65', qty: '15', side: 'sell', symbol: 'NVDA', pl: -65.25, leaves_qty: '0', order_id: 'o-6', cum_qty: '15', net_amount: null, per_share_amount: null, description: 'Fill of sell 15 shares of NVDA' },
  { id: 't-7', activity_type: 'FILL', transaction_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '450.00', qty: '25', side: 'buy', symbol: 'MSFT', pl: undefined, leaves_qty: '0', order_id: 'o-7', cum_qty: '25' },
  { id: 't-8', activity_type: 'FILL', transaction_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '465.30', qty: '25', side: 'sell', symbol: 'MSFT', pl: 382.5, leaves_qty: '0', order_id: 'o-8', cum_qty: '25' },
  { id: 't-9', activity_type: 'FILL', transaction_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '150.00', qty: '30', side: 'buy', symbol: 'AMD', pl: undefined, leaves_qty: '0', order_id: 'o-9', cum_qty: '30' },
  { id: 't-10', activity_type: 'FILL', transaction_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'fill', price: '145.80', qty: '30', side: 'sell', symbol: 'AMD', pl: -126, leaves_qty: '0', order_id: 'o-10', cum_qty: '30' },
];

export const mockPositions: Position[] = [
    {
        asset_id: 'p-1',
        symbol: 'SPY',
        exchange: 'ARCA',
        asset_class: 'us_equity',
        avg_entry_price: '510.50',
        qty: '50',
        side: 'long',
        market_value: '25650.50',
        cost_basis: '25525.00',
        unrealized_pl: '125.50',
        unrealized_plpc: '0.0049167',
        unrealized_intraday_pl: '10.50',
        unrealized_intraday_plpc: '0.00041',
        current_price: '513.01',
        lastday_price: '512.80',
        change_today: '0.00041'
    },
    {
        asset_id: 'p-2',
        symbol: 'GOOGL',
        exchange: 'NASDAQ',
        asset_class: 'us_equity',
        avg_entry_price: '170.15',
        qty: '100',
        side: 'long',
        market_value: '17520.00',
        cost_basis: '17015.00',
        unrealized_pl: '505.00',
        unrealized_plpc: '0.029679',
        unrealized_intraday_pl: '120.00',
        unrealized_intraday_plpc: '0.00689',
        current_price: '175.20',
        lastday_price: '174.00',
        change_today: '0.00689'
    },
     {
        asset_id: 'p-3',
        symbol: 'MSFT',
        exchange: 'NASDAQ',
        asset_class: 'us_equity',
        avg_entry_price: '430.80',
        qty: '75',
        side: 'long',
        market_value: '32775.00',
        cost_basis: '32310.00',
        unrealized_pl: '465.00',
        unrealized_plpc: '0.01439',
        unrealized_intraday_pl: '-75.00',
        unrealized_intraday_plpc: '-0.00228',
        current_price: '437.00',
        lastday_price: '438.00',
        change_today: '-0.00228'
    }
];
