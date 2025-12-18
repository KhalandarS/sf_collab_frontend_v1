// // ProfileSettings.jsx
// import React, { useState } from 'react';
// import { Eye, EyeOff } from "lucide-react";
// import { motion } from 'framer-motion';
// import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe, Bookmark, ExternalLink, Trash2, Share2  } from 'lucide-react';


// const ProfileSettings = ({ userData, onBack }) => {
//   const [activeSection, setActiveSection] = useState('profile');
//   const [formData, setFormData] = useState(userData);

//   const sections = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'accountSecurity', label: 'AccountSecurity', icon: User },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     { id: 'privacy', label: 'Privacy', icon: Shield },
//     { id: 'appearance', label: 'Appearance', icon: Palette },
//     { id: 'preferences', label: 'Preferences', icon: Globe },
//     { id: 'saved', label: 'Saved Items', icon: Bookmark }
//   ];

//   const handleSave = () => {
//     // Save logic here
//     console.log('Saving:', formData);
//   };

//   const renderSectionContent = () => {
//     switch (activeSection) {
//       case 'profile':
//         return <ProfileSection formData={formData} onChange={setFormData} />;
//       case 'accountSecurity':
//         return <AccountSecurity formData={formData} onChange={setFormData} />;  
//       case 'notifications':
//         return <NotificationSection formData={formData} onChange={setFormData} />;
//       case 'privacy':
//         return <PrivacySection formData={formData} onChange={setFormData} />;
//       case 'appearance':
//         return <AppearanceSection formData={formData} onChange={setFormData} />;
//       case 'preferences':
//         return <PreferencesSection formData={formData} onChange={setFormData} />;
//       case 'saved':
//         return <SavedSection formData={formData} onChange={setFormData} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <button
//             onClick={onBack}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Profile
//           </button>
//           <h1 className="text-3xl font-bold">Settings</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
//               <nav className="space-y-2">
//                 {sections.map((section) => (
//                   <button
//                     key={section.id}
//                     onClick={() => setActiveSection(section.id)}
//                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
//                       activeSection === section.id
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-400 hover:text-white hover:bg-gray-700'
//                     }`}
//                   >
//                     <section.icon className="w-4 h-4" />
//                     {section.label}
//                   </button>
//                 ))}
//               </nav>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
//               {renderSectionContent()}
              
//               {/* Save Button */}
//               <div className="flex justify-end pt-6 border-t border-gray-700">
//                 <button
//                   onClick={handleSave}
//                   className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
//                 >
//                   <Save className="w-4 h-4" />
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Individual Section Components
// const ProfileSection = ({ formData, onChange }) => {
//   // Full country list (you can expand later)
//   const countries = [
//     "United States", "United Kingdom", "Canada", "Australia", "Nigeria",
//     "Ghana", "Kenya", "South Africa", "Germany", "France", "Spain",
//     "Italy", "China", "Japan", "India", "Brazil", "Mexico"
//   ];

//   const timezones = Intl.supportedValuesOf("timeZone");

//   // Handle profile picture upload
//   const handleImage = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       onChange({
//         ...formData,
//         profile: { ...formData.profile, picture: reader.result }
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="space-y-10">
//       <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

//       {/* ---------------------- PROFILE PICTURE ---------------------- */}
//       <div>
//         <label className="block text-sm font-medium text-gray-400 mb-2">
//           Profile Picture
//         </label>
//         <div className="flex items-center gap-4">
//           <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
//             {formData.profile.picture ? (
//               <img
//                 src={formData.profile.picture}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="flex items-center justify-center text-gray-400 text-sm h-full">
//                 No image
//               </div>
//             )}
//           </div>

//           <label className="px-4 py-2 bg-gray-700 rounded-lg cursor-pointer">
//             Upload
//             <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
//           </label>

//           {formData.profile.picture && (
//             <button
//               type="button"
//               onClick={() =>
//                 onChange({
//                   ...formData,
//                   profile: { ...formData.profile, picture: "" }
//                 })
//               }
//               className="px-4 py-2 bg-red-600 rounded-lg"
//             >
//               Remove
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ---------------------- IDENTITY SECTION ---------------------- */}
//       <div className="grid grid-cols-2 gap-6">
        
//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             First Name
//           </label>
//           <input
//             type="text"
//             value={formData.firstName}
//             onChange={(e) =>
//               onChange({ ...formData, firstName: e.target.value })
//             }
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             Last Name
//           </label>
//           <input
//             type="text"
//             value={formData.lastName}
//             onChange={(e) =>
//               onChange({ ...formData, lastName: e.target.value })
//             }
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           />
//         </div>

//         {/* EMAIL (READ-ONLY) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             Email (read-only)
//           </label>
//           <input
//             type="text"
//             value={formData.email}
//             readOnly
//             className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3"
//           />
//         </div>

//         {/* STATUS (READ-ONLY) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             Account Status
//           </label>
//           <input
//             type="text"
//             value={formData.status}
//             readOnly
//             className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3 capitalize"
//           />
//         </div>
//       </div>

//       {/* ---------------------- BIO ---------------------- */}
//       <div>
//         <label className="block text-sm font-medium text-gray-400 mb-2">
//           Bio
//         </label>
//         <textarea
//           value={formData.profile.bio}
//           onChange={(e) =>
//             onChange({
//               ...formData,
//               profile: { ...formData.profile, bio: e.target.value }
//             })
//           }
//           rows={4}
//           className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//         />
//       </div>

//       {/* ---------------------- COMPANY + CITY ---------------------- */}
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             Company
//           </label>
//           <input
//             type="text"
//             value={formData.profile.company}
//             onChange={(e) =>
//               onChange({
//                 ...formData,
//                 profile: { ...formData.profile, company: e.target.value }
//               })
//             }
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             City
//           </label>
//           <input
//             type="text"
//             value={formData.profile.city}
//             onChange={(e) =>
//               onChange({
//                 ...formData,
//                 profile: { ...formData.profile, city: e.target.value }
//               })
//             }
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           />
//         </div>
//       </div>

//       {/* ---------------------- COUNTRY + TIMEZONE ---------------------- */}
//       <div className="grid grid-cols-2 gap-6">

//         {/* COUNTRY SELECT */}
//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             Country
//           </label>
//           <select
//             value={formData.profile.country}
//             onChange={(e) =>
//               onChange({
//                 ...formData,
//                 profile: { ...formData.profile, country: e.target.value }
//               })
//             }
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             <option value="">Select country</option>
//             {countries.map((c) => (
//               <option key={c}>{c}</option>
//             ))}
//           </select>
//         </div>

//         {/* TIMEZONE SELECT */}
//         <div>
//           <label className="block text-sm font-medium text-gray-400 mb-2">
//             Timezone
//           </label>
//           <select
//             value={formData.profile.timezone}
//             onChange={(e) =>
//               onChange({
//                 ...formData,
//                 profile: { ...formData.profile, timezone: e.target.value }
//               })
//             }
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             <option value="">Select timezone</option>
//             {timezones.map((tz) => (
//               <option key={tz}>{tz}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ---------------------- SOCIAL LINKS ---------------------- */}
//       <div>
//         <label className="block text-sm font-medium text-gray-400 mb-2">
//           Social Links
//         </label>

