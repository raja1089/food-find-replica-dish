import { Button } from "@/components/ui/button";

const Hero = () => {
  const bgImage =
    "/herobg.jpg";

  return (
    <section className="relative w-full h-screen text-white flex flex-col justify-between overflow-hidden">
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">QOOKKAR</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            India’s #1 homemade food delivery app
          </p>
        </div>
      </div>

      {/* Bottom Action - Responsive */}
      <div className="relative z-10 w-full px-4 pb-6">
        {/* Mobile: Big Order Now Button */}
        <div className="block md:hidden">
          <Button
            size="lg"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full py-4 text-lg"
            onClick={() => window.location.href = "/download"}
          >
            Order Now
          </Button>
        </div>

        {/* Desktop: App Store & Play Store Badges */}
        <div className="hidden md:flex justify-center gap-4">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className="h-12"
            />
          </a>
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              className="h-12"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
