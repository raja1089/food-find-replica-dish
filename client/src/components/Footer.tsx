import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      "About Us",
      "Careers",
      "Team",
      "FoodFind One",
      "FoodFind Instant",
      "FoodFind Genie"
    ],
    forFoodie: [
      "Code of Conduct",
      "Community",
      "Blogger Help",
      "Mobile Apps",
      "FoodFind Pro",
      "Live"
    ],
    forRestaurants: [
      "Partner With Us",
      "Apps For You",
      "Restaurant Widgets",
      "Products for Business",
      "Restaurant Marketing",
      "Advertise"
    ],
    forYou: [
      "Privacy Policy",
      "Terms & Conditions",
      "Cookie Policy",
      "Offer Terms",
      "Phishing & Fraud",
      "Corporate Bug Bounty"
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
        {/* Language & Country Selector */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">🇮🇳</span>
            <span className="text-sm font-medium">India</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">🌐</span>
            <span className="text-sm font-medium">English</span>
          </div>
        </div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold text-primary">Zomato</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Discover the best food & drinks in your city. Fast delivery, great restaurants, and amazing experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Multiple locations across India</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@foodfind.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">COMPANY</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">FOR FOODIES</h3>
            <ul className="space-y-2">
              {footerLinks.forFoodie.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">FOR RESTAURANTS</h3>
            <ul className="space-y-2">
              {footerLinks.forRestaurants.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">FOR YOU</h3>
            <ul className="space-y-2">
              {footerLinks.forYou.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                    {link}
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
                className="h-10"
              />
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Get it on Google Play"
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 FoodFind Ltd. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;