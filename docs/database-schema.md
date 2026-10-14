# SenseLearn — Database Schema & Data Dictionary

**Relational Schema Definition for PostgreSQL / MySQL / Cloud SQL**

Corresponding schema migration script is located at `src/lib/data/schema.sql`.

---

## 1. Entity-Relationship Summary

```
                      ┌───────────────┐
                      │     users     │
                      └───────┬───────┘
                              │ 1:1
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼──────────┐         ┌──────────▼─────────┐
    │  learner_profiles  │         │ educator_profiles  │
    └─────────┬──────────┘         └────────────────────┘
              │ 1:N
 ┌────────────┼───────────────────────────┬───────────────────────────┐
 │            │                           │                           │
 ▼            ▼                           ▼                           ▼
assessments  learning_sessions   engagement_profiles         recommendations
 │            │
 ▼            ▼
responses    interaction_events
```

---

## 2. Table Specifications

### 1. `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique user identifier (`usr-*`) |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | SHA-256 hashed password with salt |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full display name |
| `role` | `VARCHAR(32)` | `NOT NULL` | `learner`, `educator`, or `admin` |
| `status` | `VARCHAR(32)` | `DEFAULT 'active'` | `active`, `inactive`, `suspended` |
| `avatar_url` | `TEXT` | `NULL` | Profile photo URL |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Record creation timestamp |

### 2. `learner_profiles`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique profile ID (`lp-*`) |
| `user_id` | `VARCHAR(64)` | `FOREIGN KEY (users.id)` | Associated learner user ID |
| `current_level` | `INT` | `DEFAULT 1` | Proficiency tier (1 to 4) |
| `learning_preferences` | `TEXT[] / JSON` | `NOT NULL` | Visual, Audio, Interactive, etc. |
| `support_preferences`| `TEXT[] / JSON` | `NOT NULL` | Hints, Audio, Step-by-Step, etc. |
| `interests` | `TEXT[] / JSON` | `NOT NULL` | High-interest topic tags |
| `total_points` | `INT` | `DEFAULT 0` | Cumulative score points |
| `current_streak` | `INT` | `DEFAULT 0` | Consecutive active learning days |

### 3. `activities`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Activity ID (`act-*`) |
| `title` | `VARCHAR(255)` | `NOT NULL` | Activity title |
| `description` | `TEXT` | `NOT NULL` | Pedagogical summary |
| `domain_id` | `VARCHAR(64)` | `FOREIGN KEY` | Learning domain |
| `skill_id` | `VARCHAR(64)` | `FOREIGN KEY` | Primary skill targeted |
| `difficulty` | `VARCHAR(32)` | `NOT NULL` | `beginner`, `intermediate`, `advanced` |
| `activity_type` | `VARCHAR(64)` | `NOT NULL` | `pattern_recognition`, `multiple_choice`, etc. |
| `learning_mode` | `VARCHAR(64)` | `NOT NULL` | `multisensory`, `visual`, `audio`, `text` |
| `question_ids` | `TEXT[] / JSON` | `NOT NULL` | Assigned question items |
| `points` | `INT` | `DEFAULT 50` | Reward points upon completion |

### 4. `interaction_events` (Observable Interaction Telemetry)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Event ID (`evt-*`) |
| `learner_id` | `VARCHAR(64)` | `FOREIGN KEY` | Student user ID |
| `session_id` | `VARCHAR(64)` | `FOREIGN KEY` | Active learning session ID |
| `activity_id` | `VARCHAR(64)` | `FOREIGN KEY` | Target activity |
| `question_id` | `VARCHAR(64)` | `NULL` | Target question |
| `event_type` | `VARCHAR(64)` | `NOT NULL` | `activity_started`, `answer_submitted`, etc. |
| `response_time_ms`| `INT` | `NULL` | Question response latency in ms |
| `attempt_number` | `INT` | `DEFAULT 1` | Retry iteration number |
| `success` | `BOOLEAN` | `NULL` | Correctness indicator |
| `timestamp` | `TIMESTAMP` | `DEFAULT NOW()` | Exact interaction timestamp |

### 5. `engagement_profiles`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Engagement profile ID (`eng-*`) |
| `learner_id` | `VARCHAR(64)` | `FOREIGN KEY` | Associated learner |
| `overall_score` | `INT` | `NOT NULL` | 0–100 Weighted Score |
| `status` | `VARCHAR(64)` | `NOT NULL` | `highly_engaged`, `engaged`, etc. |
| `interaction_consistency`| `INT` | `NOT NULL` | Consistency Component (30% weight) |
| `completion_rate` | `INT` | `NOT NULL` | Completion Component (25% weight) |
| `accuracy` | `INT` | `NOT NULL` | Accuracy Component (20% weight) |
| `persistence` | `INT` | `NOT NULL` | Persistence Component (15% weight) |
| `response_stability` | `INT` | `NOT NULL` | Stability Component (10% weight) |
