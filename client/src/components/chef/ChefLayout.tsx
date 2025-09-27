import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  ChefHat, 
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User,
  Package
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "@/components/ui/use-toast";

interface ChefLayoutProps {
  children: React.ReactNode;
}

const ChefLayout = ({ children }: ChefLayoutProps) => {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/chef/dashboard",
      icon: Home,
      description: "Overview and stats"
    },
    {
      name: "My Dishes",
      href: "/chef/dishes",
      icon: UtensilsCrossed,
      description: "Manage your menu"
    },
    {
      name: "Orders",
      href: "/chef/orders",
      icon: Package,
      description: "Order management"
    },
    {
      name: "Analytics",
      href: "/chef/analytics",
      icon: BarChart3,
      description: "Performance insights"
    },
    {
      name: "Profile",
      href: "/chef/profile",
      icon: User,
      description: "Account settings"
    },
    {
      name: "Settings",
      href: "/chef/settings",
      icon: Settings,
      description: "App preferences"
    }
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    // TODO: Clear auth token and call Laravel logout API
    localStorage.removeItem('chef_token');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/chef/login");
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Chef Panel</h2>
            <p className="text-sm text-gray-500">Welcome back!</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-orange-50 text-orange-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-orange-500" : ""}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${active ? "text-orange-600" : ""}`}>
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  {active && (
                    <div className="absolute right-0 w-0.5 h-8 bg-orange-500 rounded-l-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-100">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-500" />
              <span className="font-bold text-gray-900">Chef Panel</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ChefLayout;