import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { toast } from 'react-toastify';
import { startupsAPI } from '@/utils/APIs/startupsAPI';

/**
 * SendJoinRequestModal - For REGULAR USERS to send join requests to startups
 * 
 * This modal allows non-founder/non-creator users to express interest in joining
 * a startup by submitting a join request with their message, desired role, and links.
 */
const SendJoinRequestModal = ({ isOpen, onClose, startupId, startupName, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    role: 'member',
    portfolio_url: '',
    github_url: '',
    linkedin_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      toast.error('Please share why you want to join this team');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        startup_id: startupId,
        message: formData.message,
        role: formData.role,
        portfolio_url: formData.portfolio_url || null,
        github_url: formData.github_url || null,
        linkedin_url: formData.linkedin_url || null,
      };

      // Call API to submit join request
      const response = await startupsAPI.sendJoinRequest(startupId, payload);

      if (response?.success || response?.data?.success) {
        toast.success('✅ Join request sent successfully! The founder will review it soon.');
        setFormData({
          message: '',
          role: 'member',
          portfolio_url: '',
          github_url: '',
          linkedin_url: ''
        });
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(response?.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      
      // Check for specific error messages
      if (error.response?.status === 409) {
        toast.error('You already have a pending request for this startup');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send join request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const roles = [
    { value: 'member', label: 'Team Member' },
    { value: 'builder', label: 'Builder' },
    { value: 'advisor', label: 'Advisor' },
    { value: 'investor', label: 'Investor' },
    { value: 'influencer', label: 'Influencer' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            Join {startupName}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Tell us why you'd like to join this team and how you can contribute
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Message Field */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block font-semibold">
              Your Message *
            </label>
            <Textarea
              required
              placeholder="Tell us why you're interested in joining this startup and what you can bring to the team..."
              value={formData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block font-semibold">
              Desired Role *
            </label>
            <Select value={formData.role} onValueChange={(value) => handleFieldChange('role', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value} className="text-white">
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Links Section */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-300 font-semibold mb-3">
              Links (Optional)
            </p>

            <div className="space-y-3">
              {/* Portfolio URL */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Portfolio/Website</label>
                <Input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio_url}
                  onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">GitHub Profile</label>
                <Input
                  type="url"
                  placeholder="https://github.com/yourprofile"
                  value={formData.github_url}
                  onChange={(e) => handleFieldChange('github_url', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">LinkedIn Profile</label>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin_url}
                  onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 <strong>Note:</strong> The startup founder will review your request and get back to you soon.
              You can have only one pending request per startup at a time.
            </p>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.message.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Sending...' : 'Send Join Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendJoinRequestModal;
