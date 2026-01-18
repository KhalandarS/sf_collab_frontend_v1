import { Label } from "@/components/ui/label";
import { useState } from "react";

/* ---------------------- PreferencesSection ---------------------- */
export default function PreferencesSection({ formData, onChange, setFormData }) {
  const prefs = formData.preferences || {};
  // const languages = ["en","es","fr","de","zh","ja","ar","hi"];
  // const emailOptions = ["daily","weekly","monthly","never"];
  const [hideInfluencerInfo, setHideInfluencerInfo] = useState(localStorage.getItem('preferences:hideInfluencerInfo') === 'true');
  const [hideJobApplication, setHideJobApplication] = useState(localStorage.getItem('preferences:hideJobApplication') === 'true');

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">Preferences</h2>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Application Visibility</h3>
        <p className="text-gray-400 text-sm">Control which types of applications you want to see.</p>

        <div className="space-y-3">
          <Label className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={!hideJobApplication || false}
              onChange={(e) => {
                localStorage.setItem('preferences:hideJobApplication', !e.target.checked)
                setHideJobApplication(!e.target.checked);
              }
              }
            />
            <span>Show Job Applications</span>
          </Label>
              
          <Label className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={!hideInfluencerInfo || false}
              onChange={(e) => {
                localStorage.setItem('preferences:hideInfluencerInfo', !e.target.checked)
                setHideInfluencerInfo(!e.target.checked);
              }
              }
            />
            <span>Show Influencer Applications</span>
          </Label>
        </div>
      </div>
      {/* <div className="space-y-6">
        <h3 className="text-xl font-semibold">Language & Localization</h3>
        <p className="text-gray-400 text-sm">Customize how things appear based on your language and region.</p>

        <div>
          <Label className="block text-sm mb-2 text-gray-400">Language</Label>
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
      </div> */}

      {/* <div className="space-y-6 pt-10">
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
          <button onClick={() => setFormData(prev => ({ ...prev, preferences: prefs }))} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
            Save Preferences
          </button>
        </div>
      </div> */}
    </div>
  );
};
