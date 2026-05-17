import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Calendar, Settings, Shield, 
  Plus, Search, MoreHorizontal, UserX, 
  UserCheck, Trash2, Edit3, Globe, 
  Lock, Bell, Mail, AlertTriangle
} from "lucide-react";
import { GlassCard } from "./components/GlassCard";
import { SectionHeader } from "./components/SectionHeader";
import { Modal } from "./components/Modal";
import { INITIAL_MEMBERS, INITIAL_HOLIDAYS } from "./data/adminMockData";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!newMemberEmail) return;
    const newMem = {
      id: Date.now(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: "Member",
      status: "Pending",
      joined: new Date().toISOString().split('T')[0]
    };
    setMembers([newMem, ...members]);
    setIsInviteOpen(false);
    setNewMemberEmail("");
  };

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) return;
    setHolidays([...holidays, { id: Date.now(), ...newHoliday }]);
    setIsHolidayOpen(false);
    setNewHoliday({ name: "", date: "" });
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const removeHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all text-xs font-bold uppercase tracking-widest ${
        activeTab === id 
        ? "border-indigo-500 text-white bg-white/5" 
        : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 lg:p-8 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-white">Workspace Admin</h1>
        <p className="text-zinc-500 text-xs font-bold mt-1 uppercase tracking-widest">Manage members, policies, and configuration</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/5 mb-8 overflow-x-auto custom-scrollbar">
        <TabButton id="users" label="User Management" icon={Users} />
        <TabButton id="holidays" label="Holidays" icon={Calendar} />
        <TabButton id="general" label="Configuration" icon={Settings} />
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* USERS TAB */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <button 
                  onClick={() => setIsInviteOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={16} />
                  Invite Member
                </button>
              </div>

              <GlassCard className="overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Member</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Joined</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMembers.map(member => (
                      <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-sm text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{member.name}</div>
                              <div className="text-[10px] text-zinc-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            {member.role === 'Admin' ? <Shield size={14} className="text-purple-400" /> : <Users size={14} className="text-blue-400" />}
                            <span className={member.role === 'Admin' ? 'text-purple-400' : 'text-blue-400'}>{member.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                            member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-xs font-bold">{member.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit Role">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => removeMember(member.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Remove User">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </motion.div>
          )}

          {/* HOLIDAYS TAB */}
          {activeTab === "holidays" && (
            <motion.div key="holidays" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <SectionHeader title="Workspace Holidays" />
                <button 
                  onClick={() => setIsHolidayOpen(true)}
                  className="flex items-center gap-2 bg-white/10 text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  <Plus size={16} />
                  Add Holiday
                </button>
              </div>
              
              <div className="grid gap-4">
                {holidays.map(holiday => (
                  <GlassCard key={holiday.id} className="p-5 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{holiday.name}</div>
                        <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{holiday.date}</div>
                      </div>
                    </div>
                    <button onClick={() => removeHoliday(holiday.id)} className="text-zinc-500 hover:text-red-400 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </GlassCard>
                ))}
                {holidays.length === 0 && (
                  <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01]">
                    <p className="text-sm font-bold text-zinc-400">No holidays configured</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex gap-3">
                <Calendar className="text-indigo-400 shrink-0" size={18} />
                <p className="text-[11px] text-indigo-200/70 leading-relaxed font-medium">
                  Holidays added here will automatically disable attendance tracking alerts for all workspace members on those specific dates.
                </p>
              </div>
            </motion.div>
          )}

          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl">
                <SectionHeader title="Configuration" />
                
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      Workspace Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      defaultValue="SF Collab Main"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Company Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                      type="text" 
                      defaultValue="sfcollab.com"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Default Currency</label>
                    <select className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timezone</label>
                    <select className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer">
                      <option>UTC (GMT+0)</option>
                      <option>EST (GMT-5)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="mt-16 space-y-4">
                <SectionHeader title="Danger Zone" />
                <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-sm">Delete Workspace</div>
                    <div className="text-[11px] text-red-200/50 mt-1">Permanently remove all data, users, and tasks.</div>
                  </div>
                  <button 
                    onClick={() => setIsDeleteOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODALS */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Member">
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">An invitation email will be sent to the user to join this workspace.</p>
          <input 
            type="email" 
            placeholder="user@example.com"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none" 
            required
          />
          <button 
            onClick={handleInvite}
            disabled={!newMemberEmail}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm mt-2 disabled:opacity-50 hover:bg-indigo-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Send Invitation
          </button>
        </div>
      </Modal>

      <Modal isOpen={isHolidayOpen} onClose={() => setIsHolidayOpen(false)} title="Add Holiday">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="E.g., Company Offsite"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none custom-calendar-icon cursor-pointer" 
              required
            />
          </div>
          <button 
            onClick={handleAddHoliday}
            disabled={!newHoliday.name || !newHoliday.date}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm mt-4 disabled:opacity-50 hover:bg-indigo-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Save Holiday
          </button>
        </div>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Workspace">
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400">
            <AlertTriangle size={20} className="shrink-0" />
            <p className="text-xs font-medium">This action cannot be undone. This will permanently delete the workspace and remove all associated data.</p>
          </div>
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type "DELETE" to confirm</label>
            <input 
              type="text" 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-red-500 outline-none" 
            />
          </div>
          <button 
            onClick={async () => {
              if (deleteConfirmText === "DELETE") {
                setIsDeleteOpen(false);
                setDeleteConfirmText("");
                toast.info("Processing workspace deletion...", { autoClose: 2000 });
                await new Promise(r => setTimeout(r, 2000));
                toast.error("Workspace Deleted Permanently.");
              }
            }}
            disabled={deleteConfirmText !== "DELETE"}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-sm mt-2 disabled:opacity-50 hover:bg-red-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Permanently Delete
          </button>
        </div>
      </Modal>
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { height: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.5; }`}</style>
    </div>
  );
};

export default AdminSettings;
