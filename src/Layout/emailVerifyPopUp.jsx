import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authAPI } from '@/utils/APIs/authAPI';
import { useState } from 'react';

const EmailVerifyPopUp = () => {
  const navigate = useNavigate();
  const { user, access_token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const handleResendVerification = async () => {
    setLoading(true);
    try {
      
      console.log(loading, "Loading state");
      const response = await authAPI.sendVerificationCodeRequest(access_token);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      navigate(`/verify-email?token=${response.verification_token}`);
      toast.info("Verification code sent to your email, continue to verify.");

    } catch (err) {
      console.error(err);
      toast.error("An error occurred while resending verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user && !user.isEmailVerified && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-purple-500 to-blue-500 text-black px-4 py-4 h-full"
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="font-medium">Your email is not verified. Please check your inbox.</p>
            </div>
            <button
              className="px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg font-semibold transition-colors whitespace-nowrap"
              onClick={handleResendVerification}
            >
              {loading ? "Sending..." : "Verify Now"}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default EmailVerifyPopUp;