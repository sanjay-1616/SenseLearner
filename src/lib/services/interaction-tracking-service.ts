// ============================================================
// SenseLearn — Real-Time Interaction Tracking Service
// Core research instrumentation logging observable interaction data
// and calculating engagement metrics reactively
// ============================================================

import { db } from '../data/store';
import type { InteractionEvent, EventType } from '../data/models';
import { generateId } from '../utils';
import { engagementService } from './engagement-service';

export interface LogEventParams {
  learnerId: string;
  sessionId: string;
  activityId: string;
  questionId?: string;
  eventType: EventType;
  responseTimeMs?: number;
  attemptNumber?: number;
  success?: boolean;
  metadata?: Record<string, unknown>;
}

export const interactionTrackingService = {
  /**
   * Log an observable educational interaction event
   */
  logEvent(params: LogEventParams): InteractionEvent {
    const event: InteractionEvent = {
      id: `evt-${generateId()}`,
      learnerId: params.learnerId,
      sessionId: params.sessionId,
      activityId: params.activityId,
      questionId: params.questionId,
      eventType: params.eventType,
      timestamp: new Date().toISOString(),
      responseTimeMs: params.responseTimeMs,
      attemptNumber: params.attemptNumber,
      success: params.success,
      metadata: params.metadata,
    };

    db.interactionEvents.create(event);

    // If activity or question completed, trigger reactive engagement recalculation
    if (
      params.eventType === 'activity_completed' ||
      params.eventType === 'answer_submitted' ||
      params.eventType === 'hint_used'
    ) {
      engagementService.recalculateForLearner(params.learnerId);
    }

    return event;
  },

  /**
   * Fetch all interaction events for a learner
   */
  getEventsByLearner(learnerId: string): InteractionEvent[] {
    return db.interactionEvents.findByLearner(learnerId);
  },

  /**
   * Fetch events recorded in a specific session
   */
  getEventsBySession(sessionId: string): InteractionEvent[] {
    return db.interactionEvents.findBySession(sessionId);
  },

  /**
   * Fetch events recorded for an activity
   */
  getEventsByActivity(activityId: string): InteractionEvent[] {
    return db.interactionEvents.findByActivity(activityId);
  },
};
