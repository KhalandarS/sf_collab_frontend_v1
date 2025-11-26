import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ClipboardList, Users, Workflow, Target, Clock } from "lucide-react";

export default function ProjectManagement() {
  const practices = [
    {
      id: 1,
      title: "Define Clear Roles",
      description:
        "On SFCOLAB, every contributor has a role. Make sure responsibilities are visible and transparent to avoid confusion.",
      icon: <Users className="text-blue-500" size={24} />,
      keyPoints: ["Project Lead", "Developers", "Designers", "Marketers"],
    },
    {
      id: 2,
      title: "Break Work into Tasks",
      description:
        "Use task-based collaboration so projects can be tracked and delivered step by step.",
      icon: <ClipboardList className="text-green-500" size={24} />,
      keyPoints: ["Task assignments", "Progress tracking", "Task deadlines"],
    },
    {
      id: 3,
      title: "Set Timelines",
      description:
        "Projects move faster when milestones and deadlines are visible to all collaborators.",
      icon: <Clock className="text-yellow-500" size={24} />,
      keyPoints: ["Weekly updates", "Milestone reviews", "Completion targets"],
    },
    {
      id: 4,
      title: "Collaborative Workflow",
      description:
        "Leverage SFCOLAB’s discussion threads, comments, and updates to keep everyone aligned.",
      icon: <Workflow className="text-purple-500" size={24} />,
      keyPoints: ["Idea discussions", "Status updates", "Feedback loops"],
    },
    {
      id: 5,
      title: "Track Goals & Impact",
      description:
        "Define measurable goals and track outcomes so contributors see the impact of their work.",
      icon: <Target className="text-red-500" size={24} />,
      keyPoints: ["SMART goals", "Impact metrics", "Final deliverables"],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Back Button */}
      <a href="/help">
          <button className="mb-7 border border-gray-600 w-[3rem] h-[2rem] justify-center items-center rounded flex hover:bg-white hover:text-black transition-colors">
              <FaArrowLeft/>
          </button> 
      </a>
      {/* Header */}
      <div className="border-b border-white/10 pb-4 mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <p className="text-gray-400 mt-2">
          Best practices for managing projects and collaborations on SFCOLAB.
        </p>
      </div>

      {/* Practices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {practices.map((practice) => (
          <div
            key={practice.id}
            className="bg-[#1A1A1A] rounded-3xl p-6 hover:bg-[#232323] transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              {practice.icon}
              <h2 className="text-xl font-semibold">{practice.title}</h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">{practice.description}</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
              {practice.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
