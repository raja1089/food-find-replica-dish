import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ChefHat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
  const { data: footerPages = [] } = useQuery({
    queryKey: ["/api/footer-pages"],
  });

  // Group footer pages by category
  const groupedPages = footerPages.reduce((acc: any, page: any) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {});

  // Sort pages within each category by order
  Object.keys(groupedPages).forEach(category => {
    groupedPages[category].sort((a: any, b: any) => a.order - b.order);
  });

  // Footer links with dynamic content integration
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "/contact" },
      ...(groupedPages["Company"] ? groupedPages["Company"].map((page: any) => ({ name: page.title, href: `/page/${page.slug}` })) : []),
    ],
    forCustomers: [
      { name: "Download Customer App", href: "#" },
      { name: "Food Safety", href: "#" },
      { name: "Quality Assurance", href: "#" },
      { name: "Order Tracking", href: "#" },
      { name: "Payment Options", href: "#" },
      ...(groupedPages["Customers"] ? groupedPages["Customers"].map((page: any) => ({ name: page.title, href: `/page/${page.slug}` })) : []),
    ],
    forCooks: [
      { name: "Join as Cook", href: "/cook-registration" },
      { name: "Cook Guidelines", href: "#" },
      { name: "Kitchen Standards", href: "#" },
      { name: "Cook Support", href: "#" },
      { name: "Download Cook App", href: "#" },
      ...(groupedPages["Cooks"] ? groupedPages["Cooks"].map((page: any) => ({ name: page.title, href: `/page/${page.slug}` })) : []),
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Refund Policy", href: "#" },
      ...(groupedPages["Legal"] ? groupedPages["Legal"].map((page: any) => ({ name: page.title, href: `/page/${page.slug}` })) : []),
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">HomemadeFood</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Connecting food lovers with authentic homemade meals from local home chefs. Fresh, healthy, and delicious food delivered to your doorstep.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Pan India Service</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91 8318868521</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@homemadefood.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">COMPANY</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">FOR CUSTOMERS</h3>
            <ul className="space-y-2">
              {footerLinks.forCustomers.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">FOR COOKS</h3>
            <ul className="space-y-2">
              {footerLinks.forCooks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">LEGAL</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & App Download */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* App Store Badges */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on App Store"
                className="h-10 hover:scale-105 transition-transform cursor-pointer"
              />
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Get it on Google Play"
                className="h-10 hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 HomemadeFood Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;