import { ChefHat, Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero-food.jpg";

const Hero = () => {
  const { data: heroData } = useQuery({
    queryKey: ["/api/hero"],
  });

  const backgroundImage = heroData?.backgroundImage || heroImage;
  const title = heroData?.title || "Authentic Homemade Food, Delivered Fresh";
  const subtitle = heroData?.subtitle || "Connect with local home chefs and enjoy authentic, homemade meals delivered to your doorstep";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {word === 'Homemade' || word === 'Food' ? (
                  <span className="text-primary-glow">{word}</span>
                ) : (
                  word
                )}
                {index < title.split(' ').length - 1 && ' '}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <ChefHat className="w-12 h-12 text-primary-glow mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Local Home Chefs</h3>
              <p className="text-sm text-white/80">Authentic recipes from skilled home cooks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Clock className="w-12 h-12 text-primary-glow mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Fresh & Fast</h3>
              <p className="text-sm text-white/80">Made to order and delivered hot</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-primary-glow mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-sm text-white/80">Verified kitchens with hygiene standards</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-primary-glow mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="text-sm text-white/80">Supporting local food entrepreneurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-white/70 text-sm">Discover More</div>
        <div className="w-0.5 h-8 bg-white/30 mx-auto mt-2"></div>
      </div>
    </section>
  );
};

export default Hero;