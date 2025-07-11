import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: () => {
      navigate("/admin/login");
    },
  });

  // Fetch data
  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ["/api/admin/cities"],
  });

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ["/api/admin/restaurants"],
  });

  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ["/api/admin/features"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Cities" value={stats?.cities || 0} loading={statsLoading} />
          <StatsCard title="Restaurants" value={stats?.restaurants || 0} loading={statsLoading} />
          <StatsCard title="Users" value={stats?.users || 0} loading={statsLoading} />
          <StatsCard title="Orders" value={stats?.orders || 0} loading={statsLoading} />
        </div>

        <Tabs defaultValue="cities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="cities">
            <CitiesTab cities={cities} loading={citiesLoading} />
          </TabsContent>

          <TabsContent value="restaurants">
            <RestaurantsTab restaurants={restaurants} cities={cities} loading={restaurantsLoading} />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTab features={features} loading={featuresLoading} />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab stats={stats} loading={statsLoading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const StatsCard = ({ title, value, loading }: { title: string; value: number; loading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{loading ? "..." : value}</div>
    </CardContent>
  </Card>
);

const CitiesTab = ({ cities, loading }: { cities: any[]; loading: boolean }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (cityData: any) => {
      const response = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityData),
      });
      if (!response.ok) throw new Error("Failed to create city");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "City created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...cityData }: any) => {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityData),
      });
      if (!response.ok) throw new Error("Failed to update city");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      setEditingCity(null);
      toast({ title: "Success", description: "City updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cities/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete city");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cities"] });
      toast({ title: "Success", description: "City deleted successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cityData = {
      name: formData.get("name") as string,
      image: formData.get("image") as string,
      restaurantCount: parseInt(formData.get("restaurantCount") as string) || 0,
      isPopular: formData.get("isPopular") === "on",
    };

    if (editingCity) {
      updateMutation.mutate({ id: editingCity.id, ...cityData });
    } else {
      createMutation.mutate(cityData);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cities Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New City</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" required />
              </div>
              <div>
                <Label htmlFor="restaurantCount">Restaurant Count</Label>
                <Input id="restaurantCount" name="restaurantCount" type="number" defaultValue="0" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPopular" name="isPopular" />
                <Label htmlFor="isPopular">Popular City</Label>
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create City"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cities.map((city: any) => (
            <div key={city.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{city.name}</h3>
                <p className="text-sm text-gray-500">{city.restaurantCount} restaurants</p>
                {city.isPopular && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Popular</span>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCity(city)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(city.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {editingCity && (
        <Dialog open={!!editingCity} onOpenChange={() => setEditingCity(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingCity.name} required />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" defaultValue={editingCity.image} required />
              </div>
              <div>
                <Label htmlFor="restaurantCount">Restaurant Count</Label>
                <Input id="restaurantCount" name="restaurantCount" type="number" defaultValue={editingCity.restaurantCount} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPopular" name="isPopular" defaultChecked={editingCity.isPopular} />
                <Label htmlFor="isPopular">Popular City</Label>
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update City"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

const RestaurantsTab = ({ restaurants, cities, loading }: { restaurants: any[]; cities: any[]; loading: boolean }) => {
  // Similar structure to CitiesTab but for restaurants
  if (loading) return <div>Loading...</div>;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurants Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {restaurants.map((restaurant: any) => (
            <div key={restaurant.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{restaurant.name}</h3>
                <p className="text-sm text-gray-500">{restaurant.cuisine} • Rating: {restaurant.rating}</p>
                <p className="text-sm text-gray-500">Delivery: {restaurant.deliveryTime}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturesTab = ({ features, loading }: { features: any[]; loading: boolean }) => {
  if (loading) return <div>Loading...</div>;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Features Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature: any) => (
            <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StatsTab = ({ stats, loading }: { stats: any; loading: boolean }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (statsData: any) => {
      const response = await fetch("/api/admin/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statsData),
      });
      if (!response.ok) throw new Error("Failed to update stats");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Success", description: "Stats updated successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const statsData = {
      restaurants: parseInt(formData.get("restaurants") as string) || 0,
      cities: parseInt(formData.get("cities") as string) || 0,
      users: parseInt(formData.get("users") as string) || 0,
      orders: parseInt(formData.get("orders") as string) || 0,
    };
    updateMutation.mutate(statsData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurants">Restaurants</Label>
              <Input id="restaurants" name="restaurants" type="number" defaultValue={stats?.restaurants || 0} />
            </div>
            <div>
              <Label htmlFor="cities">Cities</Label>
              <Input id="cities" name="cities" type="number" defaultValue={stats?.cities || 0} />
            </div>
            <div>
              <Label htmlFor="users">Users</Label>
              <Input id="users" name="users" type="number" defaultValue={stats?.users || 0} />
            </div>
            <div>
              <Label htmlFor="orders">Orders</Label>
              <Input id="orders" name="orders" type="number" defaultValue={stats?.orders || 0} />
            </div>
          </div>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Updating..." : "Update Stats"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;