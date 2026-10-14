-- ============================================================
-- SENSELEARN: DATABASE SCHEMA DEFINITION (PostgreSQL / MySQL compatible)
-- Interactive Multisensory Learning & Real-Time Student Engagement Profiling Platform
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('learner', 'educator', 'admin')),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS learner_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_level INTEGER NOT NULL DEFAULT 1,
    learning_preferences TEXT[] NOT NULL DEFAULT '{}',
    support_preferences TEXT[] NOT NULL DEFAULT '{}',
    selected_domains TEXT[] NOT NULL DEFAULT '{}',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    baseline_completed BOOLEAN NOT NULL DEFAULT FALSE,
    total_activities_completed INTEGER NOT NULL DEFAULT 0,
    total_assessments_completed INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS educator_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT,
    assigned_learner_ids TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS domains (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon VARCHAR(64) NOT NULL,
    color VARCHAR(32) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(64) PRIMARY KEY,
    domain_id VARCHAR(64) REFERENCES domains(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    domain_id VARCHAR(64) REFERENCES domains(id) ON DELETE SET NULL,
    skill_id VARCHAR(64) REFERENCES skills(id) ON DELETE SET NULL,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    activity_type VARCHAR(64) NOT NULL,
    learning_mode VARCHAR(32) NOT NULL CHECK (learning_mode IN ('visual', 'audio', 'text', 'interactive', 'multisensory')),
    estimated_minutes INTEGER NOT NULL DEFAULT 5,
    points INTEGER NOT NULL DEFAULT 50,
    question_ids TEXT[] NOT NULL DEFAULT '{}',
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    text TEXT NOT NULL,
    type VARCHAR(64) NOT NULL,
    domain_id VARCHAR(64) REFERENCES domains(id) ON DELETE SET NULL,
    skill_id VARCHAR(64) REFERENCES skills(id) ON DELETE SET NULL,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    options JSONB,
    correct_answer JSONB NOT NULL,
    hint TEXT,
    explanation TEXT,
    image_url TEXT,
    audio_text TEXT,
    matching_pairs JSONB,
    order_items JSONB,
    points INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY,
    learner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL CHECK (type IN ('baseline', 'periodic', 'domain')),
    status VARCHAR(32) NOT NULL CHECK (status IN ('in_progress', 'completed')),
    question_ids TEXT[] NOT NULL DEFAULT '{}',
    current_question_index INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_questions INTEGER NOT NULL DEFAULT 10,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    skill_scores JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_responses (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) REFERENCES assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(64) REFERENCES questions(id) ON DELETE CASCADE,
    learner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INTEGER NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    hint_used BOOLEAN NOT NULL DEFAULT FALSE,
    skipped BOOLEAN NOT NULL DEFAULT FALSE,
    domain_id VARCHAR(64),
    skill_id VARCHAR(64),
    difficulty VARCHAR(32),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_sessions (
    id VARCHAR(64) PRIMARY KEY,
    learner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    activity_id VARCHAR(64) REFERENCES activities(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    paused_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_time_ms INTEGER NOT NULL DEFAULT 0,
    questions_attempted INTEGER NOT NULL DEFAULT 0,
    questions_correct INTEGER NOT NULL DEFAULT 0,
    hints_used INTEGER NOT NULL DEFAULT 0,
    retry_count INTEGER NOT NULL DEFAULT 0,
    accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    difficulty_at_start VARCHAR(32) NOT NULL,
    difficulty_at_end VARCHAR(32) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS interaction_events (
    id VARCHAR(64) PRIMARY KEY,
    learner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(64) REFERENCES learning_sessions(id) ON DELETE CASCADE,
    activity_id VARCHAR(64) REFERENCES activities(id) ON DELETE CASCADE,
    question_id VARCHAR(64) REFERENCES questions(id) ON DELETE SET NULL,
    event_type VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    response_time_ms INTEGER,
    attempt_number INTEGER,
    success BOOLEAN,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS engagement_profiles (
    id VARCHAR(64) PRIMARY KEY,
    learner_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('highly_engaged', 'engaged', 'moderately_engaged', 'low_engagement')),
    interaction_consistency INTEGER NOT NULL,
    completion_rate INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    persistence INTEGER NOT NULL,
    response_stability INTEGER NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    session_count INTEGER NOT NULL DEFAULT 0,
    history JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(64) PRIMARY KEY,
    learner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    activity_id VARCHAR(64) REFERENCES activities(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1,
    type VARCHAR(32) NOT NULL CHECK (type IN ('strength', 'practice', 'next_level', 'review')),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_records (
    id VARCHAR(64) PRIMARY KEY,
    learner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    activities_completed INTEGER NOT NULL DEFAULT 0,
    assessments_completed INTEGER NOT NULL DEFAULT 0,
    average_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    average_engagement INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    skill_scores JSONB NOT NULL DEFAULT '[]',
    total_time_ms INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accessibility_settings (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    text_size VARCHAR(32) NOT NULL DEFAULT 'normal' CHECK (text_size IN ('normal', 'large', 'extra_large')),
    contrast VARCHAR(32) NOT NULL DEFAULT 'normal' CHECK (contrast IN ('normal', 'high')),
    audio_assistance BOOLEAN NOT NULL DEFAULT FALSE,
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
    reading_assistance BOOLEAN NOT NULL DEFAULT FALSE,
    interaction_guidance BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS platform_settings (
    id VARCHAR(64) PRIMARY KEY,
    key VARCHAR(128) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_activities_domain ON activities(domain_id);
CREATE INDEX IF NOT EXISTS idx_activities_skill ON activities(skill_id);
CREATE INDEX IF NOT EXISTS idx_questions_skill ON questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_assessments_learner ON assessments(learner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_learner ON learning_sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_events_session ON interaction_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_learner ON interaction_events(learner_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_learner ON recommendations(learner_id);
