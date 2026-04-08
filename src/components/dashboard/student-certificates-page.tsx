// // /components/dashboard/student-certificates-page.tsx

// 'use client'

// import { useState } from "react"

// const certificatesData = [
//   {
//     id: 1,
//     title: "Introduction to Python Programming",
//     instructor: "Dr. Sarah Johnson",
//     issueDate: "March 15, 2024",
//     category: "Programming",
//     score: 95,
//     certificateId: "#AQ-2024-PY-001334",
//   },
//   {
//     id: 2,
//     title: "JavaScript Basics",
//     instructor: "John Smith",
//     issueDate: "March 1, 2024",
//     category: "Programming",
//     score: 80,
//     certificateId: "#AQ-2024-JS-001223",
//   },
//   {
//     id: 3,
//     title: "HTML & CSS Fundamentals",
//     instructor: "Emma Wilson",
//     issueDate: "February 20, 2024",
//     category: "Programming",
//     score: 98,
//     certificateId: "#AQ-2024-WEB-001089",
//   },
// ]

// const specialAwardsData = [
//   {
//     id: 1,
//     title: "Outstanding Participation",
//     description: "Awarded for exceptional engagement and contribution in class discussions",
//   },
//   {
//     id: 2,
//     title: "Quick Learner",
//     description: "Completed course 2 weeks ahead of schedule",
//   },
//   {
//     id: 3,
//     title: "Perfect Score",
//     description: "Achieved 100% on final assessment",
//   },
// ]

// export default function StudentCertificatesPage() {
//   const [filter, setFilter] = useState("certificates")

//   return (
//     <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Certificates</h1>
//         <p className="text-gray-600 mt-2">Your earned certificates and achievements</p>
//       </div>

//       {/* Stats cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Total Certificates</p>
//               <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{certificatesData.length}</p>
//             </div>
//             <div className="text-3xl md:text-4xl">📜</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Course Completions</p>
//               <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">3</p>
//             </div>
//             <div className="text-3xl md:text-4xl">✓</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Specializations</p>
//               <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-2">1</p>
//             </div>
//             <div className="text-3xl md:text-4xl">🎯</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Achievements</p>
//               <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-2">{specialAwardsData.length}</p>
//             </div>
//             <div className="text-3xl md:text-4xl">⭐</div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-2 md:gap-3 mb-8 border-b border-gray-200">
//         <button
//           onClick={() => setFilter("certificates")}
//           className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
//             filter === "certificates"
//               ? "border-blue-600 text-blue-600"
//               : "border-transparent text-gray-600 hover:text-gray-900"
//           }`}
//         >
//           Course Certificates ({certificatesData.length})
//         </button>

//         <button
//           onClick={() => setFilter("awards")}
//           className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
//             filter === "awards"
//               ? "border-blue-600 text-blue-600"
//               : "border-transparent text-gray-600 hover:text-gray-900"
//           }`}
//         >
//           Special Awards ({specialAwardsData.length})
//         </button>
//       </div>

//       {filter === "certificates" ? (
//         <div className="space-y-4 md:space-y-6">
//           {certificatesData.map((cert) => (
//             <div
//               key={cert.id}
//               className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow p-4 md:p-6"
//             >
//               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-4 pb-4 border-b border-gray-200">
//                 {/* Badge */}
//                 <div className="flex-shrink-0">
//                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl md:text-4xl">
//                     🎖
//                   </div>
//                 </div>

//                 {/* Certificate Info */}
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{cert.title}</h3>
//                   <p className="text-xs md:text-sm text-gray-600">Instructor: {cert.instructor}</p>
//                   <p className="text-xs md:text-sm text-gray-600">Issued {cert.issueDate}</p>
//                 </div>

//                 {/* Score Badge */}
//                 <div className="flex-shrink-0 bg-green-50 rounded-lg px-4 py-2 text-center">
//                   <p className="text-xs text-gray-600">Score</p>
//                   <p className="text-2xl font-bold text-green-600">{cert.score}%</p>
//                 </div>
//               </div>

