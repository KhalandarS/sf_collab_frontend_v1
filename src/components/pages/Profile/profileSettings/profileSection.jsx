import { toast } from "react-toastify";
import { countries } from "./countries";
import { useEffect, useState } from "react";
import { usersAPI } from "@/utils/APIs/userApi";
import { useSelector } from "react-redux";
import { getRenderImageUrl } from "./getRenderImageUrl";
import { getProfilePicture } from "@/utils/getProfilePicture";

/* ---------------------- ProfileSection ---------------------- */
export default function ProfileSection({ formData, setFormData, uploadProfilePicture }) {
  const timezones = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : ['UTC'];
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [roles, setRoles] = useState([]);
  const { user} = useSelector((state) => state.auth);
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadProfilePicture(file).then(url => {
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, picture: url } }));
    }).catch(() => {
      toast.error("Failed to upload image");
    });
  };
const handleAutoDetectTimezone = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!timeZone) {
    toast.info("Could not detect timezone");
    return;
  }
  console.log(formData);
  setFormData(prev => ({
    ...prev,
    preferences: {
      ...prev.preferences,
      timezone: timeZone,
    }
  }));

  toast.success("Timezone detected automatically");
};

  const handleAutoDetectCountry = async () => {
    try {
      setLoadingCountry(true);
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country_name && countries.includes(data.country_name)) {
        setFormData(prev => ({ ...prev, profile: { ...prev.profile, country: data.country_name } }));
        toast.success("Country detected automatically");
      }
      if (data.city) {
        setFormData(prev => ({ ...prev, profile: { ...prev.profile, city: data.city } }));
      }
      if (!data.country_name && !data.city) {
        toast.info("Could not detect country or city");
      }
      handleAutoDetectTimezone();


    } catch {
      toast.error("Failed to detect country");
    } finally {
      setLoadingCountry(false);
    }
  };
  const fromSnakeToTitleCase = (str) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  const fromTitleToSnakeCase = (str) => {

    return str
      .toLowerCase()
      .replace(/ /g, '_');
  }
  useEffect(() => {
    async function getRoles() {
      try {
        // if (!user.roles) {
        //   const data = await usersAPI.getMyRoles();
        //   return;
        // }
        setRoles(['influencer', 'investor', 'builder', 'founder']);
      } catch {
        toast.error("Failed to fetch roles");
      }
    }
    getRoles();
  }, []);
  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
            {(user.profile.picture || formData.profile.picture) ? (
              <img src={getProfilePicture(user) || formData.profile.picture} className="w-full h-full object-cover" alt="profile" />
            ) : (
              <div className="flex items-center justify-center text-gray-400 text-sm h-full">No image</div>
            )}
          </div>

          <label className="px-4 py-2 bg-gray-700 rounded-lg cursor-pointer">
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          {formData.profile.picture && (
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, profile: { ...prev.profile, picture: null } }))} className="px-4 py-2 bg-red-600 rounded-lg">Remove</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
          <input type="text" value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
          <input type="text" value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email (read-only)</label>
          <input type="text" value={formData.email} readOnly className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Account Status</label>
          <input type="text" value={formData.status} readOnly className="w-full bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-3 capitalize" />
        </div>

        {
          formData.roles.length === 0 &&
          <div className="col-span-2">
            <h3 className="text-red-500 border border-red-500 rounded-lg px-4 py-3 font-medium">You must include one role to continue</h3>
          </div>
        }
        {
          roles.length > 0 && roles.map(role => (
            <div key={role}>
              <input type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, roles: [...(prev.roles || []), role] }));
                  } else {
                    setFormData(prev => ({ ...prev, roles: (prev.roles || []).filter(r => r !== role) }));
                  }
                }}
                checked={formData.roles?.includes(role)} className="w-full bg-gray-600 text-gray-400 rounded-lg px-4 py-3" />

              <label className="block text-sm font-medium text-gray-400 mb-2">{fromSnakeToTitleCase(role)} Role</label>
            </div>
          ))
        }
      </div>
      {formData.roles?.includes("builder") && (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">
      Builder Focus
    </label>

    <select
      value={formData.preferences.builderPreferences || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            builderPreferences: e.target.value,
          }
        }))
      }
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
    >
      <option value="" disabled>
        Select an option
      </option>
      <option value="development">Development</option>
      <option value="marketing">Marketing</option>
    </select>
  </div>
)}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
        <textarea value={formData.profile.bio || ''} onChange={(e) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } }))} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
          <div className="flex gap-2">
            <select value={formData.profile.country || ''} onChange={(e) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, country: e.target.value } }))} className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
              <option value="">Select country</option>
              {countries && countries.map(country => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
          <input type="text" value={formData.profile.city || ''} onChange={(e) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, city: e.target.value } }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

      </div>
      <button type="button" onClick={handleAutoDetectCountry} className="w-full px-4 py-2 bg-blue-600 rounded-lg whitespace-nowrap">
        {
          loadingCountry ? "Detecting..." : "Auto Detect"
        }
      </button>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
          <input type="text" value={formData.profile.company || ''} onChange={(e) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, company: e.target.value } }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Timezone (preference)</label>
          <select value={formData.preferences.timezone} onChange={(e) => setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, timezone: e.target.value } }))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
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
              onChange={(e) => setFormData(prev => ({ ...prev, profile: { ...prev.profile, socialLinks: { ...(prev.profile.socialLinks || {}), [platform]: e.target.value } } }))} 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 capitalize"
            />
          ))}
        </div>
      </div>

      
    </div>
  );
};
