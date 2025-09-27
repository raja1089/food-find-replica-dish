import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin, Plus, Heart } from "lucide-react";
import { useState } from "react";

interface RestaurantCardProps {
  id: number;
  name: string;
  image?: string;
  rating: number;
  deliveryTime: string;
  priceForTwo: number;
  cuisine: string[];
  distance?: string;
  offer?: string;
  isVegetarian?: boolean;
}

export function RestaurantCard({
  id,
  name,
  image = "/placeholder.svg",
  rating,
  deliveryTime,
  priceForTwo,
  cuisine,
  distance = "2.1 km",
  offer,
  isVegetarian = false,
}: RestaurantCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-restaurant-${id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Offer Badge */}
        {offer && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold px-2 py-1 rounded-md shadow-sm">
            {offer}
          </Badge>
        )}
        
        {/* Vegetarian Badge */}
        {isVegetarian && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div>
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
          data-testid={`button-like-${id}`}
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
          data-testid={`button-add-${id}`}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Restaurant Name */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {cuisine.join(", ")}
          </p>
        </div>

        {/* Rating and Time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md">
            <Star className="h-3 w-3 fill-current" />
            <span className="font-medium">{rating}</span>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            ₹{priceForTwo} for two
          </span>
          
          {/* Delivery Status */}
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
      </CardContent>
    </Card>
  );
}

// Skeleton loader for restaurant cards
export function RestaurantCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-md bg-card">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-6 bg-muted rounded w-16 animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}