//               {/* Category and Certificate ID */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//                 <div className="flex items-center gap-2">
//                   <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
//                     {cert.category}
//                   </span>
//                   <span className="text-xs text-gray-600">{cert.certificateId}</span>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-2">
//                 <button className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base flex items-center justify-center gap-2">
//                   📥 Download PDF
//                 </button>
//                 <button className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base">
//                   Share
//                 </button>
//                 <button className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base">
//                   Verify
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-4 md:space-y-6">
//           {specialAwardsData.map((award) => (
//             <div
//               key={award.id}
//               className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="text-3xl md:text-4xl flex-shrink-0">🏆</div>
//                 <div className="flex-1">
//                   <h3 className="text-lg md:text-xl font-bold text-gray-900">{award.title}</h3>
//                   <p className="text-sm md:text-base text-gray-600 mt-1">{award.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Share Achievement CTA */}
//       <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 md:p-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900">Share Your Achievements</h3>
//             <p className="text-sm md:text-base text-gray-600 mt-2">
//               Add certificates to your LinkedIn profile or download them as PDFs
//             </p>
//           </div>
//           <button className="flex-shrink-0 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base whitespace-nowrap">
//             Share on LinkedIn
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }






















// 'use client'
// // /components/dashboard/student-certificates-page.tsx
// //
// // KEY DESIGN DECISION:
// //   Download uses the EXACT buildCertHTML exported from certificate-generator.tsx
// //   feeding it the values already stored in the DB (student_name, course_title,
// //   overall_score, final_grade, issued_at, certificate_code).
// //   Nothing is regenerated — the student always gets the identical certificate
// //   the instructor issued.

// import { useState, useEffect, useRef } from 'react'
// import { buildCertHTML, type CertificateData } from '@/components/dashboard/certificate-generator'

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface CertRecord {
//   id: string
//   certificate_code: string
//   issued_at: string
//   final_grade?: string
//   overall_score?: number
//   completion_percentage?: number
//   course_title: string
//   instructor_name: string
//   student_name: string
//   assessment_id?: string
//   course_id: string
// }

// interface Achievement {
//   id: string
//   title: string
//   description: string
//   icon?: string
//   awarded_at?: string
//   badge_color?: string
// }

// // ─── Map DB record → CertificateData (shape expected by buildCertHTML) ────────
// // Uses ONLY values already stored in the database — nothing fabricated.
// function toCertificateData(cert: CertRecord): CertificateData {
//   return {
//     studentId:     cert.id,              // required by type, not rendered in HTML
//     studentName:   cert.student_name,    // from certificate_data.student_name JSONB
//     courseTitle:   cert.course_title,    // from certificate_data.course_title JSONB
//     averageScore:  cert.overall_score ?? 0,
//     assessmentId:  cert.assessment_id ?? '',
//     courseId:      cert.course_id,
//     completedDate: cert.issued_at,       // real issued_at stored by the instructor
//   }
// }

// // ─── Open print window — uses shared certificate-generator HTML exactly ───────
// function openCertPrintWindow(cert: CertRecord): void {
//   const data = toCertificateData(cert)
//   // cert.certificate_code is the EXACT code the instructor issued — never generate a new one
//   const html = buildCertHTML(data, cert.certificate_code)
//   const win = window.open('', '_blank', 'width=1200,height=850')
//   if (!win) {
//     alert('Please allow popups to download your certificate.')
//     return
//   }
//   win.document.write(html)
//   win.document.close()
//   // buildCertHTML already includes a <script> that calls window.print() after fonts load
// }

// // ─── Share dropdown ───────────────────────────────────────────────────────────
// function ShareDropdown({ cert }: { cert: CertRecord }) {
//   const [open, setOpen]     = useState(false)
//   const [copied, setCopied] = useState(false)
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   const shareText = `I earned a certificate for completing "${cert.course_title}" on AxioQuan! 🎓`
//   const origin    = typeof window !== 'undefined' ? window.location.origin : 'https://axioquan.com'
//   const verifyUrl = `${origin}/verify?code=${cert.certificate_code}`

//   const copyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(verifyUrl)
//     } catch {
//       const el = document.createElement('textarea')
//       el.value = verifyUrl
//       document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
//     }
//     setCopied(true)
//     setTimeout(() => { setCopied(false); setOpen(false) }, 1800)
//   }

//   const options = [
//     { label: copied ? '✅ Copied!' : '🔗 Copy Verify Link', action: copyLink },
//     {
//       label: '💼 LinkedIn',
//       action: () => {
//         window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`, '_blank', 'noopener,noreferrer')
//         setOpen(false)
//       },
//     },
//     {
//       label: '🐦 X (Twitter)',
//       action: () => {
//         window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(verifyUrl)}`, '_blank', 'noopener,noreferrer')
//         setOpen(false)
//       },
//     },
//     {
//       label: '💬 WhatsApp',
//       action: () => {
//         window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + verifyUrl)}`, '_blank', 'noopener,noreferrer')
//         setOpen(false)
//       },
//     },
//     {
//       label: '✉️ Email',
//       action: () => {
//         window.location.href = `mailto:?subject=${encodeURIComponent(`My AxioQuan Certificate: ${cert.course_title}`)}&body=${encodeURIComponent(`${shareText}\n\nVerify here: ${verifyUrl}`)}`
//         setOpen(false)
//       },
//     },
//   ]

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(v => !v)}
//         className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1.5"
//       >
//         🔗 Share
//         <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {open && (
//         <div className="absolute bottom-full mb-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[210px]">
//           <div className="px-4 py-2 border-b border-gray-100">
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Share Certificate</p>
//           </div>
//           {options.map((opt, i) => (
//             <button key={i} onClick={opt.action}
//               className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//               {opt.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function Skeleton({ className }: { className?: string }) {
//   return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function StudentCertificatesPage() {
//   const [filter, setFilter]                 = useState<'certificates' | 'awards'>('certificates')
//   const [certificates, setCertificates]     = useState<CertRecord[]>([])
//   const [achievements, setAchievements]     = useState<Achievement[]>([])
//   const [totalCertificates, setTotal]       = useState(0)
//   const [courseCompletions, setCompletions] = useState(0)
//   const [loading, setLoading]               = useState(true)
//   const [error, setError]                   = useState<string | null>(null)

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true)
//         const res = await fetch('/api/certificates/student')
//         if (!res.ok) throw new Error('Failed to load certificates')
//         const data = await res.json()
//         setCertificates(data.certificates ?? [])
//         setAchievements(data.achievements ?? [])
//         setTotal(data.totalCertificates ?? 0)
//         setCompletions(data.courseCompletions ?? 0)
//       } catch (err: any) {
//         setError(err.message ?? 'Unknown error')
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//   }, [])

//   const formatDate = (iso: string) => {
//     try {
//       return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
//     } catch { return iso }
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Certificates</h1>
//         <p className="text-gray-600 mt-2">Your earned certificates and achievements</p>
//       </div>

//       {/* Stats — 3 cards (Specializations removed) */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
//         <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500 font-medium">Total Certificates</p>
//               {loading ? <Skeleton className="h-9 w-12 mt-2" />
//                 : <p className="text-3xl font-bold text-blue-600 mt-1">{totalCertificates}</p>}
//             </div>
//             <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">📜</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500 font-medium">Course Completions</p>
//               {loading ? <Skeleton className="h-9 w-12 mt-2" />
//                 : <p className="text-3xl font-bold text-green-600 mt-1">{courseCompletions}</p>}
//             </div>
//             <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500 font-medium">Achievements</p>
//               {loading ? <Skeleton className="h-9 w-12 mt-2" />
//                 : <p className="text-3xl font-bold text-amber-500 mt-1">{achievements.length}</p>}
//             </div>
//             <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">⭐</div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex flex-wrap gap-1 mb-8 border-b border-gray-200">
//         <button
//           onClick={() => setFilter('certificates')}
//           className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
//             filter === 'certificates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
//           }`}
//         >
//           Course Certificates {!loading && `(${certificates.length})`}
//         </button>
//         <button
//           onClick={() => setFilter('awards')}
//           className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
//             filter === 'awards' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
//           }`}
//         >
//           Achievements {!loading && `(${achievements.length})`}
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
//           ⚠️ {error}
//         </div>
//       )}

