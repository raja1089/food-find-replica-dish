import { useQuery } from "@tanstack/react-query";

const StatsSection = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const statsDisplay = [
    {
      icon: "https://img.icons8.com/ios-filled/50/000000/restaurant.png",
      number: isLoading ? "..." : `${(stats?.restaurants || 50).toLocaleString()}+`,
      label: "Culinary Hubs",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/000000/marker.png",
      number: isLoading ? "..." : `${stats?.cities || 5}+`,
      label: "Vibrant Cities",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/000000/delivery.png",
      number: isLoading ? "..." : `${((stats?.orders || 3000000000) / 1000000000).toFixed(1)}B+`,
      label: "Deliveries Made",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/000000/chef-hat.png",
      number: isLoading ? "..." : `${stats?.chefs || 100}+`,
      label: "Verified Chefs",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/000000/like--v1.png",
      number: isLoading ? "..." : `${stats?.happyCustomers || 1200}+`,
      label: "Happy Customers",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#fffdf9] to-[#f9f4ed] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Trusted by Millions, Loved at Every Bite
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
            Home-cooked excellence from kitchens across India.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* Left Stats */}
          <div className="flex flex-col gap-6 items-center md:items-end">
            {statsDisplay.slice(0, 2).map((stat, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md w-64 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="flex flex-col items-center">
            <div className="w-80 h-96">
              <img
                src="/homefoods.png"
                alt="Homemade Food"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Stat under image (for large screens) */}
            <div className="hidden md:flex mt-8">
              {statsDisplay.slice(2, 3).map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md w-72 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            {statsDisplay.slice(3).map((stat, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md w-64 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center stat on mobile */}
        <div className="md:hidden mt-10 flex justify-center">
          {statsDisplay.slice(2, 3).map((stat, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md w-72 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
