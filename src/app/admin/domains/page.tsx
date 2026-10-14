'use client';

// ============================================================
// SenseLearn — Admin Domains & Skills Configuration
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Layers, Search, Plus, Trash2, CheckCircle2,
  Brain, Edit2
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { db } from '@/lib/data/store';
import { generateId } from '@/lib/utils';
import type { Domain, Skill } from '@/lib/data/models';

export default function AdminDomainsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);

  // New domain form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0d9488');

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'admin') {
      authService.switchDemoUser('admin');
      active = authService.getCurrentSession();
    }
    setSession(active);

    setDomains(db.domains.findAll());
    setSkills(db.skills.findAll());
  }, []);

  const handleCreateDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const newDom: Domain = {
      id: `dom-${generateId()}`,
      name,
      description,
      icon: 'Layers',
      color,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.domains.create(newDom);
    setDomains(db.domains.findAll());
    setShowAddDomainModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="admin" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Learning Domains & Skill Taxonomy"
          subtitle="Configure 10 Fundamental Learning Domains & 20+ Skill Dimensions"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Configured Learning Domains ({domains.length})</h2>
                <p className="text-xs text-slate-500">Domains define skill classifications and activity taxonomy</p>
              </div>

              <button
                onClick={() => setShowAddDomainModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Domain</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map((dom) => {
                const domainSkills = skills.filter(s => s.domainId === dom.id);

                return (
                  <div
                    key={dom.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: dom.color }}
                          />
                          <h3 className="text-sm font-bold text-slate-900">{dom.name}</h3>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {domainSkills.length} Skills
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{dom.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Associated Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {domainSkills.map(s => (
                          <span key={s.id} className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Add Domain Modal */}
      {showAddDomainModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Learning Domain</h3>
            <p className="text-xs text-slate-500 mb-6">Add a domain to organize skills and assessments</p>

            <form onSubmit={handleCreateDomain} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Spatial Reasoning"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Pedagogical description of this domain..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme Accent Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer p-1"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDomainModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Create Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
