import { Star, Clock, Bike, Heart, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Restaurant } from "@shared/schema";

const RestaurantGrid = () => {
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["/api/restaurants"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Best kitchens near you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-300 rounded-xl h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const mockRestaurants = restaurants.length > 0 ? [] : [
    {
      name: "KFC",
      cuisine: "Burgers, Fast Food",
      rating: 4.1,
      deliveryTime: "25-30 mins",
      price: "₹200 for two",
      offer: "50% OFF",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      promoted: true
    },
    {
      name: "Pizza Hut",
      cuisine: "Pizza, Italian",
      rating: 4.3,
      deliveryTime: "30-35 mins",
      price: "₹350 for two",
      offer: "30% OFF",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      promoted: false
    },
    {
      name: "Domino's Pizza",
      cuisine: "Pizza, Fast Food",
      rating: 4.2,
      deliveryTime: "20-25 mins",
      price: "₹400 for two",
      offer: "40% OFF",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      promoted: true
    },
    {
      name: "McDonald's",
      cuisine: "Burgers, Beverages",
      rating: 4.4,
      deliveryTime: "25-30 mins",
      price: "₹300 for two",
      offer: "20% OFF",
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
      promoted: false
    },
    {
      name: "Subway",
      cuisine: "Healthy Food, Salads",
      rating: 4.0,
      deliveryTime: "35-40 mins",
      price: "₹250 for two",
      offer: "25% OFF",
      image: "https://images.unsplash.com/photo-1555072956-7758afb20e8a?w=400&h=300&fit=crop",
      promoted: false
    },
    {
      name: "Starbucks Coffee",
      cuisine: "Beverages, Snacks",
      rating: 4.5,
      deliveryTime: "20-25 mins",
      price: "₹500 for two",
      offer: "15% OFF",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      promoted: true
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Best kitchens near you
            </h2>
            <p className="text-muted-foreground">
              Shortest delivery time • Live tracking
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Bike className="w-4 h-4" />
            <span>Delivering to Mumbai</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(restaurants.length > 0 ? restaurants : mockRestaurants).map((restaurant: any, index: number) => {
            const [isLiked, setIsLiked] = useState(false);
            const [isHovered, setIsHovered] = useState(false);
            
            return (
              <div
                key={restaurant.id || index}
                className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                data-testid={`card-restaurant-${restaurant.id || index}`}
              >
                {/* Restaurant Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Offer Badge */}
                  {restaurant.offer && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold px-2 py-1 rounded-md shadow-sm">
                      {restaurant.offer}
                    </Badge>
                  )}
                  
                  {/* Promoted Badge */}
                  {restaurant.promoted && (
                    <Badge variant="secondary" className="absolute top-3 right-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 font-medium">
                      Promoted
                    </Badge>
                  )}
                  
                  {/* Heart Icon */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                    data-testid={`button-like-${restaurant.id || index}`}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors duration-200 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                      }`} 
                    />
                  </Button>

                  {/* Quick Add Button */}
                  <Button
                    size="sm"
                    className="absolute bottom-3 right-3 h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                    data-testid={`button-add-${restaurant.id || index}`}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Restaurant Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {restaurant.cuisine}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {restaurant.price}
                    </span>
                    
                    <Badge variant="outline" className="text-xs bg-muted/50 border-border">
                      Free Delivery
                    </Badge>
                  </div>

                  {/* Hover Animation Bar */}
                  <div 
                    className={`h-0.5 bg-primary rounded-full transition-all duration-300 ${
                      isHovered ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <button className="text-primary font-semibold hover:text-primary-glow transition-smooth">
            View all restaurants →
          </button>
        </div>
      </div>
    </section>
  );
};

export default RestaurantGrid;