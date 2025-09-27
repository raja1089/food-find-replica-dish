import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search } from "lucide-react";
import logo from "@/assets/app-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img
              src={logo}
              alt="Qookkar Logo"
              className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
              style={{ borderRadius: '5px' }}
            />
            <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">
              Qookkar
            </span>
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for kitchens, cuisine, or dishes..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-orange-500 rounded-lg"
              data-testid="input-search"
            />
          </div>

          {/* Dual Button Design */}
          <div className="flex items-center flex-shrink-0">
            <div className="bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <Link href="/chef/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900 hover:bg-white font-medium px-4 py-2 rounded-md transition-all duration-200"
                    data-testid="button-chef-login"
                  >
                    Chef Login
                  </Button>
                </Link>
                <Link href="/kitchen-registration">
                  <Button
                    size="sm"
                    className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2 font-medium transition-colors duration-200 ml-1"
                    data-testid="button-join"
                  >
                    Join
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