import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const CustomerAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.redirectTo || '/';

  const [step, setStep] = useState('register'); // register | verify | success
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/customer/register', form);
      setPhone(data.data.phone);
      setDebugOtp(data.data.otp); // mock
      setStep('verify');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/customer/verify-otp', { phone, otp });
      setStep('success');
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 2000);
    } catch (e) {
      setError(e.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      setError('');
      const { data } = await api.post('/auth/customer/register', form);
      setDebugOtp(data.data.otp);
      setCountdown(60);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to resend OTP');
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
                      value={form.name} 
                      onChange={onChange} 
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
                      value={form.email} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                  
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                      name="phone" 
                      placeholder="Phone Number" 
                      value={form.phone} 
                      onChange={onChange} 
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
                    We sent a 6-digit verification code to
                  </p>
                  <p className="font-semibold text-gray-900">{phone}</p>
                </div>
                
                {debugOtp && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm text-center">
                    <strong>Demo OTP:</strong> {debugOtp}
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <input 
                    className="w-full text-center text-2xl font-bold py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all tracking-widest" 
                    maxLength={6} 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="000000" 
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 6} 
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
                    onClick={resendOTP}
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