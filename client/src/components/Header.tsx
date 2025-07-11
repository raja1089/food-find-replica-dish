import { useState } from "react";
import { Menu, X, ChefHat, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">HomemadeFood</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Home
              </Link>
              <Link href="/about" className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                About
              </Link>
              <Link href="/how-it-works" className={`text-sm font-medium transition-colors ${isActive('/how-it-works') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                How It Works
              </Link>
              <Link href="/contact" className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Contact
              </Link>
            </nav>

            {/* Contact Info */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>info@homemadefood.com</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              size="sm" 
              className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/cook-registration'}
            >
              Join as Cook
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              <Link href="/" className={`block py-2 px-3 rounded-lg transition-colors ${isActive('/') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'}`}>
                Home
              </Link>
              <Link href="/about" className={`block py-2 px-3 rounded-lg transition-colors ${isActive('/about') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'}`}>
                About
              </Link>
              <Link href="/how-it-works" className={`block py-2 px-3 rounded-lg transition-colors ${isActive('/how-it-works') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'}`}>
                How It Works
              </Link>
              <Link href="/contact" className={`block py-2 px-3 rounded-lg transition-colors ${isActive('/contact') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'}`}>
                Contact
              </Link>
              <div className="pt-4 border-t border-border space-y-2">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 mb-1">
                    <Phone className="w-4 h-4" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@homemadefood.com</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-primary text-primary-foreground"
                  onClick={() => window.location.href = '/cook-registration'}
                >
                  Join as Cook
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