// ============================================================
// SenseLearn — Engagement Service
// Manages calculation and persistence of learner Engagement Indicator profiles
// ============================================================

import { db } from '../data/store';
import type { EngagementProfile } from '../data/models';
import {
  calculateEngagementMetrics,
  buildEngagementProfileUpdate
} from '../engine/engagement-engine';

export const engagementService = {
  /**
   * Recalculates and updates the engagement indicator profile for a learner
   */
  recalculateForLearner(learnerId: string): EngagementProfile {
    const sessions = db.learningSessions.findByLearner(learnerId);
    const events = db.interactionEvents.findByLearner(learnerId);
    const existingProfile = db.engagementProfiles.findByLearner(learnerId);

    const metrics = calculateEngagementMetrics({
      learnerId,
      sessions,
      events,
      previousProfile: existingProfile,
    });

    const updatedProfile = buildEngagementProfileUpdate(
      existingProfile,
      metrics,
      learnerId,
      sessions.length
    );

    if (existingProfile) {
      db.engagementProfiles.update(existingProfile.id, updatedProfile);
    } else {
      db.engagementProfiles.create(updatedProfile);
    }

    return updatedProfile;
  },

  /**
   * Retrieve current engagement profile for a learner
   */
  getLearnerEngagement(learnerId: string): EngagementProfile | undefined {
    let profile = db.engagementProfiles.findByLearner(learnerId);
    if (!profile) {
      profile = this.recalculateForLearner(learnerId);
    }
    return profile;
  },

  /**
   * Calculate cohort-wide average engagement metrics for educator dashboard
   */
  getCohortEngagementStats(): {
    averageScore: number;
    distribution: Record<string, number>;
    componentAverages: {
      consistency: number;
      completion: number;
      accuracy: number;
      persistence: number;
      stability: number;
    };
  } {
    const profiles = db.engagementProfiles.findAll();
    if (profiles.length === 0) {
      return {
        averageScore: 75,
        distribution: { highly_engaged: 0, engaged: 0, moderately_engaged: 0, low_engagement: 0 },
        componentAverages: { consistency: 75, completion: 75, accuracy: 75, persistence: 75, stability: 75 },
      };
    }

    const total = profiles.reduce((sum, p) => sum + p.overallScore, 0);
    const avgScore = Math.round(total / profiles.length);

    const distribution = {
      highly_engaged: profiles.filter(p => p.status === 'highly_engaged').length,
      engaged: profiles.filter(p => p.status === 'engaged').length,
      moderately_engaged: profiles.filter(p => p.status === 'moderately_engaged').length,
      low_engagement: profiles.filter(p => p.status === 'low_engagement').length,
    };

    const componentAverages = {
      consistency: Math.round(profiles.reduce((sum, p) => sum + p.interactionConsistency, 0) / profiles.length),
      completion: Math.round(profiles.reduce((sum, p) => sum + p.completionRate, 0) / profiles.length),
      accuracy: Math.round(profiles.reduce((sum, p) => sum + p.accuracy, 0) / profiles.length),
      persistence: Math.round(profiles.reduce((sum, p) => sum + p.persistence, 0) / profiles.length),
      stability: Math.round(profiles.reduce((sum, p) => sum + p.responseStability, 0) / profiles.length),
    };

    return {
      averageScore: avgScore,
      distribution,
      componentAverages,
    };
  },
};
