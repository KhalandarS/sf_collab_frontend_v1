// ProfileSettings.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe, Bookmark, ExternalLink, Trash2, Share2  } from 'lucide-react';


const ProfileSettings = ({ userData, onBack }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState(userData);

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accountSecurity', label: 'AccountSecurity', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'saved', label: 'Saved Items', icon: Bookmark }
  ];

  const handleSave = () => {
    // Save logic here
    console.log('Saving:', formData);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection formData={formData} onChange={setFormData} />;
      case 'accountSecurity':
        return <AccountSecurity formData={formData} onChange={setFormData} />;  
      case 'notifications':
        return <NotificationSection formData={formData} onChange={setFormData} />;
      case 'privacy':
        return <PrivacySection formData={formData} onChange={setFormData} />;
      case 'appearance':
        return <AppearanceSection formData={formData} onChange={setFormData} />;
      case 'preferences':
        return <PreferencesSection formData={formData} onChange={setFormData} />;
      case 'saved':
        return <SavedSection formData={formData} onChange={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
              {renderSectionContent()}
              
              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
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

// Individual Section Components
const ProfileSection = ({ formData, onChange }) => {
  // Full country list (you can expand later)
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Nigeria",
    "Ghana", "Kenya", "South Africa", "Germany", "France", "Spain",
    "Italy", "China", "Japan", "India", "Brazil", "Mexico"
  ];

  const timezones = Intl.supportedValuesOf("timeZone");

  // Handle profile picture upload
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        ...formData,
        profile: { ...formData.profile, picture: reader.result }
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {/* ---------------------- PROFILE PICTURE ---------------------- */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
            {formData.profile.picture ? (
              <img
                src={formData.profile.picture}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-400 text-sm h-full">
                No image
              </div>
            )}
          </div>

          <label className="px-4 py-2 bg-gray-700 rounded-lg cursor-pointer">
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          {formData.profile.picture && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...formData,
                  profile: { ...formData.profile, picture: "" }
                })
              }
              className="px-4 py-2 bg-red-600 rounded-lg"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* ---------------------- IDENTITY SECTION ---------------------- */}
      <div className="grid grid-cols-2 gap-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              onChange({ ...formData, firstName: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              onChange({ ...formData, lastName: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          />
        </div>

        {/* EMAIL (READ-ONLY) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email (read-only)
          </label>
          <input
            type="text"
            value={formData.email}
            readOnly
            className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3"
          />
        </div>

        {/* STATUS (READ-ONLY) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Account Status
          </label>
          <input
            type="text"
            value={formData.status}
            readOnly
            className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3 capitalize"
          />
        </div>
      </div>

      {/* ---------------------- BIO ---------------------- */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Bio
        </label>
        <textarea
          value={formData.profile.bio}
          onChange={(e) =>
            onChange({
              ...formData,
              profile: { ...formData.profile, bio: e.target.value }
            })
          }
          rows={4}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
        />
      </div>

      {/* ---------------------- COMPANY + CITY ---------------------- */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.profile.company}
            onChange={(e) =>
              onChange({
                ...formData,
                profile: { ...formData.profile, company: e.target.value }
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.profile.city}
            onChange={(e) =>
              onChange({
                ...formData,
                profile: { ...formData.profile, city: e.target.value }
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          />
        </div>
      </div>

      {/* ---------------------- COUNTRY + TIMEZONE ---------------------- */}
      <div className="grid grid-cols-2 gap-6">

        {/* COUNTRY SELECT */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Country
          </label>
          <select
            value={formData.profile.country}
            onChange={(e) =>
              onChange({
                ...formData,
                profile: { ...formData.profile, country: e.target.value }
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* TIMEZONE SELECT */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Timezone
          </label>
          <select
            value={formData.profile.timezone}
            onChange={(e) =>
              onChange({
                ...formData,
                profile: { ...formData.profile, timezone: e.target.value }
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            <option value="">Select timezone</option>
            {timezones.map((tz) => (
              <option key={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------------------- SOCIAL LINKS ---------------------- */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Social Links
        </label>

        <div className="grid grid-cols-2 gap-4">
          {[
            "linkedin",
            "twitter",
            "github",
            "portfolio",
            "facebook",
            "instagram",
            "youtube",
            "dribbble",
            "behance"
          ].map((platform) => (
            <input
              key={platform}
              type="text"
              placeholder={platform}
              value={formData.profile.socials?.[platform] || ""}
              onChange={(e) =>
                onChange({
                  ...formData,
                  profile: {
                    ...formData.profile,
                    socials: {
                      ...formData.profile.socials,
                      [platform]: e.target.value
                    }
                  }
                })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 capitalize"
            />
          ))}
        </div>
      </div>
    </div>
  );
};



const AccountSecurity = ({ formData, onChange }) => {
  const security = formData.accountSecurity || {};

  const [show2FAQR, setShow2FAQR] = React.useState(false);
  const [showBackupCodes, setShowBackupCodes] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false); // for modal


  // Toggle password visibility states
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Initialize empty structure if missing
  const updateSecurity = (data) => {
    onChange({
      ...formData,
      accountSecurity: {
        password: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: false,
        backupCodes: [],
        sessions: [],
        connectedAccounts: {
          google: false,
          github: false,
          linkedin: false,
        },
        ...security,
        ...data,
      },
    });
  };

  const canSave =
    security.newPassword &&
    security.confirmPassword &&
    security.newPassword.length >= 8 &&
    security.newPassword === security.confirmPassword;

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Account & Security</h2>

      {/* ---------------- PASSWORD MANAGEMENT ---------------- */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Password</h3>
        <p className="text-gray-400 text-sm">
          Manage your login password. Choose a strong, unique password.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* -------- CURRENT PASSWORD -------- */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={security.password || ""}
                onChange={(e) => updateSecurity({ password: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-300"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* -------- FORGOT PASSWORD -------- */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => alert("Reset email sent!")}
              className="text-blue-400 underline text-sm"
            >
              Forgot password?
            </button>
          </div>

          {/* -------- NEW PASSWORD -------- */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={security.newPassword || ""}
                onChange={(e) =>
                  updateSecurity({ newPassword: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-300"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* -------- CONFIRM PASSWORD -------- */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={security.confirmPassword || ""}
                onChange={(e) =>
                  updateSecurity({ confirmPassword: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-300"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

        </div>

        {/* Requirements */}
        <div className="text-sm text-gray-400 space-y-1">
          <div>
            {security.newPassword?.length < 8 ? (
              <span className="text-red-400">• Must be at least 8 characters</span>
            ) : (
              <span className="text-green-400">• Length OK</span>
            )}
          </div>
          <div>
            {security.newPassword !== security.confirmPassword ? (
              <span className="text-red-400">• Passwords do not match</span>
            ) : (
              <span className="text-green-400">• Passwords match</span>
            )}
          </div>
        </div>

        <button
          disabled={!canSave}
          onClick={() => alert("Password updated.")}
          className={`px-6 py-3 rounded-lg mt-4 transition-colors ${
            canSave
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 cursor-not-allowed text-gray-400"
          }`}
        >
          Update Password
        </button>
      </div>
      {/* ------------------------ 2FA SECTION ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Two-Factor Authentication (2FA)</h3>
        <p className="text-gray-400 text-sm">
          Add an extra layer of security to your account by requiring a code during login.
        </p>

        {/* Toggle 2FA */}
        <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
          <div>
            <div className="font-medium">Enable 2FA</div>
            <div className="text-sm text-gray-400">Use an authenticator app</div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={security.twoFactorEnabled || false}
              onChange={(e) => updateSecurity({ twoFactorEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
              peer-checked:after:translate-x-full after:content-[''] after:absolute 
              after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
              after:rounded-full after:transition-all">
            </div>
          </label>
        </div>

        {/* QR Enrollment */}
        {security.twoFactorEnabled && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 space-y-4">
            <button
              onClick={() => setShow2FAQR(!show2FAQR)}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {show2FAQR ? "Hide QR Code" : "Show QR Code"}
            </button>

            {show2FAQR && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 bg-white rounded-md flex items-center justify-center text-black">
                  QR CODE
                </div>

                <p className="text-sm text-gray-400">
                  Scan this QR with your authenticator app.
                </p>
              </div>
            )}

            {/* Backup Codes */}
            <button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 w-fit"
            >
              {showBackupCodes ? "Hide Backup Codes" : "View Backup Codes"}
            </button>

            {showBackupCodes && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
                {(security.backupCodes?.length
                  ? security.backupCodes
                  : ["F4K2-92N1", "J29D-11DK", "PL92-A0QX", "W82M-X2DD"]
                ).map((code, idx) => (
                  <div
                    key={idx}
                    className="font-mono bg-gray-800 px-3 py-2 rounded-lg text-sm"
                  >
                    {code}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* ------------------------ ACTIVE SESSIONS ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Active Sessions</h3>
        <p className="text-gray-400 text-sm">
          These devices are currently logged into your account.
        </p>

        <div className="space-y-4">
          {(security.sessions?.length
            ? security.sessions
            : [
                {
                  browser: "Chrome",
                  ip: "192.168.1.120",
                  location: "Lagos, Nigeria",
                  lastActive: "2 hours ago",
                },
              ]
          ).map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
            >
              <div className="space-y-1">
                <div className="font-medium">{session.browser}</div>
                <div className="text-sm text-gray-400">
                  {session.ip} • {session.location}
                </div>
                <div className="text-xs text-gray-500">
                  Last active: {session.lastActive}
                </div>
              </div>

              <button
                onClick={() => {
                  const newSessions = (security.sessions || []).filter((_, i) => i !== index);
                  updateSecurity({ sessions: newSessions });
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* ------------------------ CONNECTED ACCOUNTS ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Connected Accounts</h3>
        <p className="text-gray-400 text-sm">
          Manage login connections with third-party providers.
        </p>

        <div className="space-y-4">
          {["google", "github", "linkedin"].map((provider) => (
            <div
              key={provider}
              className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
            >
              <div className="capitalize font-medium">{provider}</div>

              {security.connectedAccounts?.[provider] ? (
                <button
                  onClick={() =>
                    updateSecurity({
                      connectedAccounts: {
                        ...security.connectedAccounts,
                        [provider]: false,
                      },
                    })
                  }
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateSecurity({
                      connectedAccounts: {
                        ...security.connectedAccounts,
                        [provider]: true,
                      },
                    })
                  }
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* ------------------------ DANGER ZONE ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>

        <div className="bg-gray-800/40 border border-red-700 rounded-lg p-6 space-y-4">

          {/* Export Data */}
          <button
            onClick={() => alert("Data exported!")}
            className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Export My Data
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Delete My Account
          </button>

          {/* Modal */}
          {deleteOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
              <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4">
                <h3 className="text-xl font-bold">Are you sure?</h3>
                <p className="text-gray-400">
                  This action is permanent and cannot be undone.
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteOpen(false)}
                    className="px-4 py-2 bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => alert("Account deleted")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>




    </div>
  );
};


const NotificationSection = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
    
    <div className="space-y-4">
      {Object.entries(formData.notificationSettings).map(([key, value]) => {
        if (key === 'quietHours') return null;
        if (key === 'emailDigest') return null;
        
        return (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <div className="font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-sm text-gray-400">
                Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange({
                  ...formData,
                  notificationSettings: {
                    ...formData.notificationSettings,
                    [key]: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        );
      })}
    </div>
  </div>
);

const PrivacySection = ({ formData, onChange }) => {
  const privacy = formData.privacySettings || {};

  const updatePrivacy = (data) => {
    onChange({
      ...formData,
      privacySettings: {
        profileVisibility: "public",
        showOnlineStatus: true,
        showLastSeen: true,
        showActivityInCommunities: true,
        dataSharing: {
          personalizedAds: true,
          analytics: true,
          partnerSharing: false,
        },
        blockedUsers: [
          { id: 1, name: "Michael Doe" },
          { id: 2, name: "Jane Adams" },
        ],
        ...privacy,
        ...data,
      },
    });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

      {/* ------------------------ A. PROFILE VISIBILITY ------------------------ */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Profile Visibility</h3>
        <p className="text-gray-400 text-sm">
          Control who can see your profile and personal information.
        </p>

        <div className="space-y-3">
          {["public", "private", "followers"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
            >
              <input
                type="radio"
                name="visibility"
                value={opt}
                checked={privacy.profileVisibility === opt}
                onChange={() => updatePrivacy({ profileVisibility: opt })}
              />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ------------------------ B. ACTIVITY STATUS ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Activity Status</h3>
        <p className="text-gray-400 text-sm">
          Decide when others can see your online presence.
        </p>

        {[
          {
            key: "showOnlineStatus",
            title: "Show Online Status",
            desc: "Allow users to see when you are online.",
          },
          {
            key: "showLastSeen",
            title: "Show Last Seen",
            desc: "Shows your last active timestamp.",
          },
          {
            key: "showActivityInCommunities",
            title: "Community Activity",
            desc: "Display when you are active inside communities.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy[item.key] ?? true}
                onChange={(e) =>
                  updatePrivacy({ [item.key]: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
                peer-checked:after:translate-x-full after:content-[''] after:absolute 
                after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
                after:rounded-full after:transition-all">
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* ------------------------ C. DATA SHARING CONTROLS ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Data Sharing</h3>
        <p className="text-gray-400 text-sm">
          Manage how your data is used for personalization and analytics.
        </p>

        {[
          {
            key: "personalizedAds",
            title: "Personalized Ads",
            desc: "Receive ads tailored to your activity.",
          },
          {
            key: "analytics",
            title: "Analytics",
            desc: "Allow anonymous usage data collection.",
          },
          {
            key: "partnerSharing",
            title: "Partner Data Sharing",
            desc: "Allow sharing data with trusted partners.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.dataSharing?.[item.key] ?? true}
                onChange={(e) =>
                  updatePrivacy({
                    dataSharing: {
                      ...privacy.dataSharing,
                      [item.key]: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
                peer-checked:after:translate-x-full after:content-[''] after:absolute 
                after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
                after:rounded-full after:transition-all">
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* ------------------------ D. BLOCKED USERS ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Blocked Users</h3>
        <p className="text-gray-400 text-sm">
          Users you have blocked will not be able to interact with you.
        </p>

        <div className="space-y-4">
          {(privacy.blockedUsers || []).map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-gray-400">Blocked user</span>
              </div>

              <button
                onClick={() => {
                  const updated = privacy.blockedUsers.filter(
                    (u) => u.id !== user.id
                  );
                  updatePrivacy({ blockedUsers: updated });
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const AppearanceSection = ({ formData, onChange }) => {
  const appearance = formData.appearanceSettings || {};

  const updateAppearance = (data) => {
    onChange({
      ...formData,
      appearanceSettings: {
        themeMode: "dark",
        accentColor: "blue",
        layout: "comfortable",
        density: "normal",
        animations: true,
        reduceMotion: false,
        cardRadius: "rounded",
        cardShadow: "medium",
        ...appearance,
        ...data,
      },
    });
  };

  const accentColors = ["blue", "red", "green", "purple", "yellow", "pink", "orange", "cyan"];
  const layoutOptions = ["compact", "comfortable", "spacious"];
  const densityOptions = ["normal", "dense"];
  const shadowOptions = ["none", "light", "medium", "heavy"];
  const radiusOptions = ["rounded", "sharp"];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Appearance</h2>

      {/* ------------------------ A. THEME MODE ------------------------ */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Theme Mode</h3>

        {["light", "dark", "system"].map((mode) => (
          <label
            key={mode}
            className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
          >
            <input
              type="radio"
              name="themeMode"
              value={mode}
              checked={appearance.themeMode === mode}
              onChange={() => updateAppearance({ themeMode: mode })}
            />
            <span className="capitalize">{mode}</span>
          </label>
        ))}
      </div>

      {/* ------------------------ B. ACCENT COLOR ------------------------ */}
      <div className="space-y-3 pt-10">
        <h3 className="text-xl font-semibold">Accent Color</h3>

        <div className="grid grid-cols-8 gap-3">
          {accentColors.map((c) => (
            <div
              key={c}
              className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                appearance.accentColor === c ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => updateAppearance({ accentColor: c })}
            />
          ))}
        </div>
      </div>

      {/* ------------------------ C. APP LAYOUT ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">App Layout</h3>

        <select
          value={appearance.layout}
          onChange={(e) => updateAppearance({ layout: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
        >
          {layoutOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* ------------------------ D. UI DENSITY ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">UI Density</h3>

        {densityOptions.map((density) => (
          <label
            key={density}
            className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
          >
            <input
              type="radio"
              name="uiDensity"
              value={density}
              checked={appearance.density === density}
              onChange={() => updateAppearance({ density })}
            />
            <span className="capitalize">{density}</span>
          </label>
        ))}
      </div>

      {/* ------------------------ E. ANIMATIONS & MOTION ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Animations & Motion</h3>

        {/* Enable Animations */}
        <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
          <div>
            <div className="font-medium">Enable Animations</div>
            <div className="text-sm text-gray-400">Smooth transitions & motion effects.</div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appearance.animations}
              onChange={(e) => updateAppearance({ animations: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600
              peer-checked:after:translate-x-full after:content-[''] after:absolute 
              after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5
              after:rounded-full after:transition-all">
            </div>
          </label>
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
          <div>
            <div className="font-medium">Reduce Motion</div>
            <div className="text-sm text-gray-400">
              Turn off complex animations for accessibility.
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appearance.reduceMotion}
              onChange={(e) => updateAppearance({ reduceMotion: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600
              peer-checked:after:translate-x-full after:content-[''] after:absolute 
              after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5
              after:rounded-full after:transition-all">
            </div>
          </label>
        </div>
      </div>

      {/* ------------------------ F. CARD & COMPONENT STYLE ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Card & Component Style</h3>

        {/* Radius */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Card Corners</label>
          <select
            value={appearance.cardRadius}
            onChange={(e) => updateAppearance({ cardRadius: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {radiusOptions.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Shadow */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Card Shadow</label>
          <select
            value={appearance.cardShadow}
            onChange={(e) => updateAppearance({ cardShadow: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {shadowOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};


const PreferencesSection = ({ formData, onChange }) => {
  const prefs = formData.preferencesSettings || {};

  const updatePrefs = (data) => {
    onChange({
      ...formData,
      preferencesSettings: {
        language: "en",
        timezone: "America/Los_Angeles",
        dateFormat: "MM/DD/YYYY",
        theme: "dark",
        accentColor: "blue",
        fontSize: "medium",
        safeMode: true,
        autoPlay: false,
        suggestedContent: true,
        personalizedFeed: true,
        emailFrequency: "weekly",
        messageRequests: "everyone",
        allowDMs: "everyone",
        dashboardDefaultTab: "overview",
        showAdvancedMetrics: true,
        experimentalFeatures: false,
        ...prefs,
        ...data,
      },
    });
  };

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Arabic",
    "Hindi",
  ];

  const emailOptions = ["daily", "weekly", "monthly", "never"];

  const messageRequestOptions = [
    "everyone",
    "followers",
    "no_one"
  ];

  const fontSizes = ["small", "medium", "large"];

  const tabs = ["overview", "tasks", "team", "activity"];

  const accentColors = ["blue", "red", "green", "purple", "yellow", "pink"];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Preferences</h2>

      {/* ------------------------ A. LANGUAGE & LOCALIZATION ------------------------ */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Language & Localization</h3>
        <p className="text-gray-400 text-sm">
          Customize how things appear based on your language and region.
        </p>

        {/* Language */}
        <div>
          <label className="block text-sm mb-2 text-gray-400">Language</label>
          <select
            value={prefs.language}
            onChange={(e) => updatePrefs({ language: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm mb-2 text-gray-400">Date Format</label>
          <select
            value={prefs.dateFormat}
            onChange={(e) => updatePrefs({ dateFormat: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY/MM/DD">YYYY/MM/DD</option>
          </select>
        </div>
      </div>

      {/* ------------------------ B. THEME & DISPLAY ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Theme & Display</h3>

        {/* Theme Mode */}
        <div className="space-y-3">
          <label className="block text-sm text-gray-400">Theme Mode</label>

          {["light", "dark", "system"].map((theme) => (
            <label
              key={theme}
              className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
            >
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={prefs.theme === theme}
                onChange={() => updatePrefs({ theme })}
              />
              <span className="capitalize">{theme}</span>
            </label>
          ))}
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
          <div className="grid grid-cols-6 gap-3">
            {accentColors.map((c) => (
              <div
                key={c}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                  prefs.accentColor === c ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => updatePrefs({ accentColor: c })}
              />
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Font Size</label>
          <select
            value={prefs.fontSize}
            onChange={(e) => updatePrefs({ fontSize: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------ C. CONTENT PREFERENCES ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Content Preferences</h3>

        {[
          {
            key: "safeMode",
            title: "Safe Mode",
            desc: "Filter sensitive or mature content.",
          },
          {
            key: "autoPlay",
            title: "Auto-Play Videos",
            desc: "Automatically play videos in the feed.",
          },
          {
            key: "suggestedContent",
            title: "Suggested Content",
            desc: "Show recommended posts based on activity.",
          },
          {
            key: "personalizedFeed",
            title: "Personalized Feed",
            desc: "Customize feed based on your interests.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={prefs[item.key] ?? true}
                onChange={(e) =>
                  updatePrefs({ [item.key]: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
                peer-checked:after:translate-x-full after:content-[''] after:absolute 
                after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
                after:rounded-full after:transition-all">
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* ------------------------ D. COMMUNICATION PREFERENCES ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Communication Preferences</h3>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Email Frequency</label>
          <select
            value={prefs.emailFrequency}
            onChange={(e) => updatePrefs({ emailFrequency: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {emailOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Message Requests */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Message Requests</label>
          <select
            value={prefs.messageRequests}
            onChange={(e) => updatePrefs({ messageRequests: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {messageRequestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace("_", " ").replace("no one", "No one")}
              </option>
            ))}
          </select>
        </div>

        {/* Allow DMs */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Allow Direct Messages From</label>
          <select
            value={prefs.allowDMs}
            onChange={(e) => updatePrefs({ allowDMs: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="no_one">No one</option>
          </select>
        </div>
      </div>

      {/* ------------------------ E. STARTUP DASHBOARD PREFERENCES ------------------------ */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold">Startup Dashboard</h3>

        {/* Default tab */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Default Tab</label>
          <select
            value={prefs.dashboardDefaultTab}
            onChange={(e) => updatePrefs({ dashboardDefaultTab: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
          >
            {tabs.map((t) => (
              <option key={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        {[
          {
            key: "showAdvancedMetrics",
            title: "Advanced Metrics",
            desc: "Display detailed analytics in your dashboard.",
          },
          {
            key: "experimentalFeatures",
            title: "Experimental Features",
            desc: "Test early-stage features before public release.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={prefs[item.key] ?? false}
                onChange={(e) => updatePrefs({ [item.key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
                peer-checked:after:translate-x-full after:content-[''] after:absolute 
                after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
                after:rounded-full after:transition-all">
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};



const SavedSection = ({ formData, onChange }) => {
  const tabs = ["ideas", "startups", "posts", "resources", "archived"];
  const [activeTab, setActiveTab] = useState("ideas");

  const saved = formData.savedItems || {
    ideas: [],
    startups: [],
    posts: [],
    resources: [],
    archived: []
  };

  const updateSaved = (data) => {
    onChange({
      ...formData,
      savedItems: {
        ...saved,
        ...data
      }
    });
  };

  const handleUnsave = (id) => {
    updateSaved({
      [activeTab]: saved[activeTab].filter((item) => item.id !== id)
    });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Saved Items</h2>

      {/* ------------------ TABS ------------------ */}
      <div className="flex gap-4 border-b border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* ------------------ TAB CONTENT ------------------ */}
      <div className="space-y-4">
        {saved[activeTab].length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No saved {activeTab} yet.
          </div>
        ) : (
          saved[activeTab].map((item) => (
            <div
              key={item.id}
              className="bg-gray-700/40 border border-gray-600 rounded-xl p-4 flex gap-4"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg bg-gray-600 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <span className="text-sm text-gray-400">
                    {item.dateSaved}
                  </span>
                </div>

                <div className="text-gray-400 text-sm capitalize">
                  {item.type}
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {item.tags?.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-600 px-2 py-1 rounded-lg text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg">
                    <ExternalLink size={14} /> Open
                  </button>

                  <button
                    onClick={() => handleUnsave(item.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg"
                  >
                    <Trash2 size={14} /> Unsave
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};




export default ProfileSettings;