//       {/* ── CERTIFICATES TAB ─────────────────────────────────────────────────── */}
//       {filter === 'certificates' && (
//         <div className="space-y-4 md:space-y-5">
//           {loading ? (
//             [1, 2].map(i => (
//               <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
//                 <div className="flex gap-4">
//                   <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
//                   <div className="flex-1 space-y-2">
//                     <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" />
//                   </div>
//                   <Skeleton className="w-20 h-16 rounded-xl flex-shrink-0" />
//                 </div>
//                 <Skeleton className="h-4 w-1/4" />
//                 <div className="flex gap-2">
//                   <Skeleton className="h-10 w-36 rounded-lg" /><Skeleton className="h-10 w-28 rounded-lg" /><Skeleton className="h-10 w-24 rounded-lg" />
//                 </div>
//               </div>
//             ))
//           ) : certificates.length === 0 ? (
//             <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
//               <div className="text-5xl mb-4">📭</div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">No certificates yet</h3>
//               <p className="text-gray-500 text-sm">Complete a course and pass the assessment to earn your first certificate.</p>
//             </div>
//           ) : (
//             certificates.map(cert => (
//               <div key={cert.id} className="bg-white rounded-xl border border-gray-200 overflow-visible hover:shadow-md transition-shadow p-5 md:p-6">
//                 {/* Top row */}
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
//                   <div className="flex-shrink-0">
//                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl shadow-md">🎖</div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-base md:text-lg font-bold text-gray-900 truncate mb-1">{cert.course_title}</h3>
//                     <p className="text-xs text-gray-500">Instructor: <span className="font-medium text-gray-700">{cert.instructor_name}</span></p>
//                     <p className="text-xs text-gray-500 mt-0.5">Issued: <span className="font-medium text-gray-700">{formatDate(cert.issued_at)}</span></p>
//                   </div>
//                   <div className="flex-shrink-0 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-center">
//                     <p className="text-xs text-gray-500 font-medium">Score</p>
//                     <p className="text-2xl font-bold text-green-600 leading-none mt-1">{cert.overall_score ?? 0}%</p>
//                   </div>
//                 </div>

//                 {/* Meta */}
//                 <div className="flex flex-wrap items-center gap-2 mb-4">
//                   {cert.final_grade && (
//                     <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
//                       Grade: {cert.final_grade}
//                     </span>
//                   )}
//                   <span className="text-xs text-gray-400 font-mono">{cert.certificate_code}</span>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-wrap gap-2">
//                   {/* Download — renders the exact same cert the instructor issued */}
//                   <button
//                     onClick={() => openCertPrintWindow(cert)}
//                     className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
//                   >
//                     📥 Download PDF
//                   </button>

//                   <ShareDropdown cert={cert} />

//                   {/* Verify — coming soon */}
//                   <div className="relative group flex-1 sm:flex-none">
//                     <button disabled className="w-full px-4 py-2.5 border border-gray-200 text-gray-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed bg-gray-50">
//                       🔍 Verify
//                     </button>
//                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                       Coming soon
//                       <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* ── ACHIEVEMENTS TAB ─────────────────────────────────────────────────── */}
//       {filter === 'awards' && (
//         <div className="space-y-4">
//           {loading ? (
//             [1, 2, 3].map(i => (
//               <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
//                 <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
//                 <div className="flex-1 space-y-2"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-4 w-3/4" /></div>
//               </div>
//             ))
//           ) : achievements.length === 0 ? (
//             <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
//               <div className="text-5xl mb-4">🏅</div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">No achievements yet</h3>
//               <p className="text-gray-500 text-sm max-w-sm mx-auto">
//                 Keep learning and completing courses — achievements will appear here as you hit milestones.
//               </p>
//             </div>
//           ) : (
//             achievements.map(award => (
//               <div key={award.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <div
//                     className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
//                     style={{ background: award.badge_color ? `${award.badge_color}20` : '#fef3c720' }}
//                   >
//                     {award.icon ?? '🏆'}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-base font-bold text-gray-900">{award.title}</h3>
//                     <p className="text-sm text-gray-500 mt-0.5">{award.description}</p>
//                     {award.awarded_at && <p className="text-xs text-gray-400 mt-1">{formatDate(award.awarded_at)}</p>}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* LinkedIn CTA */}
//       {!loading && certificates.length > 0 && (
//         <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 md:p-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900">Share Your Achievements</h3>
//               <p className="text-sm text-gray-600 mt-1">Add certificates to your LinkedIn profile or download them as PDFs</p>
//             </div>
//             <button
//               onClick={() => {
//                 const cert = certificates[0]
//                 const origin = typeof window !== 'undefined' ? window.location.origin : 'https://axioquan.com'
//                 window.open(
//                   `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${origin}/verify?code=${cert.certificate_code}`)}`,
//                   '_blank', 'noopener,noreferrer'
//                 )
//               }}
//               className="flex-shrink-0 px-6 py-3 bg-[#0077b5] text-white rounded-xl font-semibold hover:bg-[#005f8f] transition-colors text-sm flex items-center gap-2"
//             >
//               💼 Share on LinkedIn
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
























'use client'
// /components/dashboard/student-certificates-page.tsx
//
// KEY DESIGN DECISION:
//   Download uses the EXACT buildCertHTML exported from certificate-generator.tsx
//   feeding it the values already stored in the DB (student_name, course_title,
//   overall_score, final_grade, issued_at, certificate_code).
//   Nothing is regenerated — the student always gets the identical certificate
//   the instructor issued.

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { buildCertHTML, type CertificateData } from '@/components/dashboard/certificate-generator'

