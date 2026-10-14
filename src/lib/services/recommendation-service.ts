// ============================================================
// SenseLearn — Recommendation Service
// Coordinates data inputs and generates personalized activity recommendations
// ============================================================

import { db } from '../data/store';
import type { Recommendation } from '../data/models';
import { generateRecommendations } from '../engine/recommendation-engine';

export const recommendationService = {
  /**
   * Get active recommendations for a learner
   */
  getRecommendationsForLearner(learnerId: string): (Recommendation & { activityTitle?: string; activityDescription?: string; domainName?: string; difficulty?: string })[] {
    let recs = db.recommendations.findActiveByLearner(learnerId);

    // If no recommendations exist yet, generate them fresh
    if (recs.length === 0) {
      this.refreshRecommendations(learnerId);
      recs = db.recommendations.findActiveByLearner(learnerId);
    }

    return recs.map(r => {
      const act = db.activities.findById(r.activityId);
      const dom = act ? db.domains.findById(act.domainId) : undefined;
      return {
        ...r,
        activityTitle: act?.title || 'Interactive Practice Activity',
        activityDescription: act?.description || 'Customized practice tailored to your current learning profile.',
        domainName: dom?.name || 'General',
        difficulty: act?.difficulty || 'beginner',
      };
    });
  },

  /**
   * Re-evaluates learner state and generates fresh personalized recommendations
   */
  refreshRecommendations(learnerId: string): Recommendation[] {
    const profile = db.learnerProfiles.findByUserId(learnerId);
    if (!profile) return [];

    const skillScores = db.getSkillScores(learnerId);
    const engagement = db.engagementProfiles.findByLearner(learnerId);
    const availableActivities = db.activities.findActive();
    const recentSessions = db.learningSessions.findByLearner(learnerId);

    const generated = generateRecommendations({
      learnerProfile: profile,
      skillScores,
      engagementProfile: engagement,
      availableActivities,
      recentSessions,
    });

    for (const rec of generated) {
      const existing = db.recommendations.findByLearner(learnerId).find(r => r.activityId === rec.activityId);
      if (!existing) {
        db.recommendations.create(rec);
      }
    }

    return generated;
  },

  /**
   * Mark recommendation as completed
   */
  markCompleted(recommendationId: string): void {
    db.recommendations.update(recommendationId, { isCompleted: true });
  },
};
