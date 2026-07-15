import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Car, 
  BarChart3, 
  DollarSign,
  MapPin,
  Bot,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Map,
  Search,
  CreditCard,
  Receipt,
  FileText,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Define the types for our navigation items
interface SubMenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  submenu?: SubMenuItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Shipments",
    href: "/dashboard/shipments",
    icon: Truck
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users
  },
  {
    title: "Vehicles",
    href: "/dashboard/vehicles",
    icon: Car
  },
  {
    title: "Finance",
    href: "/dashboard/finance",
    icon: DollarSign,
    submenu: [
      {
        title: "Overview",
        href: "/dashboard/finance",
        icon: DollarSign,
        exact: true
      },
      {
        title: "Expenses",
        href: "/dashboard/expenses",
        icon: CreditCard
      },
      {
        title: "Revenue",
        href: "/dashboard/revenue",
        icon: Receipt
      },
      {
        title: "Reports",
        href: "/dashboard/reports",
        icon: FileText
      }
    ]
  },
  {
    title: "Logistics",
    href: "/dashboard/logistics",
    icon: MapPin
  },
  {
    title: "Logistics Map",
    href: "/dashboard/logistics-map",
    icon: Map
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: Search
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: Bot
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
  {
    title: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle
  }
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (href: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  // Check if any submenu items are active
  const isSubmenuActive = (item: NavItem): boolean => {
    if (!item.submenu) return false;
    return item.submenu.some((subitem) => 
      subitem.exact 
        ? location === subitem.href 
        : location.startsWith(subitem.href)
    );
  };

  // Open submenu if it contains the active page
  useEffect(() => {
    navItems.forEach(item => {
      if (item.submenu && isSubmenuActive(item)) {
        setOpenSubmenus(prev => ({ ...prev, [item.href]: true }));
      }
    });
  }, [location]);

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Button 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold">GoBaltic</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.submenu ? (
                    <Collapsible 
                      open={openSubmenus[item.href] || isSubmenuActive(item)} 
                      onOpenChange={() => toggleSubmenu(item.href)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            (isSubmenuActive(item) || (item.exact ? location === item.href : location.startsWith(item.href)))
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                          {openSubmenus[item.href] ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pl-6 mt-1 space-y-1">
                          {item.submenu.map((subitem) => (
                            <Link 
                              key={subitem.href} 
                              href={subitem.href}
                              onClick={() => setIsOpen(false)}
                            >
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start",
                                  (subitem.exact ? location === subitem.href : location.startsWith(subitem.href))
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                )}
                              >
                                <subitem.icon className="mr-2 h-4 w-4" />
                                {subitem.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          (item.exact ? location === item.href : location.startsWith(item.href))
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-3">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Exit Dashboard
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}