// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "./LoadingSpinner";

// export const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const { access_token, loading } = useSelector((state) => state.auth);

//   if (loading) return <LoadingSpinner />;

//   if (!access_token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export const AuthRoute = ({ children }) => {
//   const { access_token, loading } = useSelector((state) => state.auth);

//   if (loading) return <LoadingSpinner />;

//   if (access_token) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };


// ProtectedRoute.jsx (updated)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import AccessRequestModal from "./auth/admin/AccessRequestModal";
import { hasPermission } from "../utils/permissionCheck";

export const ProtectedRoute = ({ children, requiredPermission }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { access_token, loading, user } = useSelector((state) => state.auth);
  const [showAccessModal, setShowAccessModal] = useState(false);
  // console.log(user)
  if (loading) return <LoadingSpinner />;

  if (!access_token && location.pathname !== '/oauth/callback' && location.pathname !== '/login') {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login", { state: { from: location }, replace: true });
    return null;
  }

  // If no permission required, just render children
  if (!requiredPermission) {
    return children;
  }

  // Check if user has the required permission
  
  const hasPerm = hasPermission(user,requiredPermission);

  if (!hasPerm) {
    return (
      <>
        <AccessRequestModal
          isOpen={showAccessModal}
          onClose={() => setShowAccessModal(false)}
          permissionKey={requiredPermission}
        />
        <PermissionDeniedPage onRequestAccess={() => setShowAccessModal(true)} />
      </>
    );
  }

  return children;
};

export const AuthRoute = ({ children }) => {
  const { access_token, loading } = useSelector((state) => state.auth);

  if (loading) return <LoadingSpinner />;

  if (access_token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Helper component for permission denied page
const PermissionDeniedPage = ({ onRequestAccess }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-black">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <div className="space-y-4">
            <button
              onClick={onRequestAccess}
              className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-[0_4px_14px_0_rgba(255,255,255,0.3)]"
            >
              Request Access
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 px-4 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;