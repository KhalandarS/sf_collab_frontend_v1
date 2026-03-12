/**
 * VisionReadinessCard
 * Displays the Vision Readiness Score, breakdown, and what the vision still needs.
 * Drop this into any Idea/Vision detail page.
 *
 * Usage:
 *   <VisionReadinessCard ideaId={idea.id} initialData={idea} />
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, CheckCircle, Circle, AlertCircle, ArrowRight,
  Users, Map, Lightbulb, TrendingUp, RefreshCw, Zap,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/config';

// ── helpers ────────────────────────────────────────────────────────────────

const getToken = () =>
  localStorage.getItem('accessToken') ||
  localStorage.getItem('token') ||
  sessionStorage.getItem('accessToken') || '';

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use(cfg => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// State badge colours
const STATE_CONFIG = {
  draft:                { label: 'Draft',                color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  public:               { label: 'Public',               color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  team_forming:         { label: 'Team Forming',         color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  ready_for_activation: { label: 'Ready for Activation', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  archived:             { label: 'Archived',             color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

// Breakdown categories and icons
const BREAKDOWN_META = {
  roadmap:                { label: 'Roadmap defined',       icon: Map,        max: 20 },
  problem_statement:      { label: 'Problem statement',     icon: Lightbulb,  max: 15 },
  outcome_goal:           { label: 'Outcome goal',          icon: Target,     max: 15 },
  required_roles:         { label: 'Required roles listed', icon: Users,      max: 10 },
  collaborators:          { label: 'Collaborators joined',  icon: Users,      max: 20 },
  collaborator_interest:  { label: 'Collaborator interest', icon: TrendingUp, max: 10 },
  activity:               { label: 'Recent activity',       icon: Zap,        max: 10 },
};

// ── main component ─────────────────────────────────────────────────────────

const VisionReadinessCard = ({ ideaId, initialData = null, isCreator = false, onStateChange }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReadiness = async () => {
    try {
      const res = await api.get(`/ideas/${ideaId}/readiness`);
      if (res.data?.data) setData(prev => ({ ...prev, ...res.data.data }));
    } catch (err) {
      console.error('VisionReadinessCard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!initialData) fetchReadiness();
  }, [ideaId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReadiness();
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-8 bg-white/10 rounded w-1/2 mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 bg-white/10 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  const score = data?.readinessScore ?? data?.readiness_score ?? 0;
  const breakdown = data?.readinessBreakdown ?? data?.readiness_breakdown ?? {};
  const needs = data?.readinessNeeds ?? data?.readiness_needs ?? [];
  const visionState = data?.visionState ?? data?.vision_state ?? 'public';
  const stateConfig = STATE_CONFIG[visionState] || STATE_CONFIG.public;

  // Score ring
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Vision Readiness</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${stateConfig.color}`}>
              {stateConfig.label}
            </span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Score ring + number */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <motion.circle
              cx="48" cy="48" r={radius} fill="none"
              stroke={scoreColor} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{Math.round(score)}%</span>
          </div>
        </div>

        <div className="flex-1">
          {score >= 70 ? (
            <p className="text-green-400 font-medium mb-1">Ready for activation!</p>
          ) : score >= 40 ? (
            <p className="text-amber-400 font-medium mb-1">Making progress</p>
          ) : (
            <p className="text-red-400 font-medium mb-1">Needs more signal</p>
          )}
          <p className="text-gray-400 text-sm">
            {score >= 70
              ? 'This vision has enough signal to activate as a startup.'
              : `${Math.round(70 - score)}% more needed to reach activation threshold.`}
          </p>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-3 mb-6">
        {Object.entries(BREAKDOWN_META).map(([key, meta]) => {
          const earned = breakdown[key] ?? 0;
          const pct = (earned / meta.max) * 100;
          const Icon = meta.icon;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400">{meta.label}</span>
                </div>
                <span className="text-xs text-gray-500">{earned}/{meta.max}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: pct === 100 ? '#22c55e' : '#3b82f6' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* What this vision needs */}
      {needs.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-300 text-sm font-medium mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Needs:
          </p>
          <ul className="space-y-1">
            {needs.map((need, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-amber-200/80">
                <Circle className="w-3 h-3 flex-shrink-0" />
                {need}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Creator CTA when ready */}
      {isCreator && score >= 70 && visionState !== 'ready_for_activation' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
        >
          <p className="text-green-300 text-sm font-medium mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Vision is ready!
          </p>
          <p className="text-green-200/70 text-xs mb-3">
            You have enough signal to activate this vision as a startup.
          </p>
          <button
            onClick={() => onStateChange?.('ready_for_activation')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors"
          >
            Mark as Ready for Activation
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default VisionReadinessCard;