//         <div className="grid grid-cols-2 gap-4">
//           {[
//             "linkedin",
//             "twitter",
//             "github",
//             "portfolio",
//             "facebook",
//             "instagram",
//             "youtube",
//             "dribbble",
//             "behance"
//           ].map((platform) => (
//             <input
//               key={platform}
//               type="text"
//               placeholder={platform}
//               value={formData.profile.socials?.[platform] || ""}
//               onChange={(e) =>
//                 onChange({
//                   ...formData,
//                   profile: {
//                     ...formData.profile,
//                     socials: {
//                       ...formData.profile.socials,
//                       [platform]: e.target.value
//                     }
//                   }
//                 })
//               }
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 capitalize"
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };



// const AccountSecurity = ({ formData, onChange }) => {
//   const security = formData.accountSecurity || {};

//   const [show2FAQR, setShow2FAQR] = React.useState(false);
//   const [showBackupCodes, setShowBackupCodes] = React.useState(false);
//   const [deleteOpen, setDeleteOpen] = React.useState(false); // for modal


//   // Toggle password visibility states
//   const [showCurrent, setShowCurrent] = React.useState(false);
//   const [showNew, setShowNew] = React.useState(false);
//   const [showConfirm, setShowConfirm] = React.useState(false);

//   // Initialize empty structure if missing
//   const updateSecurity = (data) => {
//     onChange({
//       ...formData,
//       accountSecurity: {
//         password: "",
//         newPassword: "",
//         confirmPassword: "",
//         twoFactorEnabled: false,
//         backupCodes: [],
//         sessions: [],
//         connectedAccounts: {
//           google: false,
//           github: false,
//           linkedin: false,
//         },
//         ...security,
//         ...data,
//       },
//     });
//   };

//   const canSave =
//     security.newPassword &&
//     security.confirmPassword &&
//     security.newPassword.length >= 8 &&
//     security.newPassword === security.confirmPassword;

//   return (
//     <div className="space-y-10">
//       <h2 className="text-2xl font-bold mb-6">Account & Security</h2>

//       {/* ---------------- PASSWORD MANAGEMENT ---------------- */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold">Password</h3>
//         <p className="text-gray-400 text-sm">
//           Manage your login password. Choose a strong, unique password.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           {/* -------- CURRENT PASSWORD -------- */}
//           <div>
//             <label className="block text-sm mb-2 text-gray-400">
//               Current Password
//             </label>

//             <div className="relative">
//               <input
//                 type={showCurrent ? "text" : "password"}
//                 value={security.password || ""}
//                 onChange={(e) => updateSecurity({ password: e.target.value })}
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowCurrent(!showCurrent)}
//                 className="absolute right-3 top-3 text-gray-300"
//               >
//                 {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* -------- FORGOT PASSWORD -------- */}
//           <div className="flex items-end">
//             <button
//               type="button"
//               onClick={() => alert("Reset email sent!")}
//               className="text-blue-400 underline text-sm"
//             >
//               Forgot password?
//             </button>
//           </div>

//           {/* -------- NEW PASSWORD -------- */}
//           <div>
//             <label className="block text-sm mb-2 text-gray-400">
//               New Password
//             </label>

//             <div className="relative">
//               <input
//                 type={showNew ? "text" : "password"}
//                 value={security.newPassword || ""}
//                 onChange={(e) =>
//                   updateSecurity({ newPassword: e.target.value })
//                 }
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowNew(!showNew)}
//                 className="absolute right-3 top-3 text-gray-300"
//               >
//                 {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* -------- CONFIRM PASSWORD -------- */}
//           <div>
//             <label className="block text-sm mb-2 text-gray-400">
//               Confirm New Password
//             </label>

//             <div className="relative">
//               <input
//                 type={showConfirm ? "text" : "password"}
//                 value={security.confirmPassword || ""}
//                 onChange={(e) =>
//                   updateSecurity({ confirmPassword: e.target.value })
//                 }
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowConfirm(!showConfirm)}
//                 className="absolute right-3 top-3 text-gray-300"
//               >
//                 {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//         </div>

//         {/* Requirements */}
//         <div className="text-sm text-gray-400 space-y-1">
//           <div>
//             {security.newPassword?.length < 8 ? (
//               <span className="text-red-400">• Must be at least 8 characters</span>
//             ) : (
//               <span className="text-green-400">• Length OK</span>
//             )}
//           </div>
//           <div>
//             {security.newPassword !== security.confirmPassword ? (
//               <span className="text-red-400">• Passwords do not match</span>
//             ) : (
//               <span className="text-green-400">• Passwords match</span>
//             )}
//           </div>
//         </div>

//         <button
//           disabled={!canSave}
//           onClick={() => alert("Password updated.")}
//           className={`px-6 py-3 rounded-lg mt-4 transition-colors ${
//             canSave
//               ? "bg-blue-600 hover:bg-blue-700"
//               : "bg-gray-600 cursor-not-allowed text-gray-400"
//           }`}
//         >
//           Update Password
//         </button>
//       </div>
//       {/* ------------------------ 2FA SECTION ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Two-Factor Authentication (2FA)</h3>
//         <p className="text-gray-400 text-sm">
//           Add an extra layer of security to your account by requiring a code during login.
//         </p>

//         {/* Toggle 2FA */}
//         <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
//           <div>
//             <div className="font-medium">Enable 2FA</div>
//             <div className="text-sm text-gray-400">Use an authenticator app</div>
//           </div>

//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={security.twoFactorEnabled || false}
//               onChange={(e) => updateSecurity({ twoFactorEnabled: e.target.checked })}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
//               peer-checked:after:translate-x-full after:content-[''] after:absolute 
//               after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
//               after:rounded-full after:transition-all">
//             </div>
//           </label>
//         </div>

//         {/* QR Enrollment */}
//         {security.twoFactorEnabled && (
//           <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 space-y-4">
//             <button
//               onClick={() => setShow2FAQR(!show2FAQR)}
//               className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
//             >
//               {show2FAQR ? "Hide QR Code" : "Show QR Code"}
//             </button>

//             {show2FAQR && (
//               <div className="flex flex-col items-center gap-4">
//                 <div className="w-40 h-40 bg-white rounded-md flex items-center justify-center text-black">
//                   QR CODE
//                 </div>

//                 <p className="text-sm text-gray-400">
//                   Scan this QR with your authenticator app.
//                 </p>
//               </div>
//             )}

//             {/* Backup Codes */}
//             <button
//               onClick={() => setShowBackupCodes(!showBackupCodes)}
//               className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 w-fit"
//             >
//               {showBackupCodes ? "Hide Backup Codes" : "View Backup Codes"}
//             </button>

//             {showBackupCodes && (
//               <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
//                 {(security.backupCodes?.length
//                   ? security.backupCodes
//                   : ["F4K2-92N1", "J29D-11DK", "PL92-A0QX", "W82M-X2DD"]
//                 ).map((code, idx) => (
//                   <div
//                     key={idx}
//                     className="font-mono bg-gray-800 px-3 py-2 rounded-lg text-sm"
//                   >
//                     {code}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {/* ------------------------ ACTIVE SESSIONS ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Active Sessions</h3>
//         <p className="text-gray-400 text-sm">
//           These devices are currently logged into your account.
//         </p>

