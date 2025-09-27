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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

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

  const { data: settings, isLoading } = useQuery<FooterSettings>({
    queryKey: ["/api/admin/footer-settings"],
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
        body: JSON.stringify({
          ...data,
          socialLinks: JSON.stringify(socialLinksArray),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/footer-settings"] });
      toast({
        title: "Success",
        description: "Footer settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update footer settings",
        variant: "destructive",
      });
    },
  });

  const addSocialLink = () => {
    setSocialLinksArray([...socialLinksArray, { name: "", url: "", icon: "facebook" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinksArray(socialLinksArray.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinksArray];
    updated[index][field] = value;
    setSocialLinksArray(updated);
  };

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Footer Settings</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Manage all footer content including company information, contact details, and social media links.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic company details displayed in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-company-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="textarea-company-description" />
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
                      <Input {...field} placeholder="https://example.com/logo.png" data-testid="input-company-logo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details shown in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showContactInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Contact Information</FormLabel>
                      <FormDescription>Display contact details in the footer</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-show-contact" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-phone" />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Manage social media links displayed in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showSocialLinks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Social Links</FormLabel>
                      <FormDescription>Display social media links in the footer</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-show-social" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                {socialLinksArray.map((link, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Platform Name</label>
                      <Input
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                        placeholder="Facebook, Twitter, etc."
                        data-testid={`input-social-name-${index}`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                        placeholder="https://..."
                        data-testid={`input-social-url-${index}`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Icon</label>
                      <Input
                        value={link.icon}
                        onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                        placeholder="facebook, twitter, instagram"
                        data-testid={`input-social-icon-${index}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      data-testid={`button-remove-social-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addSocialLink}
                  className="w-full"
                  data-testid="button-add-social"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Store Links */}
          <Card>
            <CardHeader>
              <CardTitle>App Store Links</CardTitle>
              <CardDescription>Mobile app download links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showAppLinks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show App Store Links</FormLabel>
                      <FormDescription>Display app download buttons in the footer</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-show-apps" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appStoreUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Store URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://apps.apple.com/..." data-testid="input-app-store" />
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
                    <FormLabel>Google Play Store URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://play.google.com/..." data-testid="input-play-store" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Footer Bottom */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Bottom</CardTitle>
              <CardDescription>Copyright text and footer bottom content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="copyrightText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copyright Text</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-copyright" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-testid="button-save-settings"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Footer Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminFooterSettings;