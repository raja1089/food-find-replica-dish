import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, Star, BarChart3, Users, ShoppingCart } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Stats } from "@shared/schema";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["/api/admin/cities"],
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ["/api/admin/restaurants"],
  });

  const { data: features = [] } = useQuery({
    queryKey: ["/api/admin/features"],
  });

  const statsCards = [
    {
      title: "Total Restaurants",
      value: stats?.restaurants || 0,
      icon: Building,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Cities",
      value: stats?.cities || 0,
      icon: MapPin,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const contentStats = [
    {
      title: "Active Cities",
      value: cities.length,
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      title: "Active Restaurants",
      value: restaurants.length,
      icon: Building,
      color: "text-orange-600",
    },
    {
      title: "Active Features",
      value: features.length,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Popular Cities",
      value: cities.filter((city: any) => city.isPopular).length,
      icon: BarChart3,
      color: "text-green-600",
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your food delivery platform</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Management Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900">Manage Cities</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove cities</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900">Manage Restaurants</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove restaurants</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900">Manage Features</h3>
                <p className="text-sm text-gray-600">Control app features and settings</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900">Hero Section</h3>
                <p className="text-sm text-gray-600">Update hero section content</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900">Footer Pages</h3>
                <p className="text-sm text-gray-600">Manage footer pages and content</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-semibold text-gray-900">Statistics</h3>
                <p className="text-sm text-gray-600">Update platform statistics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;