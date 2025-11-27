import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext"
import Beams from '../ui/Beams';
import ShinyText from '../ui/ShinyText';
import {Button} from '../ui/button';
import useScrollHide from "../../hooks/useScrollHide";
import { loginGoogleUser,loginUser} from "../../services/auth/authThunks";

import NavBar from "../sections/NavBar";
import MobileNavBar from "../sections/MobileNavBar";
import StarBorder from '../ui/StarBorder'

const API_URL = import.meta.env.VITE_API_URL_AUTH || 'http://localhost:5000/api/auth';

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  // const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [loaderState, setLoaderState] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });
  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  // Listen for OAuth popup messages
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      // Security: verify origin
      if (event.origin !== API_URL) return;
      
      const { type, provider, access_token, refreshToken, user, error } = event.data;
      
      if (type === 'oauth_success') {
        console.log(`${provider} OAuth successful`);
        
        // Store token and user data
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        setLoaderState(false);
        
        // Navigate to intended destination or dashboard
        navigate("/dashboard");
      } else if (type === 'oauth_error') {
        console.error(`${provider} OAuth error:`, error);
        setLoaderState(false);
        setErrors(prev => ({
          ...prev,
          submit: `${provider} authentication failed: ${error}`
        }));
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [navigate, from]);

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await loginUser(formData)
      
      if (result.success) {
        alert(JSON.stringify(result));
        navigate('/dashboard')
      } else {
        alert(JSON.stringify(result));
        
        setErrors(prev => ({
          ...prev,
          submit: result.error || "Login failed"
        }))
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors(prev => ({
        ...prev,
        submit: "An unexpected error occurred"
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setLoaderState(true);
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      `${API_URL}/google/login`,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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


        <NavBar isHidden={isNavHidden} />
      <MobileNavBar isHidden={isNavHidden} />
      {/* Left side - Image */}
      <div className="absolute inset-0 z-0 ">
        <div style={{zIndex:50, width: '100%', height: '100%', position: 'relative' }}>
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={7}
            lightColor="#E8E8E8"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div style={{zIndex:100}} className="absolute  inset-0 z-10 flex items-center justify-center p-2 mt-16">
        <div className="w-full max-w-md space-y-6 bg-black/10 backdrop-blur-sm p-10 rounded-md">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-5xl text-center font-semibold text-white">
            <ShinyText 
              text="Log in" 
              disabled={false} 
              speed={3} 
              className='custom-class' 
            />
            </h1>
          </div>

            {/* Google Sign In Button */}
            <Button
              // as="button"
              // color="white"
              // speed="5s"
              className="w-full   bg-white border border-gray-300  text-black flex items-center justify-center py-2 rounded-sm hover:bg-white/70 transition-colors"
              onClick={handleGoogleSignIn}
              // thickness="10px"
            >
      
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </Button>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className=" px-2 text-white bg-black backdrop-blur-lg rounded-md">Or</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Enter your Email and password.</p>
  
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-sm">Email</label>
              <input
                id="email"
                type="email"
                placeholder="eg: johnmike@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={` border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white text-sm">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={` border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600 w-full rounded px-3 py-2 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              <p className="text-xs text-gray-500">Must be at least 8 characters.</p>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            {/* Login Button */}
              <Button
                // as="button"
                className="w-full h-10 border border-gray-300 bg-white   text-black flex items-center justify-center py-4 rounded-sm hover:bg-white/70 transition-colors"
                // color="white"
                // speed="5s"
                type="submit"
                disabled={isLoading}
                // thickness="10px"
              >
             
                {isLoading ? "Logging in..." : "Log in"}
              </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={() => navigate('/signup')}
                className="text-white hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}