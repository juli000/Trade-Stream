# **App Name**: Alpaca Portfolio Tracker

## Core Features:

- API Key Management: Securely store Alpaca API credentials for accessing user trading data.
- Alpaca API Integration: Use Alpaca's Trade API to retrieve historical trades, portfolio history, account equity, and buying power.  Data fetched either on a schedule, or upon page load.
- Dashboard UI: Display a dashboard with current bankroll (account equity), a graph of bankroll over time, and a list of recent trades (ticker, entry/exit date/time, size, P/L per trade, optional strategy tag).
- Statistics Section: Provide a statistics section displaying total return (%), daily return (average, std), win rate, average win/loss, Sharpe Ratio, and max drawdown.
- Graphing Tools: Offer graphing tools, including a line chart of the equity curve (using Chart.js or Recharts) and an optional pie chart for position allocation.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust and stability, mirroring the financial nature of the application.
- Background color: Light gray (#ECEFF1), a very desaturated version of the primary, offering a clean and professional backdrop for financial data.
- Accent color: Teal (#009688), providing a contrasting hue for key interactive elements, drawing attention and enhancing user engagement.
- Body and headline font: 'Inter', a sans-serif typeface to ensure readability and provide a modern, neutral aesthetic suitable for displaying financial data.
- Use clear, minimalist icons to represent different data points and actions within the application. Favor a consistent stroke weight and visual style.
- Employ a clean, data-focused layout that emphasizes key financial metrics and provides a clear, easily understandable visualization of portfolio performance.
- Incorporate subtle animations to enhance user experience (e.g., smooth transitions, data updates).