import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { City } from "@shared/schema";

const PopularCitiesSection = () => {
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ["/api/cities/popular"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Popular cities</h2>
          <div className="flex space-x-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-300 rounded-xl"
                style={{ minWidth: '280px', height: '200px' }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Popular cities
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
            {cities.map((city: City, index: number) => (
              <div
                key={city.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer transition-smooth hover:scale-105 hover:shadow-card"
                style={{ minWidth: '280px', height: '200px' }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${city.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-bold mb-1">
                    {city.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {city.restaurantCount}+ restaurants
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-smooth"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCitiesSection;