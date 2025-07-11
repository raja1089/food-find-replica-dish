import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ChefHat, Eye, Check, X, Clock, Mail, Phone, MapPin } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { CookRegistration } from '@shared/schema';

export default function AdminCookRegistrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRegistration, setSelectedRegistration] = useState<CookRegistration | null>(null);

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['/api/admin/cook-registrations'],
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest(`/api/admin/cook-registrations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cook-registrations'] });
      toast({
        title: 'Status Updated',
        description: 'Registration status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status.',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    statusMutation.mutate({ id, status });
  };

  const handleLogout = () => {
    window.location.href = '/api/admin/logout';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cook Registrations</h1>
            <p className="text-gray-600 mt-2">Manage cook partnership applications</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              All Registrations ({registrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cook Name</TableHead>
                  <TableHead>Kitchen Name</TableHead>
                  <TableHead>Kitchen Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Cuisines</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration: CookRegistration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.firstName} {registration.lastName}
                    </TableCell>
                    <TableCell>{registration.kitchenName}</TableCell>
                    <TableCell className="capitalize">
                      {registration.kitchenType.replace('_', ' ')}
                    </TableCell>
                    <TableCell>{registration.city}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {registration.cuisineTypes.slice(0, 2).map((cuisine) => (
                          <Badge key={cuisine} variant="outline" className="text-xs">
                            {cuisine}
                          </Badge>
                        ))}
                        {registration.cuisineTypes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{registration.cuisineTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell>
                      {new Date(registration.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRegistration(registration)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Cook Registration Details</DialogTitle>
                            </DialogHeader>
                            {selectedRegistration && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-2 flex items-center">
                                      <Mail className="w-4 h-4 mr-2" />
                                      Contact Information
                                    </h3>
                                    <p><strong>Name:</strong> {selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                                    <p><strong>Email:</strong> {selectedRegistration.email}</p>
                                    <p><strong>Phone:</strong> {selectedRegistration.phone}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2 flex items-center">
                                      <ChefHat className="w-4 h-4 mr-2" />
                                      Kitchen Information
                                    </h3>
                                    <p><strong>Kitchen Name:</strong> {selectedRegistration.kitchenName}</p>
                                    <p><strong>Type:</strong> {selectedRegistration.kitchenType.replace('_', ' ')}</p>
                                    <p><strong>Experience:</strong> {selectedRegistration.experience}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-semibold mb-2 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Address
                                  </h3>
                                  <p>{selectedRegistration.address}</p>
                                  <p>{selectedRegistration.city}, {selectedRegistration.state} - {selectedRegistration.pincode}</p>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Cuisines</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedRegistration.cuisineTypes.map((cuisine) => (
                                      <Badge key={cuisine} variant="outline">{cuisine}</Badge>
                                    ))}
                                  </div>
                                </div>

                                {selectedRegistration.specialties && selectedRegistration.specialties.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Specialties</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedRegistration.specialties.map((specialty) => (
                                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedRegistration.description && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700">{selectedRegistration.description}</p>
                                  </div>
                                )}

                                <div>
                                  <h3 className="font-semibold mb-2">Business Information</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p><strong>FSSAI:</strong> {selectedRegistration.fssaiLicense || 'Not provided'}</p>
                                      <p><strong>GST:</strong> {selectedRegistration.gstNumber || 'Not provided'}</p>
                                      <p><strong>PAN:</strong> {selectedRegistration.panNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                      <p><strong>Status:</strong> {getStatusBadge(selectedRegistration.status)}</p>
                                      <p><strong>Applied:</strong> {new Date(selectedRegistration.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <label className="font-semibold">Update Status:</label>
                                  <Select
                                    value={selectedRegistration.status}
                                    onValueChange={(status) => handleStatusChange(selectedRegistration.id, status)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Select
                          value={registration.status}
                          onValueChange={(status) => handleStatusChange(registration.id, status)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {registrations.length === 0 && (
              <div className="text-center py-8">
                <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No cook registrations found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}