
// // /components/dashboard/recent-achievements.tsx

// 'use client'

// export default function RecentAchievements() {
//   const achievements = [
//     {
//       id: 1,
//       title: 'Python Basics',
//       description: 'Completed Python fundamentals module',
//       icon: '🏆',
//       date: 'Today',
//     },
//     {
//       id: 2,
//       title: 'Quiz Master',
//       description: 'Scored 100% on 5 quizzes',
//       icon: '⭐',
//       date: '3 days ago',
//     },
//     {
//       id: 3,
//       title: 'Week Warrior',
//       description: 'Learned 7 days in a row',
//       icon: '🎯',
//       date: '1 week ago',
//     },
//   ]

//   return (
//     <div className="bg-white rounded-lg p-6 border border-gray-200">
//       <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h2>
//       <p className="text-xs text-gray-600 mb-4">Your latest accomplishments</p>
      
//       <div className="space-y-3">
//         {achievements.map((achievement) => (
//           <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//             <div className="text-2xl">{achievement.icon}</div>
//             <div className="flex-1 min-w-0">
//               <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
//               <p className="text-xs text-gray-600">{achievement.description}</p>
//               <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }




























'use client'
// src/components/dashboard/recent-achievements.tsx
// Shows the student's 3 most recently earned achievements.
// Fetches live from /api/achievements.
// Already used in dashboard/page.tsx sidebar (student + non-admin only).

import { useState, useEffect } from 'react'

interface Achievement {
  id:          string
  title:       string
  description: string
  icon:        string
  badge_color: string
  badge_type:  string
  xp_earned:   number
  earned_at:   string
  is_seen:     boolean
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export default function RecentAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [total, setTotal]               = useState(0)
  const [totalXp, setTotalXp]           = useState(0)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(data => {
        if (data.achievements) {
          setAchievements(data.achievements.slice(0, 3))
          setTotal(data.total ?? 0)
          setTotalXp(data.totalXp ?? 0)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch { return '' }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Recent Achievements</h3>
          {!loading && total > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{total} earned · {totalXp} XP total</p>
          )}
        </div>
        <span className="text-xl">🏆</span>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Complete courses and quizzes to earn achievements
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map(a => (
            <div key={a.id} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${a.badge_color}22` }}
              >
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{a.title}</p>
                <p className="text-xs text-gray-500 truncate">{a.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-amber-500">+{a.xp_earned} XP</p>
                <p className="text-xs text-gray-400">{formatDate(a.earned_at)}</p>
              </div>
            </div>
          ))}

          {total > 3 && (
            <a
              href="/dashboard/certificates"
              className="block text-center text-xs text-blue-600 hover:underline pt-1 font-medium"
            >
              View all {total} achievements →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

