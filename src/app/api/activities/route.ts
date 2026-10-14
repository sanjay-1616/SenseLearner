import { NextResponse } from 'next/server';
import { db } from '@/lib/data/store';
import { activityService } from '@/lib/services/activity-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const domainId = searchParams.get('domainId') || undefined;
  const difficulty = searchParams.get('difficulty') || undefined;

  if (id) {
    const act = activityService.getActivityById(id);
    if (!act) return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    const questions = activityService.getActivityQuestions(id);
    return NextResponse.json({ activity: act, questions });
  }

  const list = activityService.getActivities({ domainId, difficulty });
  return NextResponse.json(list);
}
