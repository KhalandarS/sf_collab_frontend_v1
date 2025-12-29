import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { referralAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, Trophy, Gift, Copy, CheckCircle2 } from 'lucide-react'
import { LoadingSpinner } from './ui/loading-spinner'

export function ReferralProgram() {
  const [referrerEmail, setReferrerEmail] = useState('')
  const [referrerName, setReferrerName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [weeksToClaim, setWeeksToClaim] = useState('')
  const { toast } = useToast()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await referralAPI.register(referrerEmail, referrerName || undefined)
      setUserData(response.data)
      toast({
        title: "Registered!",
        description: response.message,
      })
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

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!referrerEmail) {
      toast({
        title: "Register first",
        description: "Please register your email first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await referralAPI.invite(
        referrerEmail,
        contactEmail,
        contactName || undefined
      )
      toast({
        title: "Success!",
        description: response.message,
      })
      setContactEmail('')
      setContactName('')
      // Refresh user data
      const userResponse = await referralAPI.getUserReferrals(referrerEmail)
      setUserData(userResponse)
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

  const handleCheckStatus = async () => {
    if (!referrerEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const data = await referralAPI.getUserReferrals(referrerEmail)
      setUserData(data)
    } catch (error) {
      toast({
        title: "Not found",
        description: error.response?.data?.error || "User not found",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClaimReward = async () => {
    if (!referrerEmail || !weeksToClaim) {
      toast({
        title: "Invalid input",
        description: "Please enter email and weeks to claim",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await referralAPI.claimReward(referrerEmail, parseInt(weeksToClaim))
      toast({
        title: "Reward claimed!",
        description: response.message,
      })
      setWeeksToClaim('')
      // Refresh user data
      const userResponse = await referralAPI.getUserReferrals(referrerEmail)
      setUserData(userResponse)
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

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${encodeURIComponent(referrerEmail)}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary transition-transform duration-300 hover:rotate-12" />
            Register for Referral Program
          </CardTitle>
          <CardDescription className="animate-fade-in animate-stagger-1">
            Earn 2 weeks free subscription for every person you refer!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2 animate-fade-in-up animate-stagger-1">
              <Label htmlFor="referrer-email">Your Email *</Label>
              <Input
                id="referrer-email"
                type="email"
                placeholder="you@example.com"
                value={referrerEmail}
                onChange={(e) => setReferrerEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up animate-stagger-2">
              <Label htmlFor="referrer-name">Your Name (Optional)</Label>
              <Input
                id="referrer-name"
                type="text"
                placeholder="Your name"
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
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
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </form>
          
          <div className="mt-4 pt-4 border-t animate-fade-in-up animate-stagger-3">
            <Button
              variant="outline"
              onClick={handleCheckStatus}
              disabled={loading}
              className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Check My Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {userData && (
        <>
          <Card className="border-primary animate-bounce-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-5 w-5 animate-scale-in" />
                Your Referral Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-fade-in-up animate-stagger-1">
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-scale-in">
                    {userData.total_referrals}
                  </p>
                </div>
                <div className="animate-fade-in-up animate-stagger-2">
                  <p className="text-sm text-muted-foreground">Reward Weeks</p>
                  <p className="text-2xl font-bold flex items-center gap-1 animate-scale-in">
                    <Gift className="h-5 w-5 text-primary animate-pulse-slow" />
                    {userData.reward_weeks}
                  </p>
                </div>
              </div>
              
              <div className="p-3 bg-primary/10 rounded-md animate-fade-in-up animate-stagger-3 border border-primary/20 hover:bg-primary/20 transition-colors duration-300">
                <p className="text-sm font-medium">
                  Unclaimed: {userData.unclaimed_weeks} weeks
                </p>
              </div>

              {userData.is_early_backer && (
                <div className="flex items-center gap-2 animate-fade-in-up animate-stagger-4">
                  <Trophy className="h-4 w-4 text-yellow-500 animate-pulse-slow" />
                  <Badge variant="secondary" className="animate-scale-in">Early Backer</Badge>
                </div>
              )}

              {userData.achievements && userData.achievements.length > 0 && (
                <div className="animate-fade-in-up animate-stagger-5">
                  <p className="text-sm font-medium mb-2">Achievements</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.achievements.map((ach, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="animate-scale-in transition-all duration-300 hover:scale-110"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {ach}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t animate-fade-in-up">
                <Button
                  variant="outline"
                  onClick={copyReferralLink}
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <Copy className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Copy Referral Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up">
            <CardHeader>
              <CardTitle>Invite a Friend</CardTitle>
              <CardDescription>
                Enter your friend's email to refer them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2 animate-fade-in-up animate-stagger-1">
                  <Label htmlFor="contact-email">Friend's Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="friend@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                  />
                </div>
                <div className="space-y-2 animate-fade-in-up animate-stagger-2">
                  <Label htmlFor="contact-name">Friend's Name (Optional)</Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Friend's name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
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
                      Sending...
                    </span>
                  ) : (
                    'Send Invite'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {userData.unclaimed_weeks > 0 && (
            <Card className="hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle>Claim Rewards</CardTitle>
                <CardDescription>
                  Claim your free subscription weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2 animate-fade-in-up animate-stagger-1">
                    <Label htmlFor="weeks">Weeks to Claim</Label>
                    <Input
                      id="weeks"
                      type="number"
                      min="1"
                      max={userData.unclaimed_weeks}
                      placeholder={`Max: ${userData.unclaimed_weeks}`}
                      value={weeksToClaim}
                      onChange={(e) => setWeeksToClaim(e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                    />
                  </div>
                  <Button
                    onClick={handleClaimReward}
                    disabled={loading || !weeksToClaim}
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        Claiming...
                      </span>
                    ) : (
                      'Claim Rewards'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {userData.invited_users && userData.invited_users.length > 0 && (
            <Card className="hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userData.invited_users.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg transition-all duration-300 hover:bg-muted/50 hover:scale-[1.02] hover:shadow-md animate-slide-in-right"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div>
                        <p className="font-medium">{user.name || user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline" className="animate-scale-in">{user.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card className="hover-lift animate-fade-in-up">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 transition-all duration-300 hover:scale-[1.02] animate-slide-in-right">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold transition-transform duration-300 hover:rotate-12 animate-scale-in">
                1
              </div>
              <div>
                <p className="font-semibold">Register</p>
                <p className="text-sm text-muted-foreground">Sign up with your email</p>
              </div>
            </div>
            <div className="flex items-start gap-3 transition-all duration-300 hover:scale-[1.02] animate-slide-in-right animate-stagger-1">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold transition-transform duration-300 hover:rotate-12 animate-scale-in">
                2
              </div>
              <div>
                <p className="font-semibold">Invite Friends</p>
                <p className="text-sm text-muted-foreground">Share your referral link</p>
              </div>
            </div>
            <div className="flex items-start gap-3 transition-all duration-300 hover:scale-[1.02] animate-slide-in-right animate-stagger-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold transition-transform duration-300 hover:rotate-12 animate-scale-in">
                3
              </div>
              <div>
                <p className="font-semibold">Earn Rewards</p>
                <p className="text-sm text-muted-foreground">Get 2 weeks free per referral</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

