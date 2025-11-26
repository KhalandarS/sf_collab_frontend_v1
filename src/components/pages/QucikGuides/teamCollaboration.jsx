import { FaArrowLeft } from "react-icons/fa";
import { Users, MessageSquare, GitBranch, Clock, Shield, FileText } from "lucide-react";

const TeamCollaboration = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Back Button */}
            <a href="/help">
                <button className="mb-7 border border-gray-600 w-[3rem] h-[2rem] justify-center items-center rounded flex hover:bg-white hover:text-black transition-colors">
                    <FaArrowLeft/>
                </button> 
            </a>

            {/* Header Section */}
            <div className="border-b border-white/10 pb-6 mb-8">
                <h1 className="text-4xl font-bold mb-4">TEAM COLLABORATION!</h1>
                <p className="text-gray-400 text-lg">
                    Great collaboration is the key to successful projects. This guide will show you how to effectively 
                    communicate and work together using SFcollab's collaboration features.
                </p>
            </div>

            {/* Cards Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Real-time Collaboration Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-blue-500" size={24} />
                        <h2 className="text-xl font-semibold">Real-time Collaboration</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        SFcollab offers several tools for seamless teamwork and simultaneous work:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Live editing with multiple team members</li>
                        <li>Real-time cursor presence and updates</li>
                        <li>Simultaneous document collaboration</li>
                        <li>Instant change synchronization</li>
                    </ul>
                </div>

                {/* Communication Tools Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="text-green-500" size={24} />
                        <h2 className="text-xl font-semibold">Communication Tools</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Effective communication features to keep your team aligned:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Comments & @mentions system</li>
                        <li>Threaded discussions</li>
                        <li>Integrated chat and video calls</li>
                        <li>Notification management</li>
                    </ul>
                </div>

                {/* Version Control Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <GitBranch className="text-purple-500" size={24} />
                        <h2 className="text-xl font-semibold">Version Control</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Track changes and maintain project integrity:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Complete version history tracking</li>
                        <li>Easy revert to previous versions</li>
                        <li>Change comparison tools</li>
                        <li>Automatic backup system</li>
                    </ul>
                </div>

                {/* File Management Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-yellow-500" size={24} />
                        <h2 className="text-xl font-semibold">File Management</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Efficient file sharing and organization:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Easy document sharing system</li>
                        <li>File permission controls</li>
                        <li>Cloud storage integration</li>
                        <li>Advanced search and organization</li>
                    </ul>
                </div>

                {/* Project Timeline Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="text-red-500" size={24} />
                        <h2 className="text-xl font-semibold">Project Coordination</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Keep projects on track with time management:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Shared calendars and scheduling</li>
                        <li>Deadline tracking system</li>
                        <li>Time zone synchronization</li>
                        <li>Meeting and milestone planning</li>
                    </ul>
                </div>

                {/* Security & Permissions Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-cyan-500" size={24} />
                        <h2 className="text-xl font-semibold">Security & Permissions</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Control access and maintain security:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Role-based access controls</li>
                        <li>Custom permission levels</li>
                        <li>Secure data encryption</li>
                        <li>Audit logs and activity tracking</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default TeamCollaboration;