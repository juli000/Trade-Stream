'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import { AlpacaIcon } from '@/components/icons';
import { Home, Settings, Briefcase, Bot } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';

export default function MainNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar className="border-r" side="left" collapsible="icon">
      <SidebarContent>
        <SidebarHeader className="hidden">
           <AlpacaIcon className="h-8 w-8 text-primary" />
        </SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/dashboard')}
              tooltip={{ children: 'Dashboard' }}
            >
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/ai-trader')}
              tooltip={{ children: 'AI Trader' }}
            >
              <Link href="/ai-trader">
                <Bot />
                <span>AI Trader</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/settings')}
              tooltip={{ children: 'Settings' }}
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
