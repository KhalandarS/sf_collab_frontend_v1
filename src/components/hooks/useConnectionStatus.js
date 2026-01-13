

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { connectionAPI } from '@/utils/APIs/connectionAPI';

/**
 * Connection status constants
 */
export const ConnectionStatus = {
  NONE: 'none',                    // No connection → "Connect"
  REQUEST_SENT: 'request_sent',    // Request sent → "Request Sent" (disabled)
  REQUEST_RECEIVED: 'request_received', // Incoming request → "Accept" / "Decline"
  CONNECTED: 'connected',          // Connected → "Connected" / "Remove Connection"
  SELF: 'self',                    // Own profile → Hide button
  LOADING: 'loading',              // Loading state
};

/**
 * Hook for managing connection status with another user.
 * 
 * @param {number} targetUserId - The ID of the user to check status with
 * @returns {object} - { status, requestId, isLoading, error, actions }
 */
export function useConnectionStatus(targetUserId) {
  const { user: currentUser, access_token } = useSelector((state) => state.auth);
  
  // State
  const [status, setStatus] = useState(ConnectionStatus.LOADING);
  const [requestId, setRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch current connection status from backend
   */
  const fetchStatus = useCallback(async () => {
    // Check for self
    if (!targetUserId || !currentUser?.id) {
      setStatus(ConnectionStatus.LOADING);
      return;
    }
    
    if (Number(targetUserId) === Number(currentUser.id)) {
      setStatus(ConnectionStatus.SELF);
      setRequestId(null);
      return;
    }
    
    if (!access_token) {
      setStatus(ConnectionStatus.NONE);
      return;
    }

    try {
      setError(null);
      const response = await connectionAPI.getStatus(targetUserId, access_token);
      const data = response.data || response;
      
      setStatus(data.status || ConnectionStatus.NONE);
      setRequestId(data.request_id || null);
    } catch (err) {
      console.error('Failed to fetch connection status:', err);
      setError('Failed to load status');
      setStatus(ConnectionStatus.NONE);
    }
  }, [targetUserId, currentUser?.id, access_token]);

  // Fetch status on mount and when dependencies change
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /**
   * SEND CONNECTION REQUEST
   * Status: none → request_sent
   */
  const sendRequest = useCallback(async () => {
    if (!access_token || !targetUserId) return { success: false };
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await connectionAPI.sendRequest(targetUserId, access_token);
      
      setStatus(ConnectionStatus.REQUEST_SENT);
      setRequestId(response.data?.request?.id || null);
      
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send request';
      setError(errorMsg);
      await fetchStatus(); // Refresh to get actual state
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [access_token, targetUserId, fetchStatus]);

  /**
   * ACCEPT CONNECTION REQUEST
   * Status: request_received → connected
   */
  const acceptRequest = useCallback(async () => {
    if (!access_token || !requestId) return { success: false };
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await connectionAPI.acceptRequest(requestId, access_token);
      
      setStatus(ConnectionStatus.CONNECTED);
      
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to accept request';
      setError(errorMsg);
      await fetchStatus();
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [access_token, requestId, fetchStatus]);

  /**
   * DECLINE CONNECTION REQUEST
   * Status: request_received → none
   */
  const declineRequest = useCallback(async () => {
    if (!access_token || !requestId) return { success: false };
    
    setIsLoading(true);
    setError(null);

    try {
      await connectionAPI.declineRequest(requestId, access_token);
      
      setStatus(ConnectionStatus.NONE);
      setRequestId(null);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to decline request';
      setError(errorMsg);
      await fetchStatus();
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [access_token, requestId, fetchStatus]);

  /**
   * CANCEL SENT REQUEST
   * Status: request_sent → none
   */
  const cancelRequest = useCallback(async () => {
    if (!access_token || !requestId) return { success: false };
    
    setIsLoading(true);
    setError(null);

    try {
      await connectionAPI.cancelRequest(requestId, access_token);
      
      setStatus(ConnectionStatus.NONE);
      setRequestId(null);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel request';
      setError(errorMsg);
      await fetchStatus();
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [access_token, requestId, fetchStatus]);

  /**
   * REMOVE CONNECTION
   * Status: connected → none
   */
  const removeConnection = useCallback(async () => {
    if (!access_token || !targetUserId) return { success: false };
    
    setIsLoading(true);
    setError(null);

    try {
      await connectionAPI.removeConnection(targetUserId, access_token);
      
      setStatus(ConnectionStatus.NONE);
      setRequestId(null);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to remove connection';
      setError(errorMsg);
      await fetchStatus();
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [access_token, targetUserId, fetchStatus]);

  return {
    status,
    requestId,
    isLoading,
    error,
    actions: {
      sendRequest,
      acceptRequest,
      declineRequest,
      cancelRequest,
      removeConnection,
      refresh: fetchStatus,
    },
  };
}

export default useConnectionStatus;
