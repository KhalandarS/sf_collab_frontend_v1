import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProfilePicture } from '@/utils/getProfilePicture';
import { usersAPI } from '@/utils/APIs/userAPI';

export default function AddMemberModal({ isOpen, onClose, onSubmit, formData, onFormChange }) {
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.first_name || formData.last_name) {
        try {
          const response = await usersAPI.getAll({
            search: formData.first_name || formData.last_name,
            page: 1,
            per_page: 10
          });
          
          if (response.success && response.data?.users) {
            setUserResults(response.data.users);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.first_name, formData.last_name]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">First Name</label>
              <Input
                required={!selectedUser}
                value={formData.first_name}
                onChange={(e) => onFormChange({ ...formData, first_name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Last Name</label>
              <Input
                required={!selectedUser}
                value={formData.last_name}
                onChange={(e) => onFormChange({ ...formData, last_name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 max-h-50 overflow-y-auto'>
            {userResults.map((user) => (
              <div
                onClick={() => {
                  setSelectedUser(user.id)
                  onFormChange({
                    user_id: user.id,
                    first_name: user.firstName,
                    last_name: user.lastName,
                  })
                }}
                key={user.id} className={`${selectedUser === user.id ? 'bg-blue-400/70 rounded-lg p-2' : 'bg-gray-700/50'} flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getProfilePicture(user)} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-400 text-sm">{user.roles.join(' ')}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div>
  <label className="text-sm font-medium text-gray-300 mb-3 block">
    Visible for roles
  </label>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {['member', 'founder', 'investor', 'influencer'].map((role) => {
      const selected =
        Array.isArray(formData.role) && formData.role.includes(role);

      return (
        <button
          type="button"
          key={role}
          onClick={() => {
            const roles = Array.isArray(formData.role) ? formData.role : [];
            onFormChange({
              ...formData,
              role: selected
                ? roles.filter(r => r !== role)
                : [...roles, role],
            });
          }}
          className={`
            flex items-center justify-center px-3 py-2 rounded-lg border text-sm capitalize
            transition-all
            ${
              selected
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
            }
          `}
        >
          {role}
        </button>
      );
    })}
  </div>
</div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-black">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
