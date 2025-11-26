import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PlayCircle } from "lucide-react";

export default function VideoTutorials() {
  const videos = [
    {
      id: 1,
      title: "Getting Started on SFCOLAB",
      description:
        "Learn how to set up your profile, explore projects, and start collaborating.",
      thumbnail: "https://img.youtube.com/vi/1hHMwLxN6EM/0.jpg",
      link: "https://www.youtube.com/watch?v=1hHMwLxN6EM", // placeholder
    },
    {
      id: 2,
      title: "Creating & Managing Projects",
      description:
        "Step-by-step guide to creating a new project, adding tasks, and inviting team members.",
      thumbnail: "https://img.youtube.com/vi/ktlTxC4QG8g/0.jpg",
      link: "https://www.youtube.com/watch?v=ktlTxC4QG8g",
    },
    {
      id: 3,
      title: "Collaborating with Teams",
      description:
        "Learn how to communicate, assign roles, and track progress within your project team.",
      thumbnail: "https://img.youtube.com/vi/XU0llRltyFM/0.jpg",
      link: "https://www.youtube.com/watch?v=XU0llRltyFM",
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
        <h1 className="text-3xl font-bold">Video Tutorials</h1>
        <p className="text-gray-400 mt-2">
          Quick tutorials to help you get the most out of SFCOLAB.
        </p>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1A1A1A] rounded-3xl overflow-hidden hover:bg-[#232323] transition-all duration-200"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
              <p className="text-sm text-gray-400 mb-4">
                {video.description}
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <PlayCircle size={18} />
                <span>Watch Now</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
