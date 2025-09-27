import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Save, Plus, Trash2, Building2, Globe, Phone, Mail, MapPin, Eye, EyeOff, CheckCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const footerSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyDescription: z.string().min(1, "Company description is required"),
  companyLogo: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  socialLinks: z.string().optional(),
  appStoreUrl: z.string().optional(),
  playStoreUrl: z.string().optional(),
  copyrightText: z.string().min(1, "Copyright text is required"),
  showSocialLinks: z.boolean(),
  showAppLinks: z.boolean(),
  showContactInfo: z.boolean(),
});

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  id?: number;
  companyName?: string;
  companyDescription?: string;
  companyLogo?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  copyrightText?: string;
  showSocialLinks?: boolean;
  showAppLinks?: boolean;
  showContactInfo?: boolean;
  updatedAt?: string;
}

const AdminFooterSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [socialLinksArray, setSocialLinksArray] = useState<SocialLink[]>([]);

  const { data: settings, isLoading, isError } = useQuery<FooterSettings>({
    queryKey: ["/api/admin/footer-settings"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const form = useForm({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: {
      companyName: "Qookkar",
      companyDescription: "Qookkar connects food lovers with premium homemade meals from expert home chefs. Fresh, authentic, and gourmet food delivered with care.",
      companyLogo: "",
      address: "Pan India Service",
      phone: "+91 8318868521",
      email: "info@qookkar.com",
      socialLinks: "",
      appStoreUrl: "",
      playStoreUrl: "",
      copyrightText: "© 2025 HomemadeFood Ltd. All rights reserved.",
      showSocialLinks: true,
      showAppLinks: true,
      showContactInfo: true,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (settings) {
      form.reset({
        companyName: settings.companyName || "Qookkar",
        companyDescription: settings.companyDescription || "Qookkar connects food lovers with premium homemade meals from expert home chefs. Fresh, authentic, and gourmet food delivered with care.",
        companyLogo: settings.companyLogo || "",
        address: settings.address || "Pan India Service",
        phone: settings.phone || "+91 8318868521",
        email: settings.email || "info@qookkar.com",
        socialLinks: settings.socialLinks || "",
        appStoreUrl: settings.appStoreUrl || "",
        playStoreUrl: settings.playStoreUrl || "",
        copyrightText: settings.copyrightText || "© 2025 HomemadeFood Ltd. All rights reserved.",
        showSocialLinks: settings.showSocialLinks ?? true,
        showAppLinks: settings.showAppLinks ?? true,
        showContactInfo: settings.showContactInfo ?? true,
      });

      if (settings.socialLinks) {
        try {
          setSocialLinksArray(JSON.parse(settings.socialLinks));
        } catch {
          setSocialLinksArray([]);
        }
      }
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/admin/footer-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          socialLinks: JSON.stringify(socialLinksArray),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-settings"] });
      toast({
        title: "Success",
        description: "Footer settings updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update footer settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  const addSocialLink = () => {
    setSocialLinksArray([...socialLinksArray, { name: "", url: "", icon: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinksArray(socialLinksArray.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinksArray];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinksArray(updated);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-600">Loading footer settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-medium">Error Loading Settings</div>
              <p className="text-gray-600">Unable to load footer settings. Please try refreshing the page.</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-settings"] })}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">Footer Settings</h1>
            <p className="text-gray-600 mt-2">Configure your website footer information and display preferences</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Auto-Save
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Information */}
            <Card className="border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="flex items-center text-xl">
                  <Building2 className="h-5 w-5 mr-2 text-orange-600" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Basic company details that will appear in your website footer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} data-testid="input-company-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="copyrightText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Copyright Text</FormLabel>
                        <FormControl>
                          <Input placeholder="© 2025 Company Ltd. All rights reserved." {...field} data-testid="input-copyright" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your company..."
                          rows={3}
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} data-testid="input-logo" />
                      </FormControl>
                      <FormDescription>
                        Enter the URL of your company logo image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center text-xl">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Contact details that customers can use to reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="contact@company.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Business St, City, State 12345"
                          rows={2}
                          {...field}
                          data-testid="textarea-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showContactInfo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Contact Information</FormLabel>
                        <FormDescription>
                          Display contact details in the footer
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-contact-info"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* App Store Links */}
            <Card className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center text-xl">
                  <Globe className="h-5 w-5 mr-2 text-purple-600" />
                  Mobile App Links
                </CardTitle>
                <CardDescription>
                  Links to your mobile applications on app stores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="appStoreUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>App Store URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://apps.apple.com/app/..." {...field} data-testid="input-app-store" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="playStoreUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Play URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://play.google.com/store/apps/..." {...field} data-testid="input-play-store" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="showAppLinks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show App Store Links</FormLabel>
                        <FormDescription>
                          Display download buttons for mobile apps
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-app-links"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
                <CardTitle className="flex items-center text-xl">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Social Media Links
                </CardTitle>
                <CardDescription>
                  Configure social media links for your footer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {socialLinksArray.map((link, index) => (
                  <div key={index} className="flex items-end space-x-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Platform Name</label>
                      <Input
                        placeholder="Facebook"
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                        data-testid={`input-social-name-${index}`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">URL</label>
                      <Input
                        placeholder="https://facebook.com/company"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                        data-testid={`input-social-url-${index}`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Icon</label>
                      <Input
                        placeholder="facebook"
                        value={link.icon}
                        onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                        data-testid={`input-social-icon-${index}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-remove-social-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSocialLink}
                    className="flex items-center"
                    data-testid="button-add-social"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>

                  <FormField
                    control={form.control}
                    name="showSocialLinks"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel>Show Social Links</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-social-links"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 min-w-32"
                data-testid="button-save"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminFooterSettings;