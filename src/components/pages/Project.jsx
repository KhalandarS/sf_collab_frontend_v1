import {
  Star,
  Users,
  Briefcase,
  Filter,
  Plus,
  BriefcaseBusiness,
  List,
  ArrowUpRight,
  Calendar,
  Award,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { allimg } from "../../utils";
import FindContributionHeader from "../headers/FindContributionHeader";
import React, { useState, useMemo } from "react";
import ScrollToTop from "../sections/ScrollToTop";

export default function Project() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("All User Types");
  const [selectedAvailability, setSelectedAvailability] =
    useState("All Availability");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");

  const employees = [
    {
      id: 1,
      name: "Lipp Tom",
      username: "lipp",
      avatar: allimg.profileImg,
      bio: "Engineer, founder, ceo & Developer that can be found inhabiting coffee houses",
      joined: "March 6, 2024",
      role: "Employee",
      userType: "Developer",
      position: "Full Stack Developer",
      availability: "Available Now",
      follower: "10",
      project: "4",
      rating: "4.8",
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "GraphQL"],
      experience: [
        {
          title: "Senior Developer",
          company: "Tech Corp",
          duration: "2020 - Present",
          description: "Leading development of enterprise applications",
        },
      ],
      metrics: {
        contributions: "1.2k",
        commits: "856",
        reviews: "234",
      },
    },
    {
      id: 2,
      name: "Mask ho",
      username: "mask", 
      avatar: allimg.profileImg,
      bio: "Engineer, founder, ceo & Developer that can be found inhabiting coffee houses",
      joined: "March 6, 2024",
      role: "Employee",
      userType: "Developer",
      position: "Backend Developer",
      availability: "Available in 1 Week",
      follower: "10",
      project: "4",
      rating: "4.5",
      skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
      experience: [
        {
          title: "Backend Developer",
          company: "Data Systems",
          duration: "2019 - Present",
          description: "Building scalable backend services",
        },
      ],
      metrics: {
        contributions: "980",
        commits: "654",
        reviews: "189",
      },
    },
    {
      id: 3,
      name: "Nom Na",
      username: "nomna",
      avatar: allimg.profileImg, 
      bio: "Engineer, founder, ceo & Developer that can be found inhabiting coffee houses",
      joined: "March 6, 2024",
      role: "Employee",
      userType: "Designer",
      position: "UI/UX Designer",
      availability: "Full-time",
      follower: "10",
      project: "4",
      rating: "4.9",
      skills: [
        "Vue.js",
        "Firebase",
        "Tailwind",
        "GraphQL",
        "TypeScript",
        "Jest",
      ],
      experience: [
        {
          title: "Frontend Developer",
          company: "Web Solutions",
          duration: "2021 - Present",
          description: "Creating modern web applications",
        },
      ],
      metrics: {
        contributions: "1.5k",
        commits: "1.2k",
        reviews: "345",
      },
    },
    {
      id: 4,
      name: "Lipp",
      username: "lipp",
      avatar: allimg.profileImg,
      bio: "Engineer, founder, ceo & Developer that can be found inhabiting coffee houses", 
      joined: "March 6, 2024",
      role: "Employee",
      userType: "Product Manager",
      position: "Product Manager",
      availability: "Part-time",
      follower: "10",
      project: "4",
      rating: "4.7",
      skills: ["Java", "Spring Boot", "MySQL", "Kubernetes", "Docker", "AWS"],
      experience: [
        {
          title: "Full Stack Developer",
          company: "Enterprise Solutions",
          duration: "2018 - Present",
          description: "Full stack development and architecture",
        },
      ],
      metrics: {
        contributions: "1.1k",
        commits: "789",
        reviews: "267",
      },
    },
  ];

  // Filter employees based on search query and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        employee.name.toLowerCase().includes(searchLower) ||
        employee.username.toLowerCase().includes(searchLower) ||
        employee.bio.toLowerCase().includes(searchLower) ||
        employee.role.toLowerCase().includes(searchLower) ||
        employee.userType.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower) ||
        employee.availability.toLowerCase().includes(searchLower) ||
        employee.follower.toLowerCase().includes(searchLower) ||
        employee.project.toLowerCase().includes(searchLower) ||
        employee.rating.toLowerCase().includes(searchLower) ||
        employee.joined.toLowerCase().includes(searchLower) ||
        employee.skills.some((skill) =>
          skill.toLowerCase().includes(searchLower)
        ) ||
        employee.experience.some(
          (exp) =>
            exp.title.toLowerCase().includes(searchLower) ||
            exp.company.toLowerCase().includes(searchLower) ||
            exp.description.toLowerCase().includes(searchLower)
        ) ||
        Object.values(employee.metrics).some((value) =>
          value.toLowerCase().includes(searchLower)
        );

      // User Type filter
      const matchesUserType =
        selectedUserType === "All User Types" ||
        employee.userType === selectedUserType;

      // Availability filter
      const matchesAvailability =
        selectedAvailability === "All Availability" ||
        employee.availability === selectedAvailability;

      // Position filter
      const matchesPosition =
        selectedPosition === "All Positions" ||
        employee.position === selectedPosition;

      return (
        matchesSearch &&
        matchesUserType &&
        matchesAvailability &&
        matchesPosition
      );
    });
  }, [searchQuery, selectedUserType, selectedAvailability, selectedPosition]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mb-0">
        <FindContributionHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedUserType={selectedUserType}
          setSelectedUserType={setSelectedUserType}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      </div>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <Link 
              key={employee.id}
              to={`/project-details?id=${employee.id}`}
              className="bg-zinc-900 p-3 min-h-[330px] rounded-xl flex flex-col h-full hover:bg-zinc-800 transition-colors"
            >
              <div className="bg-[#1A1A1A] min-h-[270px] rounded-4xl p-5 max-sm:p-4">
                <div className="flex items-center justify-end mb-4">
                  <Link
                    to={`/profile?username=${employee.username}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 "
                  >
                    View Profile
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
                <div className="flex flex-row-reverse justify-between  gap-4 items-start mb-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-white text-lg font-bold">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{employee.name}</h3>
                      <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase">
                        {employee.role}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      @{employee.username}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {employee.position}
                    </p>
                  </div>
                  {/* <Link
                    to={`/profile?username=${employee.username}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    View Profile
                    <ArrowUpRight size={12} />
                  </Link> */}
                </div>

                {/* <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{employee.name}</h3>
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase">
                      {employee.role}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">@{employee.username}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {employee.position}
                  </p>
                </div> */}

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                  {employee.bio}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Object.entries(employee.metrics).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="bg-zinc-800 rounded-lg p-2 text-center"
                      >
                      <p className="text-xs text-gray-400 mb-1">{key}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                    )
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {employee.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {employee.skills.length > 3 && (
                    <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full">
                      +{employee.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-auto">
                  <div className="flex gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-gray-400">
                        {employee.follower} followers
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-400">
                        {employee.project} projects
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-400">
                        {employee.rating} rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Preview */}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Code2 className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-400">
                      {employee.experience[0].title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{employee.experience[0].duration}</span>
                  </div>
                </div>
              </div>
              {/* <div className="text-xs text-gray-500 justify-center w-full flex items-center h-10">
                <Calendar className="h-3 w-3 mr-1" />
                Joined: {employee.joined}
              </div> */}
            </Link>
          ))}
        </div>
      </div>

      {/* Show message when no results found */}
      {filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No contributors found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
