
// // src/components/messaging/new-conversation-modal.tsx
// // Modal for creating a new conversation — Screen 02
// // Two-panel layout: left (type + filters) | right (user search + selection)
// // Queries axioquan users directly via /api/messaging/users
// // Creates conversation via messag API proxy

// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { X, Search, MessageSquare, Users, Check } from 'lucide-react'
// import type { ConversationInbox } from '@/lib/messaging/types'

// interface User {
//   id:           string
//   name:         string
//   email:        string
//   username:     string
//   image:        string | null
//   primary_role: string | null
// }

// interface NewConversationModalProps {
//   isOpen:   boolean
//   onClose:  () => void
//   onCreated: (conv: ConversationInbox) => void
//   theme:    Record<string, string>
// }

// type ConvType = 'direct' | 'group'

// function getInitials(name: string) {
//   return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
// }

// function getAvatarColor(name: string) {
//   const colors = [
//     'bg-purple-500','bg-blue-500','bg-green-500',
//     'bg-amber-500', 'bg-red-500', 'bg-teal-500',
//     'bg-pink-500',  'bg-indigo-500',
//   ]
//   return colors[name.charCodeAt(0) % colors.length]
// }

// function getRoleStyle(role: string | null) {
//   switch (role) {
//     case 'instructor': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
//     case 'admin':      return 'bg-amber-500/20  text-amber-300  border border-amber-500/30'
//     default:           return 'bg-blue-500/20   text-blue-300   border border-blue-500/30'
//   }
// }

// export default function NewConversationModal({
//   isOpen,
//   onClose,
//   onCreated,
//   theme,
// }: NewConversationModalProps) {
//   const [convType, setConvType]         = useState<ConvType>('direct')
//   const [search, setSearch]             = useState('')
//   const [title, setTitle]               = useState('')
//   const [users, setUsers]               = useState<User[]>([])
//   const [selectedIds, setSelectedIds]   = useState<string[]>([])
//   const [loadingUsers, setLoadingUsers] = useState(false)
//   const [creating, setCreating]         = useState(false)
//   const [error, setError]               = useState<string | null>(null)
// //   const searchTimer                     = useRef<ReturnType<typeof setTimeout>>()
//   const searchTimer = useRef<number>(0)
//   const searchRef                       = useRef<HTMLInputElement>(null)

//   // ── Fetch users on open + search change ──────────────────────────────────
// //   useEffect(() => {
// //     if (!isOpen) return
// //     clearTimeout(searchTimer.current)
// //     searchTimer.current = setTimeout(() => fetchUsers(search), 300)
// //     return () => clearTimeout(searchTimer.current)
// //   }, [search, isOpen])


// useEffect(() => {
//   if (!isOpen) return
//   window.clearTimeout(searchTimer.current)
//   searchTimer.current = window.setTimeout(() => fetchUsers(search), 300)
//   return () => window.clearTimeout(searchTimer.current)
// }, [search, isOpen])

//   // Focus search on open
//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => searchRef.current?.focus(), 100)
//       setSelectedIds([])
//       setTitle('')
//       setError(null)
//       setConvType('direct')
//     }
//   }, [isOpen])

//   const fetchUsers = async (q: string) => {
//     setLoadingUsers(true)
//     try {
//       const url = q
//         ? `/api/messaging/users?search=${encodeURIComponent(q)}`
//         : '/api/messaging/users'
//       const res  = await fetch(url)
//       const data = await res.json()
//       setUsers(data.success ? data.data : [])
//     } catch {
//       setUsers([])
//     } finally {
//       setLoadingUsers(false)
//     }
//   }

//   // ── Toggle user selection ─────────────────────────────────────────────────
//   const toggleUser = (id: string) => {
//     setSelectedIds((prev) => {
//       if (convType === 'direct') {
//         // Direct message — only one recipient
//         return prev.includes(id) ? [] : [id]
//       }
//       // Group chat — multiple recipients
//       return prev.includes(id)
//         ? prev.filter((i) => i !== id)
//         : [...prev, id]
//     })
//   }

//   // ── Create conversation ───────────────────────────────────────────────────
//   const handleCreate = async () => {
//     if (selectedIds.length === 0) {
//       setError('Please select at least one recipient')
//       return
//     }
//     setCreating(true)
//     setError(null)

