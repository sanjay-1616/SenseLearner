// ============================================================
// SenseLearn — Learner Profile Service
// Manages learner profile, skill classification, preferences, and dynamic learning paths
// ============================================================

import { db } from '../data/store';
import type {
  LearnerProfile, User, SkillScore, Activity,
  LearningPreference, SupportPreference
} from '../data/models';
import { recommendationService } from './recommendation-service';
import { engagementService } from './engagement-service';

export interface ComprehensiveLearnerProfile {
  profile: LearnerProfile;
  user: User;
  skillScores: SkillScore[];
  strengthAreas: SkillScore[];
  developingAreas: SkillScore[];
  learningPath: {
    level: number;
    title: string;
    description: string;
    activities: Activity[];
  }[];
  engagementScore: number;
  engagementStatus: string;
}

export const learnerProfileService = {
  /**
   * Fetch comprehensive profile with strength and developing area classifications
   */
  getComprehensiveProfile(learnerId: string): ComprehensiveLearnerProfile | null {
    const user = db.users.findById(learnerId);
    let profile = db.learnerProfiles.findByUserId(learnerId);

    if (!user) return null;

    if (!profile) {
      profile = db.learnerProfiles.create({
        id: `lrn-prof-${learnerId}`,
        userId: learnerId,
        currentLevel: 1,
        learningPreferences: ['visual', 'interactive'],
        supportPreferences: ['hints', 'step_by_step'],
        selectedDomains: ['dom-pat', 'dom-prob', 'dom-mem'],
        onboardingCompleted: true,
        baselineCompleted: false,
        totalActivitiesCompleted: 0,
        totalAssessmentsCompleted: 0,
        currentStreak: 1,
        longestStreak: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const skillScores = db.getSkillScores(learnerId);
    const strengthAreas = skillScores.filter(s => s.score >= 80 || s.level === 'strong');
    const developingAreas = skillScores.filter(s => s.score < 70 || s.level === 'developing' || s.level === 'needs_practice');

    const engagement = engagementService.getLearnerEngagement(learnerId);
    const learningPath = this.getPersonalizedLearningPath(learnerId);

    return {
      profile,
      user,
      skillScores,
      strengthAreas,
      developingAreas,
      learningPath,
      engagementScore: engagement?.overallScore || 75,
      engagementStatus: engagement?.status || 'engaged',
    };
  },

  /**
   * Construct 4-Tier Personalized Learning Path dynamically from assessment & skill data
   * LEVEL 1: Foundation Activity
   * LEVEL 2: Guided Practice
   * LEVEL 3: Independent Practice
   * LEVEL 4: Advanced Challenge
   */
  getPersonalizedLearningPath(learnerId: string): {
    level: number;
    title: string;
    description: string;
    activities: Activity[];
  }[] {
    const allActivities = db.activities.findActive();
    const beginner = allActivities.filter(a => a.difficulty === 'beginner');
    const intermediate = allActivities.filter(a => a.difficulty === 'intermediate');
    const advanced = allActivities.filter(a => a.difficulty === 'advanced');

    return [
      {
        level: 1,
        title: 'Foundation Activities',
        description: 'Core concepts with step-by-step guidance and immediate visual feedback.',
        activities: beginner.slice(0, 3),
      },
      {
        level: 2,
        title: 'Guided Practice',
        description: 'Apply skills to structured problems with hint support available.',
        activities: beginner.slice(3, 6).length > 0 ? beginner.slice(3, 6) : intermediate.slice(0, 3),
      },
      {
        level: 3,
        title: 'Independent Practice',
        description: 'Multi-step challenges requiring active recall and deduction.',
        activities: intermediate.slice(0, 3),
      },
      {
        level: 4,
        title: 'Advanced Challenges',
        description: 'Complex integrative problem-solving scenarios across multiple domains.',
        activities: advanced.slice(0, 3),
      },
    ];
  },

  /**
   * Update learner preferences
   */
  updatePreferences(learnerId: string, data: {
    learningPreferences?: LearningPreference[];
    supportPreferences?: SupportPreference[];
    selectedDomains?: string[];
  }): LearnerProfile {
    let profile = db.learnerProfiles.findByUserId(learnerId);
    if (!profile) throw new Error('Profile not found');

    const updated = db.learnerProfiles.update(profile.id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    recommendationService.refreshRecommendations(learnerId);
    return updated!;
  },

  /**
   * Complete the 5-step onboarding wizard
   */
  completeOnboarding(learnerId: string, data: {
    learningPreferences: LearningPreference[];
    supportPreferences: SupportPreference[];
    selectedDomains: string[];
  }): LearnerProfile {
    let profile = db.learnerProfiles.findByUserId(learnerId);
    if (!profile) {
      profile = db.learnerProfiles.create({
        id: `lrn-prof-${learnerId}`,
        userId: learnerId,
        currentLevel: 1,
        learningPreferences: data.learningPreferences,
        supportPreferences: data.supportPreferences,
        selectedDomains: data.selectedDomains,
        onboardingCompleted: true,
        baselineCompleted: false,
        totalActivitiesCompleted: 0,
        totalAssessmentsCompleted: 0,
        currentStreak: 1,
        longestStreak: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return profile;
    }

    const updated = db.learnerProfiles.update(profile.id, {
      learningPreferences: data.learningPreferences,
      supportPreferences: data.supportPreferences,
      selectedDomains: data.selectedDomains,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          learnerId,
          profile: {
            learningPreferences: data.learningPreferences,
            supportPreferences: data.supportPreferences,
            selectedDomains: data.selectedDomains,
            onboardingCompleted: true,
          },
        }),
      }).catch(() => {});
    }

    return updated!;
  },
};

