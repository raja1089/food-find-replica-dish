import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { insertCookRegistrationSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ChefHat, MapPin, Phone, Mail, FileText, Star, Clock, Users, Shield, ArrowRight } from 'lucide-react';

const cookRegistrationFormSchema = insertCookRegistrationSchema.extend({
  cuisineTypes: z.array(z.string()).min(1, 'Please select at least one cuisine type'),
  specialties: z.array(z.string()).optional(),
});

type CookRegistrationFormData = z.infer<typeof cookRegistrationFormSchema>;

const cuisineOptions = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 
  'South Indian', 'North Indian', 'Bengali', 'Punjabi', 'Gujarati', 
  'Rajasthani', 'Maharashtrian', 'Biryani', 'Street Food', 'Desserts'
];

const kitchenTypes = [
  { value: 'home_kitchen', label: 'Home Kitchen' },
  { value: 'restaurant', label: 'Kitchen' },
  { value: 'cloud_kitchen', label: 'Cloud Kitchen' }
];

// OTP verification schema
const otpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function CookRegistration() {
  const { toast } = useToast();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [step, setStep] = useState<'phone' | 'otp' | 'registration'>('phone');
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);

  // Phone verification form
  const phoneForm = useForm<{ phone: string }>({
    resolver: zodResolver(z.object({ phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits') })),
    defaultValues: { phone: '' },
  });

  // OTP verification form
  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(z.object({ otp: z.string().length(6, 'OTP must be 6 digits') })),
    defaultValues: { otp: '' },
  });

  // Registration form
  const form = useForm<CookRegistrationFormData>({
    resolver: zodResolver(cookRegistrationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      kitchenName: '',
      kitchenType: 'home_kitchen',
      cuisineTypes: [],
      address: '',
      city: '',
      state: '',
      pincode: '',
      fssaiLicense: '',
      gstNumber: '',
      panNumber: '',
      experience: '',
      specialties: [],
      description: '',
    },
  });

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      // Simulate OTP sending - in real app, this would call your SMS service
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      setOtpSent(true);
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: 'A 6-digit OTP has been sent to your mobile number.',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to Send OTP',
        description: 'There was an error sending the OTP. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      // Simulate OTP verification - in real app, this would verify with your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp === '123456') { // Demo OTP
        return { success: true };
      }
      throw new Error('Invalid OTP');
    },
    onSuccess: () => {
      setStep('registration');
      form.setValue('phone', verifiedPhone);
      toast({
        title: 'Phone Verified',
        description: 'Your phone number has been verified successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Invalid OTP',
        description: 'The OTP you entered is incorrect. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: CookRegistrationFormData) => {
      await apiRequest('/api/cook-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Registration Submitted!',
        description: 'Your cook registration has been submitted successfully. We will review your application and get back to you soon.',
      });
      form.reset();
      setSelectedCuisines([]);
      setSelectedSpecialties([]);
      setStep('phone');
      setVerifiedPhone('');
      setOtpSent(false);
    },
    onError: (error) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error submitting your registration. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleCuisineToggle = (cuisine: string) => {
    const newSelectedCuisines = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter(c => c !== cuisine)
      : [...selectedCuisines, cuisine];
    
    setSelectedCuisines(newSelectedCuisines);
    form.setValue('cuisineTypes', newSelectedCuisines);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const newSelectedSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    setSelectedSpecialties(newSelectedSpecialties);
    form.setValue('specialties', newSelectedSpecialties);
  };

  const onSendOtp = (data: { phone: string }) => {
    setVerifiedPhone(data.phone);
    sendOtpMutation.mutate(data.phone);
  };

  const onVerifyOtp = (data: { otp: string }) => {
    verifyOtpMutation.mutate(data.otp);
  };

  const onSubmit = (data: CookRegistrationFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-12 w-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Join as a Cook Partner</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your culinary passion with food lovers in your city. Join our platform as a cook partner and start your journey in the food delivery business.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Reach More Customers</h3>
              <p className="text-sm text-gray-600">Connect with thousands of food lovers in your area</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Flexible Hours</h3>
              <p className="text-sm text-gray-600">Work according to your schedule and availability</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Grow Your Business</h3>
              <p className="text-sm text-gray-600">Build your reputation and grow your food business</p>
            </CardContent>
          </Card>
        </div>

        {/* Phone Verification Step */}
        {step === 'phone' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Phone className="mr-2 h-6 w-6" />
                Verify Your Phone Number
              </CardTitle>
              <p className="text-gray-600">We'll send you a verification code to get started</p>
            </CardHeader>
            <CardContent>
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your 10-digit phone number" 
                            {...field} 
                            className="text-lg py-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="mr-2 h-6 w-6" />
                Enter Verification Code
              </CardTitle>
              <p className="text-gray-600">
                We've sent a 6-digit code to {verifiedPhone}. Please enter it below.
              </p>
              <p className="text-sm text-blue-600">Demo: Use 123456 as OTP</p>
            </CardHeader>
            <CardContent>
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter 6-digit OTP</FormLabel>
                        <FormControl>
                          <div className="flex justify-center">
                            <InputOTP
                              maxLength={6}
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep('phone')}
                    >
                      Change Number
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      disabled={verifyOtpMutation.isPending}
                    >
                      {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={() => sendOtpMutation.mutate(verifiedPhone)}
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? 'Sending...' : 'Resend OTP'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        {step === 'registration' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Kitchen Registration Form</CardTitle>
              <p className="text-green-600 flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Phone verified: {verifiedPhone}
              </p>
            </CardHeader>
            <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
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
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Kitchen Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" />
                    Kitchen Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="kitchenName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kitchen Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your kitchen name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kitchenType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kitchen Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select kitchen type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {kitchenTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Cuisine Types */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cuisine Types *</h3>
                  <p className="text-sm text-gray-600">Select all the cuisines you specialize in</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {cuisineOptions.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={cuisine}
                          checked={selectedCuisines.includes(cuisine)}
                          onCheckedChange={() => handleCuisineToggle(cuisine)}
                        />
                        <label htmlFor={cuisine} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {cuisine}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.cuisineTypes && (
                    <p className="text-sm text-red-600">{form.formState.errors.cuisineTypes.message}</p>
                  )}
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complete Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your complete address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode *</FormLabel>
                          <FormControl>
                            <Input placeholder="Pincode" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Business Information
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="fssaiLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FSSAI License</FormLabel>
                          <FormControl>
                            <Input placeholder="FSSAI License Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number</FormLabel>
                          <FormControl>
                            <Input placeholder="GST Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number</FormLabel>
                          <FormControl>
                            <Input placeholder="PAN Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Experience and Specialties */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Experience & Specialties</h3>
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about yourself</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your cooking experience, specialties, and what makes your food special..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        )}

        {/* Footer Note */}
        {step === 'registration' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              By submitting this form, you agree to our terms and conditions. We will review your application and contact you within 2-3 business days.
            </p>
          </div>
        )}

        {/* Get Started Section */}
        {step === 'phone' && (
          <div className="mt-8 bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Get Started - It only takes 10 minutes</h3>
            <p className="text-gray-600 mb-4">Please keep these documents and details ready for a smooth sign-up</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm">PAN card</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm">FSSAI license</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm">Bank account details</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm">GST number, if applicable</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm">Menu & profile food image</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}