//     try {
//       const body: Record<string, unknown> = {
//         type:            convType,
//         participantIds:  selectedIds,
//       }
//       if (title.trim()) body.title = title.trim()

//       const res  = await fetch('/api/messaging/proxy/conversations', {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify(body),
//       })
//       const data = await res.json()

//     //   if (data.success) {
//     //     // Build a ConversationInbox shape from the created conversation
//     //     const selectedUser = users.find((u) => u.id === selectedIds[0])
//     //     const conv: ConversationInbox = {
//     //       ...data.data,
//     //       myRole:            'student',
//     //       lastReadAt:        null,
//     //       lastMessagePreview: null,
//     //       otherParticipant:  selectedUser
//     //         ? {
//     //             id:       selectedUser.id,
//     //             username: selectedUser.username,
//     //             name:     selectedUser.name,
//     //             image:    selectedUser.image,
//     //           }
//     //         : { id: selectedIds[0], username: '', name: 'Unknown', image: null },
//     //     }
//     //     onCreated(conv)
//     //     onClose()


//             if (data.success) {
//         // Fetch the full conversation with participant details
//         // so the inbox list shows correct name and avatar
//         try {
//             const fullRes  = await fetch(
//             `/api/messaging/proxy/conversations/${data.data.id}`
//             )
//             const fullData = await fullRes.json()

//             if (fullData.success) {
//             // Use the full conversation data from the inbox endpoint
//             const convRes  = await fetch('/api/messaging/proxy/conversations')
//             const convData = await convRes.json()

//             if (convData.success) {
//                 // Find this specific conversation in the fresh list
//                 const freshConv = convData.data.find(
//                 (c: ConversationInbox) => c.id === data.data.id
//                 )
//                 if (freshConv) {
//                 onCreated(freshConv)
//                 onClose()
//                 return
//                 }
//             }
//             }
//         } catch {
//             // fallback — build manually
//         }

//         // Fallback if fetch fails
//         const selectedUser = users.find((u) => u.id === selectedIds[0])
//         const conv: ConversationInbox = {
//             ...data.data,
//             myRole:             'student',
//             lastReadAt:         null,
//             lastMessagePreview: null,
//             otherParticipant: selectedUser
//             ? {
//                 id:       selectedUser.id,
//                 username: selectedUser.username,
//                 name:     selectedUser.name,
//                 image:    selectedUser.image,
//                 }
//             : {
//                 id:       selectedIds[0],
//                 username: '',
//                 name:     'Unknown',
//                 image:    null,
//                 },
//         }
//         onCreated(conv)
//         onClose()
        

//       } else {
//         setError(data.error?.message ?? 'Failed to create conversation')
//       }
//     } catch {
//       setError('Network error — please try again')
//     } finally {
//       setCreating(false)
//     }
//   }

//   if (!isOpen) return null

//   const selectedCount = selectedIds.length

//   return (
//     // ── Backdrop ────────────────────────────────────────────────────────────
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
//       onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
//     >
//       {/* ── Modal ─────────────────────────────────────────────────────────── */}
//       <div className={`
//         w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl
//         border ${theme.border} ${theme.surface}
//         flex flex-col max-h-[90vh]
//       `}>

//         {/* Header */}
//         <div className={`flex items-center gap-3 px-6 py-4 border-b ${theme.border}`}>
//           <div className={`w-8 h-8 rounded-lg ${theme.accent} flex items-center justify-center flex-shrink-0`}>
//             <MessageSquare className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <div className={`text-sm font-semibold ${theme.text}`}>New Conversation</div>
//             <div className={`text-xs ${theme.textMuted}`}>Start a direct message or group chat</div>
//           </div>
//           <button
//             onClick={onClose}
//             className={`ml-auto p-1.5 rounded-lg ${theme.textSec} hover:${theme.text} transition-colors`}
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex flex-1 min-h-0 overflow-hidden">

//           {/* ── Left panel ──────────────────────────────────────────────── */}
//           <div className={`w-[220px] flex-shrink-0 border-r ${theme.border} p-4 flex flex-col gap-5 overflow-y-auto`}>

