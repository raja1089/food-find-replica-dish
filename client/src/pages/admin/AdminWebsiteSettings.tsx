import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHero from "./AdminHero";
import AdminFooterSettings from "./AdminFooterSettings";
import AdminFooterPages from "./AdminFooterPages";

const AdminWebsiteSettings = () => {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Website Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your website's hero section, footer settings, and footer pages
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hero" data-testid="tab-hero">Hero Section</TabsTrigger>
            <TabsTrigger value="footer-settings" data-testid="tab-footer-settings">Footer Settings</TabsTrigger>
            <TabsTrigger value="footer-pages" data-testid="tab-footer-pages">Footer Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminHero />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="footer-settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Footer Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminFooterSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="footer-pages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Footer Pages Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminFooterPages />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminWebsiteSettings;