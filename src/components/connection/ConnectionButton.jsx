
import { useState } from 'react';
import { Loader2, UserPlus, Clock, UserCheck, UserX, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnectionStatus, ConnectionStatus } from '../hooks/useConnectionStatus';
import { toast } from '@/hooks/use-toast';

export function ConnectionButton({
  userId,
  size = 'default',        // 'sm' | 'default' | 'lg'
  onStatusChange,          // Callback when status changes
  className = '',
}) {
  const { status, isLoading, error, actions } = useConnectionStatus(userId);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: { button: 'h-8 px-3 text-xs', icon: 14 },
    default: { button: 'h-10 px-4 text-sm', icon: 16 },
    lg: { button: 'h-12 px-6 text-base', icon: 18 },
  };
  const config = sizeConfig[size];

  /**
   * Handle action with toast feedback
   */
  const handleAction = async (action, successMsg) => {
    const result = await action();
    
    if (result.success) {
      toast.success?.({ title: successMsg }) || toast({ title: successMsg, variant: 'success' });
      onStatusChange?.(status);
    } else if (result.error) {
      toast.destructive?.({ title: 'Error', description: result.error }) || 
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
    
    setShowRemoveConfirm(false);
  };

  // ==========================================================================
  // Don't render for own profile
  // ==========================================================================
  if (status === ConnectionStatus.SELF) {
    return null;
  }

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================
  if (status === ConnectionStatus.LOADING) {
    return (
      <Button disabled variant="outline" className={`${config.button} ${className}`}>
        <Loader2 className="animate-spin" size={config.icon} />
        <span className="ml-2">Loading...</span>
      </Button>
    );
  }

  // ==========================================================================
  // NO CONNECTION → "Connect" button
  // ==========================================================================
  if (status === ConnectionStatus.NONE) {
    return (
      <Button
        onClick={() => handleAction(actions.sendRequest, 'Connection request sent!')}
        disabled={isLoading}
        className={`
          ${config.button}
          bg-gradient-to-r from-blue-600 to-purple-600 
          hover:from-blue-700 hover:to-purple-700 
          text-white
          ${className}
        `}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={config.icon} />
        ) : (
          <UserPlus size={config.icon} />
        )}
        <span className="ml-2">Connect</span>
      </Button>
    );
  }

  // ==========================================================================
  // REQUEST SENT → "Request Sent" (disabled, click to cancel)
  // ==========================================================================
  if (status === ConnectionStatus.REQUEST_SENT) {
    return (
      <Button
        onClick={() => handleAction(actions.cancelRequest, 'Request cancelled')}
        disabled={isLoading}
        variant="outline"
        className={`
          ${config.button}
          border-slate-600 text-slate-400
          hover:bg-slate-700 hover:text-white hover:border-red-500
          ${className}
        `}
        title="Click to cancel request"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={config.icon} />
        ) : (
          <Clock size={config.icon} />
        )}
        <span className="ml-2">Request Sent</span>
      </Button>
    );
  }

  // ==========================================================================
  // REQUEST RECEIVED → "Accept" / "Decline" buttons
  // ==========================================================================
  if (status === ConnectionStatus.REQUEST_RECEIVED) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {/* Accept Button */}
        <Button
          onClick={() => handleAction(actions.acceptRequest, 'Connection accepted!')}
          disabled={isLoading}
          className={`
            ${config.button}
            bg-green-600 hover:bg-green-700 text-white
          `}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={config.icon} />
          ) : (
            <Check size={config.icon} />
          )}
          <span className="ml-2">Accept</span>
        </Button>
        
        {/* Decline Button */}
        <Button
          onClick={() => handleAction(actions.declineRequest, 'Request declined')}
          disabled={isLoading}
          variant="outline"
          className={`
            ${config.button}
            border-red-500/50 text-red-400
            hover:bg-red-500/20 hover:border-red-500
          `}
        >
          <X size={config.icon} />
          <span className="ml-2">Decline</span>
        </Button>
      </div>
    );
  }

  // ==========================================================================
  // CONNECTED → "Connected" / "Remove Connection"
  // ==========================================================================
  if (status === ConnectionStatus.CONNECTED) {
    // Show confirmation dialog
    if (showRemoveConfirm) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <span className="text-sm text-slate-400">Remove connection?</span>
          <Button
            onClick={() => handleAction(actions.removeConnection, 'Connection removed')}
            disabled={isLoading}
            size="sm"
            variant="destructive"
            className="h-8 px-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
          </Button>
          <Button
            onClick={() => setShowRemoveConfirm(false)}
            size="sm"
            variant="outline"
            className="h-8 px-2 border-slate-600"
          >
            <X size={14} />
          </Button>
        </div>
      );
    }

    // Normal connected state
    return (
      <Button
        onClick={() => setShowRemoveConfirm(true)}
        variant="outline"
        className={`
          ${config.button}
          border-green-500/50 text-green-400
          hover:bg-green-500/10 hover:border-green-500
          ${className}
        `}
        title="Click to remove connection"
      >
        <UserCheck size={config.icon} />
        <span className="ml-2">Connected</span>
      </Button>
    );
  }

  // Fallback
  return null;
}

export default ConnectionButton;
