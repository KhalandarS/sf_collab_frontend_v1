import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Book, MessageSquare, Phone, Mail, FileText, Video, Users, Settings, ArrowRight } from 'lucide-react'


const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I create a new project?',
      answer: 'To create a new project, click on the "New Project" button in the dashboard. Fill in the project details including name, description, and team members. You can also set project goals and deadlines during creation.'
    },
    {
      id: 2,
      question: 'How can I invite team members?',
      answer: 'You can invite team members by going to the project settings and clicking on "Invite Members". Enter their email addresses and select their roles. They will receive an invitation email to join the project.'
    },
    {
      id: 3,
      question: 'How do I track project progress?',
      answer: 'Project progress can be tracked through the dashboard metrics, progress bars, and milestone tracking. Each project card shows key metrics and progress indicators. You can also view detailed reports in the analytics section.'
    },
    {
      id: 4,
      question: 'What are the different project stages?',
      answer: 'Projects can be in various stages: Idea Stage, MVP Stage, Growth Stage, Scale Stage, and Research Stage. Each stage has specific goals and metrics to track progress and success.'
    }
  ]

  const guides = [
    {
      id: 1,
      title: 'Getting Started Guide',
      icon: <Book className="h-5 w-5" />,
      description: 'Learn the basics of using our platform',
      link: '/getting-started'
    },
    {
      id: 2,
      title: 'Project Management',
      icon: <FileText className="h-5 w-5" />,
      description: 'Best practices for managing projects',
      link: '/project-management'
    },
    {
      id: 3,
      title: 'Team Collaboration',
      icon: <Users className="h-5 w-5" />,
      description: 'Tips for effective team collaboration',
      link: '/team-collaboration'
    },
    {
      id: 4,
      title: 'Video Tutorials',
      icon: <Video className="h-5 w-5" />,
      description: 'Watch step-by-step video guides',
      link: '/video-tutorials'
    }
  ]

  const supportOptions = [
    {
      id: 1,
      title: 'Live Chat',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Chat with our support team',
      available: true
    },
    {
      id: 2,
      title: 'Phone Support',
      icon: <Phone className="h-5 w-5" />,
      description: 'Call us at +1 (555) 123-4567',
      available: true
    },
    {
      id: 3,
      title: 'Email Support',
      icon: <Mail className="h-5 w-5" />,
      description: 'support@example.com',
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Help Center</h1>
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide) => (
              <a
                key={guide.id}
                href={guide.link}
                className="bg-[#1A1A1A] rounded-2xl p-6 hover:bg-[#232323] transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  {guide.icon}
                  <h3 className="text-lg font-semibold">{guide.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{guide.description}</p>
                <div className="flex items-center text-blue-500 text-sm">
                  Read Guide 
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
                
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#232323] transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 py-4 border-t border-white/10">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Support Options */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Get Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <div
                key={option.id}
                className="bg-[#1A1A1A] rounded-2xl p-6 hover:bg-[#232323] transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  {option.icon}
                  <h3 className="text-lg font-semibold">{option.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{option.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    option.available ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-400">
                    {option.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Help