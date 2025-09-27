import { useState, useEffect } from "react";
import ChefLayout from "@/components/chef/ChefLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  UtensilsCrossed, 
  Package, 
  Star,
  Clock,
  IndianRupee,
  Eye,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api";

interface OrderData {
  id: number;
  customer: string;
  items: string;
  amount: number;
  status: string;
  time: string;
}

interface PopularDish {
  name: string;
  orders: number;
  revenue: number;
  trend: string;
}

interface DashboardData {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalDishes: number;
    rating: number;
  };
  recentOrders: OrderData[];
  popularDishes: PopularDish[];
}

const ChefDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalDishes: 0,
      rating: 0.0
    },
    recentOrders: [],
    popularDishes: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log("Loading dashboard data from real API...");
      
      // Fetch dashboard analytics data
      const dashboardResponse = await apiService.getDashboard();
      console.log("Dashboard API response:", dashboardResponse);
      
      // Fetch recent orders data  
      const ordersResponse = await apiService.getOrders();
      console.log("Orders API response:", ordersResponse);
      
      // Fetch dishes data for menu count
      const dishesResponse = await apiService.getDishes();
      console.log("Dishes API response:", dishesResponse);

      // Map API response to dashboard data structure
      const dashboardStats = dashboardResponse.data || dashboardResponse;
      const ordersData = ordersResponse.data || ordersResponse.orders || [];
      const dishesData = dishesResponse.data || dishesResponse.dishes || [];

      setDashboardData({
        stats: {
          totalOrders: dashboardStats.total_orders || dashboardStats.totalOrders || 0,
          totalRevenue: dashboardStats.total_revenue || dashboardStats.totalRevenue || 0,
          totalDishes: Array.isArray(dishesData) ? dishesData.length : (dashboardStats.total_dishes || 0),
          rating: dashboardStats.rating || dashboardStats.average_rating || 0.0
        },
        recentOrders: Array.isArray(ordersData) ? ordersData.slice(0, 5).map((order: any) => ({
          id: order.id,
          customer: order.customer_name || order.customer || 'Unknown',
          items: order.items || order.dish_names || 'Items',
          amount: order.total_amount || order.amount || 0,
          status: order.status || 'pending',
          time: order.created_at || order.time || 'N/A'
        })) : [],
        popularDishes: dashboardStats.popular_dishes || dashboardStats.popularDishes || []
      });

      toast({
        title: "Success",
        description: "Dashboard data loaded successfully",
      });
      
    } catch (error: any) {
      console.error("Dashboard API error:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
      
      // Fallback to empty data
      setDashboardData({
        stats: { totalOrders: 0, totalRevenue: 0, totalDishes: 0, rating: 0.0 },
        recentOrders: [],
        popularDishes: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      preparing: "bg-yellow-100 text-yellow-800",
      ready: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    subtitle, 
    trend 
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    subtitle?: string;
    trend?: string;
  }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              {trend && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {trend}
                </Badge>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <ChefLayout>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ChefLayout>
    );
  }

  return (
    <ChefLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, Chef!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening in your kitchen today</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New Dish
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={dashboardData.stats.totalOrders}
            icon={Package}
            subtitle="This month"
            trend="+23%"
          />
          <StatCard
            title="Revenue"
            value={`₹${dashboardData.stats.totalRevenue.toLocaleString()}`}
            icon={IndianRupee}
            subtitle="This month"
            trend="+18%"
          />
          <StatCard
            title="Active Dishes"
            value={dashboardData.stats.totalDishes}
            icon={UtensilsCrossed}
            subtitle="In your menu"
          />
          <StatCard
            title="Rating"
            value={dashboardData.stats.rating}
            icon={Star}
            subtitle="Average rating"
            trend="+0.2"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your kitchen</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <Badge className={`text-xs ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Dishes */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Popular Dishes</CardTitle>
                <CardDescription>Your top performing dishes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.popularDishes.map((dish, index) => (
                    <div key={dish.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{dish.name}</p>
                        <p className="text-xs text-gray-500">{dish.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{dish.revenue.toLocaleString()}</p>
                        <p className="text-xs text-green-600">{dish.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your kitchen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Add Dish</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="text-sm">View Orders</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <UtensilsCrossed className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Menu</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ChefLayout>
  );
};

export default ChefDashboard;