//         <div className="space-y-4">
//           {(security.sessions?.length
//             ? security.sessions
//             : [
//                 {
//                   browser: "Chrome",
//                   ip: "192.168.1.120",
//                   location: "Lagos, Nigeria",
//                   lastActive: "2 hours ago",
//                 },
//               ]
//           ).map((session, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//             >
//               <div className="space-y-1">
//                 <div className="font-medium">{session.browser}</div>
//                 <div className="text-sm text-gray-400">
//                   {session.ip} • {session.location}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   Last active: {session.lastActive}
//                 </div>
//               </div>

//               <button
//                 onClick={() => {
//                   const newSessions = (security.sessions || []).filter((_, i) => i !== index);
//                   updateSecurity({ sessions: newSessions });
//                 }}
//                 className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* ------------------------ CONNECTED ACCOUNTS ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Connected Accounts</h3>
//         <p className="text-gray-400 text-sm">
//           Manage login connections with third-party providers.
//         </p>

//         <div className="space-y-4">
//           {["google", "github", "linkedin"].map((provider) => (
//             <div
//               key={provider}
//               className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//             >
//               <div className="capitalize font-medium">{provider}</div>

//               {security.connectedAccounts?.[provider] ? (
//                 <button
//                   onClick={() =>
//                     updateSecurity({
//                       connectedAccounts: {
//                         ...security.connectedAccounts,
//                         [provider]: false,
//                       },
//                     })
//                   }
//                   className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() =>
//                     updateSecurity({
//                       connectedAccounts: {
//                         ...security.connectedAccounts,
//                         [provider]: true,
//                       },
//                     })
//                   }
//                   className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
//                 >
//                   Connect
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* ------------------------ DANGER ZONE ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>

//         <div className="bg-gray-800/40 border border-red-700 rounded-lg p-6 space-y-4">

//           {/* Export Data */}
//           <button
//             onClick={() => alert("Data exported!")}
//             className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
//           >
//             Export My Data
//           </button>

//           {/* Delete Account */}
//           <button
//             onClick={() => setDeleteOpen(true)}
//             className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg"
//           >
//             Delete My Account
//           </button>

//           {/* Modal */}
//           {deleteOpen && (
//             <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
//               <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4">
//                 <h3 className="text-xl font-bold">Are you sure?</h3>
//                 <p className="text-gray-400">
//                   This action is permanent and cannot be undone.
//                 </p>

//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={() => setDeleteOpen(false)}
//                     className="px-4 py-2 bg-gray-700 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => alert("Account deleted")}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>




//     </div>
//   );
// };


// const NotificationSection = ({ formData, onChange }) => (
//   <div className="space-y-6">
//     <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
    
//     <div className="space-y-4">
//       {Object.entries(formData.notificationSettings).map(([key, value]) => {
//         if (key === 'quietHours') return null;
//         if (key === 'emailDigest') return null;
        
//         return (
//           <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
//             <div>
//               <div className="font-medium capitalize">
//                 {key.replace(/([A-Z])/g, ' $1').trim()}
//               </div>
//               <div className="text-sm text-gray-400">
//                 Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={value}
//                 onChange={(e) => onChange({
//                   ...formData,
//                   notificationSettings: {
//                     ...formData.notificationSettings,
//                     [key]: e.target.checked
//                   }
//                 })}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// );

// const PrivacySection = ({ formData, onChange }) => {
//   const privacy = formData.privacySettings || {};

//   const updatePrivacy = (data) => {
//     onChange({
//       ...formData,
//       privacySettings: {
//         profileVisibility: "public",
//         showOnlineStatus: true,
//         showLastSeen: true,
//         showActivityInCommunities: true,
//         dataSharing: {
//           personalizedAds: true,
//           analytics: true,
//           partnerSharing: false,
//         },
//         blockedUsers: [
//           { id: 1, name: "Michael Doe" },
//           { id: 2, name: "Jane Adams" },
//         ],
//         ...privacy,
//         ...data,
//       },
//     });
//   };

//   return (
//     <div className="space-y-10">
//       <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

//       {/* ------------------------ A. PROFILE VISIBILITY ------------------------ */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold">Profile Visibility</h3>
//         <p className="text-gray-400 text-sm">
//           Control who can see your profile and personal information.
//         </p>

//         <div className="space-y-3">
//           {["public", "private", "followers"].map((opt) => (
//             <label
//               key={opt}
//               className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
//             >
//               <input
//                 type="radio"
//                 name="visibility"
//                 value={opt}
//                 checked={privacy.profileVisibility === opt}
//                 onChange={() => updatePrivacy({ profileVisibility: opt })}
//               />
//               <span className="capitalize">{opt}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* ------------------------ B. ACTIVITY STATUS ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Activity Status</h3>
//         <p className="text-gray-400 text-sm">
//           Decide when others can see your online presence.
//         </p>

//         {[
//           {
//             key: "showOnlineStatus",
//             title: "Show Online Status",
//             desc: "Allow users to see when you are online.",
//           },
//           {
//             key: "showLastSeen",
//             title: "Show Last Seen",
//             desc: "Shows your last active timestamp.",
//           },
//           {
//             key: "showActivityInCommunities",
//             title: "Community Activity",
//             desc: "Display when you are active inside communities.",
//           },
//         ].map((item) => (
//           <div
//             key={item.key}
//             className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//           >
//             <div>
//               <div className="font-medium">{item.title}</div>
//               <div className="text-sm text-gray-400">{item.desc}</div>
//             </div>

//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={privacy[item.key] ?? true}
//                 onChange={(e) =>
//                   updatePrivacy({ [item.key]: e.target.checked })
//                 }
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
//                 peer-checked:after:translate-x-full after:content-[''] after:absolute 
//                 after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
//                 after:rounded-full after:transition-all">
//               </div>
//             </label>
//           </div>
//         ))}
//       </div>

//       {/* ------------------------ C. DATA SHARING CONTROLS ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Data Sharing</h3>
//         <p className="text-gray-400 text-sm">
//           Manage how your data is used for personalization and analytics.
//         </p>

//         {[
//           {
//             key: "personalizedAds",
//             title: "Personalized Ads",
//             desc: "Receive ads tailored to your activity.",
//           },
//           {
//             key: "analytics",
//             title: "Analytics",
//             desc: "Allow anonymous usage data collection.",
//           },
//           {
//             key: "partnerSharing",
//             title: "Partner Data Sharing",
//             desc: "Allow sharing data with trusted partners.",
//           },
//         ].map((item) => (
//           <div
//             key={item.key}
//             className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//           >
//             <div>
//               <div className="font-medium">{item.title}</div>
//               <div className="text-sm text-gray-400">{item.desc}</div>
//             </div>

