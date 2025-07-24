'use server';

import Alpaca from '@alpacahq/alpaca-trade-api';

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

async function getClosedPositions() {
    try {
        const positions = await alpaca.getClosedPositions();
        return positions;
    } catch (error: any) {
        console.error('[Alpaca] Error fetching closed positions:', error?.message);
        throw new Error('Failed to fetch closed positions from Alpaca.');
    }
}


export async function getActivities() {
  try {
    // We get fills and closed positions to calculate P/L
    const [activities, closedPositions] = await Promise.all([
        alpaca.getAccountActivities({
            activityTypes: 'FILL',
            pageSize: 100,
            direction: 'desc',
        }),
        getClosedPositions()
    ]);
    
    // Create a map for quick lookup of closed position P/L
    const plBySymbol = new Map();
    for (const pos of closedPositions) {
        if (!plBySymbol.has(pos.symbol)) {
            plBySymbol.set(pos.symbol, []);
        }
        plBySymbol.get(pos.symbol).push(parseFloat(pos.unrealized_pl));
    }

    // Attempt to assign P/L to sell activities. This is an approximation.
    const activitiesWithPl = activities.map(activity => {
        if (activity.side === 'sell' && plBySymbol.has(activity.symbol)) {
            const pls = plBySymbol.get(activity.symbol);
            if (pls.length > 0) {
                 // Use the most recent P/L available for that symbol and remove it
                return { ...activity, pl: pls.shift() };
            }
        }
        return activity;
    });

    return activitiesWithPl;
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
