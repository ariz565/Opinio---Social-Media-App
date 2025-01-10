"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Flag,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    icon: Users,
    submenu: [
      { name: "All Users", href: "/admin/users" },
      { name: "Roles & Permissions", href: "/admin/users/roles" },
      { name: "User Activity", href: "/admin/users/activity" },
    ],
  },
  {
    name: "Content",
    icon: MessageSquare,
    submenu: [
      { name: "All Posts", href: "/admin/posts" },
      { name: "Comments", href: "/admin/posts/comments" },
      { name: "Media Library", href: "/admin/posts/media" },
    ],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-card transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8", isCollapsed && "mx-auto")}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {navigation.map((item) =>
            item.submenu ? (
              <Collapsible
                key={item.name}
                open={openMenus.includes(item.name)}
                onOpenChange={() => toggleSubmenu(item.name)}
                className={cn("space-y-2", isCollapsed && "hidden")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openMenus.includes(item.name) && "rotate-90"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 ml-6">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === subItem.href
                          ? "bg-accent text-accent-foreground"
                          : "transparent"
                      )}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          )}
        </div>
      </ScrollArea>

      <div
        className={cn(
          "mt-auto p-4 border-t",
          isCollapsed && "flex justify-center"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="text-sm">
              <p className="font-medium">Updates</p>
              <p className="text-xs text-muted-foreground">
                3 new notifications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
