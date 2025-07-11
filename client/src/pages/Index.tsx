import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OrderOnlineSection from "@/components/OrderOnlineSection";
import PopularCitiesSection from "@/components/PopularCitiesSection";
import ExploreOptionsSection from "@/components/ExploreOptionsSection";
import RestaurantGrid from "@/components/RestaurantGrid";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import AppDownload from "@/components/AppDownload";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <OrderOnlineSection />
        <PopularCitiesSection />
        <ExploreOptionsSection />
        <RestaurantGrid />
        <StatsSection />
        <FeaturesSection />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
