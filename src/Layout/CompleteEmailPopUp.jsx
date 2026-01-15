import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { authAPI } from "@/services/auth/authAPI";

export default function EmailVerifyPopUp() {
  const navigate = useNavigate();
  const { user, access_token } = useSelector((state) => state.auth);

  if (!user || user.isEmailVerified) return null;

  const handleResendVerification = async () => {
    try {
      const response = await authAPI.sendVerificationCodeRequest(access_token);

      toast.info("Verification code sent to your email.");
      navigate(`/verify-email?token=${response.verification_token}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend verification email.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8 rounded-xl max-w-md w-full shadow-2xl border border-gray-700"
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-gray-300 text-sm">
            Your email address isn’t verified yet. Please verify it to unlock all features and keep your account secure.
          </p>
        </div>

        <div className="flex gap-3 justify-end">

          <button
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg font-medium transition-all shadow-lg"
            onClick={handleResendVerification}
          >
            Verify Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
