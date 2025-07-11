import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
