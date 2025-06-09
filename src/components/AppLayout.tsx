
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LibraryBig,
  KanbanSquare,
  MessageCircle,
  Settings,
  UserCircle,
  PanelLeft,
  Headphones,
  // Share2, // Removed Share2 icon as Social Poster is removed
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/wellness-library', label: 'Wellness Library', icon: LibraryBig },
  { href: '/my-boards', label: 'My Boards', icon: KanbanSquare },
  { href: '/audio-summaries', label: 'Audio Summaries', icon: Headphones },
  { href: '/chatbot', label: 'AI Chatbot', icon: MessageCircle },
  // { href: '/social-poster', label: 'Social Poster', icon: Share2 }, // Removed Social Poster
];

function MainSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Logo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  aria-label={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="items-center">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 p-2`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                {!isCollapsed && <span className="font-medium">User Name</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align={isCollapsed ? "center" : "end"} className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function MobileSidebar() {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <PanelLeft />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex flex-col bg-sidebar text-sidebar-foreground w-[280px]">
                <SidebarHeader className="p-0">
                    <Logo />
                </SidebarHeader>
                <SidebarContent className="p-2">
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <Link href={item.href}>
                          <SidebarMenuButton
                            isActive={pathname === item.href}
                            aria-label={item.label}
                            className="justify-start"
                          >
                            <item.icon />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarContent>
                 <SidebarFooter className="p-2 border-t border-sidebar-border">
                     <Button variant="ghost" className="w-full flex items-center justify-start gap-2 p-2">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                        <AvatarFallback>AW</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">User Name</span>
                    </Button>
                </SidebarFooter>
            </SheetContent>
        </Sheet>
    );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <div className="hidden md:block">
            <MainSidebar />
        </div>
        <SidebarInset className="flex-1 flex flex-col">
           <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
              <MobileSidebar />
              <div className="flex-1">
                 {/* Mobile header content, e.g., page title or search */}
              </div>
            </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
