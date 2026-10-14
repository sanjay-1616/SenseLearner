import { NextResponse } from 'next/server';
import { interactionTrackingService } from '@/lib/services/interaction-tracking-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = interactionTrackingService.logEvent(body);
    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Tracking error' }, { status: 500 });
  }
}
