import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import MainNav from '@/components/layout/main-nav';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Alpaca Portfolio Tracker',
  description: 'Track your Alpaca trading portfolio performance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="font-body antialiased h-full bg-background">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
            <div className="flex h-full flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                <MainNav />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
                </div>
            </div>
            <Toaster />
            </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
