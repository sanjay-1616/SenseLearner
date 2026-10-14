# SenseLearn — REST API Reference

All API routes are implemented using Next.js route handlers under `/api/*`.

---

## 1. Authentication Endpoints

### `POST /api/auth`
Performs authentication actions (login, registration).

**Request Body (Login):**
```json
{
  "action": "login",
  "email": "learner@demo.com",
  "password": "Demo1234!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "usr-lrn-1",
    "email": "learner@demo.com",
    "name": "Alex Rivera",
    "role": "learner"
  },
  "token": "demo-token-usr-lrn-1-..."
}
```

---

## 2. Learner Profiles & Analytics

### `GET /api/learners?id=usr-lrn-1`
Retrieves comprehensive diagnostic learner profile, skill proficiencies, classifications, and personalized recommendations.

---

## 3. Activities & Content Repository

### `GET /api/activities?domainId=dom-pat&difficulty=beginner`
Queries activities filtered by domain, skill, or difficulty.

### `GET /api/activities?id=act-pat-1`
Retrieves single activity details along with populated question objects.

---

## 4. Interaction Telemetry Stream

### `POST /api/interactions`
Logs fine-grained observable educational interactions in real time.

**Request Body:**
```json
{
  "learnerId": "usr-lrn-1",
  "sessionId": "ses-103",
  "activityId": "act-prob-1",
  "questionId": "qst-023",
  "eventType": "answer_submitted",
  "responseTimeMs": 14200,
  "attemptNumber": 1,
  "success": true
}
```
