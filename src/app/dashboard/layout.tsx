
// // // /src/app/dashboard/layout.tsx

// import { redirect } from 'next/navigation';
// import { getSession } from '@/lib/auth/session';
// import { LogoutButton } from '@/components/auth/logout-button';
// import { RealTimeProvider } from '@/components/providers/realtime-provider';
// import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
// import Sidebar from '@/components/dashboard/sidebar';
// import { sql } from '@/lib/db';

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getSession();

//   if (!session) {
//     redirect('/login');
//   }

//   // ✅ DIRECT DATABASE FETCH: Get the latest user data including profile image
//   let userImage = session.image; // Fallback to session image
//   let userName = session.name;
  
//   try {
//     const userData = await sql`
//       SELECT name, image FROM users WHERE id = ${session.userId} LIMIT 1
//     `;
    
//     if (userData.length > 0) {
//       // Use the latest data from database, not session
//       userImage = userData[0].image || session.image;
//       userName = userData[0].name || session.name;
//     }
//   } catch (error) {
//     console.error('❌ Error fetching user data for dashboard:', error);
//     // If there's an error, fall back to session data
//   }

//   // Use primaryRole for role-based navigation
//   const userRole = session.primaryRole;
//   const userRoles = session.roles;

//   const userData = {
//     ...session,
//     name: userName,
//     image: userImage,
//     primaryRole: userRole,
//     roles: userRoles
//   };

//   return (
//     <RealTimeProvider>
//       <div className="min-h-screen bg-gray-50 flex">
//         {/* Updated Sidebar Component - Now completely fixed */}
//         <Sidebar user={userData} />
        
//         {/* Main Content - FIXED: This is the only part that scrolls with proper margin */}
//         <main className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
//           userData.primaryRole ? 'lg:ml-64' : 'lg:ml-0'
//         }`}>
//           <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8">
//             <RoleRefreshHandler />
//             {children}
//           </div>
//         </main>
//       </div>
//     </RealTimeProvider>
//   );
// }





























// // /src/app/dashboard/layout.tsx

// import { redirect } from 'next/navigation';
// import { getSession } from '@/lib/auth/session';
// import { RealTimeProvider } from '@/components/providers/realtime-provider';
// import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
// import Sidebar from '@/components/dashboard/sidebar';
// import { sql } from '@/lib/db';

// // Retry helper — Neon free tier suspends after inactivity.
// // The first query after wake-up often fails with "fetch failed".
// // We retry up to 3 times with a short delay before giving up.
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
//         delayMs *= 2; // exponential back-off: 500ms → 1000ms → 2000ms
//       } else {
//         // Not a network error, or we've exhausted retries — log and bail out
//         console.error(`❌ DB error fetching user data (attempt ${attempt}):`, error);
//         return null;
//       }
//     }
//   }
//   return null;
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
//           <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8">
//             <RoleRefreshHandler />
//             {children}
//           </div>
//         </main>
//       </div>
//     </RealTimeProvider>
//   );
// }


























// /src/app/dashboard/layout.tsx
// ADDED: fire-and-forget POST to /api/activity/track on every dashboard visit
// Only fires for students — instructors and admins don't have a streak.

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { RealTimeProvider } from '@/components/providers/realtime-provider';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';
import Sidebar from '@/components/dashboard/sidebar';
import { sql } from '@/lib/db';

// Retry helper — Neon free tier suspends after inactivity.
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

// Fire-and-forget activity tracker — never blocks page render.
// Only tracks students since streak is student-only.
async function trackDashboardVisit(userId: string, baseUrl: string) {
  try {
    await fetch(`${baseUrl}/api/activity/track`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ activity_type: 'dashboard_visit' }),
      // Short timeout so it never slows down the layout
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Silently ignore — tracking failure must never break the dashboard
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

  // Try to get fresh user data from DB; fall back to session if DB is unavailable
  let userImage = session.image;
  let userName  = session.name;

  const dbUser = await fetchUserWithRetry(session.userId);
  if (dbUser) {
    userImage = dbUser.image || session.image;
    userName  = dbUser.name  || session.name;
  }

  // Track dashboard visit for students only (streak feature)
  if (session.primaryRole === 'student') {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Intentionally NOT awaited — fire and forget
    trackDashboardVisit(session.userId, baseUrl);
  }

  const userRole  = session.primaryRole;
  const userRoles = session.roles;

  const userData = {
    ...session,
    name:        userName,
    image:       userImage,
    primaryRole: userRole,
    roles:       userRoles,
  };

  return (
    <RealTimeProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar user={userData} />
        <main className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
          userData.primaryRole ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
          <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8">
            <RoleRefreshHandler />
            {children}
          </div>
        </main>
      </div>
    </RealTimeProvider>
  );
}
