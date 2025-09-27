import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, MapPin, Bell, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from "@/hooks/use-location";
import logo from "@/assets/app-logo.png";

const Header = () => {
  const { location, loading, requestLocation, hasPermission } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50 border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative">
              <img
                src={logo}
                alt="Qookkar Logo"
                className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                style={{ borderRadius: '8px' }}
              />
              <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="ml-3 text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
              Qookkar
            </span>
          </Link>

          {/* Dynamic Location Selector */}
          <div 
            className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
            onClick={requestLocation}
            data-testid="location-selector"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
            )}
            <span className="font-medium">
              {loading ? "Getting location..." : location?.city || "Mumbai"}
            </span>
            {!hasPermission && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                Click for GPS
              </span>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative flex-1 max-w-lg mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors" />
            <Input
              type="text"
              placeholder="Search for kitchens, cuisine, or dishes..."
              className="pl-10 pr-4 py-2.5 w-full bg-muted/50 border-border focus:bg-background focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 hover:bg-background/80"
              data-testid="input-search"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="h-9 w-9 px-0 relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary border-0">
                3
              </Badge>
            </Button>


            {/* Auth Buttons */}
            <div className="bg-muted/50 p-1 rounded-xl border border-border shadow-sm">
              <div className="flex items-center">
                <Link href="/chef/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-background font-medium px-4 py-2 rounded-lg transition-all duration-200"
                    data-testid="button-chef-login"
                  >
                    Chef Login
                  </Button>
                </Link>
                <Link href="/kitchen-registration">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-medium transition-all duration-200 ml-1 shadow-sm hover:shadow-md"
                    data-testid="button-join"
                  >
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;