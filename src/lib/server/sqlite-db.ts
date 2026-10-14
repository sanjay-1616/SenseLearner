// ============================================================
// SenseLearn — SQLite Database Engine (Node 24 Built-in node:sqlite)
// Persistent storage at data/senselearn.sqlite
// ============================================================

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import type { User, LearnerProfile, EducatorProfile, Assessment, ProgressRecord, SkillScore, UserRole } from '../data/models';
import { seedDatabase } from '../data/seed';

let dbInstance: DatabaseSync | null = null;

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'senselearn.sqlite');

export function getSqliteDb(): DatabaseSync {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  initTables(db);
  seedIfEmpty(db);

  dbInstance = db;
  return dbInstance;
}

function initTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      avatar_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS learner_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      current_level INTEGER NOT NULL DEFAULT 1,
      learning_preferences TEXT NOT NULL DEFAULT '[]',
      support_preferences TEXT NOT NULL DEFAULT '[]',
      selected_domains TEXT NOT NULL DEFAULT '[]',
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      baseline_completed INTEGER NOT NULL DEFAULT 0,
      total_activities_completed INTEGER NOT NULL DEFAULT 0,
      total_assessments_completed INTEGER NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_activity_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS educator_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      specialization TEXT,
      assigned_learner_ids TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      question_ids TEXT NOT NULL DEFAULT '[]',
      current_question_index INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      total_questions INTEGER NOT NULL DEFAULT 10,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0.0,
      skill_scores TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS progress_records (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      date TEXT NOT NULL,
      activities_completed INTEGER NOT NULL DEFAULT 0,
      assessments_completed INTEGER NOT NULL DEFAULT 0,
      average_accuracy REAL NOT NULL DEFAULT 0.0,
      average_engagement INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      skill_scores TEXT NOT NULL DEFAULT '[]',
      total_time_ms INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS platform_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function seedIfEmpty(db: DatabaseSync) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (countRow && countRow.count > 0) {
    return;
  }

  // Populate from seedDatabase
  const seed = seedDatabase();

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, password_hash, role, status, avatar_url, created_at, updated_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of seed.users) {
    insertUser.run(
      u.id,
      u.name,
      u.email.toLowerCase().trim(),
      u.passwordHash,
      u.role,
      u.status,
      u.avatarUrl || null,
      u.createdAt,
      u.updatedAt,
      u.lastLoginAt || null
    );
  }

  const insertLearnerProfile = db.prepare(`
    INSERT OR REPLACE INTO learner_profiles (
      id, user_id, current_level, learning_preferences, support_preferences,
      selected_domains, onboarding_completed, baseline_completed,
      total_activities_completed, total_assessments_completed, current_streak,
      longest_streak, last_activity_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const lp of seed.learnerProfiles) {
    insertLearnerProfile.run(
      lp.id,
      lp.userId,
      lp.currentLevel,
      JSON.stringify(lp.learningPreferences || []),
      JSON.stringify(lp.supportPreferences || []),
      JSON.stringify(lp.selectedDomains || []),
      lp.onboardingCompleted ? 1 : 0,
      lp.baselineCompleted ? 1 : 0,
      lp.totalActivitiesCompleted,
      lp.totalAssessmentsCompleted,
      lp.currentStreak,
      lp.longestStreak,
      lp.lastActivityAt || null,
      lp.createdAt,
      lp.updatedAt
    );
  }

  const insertEduProfile = db.prepare(`
    INSERT OR REPLACE INTO educator_profiles (id, user_id, specialization, assigned_learner_ids, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const ep of seed.educatorProfiles) {
    insertEduProfile.run(
      ep.id,
      ep.userId,
      ep.specialization || '',
      JSON.stringify(ep.assignedLearnerIds || []),
      ep.createdAt,
      ep.updatedAt
    );
  }

  const insertAssessment = db.prepare(`
    INSERT OR REPLACE INTO assessments (
      id, learner_id, type, status, question_ids, current_question_index,
      started_at, completed_at, total_questions, correct_answers, accuracy,
      skill_scores, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of seed.assessments) {
    insertAssessment.run(
      a.id,
      a.learnerId,
      a.type,
      a.status,
      JSON.stringify(a.questionIds || []),
      a.currentQuestionIndex,
      a.startedAt,
      a.completedAt || null,
      a.totalQuestions,
      a.correctAnswers,
      a.accuracy,
      JSON.stringify(a.skillScores || []),
      a.createdAt
    );
  }

  const insertStore = db.prepare('INSERT OR REPLACE INTO platform_store (key, value, updated_at) VALUES (?, ?, ?)');
  insertStore.run('seed_complete', JSON.stringify({ initialized: true, timestamp: new Date().toISOString() }), new Date().toISOString());
}

// ------------------------------------------------------------
// Repository Functions
// ------------------------------------------------------------

export const sqliteDb = {
  findUserByEmail(email: string): User | null {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim()) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as UserRole,
      status: row.status,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at,
    };
  },

  findUserById(id: string): User | null {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as UserRole,
      status: row.status,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at,
    };
  },

  createUser(user: User): User {
    const db = getSqliteDb();
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, status, avatar_url, created_at, updated_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      user.name,
      user.email.toLowerCase().trim(),
      user.passwordHash,
      user.role,
      user.status,
      user.avatarUrl || null,
      user.createdAt,
      user.updatedAt,
      user.lastLoginAt || null
    );
    return user;
  },

  updateUser(id: string, updates: Partial<User>): void {
    const db = getSqliteDb();
    const existing = this.findUserById(id);
    if (!existing) return;

    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.prepare(`
      UPDATE users SET
        name = ?,
        email = ?,
        password_hash = ?,
        role = ?,
        status = ?,
        avatar_url = ?,
        updated_at = ?,
        last_login_at = ?
      WHERE id = ?
    `).run(
      merged.name,
      merged.email.toLowerCase().trim(),
      merged.passwordHash,
      merged.role,
      merged.status,
      merged.avatarUrl || null,
      merged.updatedAt,
      merged.lastLoginAt || null,
      id
    );
  },

  updateUserPassword(email: string, passwordHash: string): boolean {
    const db = getSqliteDb();
    const user = this.findUserByEmail(email);
    if (!user) return false;

    db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?
    `).run(passwordHash, new Date().toISOString(), user.id);
    return true;
  },

  findLearnerProfileByUserId(userId: string): LearnerProfile | null {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM learner_profiles WHERE user_id = ?').get(userId) as any;
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      currentLevel: row.current_level,
      learningPreferences: JSON.parse(row.learning_preferences || '[]'),
      supportPreferences: JSON.parse(row.support_preferences || '[]'),
      selectedDomains: JSON.parse(row.selected_domains || '[]'),
      onboardingCompleted: Boolean(row.onboarding_completed),
      baselineCompleted: Boolean(row.baseline_completed),
      totalActivitiesCompleted: row.total_activities_completed,
      totalAssessmentsCompleted: row.total_assessments_completed,
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      lastActivityAt: row.last_activity_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  createLearnerProfile(profile: LearnerProfile): LearnerProfile {
    const db = getSqliteDb();
    db.prepare(`
      INSERT INTO learner_profiles (
        id, user_id, current_level, learning_preferences, support_preferences,
        selected_domains, onboarding_completed, baseline_completed,
        total_activities_completed, total_assessments_completed, current_streak,
        longest_streak, last_activity_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      profile.id,
      profile.userId,
      profile.currentLevel,
      JSON.stringify(profile.learningPreferences || []),
      JSON.stringify(profile.supportPreferences || []),
      JSON.stringify(profile.selectedDomains || []),
      profile.onboardingCompleted ? 1 : 0,
      profile.baselineCompleted ? 1 : 0,
      profile.totalActivitiesCompleted,
      profile.totalAssessmentsCompleted,
      profile.currentStreak,
      profile.longestStreak,
      profile.lastActivityAt || null,
      profile.createdAt,
      profile.updatedAt
    );
    return profile;
  },

  updateLearnerProfile(userId: string, updates: Partial<LearnerProfile>): void {
    const db = getSqliteDb();
    const existing = this.findLearnerProfileByUserId(userId);
    if (!existing) return;

    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.prepare(`
      UPDATE learner_profiles SET
        current_level = ?,
        learning_preferences = ?,
        support_preferences = ?,
        selected_domains = ?,
        onboarding_completed = ?,
        baseline_completed = ?,
        total_activities_completed = ?,
        total_assessments_completed = ?,
        current_streak = ?,
        longest_streak = ?,
        last_activity_at = ?,
        updated_at = ?
      WHERE user_id = ?
    `).run(
      merged.currentLevel,
      JSON.stringify(merged.learningPreferences || []),
      JSON.stringify(merged.supportPreferences || []),
      JSON.stringify(merged.selectedDomains || []),
      merged.onboardingCompleted ? 1 : 0,
      merged.baselineCompleted ? 1 : 0,
      merged.totalActivitiesCompleted,
      merged.totalAssessmentsCompleted,
      merged.currentStreak,
      merged.longestStreak,
      merged.lastActivityAt || null,
      merged.updatedAt,
      userId
    );
  },

  createEducatorProfile(profile: EducatorProfile): EducatorProfile {
    const db = getSqliteDb();
    db.prepare(`
      INSERT INTO educator_profiles (id, user_id, specialization, assigned_learner_ids, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      profile.id,
      profile.userId,
      profile.specialization || '',
      JSON.stringify(profile.assignedLearnerIds || []),
      profile.createdAt,
      profile.updatedAt
    );
    return profile;
  },

  findEducatorProfileByUserId(userId: string): EducatorProfile | null {
    const db = getSqliteDb();
    const row = db.prepare('SELECT * FROM educator_profiles WHERE user_id = ?').get(userId) as any;
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      specialization: row.specialization,
      assignedLearnerIds: JSON.parse(row.assigned_learner_ids || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  saveAssessment(assessment: Assessment): void {
    const db = getSqliteDb();
    db.prepare(`
      INSERT OR REPLACE INTO assessments (
        id, learner_id, type, status, question_ids, current_question_index,
        started_at, completed_at, total_questions, correct_answers, accuracy,
        skill_scores, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assessment.id,
      assessment.learnerId,
      assessment.type,
      assessment.status,
      JSON.stringify(assessment.questionIds || []),
      assessment.currentQuestionIndex,
      assessment.startedAt,
      assessment.completedAt || null,
      assessment.totalQuestions,
      assessment.correctAnswers,
      assessment.accuracy,
      JSON.stringify(assessment.skillScores || []),
      assessment.createdAt
    );
  },

  findAssessmentsByLearner(learnerId: string): Assessment[] {
    const db = getSqliteDb();
    const rows = db.prepare('SELECT * FROM assessments WHERE learner_id = ? ORDER BY created_at DESC').all(learnerId) as any[];
    return rows.map(r => ({
      id: r.id,
      learnerId: r.learner_id,
      type: r.type,
      status: r.status,
      questionIds: JSON.parse(r.question_ids || '[]'),
      currentQuestionIndex: r.current_question_index,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      totalQuestions: r.total_questions,
      correctAnswers: r.correct_answers,
      accuracy: r.accuracy,
      skillScores: JSON.parse(r.skill_scores || '[]'),
      createdAt: r.created_at,
    }));
  },

  saveStoreData(key: string, data: any): void {
    const db = getSqliteDb();
    db.prepare('INSERT OR REPLACE INTO platform_store (key, value, updated_at) VALUES (?, ?, ?)')
      .run(key, JSON.stringify(data), new Date().toISOString());
  },

  getStoreData(key: string): any | null {
    const db = getSqliteDb();
    const row = db.prepare('SELECT value FROM platform_store WHERE key = ?').get(key) as any;
    if (!row) return null;
    try {
      return JSON.parse(row.value);
    } catch {
      return null;
    }
  }
};
