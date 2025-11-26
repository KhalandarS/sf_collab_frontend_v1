// ProfileSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe } from 'lucide-react';

const ProfileSettings = ({ userData, onBack }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState(userData);

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleSave = () => {
    // Save logic here
    console.log('Saving:', formData);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection formData={formData} onChange={setFormData} />;
      case 'notifications':
        return <NotificationSection formData={formData} onChange={setFormData} />;
      case 'privacy':
        return <PrivacySection formData={formData} onChange={setFormData} />;
      case 'appearance':
        return <AppearanceSection formData={formData} onChange={setFormData} />;
      case 'preferences':
        return <PreferencesSection formData={formData} onChange={setFormData} />;
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
const ProfileSection = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
    
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => onChange({...formData, firstName: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => onChange({...formData, lastName: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
      <textarea
        value={formData.profile.bio}
        onChange={(e) => onChange({
          ...formData, 
          profile: {...formData.profile, bio: e.target.value}
        })}
        rows={4}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
        <input
          type="text"
          value={formData.profile.company}
          onChange={(e) => onChange({
            ...formData, 
            profile: {...formData.profile, company: e.target.value}
          })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
        <input
          type="text"
          value={formData.profile.city}
          onChange={(e) => onChange({
            ...formData, 
            profile: {...formData.profile, city: e.target.value}
          })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
);

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

const PrivacySection = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
    {/* Privacy settings content */}
  </div>
);

const AppearanceSection = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-6">Appearance</h2>
    {/* Appearance settings content */}
  </div>
);

const PreferencesSection = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-6">Preferences</h2>
    {/* Preferences settings content */}
  </div>
);

export default ProfileSettings;