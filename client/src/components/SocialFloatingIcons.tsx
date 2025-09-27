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
      {/* Compact Tooltip - Hidden on mobile */}
      <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 social-glass-tooltip rounded px-2 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/15" role="tooltip">
        <div className="relative z-10">{social.label}</div>
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-3 border-transparent border-l-black/60"></div>
      </div>
      
      {/* Compact Social Icon */}
      <Button
        ref={iconRef}
        asChild={!isMainFab}
        size="sm"
        className={`
          social-icon social-glass ${social.brandClass}
          ${isMainFab ? 'h-13 w-13 main-fab' : 'h-12 w-12'} 
          ${social.id === 'whatsapp' ? 'primary' : ''}
          rounded text-white
          animate-social-slide-in opacity-0 animation-fill-forwards
          border-white/15 hover:border-white/25
          min-h-[44px] min-w-[44px]
        `}
        style={{
          animationDelay: `${index * 60}ms`,
        }}
        onClick={isMainFab ? handleClick : undefined}
        data-testid={`social-${social.id}`}
        aria-label={social.label}
      >
        {isMainFab ? (
          <div className="flex items-center justify-center h-full w-full">
            <Icon className="h-5 w-5 transition-transform duration-200" />
          </div>
        ) : (
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-full w-full"
            onClick={handleClick}
          >
            <Icon className="h-5 w-5 transition-transform duration-200" />
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
      {/* Desktop Version - Premium Spacing */}
      <div className="hidden lg:flex fixed social-edge-desktop top-1/2 -translate-y-1/2 z-40 flex-col social-spacing-desktop">
        {socialLinks.map((social, index) => (
          <SocialIcon key={social.id} social={social} index={index} />
        ))}
        
        {/* Contact Card with proper spacing */}
        <div className="mt-2 text-center animate-social-slide-in opacity-0 animation-fill-forwards" style={{ animationDelay: '350ms' }}>
          <div className="social-glass rounded px-2 py-1.5 border border-white/15 min-w-[100px]">
            <div className="relative z-10">
              <p className="text-xs font-semibold text-white/95">Contact Us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Version */}
      <div className="hidden md:flex lg:hidden fixed social-edge-tablet top-1/2 -translate-y-1/2 z-40 flex-col social-spacing-tablet">
        {socialLinks.map((social, index) => (
          <SocialIcon key={social.id} social={social} index={index} />
        ))}
      </div>

      {/* Mobile Speed Dial with proper spacing */}
      <div className={`md:hidden fixed social-edge-mobile bottom-[calc(88px+env(safe-area-inset-bottom))] z-40 speed-dial ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="flex flex-col-reverse social-spacing-mobile">
          {/* Social Icons with staggered animation */}
          {socialLinks.map((social, index) => (
            <div
              key={social.id}
              style={{
                transitionDelay: isExpanded ? `${(index + 1) * 60}ms` : `${(socialLinks.length - index) * 40}ms`,
              }}
            >
              <SocialIcon social={social} index={index} />
            </div>
          ))}
          
          {/* Main FAB with proper accessibility */}
          <div 
            role="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Close contact menu" : "Open contact menu"}
            className="relative"
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
            {/* Subtle pulsing indicator for unopened FAB */}
            {!isExpanded && (
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}