//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={privacy.dataSharing?.[item.key] ?? true}
//                 onChange={(e) =>
//                   updatePrivacy({
//                     dataSharing: {
//                       ...privacy.dataSharing,
//                       [item.key]: e.target.checked,
//                     },
//                   })
//                 }
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
//                 peer-checked:after:translate-x-full after:content-[''] after:absolute 
//                 after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
//                 after:rounded-full after:transition-all">
//               </div>
//             </label>
//           </div>
//         ))}
//       </div>

//       {/* ------------------------ D. BLOCKED USERS ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Blocked Users</h3>
//         <p className="text-gray-400 text-sm">
//           Users you have blocked will not be able to interact with you.
//         </p>

//         <div className="space-y-4">
//           {(privacy.blockedUsers || []).map((user) => (
//             <div
//               key={userData?.id}
//               className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//             >
//               <div className="flex flex-col">
//                 <span className="font-medium">{userData?.name}</span>
//                 <span className="text-sm text-gray-400">Blocked user</span>
//               </div>

//               <button
//                 onClick={() => {
//                   const updated = privacy.blockedUsers.filter(
//                     (u) => u.id !== userData?.id
//                   );
//                   updatePrivacy({ blockedUsers: updated });
//                 }}
//                 className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
//               >
//                 Unblock
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// const AppearanceSection = ({ formData, onChange }) => {
//   const appearance = formData.appearanceSettings || {};

//   const updateAppearance = (data) => {
//     onChange({
//       ...formData,
//       appearanceSettings: {
//         themeMode: "dark",
//         accentColor: "blue",
//         layout: "comfortable",
//         density: "normal",
//         animations: true,
//         reduceMotion: false,
//         cardRadius: "rounded",
//         cardShadow: "medium",
//         ...appearance,
//         ...data,
//       },
//     });
//   };

//   const accentColors = ["blue", "red", "green", "purple", "yellow", "pink", "orange", "cyan"];
//   const layoutOptions = ["compact", "comfortable", "spacious"];
//   const densityOptions = ["normal", "dense"];
//   const shadowOptions = ["none", "light", "medium", "heavy"];
//   const radiusOptions = ["rounded", "sharp"];

//   return (
//     <div className="space-y-10">
//       <h2 className="text-2xl font-bold mb-6">Appearance</h2>

//       {/* ------------------------ A. THEME MODE ------------------------ */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold">Theme Mode</h3>

//         {["light", "dark", "system"].map((mode) => (
//           <label
//             key={mode}
//             className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
//           >
//             <input
//               type="radio"
//               name="themeMode"
//               value={mode}
//               checked={appearance.themeMode === mode}
//               onChange={() => updateAppearance({ themeMode: mode })}
//             />
//             <span className="capitalize">{mode}</span>
//           </label>
//         ))}
//       </div>

//       {/* ------------------------ B. ACCENT COLOR ------------------------ */}
//       <div className="space-y-3 pt-10">
//         <h3 className="text-xl font-semibold">Accent Color</h3>

//         <div className="grid grid-cols-8 gap-3">
//           {accentColors.map((c) => (
//             <div
//               key={c}
//               className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
//                 appearance.accentColor === c ? "border-white" : "border-transparent"
//               }`}
//               style={{ backgroundColor: c }}
//               onClick={() => updateAppearance({ accentColor: c })}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ------------------------ C. APP LAYOUT ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">App Layout</h3>

//         <select
//           value={appearance.layout}
//           onChange={(e) => updateAppearance({ layout: e.target.value })}
//           className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//         >
//           {layoutOptions.map((opt) => (
//             <option key={opt} value={opt}>
//               {opt.charAt(0).toUpperCase() + opt.slice(1)}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ------------------------ D. UI DENSITY ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">UI Density</h3>

//         {densityOptions.map((density) => (
//           <label
//             key={density}
//             className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
//           >
//             <input
//               type="radio"
//               name="uiDensity"
//               value={density}
//               checked={appearance.density === density}
//               onChange={() => updateAppearance({ density })}
//             />
//             <span className="capitalize">{density}</span>
//           </label>
//         ))}
//       </div>

//       {/* ------------------------ E. ANIMATIONS & MOTION ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Animations & Motion</h3>

//         {/* Enable Animations */}
//         <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
//           <div>
//             <div className="font-medium">Enable Animations</div>
//             <div className="text-sm text-gray-400">Smooth transitions & motion effects.</div>
//           </div>

//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={appearance.animations}
//               onChange={(e) => updateAppearance({ animations: e.target.checked })}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600
//               peer-checked:after:translate-x-full after:content-[''] after:absolute 
//               after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5
//               after:rounded-full after:transition-all">
//             </div>
//           </label>
//         </div>

//         {/* Reduce Motion */}
//         <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
//           <div>
//             <div className="font-medium">Reduce Motion</div>
//             <div className="text-sm text-gray-400">
//               Turn off complex animations for accessibility.
//             </div>
//           </div>

//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={appearance.reduceMotion}
//               onChange={(e) => updateAppearance({ reduceMotion: e.target.checked })}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600
//               peer-checked:after:translate-x-full after:content-[''] after:absolute 
//               after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5
//               after:rounded-full after:transition-all">
//             </div>
//           </label>
//         </div>
//       </div>

//       {/* ------------------------ F. CARD & COMPONENT STYLE ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Card & Component Style</h3>

//         {/* Radius */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Card Corners</label>
//           <select
//             value={appearance.cardRadius}
//             onChange={(e) => updateAppearance({ cardRadius: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {radiusOptions.map((r) => (
//               <option key={r} value={r}>
//                 {r.charAt(0).toUpperCase() + r.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Shadow */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Card Shadow</label>
//           <select
//             value={appearance.cardShadow}
//             onChange={(e) => updateAppearance({ cardShadow: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {shadowOptions.map((s) => (
//               <option key={s} value={s}>
//                 {s.charAt(0).toUpperCase() + s.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };


// const PreferencesSection = ({ formData, onChange }) => {
//   const prefs = formData.preferencesSettings || {};

//   const updatePrefs = (data) => {
//     onChange({
//       ...formData,
//       preferencesSettings: {
//         language: "en",
//         timezone: "America/Los_Angeles",
//         dateFormat: "MM/DD/YYYY",
//         theme: "dark",
//         accentColor: "blue",
//         fontSize: "medium",
//         safeMode: true,
//         autoPlay: false,
//         suggestedContent: true,
//         personalizedFeed: true,
//         emailFrequency: "weekly",
//         messageRequests: "everyone",
//         allowDMs: "everyone",
//         dashboardDefaultTab: "overview",
//         showAdvancedMetrics: true,
//         experimentalFeatures: false,
//         ...prefs,
//         ...data,
//       },
//     });
//   };

//   const languages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Chinese",
//     "Japanese",
//     "Arabic",
//     "Hindi",
//   ];

//   const emailOptions = ["daily", "weekly", "monthly", "never"];

//   const messageRequestOptions = [
//     "everyone",
//     "followers",
//     "no_one"
//   ];

//   const fontSizes = ["small", "medium", "large"];

//   const tabs = ["overview", "tasks", "team", "activity"];

//   const accentColors = ["blue", "red", "green", "purple", "yellow", "pink"];

