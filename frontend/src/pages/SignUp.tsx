import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Package, Eye, EyeOff, Loader2, CheckCircle2, XCircle, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../contexts/AuthContext";

export function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: '#D64545' };
    if (strength <= 3) return { strength, label: 'Medium', color: '#E6A700' };
    return { strength, label: 'Strong', color: '#2ECC71' };
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: ''
    };

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required.';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase and lowercase letters.';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number.';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Account created successfully! Welcome to StockMaster.');
      login(formData.email, formData.fullName, selectedRole);
      navigate('/');
    }, 2000);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FC] to-[#E8EEF5] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-[#1A4971] rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-[#1A4971] m-0">StockMaster</h2>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="mb-2">Create Your Account</h1>
            <p className="text-[#6E7A83] italic">
              Start managing your inventory in minutes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block mb-3 text-[#1A4971]">
                Account Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('staff')}
                  className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                    selectedRole === 'staff'
                      ? 'border-[#1A4971] bg-[#E8F4F8]'
                      : 'border-[#D9DFE6] hover:border-[#1A4971]/50'
                  }`}
                >
                  <Package className="w-8 h-8 text-[#1A4971]" strokeWidth={1.5} />
                  <span className="text-[#1A4971]">Staff Account</span>
                  <span className="text-xs text-[#6E7A83] text-center">Operational access</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('manager')}
                  className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                    selectedRole === 'manager'
                      ? 'border-[#1A4971] bg-[#E8F4F8]'
                      : 'border-[#D9DFE6] hover:border-[#1A4971]/50'
                  }`}
                >
                  <UserCog className="w-8 h-8 text-[#1A4971]" strokeWidth={1.5} />
                  <span className="text-[#1A4971]">Manager Account</span>
                  <span className="text-xs text-[#6E7A83] text-center">Full access</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block mb-2 text-[#1A4971]">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                    errors.fullName 
                      ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20' 
                      : 'border-[#D9DFE6] focus:border-[#1A4971] focus:ring-[#1A4971]/20'
                  }`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-[#1A4971]">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20' 
                      : 'border-[#D9DFE6] focus:border-[#1A4971] focus:ring-[#1A4971]/20'
                  }`}
                  placeholder="your.email@company.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company" className="block mb-2 text-[#1A4971]">
                Company Name *
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.company 
                    ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20' 
                    : 'border-[#D9DFE6] focus:border-[#1A4971] focus:ring-[#1A4971]/20'
                }`}
                placeholder="Your Company Ltd."
                disabled={isLoading}
              />
              {errors.company && (
                <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.company}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-2 text-[#1A4971]">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                      errors.password 
                        ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20' 
                        : 'border-[#D9DFE6] focus:border-[#1A4971] focus:ring-[#1A4971]/20'
                    }`}
                    placeholder="Create strong password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7A83] hover:text-[#1A4971] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {passwordStrength && formData.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-[#D9DFE6] rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300 rounded-full"
                          style={{ 
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-[#1A4971]">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                      errors.confirmPassword 
                        ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20' 
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-[#2ECC71] focus:border-[#2ECC71] focus:ring-[#2ECC71]/20'
                        : 'border-[#D9DFE6] focus:border-[#1A4971] focus:ring-[#1A4971]/20'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7A83] hover:text-[#1A4971] transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                  <p className="text-[#2ECC71] mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#1A4971] border-[#D9DFE6] rounded focus:ring-2 focus:ring-[#1A4971]/20"
                  disabled={isLoading}
                />
                <span className="text-[#6E7A83]">
                  I agree to the{' '}
                  <button type="button" className="text-[#1A4971] hover:underline">
                    Terms and Conditions
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-[#1A4971] hover:underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg h-12 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-[#6E7A83]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#1A4971] hover:underline transition-all"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[#6E7A83] mt-6">
          Secure inventory management for steel & hardware industry
        </p>
      </div>
    </div>
  );
}