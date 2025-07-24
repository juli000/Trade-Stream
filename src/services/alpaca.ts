'use server';

import Alpaca from '@alpacahq/alpaca-trade-api/dist/alpaca-trade-api.js';

if (!process.env.ALPACA_API_KEY_ID) {
  throw new Error('ALPACA_API_KEY_ID is not defined in environment variables');
}
if (!process.env.ALPACA_API_SECRET_KEY) {
  throw new Error('ALPACA_API_SECRET_KEY is not defined in environment variables');
}

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY_ID,
  secretKey: process.env.ALPACA_API_SECRET_KEY,
  paper: true, // This should be configurable based on user preference
});

export async function getAccount() {
  try {
    return await alpaca.getAccount();
  } catch (e: any) {
    console.error('Error fetching Alpaca account:', e.message);
    throw new Error('Failed to fetch account data from Alpaca.');
  }
}

export async function getPortfolioHistory() {
    try {
        // You can adjust the timeframe and period as needed
        return await alpaca.getPortfolioHistory({
            period: '1M',
            timeframe: '1D'
        });
    } catch (e: any) {
        console.error('Error fetching Alpaca portfolio history:', e.message);
        throw new Error('Failed to fetch portfolio history from Alpaca.');
    }
}

export async function getActivities() {
    try {
        // Fetches all activities, you might want to add date constraints
        return await alpaca.getActivities();
    } catch (e: any) {
        console.error('Error fetching Alpaca activities:', e.message);
        throw new Error('Failed to fetch activities from Alpaca.');
    }
}

export async function getPositions() {
    try {
        return await alpaca.getPositions();
    } catch (e: any) {
        console.error('Error fetching Alpaca positions:', e.message);
        throw new Error('Failed to fetch positions from Alpaca.');
    }
}
