import { LoginForm, FormErrors, SignupForm, ForgotPasswordForm } from "@/types/authTypes";

// ✅ Login form validation
export const validateLoginForm = (formData: LoginForm): FormErrors => {
  const errors: FormErrors = {};

  // Email validation
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Remember me validation
  if (!formData.remember) {
    errors.remember = "You must check Remember Me before login";
  }

  return errors;
};

// ✅ Signup form validation
export const validateSignupForm = (formData: SignupForm): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    errors.password = 'Password must contain uppercase, lowercase, and number';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the Terms & Privacy Policy';
  }

  return errors;
};


export const validateResetPasswordForm = (password: string, confirmPassword: string) => {
  const errors: { password?: string; confirmPassword?: string } = {};

  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

  if (!confirmPassword) errors.confirmPassword = 'Confirm your password';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

  return errors;
};

export const validateForgotPasswordForm = (formData: ForgotPasswordForm): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
};
