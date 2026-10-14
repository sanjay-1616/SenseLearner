// ============================================================
// SenseLearn — In-Memory Data Store (Repository Pattern)
// ============================================================

import type {
  User, LearnerProfile, EducatorProfile, Domain, Skill, Activity,
  Question, Assessment, AssessmentResponse, LearningSession, InteractionEvent,
  EngagementProfile, Recommendation, ProgressRecord, Notification,
  AccessibilitySettings, PlatformSettings, SkillScore
  , CameraConsent, AssessmentSnapshot
} from './models';
import { seedDatabase } from './seed';

interface DataStore {
  users: User[];
  learnerProfiles: LearnerProfile[];
  educatorProfiles: EducatorProfile[];
  domains: Domain[];
  skills: Skill[];
  activities: Activity[];
  questions: Question[];
  assessments: Assessment[];
  assessmentResponses: AssessmentResponse[];
  learningSessions: LearningSession[];
  interactionEvents: InteractionEvent[];
  engagementProfiles: EngagementProfile[];
  recommendations: Recommendation[];
  progressRecords: ProgressRecord[];
  notifications: Notification[];
  accessibilitySettings: AccessibilitySettings[];
  platformSettings: PlatformSettings[];
  cameraConsents: CameraConsent[];
  assessmentSnapshots: AssessmentSnapshot[];
}

const STORE_LOCAL_KEY = 'senselearn_db_v1';

let store: DataStore | null = null;

function persistStore(): void {
  if (typeof window !== 'undefined' && store) {
    try {
      localStorage.setItem(STORE_LOCAL_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn('Failed to persist store to localStorage:', e);
    }
  }
}

function getStore(): DataStore {
  if (!store) {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORE_LOCAL_KEY);
        if (cached) {
          store = JSON.parse(cached) as DataStore;
        }
      } catch (e) {
        console.warn('Failed to load store from localStorage:', e);
      }
    }
    if (!store) {
      store = seedDatabase();
      persistStore();
    }
  }
  return store;
}

// ---- Generic CRUD helpers ----

function findAll<T>(collection: keyof DataStore): T[] {
  return [...((getStore()[collection] as unknown) as T[])];
}

function findById<T extends { id: string }>(collection: keyof DataStore, id: string): T | undefined {
  return ((getStore()[collection] as unknown) as T[]).find(item => item.id === id);
}

function findBy<T>(collection: keyof DataStore, predicate: (item: T) => boolean): T[] {
  return ((getStore()[collection] as unknown) as T[]).filter(predicate);
}

function findOneBy<T>(collection: keyof DataStore, predicate: (item: T) => boolean): T | undefined {
  return ((getStore()[collection] as unknown) as T[]).find(predicate);
}

function create<T>(collection: keyof DataStore, item: T): T {
  ((getStore()[collection] as unknown) as T[]).push(item);
  persistStore();
  return item;
}

function update<T extends { id: string }>(collection: keyof DataStore, id: string, updates: Partial<T>): T | undefined {
  const items = (getStore()[collection] as unknown) as T[];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  items[index] = { ...items[index], ...updates };
  persistStore();
  return items[index];
}

function remove<T extends { id: string }>(collection: keyof DataStore, id: string): boolean {
  const items = (getStore()[collection] as unknown) as T[];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  persistStore();
  return true;
}

// ---- Repository exports ----

