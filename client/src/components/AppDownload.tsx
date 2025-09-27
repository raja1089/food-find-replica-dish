import { ChefHat, Smartphone, Heart, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import appLogo from "@/assets/app-logo.png";

const AppDownload = () => {
  const features = [
    {
      title: "Healthy Meals",
      icon: "🍲",
    },
    {
      title: "Homemade Chefs",
      icon: "👩‍🍳",
    },
    {
      title: "Affordable Pricing",
      icon: "💸",
    },
    {
      title: "Clean & Hygienic",
      icon: "🧼",
    },
    {
      title: "Trusted Quality",
      icon: "✅",
    },
    {
      title: "Veg & Non-Veg",
      icon: "🥗🍗",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        {/* Header */}
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
          Pure Homemade Food, Delivered
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          Discover delicious meals made by passionate home chefs — healthy, clean, affordable, and full of love.
        </p>

        {/* App and Features */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Mobile Image + App Buttons */}
          <div className="space-y-8">
            <img
              src="https://t3.ftcdn.net/jpg/15/45/05/76/240_F_1545057684_NivmBOW8v9YWLB1awcWOQlhwhyuu7WjS.jpg"
              alt="App Preview"
              className="mx-auto w-102 sm:w-00 md:w-106"
            />

            <div className="flex justify-center gap-4 flex-wrap">
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-14 hover:scale-105 transition-transform"
                />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on App Store"
                  className="h-14 hover:scale-105 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-amber-50 rounded-xl px-4 py-6 shadow hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="text-base font-medium text-gray-800">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to taste the love of home kitchens?
          </h3>
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg"
            onClick={() => window.location.href = "/cook-registration"}
          >
            Register Your Kitchen
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
