
"use client";

import * as React from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Use a client-side effect to determine if mobile after mount to avoid hydration issues
  const [isMobile, setIsMobile] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // For mobile sheet

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const toggleMobileSidebar = () => setSidebarOpen(!sidebarOpen);

  const NavItems = () => (
    <SidebarMenu>
      {siteConfig.mainNav.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              onClick={isMobile ? toggleMobileSidebar : undefined}
              tooltip={item.title}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <SidebarProvider defaultOpen={true} open={!isMobile} onOpenChange={isMobile ? undefined : (open) => {}}>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r"
        side="left"
      >
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            {/* Placeholder for logo or richer app name */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              {siteConfig.name}
            </span>
          </Link>
        </SidebarHeader>
        <Separator className="group-data-[collapsible=icon]:hidden" />
        <SidebarContent>
          <ScrollArea className="h-full">
            <NavItems />
          </ScrollArea>
        </SidebarContent>
        {/* <SidebarFooter className="p-2">
          Footer content if needed
        </SidebarFooter> */}
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 md:justify-end">
          {/* Mobile Nav Trigger - shown only on mobile */}
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
           <Link href="/" className="flex items-center gap-2 md:hidden">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-semibold text-lg">{siteConfig.name}</span>
          </Link>
          
          {/* Desktop right-aligned content (e.g., user profile) can go here */}
           <div className={cn("md:flex items-center gap-4", isMobile && "hidden")}>
            {/* Future user menu */}
          </div>
        </header>
        
        {/* Mobile Sidebar Sheet */}
        {isMobile && (
          <div className={cn(
            "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )} onClick={toggleMobileSidebar}>
            <div className={cn(
              "fixed left-0 top-0 h-full w-72 bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-2" onClick={toggleMobileSidebar}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  <span className="font-semibold text-lg">{siteConfig.name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <NavItems />
              </ScrollArea>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-none">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
