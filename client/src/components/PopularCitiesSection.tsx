import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PopularCitiesSection = () => {
  const cities = [
    {
      name: "Mumbai",
      restaurants: "2,500+ restaurants",
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=300&h=200&fit=crop"
    },
    {
      name: "Delhi NCR",
      restaurants: "3,200+ restaurants",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop"
    },
    {
      name: "Bangalore",
      restaurants: "1,800+ restaurants",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop"
    },
    {
      name: "Hyderabad",
      restaurants: "1,200+ restaurants",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop"
    },
    {
      name: "Chennai",
      restaurants: "1,000+ restaurants",
      image: "https://images.unsplash.com/photo-1562979314-bee9d3346cca?w=300&h=200&fit=crop"
    },
    {
      name: "Pune",
      restaurants: "900+ restaurants",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=200&fit=crop"
    },
    {
      name: "Kolkata",
      restaurants: "800+ restaurants",
      image: "https://images.unsplash.com/photo-1558431382-27b463e49776?w=300&h=200&fit=crop"
    }
  ];

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
            {cities.map((city, index) => (
              <div
                key={index}
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
                    {city.restaurants}
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