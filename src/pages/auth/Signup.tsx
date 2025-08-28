import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignupForm, FormErrors } from '@/types/authTypes';
import { countries } from '@/data/mock';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { validateSignupForm } from "@/validation/authValidation";


export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState<SignupForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // const validateFormSignUp = (): boolean => {
  //   const newErrors: FormErrors = {};

  //   if (!formData.fullName.trim()) {
  //     newErrors.fullName = 'Full name is required';
  //   } else if (formData.fullName.trim().length < 2) {
  //     newErrors.fullName = 'Full name must be at least 2 characters';
  //   }

  //   if (!formData.email) {
  //     newErrors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //     newErrors.email = 'Please enter a valid email address';
  //   }

  //   if (!formData.password) {
  //     newErrors.password = 'Password is required';
  //   } else if (formData.password.length < 8) {
  //     newErrors.password = 'Password must be at least 8 characters';
  //   } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
  //     newErrors.password = 'Password must contain uppercase, lowercase, and number';
  //   }

  //   if (!formData.confirmPassword) {
  //     newErrors.confirmPassword = 'Please confirm your password';
  //   } else if (formData.password !== formData.confirmPassword) {
  //     newErrors.confirmPassword = 'Passwords do not match';
  //   }

  //   if (!formData.agreeToTerms) {
  //     newErrors.agreeToTerms = 'You must agree to the Terms & Privacy Policy';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateFormSignUp()) return;

  //   try {
  //     await signup({
  //       name: formData.fullName,
  //       email: formData.email,
  //       password: formData.password,
  //     });
  //     navigate('/dashboard');
  //   } catch (error) {
  //     // Error handling is done in the auth context
  //   }
  // };


// Inside handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors = validateSignupForm(formData);
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    await signup({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
    navigate('/dashboard');
  } catch (error) {
    // Error handling is done in the auth context
  }
};


  const handleInputChange = (field: keyof SignupForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 gradient-primary rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 gradient-accent rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 font-bold text-2xl text-foreground hover:text-primary transition-colors mb-6"
          >
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">GS</span>
            </div>
            <span>SuveyMappingTool</span>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Join Our Global Vendor Network
          </h1>
          <p className="text-muted-foreground">
            Start earning from market research projects today
          </p>
        </div>

        {/* Signup Form */}
        <Card className="p-8 shadow-elevated border-border/20 bg-background/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="focus-ring"
              />
              {errors.fullName && <p className="text-sm text-destructive font-medium mt-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="test@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="focus-ring"
              />
              {errors.email && <p className="text-sm text-destructive font-medium mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="focus-ring pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive font-medium mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="focus-ring pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive font-medium mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-primary/80 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-destructive font-medium">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary text-white font-medium h-11"
              disabled={isLoading || !formData.agreeToTerms}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
