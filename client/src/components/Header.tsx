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
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-50 border-b border-amber-100/50 shadow-lg">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-24">
          {/* Logo Only */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Homemade Food Logo"
              className="w-16 h-16 object-contain transform transition-all group-hover:scale-110 group-hover:rotate-6"
            />
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
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full px-8 py-3 hover:from-amber-600 hover:to-orange-700 transition-all hover:scale-105 hover:shadow-xl"
              onClick={() => (window.location.href = "/kitchen-registration")}
            >
              Register Kitchen
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