//             {/* Conversation type */}
//             <div>
//               <div className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${theme.textMuted}`}>
//                 Conversation Type
//               </div>
//               <div className="space-y-2">
//                 {/* Direct Message */}
//                 <button
//                   onClick={() => { setConvType('direct'); setSelectedIds([]) }}
//                   className={`
//                     w-full flex items-start gap-2.5 p-3 rounded-xl border text-left
//                     transition-all duration-150
//                     ${convType === 'direct'
//                       ? `${theme.accentSoft} ${theme.accentBorder}`
//                       : `${theme.surface2} ${theme.border} hover:${theme.border}`
//                     }
//                   `}
//                 >
//                   <div className={`
//                     w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
//                     ${convType === 'direct' ? theme.accent : theme.surface2}
//                   `}>
//                     <MessageSquare className={`w-3.5 h-3.5 ${convType === 'direct' ? 'text-white' : theme.textSec}`} />
//                   </div>
//                   <div>
//                     <div className={`text-xs font-semibold ${theme.text}`}>Direct Message</div>
//                     <div className={`text-[10px] ${theme.textMuted} mt-0.5`}>One-on-one conversation</div>
//                   </div>
//                 </button>

//                 {/* Group Chat */}
//                 <button
//                   onClick={() => setConvType('group')}
//                   className={`
//                     w-full flex items-start gap-2.5 p-3 rounded-xl border text-left
//                     transition-all duration-150
//                     ${convType === 'group'
//                       ? `${theme.accentSoft} ${theme.accentBorder}`
//                       : `${theme.surface2} ${theme.border} hover:${theme.border}`
//                     }
//                   `}
//                 >
//                   <div className={`
//                     w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
//                     ${convType === 'group' ? theme.accent : theme.surface2}
//                   `}>
//                     <Users className={`w-3.5 h-3.5 ${convType === 'group' ? 'text-white' : theme.textSec}`} />
//                   </div>
//                   <div>
//                     <div className={`text-xs font-semibold ${theme.text}`}>Group Chat</div>
//                     <div className={`text-[10px] ${theme.textMuted} mt-0.5`}>Multiple participants</div>
//                   </div>
//                 </button>
//               </div>
//             </div>

//             {/* Optional title */}
//             <div>
//               <div className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${theme.textMuted}`}>
//                 Optional Title
//               </div>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Add a title..."
//                 className={`
//                   w-full px-3 py-2 rounded-lg border ${theme.border}
//                   ${theme.inputBg} ${theme.text} text-xs
//                   placeholder:text-[#4a5568] outline-none
//                   focus:border-[#4f6ef7] transition-colors
//                 `}
//               />
//             </div>
//           </div>

//           {/* ── Right panel ─────────────────────────────────────────────── */}
//           <div className="flex-1 flex flex-col min-w-0 p-4">

//             {/* Search */}
//             <div className={`
//               flex items-center gap-2 px-3 py-2.5 rounded-xl border
//               ${theme.border} ${theme.inputBg} mb-3
//               focus-within:border-[#4f6ef7] transition-colors
//             `}>
//               <Search className={`w-3.5 h-3.5 ${theme.textMuted} flex-shrink-0`} />
//               <input
//                 ref={searchRef}
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by name or department..."
//                 className={`
//                   bg-transparent text-xs ${theme.text}
//                   placeholder:text-[#4a5568] outline-none w-full
//                 `}
//               />
//             </div>

//             {/* User list */}
//             <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin min-h-[200px]">
//               {loadingUsers ? (
//                 <div className="flex items-center justify-center h-20">
//                   <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#4f6ef7] animate-spin" />
//                 </div>
//               ) : users.length === 0 ? (
//                 <div className={`flex flex-col items-center justify-center h-20 gap-2 ${theme.textMuted}`}>
//                   <span className="text-lg">🔍</span>
//                   <span className="text-xs">No users found</span>
//                 </div>
//               ) : (
//                 users.map((user) => {
//                   const isSelected = selectedIds.includes(user.id)
//                   return (
//                     <button
//                       key={user.id}
//                       onClick={() => toggleUser(user.id)}
//                       className={`
//                         w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
//                         border text-left transition-all duration-150
//                         ${isSelected
//                           ? `${theme.accentSoft} border-[#4f6ef7]/40`
//                           : `border-transparent hover:${theme.surface2}`
//                         }
//                       `}
//                     >
//                       {/* Checkbox */}
//                       <div className={`
//                         w-4.5 h-4.5 rounded-md border flex items-center justify-center
//                         flex-shrink-0 transition-all
//                         ${isSelected
//                           ? 'bg-[#4f6ef7] border-[#4f6ef7]'
//                           : `${theme.border} border-2`
//                         }
//                       `}
//                         style={{ width: 18, height: 18 }}
//                       >
//                         {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
//                       </div>

