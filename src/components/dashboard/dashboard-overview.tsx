
// // /components/dashboard/dashboard-overview.tsx

// 'use client'

// interface DashboardOverviewProps {
//   roleSpecificData: any
//   userRole?: string
// }

// export default function DashboardOverview({ roleSpecificData, userRole }: DashboardOverviewProps) {
//   const getMetrics = () => {
//     if (userRole === 'instructor') {
//       return [
//         { 
//           label: 'My Courses', 
//           value: (roleSpecificData.instructorCourses || 0).toString(), 
//           icon: '📚', 
//           color: 'bg-blue-100' 
//         },
//         { 
//           label: 'Total Students', 
//           value: (roleSpecificData.totalStudents || 0).toString(), 
//           icon: '👥', 
//           color: 'bg-green-100' 
//         },
//         { 
//           label: 'Course Performance', 
//           value: `${roleSpecificData.learningProgress || 0}%`, 
//           icon: '📈', 
//           color: 'bg-purple-100' 
//         },
//         { 
//           label: 'Certificates Issued', 
//           value: (roleSpecificData.certificatesIssued || roleSpecificData.certificatesEarned || 0).toString(), 
//           icon: '📜', 
//           color: 'bg-orange-100' 
//         },
//       ]
//     } else if (userRole === 'admin') {
//       return [
//         { 
//           label: 'Total Users', 
//           value: (roleSpecificData.totalUsers || 0).toString(), 
//           icon: '👥', 
//           color: 'bg-blue-100' 
//         },
//         { 
//           label: 'Pending Requests', 
//           value: (roleSpecificData.pendingRoleRequests || 0).toString(), 
//           icon: '⏳', 
//           color: 'bg-orange-100' 
//         },
//         { 
//           label: 'Published Courses', 
//           value: (roleSpecificData.enrolledCourses || 0).toString(), 
//           icon: '📚', 
//           color: 'bg-green-100' 
//         },
//         { 
//           label: 'Platform Health', 
//           value: '100%', 
//           icon: '💚', 
//           color: 'bg-purple-100' 
//         },
//       ]
//     }

//     // Student metrics
//     return [
//       { 
//         label: 'Courses in Progress', 
//         value: (roleSpecificData.enrolledCourses || 0).toString(), 
//         icon: '📚', 
//         color: 'bg-blue-100' 
//       },
//       { 
//         label: 'Learning Progress', 
//         value: `${roleSpecificData.learningProgress || 0}%`, 
//         icon: '⏱️', 
//         color: 'bg-green-100' 
//       },
//       { 
//         label: 'Certificates Earned', 
//         value: (roleSpecificData.certificatesEarned || 0).toString(), 
//         icon: '📜', 
//         color: 'bg-purple-100' 
//       },
//       { 
//         label: 'Current Streak', 
//         value: '7 days', 
//         icon: '🔥', 
//         color: 'bg-orange-100' 
//       },
//     ]
//   }

//   const metrics = getMetrics()

//   return (
//     <div className="bg-white rounded-lg p-6 border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-6">
//         {userRole === 'instructor' ? 'Teaching Overview' : 
//          userRole === 'admin' ? 'Platform Overview' : 'Learning Overview'}
//       </h2>
//       <p className="text-gray-600 text-sm mb-6">
//         {userRole === 'instructor' 
//           ? 'Monitor your teaching progress and student engagement'
//           : userRole === 'admin'
//           ? 'Platform statistics and management overview'
//           : 'Monitor your learning progress and achievements'
//         }
//       </p>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {metrics.map((metric, index) => (
//           <div key={index} className="bg-gray-50 rounded-lg p-4">
//             <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center mb-3`}>
//               <span className="text-lg">{metric.icon}</span>
//             </div>
//             <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
//             <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }




















// 'use client';
// // /components/dashboard/dashboard-overview.tsx
// // FIX: Instructor "Certificates Issued" now reads roleSpecificData.certificatesIssued
// // which is populated by the corrected query in dashboard/page.tsx (is_revoked = false).

// interface DashboardOverviewProps {
//   roleSpecificData: any;
//   userRole?: string;
// }

// export default function DashboardOverview({ roleSpecificData, userRole }: DashboardOverviewProps) {
//   const getMetrics = () => {
//     if (userRole === 'instructor') {
//       return [
//         {
//           label: 'My Courses',
//           value: (roleSpecificData.instructorCourses || 0).toString(),
//           icon: '📚',
//           color: 'bg-blue-100',
//         },
//         {
//           label: 'Total Students',
//           value: (roleSpecificData.totalStudents || 0).toString(),
//           icon: '👥',
//           color: 'bg-green-100',
//         },
//         {
//           label: 'Course Performance',
//           value: `${roleSpecificData.learningProgress || 0}%`,
//           icon: '📈',
//           color: 'bg-purple-100',
//         },
//         {
//           // Reads certificatesIssued — set by the fixed query in dashboard/page.tsx
//           label: 'Certificates Issued',
//           value: (roleSpecificData.certificatesIssued || 0).toString(),
//           icon: '📜',
//           color: 'bg-orange-100',
//         },
//       ];
//     }

