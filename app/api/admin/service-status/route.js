import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '../../../../lib/auth';
import { isServicePaused, setServicePaused } from '../../../../lib/servicePause';
export const dynamic = 'force-dynamic';
function authorized(request) { return verifySessionToken(request.cookies.get(SESSION_COOKIE.name)?.value); }
export async function GET(request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try { return NextResponse.json({ paused: await isServicePaused() }); }
  catch { return NextResponse.json({ error: 'Unable to load service status' }, { status: 503 }); }
}
export async function POST(request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.paused !== 'boolean') return NextResponse.json({ error: 'Invalid pause value' }, { status: 400 });
    return NextResponse.json({ paused: await setServicePaused(body.paused) });
  } catch { return NextResponse.json({ error: 'Unable to update service status' }, { status: 503 }); }
}