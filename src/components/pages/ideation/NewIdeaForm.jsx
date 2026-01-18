import { X } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function NewIdeaForm({
  onClose,
  onCreateIdea,
  industries,
  stages,
}) {
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const industryRef = useRef("");
  const stageRef = useRef("");
  const tagsRef = useRef("");
  const projectDetailsRef = useRef("");
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  const { user } = useSelector((state) => state.auth);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tagsRef.current
      ? tagsRef.current
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const formData = new FormData();
    formData.append("creator_first_name", user?.firstName);
    formData.append("creator_last_name", user?.lastName);
    formData.append("title", titleRef.current.trim());
    formData.append("description", descriptionRef.current.trim());
    formData.append(
      "projectDetails",
      projectDetailsRef.current.trim() || "No additional details provided."
    );
    formData.append("industry", industryRef.current || "Technology");
    formData.append("stage", stageRef.current || "Idea Stage");
    formData.append("tags", JSON.stringify(tagsArray.length > 0 ? tagsArray : ["General"]));
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (typeof onCreateIdea === "function") {
      onCreateIdea(formData);
    }
    onClose();
    titleRef.current = "";
    descriptionRef.current = "";
    industryRef.current = "";
    stageRef.current = "";
    tagsRef.current = "";
    setSelectedImage(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => onClose()}
    >
      <motion.div
        className="bg-[#1A1A1A] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-scroll"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-semibold">Share Your Brilliant Idea</h2>
          <motion.button
            onClick={() => onClose()}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </motion.div>

        <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
          {[
            {
              label: "Idea Title *",
              type: "input",
              placeholder: "What's your big idea?",
              ref: titleRef,
              required: true,
              autoFocus: true,
            },
            {
              label: "Description *",
              type: "textarea",
              placeholder:
                "Describe your idea in detail. What problem does it solve? How does it work?",
              ref: descriptionRef,
              required: true,
              rows: 4,
            },
            {
              label: "Project Details",
              type: "textarea",
              placeholder:
                "Add more technical or business details about your idea",
              ref: projectDetailsRef,
              rows: 3,
            },
          ].map((field, i) => (
            <motion.div
              key={field.label}
              variants={itemVariants}
              custom={i + 1}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
              </label>
              {field.type === "input" ? (
                <motion.input
                  type="text"
                  defaultValue=""
                  onChange={(e) => {
                    field.ref.current = e.target.value;
                  }}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 placeholder:text-xs transition-all"
                  required={field.required}
                  autoFocus={field.autoFocus}
                  whileFocus={{ scale: 1.01 }}
                />
              ) : (
                <motion.textarea
                  defaultValue=""
                  onChange={(e) => {
                    field.ref.current = e.target.value;
                  }}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 resize-none placeholder:text-xs transition-all"
                  rows={field.rows}
                  required={field.required}
                  whileFocus={{ scale: 1.01 }}
                />
              )}
            </motion.div>
          ))}

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={itemVariants}
            custom={4}
            initial="hidden"
            animate="visible"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry *
              </label>
              <motion.select
                defaultValue=""
                onChange={(e) => {
                  industryRef.current = e.target.value;
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white text-xs transition-all"
                required
                whileFocus={{ scale: 1.01 }}
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
              </motion.select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stage *
              </label>
              <motion.select
                defaultValue=""
                onChange={(e) => {
                  stageRef.current = e.target.value;
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white text-xs transition-all"
                required
                whileFocus={{ scale: 1.01 }}
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
              </motion.select>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            custom={5}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <motion.input
              type="text"
              defaultValue=""
              onChange={(e) => {
                tagsRef.current = e.target.value;
              }}
              placeholder="e.g., AI, Mobile, Sustainability (comma separated)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 placeholder:text-xs transition-all"
              whileFocus={{ scale: 1.01 }}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            custom={5.5}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors text-white"
              whileHover={{ scale: 1.01 }}
            >
              {selectedImage ? `✓ ${selectedImage.name}` : "Choose Image"}
            </motion.button>
          </motion.div>

          <motion.div
            className="flex justify-end gap-3 pt-4 max-sm:text-sm"
            variants={itemVariants}
            custom={6}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              type="button"
              onClick={() => onClose()}
              className="px-6 py-2.5 bg-white/10 shadow-md hover:bg-white/20 rounded-xl transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-2.5 bg-gray-200 shadow-md hover:bg-gray-300 rounded-xl transition-all duration-200 font-medium text-black shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Share Idea
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}