//     if (userRole === 'admin') {
//       return [
//         {
//           label: 'Total Users',
//           value: (roleSpecificData.totalUsers || 0).toString(),
//           icon: '👥',
//           color: 'bg-blue-100',
//         },
//         {
//           label: 'Pending Requests',
//           value: (roleSpecificData.pendingRoleRequests || 0).toString(),
//           icon: '⏳',
//           color: 'bg-orange-100',
//         },
//         {
//           label: 'Published Courses',
//           value: (roleSpecificData.enrolledCourses || 0).toString(),
//           icon: '📚',
//           color: 'bg-green-100',
//         },
//         {
//           label: 'Platform Health',
//           value: '100%',
//           icon: '💚',
//           color: 'bg-purple-100',
//         },
//       ];
//     }

//     // Student metrics
//     return [
//       {
//         label: 'Courses in Progress',
//         value: (roleSpecificData.enrolledCourses || 0).toString(),
//         icon: '📚',
//         color: 'bg-blue-100',
//       },
//       {
//         label: 'Learning Progress',
//         value: `${roleSpecificData.learningProgress || 0}%`,
//         icon: '⏱️',
//         color: 'bg-green-100',
//       },
//       {
//         label: 'Certificates Earned',
//         value: (roleSpecificData.certificatesEarned || 0).toString(),
//         icon: '📜',
//         color: 'bg-purple-100',
//       },
//       {
//         label: 'Current Streak',
//         value: '7 days',
//         icon: '🔥',
//         color: 'bg-orange-100',
//       },
//     ];
//   };

//   const metrics = getMetrics();

//   return (
//     <div className="bg-white rounded-lg p-6 border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-2">
//         {userRole === 'instructor'
//           ? 'Teaching Overview'
//           : userRole === 'admin'
//           ? 'Platform Overview'
//           : 'Learning Overview'}
//       </h2>
//       <p className="text-gray-600 text-sm mb-6">
//         {userRole === 'instructor'
//           ? 'Monitor your teaching progress and student engagement'
//           : userRole === 'admin'
//           ? 'Platform statistics and management overview'
//           : 'Monitor your learning progress and achievements'}
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {metrics.map((metric, index) => (
//           <div key={index} className="bg-gray-50 rounded-lg p-4">
//             <div
//               className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center mb-3`}
//             >
//               <span className="text-lg">{metric.icon}</span>
//             </div>
//             <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
//             <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


























'use client';
// /components/dashboard/dashboard-overview.tsx
// UPDATED: Student "Current Streak" now reads roleSpecificData.currentStreak
// (student only — instructor and admin metrics unchanged)

interface DashboardOverviewProps {
  roleSpecificData: any;
  userRole?: string;
}

export default function DashboardOverview({ roleSpecificData, userRole }: DashboardOverviewProps) {
  const getMetrics = () => {
    if (userRole === 'instructor') {
      return [
        {
          label: 'My Courses',
          value: (roleSpecificData.instructorCourses || 0).toString(),
          icon: '📚',
          color: 'bg-blue-100',
        },
        {
          label: 'Total Students',
          value: (roleSpecificData.totalStudents || 0).toString(),
          icon: '👥',
          color: 'bg-green-100',
        },
        {
          label: 'Course Performance',
          value: `${roleSpecificData.learningProgress || 0}%`,
          icon: '📈',
          color: 'bg-purple-100',
        },
        {
          label: 'Certificates Issued',
          value: (roleSpecificData.certificatesIssued || 0).toString(),
          icon: '📜',
          color: 'bg-orange-100',
        },
      ];
    }

    if (userRole === 'admin') {
      return [
        {
          label: 'Total Users',
          value: (roleSpecificData.totalUsers || 0).toString(),
          icon: '👥',
          color: 'bg-blue-100',
        },
        {
          label: 'Pending Requests',
          value: (roleSpecificData.pendingRoleRequests || 0).toString(),
          icon: '⏳',
          color: 'bg-orange-100',
        },
        {
          label: 'Published Courses',
          value: (roleSpecificData.enrolledCourses || 0).toString(),
          icon: '📚',
          color: 'bg-green-100',
        },
        {
          label: 'Platform Health',
          value: '100%',
          icon: '💚',
          color: 'bg-purple-100',
        },
      ];
    }

    // ── Student metrics ───────────────────────────────────────────────────────
    const streak = roleSpecificData.currentStreak || 0;
    const streakLabel = streak === 0
      ? '...'
      : streak === 1
      ? '1 day'
      : `${streak} days`;

    return [
      {
        label: 'Courses in Progress',
        value: (roleSpecificData.enrolledCourses || 0).toString(),
        icon: '📚',
        color: 'bg-blue-100',
      },
      {
        label: 'Learning Progress',
        value: `${roleSpecificData.learningProgress || 0}%`,
        icon: '⏱️',
        color: 'bg-green-100',
      },
      {
        label: 'Certificates Earned',
        value: (roleSpecificData.certificatesEarned || 0).toString(),
        icon: '📜',
        color: 'bg-purple-100',
      },
      {
        // Real streak from user_activities — no longer hardcoded
        label: 'Current Streak',
        value: streakLabel,
        icon: streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✨',
        color: streak >= 7 ? 'bg-orange-100' : streak >= 3 ? 'bg-yellow-100' : 'bg-gray-100',
      },
    ];
  };

  const metrics = getMetrics();

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {userRole === 'instructor'
          ? 'Teaching Overview'
          : userRole === 'admin'
          ? 'Platform Overview'
          : 'Learning Overview'}
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        {userRole === 'instructor'
          ? 'Monitor your teaching progress and student engagement'
          : userRole === 'admin'
          ? 'Platform statistics and management overview'
          : 'Monitor your learning progress and achievements'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div
              className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center mb-3`}
            >
              <span className="text-lg">{metric.icon}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
