import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Building, 
  MapPin, 
  Star, 
  BarChart3, 
  FileText, 
  Image, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Home,
  Shield,
  ChefHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
      current: location === "/admin"
    },
    {
      name: "Cities",
      href: "/admin/cities",
      icon: MapPin,
      current: location === "/admin/cities"
    },
    {
      name: "Kitchens",
      href: "/admin/restaurants", 
      icon: Building,
      current: location === "/admin/restaurants"
    },
    {
      name: "Features",
      href: "/admin/features",
      icon: Star,
      current: location === "/admin/features"
    },
    {
      name: "Statistics",
      href: "/admin/stats",
      icon: BarChart3,
      current: location === "/admin/stats"
    },
    {
      name: "Footer Pages",
      href: "/admin/footer-pages",
      icon: FileText,
      current: location === "/admin/footer-pages"
    },
    {
      name: "Footer Settings",
      href: "/admin/footer-settings",
      icon: Settings,
      current: location === "/admin/footer-settings"
    },
    {
      name: "Hero Section",
      href: "/admin/hero",
      icon: Image,
      current: location === "/admin/hero"
    },
    {
      name: "Kitchen Registrations",
      href: "/admin/cook-registrations",
      icon: ChefHat,
      current: location === "/admin/cook-registrations"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location === "/admin/settings"
    }
  ];

  return (
    <div className={cn(
      "bg-gray-900 text-white transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    item.current
                      ? "bg-orange-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <Icon className={cn("flex-shrink-0 h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-700">
          <Button
            variant="ghost"
            onClick={onLogout}
            className={cn(
              "w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white",
              collapsed && "justify-center"
            )}
          >
            <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;