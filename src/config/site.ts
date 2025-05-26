
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Bot, BellRing, Settings } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  mainNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "OddsWise",
  description: "Intelligent odds aggregation and betting suggestions.",
  mainNav: [
    {
      title: "Odds Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "AI Assistant",
      href: "/ai-assistant",
      icon: Bot,
    },
    {
      title: "Alerts",
      href: "/alerts",
      icon: BellRing,
    },
    // Example for future use:
    // {
    //   title: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    //   disabled: true,
    // },
  ],
};
