'use server';

import Alpaca from '@alpacahq/alpaca-trade-api';
import type { Activity } from '@/lib/types';
import { mockAccount, mockActivities, mockPortfolioHistory, mockPositions } from '@/lib/mock-data';
import type { Order } from '@alpacahq/alpaca-trade-api/dist/resources/order';

const {
  API_KEY,
  API_SECRET,
  ALPACA_IS_PAPER = 'true', // default to paper trading
} = process.env;

const useMockData = !API_KEY || !API_SECRET;

const alpaca = useMockData ? null : new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: ALPACA_IS_PAPER.toLowerCase() === 'true',
});

export async function getAccount() {
  if (useMockData) return mockAccount;
  try {
    const account = await alpaca!.getAccount();
    return account;
  } catch (error: any) {
    console.error('[Alpaca] Error fetching account:', error?.message);
    throw new Error(`Failed to fetch Alpaca account: ${error.message}`);
  }
}

export async function getPortfolioHistory() {
    if (useMockData) return mockPortfolioHistory;
  try {
    const history = await alpaca!.getPortfolioHistory({
      date_start: undefined,      // optional
      date_end: undefined,        // optional
      period: '1M',               // required
      timeframe: '1D',            // required
      extended_hours: false       // required
    });
    return history;
  } catch (error: any) {
    console.error('[Alpaca] Error fetching portfolio history:', error?.message);
    throw new Error(`Failed to fetch portfolio history from Alpaca: ${error.message}`);
  }
}

export async function getActivities(): Promise<Activity[]> {
    if (useMockData) return mockActivities;
  try {
    const activities: Activity[] = await alpaca!.getAccountActivities({
        // activityTypes: 'FILL', // Keep all activities for now
        pageSize: 100,
        direction: 'desc',
    });
    
    // Calculate P/L for sells based on previous buys. This is a simplified calculation.
    const activitiesWithPl = [...activities].reverse().map((activity, index, self) => {
        if (activity.activity_type === 'FILL' && activity.side === 'sell' && activity.price) {
            const buyActivity = self.slice(0, index).reverse().find(
                (a) => a.activity_type === 'FILL' && a.symbol === activity.symbol && a.side === 'buy' && a.price
            );

            if (buyActivity && buyActivity.price) {
                const pl = (parseFloat(activity.price) - parseFloat(buyActivity.price)) * parseFloat(activity.qty);
                return { ...activity, pl };
            }
        }
        return activity;
    }).reverse();


    return activitiesWithPl;

  } catch (error: any) {
    console.error('[Alpaca] Error fetching activities:', error?.message);
    throw new Error(`Failed to fetch trade activities from Alpaca: ${error.message}`);
  }
}

export async function getOrders(): Promise<Order[]> {
    if (useMockData) {
        // Return some mock orders
        const mockOrders: Order[] = [
            { id: 'mo-1', symbol: 'AAPL', qty: '10', side: 'buy', type: 'market', status: 'filled', filled_at: new Date().toISOString(), submitted_at: new Date().toISOString(), filled_qty: '10', filled_avg_price: '180.50' },
            { id: 'mo-2', symbol: 'TSLA', qty: '5', side: 'sell', type: 'limit', status: 'canceled', submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), limit_price: '600.00' },
            { id: 'mo-3', symbol: 'NVDA', qty: '15', side: 'buy', type: 'market', status: 'new', submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        ] as any;
        return mockOrders;
    };
    try {
        const orders = await alpaca!.getOrders({
            status: 'all',
            limit: 50,
            nested: true // Attached assets
        });
        return orders;
    } catch (error: any) {
        console.error('[Alpaca] Error fetching orders:', error?.message);
        throw new Error(`Failed to fetch orders from Alpaca: ${error.message}`);
    }
}


export async function getPositions() {
    if (useMockData) return mockPositions;
  try {
    const positions = await alpaca!.getPositions();
    return positions;
  } catch (error: any) {
    console.error('[Alpaca] Error fetching positions:', error?.message);
    throw new Error(`Failed to fetch positions from Alpaca: ${error.message}`);
  }
}
