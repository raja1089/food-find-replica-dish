import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FooterPage from "./pages/FooterPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCities from "./pages/admin/AdminCities";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminFeatures from "./pages/admin/AdminFeatures";
import AdminStats from "./pages/admin/AdminStats";
import AdminHero from "./pages/admin/AdminHero";
import AdminFooterPages from "./pages/admin/AdminFooterPages";
import AdminFooterSettings from "./pages/admin/AdminFooterSettings";
import AdminCookRegistrations from "./pages/admin/AdminCookRegistrations";
import CookRegistration from "./pages/CookRegistration";
import ChefLogin from "./pages/chef/ChefLogin";
import ChefDashboard from "./pages/chef/ChefDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
    },
  },
});

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/page/:slug" component={FooterPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/cities" component={AdminCities} />
      <Route path="/admin/restaurants" component={AdminRestaurants} />
      <Route path="/admin/features" component={AdminFeatures} />
      <Route path="/admin/stats" component={AdminStats} />
      <Route path="/admin/hero" component={AdminHero} />
      <Route path="/admin/footer-pages" component={AdminFooterPages} />
      <Route path="/admin/footer-settings" component={AdminFooterSettings} />
      <Route path="/admin/cook-registrations" component={AdminCookRegistrations} />
      <Route path="/kitchen-registration" component={CookRegistration} />
      <Route path="/chef/login" component={ChefLogin} />
      <Route path="/chef/dashboard" component={ChefDashboard} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route component={NotFound} />
    </Switch>
  );
}

const App = () => {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="qookkar-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
