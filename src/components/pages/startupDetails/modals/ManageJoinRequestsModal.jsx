import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../ui/dialog';
import { Card, CardContent } from '../../../ui/card';
import { CheckCircle2Icon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManageJoinRequestsModal = ({
  isOpen,
  onClose,
  joinRequests = [],
  loading = false,
  onAccept,
  onReject,
  founderName = 'You',
  startupName = '',
}) => {
  const requests = Array.isArray(joinRequests) ? joinRequests : [];
  const pendingRequests = requests.filter(r => r.status === 'pending' || !r.status);
  const hasRequests = pendingRequests.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border border-white/10 mt-4">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">📋 Manage Join Requests</DialogTitle>
          <DialogDescription className="text-gray-400">
            {startupName && <span className="block font-semibold text-white/80 mb-2">For: <span className="text-blue-400">{startupName}</span></span>}
            Review and respond to requests from people who want to join your team
          </DialogDescription>
        </DialogHeader>

        {/* Info Box showing who is making decisions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-300">
            ✓ <span className="font-semibold text-white">{founderName}</span> (Founder) - You are reviewing and can accept/reject requests
          </p>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center py-20 text-sm text-gray-400">
              Loading join requests…
            </div>
          ) : !hasRequests ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-sm mb-2">✨ No pending requests</div>
              <p className="text-xs text-gray-500">When someone requests to join, they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-semibold px-1">
                {pendingRequests.length} Request{pendingRequests.length !== 1 ? 's' : ''} Pending
              </p>
              {requests.map((request) => {
                // Handle both camelCase (backend) and snake_case field names
                const requesterName = request.full_name || 
                  `${request.firstName || request.first_name || ''} ${request.lastName || request.last_name || ''}`.trim() || 
                  'Anonymous Builder';
                const requestedRole = request.role || 'Team Member';
                const message = request.message || 'No message provided';
                const createdDate = request.createdAt || request.created_at;
                
                return (
                  <Card key={request.id || request.request_id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <CardContent className="pt-4 pb-3 px-4">
                      {/* Requester Info */}
                      <div className="mb-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                            {requesterName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">
                              {requesterName}
                            </p>
                            <p className="text-xs text-gray-400">
                              Requesting as: <span className="text-yellow-400 font-semibold">{requestedRole}</span>
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 italic bg-white/5 rounded px-2 py-2">
                          "{message}"
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Requested on: {createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>

                      {/* Action Info */}
                      <div className="text-xs text-gray-400 mb-3">
                        <p>As <span className="text-blue-300 font-semibold">{founderName}</span>, you can:</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => onReject?.(request)}
                          disabled={!onReject}
                        >
                          <XIcon className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                          onClick={() => onAccept?.(request)}
                          disabled={!onAccept}
                        >
                          <CheckCircle2Icon className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} className="text-sm text-gray-300">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ManageJoinRequestsModal;