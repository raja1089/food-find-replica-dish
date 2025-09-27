import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "search", 
    label: "Search",
    icon: Search,
    href: "/search",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBag,
    href: "/orders",
    badge: 2,
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: Heart,
    href: "/favorites",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
  },
];

export function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navigationItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.id} href={item.href}>
              <button
                className={`
                  relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px]
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
                data-testid={`nav-${item.id}`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  
                  {/* Badge for notifications/cart count */}
                  {item.badge && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary border-0 min-w-[16px]">
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                
                <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area padding for devices with home indicators */}
      <div className="pb-safe" />
    </nav>
  );
}