
// /src/app/dashboard/inbox/loading.tsx

// src/app/dashboard/inbox/loading.tsx
// Skeleton loading state for the inbox page

export default function InboxLoading() {
  return (
    <div className="flex h-[calc(100vh-120px)] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 animate-pulse">
      {/* Left sidebar skeleton */}
      <div className="w-[280px] flex-shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#111420] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-16 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-7 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="h-9 rounded-lg bg-gray-200 dark:bg-white/10" />
        </div>
        {/* Conversation items */}
        <div className="flex-1 p-3 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right chat panel skeleton */}
      <div className="flex-1 bg-gray-50 dark:bg-[#0a0d14] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#111420]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} gap-3`}>
              {i % 2 !== 0 && <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0" />}
              <div className={`h-12 rounded-2xl bg-gray-200 dark:bg-white/10 ${i % 2 === 0 ? 'w-64' : 'w-72'}`} />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#111420]">
          <div className="h-12 rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  )
}