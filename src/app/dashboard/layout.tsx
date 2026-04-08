
// // /src/app/dashboard/layout.tsx
// // ADDED: fire-and-forget POST to /api/activity/track on every dashboard visit
// // Only fires for students — instructors and admins don't have a streak.

// import { redirect } from 'next/navigation';
// import { getSession } from '@/lib/auth/session';
// import { RealTimeProvider } from '@/components/providers/realtime-provider';
// import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
// import Sidebar from '@/components/dashboard/sidebar';
// import { sql } from '@/lib/db';

// // Retry helper — Neon free tier suspends after inactivity.
// async function fetchUserWithRetry(
//   userId: string,
//   retries = 3,
//   delayMs = 500
// ): Promise<{ name: string; image: string } | null> {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const rows = await sql`
//         SELECT name, image FROM users WHERE id = ${userId} LIMIT 1
//       `;
//       return rows.length > 0 ? rows[0] as { name: string; image: string } : null;
//     } catch (error: any) {
//       const isNetworkError =
//         error?.message?.includes('fetch failed') ||
//         error?.message?.includes('ECONNREFUSED') ||
//         error?.message?.includes('connection') ||
//         error?.code === 'ENOTFOUND';

//       if (isNetworkError && attempt < retries) {
//         console.warn(`⚠️ DB connection attempt ${attempt} failed — retrying in ${delayMs}ms...`);
//         await new Promise(resolve => setTimeout(resolve, delayMs));
//         delayMs *= 2;
//       } else {
//         console.error(`❌ DB error fetching user data (attempt ${attempt}):`, error);
//         return null;
//       }
//     }
//   }
//   return null;
// }

// // Fire-and-forget activity tracker — never blocks page render.
// // Only tracks students since streak is student-only.
// async function trackDashboardVisit(userId: string, baseUrl: string) {
//   try {
//     await fetch(`${baseUrl}/api/activity/track`, {
//       method:  'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body:    JSON.stringify({ activity_type: 'dashboard_visit' }),
//       // Short timeout so it never slows down the layout
//       signal: AbortSignal.timeout(3000),
//     });
//   } catch {
//     // Silently ignore — tracking failure must never break the dashboard
//   }
// }

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getSession();

//   if (!session) {
//     redirect('/login');
//   }

//   // Try to get fresh user data from DB; fall back to session if DB is unavailable
//   let userImage = session.image;
//   let userName  = session.name;

//   const dbUser = await fetchUserWithRetry(session.userId);
//   if (dbUser) {
//     userImage = dbUser.image || session.image;
//     userName  = dbUser.name  || session.name;
//   }

//   // Track dashboard visit for students only (streak feature)
//   if (session.primaryRole === 'student') {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//     // Intentionally NOT awaited — fire and forget
//     trackDashboardVisit(session.userId, baseUrl);
//   }

//   const userRole  = session.primaryRole;
//   const userRoles = session.roles;

//   const userData = {
//     ...session,
//     name:        userName,
//     image:       userImage,
//     primaryRole: userRole,
//     roles:       userRoles,
//   };

//   return (
//     <RealTimeProvider>
//       <div className="min-h-screen bg-gray-50 flex">
//         <Sidebar user={userData} />
//         <main className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
//           userData.primaryRole ? 'lg:ml-64' : 'lg:ml-0'
//         }`}>

//           <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8 has-[.inbox-fullbleed]:p-0 has-[.inbox-fullbleed]:pt-0">
//             <RoleRefreshHandler />
//             {children}
//         </div>

//           {/* <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8">
//             <RoleRefreshHandler />
//             {children}
//           </div> */}

//         </main>
//       </div>
//     </RealTimeProvider>
//   );
// }

























// /src/app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { RealTimeProvider } from '@/components/providers/realtime-provider';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
import Sidebar from '@/components/dashboard/sidebar';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { sql } from '@/lib/db';

async function fetchUserWithRetry(
  userId: string,
  retries = 3,
  delayMs = 500
): Promise<{ name: string; image: string } | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const rows = await sql`
        SELECT name, image FROM users WHERE id = ${userId} LIMIT 1
      `;
      return rows.length > 0 ? rows[0] as { name: string; image: string } : null;
    } catch (error: any) {
      const isNetworkError =
        error?.message?.includes('fetch failed') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.message?.includes('connection') ||
        error?.code === 'ENOTFOUND';

      if (isNetworkError && attempt < retries) {
        console.warn(`⚠️ DB connection attempt ${attempt} failed — retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2;
      } else {
        console.error(`❌ DB error fetching user data (attempt ${attempt}):`, error);
        return null;
      }
    }
  }
  return null;
}

async function trackDashboardVisit(userId: string, baseUrl: string) {
  try {
    await fetch(`${baseUrl}/api/activity/track`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ activity_type: 'dashboard_visit' }),
      signal:  AbortSignal.timeout(3000),
    });
  } catch {
    // Silently ignore
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  let userImage = session.image;
  let userName  = session.name;

  const dbUser = await fetchUserWithRetry(session.userId);
  if (dbUser) {
    userImage = dbUser.image || session.image;
    userName  = dbUser.name  || session.name;
  }

  if (session.primaryRole === 'student') {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    trackDashboardVisit(session.userId, baseUrl);
  }

  const userData = {
    ...session,
    name:        userName,
    image:       userImage,
    primaryRole: session.primaryRole,
    roles:       session.roles,
  };

  return (
    <RealTimeProvider>
      {/* ✅ SidebarProvider wraps everything so useSidebar works anywhere */}
      <SidebarProvider>
        <DashboardShell user={userData}>
          {children}
        </DashboardShell>
      </SidebarProvider>
    </RealTimeProvider>
  );
}

// ─── Shell — client component so it can read sidebar state ───────────────────
// We keep layout.tsx as a server component by extracting the
// client-side margin logic into a tiny separate component below.
// Import it at the bottom of this same file or in its own file.
import { DashboardShell } from '@/components/dashboard/dashboard-shell';