// ─── Types ────────────────────────────────────────────────────────────────────
interface CertRecord {
  id: string
  certificate_code: string
  issued_at: string
  final_grade?: string
  overall_score?: number
  completion_percentage?: number
  course_title: string
  instructor_name: string
  student_name: string
  assessment_id?: string
  course_id: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon?: string
  awarded_at?: string
  badge_color?: string
}

// ─── Map DB record → CertificateData (shape expected by buildCertHTML) ────────
// Uses ONLY values already stored in the database — nothing fabricated.
function toCertificateData(cert: CertRecord): CertificateData {
  return {
    studentId:     cert.id,              // required by type, not rendered in HTML
    studentName:   cert.student_name,    // from certificate_data.student_name JSONB
    courseTitle:   cert.course_title,    // from certificate_data.course_title JSONB
    averageScore:  cert.overall_score ?? 0,
    assessmentId:  cert.assessment_id ?? '',
    courseId:      cert.course_id,
    completedDate: cert.issued_at,       // real issued_at stored by the instructor
  }
}

// ─── Open print window — uses shared certificate-generator HTML exactly ───────
function openCertPrintWindow(cert: CertRecord): void {
  const data = toCertificateData(cert)
  // cert.certificate_code is the EXACT code the instructor issued — never generate a new one
  const html = buildCertHTML(data, cert.certificate_code)
  const win = window.open('', '_blank', 'width=1200,height=850')
  if (!win) {
    alert('Please allow popups to download your certificate.')
    return
  }
  win.document.write(html)
  win.document.close()
  // buildCertHTML already includes a <script> that calls window.print() after fonts load
}

