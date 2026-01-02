/* ---------------------- NotificationSection ---------------------- */
export default function NotificationSection({ formData, onChange }) {
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
          <button onClick={() => onChange()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">Save Notifications</button>
        </div>
      </div>
    </div>
  );
};
