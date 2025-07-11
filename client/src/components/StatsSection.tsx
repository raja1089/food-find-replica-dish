import { Building, MapPin, Package, Star } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Building,
      number: "3,00,000+",
      label: "restaurants",
      color: "text-primary"
    },
    {
      icon: MapPin,
      number: "800+",
      label: "cities",
      color: "text-orange-500"
    },
    {
      icon: Package,
      number: "3 billion+",
      label: "orders delivered",
      color: "text-green-500"
    },
    {
      icon: Star,
      number: "4.5★",
      label: "average rating",
      color: "text-yellow-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Better food for
            <br />
            <span className="text-primary">more people</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            For over a decade, we've enabled our customers to discover new tastes, 
            delivered right to their doorstep
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-3 p-6 rounded-xl bg-card card-shadow hover:scale-105 transition-bounce animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-full bg-${stat.color.split('-')[1]}-100 flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
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

export default StatsSection;