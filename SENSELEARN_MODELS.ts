// ============================================================
// SenseLearn — Data Models
// Complete TypeScript interfaces for all 18+ data entities
// ============================================================

// ---- Enums ----

export type UserRole = 'learner' | 'educator' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type LearningPreference = 'visual' | 'audio' | 'text' | 'interactive' | 'mixed';

export type SupportPreference =
  | 'larger_text'
  | 'audio_assistance'
  | 'step_by_step'
  | 'hints'
  | 'repetition'
  | 'reduced_complexity'
  | 'extra_time';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type SkillLevel = 'strong' | 'good' | 'developing' | 'needs_practice';

export type ActivityType =
  | 'visual_matching'
  | 'drag_and_drop'
  | 'multiple_choice'
  | 'ordering'
  | 'memory'
  | 'pattern_recognition'
  | 'problem_solving'
  | 'reading'
  | 'scenario'
  | 'audio_recognition'
  | 'life_skill'
  | 'true_false'
  | 'image_choice'
  | 'matching';

export type QuestionType =
  | 'multiple_choice'
  | 'image_choice'
  | 'matching'
  | 'ordering'
  | 'true_false'
  | 'scenario'
  | 'pattern_recognition'
  | 'memory';

export type LearningMode = 'visual' | 'audio' | 'text' | 'interactive' | 'multisensory';

export type EventType =
  | 'activity_started'
  | 'question_viewed'
  | 'answer_submitted'
  | 'hint_used'
  | 'question_skipped'
  | 'retry_attempt'
  | 'activity_paused'
  | 'activity_resumed'
  | 'activity_completed';

export type EngagementStatus =
  | 'highly_engaged'
  | 'engaged'
  | 'moderately_engaged'
  | 'low_engagement';

export type NotificationType =
  | 'recommendation'
  | 'assessment_completed'
  | 'progress_milestone'
  | 'educator_feedback'
  | 'new_activity'
  | 'learning_reminder';

export type ActivityStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

// ---- Core Entities ----

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LearnerProfile {
  id: string;
  userId: string;
  currentLevel: number;
  learningPreferences: LearningPreference[];
  supportPreferences: SupportPreference[];
  selectedDomains: string[];
  onboardingCompleted: boolean;
  baselineCompleted: boolean;
  totalActivitiesCompleted: number;
  totalAssessmentsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducatorProfile {
  id: string;
  userId: string;
  specialization?: string;
  assignedLearnerIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  domainId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface SkillScore {
  skillId: string;
  skillName: string;
  domainId: string;
  domainName: string;
  score: number;
  level: SkillLevel;
  previousScore?: number;
  assessedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  domainId: string;
  skillId: string;
  difficulty: Difficulty;
  activityType: ActivityType;
  learningMode: LearningMode;
  estimatedMinutes: number;
  points: number;
  questionIds: string[];
  instructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  domainId: string;
  skillId: string;
  difficulty: Difficulty;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  hint?: string;
  explanation?: string;
  imageUrl?: string;
  audioText?: string;
  matchingPairs?: MatchingPair[];
  orderItems?: string[];
  points: number;
  isActive: boolean;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Assessment {
  id: string;
  learnerId: string;
  type: 'baseline' | 'periodic' | 'domain';
  status: 'in_progress' | 'completed';
  questionIds: string[];
  currentQuestionIndex: number;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  skillScores: SkillScore[];
  createdAt: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  questionId: string;
  learnerId: string;
  answer: string | string[];
  isCorrect: boolean;
  responseTimeMs: number;
  attemptNumber: number;
  hintUsed: boolean;
  skipped: boolean;
  domainId: string;
  skillId: string;
  difficulty: Difficulty;
  timestamp: string;
}

export interface LearningSession {
  id: string;
  learnerId: string;
  activityId: string;
  status: ActivityStatus;
  startedAt: string;
  pausedAt?: string;
  completedAt?: string;
  totalTimeMs: number;
  questionsAttempted: number;
  questionsCorrect: number;
  hintsUsed: number;
  retryCount: number;
  accuracy: number;
  difficultyAtStart: Difficulty;
  difficultyAtEnd: Difficulty;
  score: number;
  maxScore: number;
}

export interface InteractionEvent {
  id: string;
  learnerId: string;
  sessionId: string;
  activityId: string;
  questionId?: string;
  eventType: EventType;
  timestamp: string;
  responseTimeMs?: number;
  attemptNumber?: number;
  success?: boolean;
  metadata?: Record<string, unknown>;
}

export interface EngagementProfile {
  id: string;
  learnerId: string;
  overallScore: number;
  status: EngagementStatus;
  interactionConsistency: number;
  completionRate: number;
  accuracy: number;
  persistence: number;
  responseStability: number;
  calculatedAt: string;
  sessionCount: number;
  history: EngagementSnapshot[];
}

export interface EngagementSnapshot {
  score: number;
  status: EngagementStatus;
  calculatedAt: string;
}

export interface Recommendation {
  id: string;
  learnerId: string;
  activityId: string;
  reason: string;
  priority: number;
  type: 'strength' | 'practice' | 'next_level' | 'review';
  isCompleted: boolean;
  createdAt: string;
}

export interface ProgressRecord {
  id: string;
  learnerId: string;
  date: string;
  activitiesCompleted: number;
  assessmentsCompleted: number;
  averageAccuracy: number;
  averageEngagement: number;
  level: number;
  skillScores: SkillScore[];
  totalTimeMs: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AccessibilitySettings {
  userId: string;
  textSize: 'normal' | 'large' | 'extra_large';
  contrast: 'normal' | 'high';
  audioAssistance: boolean;
  reducedMotion: boolean;
  readingAssistance: boolean;
  interactionGuidance: boolean;
}

export interface PlatformSettings {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  updatedAt: string;
}

// ---- Adaptive Engine Types ----

export interface AdaptationResult {
  newDifficulty: Difficulty;
  showHint: boolean;
  explanation: string;
  recommendationType?: 'next_level' | 'additional_practice' | 'guided_activity';
}

export interface PerformanceSnapshot {
  accuracy: number;
  responseTimeMs: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  hintsUsed: number;
  currentDifficulty: Difficulty;
}
