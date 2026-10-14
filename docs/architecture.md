# SenseLearn — System Architecture & Engineering Documentation

**Interactive Multisensory Learning & Real-Time Student Engagement Profiling Platform**

---

## 1. Architectural Overview

SenseLearn is an adaptive learning platform that supports learners with diverse learning requirements. Its core architectural principle is:

```
ASSESS → PROFILE → PERSONALIZE → LEARN → TRACK → ANALYZE → ADAPT → REASSESS
```

### Layered Modular Design
```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│  (Next.js App Router, React 19, Tailwind CSS, Lucide)  │
├────────────────────────────────────────────────────────┤
│                   Application Layer                    │
│      (Role-Based Navigation, Onboarding, Layouts)      │
├────────────────────────────────────────────────────────┤
│                 Decoupled Core Engines                 │
│  • Adaptive Engine (Rule-Based Difficulty Scaling)     │
│  • Engagement Engine (5-Part Weighted Telemetry Index) │
│  • Recommendation Engine (Data-Backed Curated Paths)   │
├────────────────────────────────────────────────────────┤
│                     Service Layer                      │
│  (Auth, Assessment, Activity, Interaction Tracking,    │
│   Learner Profile, Recommendations, Analytics, Notifs) │
├────────────────────────────────────────────────────────┤
│                   Data & Store Layer                   │
│  • In-Memory Store with Repository Pattern (Active)    │
│  • PostgreSQL / MySQL Schema (Database Ready)          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Intelligent Engines (Pure Functions)

### A. Real-Time Engagement Indicator Engine (`src/lib/engine/engagement-engine.ts`)
The Engagement Indicator calculates a continuous 0–100 score from observable interaction telemetry:
- **Interaction Consistency (30%)**: Event frequency and persistent participation.
- **Task Completion (25%)**: Ratio of finished activities to started sessions.
- **Observed Accuracy (20%)**: Solution correctness across recorded sessions.
- **Persistence (15%)**: Retry attempts and constructive hint usage.
- **Response Stability (10%)**: Pacing coefficient of variation (thoughtful cadence vs frantic clicks).

> **Pedagogical Telemetry Compliance**: The platform calculates scores strictly from educational interactions. It never diagnoses disabilities, detects medical/psychological conditions, or infers emotional states.

### B. Adaptive Learning Engine (`src/lib/engine/adaptive-engine.ts`)
Applies transparent rule-based difficulty adjustments with human-readable explanations:
- **Rule 1 (≥80% Accuracy)**: Increase difficulty level (Beginner → Intermediate → Advanced).
- **Rule 2 (50%–79% Accuracy)**: Maintain current difficulty for consolidation.
- **Rule 3 (<50% Accuracy)**: Reduce difficulty and activate scaffolding support.
- **Rule 4 (≥2 Consecutive Mistakes)**: Automatically reveal step-by-step hints.
- **Rule 5 (High Response Latency >30s)**: Suggest guided step-by-step practice.
- **Rule 6 (Consecutive Successes ≥3)**: Recommend next-level challenge.
- **Rule 7 (Repeated Mistakes ≥3)**: Recommend foundational reinforcement.

### C. Recommendation Engine (`src/lib/engine/recommendation-engine.ts`)
Synthesizes diagnostic baseline scores, active learning preferences (Visual, Audio, Interactive), developing skills, and engagement metrics into curated practice cards with transparent rationale.

---

## 3. Multisensory Implementation

Multisensory learning is integrated into all 30 activities and 100+ questions:
1. **Text**: Clear typography and structured instructions.
2. **Visual**: Geometric diagrams, color associations, and pattern matrices.
3. **Audio**: Browser `SpeechSynthesis` Web API narration with instant voice playback.
4. **Interaction**: Clickable option tiles, drag/swap ordering sequences, and matching pair selectors.

---

## 4. Universal Accessibility Center

Dynamic CSS variable modulation applied directly to `document.documentElement`:
- **Text Size**: Normal (16px), Large (18px), Extra Large (20px).
- **High Contrast**: High contrast theme with strong borders and dark backgrounds.
- **Reduced Motion**: Disables animation durations and transitions (`prefers-reduced-motion`).
- **Reading Assistance**: Enhanced letter spacing and expanded line height for reading ease.
