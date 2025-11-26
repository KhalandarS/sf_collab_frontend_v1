"use client"

import { useState } from "react"
import { Eye, EyeOff, GoalIcon } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

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
      const result = await login(formData)
      
      if (result.success) {
        // Navigate to intended destination or dashboard
        navigate(from, { replace: true })
      } else {
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

    const handleGoogleSignIn = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrors(prev => ({
          ...prev,
          submit: result.error || "Google sign in failed"
        }));
      }
      // If successful, the user will be redirected to Google
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrors(prev => ({
        ...prev,
        submit: "Google sign in failed"
      }));
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1749248120469-c41bf8471a48?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
          alt="Modern office lobby with orange chairs"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-white">Log in Account</h1>
            <p className="text-gray-400 text-sm">Enter your Email and password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-transparent border border-gray-700 text-white flex items-center justify-center py-2 rounded hover:bg-gray-800 transition-colors"
            >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
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
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 font-medium py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>

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
