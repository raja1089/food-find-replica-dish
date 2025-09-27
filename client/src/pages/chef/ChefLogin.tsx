import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChefHat, Phone, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ChefLogin = () => {
  const [, setLocation] = useLocation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call Laravel API to send OTP
      // await fetch('YOUR_LARAVEL_API/api/chef/send-otp', { ... })
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${phone}`,
      });
      setStep("otp");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP sent to your phone.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call Laravel API to verify OTP and get token
      // const response = await fetch('YOUR_LARAVEL_API/api/chef/verify-otp', { ... })
      // const { token, chef } = await response.json();
      // localStorage.setItem('chef_token', token);
      
      toast({
        title: "Login Successful",
        description: "Welcome back, Chef!",
      });
      setLocation("/chef/dashboard");
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // TODO: Call Laravel API to resend OTP
      toast({
        title: "OTP Resent",
        description: `New verification code sent to +91 ${phone}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chef Login</h1>
          <p className="text-gray-600">Access your kitchen dashboard</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">
              {step === "phone" ? "Enter Your Phone Number" : "Enter Verification Code"}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === "phone" 
                ? "We'll send you a verification code via SMS" 
                : `Code sent to +91 ${phone}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10 h-12 text-center text-lg font-medium"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    We'll send you an OTP for secure login
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg"
                  disabled={isLoading || phone.length < 10}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10 h-12 text-center text-2xl font-bold tracking-wider"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Verify & Login
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← Change phone number
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center w-full">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            New to our platform?{" "}
            <button
              onClick={() => setLocation("/kitchen-registration")}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Join as a Chef
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChefLogin;