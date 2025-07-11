import { Star, Clock, Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RestaurantGrid = () => {
  const restaurants = [
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
              Best food near you
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl overflow-hidden card-shadow hover:shadow-elegant transition-smooth hover:scale-105 cursor-pointer"
            >
              {/* Restaurant Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-smooth"
                />
                
                {/* Offer Badge */}
                {restaurant.offer && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground font-semibold">
                      {restaurant.offer}
                    </Badge>
                  </div>
                )}
                
                {/* Promoted Badge */}
                {restaurant.promoted && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-medium">
                      Promoted
                    </Badge>
                  </div>
                )}

                {/* Quick Action on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                  <div className="bg-white rounded-full px-4 py-2 font-semibold text-primary">
                    View Menu
                  </div>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-smooth">
                    {restaurant.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {restaurant.cuisine}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {restaurant.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
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