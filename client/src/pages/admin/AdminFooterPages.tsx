import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, FileText, Search, Filter, Calendar, ExternalLink, Globe, Lock, ArrowUpDown, Copy, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

interface FooterPage {
  id?: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const AdminFooterPages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<FooterPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [formData, setFormData] = useState<FooterPage>({
    title: "",
    slug: "",
    content: "",
    category: "legal",
    isPublished: true,
    order: 0,
  });

  const { data: pages = [], isLoading } = useQuery<FooterPage[]>({
    queryKey: ["/api/admin/footer-pages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FooterPage) => {
      return apiRequest("/api/admin/footer-pages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-pages"] });
      setIsModalOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Footer page created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create footer page",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FooterPage }) => {
      return apiRequest(`/api/admin/footer-pages/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-pages"] });
      setIsModalOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Footer page updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update footer page",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/footer-pages/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-pages"] });
      toast({
        title: "Success",
        description: "Footer page deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete footer page",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      category: "legal",
      isPublished: true,
      order: 0,
    });
    setEditingPage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id!, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (page: FooterPage) => {
    setEditingPage(page);
    setFormData(page);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this footer page?")) {
      deleteMutation.mutate(id);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const categories = [
    { value: "legal", label: "Legal", icon: Lock, color: "bg-red-100 text-red-800" },
    { value: "company", label: "Company", icon: Globe, color: "bg-blue-100 text-blue-800" },
    { value: "support", label: "Support", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { value: "partner", label: "Partner", icon: ExternalLink, color: "bg-purple-100 text-purple-800" },
  ];

  // Filter and search logic
  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || page.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && page.isPublished) ||
                         (statusFilter === "draft" && !page.isPublished);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
  };

  // Export SQL function
  const exportSQL = () => {
    const sqlQueries = pages.map((page) => {
      return `INSERT INTO footer_pages (title, slug, content, category, "isPublished", "order") VALUES ('${page.title.replace(/'/g, "''")}', '${page.slug}', '${page.content.replace(/'/g, "''")}', '${page.category}', ${page.isPublished}, ${page.order});`;
    }).join('\n');
    
    const blob = new Blob([sqlQueries], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `footer-pages-export-${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "SQL export downloaded successfully",
    });
  };

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
      <TooltipProvider>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">Footer Pages Management</h1>
              <p className="text-gray-600 mt-2">Create and manage footer pages for your website</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={exportSQL}
                variant="outline"
                className="border-orange-300 hover:bg-orange-50"
                data-testid="button-export-sql"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Export SQL
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }} 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    data-testid="button-add-page"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Footer Page
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {editingPage ? "Edit Footer Page" : "Create New Footer Page"}
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                      {editingPage ? "Update the details of your footer page" : "Add a new page to your website footer"}
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setFormData({ 
                              ...formData, 
                              title,
                              slug: generateSlug(title)
                            });
                          }}
                          required
                          data-testid="input-title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          required
                          data-testid="input-slug"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                          data-testid="input-order"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={10}
                        required
                        data-testid="textarea-content"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                        data-testid="switch-published"
                      />
                      <Label>Published</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-save"
                      >
                        {editingPage ? "Update" : "Create"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsModalOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search pages by title, content, or slug..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48" data-testid="select-category-filter">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cards View */}
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page) => {
                const category = categories.find(c => c.value === page.category);
                const CategoryIcon = category?.icon || FileText;
                
                return (
                  <Card key={page.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-4 w-4 text-orange-600" />
                          <CardTitle className="text-lg" data-testid={`text-card-title-${page.id}`}>{page.title}</CardTitle>
                        </div>
                        <Badge className={category?.color}>
                          {category?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <code 
                              className="text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                              onClick={() => copyToClipboard(`/page/${page.slug}`)}
                              data-testid={`code-slug-${page.id}`}
                            >
                              /page/{page.slug}
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to copy URL</p>
                          </TooltipContent>
                        </Tooltip>
                        {page.isPublished ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {page.content.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Order: {page.order}</span>
                        <div className="flex space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(page)}
                                data-testid={`button-edit-${page.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit page</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(page.id!)}
                                data-testid={`button-delete-${page.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete page</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredPages.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No footer pages found</h3>
                  <p className="text-gray-400">
                    {pages.length === 0 
                      ? "Create your first footer page to get started." 
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600" data-testid="text-total-pages">{pages.length}</div>
                  <p className="text-sm text-gray-600">Total Pages</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-published-pages">
                    {pages.filter((p) => p.isPublished).length}
                  </div>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600" data-testid="text-draft-pages">
                    {pages.filter((p) => !p.isPublished).length}
                  </div>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600" data-testid="text-filtered-pages">{filteredPages.length}</div>
                  <p className="text-sm text-gray-600">Showing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </AdminLayout>
  );
};

export default AdminFooterPages;