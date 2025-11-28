import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, MapPin, Building, Globe, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL_AUTH || 'http://localhost:5000/api/auth';

export default function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loaderState, setLoaderState] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profile_company: "",
    profile_country: "",
    profile_city: "",
    profile_timezone: "UTC",
    pref_language: "en",
    pref_timezone: "UTC",
    pref_theme: "light",
    agreeToTerms: false
  })

  // Listen for OAuth popup messages
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      const allowedOrigins = [
        new URL(API_URL).origin,
        "http://localhost:5000",
        "null",
      ];
  
      if (!allowedOrigins.includes(event.origin)) {
        console.warn("Blocked message from:", event.origin);
        return;
      }
  
      const { type, provider, access_token, refreshToken, user, error } = event.data;
  
      if (type === "oauth_success") {
        console.log("OAuth SUCCESS");
  
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
  
        setLoaderState(false);
  
        navigate("/dashboard");
      }
  
      if (type === "oauth_error") {
        console.error("OAuth ERROR:", error);
        setLoaderState(false);
        setErrors(prev => ({
          ...prev,
          submit: `${provider} authentication failed: ${error}`,
        }));
      }
    };
  
    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [navigate]);
  

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  // OAuth handlers with popup
  const handleGoogleSignUp = () => {
    setLoaderState(true);
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      `${API_URL}/google/login`,
      'Google Sign Up',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          profile_company: formData.profile_company,
          profile_country: formData.profile_country,
          profile_city: formData.profile_city,
          profile_timezone: formData.profile_timezone,
          pref_language: formData.pref_language,
          pref_timezone: formData.pref_timezone,
          pref_theme: formData.pref_theme,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store tokens and user data
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        navigate('/dashboard');
      } else {
        setErrors(prev => ({
          ...prev,
          submit: result.error || 'Signup failed'
        }));
      }
    } catch (error) {
      console.error('Signup unexpected error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error?.message || 'An unexpected error occurred'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'India', 'Japan', 'Brazil', 'Mexico', 'South Africa', 'Other'
  ];

  const timezones = [
    'UTC', 'EST', 'PST', 'CST', 'GMT', 'CET', 'IST', 'JST', 'AEST'
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' }
  ];

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Loader Overlay */}
      {loaderState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="loader-container flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4 text-lg font-medium">Connecting to Google...</p>
            <p className="text-gray-300 mt-2 text-sm">Please complete the authentication</p>
          </div>
        </div>
      )}

      {/* Left side - RECOLLAB Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1749315098378-4671599e1d81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
          className="w-full h-full object-cover"
          alt="Recollab Background" 
        />
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-white">Sign Up Account</h1>
            <p className="text-gray-400 text-sm">Enter your personal data to create your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Sign Up Button */}
            <button 
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full bg-transparent border border-gray-700 text-white flex items-center justify-center py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">Or</span>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-white text-sm">First Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="eg: John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10`}
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-white text-sm">Last Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="eg: Francisco"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-700'} text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10`}
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-sm">Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="eg: johnfrancisco@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Company Field */}
            <div className="space-y-2">
              <label htmlFor="profile_company" className="text-white text-sm">Company</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building size={16} className="text-gray-500" />
                </div>
                <input
                  id="profile_company"
                  type="text"
                  placeholder="eg: Tech Corp Inc"
                  value={formData.profile_company}
                  onChange={(e) => handleInputChange("profile_company", e.target.value)}
                  className="border border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10"
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="profile_country" className="text-white text-sm">Country</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <select
                    id="profile_country"
                    value={formData.profile_country}
                    onChange={(e) => handleInputChange("profile_country", e.target.value)}
                    className="border border-gray-700 text-white bg-black focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10 appearance-none"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="profile_city" className="text-white text-sm">City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <input
                    id="profile_city"
                    type="text"
                    placeholder="eg: New York"
                    value={formData.profile_city}
                    onChange={(e) => handleInputChange("profile_city", e.target.value)}
                    className="border border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="pref_language" className="text-white text-sm">Language</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <select
                    id="pref_language"
                    value={formData.pref_language}
                    onChange={(e) => handleInputChange("pref_language", e.target.value)}
                    className="border border-gray-700 text-white bg-black focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10 appearance-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="pref_timezone" className="text-white text-sm">Timezone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={16} className="text-gray-500" />
                  </div>
                  <select
                    id="pref_timezone"
                    value={formData.pref_timezone}
                    onChange={(e) => handleInputChange("pref_timezone", e.target.value)}
                    className="border border-gray-700 text-white bg-black focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10 appearance-none"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Theme Preference */}
            <div className="space-y-2">
              <label htmlFor="pref_theme" className="text-white text-sm">Theme Preference</label>
              <select
                id="pref_theme"
                value={formData.pref_theme}
                onChange={(e) => handleInputChange("pref_theme", e.target.value)}
                className="border border-gray-700 text-white bg-black focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2"
              >
                {themes.map(theme => (
                  <option key={theme.value} value={theme.value}>{theme.label}</option>
                ))}
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white text-sm">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              <p className="text-xs text-gray-500">Must be at least 8 characters.</p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="mt-1 rounded border-gray-700 bg-black text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            {/* Sign Up Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 font-medium py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={() => navigate("/login")}
                className="text-white hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}