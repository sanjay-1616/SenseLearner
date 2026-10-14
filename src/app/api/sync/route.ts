// ============================================================
// SenseLearn — Data Synchronization API Route
// Synchronizes client-side assessment completions and learner
// profiles with the persistent SQLite database
// ============================================================

import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/server/sqlite-db';
import { db } from '@/lib/data/store';
import type { Assessment, LearnerProfile } from '@/lib/data/models';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, assessment, profile, learnerId } = body;

    if (action === 'save_assessment' && assessment) {
      // Persist in SQLite
      sqliteDb.saveAssessment(assessment as Assessment);
      // Persist in Memory Store
      const existing = db.assessments.findById(assessment.id);
      if (existing) {
        db.assessments.update(assessment.id, assessment);
      } else {
        db.assessments.create(assessment as Assessment);
      }

      // If assessment is completed baseline, update learner profile
      if (assessment.type === 'baseline' && assessment.status === 'completed' && assessment.learnerId) {
        sqliteDb.updateLearnerProfile(assessment.learnerId, {
          baselineCompleted: true,
          onboardingCompleted: true,
          lastActivityAt: new Date().toISOString(),
        });
        const memProf = db.learnerProfiles.findByUserId(assessment.learnerId);
        if (memProf) {
          db.learnerProfiles.update(memProf.id, {
            baselineCompleted: true,
            onboardingCompleted: true,
            lastActivityAt: new Date().toISOString(),
          });
        }
      }

      return NextResponse.json({ success: true, message: 'Assessment persisted successfully.' });
    }

    if (action === 'update_profile' && learnerId && profile) {
      sqliteDb.updateLearnerProfile(learnerId, profile as Partial<LearnerProfile>);
      const memProf = db.learnerProfiles.findByUserId(learnerId);
      if (memProf) {
        db.learnerProfiles.update(memProf.id, profile);
      }
      return NextResponse.json({ success: true, message: 'Learner profile persisted successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid sync action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}
