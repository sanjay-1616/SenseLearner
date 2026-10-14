'use client';

// ============================================================
// SenseLearn — Admin Activity Management
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Puzzle, Search, Filter, Plus, Trash2, CheckCircle2,
  XCircle, Clock, Eye, Layers
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { db } from '@/lib/data/store';
import { getDifficultyColor, generateId } from '@/lib/utils';
import { LEARNING_DOMAINS } from '@/lib/constants';
import type { Activity, Difficulty, ActivityType, LearningMode } from '@/lib/data/models';

export default function AdminActivitiesPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New activity form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domainId, setDomainId] = useState('dom-pat');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [activityType, setActivityType] = useState<ActivityType>('pattern_recognition');
  const [learningMode, setLearningMode] = useState<LearningMode>('multisensory');

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'admin') {
      authService.switchDemoUser('admin');
      active = authService.getCurrentSession();
    }
    setSession(active);

    setActivities(db.activities.findAll());
  }, []);

  const handleToggleActive = (id: string, current: boolean) => {
    db.activities.update(id, { isActive: !current });
    setActivities(db.activities.findAll());
  };

  const handleDeleteActivity = (id: string) => {
    db.activities.delete(id);
    setActivities(db.activities.findAll());
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: Activity = {
      id: `act-custom-${generateId()}`,
      title,
      description,
      domainId,
      skillId: 'skl-pat-1',
      difficulty,
      activityType,
      learningMode,
      estimatedMinutes: 5,
      points: 50,
      questionIds: ['qst-001', 'qst-002'],
      instructions: 'Carefully follow the instructions to solve each challenge.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.activities.create(newAct);
    setActivities(db.activities.findAll());
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const filtered = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === 'all' || a.domainId === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="admin" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Activity Bank Management"
          subtitle="Curate 30+ Interactive Multisensory Learning Modules"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Activity Modules ({filtered.length})</h2>
                <p className="text-xs text-slate-500">Configure learning modes, difficulty, and question assignments</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search activities..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All Domains</option>
                  {LEARNING_DOMAINS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Activity</span>
                </button>
              </div>
            </div>

            {/* Activities Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Activity Title</th>
                    <th className="pb-3 font-semibold">Domain</th>
                    <th className="pb-3 font-semibold">Difficulty</th>
                    <th className="pb-3 font-semibold">Mode</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((act) => {
                    const dom = db.domains.findById(act.domainId);

                    return (
                      <tr key={act.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5">
                          <span className="font-bold text-slate-900 block">{act.title}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-sm block">{act.description}</span>
                        </td>
                        <td className="py-3.5 font-semibold text-slate-800">
                          {dom?.name || 'General'}
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(act.difficulty)}`}>
                            {act.difficulty}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {act.learningMode}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            act.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {act.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleActive(act.id, act.isActive)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold transition"
                          >
                            {act.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Learning Activity</h3>
            <p className="text-xs text-slate-500 mb-6">Define activity attributes and learning modality</p>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Visual Pattern Matrix Lab"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the activity purpose..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                  <select
                    value={domainId}
                    onChange={(e) => setDomainId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
                  >
                    {LEARNING_DOMAINS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Learning Mode</label>
                <select
                  value={learningMode}
                  onChange={(e) => setLearningMode(e.target.value as LearningMode)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
                >
                  <option value="multisensory">Multisensory (Text + Audio + Visual + Interaction)</option>
                  <option value="interactive">Interactive Hands-On</option>
                  <option value="visual">Visual & Spatial</option>
                  <option value="text">Text & Comprehension</option>
                  <option value="audio">Audio Narration Centric</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
