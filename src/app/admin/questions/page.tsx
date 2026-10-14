'use client';

// ============================================================
// SenseLearn — Admin Question Bank Management
// 100+ diagnostic & interactive items
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Search, Filter, Plus, Trash2, CheckCircle2,
  Volume2, Lightbulb, Check
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { db } from '@/lib/data/store';
import { getDifficultyColor, generateId } from '@/lib/utils';
import { LEARNING_DOMAINS } from '@/lib/constants';
import type { Question, QuestionType, Difficulty } from '@/lib/data/models';

export default function AdminQuestionsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [text, setText] = useState('');
  const [type, setType] = useState<QuestionType>('multiple_choice');
  const [domainId, setDomainId] = useState('dom-pat');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'admin') {
      authService.switchDemoUser('admin');
      active = authService.getCurrentSession();
    }
    setSession(active);

    setQuestions(db.questions.findAll());
  }, []);

  const handleDeleteQuestion = (id: string) => {
    db.questions.delete(id);
    setQuestions(db.questions.findAll());
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: `qst-custom-${generateId()}`,
      text,
      type,
      domainId,
      skillId: 'skl-pat-1',
      difficulty,
      options: [
        { id: 'opt-1', text: 'Option A (Correct Solution)', isCorrect: true },
        { id: 'opt-2', text: 'Option B (Distractor)', isCorrect: false },
        { id: 'opt-3', text: 'Option C (Distractor)', isCorrect: false },
      ],
      correctAnswer: 'opt-1',
      hint,
      explanation,
      points: 10,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.questions.create(newQ);
    setQuestions(db.questions.findAll());
    setShowAddModal(false);
    setText('');
    setHint('');
    setExplanation('');
  };

  const filtered = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === 'all' || q.domainId === domainFilter;
    const matchesType = typeFilter === 'all' || q.type === typeFilter;
    return matchesSearch && matchesDomain && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="admin" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Question Bank Repository"
          subtitle="Manage 100+ Diagnostic & Multisensory Assessment Questions"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Question Repository ({filtered.length})</h2>
                <p className="text-xs text-slate-500">Configure questions, hints, explanations, and multimodal speech cues</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search question text..."
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
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Question Prompt</th>
                    <th className="pb-3 font-semibold">Domain</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Difficulty</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((q) => {
                    const dom = db.domains.findById(q.domainId);

                    return (
                      <tr key={q.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 max-w-md">
                          <span className="font-bold text-slate-900 block line-clamp-2">{q.text}</span>
                          {q.hint && (
                            <span className="text-[10px] text-amber-700 mt-0.5 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-amber-600" />
                              Hint: {q.hint}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-800">
                          {dom?.name || 'General'}
                        </td>
                        <td className="py-3.5">
                          <span className="text-[10px] font-semibold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded">
                            {q.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition"
                            title="Delete Question"
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

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Question to Bank</h3>
            <p className="text-xs text-slate-500 mb-6">Create questions with hints and explanations</p>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder="Enter clear, accessible question text..."
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
                <label className="block font-semibold text-slate-700 mb-1">Scaffolding Hint</label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Helpful clue without giving the answer..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Educational Explanation</label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Pedagogical solution explanation..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
