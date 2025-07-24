'use server';

import Alpaca from '@alpacahq/alpaca-trade-api';
import type { Activity } from '@/lib/types';

const {
  ALPACA_API_KEY_ID,
  ALPACA_API_SECRET_KEY,
  ALPACA_IS_PAPER = 'true', // default to paper trading
} = process.env;

if (!ALPACA_API_KEY_ID || !ALPACA_API_SECRET_KEY) {
  throw new Error('Alpaca API credentials are missing in environment variables');
}

const alpaca = new Alpaca({
  keyId: ALPACA_API_KEY_ID,
  secretKey: ALPACA_API_SECRET_KEY,
  paper: ALPACA_IS_PAPER.toLowerCase() === 'true',
});

export async function getAccount() {
  try {
    const account = await alpaca.getAccount();
    return account;
  } catch (error: any) {
    console.error('[Alpaca] Error fetching account:', error?.message);
    throw new Error('Failed to fetch Alpaca account');
  }
}

export async function getPortfolioHistory() {
  try {
    const history = await alpaca.getPortfolioHistory({
      date_start: undefined,      // optional
      date_end: undefined,        // optional
      period: '1M',               // required
      timeframe: '1D',            // required
      extended_hours: false       // required
    });
    return history;
  } catch (error: any) {
    console.error('[Alpaca] Error fetching portfolio history:', error?.message);
    throw new Error('Failed to fetch portfolio history from Alpaca.');
  }
}

export async function getActivities(): Promise<Activity[]> {
  try {
    const activities = await alpaca.getAccountActivities({
        activityTypes: 'FILL',
        pageSize: 100,
        direction: 'desc',
    });
    
    // Calculate P/L for sells based on previous buys
    const activitiesWithPl = [...activities].reverse().map((activity, index, self) => {
        if (activity.side === 'sell' && activity.price) {
            const buyActivity = self.slice(0, index).reverse().find(
                (a) => a.symbol === activity.symbol && a.side === 'buy' && a.price
            );

            if (buyActivity && buyActivity.price) {
                const pl = (parseFloat(activity.price) - parseFloat(buyActivity.price)) * parseFloat(activity.qty);
                return { ...activity, pl };
            }
        }
        return activity;
    }).reverse();


    // Grouping logic
    const groupedActivities: { [key: string]: Activity } = {};

    for (const activity of activitiesWithPl) {
        // Price can be null, handle it gracefully
        if (activity.price === null || activity.price === undefined) continue;

        const key = `${activity.symbol}|${activity.side}|${activity.price}`;
        if (groupedActivities[key]) {
            // Aggregate quantity
            const currentQty = parseFloat(groupedActivities[key].qty);
            const newQty = parseFloat(activity.qty);
            groupedActivities[key].qty = (currentQty + newQty).toString();
            
            // Aggregate P/L for sells
            if (groupedActivities[key].side === 'sell' && activity.pl) {
               const currentPl = groupedActivities[key].pl || 0;
               groupedActivities[key].pl = currentPl + activity.pl;
            }
        } else {
            // New entry
            groupedActivities[key] = { ...activity };
        }
    }

    return Object.values(groupedActivities);

  } catch (error: any) {
    console.error('[Alpaca] Error fetching activities:', error?.message);
    throw new Error('Failed to fetch trade activities from Alpaca.');
  }
}


export async function getPositions() {
  try {
    const positions = await alpaca.getPositions();
    return positions;
  } catch (error: any) {
    console.error('[Alpaca] Error fetching positions:', error?.message);
    throw new Error('Failed to fetch positions from Alpaca.');
  }
}