//                       {/* Avatar */}
//                       <div className="relative flex-shrink-0">
//                         {user.image ? (
//                           <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
//                         ) : (
//                           <div className={`w-9 h-9 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center`}>
//                             <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
//                           </div>
//                         )}
//                         {/* Online dot placeholder */}
//                         <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#111420]" />
//                       </div>

//                       {/* User info */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-0.5">
//                           <span className={`text-xs font-semibold ${theme.text} truncate`}>{user.name}</span>
//                           {user.primary_role && (
//                             <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${getRoleStyle(user.primary_role)}`}>
//                               {user.primary_role}
//                             </span>
//                           )}
//                         </div>
//                         <div className={`text-[10px] ${theme.textMuted} truncate`}>
//                           {user.email}
//                           {user.username && ` · @${user.username}`}
//                         </div>
//                       </div>

//                       {/* Online indicator */}
//                       <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
//                     </button>
//                   )
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className={`
//           flex items-center justify-between
//           px-6 py-4 border-t ${theme.border} ${theme.surface2}
//         `}>
//           {/* Selected count */}
//           <div className={`text-xs ${theme.textSec}`}>
//             {selectedCount === 0
//               ? <span className={theme.textMuted}>No recipients selected</span>
//               : <span><strong className="text-[#4f6ef7]">{selectedCount}</strong> recipient{selectedCount > 1 ? 's' : ''} selected</span>
//             }
//           </div>

//           {/* Error */}
//           {error && (
//             <span className="text-xs text-red-400 flex-1 text-center px-4">{error}</span>
//           )}

//           {/* Buttons */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={onClose}
//               className={`px-4 py-2 rounded-lg text-xs font-medium border ${theme.border} ${theme.textSec} hover:${theme.text} transition-colors`}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleCreate}
//               disabled={selectedCount === 0 || creating}
//               className={`
//                 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold
//                 text-white transition-all
//                 ${selectedCount > 0 && !creating
//                   ? 'bg-[#4f6ef7] hover:bg-[#3d5ce6]'
//                   : 'bg-[#4f6ef7]/40 cursor-not-allowed'
//                 }
//               `}
//             >
//               {creating ? (
//                 <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
//               ) : (
//                 <MessageSquare className="w-3 h-3" />
//               )}
//               Create Conversation
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



























// src/components/messaging/new-conversation-modal.tsx
// Screen 02 — New Conversation modal
// Supports both Direct Message (single recipient) and Group Chat (multiple)
// Group chat requires a title
// Queries axioquan users directly via /api/messaging/users

'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search, MessageSquare, Users, Check } from 'lucide-react'
import type { ConversationInbox } from '@/lib/messaging/types'

interface User {
  id:           string
  name:         string
  email:        string
  username:     string
  image:        string | null
  primary_role: string | null
}

interface NewConversationModalProps {
  isOpen:    boolean
  onClose:   () => void
  onCreated: (conv: ConversationInbox) => void
  theme:     Record<string, string>
}

type ConvType = 'direct' | 'group'

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-purple-500','bg-blue-500','bg-green-500',
    'bg-amber-500', 'bg-red-500', 'bg-teal-500',
    'bg-pink-500',  'bg-indigo-500',
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

function getRoleStyle(role: string | null) {
  switch (role) {
    case 'instructor': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    case 'admin':      return 'bg-amber-500/20  text-amber-300  border border-amber-500/30'
    default:           return 'bg-blue-500/20   text-blue-300   border border-blue-500/30'
  }
}