//   return (
//     <div className="space-y-10">
//       <h2 className="text-2xl font-bold mb-6">Preferences</h2>

//       {/* ------------------------ A. LANGUAGE & LOCALIZATION ------------------------ */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold">Language & Localization</h3>
//         <p className="text-gray-400 text-sm">
//           Customize how things appear based on your language and region.
//         </p>

//         {/* Language */}
//         <div>
//           <label className="block text-sm mb-2 text-gray-400">Language</label>
//           <select
//             value={prefs.language}
//             onChange={(e) => updatePrefs({ language: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {languages.map((lang) => (
//               <option key={lang} value={lang.toLowerCase()}>
//                 {lang}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Date Format */}
//         <div>
//           <label className="block text-sm mb-2 text-gray-400">Date Format</label>
//           <select
//             value={prefs.dateFormat}
//             onChange={(e) => updatePrefs({ dateFormat: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//             <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//             <option value="YYYY/MM/DD">YYYY/MM/DD</option>
//           </select>
//         </div>
//       </div>

//       {/* ------------------------ B. THEME & DISPLAY ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Theme & Display</h3>

//         {/* Theme Mode */}
//         <div className="space-y-3">
//           <label className="block text-sm text-gray-400">Theme Mode</label>

//           {["light", "dark", "system"].map((theme) => (
//             <label
//               key={theme}
//               className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer"
//             >
//               <input
//                 type="radio"
//                 name="theme"
//                 value={theme}
//                 checked={prefs.theme === theme}
//                 onChange={() => updatePrefs({ theme })}
//               />
//               <span className="capitalize">{theme}</span>
//             </label>
//           ))}
//         </div>

//         {/* Accent Color */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
//           <div className="grid grid-cols-6 gap-3">
//             {accentColors.map((c) => (
//               <div
//                 key={c}
//                 className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
//                   prefs.accentColor === c ? "border-white" : "border-transparent"
//                 }`}
//                 style={{ backgroundColor: c }}
//                 onClick={() => updatePrefs({ accentColor: c })}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Font Size */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Font Size</label>
//           <select
//             value={prefs.fontSize}
//             onChange={(e) => updatePrefs({ fontSize: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {fontSizes.map((size) => (
//               <option key={size} value={size}>
//                 {size.charAt(0).toUpperCase() + size.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ------------------------ C. CONTENT PREFERENCES ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Content Preferences</h3>

//         {[
//           {
//             key: "safeMode",
//             title: "Safe Mode",
//             desc: "Filter sensitive or mature content.",
//           },
//           {
//             key: "autoPlay",
//             title: "Auto-Play Videos",
//             desc: "Automatically play videos in the feed.",
//           },
//           {
//             key: "suggestedContent",
//             title: "Suggested Content",
//             desc: "Show recommended posts based on activity.",
//           },
//           {
//             key: "personalizedFeed",
//             title: "Personalized Feed",
//             desc: "Customize feed based on your interests.",
//           },
//         ].map((item) => (
//           <div
//             key={item.key}
//             className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//           >
//             <div>
//               <div className="font-medium">{item.title}</div>
//               <div className="text-sm text-gray-400">{item.desc}</div>
//             </div>

//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={prefs[item.key] ?? true}
//                 onChange={(e) =>
//                   updatePrefs({ [item.key]: e.target.checked })
//                 }
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
//                 peer-checked:after:translate-x-full after:content-[''] after:absolute 
//                 after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
//                 after:rounded-full after:transition-all">
//               </div>
//             </label>
//           </div>
//         ))}
//       </div>

//       {/* ------------------------ D. COMMUNICATION PREFERENCES ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Communication Preferences</h3>

//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Email Frequency</label>
//           <select
//             value={prefs.emailFrequency}
//             onChange={(e) => updatePrefs({ emailFrequency: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {emailOptions.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt.charAt(0).toUpperCase() + opt.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Message Requests */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Message Requests</label>
//           <select
//             value={prefs.messageRequests}
//             onChange={(e) => updatePrefs({ messageRequests: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {messageRequestOptions.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt.replace("_", " ").replace("no one", "No one")}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Allow DMs */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Allow Direct Messages From</label>
//           <select
//             value={prefs.allowDMs}
//             onChange={(e) => updatePrefs({ allowDMs: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             <option value="everyone">Everyone</option>
//             <option value="followers">Followers only</option>
//             <option value="no_one">No one</option>
//           </select>
//         </div>
//       </div>

//       {/* ------------------------ E. STARTUP DASHBOARD PREFERENCES ------------------------ */}
//       <div className="space-y-6 pt-10">
//         <h3 className="text-xl font-semibold">Startup Dashboard</h3>

//         {/* Default tab */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Default Tab</label>
//           <select
//             value={prefs.dashboardDefaultTab}
//             onChange={(e) => updatePrefs({ dashboardDefaultTab: e.target.value })}
//             className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
//           >
//             {tabs.map((t) => (
//               <option key={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
//             ))}
//           </select>
//         </div>

//         {/* Toggles */}
//         {[
//           {
//             key: "showAdvancedMetrics",
//             title: "Advanced Metrics",
//             desc: "Display detailed analytics in your dashboard.",
//           },
//           {
//             key: "experimentalFeatures",
//             title: "Experimental Features",
//             desc: "Test early-stage features before public release.",
//           },
//         ].map((item) => (
//           <div
//             key={item.key}
//             className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg"
//           >
//             <div>
//               <div className="font-medium">{item.title}</div>
//               <div className="text-sm text-gray-400">{item.desc}</div>
//             </div>

//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={prefs[item.key] ?? false}
//                 onChange={(e) => updatePrefs({ [item.key]: e.target.checked })}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 
//                 peer-checked:after:translate-x-full after:content-[''] after:absolute 
//                 after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 
//                 after:rounded-full after:transition-all">
//               </div>
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };



// const SavedSection = ({ formData, onChange }) => {
//   const tabs = ["ideas", "startups", "posts", "resources", "archived"];
//   const [activeTab, setActiveTab] = useState("ideas");

//   const saved = formData.savedItems || {
//     ideas: [],
//     startups: [],
//     posts: [],
//     resources: [],
//     archived: []
//   };

//   const updateSaved = (data) => {
//     onChange({
//       ...formData,
//       savedItems: {
//         ...saved,
//         ...data
//       }
//     });
//   };

//   const handleUnsave = (id) => {
//     updateSaved({
//       [activeTab]: saved[activeTab].filter((item) => item.id !== id)
//     });
//   };

//   return (
//     <div className="space-y-10">
//       <h2 className="text-2xl font-bold mb-6">Saved Items</h2>

//       {/* ------------------ TABS ------------------ */}
//       <div className="flex gap-4 border-b border-gray-700 pb-2">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-lg capitalize ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-400 hover:bg-gray-700"
//             }`}
//           >
//             {tab.replace(/_/g, " ")}
//           </button>
//         ))}
//       </div>

