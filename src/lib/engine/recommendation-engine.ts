// ============================================================
// SenseLearn — Recommendation Engine (Decoupled Pure Logic)
// Generates personalized activity recommendations based on actual
// learner assessment data, skills, preferences, and engagement
// ============================================================

import type {
  Activity, LearnerProfile, SkillScore, EngagementProfile,
  Recommendation, LearningSession
} from '../data/models';
import { generateId } from '../utils';

export interface RecommendationInput {
  learnerProfile: LearnerProfile;
  skillScores: SkillScore[];
  engagementProfile?: EngagementProfile;
  availableActivities: Activity[];
  recentSessions: LearningSession[];
}

/**
 * Generates personalized, data-backed recommendations with transparent reasons
 */
export function generateRecommendations(input: RecommendationInput): Recommendation[] {
  const { learnerProfile, skillScores, engagementProfile, availableActivities, recentSessions } = input;
  const recommendations: Recommendation[] = [];

  const completedActivityIds = new Set(
    recentSessions.filter(s => s.status === 'completed').map(s => s.activityId)
  );

  // 1. Identify Developing Skills (< 65%) needing targeted practice
  const developingSkills = skillScores.filter(s => s.score < 65 || s.level === 'developing' || s.level === 'needs_practice');
  for (const devSkill of developingSkills) {
    const matchingActivity = availableActivities.find(
      a => a.skillId === devSkill.skillId && a.isActive && !completedActivityIds.has(a.id)
    );

    if (matchingActivity) {
      recommendations.push({
        id: `rec-${generateId()}`,
        learnerId: learnerProfile.userId,
        activityId: matchingActivity.id,
        reason: `Additional practice is recommended for your developing ${devSkill.skillName} skill (current diagnostic: ${devSkill.score}%).`,
        priority: 1,
        type: 'practice',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // 2. Identify Strength Skills (>= 80%) ready for advanced challenges
  const strongSkills = skillScores.filter(s => s.score >= 80 || s.level === 'strong');
  for (const strongSkill of strongSkills) {
    const advancedActivity = availableActivities.find(
      a => a.skillId === strongSkill.skillId && a.difficulty === 'advanced' && a.isActive && !completedActivityIds.has(a.id)
    ) || availableActivities.find(
      a => a.skillId === strongSkill.skillId && a.isActive && !completedActivityIds.has(a.id)
    );

    if (advancedActivity && !recommendations.some(r => r.activityId === advancedActivity.id)) {
      recommendations.push({
        id: `rec-${generateId()}`,
        learnerId: learnerProfile.userId,
        activityId: advancedActivity.id,
        reason: `You performed strongly (${strongSkill.score}%) in ${strongSkill.skillName}; ready for next-level challenges!`,
        priority: 2,
        type: 'next_level',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // 3. Multi-Sensory Alignment based on Learning Preferences
  if (learnerProfile.learningPreferences && learnerProfile.learningPreferences.length > 0) {
    const primaryPref = learnerProfile.learningPreferences[0];
    const modeMatches = availableActivities.filter(
      a => (a.learningMode === primaryPref || a.learningMode === 'multisensory') &&
           a.isActive &&
           !completedActivityIds.has(a.id) &&
           !recommendations.some(r => r.activityId === a.id)
    );

    if (modeMatches.length > 0) {
      const topMatch = modeMatches[0];
      recommendations.push({
        id: `rec-${generateId()}`,
        learnerId: learnerProfile.userId,
        activityId: topMatch.id,
        reason: `Curated to match your preferred ${primaryPref.toUpperCase()} & multisensory learning style.`,
        priority: 3,
        type: 'strength',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // 4. Engagement-based recommendation
  if (engagementProfile && engagementProfile.overallScore >= 80) {
    const unattemptedAdvanced = availableActivities.find(
      a => a.difficulty === 'advanced' && a.isActive && !completedActivityIds.has(a.id) && !recommendations.some(r => r.activityId === a.id)
    );

    if (unattemptedAdvanced) {
      recommendations.push({
        id: `rec-${generateId()}`,
        learnerId: learnerProfile.userId,
        activityId: unattemptedAdvanced.id,
        reason: `Your high engagement score (${engagementProfile.overallScore}/100) indicates readiness for deeper analytical activities.`,
        priority: 4,
        type: 'next_level',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Fallback: If no specific recommendation triggers, suggest highest rated uncompleted activity
  if (recommendations.length === 0) {
    const fallbackActivity = availableActivities.find(a => a.isActive && !completedActivityIds.has(a.id)) || availableActivities[0];
    if (fallbackActivity) {
      recommendations.push({
        id: `rec-${generateId()}`,
        learnerId: learnerProfile.userId,
        activityId: fallbackActivity.id,
        reason: 'Recommended starting point to build comprehensive skills across key learning domains.',
        priority: 1,
        type: 'practice',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}
