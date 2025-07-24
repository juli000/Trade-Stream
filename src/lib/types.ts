import type {
  Account as AlpacaAccount,
  Activity as AlpacaActivity,
  PortfolioHistory as AlpacaPortfolioHistory,
  Position as AlpacaPosition,
} from '@alpacahq/alpaca-trade-api/dist/resources/account.js';

export type {
  AlpacaAccount,
  AlpacaActivity,
  AlpacaPortfolioHistory,
  AlpacaPosition,
};

// The types from the SDK are slightly different from what the API returns/what we need.
// We can create our own types that are more specific to our needs.
export interface Account extends AlpacaAccount {}
export interface Activity extends AlpacaActivity {
  pl?: number; // Manually calculated P/L
}
export interface PortfolioHistory extends AlpacaPortfolioHistory {}
export interface Position extends AlpacaPosition {}
