import { ChefHat, Coffee, Wine, Utensils, Pizza, Star } from "lucide-react";

const OrderOnlineSection = () => {
  const categories = [
    {
      title: "Order Food Online",
      description: "Stay home and order to your doorstep",
      icon: Pizza,
      gradient: "from-red-500 to-red-600",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
    },
    {
      title: "Dining Out",
      description: "View menu & book table",
      icon: Utensils,
      gradient: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
    },
    {
      title: "Nightlife",
      description: "Explore curated nightlife",
      icon: Wine,
      gradient: "from-purple-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop"
    },
    {
      title: "Nutrition",
      description: "Find nutrition information",
      icon: Star,
      gradient: "from-green-500 to-green-600",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-smooth hover:scale-105 hover:shadow-elegant"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-90 transition-smooth`}></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-6 h-48 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2 leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {category.description}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-smooth">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-xs font-medium">Explore →</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;