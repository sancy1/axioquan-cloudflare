// // /src/app/api/certificates/[id]/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { revokeCertificate } from '@/lib/db/queries/certificates';

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// export async function DELETE(request: NextRequest, { params }: RouteParams) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const { id } = await params;
//     const result = await revokeCertificate(id, session.userId);
//     if (!result.success) {
//       return Response.json({ error: result.message }, { status: 400 });
//     }
//     return Response.json({ success: true, message: result.message });
//   } catch (error: any) {
//     console.error('❌ Error revoking certificate:', error);
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }




























// /src/app/api/certificates/[id]/route.ts
// UNCHANGED — this file was already correct.
// revokeCertificate(id, instructorId) matches the DB function signature.

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { revokeCertificate } from '@/lib/db/queries/certificates';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await revokeCertificate(id, session.userId);

    if (!result.success) {
      return Response.json({ error: result.message }, { status: 400 });
    }

    return Response.json({ success: true, message: result.message });
  } catch (error: any) {
    console.error('❌ Error revoking certificate:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
