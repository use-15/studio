
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { useTheme } from 'next-themes';
import {
  Home,
  LibraryBig,
  KanbanSquare,
  MessageCircle,
  Settings,
  UserCircle,
  PanelLeft,
  Headphones,
  Sun,
  Moon,
  Laptop,
  Hospital,
  BookMarked,
  ArrowLeft, // Added ArrowLeft icon
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/wellness-library', label: 'Wellness Library', icon: LibraryBig },
  { href: '/free-online-library', label: 'Free Online Library', icon: BookMarked },
  { href: '/my-boards', label: 'Health Dashboard', icon: KanbanSquare },
  { href: '/hospitals', label: 'Hospitals', icon: Hospital },
  { href: '/audio-summaries', label: 'Audio Summaries', icon: Headphones },
  { href: '/chatbot', label: 'AI Chatbot', icon: MessageCircle },
];

function MainSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { setTheme } = useTheme();

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
                  <AvatarImage src="https://placehold.co/80x80/E5F5E0/228B22.png?text=BW" alt="Boss Willis" data-ai-hint="user avatar" />
                  <AvatarFallback>BW</AvatarFallback>
                </Avatar>
                {!isCollapsed && <span className="font-medium">Boss Willis</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align={isCollapsed ? "center" : "end"} className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Toggle theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {/* This would typically be a logout function call */}
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
    const { setTheme } = useTheme();
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
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full flex items-center justify-start gap-2 p-2">
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://placehold.co/80x80/E5F5E0/228B22.png?text=BW" alt="Boss Willis" data-ai-hint="user avatar"/>
                            <AvatarFallback>BW</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">Boss Willis</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-56">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                          </DropdownMenuItem>
                           <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                              <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                              <span>Toggle theme</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme('light')}>
                                  <Sun className="mr-2 h-4 w-4" />
                                  <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                  <Moon className="mr-2 h-4 w-4" />
                                  <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('system')}>
                                  <Laptop className="mr-2 h-4 w-4" />
                                  <span>System</span>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                             {/* This would typically be a logout function call */}
                            <span>Log out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                </SidebarFooter>
            </SheetContent>
        </Sheet>
    );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine if the back button should be shown.
  // For example, don't show on the main dashboard page ('/').
  const showBackButton = pathname !== '/';


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
            {showBackButton && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => router.back()} 
                className="mb-4"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
