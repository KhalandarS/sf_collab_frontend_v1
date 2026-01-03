import React, { useState, useRef } from "react";
import {
  ChevronDown,
  Filter,
  Building2,
  Plus,
  X,
  TrendingUp,
  Clock,
  Heart,
  MessageSquare,
  Users,
  Zap,
  Lightbulb,
} from "lucide-react";
import { IoOptionsOutline } from "react-icons/io5";
import SearchBar from "../sections/SearchBar";

const IdeationHeader = ({
  searchQuery,
  setSearchQuery,
  selectedStage,
  setSelectedStage,
  selectedIndustry,
  setSelectedIndustry,
  sortBy,
  setSortBy,
  onCreateIdea,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use refs instead of controlled state to prevent focus loss
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const industryRef = useRef("");
  const stageRef = useRef("");
  const tagsRef = useRef("");
  const searchTimeoutRef = useRef(null);
  const projectDetailsRef = useRef("");

  const stages = [
    "All Stages",
    "Idea Stage",
    "Concept Stage",
    "Development Stage",
    "Research Stage",
    "MVP Stage",
    "Growth Stage",
    "Scale Stage",
  ];

  const industries = [
    "All Industries",
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Sustainability",
  ];

  const sortOptions = [
    { value: "trending", label: "Trending", icon: TrendingUp },
    { value: "latest", label: "Latest", icon: Clock },
    { value: "popular", label: "Most Liked", icon: Heart },
    { value: "discussed", label: "Most Discussed", icon: MessageSquare },
  ];

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tagsRef.current
      ? tagsRef.current
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: titleRef.current.trim(),
      description: descriptionRef.current.trim(),
      projectDetails:
        projectDetailsRef.current.trim() || "No additional details provided.",
      industry: industryRef.current || "Technology",
      stage: stageRef.current || "Idea Stage",
      tags: tagsArray.length > 0 ? tagsArray : ["General"],
    };

    if (typeof onCreateIdea === "function") {
      onCreateIdea(payload);
    }
    setShowNewIdeaForm(false);
    // Clear refs
    titleRef.current = "";
    descriptionRef.current = "";
    industryRef.current = "";
    stageRef.current = "";
    tagsRef.current = "";
  };

  const FilterButton = ({
    icon,
    label,
    dropdownName,
    options,
    selected,
    onSelect,
  }) => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(dropdownName)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 w-full sm:w-auto border border-white/10 hover:border-white/20"
      >
        {icon}
        <span className="text-sm font-medium">{selected || label}</span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {activeDropdown === dropdownName && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-white/20 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-sm">
          {options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => {
                onSelect(option);
                setActiveDropdown(null);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const SortButton = () => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown("sort")}
        className=" bg-[#1A1A1A] flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 w-full sm:w-auto border border-white/20"
      >
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm font-medium">
          {sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort"}
        </span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {activeDropdown === "sort" && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-[#1A1A1A] border border-white/20 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-sm">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
              onClick={() => {
                setSortBy(option.value);
                setActiveDropdown(null);
              }}
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const NewIdeaForm = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[500px] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Share Your Brilliant Idea</h2>
          <button
            onClick={() => setShowNewIdeaForm(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Idea Title *
            </label>
            <input
              type="text"
              defaultValue=""
              onChange={(e) => {
                titleRef.current = e.target.value;
              }}
              placeholder="What's your big idea?"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 placeholder:text-xs"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              defaultValue=""
              onChange={(e) => {
                descriptionRef.current = e.target.value;
              }}
              placeholder="Describe your idea in detail. What problem does it solve? How does it work?"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 h-32 resize-none placeholder:text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Details
            </label>
            <textarea
              defaultValue=""
              onChange={(e) => {
                projectDetailsRef.current = e.target.value;
              }}
              placeholder="Add more technical or business details about your idea"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 h-24 resize-none placeholder:text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry *
              </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  industryRef.current = e.target.value;
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white text-xs"
                required
              >
                <option value="" className="bg-gray-800">
                  Select Industry
                </option>
                {industries
                  .filter((industry) => industry !== "All Industries")
                  .map((industry, index) => (
                    <option
                      key={index}
                      value={industry}
                      className="bg-gray-800"
                    >
                      {industry}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stage *
              </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  stageRef.current = e.target.value;
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white text-xs"
                required
              >
                <option value="" className="bg-gray-800">
                  Select Stage
                </option>
                {stages
                  .filter((stage) => stage !== "All Stages")
                  .map((stage, index) => (
                    <option key={index} value={stage} className="bg-gray-800">
                      {stage}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              defaultValue=""
              onChange={(e) => {
                tagsRef.current = e.target.value;
              }}
              placeholder="e.g., AI, Mobile, Sustainability (comma separated)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 placeholder:text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 max-sm:text-sm">
            <button
              type="button"
              onClick={() => setShowNewIdeaForm(false)}
              className="px-6 py-2.5 bg-white/10 shadow-md hover:bg-white/20 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-200 shadow-md hover:bg-gray-300 rounded-xl transition-all duration-200 font-medium text-black shadow-lg"
            >
              Share Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 px-2 space-y-4">

            <div className="w-full flex justify-center items-center flex-col mb-2">
              <h1 className="text-5xl  sm:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up">
                <span className="bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  SF Idea Incubator
                </span>
                <br />
                
        </h1>
      <div className=" relative inline-block w-full">
                  {/* Animated underline */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-90 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent animate-shimmer" />
                  {/* <span className='absolute z-10 top-16 right-1 w-full flex justify-center mt-2'>
                    <svg aria-hidden="true" viewBox="0 0 418 42" className=" h-[0.70em] w-96 fill-blue-400/50" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                  </span> */}
                </div>
      </div>
        
        {/* <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">SF Idea Incubator</h1>
            <p className="text-xs text-gray-400">
          Share, discover, and collaborate on innovative ideas
            </p>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
            ) : (
          <IoOptionsOutline className="h-6 w-6" />
            )}
          </button>
        </div> */}

        {/* Controls Section */}
      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-3 w-full`}
      >
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchTimeoutRef={searchTimeoutRef}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SortButton />
          <FilterButton
            icon={<Filter className="h-4 w-4" />}
            label="Stage"
            dropdownName="stages"
            options={stages}
            selected={selectedStage !== "All Stages" ? selectedStage : ""}
            onSelect={setSelectedStage}
          />
          <FilterButton
            icon={<Building2 className="h-4 w-4" />}
            label="Industry"
            dropdownName="industries"
            options={industries}
            selected={
              selectedIndustry !== "All Industries" ? selectedIndustry : ""
            }
            onSelect={setSelectedIndustry}
          />
          <button
            onClick={() => setShowNewIdeaForm(true)}
            className="flex items-center justify-center gap-2 rounded-lg transition-all duration-200 w-full px-4 py-2.5  sm:w-auto font-medium shadow-lg bg-gray-200 text-black text-sm border border-white/20"
          >
            <Plus className="h-4 w-4" />
            <span>Share Idea</span>
          </button>
        </div>
      </div>

      {showNewIdeaForm && <NewIdeaForm />}
    </div>
  );
};

export default IdeationHeader;
