import { SidebarTrigger } from "@/components/ui/sidebar";
import { AlpacaIcon } from "@/components/icons";
import Link from "next/link";
import UserNav from "./user-nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <AlpacaIcon className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Alpaca Tracker</span>
        </Link>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
