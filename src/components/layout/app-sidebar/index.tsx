'use client'
import { CheckSquare, Code, StickyNote, Settings, Menu, ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavigationItem } from "./index.d";
import { Heading, Text } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

const navigationItems: NavigationItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      path: '/todo',
      label: 'Todo',
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      path: '/notebook',
      label: 'Notebook',
      icon: <Code className="h-5 w-5" />
    },
    {
      path: '/mindspace',
      label: 'MindSpace',
      icon: <StickyNote className="h-5 w-5" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Mobile menu button
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );

  return (
    <>
      <MobileMenuButton />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
          isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "",
          !isMobile && isCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <div className="flex h-16 items-center px-4 py-4">
          {!isCollapsed && (
            <div className="flex items-center">
              <Heading variant="h4" className="tracking-tight">
                MinimalMind
              </Heading>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            <span className="sr-only">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2 flex-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;

            return isCollapsed ? (
              <TooltipProvider key={item.path}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-200",
                        isActive
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 transition-colors duration-200",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                <Text className="tracking-tight text-sm font-medium">
                  {item.label}
                </Text>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-2" />

        <div className="p-2">
          <Link
            href="/logout"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <Text>Logout</Text>}
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
