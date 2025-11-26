import React, { useState, useEffect, useMemo } from "react";
import KnowledgeHeader from "../headers/KnowledgeHeader";
import {
  User,
  Tag,
  Eye,
  Download,
  ThumbsUp,
  ArrowUpRight,
  FileType,
  Clock,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const Knowledge = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("Newest First");
  const [knowledgeContent, setKnowledgeContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);

  const getFileTypeColor = (type) => {
    const colors = {
      pdf: "bg-red-600",
      docs: "bg-blue-600",
      xls: "bg-green-600",
      ppt: "bg-yellow-600",
      txt: "bg-gray-600",
      png: "bg-pink-600",
      jpg: "bg-orange-600",
      jpeg: "bg-orange-600",
    };
    return colors[type] || "bg-gray-600";
  };

  const fetchKnowledgeResources = async () => {
    try {
      setLoading(true);
      setError(null);
      setNetworkError(false);
      
      const response = await fetch(
        "https://sfcolab-backend.onrender.com/api/knowledge?page=1&limit=100&sortBy=createdAt&sortOrder=desc"
      );

      let mappedContent = [];
      if (response.ok) {
        const data = await response.json();
        mappedContent = data.resources.map((resource) => ({
          id: resource._id,
          title: resource.title,
          titleDescription: resource.titleDescription || "No title description available.",
          contentPreview: resource.contentPreview || "No content preview available.",
          category: resource.category,
          author: {
            name: `${resource.author.firstName} ${resource.author.lastName}`,
            role: "Contributor",
            avatar: `https://i.pravatar.cc/150?img=${resource.id}`,
          },
          date: new Date(resource.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          fileUrl: resource.image?.contentType?.split("/")[1] || "bin",
          views: resource.views?.toString() || "0",
          downloads: resource.downloads || 0,
          likes: resource.likes || 0,
          tags: resource.tags || [],
          metrics: {
            pages: "N/A",
            size: "N/A",
            lastUpdated: new Date(resource.updatedAt).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            ),
          },
        }));
      }

      setKnowledgeContent(mappedContent);
    } catch (err) {
      console.error("Fetch error:", err);
      setNetworkError(true);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeResources();
  }, []);

  const filteredAndSortedContent = useMemo(() => {
    let filtered = knowledgeContent.filter((content) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        content.title.toLowerCase().includes(searchLower) ||
        content.titleDescription.toLowerCase().includes(searchLower) ||
        content.contentPreview.toLowerCase().includes(searchLower) ||
        content.category.toLowerCase().includes(searchLower) ||
        content.author.name.toLowerCase().includes(searchLower) ||
        content.author.role.toLowerCase().includes(searchLower) ||
        content.fileUrl.toLowerCase().includes(searchLower) ||
        content.date.toLowerCase().includes(searchLower) ||
        content.views.toLowerCase().includes(searchLower) ||
        content.downloads.toString().includes(searchLower) ||
        content.likes.toString().includes(searchLower) ||
        content.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        Object.values(content.metrics).some((value) =>
          value.toString().toLowerCase().includes(searchLower)
        );

      const matchesCategory =
        selectedCategory === "All Categories" ||
        content.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (selectedSort) {
      case "Newest First":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Oldest First":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "A-Z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        filtered.sort((a, b) => b.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [knowledgeContent, searchQuery, selectedCategory, selectedSort]);

  const handleRetry = () => {
    fetchKnowledgeResources();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-300">Loading knowledge resources...</p>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="min-h-screen bg-black">
        <KnowledgeHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          reloadResources={fetchKnowledgeResources}
        />
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/20 p-4 rounded-full">
                <WifiOff className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Network Connection Issue
            </h3>
            <p className="text-gray-400 mb-6">
              {error || "Unable to connect to the server. Please check your internet connection."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <KnowledgeHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        reloadResources={fetchKnowledgeResources}
      />
      
      {error && !networkError && (
        <div className="mx-4 mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 p-4 max-sm:p-0">
        {filteredAndSortedContent.map((content) => (
          <Link
            key={content.id}
            to={`/knowledge-details?id=${content.id}`}
            className="bg-[#232323] rounded-4xl h-full hover:bg-[#2a2a2a] transition-colors duration-200"
          >
            <div className="w-full h-full p-2 max-sm:p-1">
              <div className="bg-[#1A1A1A] flex-1 items-center justify-center min-h-[330px] rounded-4xl p-7 space-y-6 max-sm:p-5">
                <div className="flex w-full justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center">
                      <FileType className="h-6 w-6 text-gray-400" />
                    </div>
                    <h1 className="text-lg max-sm:text-base font-bold">
                      {content.title}
                    </h1>
                  </div>
                  <button
                    className={`${getFileTypeColor(
                      content.fileUrl
                    )} text-sm px-2 py-1 font-medium rounded-full capitalize`}
                  >
                    {content.fileUrl}
                  </button>
                </div>
                <div className="text-sm font-medium max-sm:font-normal leading-relaxed text-[#C4C4C4] line-clamp-3">
                  {content.contentPreview}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(content.metrics).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="bg-[#2A2A2A] rounded-lg p-2 text-center"
                      >
                        <p className="text-xs text-gray-400 mb-1">{key}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    )
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#2A2A2A] text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 font-medium text-[#C4C4C4] gap-4">
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm">
                      <User size={18} className="text-blue-500" />
                      <span className="flex items-center gap-2">
                        <img
                          src={content.author.avatar}
                          alt={content.author.name}
                          className="w-5 h-5 rounded-full"
                        />
                        {content.author.name}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Tag size={18} className="text-green-500" />
                      {content.category}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm">
                      <Eye size={18} className="text-purple-500" />
                      {content.views}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Download size={18} className="text-yellow-500" />
                      {content.downloads}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={16} className="text-red-500" />
                      {content.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} className="text-blue-500" />
                      {content.date}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-500 text-sm">
                    View Details
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filteredAndSortedContent.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No knowledge resources found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knowledge;