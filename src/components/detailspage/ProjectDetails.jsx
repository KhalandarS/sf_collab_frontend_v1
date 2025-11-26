import React, { useState } from 'react'
import { ArrowLeft, Share2, BookmarkPlus, Users, Briefcase, Star, Calendar, Clock, MessageSquare, Send, Image as ImageIcon, Link as LinkIcon, CheckCircle2, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { allimg } from "../../utils"

const ProjectDetails = () => {
  const [isJoined, setIsJoined] = useState(false)
  const [comment, setComment] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)

  const projectDetails = {
    id: 1,
    name: "Lipp Tom",
    username: "lipp",
    avatar: allimg.profileImg,
    bio: "Engineer, founder, ceo & Developer that can be found inhabiting coffee houses",
    joined: "March 6, 2024",
    role: "Employee",
    follower: '10',
    project: '4',
    rating: '4',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Leading development team in building scalable web applications.'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartUp Inc',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple web applications.'
      }
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce platform using React and Node.js',
        tech: ['React', 'Node.js', 'MongoDB'],
        status: 'Completed'
      },
      {
        title: 'Task Management App',
        description: 'Developed a task management application with real-time updates',
        tech: ['Vue.js', 'Firebase', 'Tailwind'],
        status: 'In Progress'
      }
    ],
    feedback: [
      {
        id: 1,
        user: {
          name: 'Sarah Wilson',
          avatar: 'https://i.pravatar.cc/150?img=6'
        },
        comment: 'Excellent team player with great technical skills. Would love to work together again!',
        timestamp: '2 hours ago',
        rating: 5
      },
      {
        id: 2,
        user: {
          name: 'Mike Chen',
          avatar: 'https://i.pravatar.cc/150?img=7'
        },
        comment: 'Very professional and delivers high-quality work consistently.',
        timestamp: '5 hours ago',
        rating: 4
      }
    ]
  }

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/project-details?id=${projectDetails.id}`;
      if (navigator.share) {
        await navigator.share({
          title: projectDetails.name,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch (e) {
      console.error('Share failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link to="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Projects</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={handleShare}
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? "bg-blue-500/10 text-blue-400" 
                    : "hover:bg-white/10"
                }`}
                onClick={handleBookmark}
                aria-label="Bookmark"
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content  */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Header */}
            <div className="bg-[#1A1A1A] rounded-2xl sm:rounded-4xl p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-zinc-700">
                    <img src={projectDetails.avatar} alt={projectDetails.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-2">
                      <h1 className="text-xl sm:text-2xl font-bold">{projectDetails.name}</h1>
                      <span className="bg-zinc-700 text-white text-xs px-2 py-1 rounded uppercase">
                        {projectDetails.role}
                      </span>
                    </div>
                    <p className="text-gray-400">@{projectDetails.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsJoined(!isJoined)}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors ${isJoined
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {isJoined ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Joined
                    </span>
                  ) : (
                    'Join Project'
                  )}
                </button>
              </div>
              <p className="text-gray-300 max-sm:text-sm text-base sm:text-lg leading-relaxed mb-6">
                {projectDetails.bio}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {projectDetails.skills.map((skill, index) => (
                  <span key={index} className="bg-[#2A2A2A] text-xs px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 max-sm:justify-between sm:gap-6 text-gray-400 max-sm:text-xs">
                <span className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  {projectDetails.follower} followers
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-5 w-5" />
                  {projectDetails.project} projects
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-5 w-5" />
                  {projectDetails.rating} rating
                </span>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-[#1A1A1A] rounded-2xl sm:rounded-4xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Experience</h2>
              <div className="space-y-6">
                {projectDetails.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4">
                    <h3 className="font-medium text-base max-sm:text-sm sm:text-lg">{exp.title}</h3>
                    <p className="text-gray-400 max-sm:text-sm">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">{exp.duration}</p>
                    <p className="text-gray-300 max-sm:text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-[#1A1A1A] rounded-2xl sm:rounded-4xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectDetails.projects.map((project, index) => (
                  <div key={index} className="bg-[#2A2A2A] rounded-xl p-4">
                    <h3 className="font-medium mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-[#3A3A3A] text-xs px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{project.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className=" rounded-2xl sm:rounded-4xl p-4 sm:p-8 max-sm:px-0">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Feedback</h2>
              <div className="space-y-6">
                {projectDetails.feedback.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 sm:gap-1 mb-2">
                        <h3 className="font-medium">{item.user.name}</h3>
                        <span className="text-xs sm:text-sm text-gray-400">{item.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-2 max-sm:text-sm">{item.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="mt-8">
                <div className="flex gap-4">
                  <img
                    src={projectDetails.avatar}
                    alt={projectDetails.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add your feedback..."
                      className="w-full bg-[#2A2A2A] rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <div className="flex flex-row sm:items-center justify-between gap-4 mt-2">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <ImageIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <LinkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <button className="sm:w-auto bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Send Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info & Stats */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-[#1A1A1A] rounded-4xl p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Quick Info</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-400">Role</span>
                  <span>{projectDetails.role}</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-400">Joined</span>
                  <span>{projectDetails.joined}</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-400">Projects</span>
                  <span>{projectDetails.project}</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-400">Rating</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {projectDetails.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-[#1A1A1A] rounded-4xl p-8">
              <h2 className="text-xl font-semibold mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {projectDetails.skills.map((skill, index) => (
                  <span key={index} className="bg-[#2A2A2A] text-sm px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails