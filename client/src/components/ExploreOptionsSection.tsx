import { TrendingUp, Award, Percent, Crown } from "lucide-react";

const ExploreOptionsSection = () => {
  const options = [
    {
      title: "Top Brands",
      description: "Delivery from top brand restaurants",
      icon: Crown,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      size: "large"
    },
    {
      title: "Trending Dishes",
      description: "Most ordered around you",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      size: "medium"
    },
    {
      title: "Great Offers",
      description: "Up to 60% off + extra discounts",
      icon: Percent,
      image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop",
      size: "medium"
    },
    {
      title: "Premium",
      description: "Exclusive restaurants for you",
      icon: Award,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      size: "large"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Explore options near you
          </h2>
          <p className="text-muted-foreground">
            Discover unique tastes & experiences around you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, index) => {
            const Icon = option.icon;
            const isLarge = option.size === "large";
            
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-smooth hover:scale-105 hover:shadow-elegant ${
                  isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
                style={{ 
                  height: isLarge ? '300px' : '250px',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${option.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent group-hover:from-black/60 transition-smooth"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div className="max-w-xs">
                      <h3 className={`font-bold mb-3 leading-tight ${isLarge ? 'text-3xl' : 'text-2xl'}`}>
                        {option.title}
                      </h3>
                      <p className="text-white/90 text-lg">
                        {option.description}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-smooth">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-primary rounded-full px-6 py-2 group-hover:bg-primary-glow transition-smooth">
                      <span className="text-sm font-semibold">Explore Now</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-smooth rounded-2xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreOptionsSection;