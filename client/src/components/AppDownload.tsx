import { Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import appLogo from "@/assets/app-logo.png";

const AppDownload = () => {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Get the Zomato app
            </h2>
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              We will send you a link, open it on your phone to download the app
            </p>
            
            {/* Input Method Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-white">
                  <input type="radio" name="method" defaultChecked className="text-primary" />
                  <span>Email</span>
                </label>
                <label className="flex items-center space-x-2 text-white">
                  <input type="radio" name="method" className="text-primary" />
                  <span>Phone</span>
                </label>
              </div>
              
              <div className="flex space-x-3">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="bg-primary hover:bg-primary-glow text-white px-6 py-3 rounded-lg font-semibold transition-smooth">
                  Share App Link
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - App Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src={appLogo} 
                alt="Zomato App Mockup" 
                className="w-64 h-auto rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Download Badges */}
        <div className="mt-8 text-center">
          <p className="text-white/80 mb-4">Download app from</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <img 
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
              alt="Download on App Store"
              className="h-12 hover:scale-105 transition-smooth cursor-pointer"
            />
            <img 
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
              alt="Get it on Google Play"
              className="h-12 hover:scale-105 transition-smooth cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;