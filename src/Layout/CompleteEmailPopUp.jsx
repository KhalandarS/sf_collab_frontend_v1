import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function CompleteProfilePopUp() {
  const navigate = useNavigate();
  const location = useLocation()
  const handleCompleteProfile = () => {
    navigate("/user-profile");
  };
  if (location.pathname === "/user-profile") return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-100000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-linear-to-b from-gray-800 to-gray-900 text-white p-8 rounded-xl max-w-md w-full shadow-2xl border border-gray-700"
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-gray-300 text-sm">
            Your profile is incomplete. Please complete it to unlock all features and enhance your account security.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg font-medium transition-all shadow-lg"
            onClick={handleCompleteProfile}
          >
            Go to Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
