import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ResetPasswordForm, FormErrors } from '@/types/authTypes';
import { useAuth } from '@/context/AuthContext';
import { validateForgotPasswordForm } from '@/validation/authValidation';
import { useToast } from '@/components/ui/use-toast';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { forgotPassword, isLoading } = useAuth();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<ResetPasswordForm>({ email: '' });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // const newErrors = validateForgotPasswordForm(formData.email); // ✅ use validation function
        const newErrors = validateForgotPasswordForm(formData); // ✅ use validation function
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await forgotPassword(formData.email);
            setIsSubmitted(true);
            toast({
                title: "Reset link sent!",
                description: "Check your inbox for password reset instructions.",
            });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to send reset link";

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleInputChange = (value: string) => {
        setFormData(prev => ({ ...prev, email: value }));
        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
    };


    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 gradient-primary rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-accent rounded-full opacity-10 blur-3xl"></div>
                </div>

                <div className="w-full max-w-md">
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
                    </div>

                    <Card className="p-8 text-center shadow-elevated border-border/20 bg-background/95 backdrop-blur-sm">
                        <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-white"
                            >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Check Your Email
                        </h1>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            We've sent password reset instructions to{' '}
                            <span className="font-medium text-foreground">{formData.email}</span>
                        </p>

                        <div className="space-y-4">
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full gradient-primary text-white font-medium"
                            >
                                Back to Login
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitted(false)}
                                className="w-full"
                            >
                                Try Different Email
                            </Button>
                        </div>
                    </Card>

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

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 gradient-primary rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-accent rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md">
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
                        Reset Your Password
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your email and we'll send you reset instructions
                    </p>
                </div>

                <Card className="p-8 shadow-elevated border-border/20 bg-background/95 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="test@gmail.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className="focus-ring"
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive font-medium mt-1">{errors.email}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-white font-medium h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </Card>

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
