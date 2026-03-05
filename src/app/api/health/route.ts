
// app/api/health/route.ts
// Lightweight health check endpoint for UptimeRobot pings
// Does NOT hit the database — just confirms the server is alive

export const runtime = 'nodejs';

export async function GET() {
  return Response.json(
    {
      status: 'ok',
      service: 'axioquan',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}