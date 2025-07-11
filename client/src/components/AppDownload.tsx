import { Smartphone, Download, ChefHat, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import appLogo from "@/assets/app-logo.png";

const AppDownload = () => {
  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Get Our Mobile Apps
          </h2>
          <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed">
            Download our dedicated apps for the best homemade food experience
          </p>
        </div>

        {/* App Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Customer App */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Customer App</h3>
            <p className="text-white/80 mb-6 text-lg">
              Order authentic homemade meals from local home chefs in your area
            </p>
            <ul className="text-white/90 space-y-2 mb-8 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Browse local home kitchens
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Real-time order tracking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Multiple payment options
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Rate and review meals
              </li>
            </ul>
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Download Customer App</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download Customer App on App Store"
                  className="h-12 hover:scale-105 transition-smooth cursor-pointer"
                />
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get Customer App on Google Play"
                  className="h-12 hover:scale-105 transition-smooth cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Cook App */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Cook App</h3>
            <p className="text-white/80 mb-6 text-lg">
              Start your home kitchen business and reach customers in your neighborhood
            </p>
            <ul className="text-white/90 space-y-2 mb-8 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Manage your kitchen profile
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Upload menu and prices
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Receive and manage orders
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-glow rounded-full mr-3"></span>
                Track earnings and analytics
              </li>
            </ul>
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Download Cook App</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download Cook App on App Store"
                  className="h-12 hover:scale-105 transition-smooth cursor-pointer"
                />
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get Cook App on Google Play"
                  className="h-12 hover:scale-105 transition-smooth cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cook Registration CTA */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Home Kitchen Business?
          </h3>
          <p className="text-white/80 mb-6 text-lg">
            Join our community of home chefs and start earning from your cooking passion
          </p>
          <Button 
            className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-4 rounded-xl"
            onClick={() => window.location.href = '/cook-registration'}
          >
            Register Your Kitchen
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;