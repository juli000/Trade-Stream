import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Badge } from "../ui/badge";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">Trade Stream</span>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">Algorithmic Trading Intelligence</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 w-full items-center justify-end gap-4">
        <ThemeSwitcher />
        <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <span className="font-semibold text-sm">Live</span>
        </div>
      </div>
    </header>
  );
}
