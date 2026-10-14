'use client';

// ============================================================
// SenseLearn — Landing Page
// ============================================================

import React from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Brain, Eye, Volume2, MousePointerClick,
  Activity, ShieldCheck, Accessibility, CheckCircle2, ChevronRight,
  TrendingUp, Lightbulb, Users, Layers, Award, BookOpen, Check
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/lib/constants';

export default function LandingPage() {
  const workflowSteps = [
    { title: 'ASSESS', desc: 'Diagnostic multi-type baseline' },
    { title: 'PROFILE', desc: 'Non-medical skill mapping' },
    { title: 'PERSONALIZE', desc: '4-Tier tailored pathways' },
    { title: 'LEARN', desc: 'Multisensory interactive tasks' },
    { title: 'TRACK', desc: 'Observable telemetry events' },
    { title: 'ANALYZE', desc: 'Weighted engagement index' },
    { title: 'ADAPT', desc: 'Rule-based difficulty scaling' },
    { title: 'REASSESS', desc: 'Demonstrable growth proof' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-teal-500/20">
              S
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">{APP_NAME}</span>
              <span className="text-[11px] text-slate-500 block -mt-0.5">Adaptive Learning Platform</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-teal-600 transition">How It Works</a>
            <a href="#multisensory" className="hover:text-teal-600 transition">Multisensory</a>
            <a href="#engagement" className="hover:text-teal-600 transition">Real-Time Engagement</a>
            <a href="#educator-insights" className="hover:text-teal-600 transition">Educator Insights</a>
            <a href="#accessibility" className="hover:text-teal-600 transition">Accessibility</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-teal-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Multisensory Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            {APP_TAGLINE}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            {APP_DESCRIPTION}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base rounded-2xl transition shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2"
            >
              <span>START LEARNING</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/educator/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-base rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>EXPLORE PLATFORM</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>

          {/* Workflow Diagram Loop Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-left max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 block">
                  Continuous Intelligence Loop
                </span>
                <h2 className="text-lg font-bold text-slate-900">How SenseLearn Adapts to You</h2>
              </div>
              <span className="text-xs font-medium text-slate-500 hidden sm:block">
                8 Integrated Stages
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {workflowSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center relative group hover:bg-teal-50/50 hover:border-teal-300 transition"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-extrabold flex items-center justify-center mx-auto mb-1.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-slate-900 block mb-0.5 tracking-tight">
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight block">
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Why SenseLearn */}
      <section id="why" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Why SenseLearn is Different
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Standard Learning Management Systems treat every student identically. SenseLearn observes interactions, measures engagement consistency, and transparently adapts content difficulty in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 font-bold text-xl">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Observable Interaction Profiling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We analyze response times, hint requests, attempt frequencies, and persistence to support learners with diverse cognitive and sensory requirements.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 font-bold text-xl">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multisensory Activity Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Content is never static text. Activities seamlessly weave visual diagrams, audio speech synthesis narration, and interactive tactile ordering.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 font-bold text-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Measurable Growth Reassessment</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Demonstrate continuous progress through side-by-side diagnostic reassessments showing clear percentage uplifts across all learning domains.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Multisensory Learning in Action */}
      <section id="multisensory" className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/30">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Multimodal Design</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
                Text. Visuals. Audio. Interaction. All Unified.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                SenseLearn delivers genuine multimodal learning. Learners can hear questions spoken aloud via speech synthesis, examine clear graphic cues, manipulate sequenced tiles, and request contextual hints whenever needed.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Built-in browser SpeechSynthesis narration on all questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Visual matching, drag ordering, and pattern matrix items</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Non-judgmental diagnostic scaffolding and step-by-step guidance</span>
                </div>
              </div>
            </div>

            {/* Activity Card Preview */}
            <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
                  Interactive Preview
                </span>
                <span className="text-xs text-slate-400">Question 1 of 5</span>
              </div>
              <h3 className="text-base font-bold text-white mb-4">
                What shape comes next in this sequence: Circle, Square, Circle, Square, Circle, ___?
              </h3>
              <div className="space-y-2 mb-6">
                <div className="p-3 rounded-xl bg-teal-600/30 border border-teal-500 text-white text-xs font-semibold flex items-center justify-between">
                  <span>Square</span>
                  <Check className="w-4 h-4 text-teal-400" />
                </div>
                <div className="p-3 rounded-xl bg-slate-700/60 border border-slate-600 text-slate-300 text-xs font-medium">
                  <span>Triangle</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-700/60 border border-slate-600 text-slate-300 text-xs font-medium">
                  <span>Star</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 text-xs text-slate-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span>Audio narration enabled • Interactive feedback ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Real-Time Engagement Index */}
      <section id="engagement" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 block mb-2">
            Observable Telemetry
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Learning Engagement Score (0 - 100)
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Calculated from real interactions — not arbitrary guesswork. A 5-part weighted algorithm monitors engagement stability across each session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-2xl font-black text-teal-600 block mb-1">30%</span>
            <span className="text-xs font-bold text-slate-800 block mb-1">Interaction Consistency</span>
            <p className="text-[11px] text-slate-500">Event frequency & active participation</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-2xl font-black text-blue-600 block mb-1">25%</span>
            <span className="text-xs font-bold text-slate-800 block mb-1">Task Completion</span>
            <p className="text-[11px] text-slate-500">Activities finished without early abandonment</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-2xl font-black text-indigo-600 block mb-1">20%</span>
            <span className="text-xs font-bold text-slate-800 block mb-1">Observed Accuracy</span>
            <p className="text-[11px] text-slate-500">Solution correctness rate</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-2xl font-black text-amber-600 block mb-1">15%</span>
            <span className="text-xs font-bold text-slate-800 block mb-1">Persistence</span>
            <p className="text-[11px] text-slate-500">Retry attempts & constructive hint usage</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-2xl font-black text-purple-600 block mb-1">10%</span>
            <span className="text-xs font-bold text-slate-800 block mb-1">Response Stability</span>
            <p className="text-[11px] text-slate-500">Pacing consistency & thoughtful pauses</p>
          </div>
        </div>
      </section>

      {/* Section 4: Educator & Accessibility Hub */}
      <section id="accessibility" className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Educator Column */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Educator Dashboard & Insights</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Educators gain deep visibility into learner cohorts with automated data-backed insights, skill breakdown charts, and engagement distributions.
              </p>
              <Link
                href="/educator/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700"
              >
                <span>View Educator Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Accessibility Column */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <Accessibility className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Universal Accessibility Center</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Dynamic text sizing (Normal/Large/XL), high contrast theme switching, audio narration toggles, and reduced motion modes that immediately adapt the interface.
              </p>
              <Link
                href="/learner/accessibility"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700"
              >
                <span>Explore Accessibility Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Ready for Learning That Truly Adapts?
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the full adaptive cycle: complete onboarding, take your baseline diagnostic, and explore multisensory activities designed for your unique strengths.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-base rounded-2xl transition shadow-lg shadow-teal-500/30"
            >
              CREATE FREE ACCOUNT
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-base rounded-2xl transition"
            >
              SIGN IN WITH DEMO
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-xs text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">{APP_NAME}</span>
            <span>• Educational Technology Platform</span>
          </div>
          <p>© 2026 SenseLearn. Built for learners with diverse learning requirements.</p>
        </div>
      </footer>
    </div>
  );
}
