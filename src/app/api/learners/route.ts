import { NextResponse } from 'next/server';
import { db } from '@/lib/data/store';
import { learnerProfileService } from '@/lib/services/learner-profile-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const learnerId = searchParams.get('id');

  if (learnerId) {
    const profile = learnerProfileService.getComprehensiveProfile(learnerId);
    if (!profile) return NextResponse.json({ error: 'Learner profile not found' }, { status: 404 });
    return NextResponse.json(profile);
  }

  const learners = db.users.findByRole('learner');
  return NextResponse.json(learners);
}
