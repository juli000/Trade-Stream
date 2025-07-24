'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton 
                variant="ghost" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                tooltip={{children: "Toggle Theme"}}
            >
                {theme === 'light' ? <Sun /> : <Moon />}
                <span>Toggle Theme</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
  );
}
