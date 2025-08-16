import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { useShopperContext } from '../contexts/ShopperContext';

const CustomerAuth = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer } = useShopperContext();
  
  const [step, setStep] = useState('register'); // 'register', 'verify', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For demo purposes, use a mock OTP flow
    if (formData.mobile && formData.name) {
      // In a real app, you would call your API here
      // const response = await api.post('/users/register', {
      //   name: formData.name,
      //   mobile: formData.mobile,
      //   email: formData.email
      // });
      
      // Mock successful response
      setTimeout(() => {
        setStep('verify');
        startCountdown();
        setLoading(false);
      }, 1000);
      
      return;
    }
    
    // This is the original implementation that would be used with a real API
    try {
      const response = await api.post('/users/register', {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email
      });

      if (response.data.success) {
        if (response.data.verified) {
          // User already verified, log them in directly
          loginCustomer({
            id: response.data.user_id,
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            verified: true
          });
          setStep('success');
          setTimeout(() => {
            const redirectTo = location.state?.redirectTo || `/offers/${storeId || '1'}`;
            navigate(redirectTo);
          }, 1500);
        } else {
          // User needs OTP verification
          setStep('verify');
          startCountdown();
        }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // For demo purposes, accept any OTP that is '1234'
    if (otp === '1234') {
      // Mock successful verification
      const mockUser = {
        id: 'demo-user-123',
        name: formData.name || 'Demo User',
        mobile: formData.mobile || '1234567890',
        email: formData.email || 'demo@example.com',
        verified: true
      };
      
      loginCustomer(mockUser);
      setStep('success');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        const redirectTo = location.state?.redirectTo || `/offers/${storeId || '1'}`;
        navigate(redirectTo);
      }, 1500);
      
      setLoading(false);
      return;
    } else if (otp) {
      // If OTP is provided but not '1234', show error
      setError('Invalid OTP. Please try again.');
      setLoading(false);
      return;
    }
    
    // This is the original implementation that would be used with a real API
    try {
      const response = await api.post('/users/verify-otp', {
        mobile: formData.mobile,
        otp: otp
      });

      if (response.data.success) {
        // Login the verified user
        loginCustomer({
          id: response.data.user.id,
          name: response.data.user.name,
          mobile: response.data.user.mobile,
          email: response.data.user.email,
          verified: true
        });
        
        setStep('success');
        // Redirect after 1.5 seconds
        setTimeout(() => {
          const redirectTo = location.state?.redirectTo || `/offers/${storeId || '1'}`;
          navigate(redirectTo);
        }, 1500);
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      // For demo purposes, just restart countdown
      startCountdown();
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="mb-6">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Aboard! 🎉</h1>
            <p className="text-lg text-gray-600">Your account has been verified successfully</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 mb-6">
            <p className="text-gray-700">Redirecting you to amazing offers...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => step === 'verify' ? setStep('register') : navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {step === 'verify' ? 'Back to Registration' : 'Back'}
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
            <div className="mb-4">
              {step === 'register' ? (
                <UserIcon className="h-12 w-12 text-white mx-auto" />
              ) : (
                <ShieldCheckIcon className="h-12 w-12 text-white mx-auto" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === 'register' ? 'Join ShopEase' : 'Verify Your Account'}
            </h1>
            <p className="text-indigo-100">
              {step === 'register' 
                ? 'Create your account to unlock exclusive offers' 
                : 'Enter the verification code we sent to your phone'}
            </p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {step === 'register' ? (
              <form onSubmit={submitRegister} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                      name="name" 
                      placeholder="Full Name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                      name="email" 
                      placeholder="Email Address" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                      name="mobile" 
                      placeholder="Mobile Number" 
                      value={formData.mobile} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Create Account
                    </div>
                  )}
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={submitVerify} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <PhoneIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-600">
                    We sent a 4-digit verification code to
                  </p>
                  <p className="font-semibold text-gray-900">{formData.mobile}</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm text-center mb-4">
                  <p className="font-medium">Demo Mode</p>
                  <p>Use <strong>1234</strong> as the OTP for verification</p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <input 
                    className="w-full text-center text-2xl font-bold py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all tracking-widest" 
                    maxLength={4} 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="1234" 
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 4} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Verify Account
                    </div>
                  )}
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={countdown > 0 || loading}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="mt-8 bg-white/80 backdrop-blur rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Why Join ShopEase?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-gray-700">Exclusive Offers</div>
            </div>
            <div>
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium text-gray-700">Instant Access</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm font-medium text-gray-700">Secure & Private</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth; 