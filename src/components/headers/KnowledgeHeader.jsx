import { useState, useEffect } from "react";
import { Search, Plus, X, Filter, Tag } from "lucide-react";
import { IoOptionsOutline } from "react-icons/io5";
import NewKnowledgeForm from "./forms/NewKnowledgeForm";

const KnowledgeHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  reloadResources,
}) => {
  const [showNewKnowledgeForm, setShowNewKnowledgeForm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formSelectedCategory, setFormSelectedCategory] =
    useState("All Categories");

  const categories = [
    "All Categories",
    "Technology",
    "Business",
    "Marketing",
    "Design",
    "Development",
    "Product",
    "Sales",
    "Finance",
    "HR",
    "Legal",
    "Operations",
  ];

  const sortOptions = ["Newest First", "Oldest First", "A-Z", "Z-A"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOpenDropdown(null);
  };

  const handleSortSelect = (sort) => {
    setSelectedSort(sort);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-btn")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center min-h-[100px] max-sm:min-h-[80px] p-4 gap-4 sm:gap-0">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <h2 className="text-2xl font-semibold">Knowledge Base</h2>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <IoOptionsOutline className="h-6 w-6" />
          )}
        </button>
      </div>

      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center`}
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className="w-full px-4 py-2 pl-10 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-gray-400"
          />
        </div>

        <div className="relative dropdown-btn">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors w-full sm:w-auto min-w-[140px] justify-between"
            onClick={() =>
              setOpenDropdown(openDropdown === "category" ? null : "category")
            }
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{selectedCategory}</span>
            </div>
          </button>
          {openDropdown === "category" && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] rounded-lg shadow-lg py-2 z-50 border border-white/10">
              {categories.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative dropdown-btn">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors w-full sm:w-auto min-w-[140px] justify-between"
            onClick={() =>
              setOpenDropdown(openDropdown === "sort" ? null : "sort")
            }
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{selectedSort}</span>
            </div>
          </button>
          {openDropdown === "sort" && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] rounded-lg shadow-lg py-2 z-50 border border-white/10">
              {sortOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                  onClick={() => handleSortSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowNewKnowledgeForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {showNewKnowledgeForm && (
        <NewKnowledgeForm
          setShowNewKnowledgeForm={setShowNewKnowledgeForm}
          selectedCategory={formSelectedCategory}
          setSelectedCategory={setFormSelectedCategory}
          reloadResources={reloadResources} // Pass reloadResources to NewKnowledgeForm
        />
      )}
    </div>
  );
};

export default KnowledgeHeader;