// ─── Share dropdown ───────────────────────────────────────────────────────────
function ShareDropdown({ cert }: { cert: CertRecord }) {
  const [open, setOpen]     = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const shareText = `I earned a certificate for completing "${cert.course_title}" on AxioQuan! 🎓`
  const origin    = typeof window !== 'undefined' ? window.location.origin : 'https://axioquan.com'
  const verifyUrl = `${origin}/verify?code=${cert.certificate_code}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl)
    } catch {
      const el = document.createElement('textarea')
      el.value = verifyUrl
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 1800)
  }

  const options = [
    { label: copied ? '✅ Copied!' : '🔗 Copy Verify Link', action: copyLink },
    {
      label: '💼 LinkedIn',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`, '_blank', 'noopener,noreferrer')
        setOpen(false)
      },
    },
    {
      label: '🐦 X (Twitter)',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(verifyUrl)}`, '_blank', 'noopener,noreferrer')
        setOpen(false)
      },
    },
    {
      label: '💬 WhatsApp',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + verifyUrl)}`, '_blank', 'noopener,noreferrer')
        setOpen(false)
      },
    },
    {
      label: '✉️ Email',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(`My AxioQuan Certificate: ${cert.course_title}`)}&body=${encodeURIComponent(`${shareText}\n\nVerify here: ${verifyUrl}`)}`
        setOpen(false)
      },
    },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1.5"
      >
        🔗 Share
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[210px]">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Share Certificate</p>
          </div>
          {options.map((opt, i) => (
            <button key={i} onClick={opt.action}
              className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentCertificatesPage() {
  const [filter, setFilter]                 = useState<'certificates' | 'awards'>('certificates')
  const [certificates, setCertificates]     = useState<CertRecord[]>([])
  const [achievements, setAchievements]     = useState<Achievement[]>([])
  const [totalCertificates, setTotal]       = useState(0)
  const [courseCompletions, setCompletions] = useState(0)
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/certificates/student')
        if (!res.ok) throw new Error('Failed to load certificates')
        const data = await res.json()
        setCertificates(data.certificates ?? [])
        setAchievements(data.achievements ?? [])
        setTotal(data.totalCertificates ?? 0)
        setCompletions(data.courseCompletions ?? 0)
      } catch (err: any) {
        setError(err.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch { return iso }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-2">Your earned certificates and achievements</p>
      </div>

      {/* Stats — 3 cards (Specializations removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Total Certificates</p>
              {loading ? <Skeleton className="h-9 w-12 mt-2" />
                : <p className="text-3xl font-bold text-blue-600 mt-1">{totalCertificates}</p>}
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">📜</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Course Completions</p>
              {loading ? <Skeleton className="h-9 w-12 mt-2" />
                : <p className="text-3xl font-bold text-green-600 mt-1">{courseCompletions}</p>}
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Achievements</p>
              {loading ? <Skeleton className="h-9 w-12 mt-2" />
                : <p className="text-3xl font-bold text-amber-500 mt-1">{achievements.length}</p>}
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-gray-200">
        <button
          onClick={() => setFilter('certificates')}
          className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
            filter === 'certificates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Course Certificates {!loading && `(${certificates.length})`}
        </button>
        <button
          onClick={() => setFilter('awards')}
          className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
            filter === 'awards' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Achievements {!loading && `(${achievements.length})`}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ── CERTIFICATES TAB ─────────────────────────────────────────────────── */}
      {filter === 'certificates' && (
        <div className="space-y-4 md:space-y-5">
          {loading ? (
            [1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="w-20 h-16 rounded-xl flex-shrink-0" />
                </div>
                <Skeleton className="h-4 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-36 rounded-lg" /><Skeleton className="h-10 w-28 rounded-lg" /><Skeleton className="h-10 w-24 rounded-lg" />
                </div>
              </div>
            ))
          ) : certificates.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No certificates yet</h3>
              <p className="text-gray-500 text-sm">Complete a course and pass the assessment to earn your first certificate.</p>
            </div>
          ) : (
            certificates.map(cert => (
              <div key={cert.id} className="bg-white rounded-xl border border-gray-200 overflow-visible hover:shadow-md transition-shadow p-5 md:p-6">
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl shadow-md">🎖</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 truncate mb-1">{cert.course_title}</h3>
                    <p className="text-xs text-gray-500">Instructor: <span className="font-medium text-gray-700">{cert.instructor_name}</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">Issued: <span className="font-medium text-gray-700">{formatDate(cert.issued_at)}</span></p>
                  </div>
                  <div className="flex-shrink-0 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-center">
                    <p className="text-xs text-gray-500 font-medium">Score</p>
                    <p className="text-2xl font-bold text-green-600 leading-none mt-1">{cert.overall_score ?? 0}%</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold truncate max-w-[220px]">
                    {cert.course_title}
                  </span>
                  {cert.final_grade && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      Grade: {cert.final_grade}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-mono">{cert.certificate_code}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {/* Download — renders the exact same cert the instructor issued */}
                  <button
                    onClick={() => openCertPrintWindow(cert)}
                    className="cursor-pointer flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    📥 Download PDF
                  </button>

                  <ShareDropdown cert={cert} />

                  {/* Verify — coming soon */}
                  <div className="relative group flex-1 sm:flex-none">
                    
                    {/* <button disabled className="w-full px-4 py-2.5 border border-gray-200 text-gray-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed bg-gray-50">
                      🔍 Verify
                    </button> */}

                    <Link
                      href="/verify"
                      className="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                    >
                      🔍 Verify
                    </Link>
                    
                    {/* <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      Coming soon
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                    </div> */}
                  </div>
                </div>
                
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ─────────────────────────────────────────────────── */}
      {filter === 'awards' && (
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-4 w-3/4" /></div>
              </div>
            ))
          ) : achievements.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No achievements yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Keep learning and completing courses — achievements will appear here as you hit milestones.
              </p>
            </div>
          ) : (
            achievements.map(award => (
              <div key={award.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: award.badge_color ? `${award.badge_color}20` : '#fef3c720' }}
                  >
                    {award.icon ?? '🏆'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">{award.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{award.description}</p>
                    {award.awarded_at && <p className="text-xs text-gray-400 mt-1">{formatDate(award.awarded_at)}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* LinkedIn CTA */}
      {!loading && certificates.length > 0 && (
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Share Your Achievements</h3>
              <p className="text-sm text-gray-600 mt-1">Add certificates to your LinkedIn profile or download them as PDFs</p>
            </div>
            <button
              onClick={() => {
                const cert = certificates[0]
                const origin = typeof window !== 'undefined' ? window.location.origin : 'https://axioquan.com'
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${origin}/verify?code=${cert.certificate_code}`)}`,
                  '_blank', 'noopener,noreferrer'
                )
              }}
              className="cursor-pointer flex-shrink-0 px-6 py-3 bg-[#0077b5] text-white rounded-xl font-semibold hover:bg-[#005f8f] transition-colors text-sm flex items-center gap-2"
            >
              💼 Share on LinkedIn
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