export const db = {
  // Users
  users: {
    findAll: () => findAll<User>('users'),
    findById: (id: string) => findById<User>('users', id),
    findByEmail: (email: string) => findOneBy<User>('users', u => u.email === email),
    findByRole: (role: string) => findBy<User>('users', u => u.role === role),
    create: (user: User) => create<User>('users', user),
    update: (id: string, updates: Partial<User>) => update<User>('users', id, updates),
    delete: (id: string) => remove<User>('users', id),
  },

  // Learner Profiles
  learnerProfiles: {
    findAll: () => findAll<LearnerProfile>('learnerProfiles'),
    findById: (id: string) => findById<LearnerProfile>('learnerProfiles', id),
    findByUserId: (userId: string) => findOneBy<LearnerProfile>('learnerProfiles', p => p.userId === userId),
    create: (profile: LearnerProfile) => create<LearnerProfile>('learnerProfiles', profile),
    update: (id: string, updates: Partial<LearnerProfile>) => update<LearnerProfile>('learnerProfiles', id, updates),
  },

  // Educator Profiles
  educatorProfiles: {
    findAll: () => findAll<EducatorProfile>('educatorProfiles'),
    findById: (id: string) => findById<EducatorProfile>('educatorProfiles', id),
    findByUserId: (userId: string) => findOneBy<EducatorProfile>('educatorProfiles', p => p.userId === userId),
    create: (profile: EducatorProfile) => create<EducatorProfile>('educatorProfiles', profile),
    update: (id: string, updates: Partial<EducatorProfile>) => update<EducatorProfile>('educatorProfiles', id, updates),
  },

  // Domains
  domains: {
    findAll: () => findAll<Domain>('domains'),
    findById: (id: string) => findById<Domain>('domains', id),
    findActive: () => findBy<Domain>('domains', d => d.isActive),
    create: (domain: Domain) => create<Domain>('domains', domain),
    update: (id: string, updates: Partial<Domain>) => update<Domain>('domains', id, updates),
    delete: (id: string) => remove<Domain>('domains', id),
  },

  // Skills
  skills: {
    findAll: () => findAll<Skill>('skills'),
    findById: (id: string) => findById<Skill>('skills', id),
    findByDomain: (domainId: string) => findBy<Skill>('skills', s => s.domainId === domainId),
    findActive: () => findBy<Skill>('skills', s => s.isActive),
    create: (skill: Skill) => create<Skill>('skills', skill),
    update: (id: string, updates: Partial<Skill>) => update<Skill>('skills', id, updates),
    delete: (id: string) => remove<Skill>('skills', id),
  },

  // Activities
  activities: {
    findAll: () => findAll<Activity>('activities'),
    findById: (id: string) => findById<Activity>('activities', id),
    findActive: () => findBy<Activity>('activities', a => a.isActive),
    findByDomain: (domainId: string) => findBy<Activity>('activities', a => a.domainId === domainId),
    findBySkill: (skillId: string) => findBy<Activity>('activities', a => a.skillId === skillId),
    findByDifficulty: (difficulty: string) => findBy<Activity>('activities', a => a.difficulty === difficulty),
    findByType: (type: string) => findBy<Activity>('activities', a => a.activityType === type),
    create: (activity: Activity) => create<Activity>('activities', activity),
    update: (id: string, updates: Partial<Activity>) => update<Activity>('activities', id, updates),
    delete: (id: string) => remove<Activity>('activities', id),
  },

  // Questions
  questions: {
    findAll: () => findAll<Question>('questions'),
    findById: (id: string) => findById<Question>('questions', id),
    findActive: () => findBy<Question>('questions', q => q.isActive),
    findByDomain: (domainId: string) => findBy<Question>('questions', q => q.domainId === domainId),
    findBySkill: (skillId: string) => findBy<Question>('questions', q => q.skillId === skillId),
    findByDifficulty: (difficulty: string) => findBy<Question>('questions', q => q.difficulty === difficulty),
    findByType: (type: string) => findBy<Question>('questions', q => q.type === type),
    findByIds: (ids: string[]) => findBy<Question>('questions', q => ids.includes(q.id)),
    create: (question: Question) => create<Question>('questions', question),
    update: (id: string, updates: Partial<Question>) => update<Question>('questions', id, updates),
    delete: (id: string) => remove<Question>('questions', id),
  },

  // Assessments
  assessments: {
    findAll: () => findAll<Assessment>('assessments'),
    findById: (id: string) => findById<Assessment>('assessments', id),
    findByLearner: (learnerId: string) => findBy<Assessment>('assessments', a => a.learnerId === learnerId),
    findLatestByLearner: (learnerId: string) => {
      const assessments = findBy<Assessment>('assessments', a => a.learnerId === learnerId && a.status === 'completed');
      return assessments.sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())[0];
    },
    create: (assessment: Assessment) => create<Assessment>('assessments', assessment),
    update: (id: string, updates: Partial<Assessment>) => update<Assessment>('assessments', id, updates),
  },

  // Assessment Responses
  assessmentResponses: {
    findAll: () => findAll<AssessmentResponse>('assessmentResponses'),
    findByAssessment: (assessmentId: string) => findBy<AssessmentResponse>('assessmentResponses', r => r.assessmentId === assessmentId),
    findByLearner: (learnerId: string) => findBy<AssessmentResponse>('assessmentResponses', r => r.learnerId === learnerId),
    create: (response: AssessmentResponse) => create<AssessmentResponse>('assessmentResponses', response),
  },

  // Learning Sessions
  learningSessions: {
    findAll: () => findAll<LearningSession>('learningSessions'),
    findById: (id: string) => findById<LearningSession>('learningSessions', id),
    findByLearner: (learnerId: string) => findBy<LearningSession>('learningSessions', s => s.learnerId === learnerId),
    findByActivity: (activityId: string) => findBy<LearningSession>('learningSessions', s => s.activityId === activityId),
    create: (session: LearningSession) => create<LearningSession>('learningSessions', session),
    update: (id: string, updates: Partial<LearningSession>) => update<LearningSession>('learningSessions', id, updates),
  },

  // Interaction Events
  interactionEvents: {
    findAll: () => findAll<InteractionEvent>('interactionEvents'),
    findByLearner: (learnerId: string) => findBy<InteractionEvent>('interactionEvents', e => e.learnerId === learnerId),
    findBySession: (sessionId: string) => findBy<InteractionEvent>('interactionEvents', e => e.sessionId === sessionId),
    findByActivity: (activityId: string) => findBy<InteractionEvent>('interactionEvents', e => e.activityId === activityId),
    findByType: (eventType: string) => findBy<InteractionEvent>('interactionEvents', e => e.eventType === eventType),
    create: (event: InteractionEvent) => create<InteractionEvent>('interactionEvents', event),
  },

  // Engagement Profiles
  engagementProfiles: {
    findAll: () => findAll<EngagementProfile>('engagementProfiles'),
    findById: (id: string) => findById<EngagementProfile>('engagementProfiles', id),
    findByLearner: (learnerId: string) => findOneBy<EngagementProfile>('engagementProfiles', e => e.learnerId === learnerId),
    create: (profile: EngagementProfile) => create<EngagementProfile>('engagementProfiles', profile),
    update: (id: string, updates: Partial<EngagementProfile>) => update<EngagementProfile>('engagementProfiles', id, updates),
  },

  // Recommendations
  recommendations: {
    findAll: () => findAll<Recommendation>('recommendations'),
    findByLearner: (learnerId: string) => findBy<Recommendation>('recommendations', r => r.learnerId === learnerId),
    findActiveByLearner: (learnerId: string) => findBy<Recommendation>('recommendations', r => r.learnerId === learnerId && !r.isCompleted),
    create: (rec: Recommendation) => create<Recommendation>('recommendations', rec),
    update: (id: string, updates: Partial<Recommendation>) => update<Recommendation>('recommendations', id, updates),
  },

  // Progress Records
  progressRecords: {
    findAll: () => findAll<ProgressRecord>('progressRecords'),
    findByLearner: (learnerId: string) => findBy<ProgressRecord>('progressRecords', p => p.learnerId === learnerId),
    create: (record: ProgressRecord) => create<ProgressRecord>('progressRecords', record),
  },

  // Notifications
  notifications: {
    findAll: () => findAll<Notification>('notifications'),
    findByUser: (userId: string) => findBy<Notification>('notifications', n => n.userId === userId),
    findUnreadByUser: (userId: string) => findBy<Notification>('notifications', n => n.userId === userId && !n.isRead),
    create: (notification: Notification) => create<Notification>('notifications', notification),
    update: (id: string, updates: Partial<Notification>) => update<Notification>('notifications', id, updates),
    markAllRead: (userId: string) => {
      const items = getStore().notifications;
      items.forEach(n => { if (n.userId === userId) n.isRead = true; });
    },
  },

  // Accessibility Settings
  accessibilitySettings: {
    findByUser: (userId: string) => findOneBy<AccessibilitySettings>('accessibilitySettings', a => a.userId === userId),
    upsert: (settings: AccessibilitySettings) => {
      const items = getStore().accessibilitySettings;
      const index = items.findIndex(a => a.userId === settings.userId);
      if (index >= 0) {
        items[index] = settings;
      } else {
        items.push(settings);
      }
      return settings;
    },
  },

  // Platform Settings
  platformSettings: {
    findAll: () => findAll<PlatformSettings>('platformSettings'),
    findByKey: (key: string) => findOneBy<PlatformSettings>('platformSettings', p => p.key === key),
    findByCategory: (category: string) => findBy<PlatformSettings>('platformSettings', p => p.category === category),
    upsert: (setting: PlatformSettings) => {
      const items = getStore().platformSettings;
      const index = items.findIndex(p => p.key === setting.key);
      if (index >= 0) {
        items[index] = setting;
      } else {
        items.push(setting);
      }
      return setting;
    },
  },

  // Skill Scores (derived from assessment data)
  getSkillScores: (learnerId: string): SkillScore[] => {
    const latestAssessment = db.assessments.findLatestByLearner(learnerId);
    if (latestAssessment) return latestAssessment.skillScores;
    return [];
  },

  // Reset store (for testing)
  reset: () => {
    store = seedDatabase();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORE_LOCAL_KEY);
      } catch {}
    }
    persistStore();
  },

  cameraConsents: {
    findByAssessment: (assessmentId: string) => findOneBy<CameraConsent>('cameraConsents', consent => consent.assessmentId === assessmentId),
    create: (consent: CameraConsent) => create<CameraConsent>('cameraConsents', consent),
  },

  assessmentSnapshots: {
    findByAssessment: (assessmentId: string) => findBy<AssessmentSnapshot>('assessmentSnapshots', snapshot => snapshot.assessmentId === assessmentId),
    create: (snapshot: AssessmentSnapshot) => create<AssessmentSnapshot>('assessmentSnapshots', snapshot),
    deleteByAssessment: (assessmentId: string) => {
      const snapshots = getStore().assessmentSnapshots;
      getStore().assessmentSnapshots = snapshots.filter(snapshot => snapshot.assessmentId !== assessmentId);
    },
  },
};
