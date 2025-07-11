import { Leaf, Heart, Star, ShieldCheck, Clock, Truck } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "Veg Mode",
      description: "Filter and find only vegetarian options",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: Heart,
      title: "Healthy",
      description: "Curated healthy meal options for you",
      color: "text-pink-500",
      bgColor: "bg-pink-100"
    },
    {
      icon: Star,
      title: "Collections",
      description: "Discover trending food collections",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100"
    },
    {
      icon: ShieldCheck,
      title: "Hygiene+",
      description: "Restaurants with top hygiene standards",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Get your food delivered in 30 minutes",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: Truck,
      title: "Live Tracking",
      description: "Track your order in real-time",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What's waiting for you on the app?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our app is packed with features that enable you to experience 
            food delivery like never before
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border hover:border-primary/20 hover:shadow-lg transition-smooth food-card bg-card"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-bounce`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
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

export default FeaturesSection;