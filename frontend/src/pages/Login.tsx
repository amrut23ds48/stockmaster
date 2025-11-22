import React from "react";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Package, Eye, EyeOff, Loader2, UserCog, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: ''
    };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error('Please select your role to continue.');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock authentication - accept demo@stockmaster.com / demo123
      if (formData.email === 'demo@stockmaster.com' && formData.password === 'demo123') {
        const userName = selectedRole === 'manager' ? 'John Manager' : 'Sarah Staff';
        toast.success(`Login successful! Welcome ${userName}.`);
        login(formData.email, userName, selectedRole);
        navigate('/');
      } else {
        toast.error('Invalid email or password. Try demo@stockmaster.com / demo123');
        setErrors({
          ...errors,
          password: 'Incorrect email or password.'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FC] to-[#E8EEF5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
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
            <h1 className="mb-2">Welcome Back</h1>
            <p className="text-[#6E7A83] italic">
              Manage, move & maintain inventory effortlessly.
            </p>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-[#E8F4F8] border border-[#1A4971]/20 rounded-lg p-4 mb-6">
            <p className="text-[#1A4971] mb-2">Demo Credentials:</p>
            <p className="text-[#6E7A83]">
              <strong>Email:</strong> demo@stockmaster.com<br />
              <strong>Password:</strong> demo123<br />
              <strong>Role:</strong> Select below (Manager or Staff)
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block mb-3 text-[#1A4971]">
                Select Your Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
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
                  <span className="text-[#1A4971]">Manager</span>
                  <span className="text-xs text-[#6E7A83] text-center">Full access & control</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('staff')}
                  className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                    selectedRole === 'staff'
                      ? 'border-[#1A4971] bg-[#E8F4F8]'
                      : 'border-[#D9DFE6] hover:border-[#1A4971]/50'
                  }`}
                >
                  <Users className="w-8 h-8 text-[#1A4971]" strokeWidth={1.5} />
                  <span className="text-[#1A4971]">Staff</span>
                  <span className="text-xs text-[#6E7A83] text-center">Operational access</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
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
                  <span className="text-xs">⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
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
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-[#D64545] mt-1.5 flex items-center gap-1">
                  <span className="text-xs">⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button 
                type="button"
                className="text-[#1A4971] hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1A4971] hover:bg-[#224F7F] text-white rounded-lg h-12 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-[#6E7A83]">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#1A4971] hover:underline transition-all"
              >
                Create an Account
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