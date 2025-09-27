import { MessageCircle, Phone, Instagram, Facebook, Twitter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface SocialLink {
  id: string;
  icon: any;
  label: string;
  href: string;
  brandClass: string;
}

const socialLinks: SocialLink[] = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp Chat",
    href: "https://wa.me/919876543210?text=Hi! I'm interested in your homemade food delivery service.",
    brandClass: "brand-whatsapp",
  },
  {
    id: "phone",
    icon: Phone,
    label: "Call Now",
    href: "tel:+919876543210",
    brandClass: "brand-phone",
  },
  {
    id: "instagram",
    icon: Instagram,
    label: "Follow Instagram",
    href: "https://instagram.com/qookkar",
    brandClass: "brand-instagram",
  },
  {
    id: "facebook",
    icon: Facebook,
    label: "Facebook Page",
    href: "https://facebook.com/qookkar",
    brandClass: "brand-facebook",
  },
  {
    id: "twitter",
    icon: Twitter,
    label: "Twitter Updates",
    href: "https://twitter.com/qookkar",
    brandClass: "brand-twitter",
  },
];

interface SocialIconProps {
  social: SocialLink;
  index: number;
  isMainFab?: boolean;
  onClick?: () => void;
}

function SocialIcon({ social, index, isMainFab = false, onClick }: SocialIconProps) {
  const iconRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const Icon = social.icon;

  const handleClick = (e: React.MouseEvent) => {
    // Add ripple effect using currentTarget for better reliability
    const element = e.currentTarget as HTMLElement;
    if (element) {
      element.classList.remove('ripple');
      // Force reflow
      element.offsetHeight;
      element.classList.add('ripple');
      setTimeout(() => element.classList.remove('ripple'), 600);
    }

    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="group relative"
      style={{
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Premium Glass Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 social-glass rounded-xl px-4 py-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-white/20">
        <div className="relative z-10">{social.label}</div>
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-white/20"></div>
        {/* Glass noise overlay */}
        <div className="absolute inset-0 rounded-xl opacity-30 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
      
      {/* Premium Social Icon */}
      <Button
        ref={iconRef}
        asChild={!isMainFab}
        size="lg"
        className={`
          social-icon social-glass ${social.brandClass}
          h-14 w-14 rounded-full text-white
          animate-social-slide-in opacity-0 animation-fill-forwards
          ${isMainFab ? 'main-fab' : ''}
          border border-white/20
        `}
        style={{
          animationDelay: `${index * 120}ms`,
        }}
        onClick={isMainFab ? handleClick : undefined}
        data-testid={`social-${social.id}`}
        aria-label={social.label}
      >
        {isMainFab ? (
          <div className="flex items-center justify-center h-full w-full">
            <Icon className="h-6 w-6 transition-transform duration-300" />
          </div>
        ) : (
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-full w-full"
            onClick={handleClick}
          >
            <Icon className="h-6 w-6 transition-transform duration-300" />
          </a>
        )}
      </Button>
    </div>
  );
}

export function SocialFloatingIcons() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSpeedDial = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
        {socialLinks.map((social, index) => (
          <SocialIcon key={social.id} social={social} index={index} />
        ))}
        
        {/* Contact Card */}
        <div className="mt-6 text-center animate-social-slide-in opacity-0 animation-fill-forwards" style={{ animationDelay: '600ms' }}>
          <div className="social-glass rounded-xl px-4 py-3 border border-white/20">
            <div className="relative z-10">
              <p className="text-xs font-semibold text-white/90 mb-1">Contact Us</p>
              <p className="text-xs text-white font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                24/7 Support
              </p>
            </div>
            {/* Glass noise overlay */}
            <div className="absolute inset-0 rounded-xl opacity-20 bg-gradient-to-br from-white/10 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Speed Dial */}
      <div className={`lg:hidden fixed right-4 bottom-24 z-40 speed-dial ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="flex flex-col-reverse gap-3">
          {/* Social Icons */}
          {socialLinks.map((social, index) => (
            <div
              key={social.id}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : `${(socialLinks.length - index) * 50}ms`,
              }}
            >
              <SocialIcon social={social} index={index} />
            </div>
          ))}
          
          {/* Main FAB */}
          <div 
            role="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Close contact menu" : "Open contact menu"}
          >
            <SocialIcon
              social={{
                id: "contact",
                icon: Users,
                label: isExpanded ? "Close Menu" : "Contact Options",
                href: "#",
                brandClass: "brand-phone",
              }}
              index={0}
              isMainFab={true}
              onClick={toggleSpeedDial}
            />
          </div>
        </div>
      </div>
    </>
  );
}