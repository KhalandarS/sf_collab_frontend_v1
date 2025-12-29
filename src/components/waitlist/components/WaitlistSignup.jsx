
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { waitlistAPI } from './lib/api'
import { useToast } from './hooks/use-toast'
import { CheckCircle2, Users, Gift } from 'lucide-react'

// Animated shimmer background (inspired by 21st.dev Aurora/Shader)
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-90 animate-gradient-xy">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-purple-700/30 via-cyan-500/10 to-pink-500/20 blur-2xl animate-pulse-slow" />
      </div>
    </div>
  )
}

// Smooth prompt input (inspired by Claude Style Chat Input)
function PromptInput({ value, onChange, placeholder, ...props }) {
  return (
    <div className="relative group">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 bg-background/80 border border-primary/30 rounded-lg shadow-md focus:ring-2 focus:ring-primary/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
        {...props}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 text-lg transition-transform duration-300 group-hover:scale-110">✉️</span>
    </div>
  )
}

export function WaitlistSignup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await waitlistAPI.signup(email, name || undefined)
      setResult(response.data)
      if (response.message.includes('already')) {
        toast({
          title: "Already on waitlist",
          description: response.message,
        })
      } else {
        toast({
          title: "Success!",
          description: "You've been added to the waitlist!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkPosition = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to check your position",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const data = await waitlistAPI.getPosition(email)
      setResult({
        position: data.position,
        reward_months: data.reward_months,
        email: data.email,
      })
    } catch (error) {
      toast({
        title: "Not found",
        description: error.response?.data?.error || "Email not found in waitlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} className="w-full max-w-xl space-y-6 z-10">
        <Card className="hover-lift animate-fade-in-up shadow-2xl bg-background/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary transition-transform duration-300 hover:rotate-12" />
              Join the Waitlist
            </CardTitle>
            <CardDescription className="animate-fade-in animate-stagger-1">
              Get early access before Feb 1st. Earn free months based on your position!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up animate-stagger-1">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <PromptInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <PromptInput
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Joining...
                  </span>
                ) : (
                  'Join Waitlist'
                )}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t animate-fade-in-up animate-stagger-3">
              <Button
                variant="outline"
                onClick={checkPosition}
                disabled={loading}
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Check My Position
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
            <Card className="border-primary animate-bounce-in hover-lift shadow-xl bg-background/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5 animate-scale-in" />
                  Your Waitlist Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="animate-fade-in-up animate-stagger-1">
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-scale-in">
                      #{result.position}
                    </p>
                  </div>
                  <div className="animate-fade-in-up animate-stagger-2">
                    <p className="text-sm text-muted-foreground">Reward</p>
                    <p className="text-2xl font-bold flex items-center gap-1 animate-scale-in">
                      <Gift className="h-5 w-5 text-primary animate-pulse-slow" />
                      {result.reward_months} {result.reward_months === 1 ? 'month' : 'months'}
                    </p>
                  </div>
                </div>
                {result.reward_months > 0 && (
                  <div className="p-3 bg-primary/10 rounded-md animate-fade-in-up animate-stagger-3 border border-primary/20 hover:bg-primary/20 transition-colors duration-300">
                    <p className="text-sm font-medium">
                      🎉 You've earned {result.reward_months} {result.reward_months === 1 ? 'month' : 'months'} of free subscription!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="hover-lift animate-fade-in-up animate-stagger-4">
          <CardHeader>
            <CardTitle>Reward Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg transition-all duration-300 hover:bg-muted/80 hover:scale-[1.02] hover:shadow-md animate-slide-in-right">
                <Gift className="h-5 w-5 mt-0.5 text-primary transition-transform duration-300 hover:rotate-12" />
                <div>
                  <p className="font-semibold">First 1,000 by Jan 10th</p>
                  <p className="text-sm text-muted-foreground">3 months free</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg transition-all duration-300 hover:bg-muted/80 hover:scale-[1.02] hover:shadow-md animate-slide-in-right animate-stagger-1">
                <Gift className="h-5 w-5 mt-0.5 text-primary transition-transform duration-300 hover:rotate-12" />
                <div>
                  <p className="font-semibold">First 10,000 by Feb 2nd</p>
                  <p className="text-sm text-muted-foreground">1 month free</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


  // ...existing code up to the first return statement...
  // Only keep the first return block, remove all duplicate/extra returns and JSX after it.

