import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if we have tokens in the URL hash (implicit flow)
        const hash = window.location.hash;
        
        if (!hash) {
          setError('No authentication data received');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const result = await handleOAuthCallback();
        
        if (result.success) {
          // Success! Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          setError(result.error || 'Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('OAuth callback processing error:', error);
        setError('An unexpected error occurred during authentication');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    // Small delay to ensure the component has mounted
    const timer = setTimeout(processCallback, 100);
    
    return () => clearTimeout(timer);
  }, [handleOAuthCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xl font-semibold">Authentication Error</div>
          <div className="text-gray-400">{error}</div>
          <div className="text-sm text-gray-500">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default OAuthCallback;
