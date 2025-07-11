import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-food.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover the best
            <br />
            <span className="text-primary-glow">food & drinks</span>
            <br />
            in your city
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Experience fast & easy online ordering on the FoodFind app
          </p>

          {/* Search Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto card-shadow animate-slide-up">
            <div className="space-y-4">
              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Enter your delivery location"
                  className="pl-12 h-12 text-base border-border"
                />
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for restaurants, cuisines or dishes"
                  className="pl-12 h-12 text-base border-border"
                />
              </div>

              <Button className="w-full h-12 bg-gradient-primary text-primary-foreground font-semibold hover:scale-105 transition-bounce">
                Find Food
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="text-center animate-bounce-in">
            <p className="text-white/80 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Pizza", "Burger", "Chinese", "Biryani", "Ice Cream"].map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-smooth"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-white/70 text-sm">Scroll down</div>
        <div className="w-0.5 h-8 bg-white/30 mx-auto mt-2"></div>
      </div>
    </section>
  );
};

export default Hero;