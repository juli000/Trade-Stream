import { AlpacaIcon } from "@/components/icons";
import Link from "next/link";
import UserNav from "./user-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "../ui/button";
import { Bot, Home, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <AlpacaIcon className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Alpaca Tracker</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/dashboard"><Home className="mr-2"/> Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/ai-trader"><Bot className="mr-2"/> AI Trader</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/settings"><Settings className="mr-2"/> Settings</Link>
            </Button>
        </nav>
      </div>
      <div className="flex flex-1 w-full items-center justify-end gap-4">
        <ThemeSwitcher />
        <UserNav />
      </div>
    </header>
  );
}
