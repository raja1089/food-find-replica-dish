import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Lottie from "lottie-react";
import chefCooking from "@/assets/chef-cooking.png";
import deliveryScooter from "@/assets/delivery-scooter.png";
import chefFood from "@/assets/chef-food.png";
import dancingChefAnimation from "@assets/dancing-chef.json";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: chefCooking,
      title: "Partner with QOOKKAR",
      subtitle: "Join thousands of home chefs earning with us",
      action: "Become a Chef"
    },
    {
      image: deliveryScooter,
      title: "Lightning Fast Delivery",
      subtitle: "Fresh homemade food delivered to your doorstep",
      action: "Order Now"
    },
    {
      image: chefFood,
      title: "Quality Homemade Food",
      subtitle: "Authentic recipes made with love and care",
      action: "Explore Menu"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: '#fff' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-200/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-4 items-center w-full max-w-6xl mx-auto">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              {/* Dancing Chef Animation */}
              <div className="flex justify-center lg:justify-start mb-1">
                <div className="w-12 h-12 lg:w-16 lg:h-16">
                  <Lottie 
                    animationData={dancingChefAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900">
                <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                  QOOKKAR
                </span>
              </h1>
              <div className="h-20 lg:h-24">
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 transition-all duration-700 ease-in-out">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 mt-2 transition-all duration-700 ease-in-out">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/kitchen-registration">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {slides[currentSlide].action}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-full text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center lg:justify-start gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-orange-500 w-8' 
                      : 'bg-orange-200 hover:bg-orange-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Image Animation */}
          <div className="relative h-[400px] lg:h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 scale-100 translate-x-0'
                      : index === (currentSlide + 1) % slides.length
                      ? 'opacity-0 scale-95 translate-x-12'
                      : 'opacity-0 scale-95 -translate-x-12'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-80 lg:w-96 h-auto object-contain"
                    style={{ 
                      animation: 'float 6s ease-in-out infinite'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;