import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/config';
import { useSelector } from 'react-redux';
import { usersAPI } from '@/utils/APIs/userAPI';

const AVAILABLE_ROLES = ['founder', 'builder', 'investor', 'influencer'];

const UserPopUp = ({ user, onClose }) => {
  const { access_token } = useSelector((state) => state.auth);

  const [roles, setRoles] = useState(user.roles || []);
  const [isBanned, setIsBanned] = useState(user.status === 'banned');
  const [loading, setLoading] = useState(false);

  const toggleRole = (role) => {
    setRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isBanned && user.role === 'admin') {
        toast.error('Cannot ban an admin user');
        setLoading(false);
        return;
      }
      console.log({ roles, status: isBanned ? 'banned' : 'active' });
      const response = await usersAPI.updateProfile(
        user.id,
        { roles, status: isBanned ? 'banned' : 'active' },
        access_token,
        'application/json'
      );
      if (!response.success) {
        toast.error(response.message || 'Failed to update user');
        return;
      }
      if (response.data.user.status === 'banned') {
        await axios.put(
          `${API_BASE_URL}/users/${user.id}`,
          {
            status: isBanned ? 'banned' : 'active',
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }
      toast.success('User updated');
      // onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 w-full max-w-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl">

        <h2 className="text-2xl font-bold mb-1 text-white">
          👤 Manage User
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {user.fullName} • {user.email}
        </p>

        {/* Roles */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Roles</h3>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_ROLES.map((role) => (
              <label
                key={role}
                className="flex items-center gap-2 bg-gray-700/40 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600/40 transition"
              >
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span className="capitalize text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ban */}
        <div className="mb-6">
          <label className="flex items-center gap-3 text-red-400">
            <input
              type="checkbox"
              checked={isBanned}
              onChange={() => setIsBanned(!isBanned)}
            />
            Ban user
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPopUp;
