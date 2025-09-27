import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Chefs", href: "/chefs" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-2xl z-50 border-b border-gradient-to-r from-amber-200/30 via-orange-200/40 to-amber-200/30 shadow-2xl shadow-amber-500/10">
      <div className="container mx-auto px-8 max-w-8xl">
        <div className="flex items-center justify-between h-28">
          {/* Logo Only */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-red-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 scale-110"></div>
              <img
                src="/logo.png"
                alt="Qookkar Logo"
                className="relative w-20 h-20 object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl"
              />
            </div>
            <div className="ml-4 flex flex-col">
              <span className="text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight group-hover:from-amber-500 group-hover:via-orange-500 group-hover:to-red-500 transition-all duration-300">
                QOOKKAR
              </span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest -mt-1">
                Premium Experience
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-lg font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-amber-600"
                      : "text-gray-800 hover:text-amber-500"
                  } relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-amber-600 after:transition-all after:duration-300 ${
                    isActive(link.href) ? "after:w-full" : "hover:after:w-full"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <Button
              size="lg"
              className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black rounded-full px-10 py-4 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30 border border-amber-400/20"
              onClick={() => (window.location.href = "/kitchen-registration")}
            >
              <span className="relative z-10">Join Qookkar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full"></div>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full bg-amber-100/50 hover:bg-amber-200 transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-8 h-8 text-amber-800" />
            ) : (
              <Menu className="w-8 h-8 text-amber-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-amber-100/50">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <nav className="space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block text-xl font-semibold ${
                    isActive(link.href)
                      ? "text-amber-600"
                      : "text-gray-800 hover:text-amber-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-amber-100">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full py-4 hover:from-amber-600 hover:to-orange-700 transition-all hover:scale-105 hover:shadow-xl"
                  onClick={() => (window.location.href = "/kitchen-registration")}
                >
                  Register Kitchen
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;