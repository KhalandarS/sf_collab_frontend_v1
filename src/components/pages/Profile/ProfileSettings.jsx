// ProfileSettings.jsx
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe, Bookmark, ExternalLink, Trash2, Share2 } from 'lucide-react';

/**
 * Updated Settings UI wired to backend routes:
 * - GET /api/settings/profile
 * - PUT /api/settings/profile
 * - POST /api/settings/profile/picture
 * - DELETE /api/settings/profile/picture
 * - GET /api/settings/account
 * - POST /api/settings/account/change-password
 * - POST /api/settings/account/change-email
 * - POST /api/settings/account/delete-account
 * - GET /api/settings/preferences
 * - PUT /api/settings/preferences
 * - GET /api/settings/notifications
 * - PUT /api/settings/notifications
 *
 * Assumes auth token stored in localStorage under 'token'. Adjust getAuthHeaders() if different.
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

const ProfileSettings = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Unified formData that mirrors backend models:
  const [formData, setFormData] = useState({
    // user top-level
    firstName: '',
    lastName: '',
    email: '',
    status: 'active',
    profile: {
      picture: null,
      bio: '',
      company: '',
      // use plain object for socialLinks (backend: Map)
      socialLinks: {},
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      privacy: 'public',
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
    },
    notificationSettings: {
      newComments: true,
      newLikes: true,
      newSuggestions: true,
      joinRequests: true,
      approvals: true,
      storyViews: true,
      postEngagement: true,
      emailDigest: 'weekly',
      quietHours: { enabled: false, start: '22:00', end: '08:00' }
    },
    // savedItems left as-is (UI only)
    savedItems: {
      ideas: [], startups: [], posts: [], resources: [], archived: []
    },
    account: {
      isEmailVerified: false,
      createdAt: null,
      lastLogin: null
    }
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accountSecurity', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'saved', label: 'Saved Items', icon: Bookmark }
  ];

  // Initial load
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [profileRes, prefsRes, notifRes, accountRes] = await Promise.all([
          fetch('/api/settings/profile', { headers: getAuthHeaders() }),
          fetch('/api/settings/preferences', { headers: getAuthHeaders() }),
          fetch('/api/settings/notifications', { headers: getAuthHeaders() }),
          fetch('/api/settings/account', { headers: getAuthHeaders() })
        ]);

        if (profileRes.ok) {
          const p = await profileRes.json();
          // server returns { profile: { firstName,lastName,email, profile, createdAt,... } }
          const serverProfile = p.profile || {};
          setFormData(prev => ({
            ...prev,
            firstName: serverProfile.firstName || '',
            lastName: serverProfile.lastName || '',
            email: serverProfile.email || prev.email,
            profile: {
              picture: (serverProfile.profile && serverProfile.profile.picture) || prev.profile.picture,
              bio: (serverProfile.profile && serverProfile.profile.bio) || '',
              company: (serverProfile.profile && serverProfile.profile.company) || '',
              socialLinks: (serverProfile.profile && serverProfile.profile.socialLinks) || {}
            }
          }));
        }

        if (prefsRes.ok) {
          const { preferences } = await prefsRes.json();
          if (preferences) {
            setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, ...preferences } }));
          }
        }

        if (notifRes.ok) {
          const { notificationSettings } = await notifRes.json();
          if (notificationSettings) {
            setFormData(prev => ({ ...prev, notificationSettings: { ...prev.notificationSettings, ...notificationSettings } }));
          }
        }

        if (accountRes.ok) {
          const { account } = await accountRes.json();
          if (account) {
            setFormData(prev => ({ ...prev, account: { ...prev.account, ...account } }));
          }
        }
      } catch (err) {
        console.error('Load settings error', err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Helpers to update nested values
  const updateProfileField = (patch) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };
  const updateProfileNested = (patch) => {
    setFormData(prev => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  };
  const updatePreferences = (patch) => {
    setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, ...patch } }));
  };
  const updateNotifications = (patch) => {
    setFormData(prev => ({ ...prev, notificationSettings: { ...prev.notificationSettings, ...patch } }));
  };

  // API actions
  const saveProfile = async () => {
    setSaving(true);
    try {
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.profile.bio,
        company: formData.profile.company,
        // socialLinks should be plain object
        socialLinks: formData.profile.socialLinks || {}
      };
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Profile update failed');
      const data = await res.json();
      // update local with response
      if (data.profile) {
        updateProfileField({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          email: data.profile.email,
        });
        updateProfileNested({
          picture: data.profile.profile?.picture ?? formData.profile.picture,
          bio: data.profile.profile?.bio ?? formData.profile.bio,
          company: data.profile.profile?.company ?? formData.profile.company,
          socialLinks: data.profile.profile?.socialLinks ?? formData.profile.socialLinks
        });
      }
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const uploadProfilePicture = async (file) => {
    // your backend expects { pictureUrl } — common approach here: upload to storage and send URL.
    // For demo: convert to data URL and send as pictureUrl (your backend accepts the string)
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const pictureUrl = reader.result;
        const res = await fetch('/api/settings/profile/picture', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ pictureUrl })
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        updateProfileNested({ picture: data.picture || pictureUrl });
        alert('Profile picture updated');
      } catch (err) {
        console.error(err);
        alert('Failed to upload picture');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = async () => {
    try {
      const res = await fetch('/api/settings/profile/picture', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Removal failed');
      updateProfileNested({ picture: null });
      alert('Profile picture removed');
    } catch (err) {
      console.error(err);
      alert('Failed to remove picture');
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const payload = {
        emailNotifications: formData.preferences.emailNotifications,
        pushNotifications: formData.preferences.pushNotifications,
        privacy: formData.preferences.privacy,
        language: formData.preferences.language,
        timezone: formData.preferences.timezone,
        theme: formData.preferences.theme
      };
      const res = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Preferences update failed');
      const data = await res.json();
      if (data.preferences) updatePreferences(data.preferences);
      alert('Preferences updated');
    } catch (err) {
      console.error(err);
      alert('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      const payload = { ...formData.notificationSettings };
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Notification update failed');
      const data = await res.json();
      if (data.notificationSettings) updateNotifications(data.notificationSettings);
      alert('Notification settings updated');
    } catch (err) {
      console.error(err);
      alert('Failed to update notifications');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/settings/account/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Change password failed');
      }
      alert('Password changed');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to change password');
    }
  };

  const changeEmail = async (newEmail, password) => {
    try {
      const res = await fetch('/api/settings/account/change-email', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newEmail, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Change email failed');
      }
      alert('Email changed — verify your new email');
      // optionally refresh profile
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to change email');
    }
  };

  const deleteAccount = async (password) => {
    if (!confirm('This will mark your account deleted. Continue?')) return;
    try {
      const res = await fetch('/api/settings/account/delete-account', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password, confirmation: 'DELETE' })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Delete account failed');
      }
      alert('Account deletion submitted');
      // optionally redirect / logout
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete account');
    }
  };

  // Helper: global Save based on active section
  const handleSave = async () => {
    if (saving) return;
    if (activeSection === 'profile') await saveProfile();
    else if (activeSection === 'preferences') await savePreferences();
    else if (activeSection === 'notifications') await saveNotificationSettings();
    else if (activeSection === 'accountSecurity') {
      // no-op here; password/email/delete use their own buttons inside section
      alert('Use the specific actions inside Account & Security to update password/email/delete account.');
    } else {
      // other sections - no server persistence currently
      alert('Nothing to save for this section (handled locally).');
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-300">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeSection === section.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
              {/* Render sections */}
              {activeSection === 'profile' && (
                <ProfileSection
                  formData={formData}
                  onChange={(patch) => setFormData(prev => ({ ...prev, ...patch }))}
                  profileNestedOnChange={updateProfileNested}
                  onUploadPicture={uploadProfilePicture}
                  onRemovePicture={removeProfilePicture}
                />
              )}

              {activeSection === 'accountSecurity' && (
                <AccountSecurity
                  formData={formData}
                  onChange={(patch) => setFormData(prev => ({ ...prev, ...patch }))}
                  changePassword={changePassword}
                  changeEmail={changeEmail}
                  deleteAccount={deleteAccount}
                />
              )}

              {activeSection === 'notifications' && (
                <NotificationSection formData={formData} onChange={updateNotifications} saveNotifications={saveNotificationSettings} />
              )}

              {activeSection === 'privacy' && (
                <PrivacySection formData={formData} onChange={(patch) => setFormData(prev => ({ ...prev, privacySettings: { ...(prev.privacySettings || {}), ...patch } }))} />
              )}

              {activeSection === 'appearance' && (
                <AppearanceSection formData={formData} onChange={(patch) => updatePreferences(patch)} />
              )}

              {activeSection === 'preferences' && (
                <PreferencesSection formData={formData} onChange={(patch) => updatePreferences(patch)} savePreferences={savePreferences} />
              )}

              {activeSection === 'saved' && <SavedSection formData={formData} onChange={(patch) => setFormData(prev => ({ ...prev, savedItems: { ...prev.savedItems, ...patch } }))} />}

              {/* Global Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-700">
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- ProfileSection ---------------------- */
const ProfileSection = ({ formData, onChange, profileNestedOnChange, onUploadPicture, onRemovePicture }) => {
  const countries = ["United States", "United Kingdom", "Canada", "Australia", "Nigeria", "Ghana", "Kenya", "South Africa"];
  const timezones = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : ['UTC'];

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUploadPicture(file);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
            {formData.profile.picture ? (
              <img src={formData.profile.picture} className="w-full h-full object-cover" alt="profile" />
            ) : (
              <div className="flex items-center justify-center text-gray-400 text-sm h-full">No image</div>
            )}
          </div>

          <label className="px-4 py-2 bg-gray-700 rounded-lg cursor-pointer">
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          {formData.profile.picture && (
            <button type="button" onClick={onRemovePicture} className="px-4 py-2 bg-red-600 rounded-lg">Remove</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
          <input type="text" value={formData.firstName} onChange={(e) => onChange({ firstName: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
          <input type="text" value={formData.lastName} onChange={(e) => onChange({ lastName: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email (read-only)</label>
          <input type="text" value={formData.email} readOnly className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Account Status</label>
          <input type="text" value={formData.status} readOnly className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3 capitalize" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
        <textarea value={formData.profile.bio || ''} onChange={(e) => profileNestedOnChange({ bio: e.target.value })} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
          <input type="text" value={formData.profile.company || ''} onChange={(e) => profileNestedOnChange({ company: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Timezone (preference)</label>
          <select value={formData.preferences.timezone} onChange={(e) => onChange({ preferences: { ...formData.preferences, timezone: e.target.value } })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
            <option value="">Select timezone</option>
            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Social Links</label>
        <div className="grid grid-cols-2 gap-4">
          {["linkedin","twitter","github","portfolio","facebook","instagram","youtube","dribbble","behance"].map(platform => (
            <input
              key={platform}
              type="text"
              placeholder={platform}
              value={formData.profile.socialLinks?.[platform] || ''}
              onChange={(e) => profileNestedOnChange({ socialLinks: { ...(formData.profile.socialLinks || {}), [platform]: e.target.value } })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 capitalize"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------------- AccountSecurity ---------------------- */
const AccountSecurity = ({ formData, onChange, changePassword, changeEmail, deleteAccount }) => {
  const security = formData.accountSecurity || {};
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // local state for passwords/email
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const canChangePassword = newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Account & Security</h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Password</h3>
        <p className="text-gray-400 text-sm">Manage your login password. Choose a strong, unique password.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2 text-gray-400">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3 text-gray-300">{showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>

          <div className="flex items-end">
            <button type="button" onClick={() => alert('Password reset email (server) required')} className="text-blue-400 underline text-sm">Forgot password?</button>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-300">{showNew ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">Confirm New Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-300">{showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <div>{newPassword.length < 8 ? <span className="text-red-400">• Must be at least 8 characters</span> : <span className="text-green-400">• Length OK</span>}</div>
          <div>{newPassword !== confirmPassword ? <span className="text-red-400">• Passwords do not match</span> : <span className="text-green-400">• Passwords match</span>}</div>
        </div>

        <button disabled={!canChangePassword} onClick={() => changePassword(currentPassword, newPassword)} className={`px-6 py-3 rounded-lg mt-4 transition-colors ${canChangePassword ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed text-gray-400"}`}>Update Password</button>
      </div>

      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Change Email</h3>
        <p className="text-gray-400 text-sm">Change the email tied to your account (will require re-verification).</p>

        <div className="grid grid-cols-2 gap-4">
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new.email@example.com" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
          <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} placeholder="current password" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>
        <div className="flex gap-4 justify-end">
          <button onClick={() => changeEmail(newEmail, emailPassword)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">Change Email</button>
        </div>
      </div>

      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
        <div className="bg-gray-800/40 border border-red-700 rounded-lg p-6 space-y-4">
          <button onClick={() => alert('Export endpoint not implemented on backend')} className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg">Export My Data</button>

          <div className="space-y-2">
            <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter password to confirm" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
            <div className="flex gap-4 justify-end">
              <button onClick={() => { if (confirm('Cancel deletion?')) { /* noop */ } }} className="px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
              <button onClick={() => deleteAccount(deletePassword)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">Delete My Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- NotificationSection ---------------------- */
const NotificationSection = ({ formData, onChange, saveNotifications }) => {
  const ns = formData.notificationSettings || {};

  // render toggles for all keys except quietHours & emailDigest (handle separately)
  const toggles = [
    'newComments','newLikes','newSuggestions','joinRequests','approvals','storyViews','postEngagement'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>

      <div className="space-y-4">
        {toggles.map(key => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-sm text-gray-400">Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={!!ns[key]} onChange={(e) => onChange({ [key]: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-blue-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
            </label>
          </div>
        ))}

        {/* Email Digest */}
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <label className="block text-sm text-gray-400 mb-2">Email Digest</label>
          <select value={ns.emailDigest} onChange={(e) => onChange({ emailDigest: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Quiet Hours */}
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Quiet Hours</div>
              <div className="text-sm text-gray-400">Suppress notifications during this period</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={!!ns.quietHours?.enabled} onChange={(e) => onChange({ quietHours: { ...(ns.quietHours || {}), enabled: e.target.checked } })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-blue-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
            </label>
          </div>

          {ns.quietHours?.enabled && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <input type="time" value={ns.quietHours.start} onChange={(e) => onChange({ quietHours: { ...(ns.quietHours || {}), start: e.target.value } })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
              <input type="time" value={ns.quietHours.end} onChange={(e) => onChange({ quietHours: { ...(ns.quietHours || {}), end: e.target.value } })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={saveNotifications} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">Save Notifications</button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- PrivacySection (UI-only mapping) ---------------------- */
const PrivacySection = ({ formData, onChange }) => {
  const privacy = formData.privacySettings || {};
  const updatePrivacy = (patch) => onChange(patch);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Profile Visibility</h3>
        <p className="text-gray-400 text-sm">Control who can see your profile and personal information.</p>

        <div className="space-y-3">
          {["public", "private"].map(opt => (
            <label key={opt} className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer">
              <input type="radio" name="visibility" value={opt} checked={(privacy.profileVisibility || 'public') === opt} onChange={() => updatePrivacy({ profileVisibility: opt })} />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Activity Status</h3>
        <p className="text-gray-400 text-sm">Decide when others can see your online presence.</p>

        {[
          { key: "showOnlineStatus", title: "Show Online Status", desc: "Allow users to see when you are online." },
          { key: "showLastSeen", title: "Show Last Seen", desc: "Shows your last active timestamp." },
          { key: "showActivityInCommunities", title: "Community Activity", desc: "Display when you are active inside communities." },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={privacy[item.key] ?? true} onChange={(e) => updatePrivacy({ [item.key]: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Data Sharing</h3>
        <p className="text-gray-400 text-sm">Manage how your data is used for personalization and analytics.</p>

        {[
          { key: "personalizedAds", title: "Personalized Ads", desc: "Receive ads tailored to your activity." },
          { key: "analytics", title: "Analytics", desc: "Allow anonymous usage data collection." },
          { key: "partnerSharing", title: "Partner Data Sharing", desc: "Allow sharing data with trusted partners." },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={privacy.dataSharing?.[item.key] ?? true} onChange={(e) => updatePrivacy({ dataSharing: { ...(privacy.dataSharing || {}), [item.key]: e.target.checked } })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Blocked Users</h3>
        <p className="text-gray-400 text-sm">Users you have blocked will not be able to interact with you.</p>

        <div className="space-y-4">
          {(privacy.blockedUsers || []).map(user => (
            <div key={user.id} className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-gray-400">Blocked user</span>
              </div>
              <button onClick={() => updatePrivacy({ blockedUsers: (privacy.blockedUsers || []).filter(u => u.id !== user.id) })} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">Unblock</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------------- AppearanceSection ---------------------- */
const AppearanceSection = ({ formData, onChange }) => {
  // backend only stores theme in preferences, so we map to preferences.theme
  const appearance = formData.preferences || {};
  const updateAppearance = (patch) => onChange(patch);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Appearance</h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Theme Mode</h3>
        {["light","dark"].map(mode => (
          <label key={mode} className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer">
            <input type="radio" name="themeMode" value={mode} checked={(appearance.theme || 'light') === mode} onChange={() => updateAppearance({ theme: mode })} />
            <span className="capitalize">{mode}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

/* ---------------------- PreferencesSection ---------------------- */
const PreferencesSection = ({ formData, onChange, savePreferences }) => {
  const prefs = formData.preferences || {};
  const languages = ["en","es","fr","de","zh","ja","ar","hi"];
  const emailOptions = ["daily","weekly","monthly","never"];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Preferences</h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Language & Localization</h3>
        <p className="text-gray-400 text-sm">Customize how things appear based on your language and region.</p>

        <div>
          <label className="block text-sm mb-2 text-gray-400">Language</label>
          <select value={prefs.language} onChange={(e) => onChange({ language: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
            {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-400">Date Format</label>
          <select value={prefs.dateFormat || 'MM/DD/YYYY'} onChange={(e) => onChange({ dateFormat: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY/MM/DD">YYYY/MM/DD</option>
          </select>
        </div>
      </div>

      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Theme & Display</h3>

        <div className="space-y-3">
          <label className="block text-sm text-gray-400">Theme Mode</label>
          {["light","dark","system"].map(theme => (
            <label key={theme} className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer">
              <input type="radio" name="theme" value={theme} checked={(prefs.theme || 'light') === theme} onChange={() => onChange({ theme })} />
              <span className="capitalize">{theme}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Font Size</label>
          <select value={prefs.fontSize || 'medium'} onChange={(e) => onChange({ fontSize: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button onClick={savePreferences} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">Save Preferences</button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- SavedSection ---------------------- */
const SavedSection = ({ formData, onChange }) => {
  const tabs = ["ideas", "startups", "posts", "resources", "archived"];
  const [activeTab, setActiveTab] = useState("ideas");
  const saved = formData.savedItems || { ideas: [], startups: [], posts: [], resources: [], archived: [] };

  const handleUnsave = (id) => {
    onChange({ [activeTab]: saved[activeTab].filter(item => item.id !== id) });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Saved Items</h2>
      <div className="flex gap-4 border-b border-gray-700 pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700"}`}>{tab.replace(/_/g,' ')}</button>
        ))}
      </div>

      <div className="space-y-4">
        {saved[activeTab].length === 0 ? <div className="text-center py-10 text-gray-500">No saved {activeTab} yet.</div> : saved[activeTab].map(item => (
          <div key={item.id} className="bg-gray-700/40 border border-gray-600 rounded-xl p-4 flex gap-4">
            <div className="w-20 h-20 rounded-lg bg-gray-600 overflow-hidden">
              {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" alt="thumb" /> : <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>}
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <span className="text-sm text-gray-400">{item.dateSaved}</span>
              </div>
              <div className="text-gray-400 text-sm capitalize">{item.type}</div>
              <div className="flex gap-2 mt-2 flex-wrap">{item.tags?.map((t,i) => <span key={i} className="text-xs bg-gray-600 px-2 py-1 rounded-lg text-gray-300">{t}</span>)}</div>

              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg"><ExternalLink size={14} /> Open</button>
                <button onClick={() => handleUnsave(item.id)} className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg"><Trash2 size={14} /> Unsave</button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg"><Share2 size={14} /> Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSettings;