//       {/* ------------------ TAB CONTENT ------------------ */}
//       <div className="space-y-4">
//         {saved[activeTab].length === 0 ? (
//           <div className="text-center py-10 text-gray-500">
//             No saved {activeTab} yet.
//           </div>
//         ) : (
//           saved[activeTab].map((item) => (
//             <div
//               key={item.id}
//               className="bg-gray-700/40 border border-gray-600 rounded-xl p-4 flex gap-4"
//             >
//               {/* Thumbnail */}
//               <div className="w-20 h-20 rounded-lg bg-gray-600 overflow-hidden">
//                 {item.thumbnail ? (
//                   <img
//                     src={item.thumbnail}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                     No Image
//                   </div>
//                 )}
//               </div>

//               {/* INFO */}
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <h3 className="font-semibold text-lg">{item.title}</h3>
//                   <span className="text-sm text-gray-400">
//                     {item.dateSaved}
//                   </span>
//                 </div>

//                 <div className="text-gray-400 text-sm capitalize">
//                   {item.type}
//                 </div>

//                 {/* Tags */}
//                 <div className="flex gap-2 mt-2 flex-wrap">
//                   {item.tags?.map((t, i) => (
//                     <span
//                       key={i}
//                       className="text-xs bg-gray-600 px-2 py-1 rounded-lg text-gray-300"
//                     >
//                       {t}
//                     </span>
//                   ))}
//                 </div>

//                 {/* ACTION BUTTONS */}
//                 <div className="flex gap-3 mt-4">
//                   <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg">
//                     <ExternalLink size={14} /> Open
//                   </button>

//                   <button
//                     onClick={() => handleUnsave(item.id)}
//                     className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg"
//                   >
//                     <Trash2 size={14} /> Unsave
//                   </button>

//                   <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg">
//                     <Share2 size={14} /> Share
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };




// export default ProfileSettings;



// ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe, Bookmark, ExternalLink, Trash2, Share2, Key, Smartphone, LogOut, Download, AlertTriangle, CheckCircle, X } from 'lucide-react';
import LoadingSpinner from '../../LoadingSpinner';
import { useDispatch } from 'react-redux';
import { setUser,setToken } from "../../../services/auth/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProfileSettings = ({ userData,setUserData, onBack }) => {
  const dispatch=useDispatch();
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, color: 'text-blue-400' },
    { id: 'accountSecurity', label: 'Account Security', icon: Key, color: 'text-green-400' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-yellow-400' },
    { id: 'privacy', label: 'Privacy', icon: Shield, color: 'text-purple-400' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'text-pink-400' },
    { id: 'preferences', label: 'Preferences', icon: Globe, color: 'text-cyan-400' },
    { id: 'saved', label: 'Saved Items', icon: Bookmark, color: 'text-orange-400' }
  ];
  
  const transformUserData = ({user}) => {
    if (!user) return null;
    
    return {
      id: user?.id,
      firstName: user?.firstName || user?.first_name || '',
      lastName: user?.lastName || user?.last_name || '',
      email: user?.email || '',
      isEmailVerified: user?.isEmailVerified || user?.is_email_verified || false,
      lastLogin: user?.lastLogin || user?.last_login || new Date().toISOString(),
      status: user?.status || 'active',
      role: user?.role || 'member',
      xp_points: user?.xpPoints || user?.xp_points || 0,
      streak_days: user?.streakDays || user?.streak_days || 0,
      last_activity_date: user?.lastActivityDate || user?.last_activity_date || new Date().toISOString(),
      total_revenue: user?.totalRevenue || user?.total_revenue || 0,
      satisfaction_percentage: user?.satisfactionPercentage || user?.satisfaction_percentage || 0,
      active_startups_count: user?.activeStartupsCount || user?.active_startups_count || 0,
      
      profile: {
        picture: user?.profile?.picture || user?.profile_picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        bio: user?.profile?.bio || user?.profile_bio || 'No bio provided',
        company: user?.profile?.company || user?.profile_company || 'Add company',
        socialLinks: user?.profile?.socialLinks || user?.profile_social_links || {},
        country: user?.profile?.country || user?.profile_country || 'Add country',
        city: user?.profile?.city || user?.profile_city || 'Add city',
        timezone: user?.profile?.timezone || user?.profile_timezone || 'UTC'
      },
      
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
        }
      },
      
      preferences: {
        emailNotifications: user?.preferences?.emailNotifications || user?.pref_email_notifications || true,
        pushNotifications: user?.preferences?.pushNotifications || user?.pref_push_notifications || true,
        privacy: user?.preferences?.privacy || user?.pref_privacy || 'public',
        language: user?.preferences?.language || user?.pref_language || 'en',
        timezone: user?.preferences?.timezone || user?.pref_timezone || 'UTC',
        theme: user?.preferences?.theme || user?.pref_theme || 'dark'
      },
      
      notificationSettings: {
        newComments: user?.notificationSettings?.newComments || user?.notif_new_comments || true,
        newLikes: user?.notificationSettings?.newLikes || user?.notif_new_likes || true,
        newSuggestions: user?.notificationSettings?.newSuggestions || user?.notif_new_suggestions || true,
        joinRequests: user?.notificationSettings?.joinRequests || user?.notif_join_requests || true,
        approvals: user?.notificationSettings?.approvals || user?.notif_approvals || true,
        storyViews: user?.notificationSettings?.storyViews || user?.notif_story_views || false,
        postEngagement: user?.notificationSettings?.postEngagement || user?.notif_post_engagement || true,
        emailDigest: user?.notificationSettings?.emailDigest || user?.notif_email_digest || 'weekly',
        quietHours: {
          enabled: user?.notificationSettings?.quietHours?.enabled || user?.notif_quiet_hours_enabled || true,
          start: user?.notificationSettings?.quietHours?.start || user?.notif_quiet_hours_start || "22:00",
          end: user?.notificationSettings?.quietHours?.end || user?.notif_quiet_hours_end || "08:00"
        }
      },
      
      savedItems: {
        ideas: [],
        startups: [],
        posts: [],
        resources: [],
        archived: []
      },
      
      statistics: {
        total_ideas: user?.statistics?.total_ideas || user?.relationshipCounts?.ideas || 0,
        total_tasks: user?.statistics?.total_tasks  || user?.relationshipCounts?.tasks || 0,
        completed_tasks: user?.statistics?.completed_tasks || 0,
        total_startups: user?.statistics?.total_startups || user?.relationshipCounts?.startups || 0,
        total_achievements: user?.statistics?.total_achievements || user?.relationshipCounts?.achievements || 0,
        total_comments: user?.statistics?.total_comments  || 0,
        total_likes_received: user?.statistics?.total_likes_received || 0,
        engagement_score: user?.statistics?.engagement_score || user?.dashboardMetrics?.growthMetrics?.marketShare || 85
      },
      
      recentActivity: user?.recentActivity || [
        {
          type: 'task_completed',
          title: 'Completed first task',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          data: { points: 50 }
        },
        {
          type: 'achievement_unlocked',
          title: 'Early Bird',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          data: { xp: 100 }
        },
        {
          type: 'startup_created',
          title: 'First Startup',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          data: { category: 'Tech' }
        }
      ],
      
      createdAt: user?.createdAt || new Date().toISOString(),
      dashboardMetrics: user?.dashboardMetrics || {
        teamPerformance: {
          score: 85,
          activeMembers: 5,
          tasksCompleted: 42,
          productivityLevel: 'high'
        },
        projectGoals: {
          progress: 75,
          milestonesCompleted: 3,
          nextGoal: 'Launch MVP',
          totalGoals: 5
        },
        growthMetrics: {
          growthPercentage: 45,
          userGrowth: 120,
          revenue: 25000,
          marketShare: 85
        },
        achievements: {
          total: 8,
          thisMonth: 2,
          nextTarget: 13
        }
      }
    };
  };


  const showStatus = (type, message) => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
  };

  const handleSave = async () => {
    if (!formData || !formData.id) {
      showStatus('error', 'Invalid user data');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Determine what data to send based on active section
      let updateData = {};
      const userId = userData.id;

      switch (activeSection) {
        case 'profile':
          updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            profile: {
              bio: formData.profile?.bio || '',
              company: formData.profile?.company || '',
              city: formData.profile?.city || '',
              country: formData.profile?.country || '',
              timezone: formData.profile?.timezone || '',
              socials: formData.profile?.socials || {}
            }
          };
          break;
          
        case 'accountSecurity':
          if (formData.accountSecurity?.newPassword && 
              formData.accountSecurity?.newPassword === formData.accountSecurity?.confirmPassword) {
            updateData = {
              currentPassword: formData.accountSecurity?.password,
              password: formData.accountSecurity?.newPassword,
              accountSecurity: {
                twoFactorEnabled: formData.accountSecurity?.twoFactorEnabled || false,
                backupCodes: formData.accountSecurity?.backupCodes || [],
                sessions: formData.accountSecurity?.sessions || [],
                connectedAccounts: formData.accountSecurity?.connectedAccounts || {}
              }
            };
          }
          break;
          
        case 'notifications':
          updateData = {
            notificationSettings: formData.notificationSettings || {}
          };
          break;
          
        case 'privacy':
          updateData = {
            privacySettings: formData.privacySettings || {}
          };
          break;
          
        case 'appearance':
          updateData = {
            appearanceSettings: formData.appearanceSettings || {}
          };
          break;
          
        case 'preferences':
          updateData = {
            preferencesSettings: formData.preferencesSettings || {}
          };
          break;
            
        case 'saved':
          updateData = {
            savedItems: formData.savedItems || {}
          };
          break;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update local form data with response
        if (data.user) {
          console.log(JSON.stringify(data.user))
          setUserData(()=>transformUserData(data.user))
          setFormData(prev => ({ ...prev, ...data.user }));
        }
        showStatus('success', data.message || 'Settings saved successfully!');
        
        // If password was updated, clear the password fields
        if (activeSection === 'accountSecurity') {
          setFormData(prev => ({
            ...prev,
            accountSecurity: {
              ...prev.accountSecurity,
              password: '',
              newPassword: '',
              confirmPassword: ''
            }
          }));
        }
      } else {
        throw new Error(data.error || data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      showStatus('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!formData.id) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const formDataObj = new FormData();
      formDataObj.append(type === 'avatar' ? 'profile_picture' : type, file);

      const response = await fetch(`${API_BASE_URL}/users/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });

      const data = await response.json();

      if (response.ok) {
        // Update profile picture URL
        if (data.user) {
          console.log(JSON.stringify(data.user))
          setUserData(()=>transformUserData(data.user))
          setFormData(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              picture: data.userData?.profile?.picture
            }
          }));
        }
        showStatus('success', 'Profile picture updated!');
      } else {
        throw new Error(data.error || data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showStatus('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection formData={formData} onChange={setFormData} onFileUpload={handleFileUpload} />;
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
    <div className="min-h-screen  text-white">
      {isLoading && <LoadingSpinner title="Saving Changes" message="Please wait while we update your settings..." />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          
          {/* Status Message */}
          {saveStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                saveStatus.type === 'success' 
                  ? 'bg-green-900/30 border border-green-700 text-green-300' 
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}
            >
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              {saveStatus.message}
              <button onClick={() => setSaveStatus({ type: '', message: '' })}>
                <X className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${section.color}`} />
                      <span className="font-medium">{section.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
              
              {/* User Info */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {formData.profile?.picture ? (
                      <img 
                        src={`${API_BASE_URL}/users/avatars/${formData?.profile?.picture?.replace(/^\/?uploads\//, "")}`}
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {formData.firstName?.[0]}{formData.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{formData.firstName} {formData.lastName}</div>
                    <div className="text-sm text-gray-400">{formData.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <p className="text-gray-400 mt-2">
                  Manage your {sections.find(s => s.id === activeSection)?.label.toLowerCase()} settings
                </p>
              </div>
              
              {renderSectionContent()}
              
              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-800">
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProfileSection - Updated with file upload integration
const ProfileSection = ({ formData, onChange, onFileUpload }) => {
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Nigeria",
    "Ghana", "Kenya", "South Africa", "Germany", "France", "Spain",
    "Italy", "China", "Japan", "India", "Brazil", "Mexico"
  ];
  
  const [filePic,setFilePic]=useState(null);
  
  const timezones = Intl.supportedValuesOf("timeZone");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('File size must be less than 5MB');
      return;
    }

    onFileUpload(file, 'avatar');
    
    setFilePic(file)
    
  };

  return (
    <div className="space-y-10">
      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Profile Picture
        </label>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border-2 border-gray-700 shadow-xl">
            {formData.profile?.picture ? (
              <img
                src={`${API_BASE_URL}/users/avatars/${formData?.profile?.picture?.replace(/^\/?uploads\//, "")}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg font-semibold">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl cursor-pointer transition-all duration-200 inline-flex items-center gap-2 w-fit">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload New
            </label>

            {formData.profile?.picture && (
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...formData,
                    profile: { ...formData.profile, picture: "" }
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200"
              >
                Remove Picture
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-6 border-b border-gray-800 pb-2">
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) =>
                onChange({ ...formData, firstName: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName || ''}
              onChange={(e) =>
                onChange({ ...formData, lastName: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Email (read-only)
            </label>
            <input
              type="text"
              value={formData.email || ''}
              readOnly
              className="w-full bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Account Status
            </label>
            <input
              type="text"
              value={formData.status || 'active'}
              readOnly
              className="w-full bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl px-4 py-3 capitalize"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Bio
        </label>
        <textarea
          value={formData.profile?.bio || ''}
          onChange={(e) =>
            onChange({
              ...formData,
              profile: { ...formData.profile, bio: e.target.value }
            })
          }
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Professional Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-6 border-b border-gray-800 pb-2">
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Company
            </label>
            <input
              type="text"
              value={formData.profile?.company || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  profile: { ...formData.profile, company: e.target.value }
                })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              City
            </label>
            <input
              type="text"
              value={formData.profile?.city || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  profile: { ...formData.profile, city: e.target.value }
                })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your city"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Country
            </label>
            <select
              value={formData.profile?.country || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  profile: { ...formData.profile, country: e.target.value }
                })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Timezone
            </label>
            <select
              value={formData.profile?.timezone || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  profile: { ...formData.profile, timezone: e.target.value }
                })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-6 border-b border-gray-800 pb-2">
          Social Links
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div key={platform} className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 capitalize">
                {platform}
              </label>
              <input
                type="text"
                placeholder={`https://${platform}.com/username`}
                value={formData.profile?.socials?.[platform] || ""}
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
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// AccountSecurity - Enhanced with API integration
const AccountSecurity = ({ formData, onChange }) => {
  const [show2FAQR, setShow2FAQR] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const security = formData.accountSecurity || {};

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
      {/* Password Management */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-300">Password Management</h3>
        <p className="text-gray-400 text-sm">
          Manage your login password. Choose a strong, unique password.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={security.password || ""}
                onChange={(e) => updateSecurity({ password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => alert("Reset email sent!")}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Forgot password?
            </button>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={security.newPassword || ""}
                onChange={(e) => updateSecurity({ newPassword: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={security.confirmPassword || ""}
                onChange={(e) => updateSecurity({ confirmPassword: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 space-y-2 bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            {security.newPassword?.length >= 8 ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <X className="w-4 h-4 text-red-400" />
            )}
            <span>Must be at least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            {security.newPassword === security.confirmPassword && security.newPassword ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <X className="w-4 h-4 text-red-400" />
            )}
            <span>Passwords must match</span>
          </div>
        </div>

        <button
          disabled={!canSave}
          onClick={() => alert("Password updated.")}
          className={`px-8 py-3 rounded-xl transition-all duration-200 ${
            canSave
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-900/30"
              : "bg-gray-800 cursor-not-allowed text-gray-500"
          }`}
        >
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-gray-300">Two-Factor Authentication</h3>
        <p className="text-gray-400 text-sm">
          Add an extra layer of security to your account.
        </p>

        <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div>
            <div className="font-medium text-gray-300">Enable 2FA</div>
            <div className="text-sm text-gray-400">Use an authenticator app like Google Authenticator</div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={security.twoFactorEnabled || false}
              onChange={(e) => updateSecurity({ twoFactorEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r from-blue-600 to-blue-700 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
          </label>
        </div>

        {security.twoFactorEnabled && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 space-y-4">
            <button
              onClick={() => setShow2FAQR(!show2FAQR)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200"
            >
              {show2FAQR ? "Hide QR Code" : "Show QR Code"}
            </button>

            {show2FAQR && (
              <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-xl">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center text-black">
                  <div className="text-center p-4">
                    <div className="text-lg font-bold mb-2">QR Code</div>
                    <div className="text-sm text-gray-600">Scan with authenticator app</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Scan this QR with your authenticator app.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-200"
            >
              {showBackupCodes ? "Hide Backup Codes" : "View Backup Codes"}
            </button>

            {showBackupCodes && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-3">
                <h4 className="font-medium text-gray-300">Backup Codes</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Save these codes in a secure place. Each code can be used once.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(security.backupCodes?.length
                    ? security.backupCodes
                    : ["F4K2-92N1", "J29D-11DK", "PL92-A0QX", "W82M-X2DD"]
                  ).map((code, idx) => (
                    <div
                      key={idx}
                      className="font-mono bg-gray-800 px-4 py-3 rounded-lg text-center text-sm text-gray-300"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-gray-300">Active Sessions</h3>
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
              className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700"
            >
              <div className="space-y-1">
                <div className="font-medium text-gray-300">{session.browser}</div>
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
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-gray-300">Connected Accounts</h3>
        <p className="text-gray-400 text-sm">
          Manage login connections with third-party providers.
        </p>

        <div className="space-y-4">
          {["google", "github", "linkedin"].map((provider) => (
            <div
              key={provider}
              className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                  {provider === 'google' ? 'G' : provider === 'github' ? 'GH' : 'LI'}
                </div>
                <span className="capitalize font-medium text-gray-300">{provider}</span>
              </div>

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
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200"
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
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>

        <div className="bg-gray-900/50 border border-red-700 rounded-xl p-6 space-y-4">
          <button
            onClick={() => alert("Data exported!")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Export My Data
          </button>

          <button
            onClick={() => setDeleteOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>

          {deleteOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4 border border-gray-800">
                <h3 className="text-xl font-bold text-red-400">Are you sure?</h3>
                <p className="text-gray-400">
                  This action is permanent and cannot be undone. All your data will be deleted.
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteOpen(false)}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => alert("Account deleted")}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200"
                  >
                    Delete Account
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

// Other sections remain similar but updated with new styling
// NotificationSection, PrivacySection, AppearanceSection, PreferencesSection, SavedSection
// They follow the same pattern with updated styling

// Updated NotificationSection with new styling
const NotificationSection = ({ formData, onChange }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-300">Notification Preferences</h3>
      <p className="text-gray-400 text-sm">Manage how and when you receive notifications</p>
    </div>
    
    <div className="space-y-4">
      {Object.entries(formData.notificationSettings || {}).map(([key, value]) => {
        if (key === 'quietHours' || key === 'emailDigest') return null;
        
        return (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div>
              <div className="font-medium text-gray-300 capitalize">
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
              <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r from-blue-600 to-blue-700 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
            </label>
          </div>
        );
      })}
    </div>
  </div>
);

// Updated PrivacySection with new styling
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
        blockedUsers: [],
        ...privacy,
        ...data,
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* Profile Visibility */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-300">Profile Visibility</h3>
        <p className="text-gray-400 text-sm">
          Control who can see your profile and personal information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["public", "private", "followers"].map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                privacy.profileVisibility === opt
                  ? "bg-gradient-to-r from-blue-900/30 to-blue-700/30 border-blue-600"
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={opt}
                checked={privacy.profileVisibility === opt}
                onChange={() => updatePrivacy({ profileVisibility: opt })}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 ${
                privacy.profileVisibility === opt 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-600'
              }`}></div>
              <span className="capitalize text-gray-300">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Activity Status */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-gray-300">Activity Status</h3>
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
            className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700"
          >
            <div>
              <div className="font-medium text-gray-300">{item.title}</div>
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
              <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r from-blue-600 to-blue-700 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Data Sharing */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-gray-300">Data Sharing</h3>
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
            className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700"
          >
            <div>
              <div className="font-medium text-gray-300">{item.title}</div>
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
              <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r from-blue-600 to-blue-700 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Blocked Users */}
      <div className="space-y-6 pt-10">
        <h3 className="text-xl font-semibold text-gray-300">Blocked Users</h3>
        <p className="text-gray-400 text-sm">
          Users you have blocked will not be able to interact with you.
        </p>

        <div className="space-y-4">
          {(privacy.blockedUsers || []).map((user) => (
            <div
              key={userData?.id}
              className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-300">{userData?.name}</span>
                <span className="text-sm text-gray-400">Blocked user</span>
              </div>

              <button
                onClick={() => {
                  const updated = privacy.blockedUsers.filter(
                    (u) => u.id !== userData?.id
                  );
                  updatePrivacy({ blockedUsers: updated });
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200"
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


// Updated LoadingSpinner component with better styling
export { ProfileSettings };