import { FaArrowLeft } from "react-icons/fa";
import { User, Settings, Lock, Calendar } from "lucide-react";

const GettingStarted = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Back Button */}
            <a href="/help">
                <button className="mb-7 border border-gray-600 w-12 h-8 justify-center items-center rounded flex hover:bg-white hover:text-black transition-colors">
                    <FaArrowLeft/>
                </button> 
            </a>

            {/* Header Section */}
            <div className="border-b border-white/10 pb-6 mb-8">
                <h1 className="text-4xl font-bold mb-4">GETTING STARTED!</h1>
                <p className="text-gray-400 text-lg">
                    Welcome to SFcollab! This guide will help you set up your account and start collaborating with your team in no time.
                </p>
            </div>

            {/* Cards Grid - 3 columns with proper spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Creating Your Account Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="text-blue-500" size={24} />
                        <h2 className="text-xl font-semibold">Creating Your Account</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        To get started with SFcollab, you need to create an account. Follow these simple steps:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Visit our signup page and enter your email address</li>
                        <li>Check your email for a verification link</li>
                        <li>Create a secure password</li>
                        <li>Complete your profile with your name and photo</li>
                    </ul>
                </div>

                {/* Setting Up Your First Project Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="text-green-500" size={24} />
                        <h2 className="text-xl font-semibold">Setting Up Your First Project</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Once your account is created, it's time to set up your first project:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Click on the "Create New Project" button</li>
                        <li>Give your project a descriptive name</li>
                        <li>Add a project description for team members</li>
                        <li>Set the project visibility (private or team-wide)</li>
                    </ul>
                </div>

                {/* Security & Privacy Card */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="text-red-500" size={24} />
                        <h2 className="text-xl font-semibold">Security & Privacy</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Your security is our priority. Here's how we protect your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>End-to-end encryption for all communications</li>
                        <li>Two-factor authentication support</li>
                        <li>Regular security audits and updates</li>
                        <li>GDPR compliant data handling</li>
                    </ul>
                </div>

                {/* Project Timeline Card - Normal size in grid */}
                <div className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200 h-80">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-yellow-500" size={24} />
                        <h2 className="text-xl font-semibold">Project Timeline</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Manage your project schedule effectively:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                        <li>Set milestones and deadlines</li>
                        <li>Track progress with visual timelines</li>
                        <li>Receive notifications for upcoming tasks</li>
                        <li>Adjust schedules with drag-and-drop interface</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default GettingStarted;