export default function NewConversationModal({
  isOpen,
  onClose,
  onCreated,
  theme,
}: NewConversationModalProps) {
  const [convType, setConvType]         = useState<ConvType>('direct')
  const [search, setSearch]             = useState('')
  const [title, setTitle]               = useState('')
  const [users, setUsers]               = useState<User[]>([])
  const [selectedIds, setSelectedIds]   = useState<string[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [creating, setCreating]         = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const searchTimer                     = useRef<number>(0)
  const searchRef                       = useRef<HTMLInputElement>(null)

  // ── Fetch users on open + search change ───────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => fetchUsers(search), 300)
    return () => window.clearTimeout(searchTimer.current)
  }, [search, isOpen])

  // ── Reset on open ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 100)
      setSelectedIds([])
      setTitle('')
      setError(null)
      setConvType('direct')
      setSearch('')
    }
  }, [isOpen])

  // ── Enforce single select for direct ─────────────────────────────────────
  useEffect(() => {
    if (convType === 'direct' && selectedIds.length > 1) {
      setSelectedIds([selectedIds[0]])
    }
  }, [convType])

  const fetchUsers = async (q: string) => {
    setLoadingUsers(true)
    try {
      const url  = q
        ? `/api/messaging/users?search=${encodeURIComponent(q)}`
        : '/api/messaging/users'
      const res  = await fetch(url)
      const data = await res.json()
      setUsers(data.success ? data.data : [])
    } catch {
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  // ── Toggle user selection ─────────────────────────────────────────────────
  const toggleUser = (id: string) => {
    setError(null)
    setSelectedIds((prev) => {
      if (convType === 'direct') {
        // Single select for direct message
        return prev.includes(id) ? [] : [id]
      }
      // Multi select for group
      return prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    })
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (selectedIds.length === 0) return 'Please select at least one recipient'
    if (convType === 'group' && selectedIds.length < 2) {
      return 'Group chat requires at least 2 recipients'
    }
    if (convType === 'group' && !title.trim()) {
      return 'Please add a group name'
    }
    return null
  }

  // ── Create conversation ───────────────────────────────────────────────────
  const handleCreate = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setCreating(true)
    setError(null)

    try {
      const body: Record<string, unknown> = {
        type:           convType,
        participantIds: selectedIds,
      }
      if (title.trim()) body.title = title.trim()

      const res  = await fetch('/api/messaging/proxy/conversations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()

      if (data.success) {
        // Fetch fresh conversation list to get correct shape
        try {
          const convRes  = await fetch('/api/messaging/proxy/conversations')
          const convData = await convRes.json()
          if (convData.success) {
            const freshConv = convData.data.find(
              (c: ConversationInbox) => c.id === data.data.id
            )
            if (freshConv) {
              onCreated(freshConv)
              onClose()
              return
            }
          }
        } catch { /* fallback below */ }

        // Fallback — build manually from selected users
        const selectedUsers = users.filter((u) => selectedIds.includes(u.id))
        const firstUser     = selectedUsers[0]
        const conv: ConversationInbox = {
          ...data.data,
          myRole:             'student',
          lastReadAt:         null,
          lastMessagePreview: null,
          otherParticipant: firstUser
            ? {
                id:       firstUser.id,
                username: firstUser.username,
                name:     convType === 'group'
                  ? (title || 'Group Chat')
                  : firstUser.name,
                image: convType === 'group' ? null : firstUser.image,
              }
            : { id: selectedIds[0], username: '', name: 'Unknown', image: null },
        }
        onCreated(conv)
        onClose()
      } else {
        setError(data.error?.message ?? 'Failed to create conversation')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  const selectedCount  = selectedIds.length
  const selectedUsers  = users.filter((u) => selectedIds.includes(u.id))
  const isGroupValid   = convType === 'group'
    ? selectedCount >= 2 && title.trim().length > 0
    : selectedCount === 1
  const canCreate      = isGroupValid && !creating

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`
        w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl
        border ${theme.border} ${theme.surface}
        flex flex-col max-h-[90vh]
      `}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${theme.border}`}>
          <div className={`
            w-8 h-8 rounded-lg ${theme.accent}
            flex items-center justify-center flex-shrink-0
          `}>
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className={`text-sm font-semibold ${theme.text}`}>
              New Conversation
            </div>
            <div className={`text-xs ${theme.textMuted}`}>
              Start a direct message or group chat
            </div>
          </div>
          <button
            onClick={onClose}
            className={`ml-auto p-1.5 rounded-lg ${theme.textSec} transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Left panel */}
          <div className={`
            w-[220px] flex-shrink-0 border-r ${theme.border}
            p-4 flex flex-col gap-5 overflow-y-auto
          `}>

            {/* Conversation type */}
            <div>
              <div className={`
                text-[10px] font-bold tracking-widest uppercase mb-2
                ${theme.textMuted}
              `}>
                Message Type
              </div>
              <div className="space-y-2">

                {/* Direct Message */}
                <button
                  onClick={() => {
                    setConvType('direct')
                    // Keep only first selected if switching from group
                    if (selectedIds.length > 1) {
                      setSelectedIds([selectedIds[0]])
                    }
                  }}
                  className={`
                    w-full flex items-start gap-2.5 p-3 rounded-xl border
                    text-left transition-all duration-150
                    ${convType === 'direct'
                      ? `${theme.accentSoft} ${theme.accentBorder}`
                      : `${theme.surface2} ${theme.border}`
                    }
                  `}
                >
                  <div className={`
                    w-7 h-7 rounded-lg flex items-center justify-center
                    flex-shrink-0 mt-0.5
                    ${convType === 'direct' ? theme.accent : theme.surface2}
                  `}>
                    <MessageSquare className={`
                      w-3.5 h-3.5
                      ${convType === 'direct' ? 'text-white' : theme.textSec}
                    `} />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${theme.text}`}>
                      Direct Message
                    </div>
                    <div className={`text-[10px] ${theme.textMuted} mt-0.5`}>
                      One-on-one conversation
                    </div>
                  </div>
                </button>

                {/* Group Chat */}
                <button
                  onClick={() => setConvType('group')}
                  className={`
                    w-full flex items-start gap-2.5 p-3 rounded-xl border
                    text-left transition-all duration-150
                    ${convType === 'group'
                      ? `${theme.accentSoft} ${theme.accentBorder}`
                      : `${theme.surface2} ${theme.border}`
                    }
                  `}
                >
                  <div className={`
                    w-7 h-7 rounded-lg flex items-center justify-center
                    flex-shrink-0 mt-0.5
                    ${convType === 'group' ? theme.accent : theme.surface2}
                  `}>
                    <Users className={`
                      w-3.5 h-3.5
                      ${convType === 'group' ? 'text-white' : theme.textSec}
                    `} />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${theme.text}`}>
                      Group Chat
                    </div>
                    <div className={`text-[10px] ${theme.textMuted} mt-0.5`}>
                      Multiple participants
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Group name — required for group */}
            <div>
              <div className={`
                text-[10px] font-bold tracking-widest uppercase mb-2
                ${theme.textMuted}
              `}>
                {convType === 'group'
                  ? <span>Group Name <span className="text-red-400">*</span></span>
                  : 'Optional Title'
                }
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(null) }}
                placeholder={convType === 'group' ? 'Enter group name...' : 'Add a title...'}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${convType === 'group' && !title.trim()
                    ? 'border-red-500/40'
                    : theme.border
                  }
                  ${theme.inputBg} ${theme.text} text-xs
                  placeholder:text-[#4a5568] outline-none
                  focus:border-[#4f6ef7] transition-colors
                `}
              />
              {convType === 'group' && !title.trim() && (
                <p className="text-[10px] text-red-400 mt-1 px-1">
                  Required for group chat
                </p>
              )}
            </div>

            {/* Selected users preview */}
            {selectedIds.length > 0 && (
              <div>
                <div className={`
                  text-[10px] font-bold tracking-widest uppercase mb-2
                  ${theme.textMuted}
                `}>
                  Selected ({selectedCount})
                </div>
                <div className="space-y-1.5">
                  {selectedUsers.map((u) => (
                    <div
                      key={u.id}
                      className={`
                        flex items-center gap-2 px-2 py-1.5 rounded-lg
                        ${theme.accentSoft}
                      `}
                    >
                      {u.image ? (
                        <img
                          src={u.image}
                          alt={u.name}
                          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`
                          w-5 h-5 rounded-full ${getAvatarColor(u.name)}
                          flex items-center justify-center flex-shrink-0
                        `}>
                          <span className="text-white text-[8px] font-bold">
                            {getInitials(u.name)}
                          </span>
                        </div>
                      )}
                      <span className={`text-[10px] font-medium ${theme.text} truncate flex-1`}>
                        {u.name}
                      </span>
                      <button
                        onClick={() => toggleUser(u.id)}
                        className={`${theme.textMuted} hover:text-red-400 flex-shrink-0`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group requirements hint */}
            {convType === 'group' && (
              <div className={`
                text-[10px] ${theme.textMuted} leading-relaxed
                p-2.5 rounded-lg border ${theme.border} ${theme.surface2}
              `}>
                <div className="font-semibold mb-1">Group requirements:</div>
                <div className={`flex items-center gap-1.5 ${selectedCount >= 2 ? 'text-green-400' : ''}`}>
                  <span>{selectedCount >= 2 ? '✓' : '○'}</span>
                  At least 2 recipients
                </div>
                <div className={`flex items-center gap-1.5 ${title.trim() ? 'text-green-400' : ''}`}>
                  <span>{title.trim() ? '✓' : '○'}</span>
                  Group name required
                </div>
              </div>
            )}
          </div>

          {/* Right panel — user search */}
          <div className="flex-1 flex flex-col min-w-0 p-4">

            {/* Search */}
            <div className={`
              flex items-center gap-2 px-3 py-2.5 rounded-xl border
              ${theme.border} ${theme.inputBg} mb-3
              focus-within:border-[#4f6ef7] transition-colors
            `}>
              <Search className={`w-3.5 h-3.5 ${theme.textMuted} flex-shrink-0`} />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className={`
                  bg-transparent text-xs ${theme.text}
                  placeholder:text-[#4a5568] outline-none w-full
                `}
              />
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin min-h-[200px]">
              {loadingUsers ? (
                <div className="flex items-center justify-center h-20">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#4f6ef7] animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className={`
                  flex flex-col items-center justify-center h-20 gap-2
                  ${theme.textMuted}
                `}>
                  <span className="text-lg">🔍</span>
                  <span className="text-xs">No users found</span>
                </div>
              ) : (
                users.map((user) => {
                  const isSelected = selectedIds.includes(user.id)
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5
                        rounded-xl border text-left transition-all duration-150
                        ${isSelected
                          ? `${theme.accentSoft} border-[#4f6ef7]/40`
                          : `border-transparent hover:${theme.surface2}`
                        }
                      `}
                    >
                      {/* Checkbox */}
                      <div
                        className={`
                          rounded-md border flex items-center justify-center
                          flex-shrink-0 transition-all
                          ${isSelected
                            ? 'bg-[#4f6ef7] border-[#4f6ef7]'
                            : `${theme.border} border-2`
                          }
                          ${convType === 'group' ? 'rounded-md' : 'rounded-full'}
                        `}
                        style={{ width: 18, height: 18 }}
                      >
                        {isSelected && (
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`
                            w-9 h-9 rounded-full ${getAvatarColor(user.name)}
                            flex items-center justify-center
                          `}>
                            <span className="text-white text-xs font-bold">
                              {getInitials(user.name)}
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#111420]" />
                      </div>

                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-semibold ${theme.text} truncate`}>
                            {user.name}
                          </span>
                          {user.primary_role && (
                            <span className={`
                              text-[9px] font-bold uppercase px-1.5 py-0.5
                              rounded flex-shrink-0 ${getRoleStyle(user.primary_role)}
                            `}>
                              {user.primary_role}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] ${theme.textMuted} truncate`}>
                          {user.email}
                        </div>
                      </div>

                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className={`
          flex items-center justify-between
          px-6 py-4 border-t ${theme.border} ${theme.surface2}
        `}>
          <div className={`text-xs ${theme.textSec}`}>
            {selectedCount === 0 ? (
              <span className={theme.textMuted}>No recipients selected</span>
            ) : (
              <span>
                <strong className="text-[#4f6ef7]">{selectedCount}</strong>
                {' '}recipient{selectedCount > 1 ? 's' : ''} selected
                {convType === 'group' && selectedCount < 2 && (
                  <span className={`ml-2 ${theme.textMuted}`}>
                    (need at least 2 for group)
                  </span>
                )}
              </span>
            )}
          </div>

          {error && (
            <span className="text-xs text-red-400 flex-1 text-center px-4">
              {error}
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`
                px-4 py-2 rounded-lg text-xs font-medium
                border ${theme.border} ${theme.textSec}
                hover:${theme.text} transition-colors
              `}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg
                text-xs font-semibold text-white transition-all
                ${canCreate
                  ? 'bg-[#4f6ef7] hover:bg-[#3d5ce6]'
                  : 'bg-[#4f6ef7]/40 cursor-not-allowed'
                }
              `}
            >
              {creating ? (
                <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
              ) : convType === 'group' ? (
                <Users className="w-3 h-3" />
              ) : (
                <MessageSquare className="w-3 h-3" />
              )}
              {convType === 'group' ? 'Create Group' : 'Create Conversation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}