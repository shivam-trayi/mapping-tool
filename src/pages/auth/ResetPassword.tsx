import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { validateResetPasswordForm } from '@/validation/authValidation';
import { useToast } from '@/components/ui/use-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  // Get token and optional redirect URL from query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateResetPasswordForm(password, confirmPassword);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await resetPassword(token, password);
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
      navigate(redirect); // Redirect after successful reset
    } catch (err: unknown) {
      // Narrow type to Error
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };



  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        <Card className="p-8 shadow-elevated border-border/20 bg-background/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>
              {errors.password && <p className="text-sm text-destructive font-medium mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive font-medium mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white font-medium h-11"
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              ← Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
