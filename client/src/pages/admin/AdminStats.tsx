import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Users, Building, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Stats, InsertStats } from "@shared/schema";

const AdminStats = () => {
  const [formData, setFormData] = useState({
    restaurants: 0,
    cities: 0,
    users: 0,
    orders: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertStats) => {
      return await apiRequest("/api/admin/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Statistics updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update statistics",
        variant: "destructive",
      });
    },
  });

  // Initialize form data when stats are loaded
  React.useEffect(() => {
    if (stats) {
      setFormData({
        restaurants: stats.restaurants || 0,
        cities: stats.cities || 0,
        users: stats.users || 0,
        orders: stats.orders || 0
      });
    }
  }, [stats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600">Update platform statistics displayed on the homepage</p>
        </div>

        {/* Current Stats Display */}
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

        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Update Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restaurants">Total Restaurants</Label>
                  <Input
                    id="restaurants"
                    type="number"
                    min="0"
                    value={formData.restaurants}
                    onChange={(e) => setFormData({ ...formData, restaurants: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cities">Total Cities</Label>
                  <Input
                    id="cities"
                    type="number"
                    min="0"
                    value={formData.cities}
                    onChange={(e) => setFormData({ ...formData, cities: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="users">Total Users</Label>
                  <Input
                    id="users"
                    type="number"
                    min="0"
                    value={formData.users}
                    onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="orders">Total Orders</Label>
                  <Input
                    id="orders"
                    type="number"
                    min="0"
                    value={formData.orders}
                    onChange={(e) => setFormData({ ...formData, orders: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Statistics"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• These statistics are displayed on the homepage in the stats section</p>
              <p>• Updates will be reflected immediately on the frontend</p>
              <p>• Make sure to keep the numbers realistic and up-to-date</p>
              <p>• The statistics help build trust and credibility with users</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;