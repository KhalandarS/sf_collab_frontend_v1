import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Book, MessageSquare, Phone, Mail, FileText, Video, Users, ArrowRight, HelpCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import StarBorder from '../ui/StarBorder'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I create a new project?',
      answer: 'To create a new project, navigate to the Dashboard and click the "New Project" button. Fill in the required project details including name, description, team members, goals, and deadlines. You can also configure advanced settings during the creation process.'
    },
    {
      id: 'faq-2',
      question: 'How can I invite team members?',
      answer: 'Invite team members by accessing Project Settings and selecting "Invite Members". Enter email addresses and assign appropriate roles (Admin, Editor, or Viewer). Team members will receive an invitation email with secure access links.'
    },
    {
      id: 'faq-3',
      question: 'How do I track project progress?',
      answer: 'Monitor project progress through the comprehensive Dashboard analytics, milestone tracking, and progress indicators. Each project card displays real-time metrics. Detailed reports are available in the Analytics section for in-depth analysis.'
    },
    {
      id: 'faq-4',
      question: 'What are the different project stages?',
      answer: 'Projects progress through five stages: Idea Stage (conceptualization), MVP Stage (minimum viable product), Growth Stage (user acquisition), Scale Stage (expansion), and Research Stage (market analysis). Each stage has specific KPIs and success metrics.'
    }
  ]

  const guides = [
    {
      id: 1,
      title: 'Getting Started Guide',
      icon: <Book className="h-5 w-5 text-blue-600" />,
      description: 'Learn the fundamentals of our platform',
      link: '/getting-started',
      category: 'Basics'
    },
    {
      id: 2,
      title: 'Project Management',
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      description: 'Advanced project management techniques',
      link: '/project-management',
      category: 'Advanced'
    },
    {
      id: 3,
      title: 'Team Collaboration',
      icon: <Users className="h-5 w-5 text-blue-600" />,
      description: 'Optimize team workflow and communication',
      link: '/team-collaboration',
      category: 'Team'
    },
    {
      id: 4,
      title: 'Video Tutorials',
      icon: <Video className="h-5 w-5 text-blue-600" />,
      description: 'Comprehensive step-by-step video guides',
      link: '/video-tutorials',
      category: 'Learning'
    }
  ]

  const supportOptions = [
    {
      id: 1,
      title: 'Live Chat Support',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Instant assistance from our support team',
      details: 'Available 24/7 for premium users, 9AM-6PM EST for all users',
      buttonText: 'Start Chat',
      action: () => console.log('Start chat')
    },
    {
      id: 2,
      title: 'Phone Support',
      icon: <Phone className="h-5 w-5" />,
      description: 'Direct conversation with our experts',
      details: '+1 (555) 123-4567 • Mon-Fri 8AM-8PM EST',
      buttonText: 'Call Now',
      action: () => console.log('Initiate call')
    },
    {
      id: 3,
      title: 'Email Support',
      icon: <Mail className="h-5 w-5" />,
      description: 'Detailed technical assistance',
      details: 'support@example.com • Response within 24 hours',
      buttonText: 'Send Email',
      action: () => console.log('Open email')
    }
  ]

  const handleSubmitContact = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', contactForm)
    // Reset form
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Header Section */}
      <div className=" border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-white">Help Center</h1>
          </div>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            Find answers, guides, and resources to help you get the most out of our platform.
          </p>
          
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search for articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Guides Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Documentation & Guides</h2>
              <p className="text-gray-600 mt-2">Comprehensive resources to help you succeed</p>
            </div>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View All Guides
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide) => (

              <Card key={guide.id} className="hover:shadow-lg border-0 rounded-md hover:bg-white/25 hover:scale-105 m-2 transition-all duration-200 bg-white/20 ">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {guide.icon}
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {guide.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-4 text-white">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    Read Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border border-gray-200 rounded-lg ">
                <AccordionTrigger className="hover:no-underline hover:bg-gray-50 hover:text-black group px-0 py-6">
                  <span className="text-left font-semibold px-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-0">
                  <p className="text-gray-600 px-4">{faq.answer}</p>
                  <Button variant="link" className="px-4 text-blue-600 mt-4">
                    Read more about this topic
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Support Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Contact Support</h2>
          <p className="text-gray-600 mb-8">Get help from our dedicated support team</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {supportOptions.map((option) => (
              <Card key={option.id} className="text-center hover:shadow-lg border-0 rounded-md hover:bg-white/25 hover:scale-105 m-2 transition-all duration-200 bg-white/20 ">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    {option.icon}
                  </div>
                  <CardTitle className={'text-white'}>{option.title}</CardTitle>
                  <CardDescription className={'text-white/70'}>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 mb-4">{option.details}</p>
                  <Button onClick={option.action} className="w-full bg-blue-600 hover:bg-blue-700">
                    {option.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <Card className=" hover:shadow-lg border-0 rounded-md hover:bg-white/25  m-2 transition-all duration-200 bg-white/20 ">
            <CardHeader>
              <CardTitle className="text-xl text-white">Send us a message</CardTitle>
              <CardDescription className='text-gray-400'>
                Can't find what you're looking for? Send us a detailed message and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContact} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">How can we help you? *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail..."
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Alert Banner */}
        <Alert className="rounded-md bg-white/20 hover:bg-white/25  border-blue-200">
          <AlertDescription className="text-white">
            <strong>Need urgent assistance?</strong> Our priority support team is available 24/7 for enterprise customers. 
            <Button variant="link" className="text-gray-300 hover:text-blue-500 p-0 ml-2 h-auto">
              Learn about enterprise support
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default Help
