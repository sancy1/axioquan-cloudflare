// // /components/dashboard/instructor-certificates-page.tsx

// 'use client'

// import { useState } from "react"

// const certificatesData = [
//   {
//     id: 1,
//     studentName: "John Doe",
//     courseTitle: "Introduction to Python Programming",
//     issueDate: "March 15, 2024",
//     score: 95,
//     certificateId: "#AQ-2024-PY-001334",
//     status: "issued",
//   },
//   {
//     id: 2,
//     studentName: "Jane Smith",
//     courseTitle: "JavaScript Basics",
//     issueDate: "March 1, 2024",
//     score: 80,
//     certificateId: "#AQ-2024-JS-001223",
//     status: "issued",
//   },
//   {
//     id: 3,
//     studentName: "Mike Johnson",
//     courseTitle: "HTML & CSS Fundamentals",
//     issueDate: "February 20, 2024",
//     score: 98,
//     certificateId: "#AQ-2024-WEB-001089",
//     status: "issued",
//   },
//   {
//     id: 4,
//     studentName: "Sarah Wilson",
//     courseTitle: "Advanced React Patterns",
//     issueDate: "Pending",
//     score: 92,
//     certificateId: "Pending",
//     status: "pending",
//   },
// ]

// const courseStats = [
//   {
//     courseTitle: "Introduction to Python Programming",
//     totalCertificates: 45,
//     averageScore: 87,
//     completionRate: "92%",
//   },
//   {
//     courseTitle: "JavaScript Basics",
//     totalCertificates: 32,
//     averageScore: 83,
//     completionRate: "88%",
//   },
//   {
//     courseTitle: "HTML & CSS Fundamentals",
//     totalCertificates: 67,
//     averageScore: 91,
//     completionRate: "95%",
//   },
// ]

// export default function InstructorCertificatesPage() {
//   const [filter, setFilter] = useState("all")
//   const [selectedCourse, setSelectedCourse] = useState("all")

//   const filteredCertificates = certificatesData.filter(cert => {
//     if (filter === "pending") return cert.status === "pending"
//     if (filter === "issued") return cert.status === "issued"
//     return true
//   })

//   const totalCertificates = certificatesData.length
//   const pendingCertificates = certificatesData.filter(c => c.status === "pending").length
//   const issuedCertificates = certificatesData.filter(c => c.status === "issued").length

//   return (
//     <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Certificate Management</h1>
//         <p className="text-gray-600 mt-2">Manage and track certificates issued for your courses</p>
//       </div>

//       {/* Stats cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Total Issued</p>
//               <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{totalCertificates}</p>
//             </div>
//             <div className="text-3xl md:text-4xl">📜</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Pending Review</p>
//               <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-2">{pendingCertificates}</p>
//             </div>
//             <div className="text-3xl md:text-4xl">⏳</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Successfully Issued</p>
//               <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">{issuedCertificates}</p>
//             </div>
//             <div className="text-3xl md:text-4xl">✅</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-600">Completion Rate</p>
//               <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-2">92%</p>
//             </div>
//             <div className="text-3xl md:text-4xl">📈</div>
//           </div>
//         </div>
//       </div>

//       {/* Course Performance */}
//       <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
//         <h2 className="text-xl font-bold text-gray-900 mb-6">Course Performance</h2>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {courseStats.map((course, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-900 mb-3">{course.courseTitle}</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Certificates Issued:</span>
//                   <span className="font-medium">{course.totalCertificates}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Average Score:</span>
//                   <span className="font-medium text-green-600">{course.averageScore}%</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Completion Rate:</span>
//                   <span className="font-medium text-blue-600">{course.completionRate}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Filter tabs */}
//       <div className="flex flex-wrap gap-2 md:gap-3 mb-6 border-b border-gray-200">
//         <button
//           onClick={() => setFilter("all")}
//           className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
//             filter === "all"
//               ? "border-blue-600 text-blue-600"
//               : "border-transparent text-gray-600 hover:text-gray-900"
//           }`}
//         >
//           All Certificates ({totalCertificates})
//         </button>

//         <button
//           onClick={() => setFilter("issued")}
//           className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
//             filter === "issued"
//               ? "border-blue-600 text-blue-600"
//               : "border-transparent text-gray-600 hover:text-gray-900"
//           }`}
//         >
//           Issued ({issuedCertificates})
//         </button>

//         <button
//           onClick={() => setFilter("pending")}
//           className={`px-4 py-3 font-medium text-sm md:text-base transition-all border-b-2 ${
//             filter === "pending"
//               ? "border-blue-600 text-blue-600"
//               : "border-transparent text-gray-600 hover:text-gray-900"
//           }`}
//         >
//           Pending ({pendingCertificates})
//         </button>
//       </div>

//       {/* Certificates Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Course
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Score
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Issue Date
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredCertificates.map((cert) => (
//                 <tr key={cert.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="text-sm text-gray-900">{cert.courseTitle}</div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{cert.score}%</div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{cert.issueDate}</div>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       cert.status === 'issued' 
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {cert.status === 'issued' ? 'Issued' : 'Pending'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button className="text-blue-600 hover:text-blue-900">
//                         View
//                       </button>
//                       {cert.status === 'pending' && (
//                         <button className="text-green-600 hover:text-green-900">
//                           Approve
//                         </button>
//                       )}
//                       <button className="text-gray-600 hover:text-gray-900">
//                         Download
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Empty state */}
//       {filteredCertificates.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-6xl mb-4">📭</div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
//           <p className="text-gray-600">There are no certificates matching your current filters.</p>
//         </div>
//       )}

//       {/* Quick Actions */}
//       <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900">Certificate Tools</h3>
//             <p className="text-sm text-gray-600 mt-2">
//               Manage certificate templates and settings for your courses
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
//               Manage Templates
//             </button>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
//               Generate Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


























// // /src/components/dashboard/instructor-certificates-page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Award, Download, Trash2, Search, Filter, RefreshCw, Loader2 } from 'lucide-react';

// interface Certificate {
//   id: string;
//   user_id: string;
//   course_id: string;
//   certificate_code: string;
//   issued_at: string;
//   final_grade?: string;
//   overall_score?: number;
//   is_revoked: boolean;
//   certificate_data?: {
//     student_name: string;
//     course_title: string;
//     assessment_id: string;
//   };
// }

// interface CertStats {
//   total_issued: number;
//   unique_students: number;
//   courses_with_certs: number;
//   avg_score: number;
// }

// function getGrade(score: number) {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function getGradeBadgeClass(score: number) {
//   if (score >= 90) return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
//   if (score >= 80) return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
//   if (score >= 70) return 'bg-green-100 text-green-800 hover:bg-green-100';
//   return 'bg-red-100 text-red-800 hover:bg-red-100';
// }

// function buildCertHTML(cert: Certificate): string {
//   const studentName = cert.certificate_data?.student_name ?? 'Student';
//   const courseTitle  = cert.certificate_data?.course_title  ?? 'Course';
//   const score        = cert.overall_score ?? 0;
//   const grade        = cert.final_grade   ?? getGrade(score);
//   const formattedDate = new Date(cert.issued_at).toLocaleDateString('en-US', {
//     year: 'numeric', month: 'long', day: 'numeric',
//   });
//   const gradeColor = score >= 90 ? '#d4af37' : score >= 80 ? '#7ec8c8' : score >= 70 ? '#a8d5a2' : '#e07070';

//   return `<!DOCTYPE html>
// <html><head><meta charset="UTF-8"><title>Certificate – ${studentName}</title>
// <style>
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Dancing+Script:wght@600&display=swap');
// @page{size:A4 portrait;margin:0}
// *{margin:0;padding:0;box-sizing:border-box}
// html,body{width:794px;height:1123px}
// .cert{width:794px;height:1123px;background:#0a0e1a;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;font-family:'Cormorant Garamond',serif;color:#e8dcc8}
// .tl,.bl{position:absolute;left:0;right:0;height:5px;background:linear-gradient(90deg,transparent,#d4af37,#f0d060,#d4af37,transparent)}
// .tl{top:0}.bl{bottom:0}
// .ib{position:absolute;top:14px;left:14px;right:14px;bottom:14px;border:1px solid rgba(212,175,55,0.28)}
// .ring{position:absolute;border-radius:50%;border:1px solid rgba(212,175,55,0.1)}
// .r1{width:880px;height:880px;top:-220px;left:-160px}
// .r2{width:680px;height:680px;top:-110px;left:-40px}
// .r3{width:580px;height:580px;bottom:-220px;right:-220px}
// .wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-family:'Playfair Display',serif;font-size:130px;font-weight:700;color:rgba(212,175,55,0.035);white-space:nowrap}
// .corner{position:absolute;width:72px;height:72px}
// .c-tl{top:22px;left:22px}.c-tr{top:22px;right:22px;transform:scaleX(-1)}.c-bl{bottom:22px;left:22px;transform:scaleY(-1)}.c-br{bottom:22px;right:22px;transform:scale(-1,-1)}
// .lw{margin-top:56px;display:flex;flex-direction:column;align-items:center;z-index:1}
// .lc{width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#d4af37,#f0d060);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;font-size:21px;color:#0a0e1a;box-shadow:0 0 28px rgba(212,175,55,0.3);margin-bottom:9px}
// .bn{font-family:'Playfair Display',serif;font-size:17px;letter-spacing:.3em;color:#d4af37;text-transform:uppercase}
// .bs{font-size:10px;letter-spacing:.25em;color:rgba(212,175,55,0.55);text-transform:uppercase;margin-top:3px}
// .dl{width:190px;height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:22px auto;z-index:1}
// .dd{display:flex;align-items:center;gap:8px;margin:14px auto;z-index:1;width:280px}
// .dd .l{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.5))}
// .dd .d{width:6px;height:6px;background:#d4af37;transform:rotate(45deg);flex-shrink:0}
// .cl{font-size:12px;letter-spacing:.35em;color:rgba(212,175,55,0.65);text-transform:uppercase;z-index:1}
// .ct{font-style:italic;font-size:17px;color:rgba(232,220,200,0.65);margin-top:11px;z-index:1}
// .name{font-family:'Dancing Script',cursive;font-size:56px;color:#fff;letter-spacing:.02em;margin-top:5px;text-shadow:0 0 40px rgba(212,175,55,0.18);z-index:1;line-height:1.1;text-align:center;padding:0 40px}
// .comp{font-style:italic;font-size:15px;color:rgba(232,220,200,0.6);margin-top:12px;z-index:1}
// .course{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#d4af37;text-align:center;padding:0 60px;line-height:1.35;z-index:1;margin-top:7px}
// .stats{display:flex;margin-top:34px;z-index:1;border:1px solid rgba(212,175,55,0.22)}
// .stat{padding:13px 30px;text-align:center;border-right:1px solid rgba(212,175,55,0.22)}
// .stat:last-child{border-right:none}
// .sl{font-size:8px;letter-spacing:.22em;text-transform:uppercase;color:rgba(212,175,55,0.48);margin-bottom:5px}
// .sv{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#e8dcc8}
// .desc{font-size:11.5px;color:rgba(232,220,200,0.42);text-align:center;max-width:450px;line-height:1.85;font-style:italic;margin-top:26px;z-index:1}
// .sigs{display:flex;gap:76px;margin-top:34px;z-index:1}
// .sig{text-align:center}
// .sn{font-family:'Dancing Script',cursive;font-size:21px;color:#e8dcc8;line-height:1}
// .sline{width:136px;height:1px;background:rgba(212,175,55,0.38);margin:6px auto}
// .sr{font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,55,0.45)}
// .cid{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);font-size:8.5px;letter-spacing:.24em;text-transform:uppercase;color:rgba(212,175,55,0.32);white-space:nowrap;z-index:1}
// </style></head>
// <body><div class="cert">
// <div class="tl"></div><div class="bl"></div><div class="ib"></div>
// <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
// <div class="wm">AQ</div>
// <div class="corner c-tl"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
// <div class="corner c-tr"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
// <div class="corner c-bl"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
// <div class="corner c-br"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
// <div class="lw"><div class="lc">AQ</div><div class="bn">AxioQuan</div><div class="bs">Learning Excellence</div></div>
// <div class="dl"></div>
// <div class="cl">Certificate of Completion</div>
// <div class="ct">This certifies that</div>
// <div class="name">${studentName}</div>
// <div class="comp">has successfully completed the course</div>
// <div class="course">${courseTitle}</div>
// <div class="dd"><div class="l"></div><div class="d"></div><div class="l" style="background:linear-gradient(90deg,rgba(212,175,55,0.5),transparent)"></div></div>
// <div class="stats">
//   <div class="stat"><div class="sl">Date Completed</div><div class="sv" style="font-size:12px">${formattedDate}</div></div>
//   <div class="stat"><div class="sl">Avg. Score</div><div class="sv">${score}%</div></div>
//   <div class="stat"><div class="sl">Grade</div><div class="sv" style="font-size:13px;color:${gradeColor}">${grade}</div></div>
// </div>
// <div class="desc">This certificate is awarded in recognition of demonstrated proficiency and commitment to mastering the subject matter through rigorous assessment and evaluation.</div>
// <div class="sigs">
//   <div class="sig"><div class="sn">Dr. James Owusu</div><div class="sline"></div><div class="sr">Chief Academic Officer</div></div>
//   <div class="sig"><div class="sn">Dr. Nadia Voss</div><div class="sline"></div><div class="sr">Course Director</div></div>
// </div>
// <div class="cid">Certificate ID: ${cert.certificate_code}</div>
// </div></body></html>`;
// }

// export default function InstructorCertificatesPage() {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [stats, setStats] = useState<CertStats>({ total_issued: 0, unique_students: 0, courses_with_certs: 0, avg_score: 0 });
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterGrade, setFilterGrade] = useState('all');

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/certificates');
//       const data = await res.json();
//       if (data.success) {
//         setCertificates(data.certificates || []);
//         setStats(data.stats || { total_issued: 0, unique_students: 0, courses_with_certs: 0, avg_score: 0 });
//       } else {
//         toast.error('Failed to load certificates');
//       }
//     } catch {
//       toast.error('Network error loading certificates');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const handleRevoke = async (id: string, name: string) => {
//     if (!confirm(`Revoke certificate for ${name}? The student will lose access.`)) return;
//     setDeletingId(id);
//     try {
//       const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
//       const data = await res.json();
//       if (res.ok) {
//         setCertificates(prev => prev.filter(c => c.id !== id));
//         setStats(prev => ({ ...prev, total_issued: Math.max(0, prev.total_issued - 1) }));
//         toast.success('Certificate revoked');
//       } else {
//         toast.error(data.error || 'Failed to revoke');
//       }
//     } catch { toast.error('Network error'); }
//     finally { setDeletingId(null); }
//   };

//   const handleDownload = (cert: Certificate) => {
//     const w = window.open('', '_blank');
//     if (w) {
//       w.document.write(buildCertHTML(cert));
//       w.document.close();
//       w.focus();
//       setTimeout(() => w.print(), 1400);
//     }
//   };

//   const filtered = certificates.filter(c => {
//     const name   = c.certificate_data?.student_name ?? '';
//     const course = c.certificate_data?.course_title  ?? '';
//     const s = searchTerm.toLowerCase();
//     const matchSearch = !searchTerm ||
//       name.toLowerCase().includes(s) ||
//       course.toLowerCase().includes(s) ||
//       c.certificate_code.toLowerCase().includes(s);
//     const grade = c.final_grade ?? getGrade(c.overall_score ?? 0);
//     const matchGrade = filterGrade === 'all' || grade === filterGrade;
//     return matchSearch && matchGrade;
//   });

//   const resetFilters = () => { setSearchTerm(''); setFilterGrade('all'); };

//   if (loading) {
//     return (
//       <div className="p-8 max-w-7xl mx-auto">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/3" />
//           <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-lg" />)}</div>
//           <div className="h-96 bg-gray-200 rounded-lg" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Certificate Management</h1>
//           <p className="text-gray-500 mt-1">Manage certificates issued across your courses</p>
//         </div>
//         <Button variant="outline" onClick={fetchData} className="cursor-pointer gap-2">
//           <RefreshCw className="h-4 w-4" /> Refresh
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {[
//           { label: 'Total Issued',     value: stats.total_issued,       icon: '📜', color: 'text-blue-600'   },
//           { label: 'Unique Students',  value: stats.unique_students,    icon: '👨‍🎓', color: 'text-purple-600' },
//           { label: 'Courses Covered',  value: stats.courses_with_certs, icon: '📚', color: 'text-green-600'  },
//           { label: 'Avg. Score',       value: stats.avg_score ? `${stats.avg_score}%` : 'N/A', icon: '📈', color: 'text-amber-600' },
//         ].map((s, i) => (
//           <Card key={i}>
//             <CardContent className="p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">{s.label}</p>
//                   <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
//                 </div>
//                 <span className="text-3xl">{s.icon}</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Search & Filter */}
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search by student, course, or certificate ID..."
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <select
//               value={filterGrade}
//               onChange={e => setFilterGrade(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer"
//             >
//               <option value="all">All Grades</option>
//               <option value="DISTINCTION">Distinction (90%+)</option>
//               <option value="MERIT">Merit (80–89%)</option>
//               <option value="PASS">Pass (70–79%)</option>
//             </select>
//             <Button variant="outline" onClick={resetFilters} className="cursor-pointer gap-2 text-sm">
//               <Filter className="h-4 w-4" /> Reset
//             </Button>
//           </div>
//           {(searchTerm || filterGrade !== 'all') && (
//             <p className="text-xs text-blue-600 mt-2">
//               Showing {filtered.length} of {certificates.length} certificates
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between flex-wrap gap-2">
//             <span>Issued Certificates</span>
//             <Badge variant="secondary">{filtered.length}</Badge>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {filtered.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">🏅</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 {certificates.length === 0 ? 'No Certificates Issued Yet' : 'No Results Found'}
//               </h3>
//               <p className="text-gray-500 text-sm">
//                 {certificates.length === 0
//                   ? 'Issue certificates from the Students Quiz page when students pass their assessments.'
//                   : 'Try adjusting your search or filter criteria.'}
//               </p>
//               {certificates.length > 0 && (
//                 <Button variant="outline" onClick={resetFilters} className="mt-4 cursor-pointer">Clear Filters</Button>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b bg-gray-50">
//                     {['Student','Course','Score','Grade','Issue Date','Certificate ID','Actions'].map(h => (
//                       <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 whitespace-nowrap">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map(cert => {
//                     const studentName = cert.certificate_data?.student_name ?? '—';
//                     const courseTitle  = cert.certificate_data?.course_title  ?? '—';
//                     const score        = cert.overall_score ?? 0;
//                     const grade        = cert.final_grade   ?? getGrade(score);
//                     return (
//                       <tr key={cert.id} className="border-b hover:bg-gray-50 transition-colors">
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
//                               {studentName.charAt(0).toUpperCase()}
//                             </div>
//                             <span className="font-medium text-gray-900">{studentName}</span>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4 max-w-[180px]">
//                           <span className="text-gray-700 truncate block">{courseTitle}</span>
//                         </td>
//                         <td className="py-3 px-4">
//                           <span className="font-semibold">{score}%</span>
//                         </td>
//                         <td className="py-3 px-4">
//                           <Badge className={`${getGradeBadgeClass(score)} text-xs font-semibold`}>
//                             {grade}
//                           </Badge>
//                         </td>
//                         <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
//                           {new Date(cert.issued_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
//                         </td>
//                         <td className="py-3 px-4">
//                           <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
//                             {cert.certificate_code}
//                           </code>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex gap-2">
//                             <Button size="sm" variant="outline" onClick={() => handleDownload(cert)}
//                               className="cursor-pointer gap-1 text-xs">
//                               <Download className="h-3 w-3" /> Download
//                             </Button>
//                             <Button size="sm" variant="ghost"
//                               onClick={() => handleRevoke(cert.id, studentName)}
//                               disabled={deletingId === cert.id}
//                               className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50">
//                               {deletingId === cert.id
//                                 ? <Loader2 className="h-3 w-3 animate-spin" />
//                                 : <Trash2 className="h-3 w-3" />}
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
































// 'use client';
// // /src/components/dashboard/instructor-certificates-page.tsx
// //
// // FIXES:
// // 1. Was reading `json.certificates` but checking `json.total` —
// //    now correctly reads { success, certificates, total, stats } from API
// // 2. Was trying to read student_name/course_title as top-level DB columns;
// //    the API now normalises these from certificate_data JSONB ✅
// // 3. Stats cards now use real data from `stats` object returned by API
// // 4. Revoke calls DELETE /api/certificates/:id which uses session.userId
// //    as instructorId — matches the revokeCertificate(id, instructorId) signature ✅

// import { useState, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Award,
//   Search,
//   X,
//   Trash2,
//   RefreshCw,
//   CheckCircle2,
//   TrendingUp,
//   Users,
//   BookOpen,
//   Filter,
// } from 'lucide-react';
// import { toast } from 'sonner';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface CertificateStats {
//   total_issued: number;
//   unique_students: number;
//   courses_with_certs: number;
//   avg_score: number;
// }

// interface NormalisedCertificate {
//   id: string;
//   user_id: string;
//   course_id: string;
//   certificate_code: string;
//   issued_at: string;
//   final_grade?: string;
//   overall_score?: number;
//   // These come from certificate_data JSONB, normalised by the API route
//   student_name: string;
//   course_title: string;
//   instructor_name?: string;
//   assessment_id?: string;
//   // From LEFT JOIN users
//   student_email?: string;
//   is_revoked?: boolean;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function InstructorCertificatesPage() {
//   const [certificates, setCertificates] = useState<NormalisedCertificate[]>([]);
//   const [stats, setStats] = useState<CertificateStats>({
//     total_issued: 0,
//     unique_students: 0,
//     courses_with_certs: 0,
//     avg_score: 0,
//   });
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [revokingId, setRevokingId] = useState<string | null>(null);

//   // ── Fetch ─────────────────────────────────────────────────────────────────
//   const fetchCertificates = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/certificates');
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const json = await res.json();

//       if (!json.success) throw new Error(json.error ?? 'Failed to load');

//       setCertificates(json.certificates ?? []);
//       setTotal(json.total ?? json.certificates?.length ?? 0);

//       // Use real stats from API if available
//       if (json.stats) {
//         setStats({
//           total_issued:       json.stats.total_issued       ?? json.total ?? 0,
//           unique_students:    json.stats.unique_students    ?? 0,
//           courses_with_certs: json.stats.courses_with_certs ?? 0,
//           avg_score:          json.stats.avg_score          ?? 0,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to load certificates');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCertificates();
//   }, [fetchCertificates]);

//   // ── Filter ────────────────────────────────────────────────────────────────
//   const filtered = certificates.filter((c) => {
//     if (!search) return true;
//     const q = search.toLowerCase();
//     return (
//       c.student_name.toLowerCase().includes(q) ||
//       c.course_title.toLowerCase().includes(q) ||
//       (c.student_email ?? '').toLowerCase().includes(q) ||
//       c.certificate_code.toLowerCase().includes(q)
//     );
//   });

//   // ── Revoke ────────────────────────────────────────────────────────────────
//   const handleRevoke = async (cert: NormalisedCertificate) => {
//     if (
//       !confirm(
//         `Revoke the certificate issued to ${cert.student_name}?\nThis will remove it from their account.`
//       )
//     ) return;

//     setRevokingId(cert.id);
//     try {
//       const res = await fetch(`/api/certificates/${cert.id}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.error ?? 'Failed to revoke');

//       toast.success(`Certificate for ${cert.student_name} has been revoked.`);
//       setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
//       setTotal((prev) => Math.max(0, prev - 1));
//       setStats((prev) => ({
//         ...prev,
//         total_issued: Math.max(0, prev.total_issued - 1),
//       }));
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Failed to revoke certificate');
//     } finally {
//       setRevokingId(null);
//     }
//   };

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
//         <span className="ml-3 text-gray-600">Loading certificates...</span>
//       </div>
//     );
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 p-6 max-w-7xl mx-auto">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Certificate Management</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             View and manage all issued certificates
//           </p>
//         </div>
//         <Button
//           onClick={fetchCertificates}
//           variant="outline"
//           size="sm"
//           className="cursor-pointer"
//         >
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>

//       {/* Stats — all from real API data */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           {
//             label: 'Total Issued',
//             value: stats.total_issued,
//             icon: <Award className="w-5 h-5 text-blue-600" />,
//             bg: 'bg-blue-100',
//           },
//           {
//             label: 'Unique Students',
//             value: stats.unique_students,
//             icon: <Users className="w-5 h-5 text-green-600" />,
//             bg: 'bg-green-100',
//           },
//           {
//             label: 'Avg Score',
//             value: `${Number(stats.avg_score ?? 0).toFixed(1)}%`,
//             icon: <TrendingUp className="w-5 h-5 text-yellow-600" />,
//             bg: 'bg-yellow-100',
//           },
//           {
//             label: 'Courses',
//             value: stats.courses_with_certs,
//             icon: <BookOpen className="w-5 h-5 text-purple-600" />,
//             bg: 'bg-purple-100',
//           },
//         ].map((s) => (
//           <Card key={s.label}>
//             <CardContent className="pt-5 pb-5">
//               <div className="flex items-center gap-3">
//                 <div className={`p-2 ${s.bg} rounded-lg flex-shrink-0`}>{s.icon}</div>
//                 <div className="min-w-0">
//                   <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
//                     {s.label}
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">{s.value}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Search + Table */}
//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex items-center gap-3">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 placeholder="Search by student, course, email, or certificate code..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9"
//               />
//               {search && (
//                 <button
//                   onClick={() => setSearch('')}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//             {search && (
//               <Button
//                 onClick={() => setSearch('')}
//                 variant="outline"
//                 size="sm"
//                 className="cursor-pointer"
//               >
//                 <X className="w-3 h-3 mr-1" />
//                 Reset
//               </Button>
//             )}
//           </div>
//           <p className="text-xs text-gray-400 mt-2">
//             Showing {filtered.length} of {total} certificates
//             {search && ' (filtered)'}
//           </p>
//         </CardHeader>

//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-t border-b border-gray-100 bg-gray-50">
//                   <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                     Student
//                   </th>
//                   <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
//                     Course
//                   </th>
//                   <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
//                     Score
//                   </th>
//                   <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
//                     Grade
//                   </th>
//                   <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
//                     Cert Code
//                   </th>
//                   <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
//                     Issued
//                   </th>
//                   <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-16 text-gray-400">
//                       {search ? (
//                         <>
//                           <Filter className="w-8 h-8 mx-auto mb-3 opacity-30" />
//                           No certificates match your search.
//                         </>
//                       ) : (
//                         <>
//                           <Award className="w-8 h-8 mx-auto mb-3 opacity-30" />
//                           No certificates issued yet.
//                           <br />
//                           <span className="text-xs mt-1 block">
//                             Go to Student Quiz Analytics and click &quot;Issue Cert&quot; for eligible students.
//                           </span>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ) : (
//                   filtered.map((cert) => (
//                     <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-3">
//                         <p className="font-medium text-gray-900">{cert.student_name}</p>
//                         <p className="text-xs text-gray-400">{cert.student_email ?? '—'}</p>
//                       </td>
//                       <td className="px-4 py-3 hidden md:table-cell">
//                         <p className="text-gray-700 truncate max-w-[200px]">{cert.course_title}</p>
//                       </td>
//                       <td className="px-4 py-3 text-center hidden sm:table-cell">
//                         <span className="font-semibold text-gray-900">
//                           {cert.overall_score != null
//                             ? `${Number(cert.overall_score).toFixed(1)}%`
//                             : '—'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center hidden sm:table-cell">
//                         <Badge
//                           variant="outline"
//                           className="text-xs border-green-200 text-green-700 bg-green-50"
//                         >
//                           <CheckCircle2 className="w-3 h-3 mr-1" />
//                           {cert.final_grade ?? 'PASS'}
//                         </Badge>
//                       </td>
//                       <td className="px-4 py-3 hidden lg:table-cell">
//                         <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">
//                           {cert.certificate_code}
//                         </code>
//                       </td>
//                       <td className="px-4 py-3 hidden md:table-cell">
//                         <span className="text-xs text-gray-500">
//                           {new Date(cert.issued_at).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric',
//                           })}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleRevoke(cert)}
//                           disabled={revokingId === cert.id}
//                           className="cursor-pointer h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs"
//                           title="Revoke certificate"
//                         >
//                           {revokingId === cert.id ? (
//                             <RefreshCw className="w-3 h-3 animate-spin" />
//                           ) : (
//                             <Trash2 className="w-3 h-3" />
//                           )}
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





























'use client';
// /src/components/dashboard/instructor-certificates-page.tsx
//
// v5 updates:
// • Groups certificates by student+assessment so multiple issues for the
//   same quiz show as a "×2 Re-issued" badge inline, not as orphaned rows
// • Each duplicate gets its own revoke button (they're separate DB rows)
// • "Issued N times" badge shown when count > 1 with amber highlight
// • Rest of the page (stats, search, revoke) unchanged and working

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Award, Search, X, Trash2, RefreshCw,
  CheckCircle2, TrendingUp, Users, BookOpen, Filter,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CertificateStats {
  total_issued: number;
  unique_students: number;
  courses_with_certs: number;
  avg_score: number;
}

interface NormalisedCertificate {
  id: string;
  user_id: string;
  course_id: string;
  assessment_id?: string;
  certificate_code: string;
  issued_at: string;
  final_grade?: string;
  overall_score?: number;
  student_name: string;
  course_title: string;
  instructor_name?: string;
  student_email?: string;
  is_revoked?: boolean;
}

// Group key: student_id + assessment_id (or course_id if no assessment)
function groupKey(c: NormalisedCertificate) {
  return `${c.user_id}::${c.assessment_id ?? c.course_id}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InstructorCertificatesPage() {
  const [certificates, setCertificates] = useState<NormalisedCertificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    total_issued: 0, unique_students: 0, courses_with_certs: 0, avg_score: 0,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [revokingId, setRevokingId] = useState<string | null>(null);
  // Which groups are expanded to show all duplicates
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Failed to load');

      setCertificates(json.certificates ?? []);
      setTotal(json.total ?? json.certificates?.length ?? 0);
      if (json.stats) {
        setStats({
          total_issued:       json.stats.total_issued       ?? json.total ?? 0,
          unique_students:    json.stats.unique_students    ?? 0,
          courses_with_certs: json.stats.courses_with_certs ?? 0,
          avg_score:          json.stats.avg_score          ?? 0,
        });
      }
    } catch (err) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  // ── Search filter ─────────────────────────────────────────────────────────
  const filtered = certificates.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.student_name.toLowerCase().includes(q) ||
      c.course_title.toLowerCase().includes(q) ||
      (c.student_email ?? '').toLowerCase().includes(q) ||
      c.certificate_code.toLowerCase().includes(q)
    );
  });

  // ── Group by student+assessment ────────────────────────────────────────────
  // Build ordered map: group key → array of certs (newest first)
  const groupMap = new Map<string, NormalisedCertificate[]>();
  filtered.forEach(cert => {
    const key = groupKey(cert);
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(cert);
  });
  // Sort each group newest-first
  groupMap.forEach(arr => arr.sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime()));
  const groups = Array.from(groupMap.entries()); // [key, certs[]]

  // ── Revoke ────────────────────────────────────────────────────────────────
  const handleRevoke = async (cert: NormalisedCertificate) => {
    if (!confirm(`Revoke certificate for ${cert.student_name}?\nCert ID: ${cert.certificate_code}`)) return;
    setRevokingId(cert.id);
    try {
      const res = await fetch(`/api/certificates/${cert.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Failed to revoke');
      toast.success(`Certificate ${cert.certificate_code} revoked.`);
      setCertificates(prev => prev.filter(c => c.id !== cert.id));
      setTotal(prev => Math.max(0, prev - 1));
      setStats(prev => ({ ...prev, total_issued: Math.max(0, prev.total_issued - 1) }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to revoke');
    } finally {
      setRevokingId(null);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading certificates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total === 0
              ? 'No certificates issued yet'
              : `${total} certificate${total !== 1 ? 's' : ''} issued — ${groups.length} unique student/quiz combination${groups.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button onClick={fetchCertificates} variant="outline" size="sm" className="cursor-pointer">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Issued',     value: stats.total_issued,       icon: <Award className="w-5 h-5 text-blue-600" />,   bg: 'bg-blue-100' },
          { label: 'Unique Students',  value: stats.unique_students,    icon: <Users className="w-5 h-5 text-green-600" />,  bg: 'bg-green-100' },
          { label: 'Avg Score',        value: `${Number(stats.avg_score ?? 0).toFixed(1)}%`, icon: <TrendingUp className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-100' },
          { label: 'Courses',          value: stats.courses_with_certs, icon: <BookOpen className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${s.bg} rounded-lg flex-shrink-0`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by student, course, email, or certificate code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Showing {groups.length} student/quiz group{groups.length !== 1 ? 's' : ''}
            {' '}({filtered.length} certificate{filtered.length !== 1 ? 's' : ''})
            {search && ' — filtered'}
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Course</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Score</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Grade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Latest Cert Code</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Issued</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      {search ? (
                        <><Filter className="w-8 h-8 mx-auto mb-3 opacity-30" />No certificates match your search.</>
                      ) : (
                        <><Award className="w-8 h-8 mx-auto mb-3 opacity-30" />No certificates issued yet.
                          <br/><span className="text-xs mt-1 block">Go to Student Quiz Analytics and click "Issue Cert" for eligible students.</span></>
                      )}
                    </td>
                  </tr>
                ) : (
                  groups.map(([key, certs]) => {
                    const latest    = certs[0]; // newest first
                    const count     = certs.length;
                    const isExpanded = expandedGroups.has(key);
                    const hasMultiple = count > 1;

                    return (
                      <>
                        {/* ── Primary row (latest cert) ── */}
                        {/* <tr key={`${key}-primary`} */}
                        <React.Fragment key={key}>
                          < tr className={`border-t hover:bg-gray-50 transition-colors ${hasMultiple ? 'bg-amber-50/30' : ''}`}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{latest.student_name}</p>
                              <p className="text-xs text-gray-400">{latest.student_email ?? '—'}</p>
                            </div>
                            {/* Multiple-issue badge */}
                            {hasMultiple && (
                              <Badge className="mt-1 bg-amber-100 text-amber-800 hover:bg-amber-100 text-[10px] gap-1">
                                🔁 Issued ×{count}
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="text-gray-700 truncate max-w-[200px]">{latest.course_title}</p>
                          </td>
                          <td className="px-4 py-3 text-center hidden sm:table-cell">
                            <span className="font-semibold text-gray-900">
                              {latest.overall_score != null ? `${Number(latest.overall_score).toFixed(1)}%` : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                              <CheckCircle2 className="w-3 h-3 mr-1" />{latest.final_grade ?? 'PASS'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">
                              {latest.certificate_code}
                            </code>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-500">
                              {new Date(latest.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* Revoke latest */}
                              <Button size="sm" variant="outline"
                                onClick={() => handleRevoke(latest)}
                                disabled={revokingId === latest.id}
                                className="cursor-pointer h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs"
                                title="Revoke this certificate">
                                {revokingId === latest.id
                                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                                  : <Trash2 className="w-3 h-3" />}
                              </Button>
                              {/* Expand toggle if there are duplicates */}
                              {hasMultiple && (
                                <Button size="sm" variant="ghost"
                                  onClick={() => setExpandedGroups(prev => {
                                    const next = new Set(prev);
                                    next.has(key) ? next.delete(key) : next.add(key);
                                    return next;
                                  })}
                                  className="cursor-pointer h-7 px-1.5 text-gray-400 hover:text-gray-700 text-xs"
                                  title={isExpanded ? 'Collapse' : `Show all ${count} certificates`}>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        </React.Fragment>

                        {/* ── Expanded duplicate rows ── */}
                        {hasMultiple && isExpanded && certs.slice(1).map((older, i) => (
                          <tr key={`${key}-dup-${i}`}
                            className="border-t border-dashed border-amber-200 bg-amber-50/20 text-gray-500">
                            <td className="px-4 py-2 pl-8">
                              <span className="text-xs text-amber-600 font-medium">↳ Earlier issue #{i + 1}</span>
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell text-xs">{older.course_title}</td>
                            <td className="px-4 py-2 text-center hidden sm:table-cell text-xs">
                              {older.overall_score != null ? `${Number(older.overall_score).toFixed(1)}%` : '—'}
                            </td>
                            <td className="px-4 py-2 text-center hidden sm:table-cell">
                              <Badge variant="outline" className="text-[10px] border-gray-200 text-gray-500">
                                {older.final_grade ?? 'PASS'}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 hidden lg:table-cell">
                              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-500">
                                {older.certificate_code}
                              </code>
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell">
                              <span className="text-xs text-gray-400">
                                {new Date(older.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Button size="sm" variant="outline"
                                onClick={() => handleRevoke(older)}
                                disabled={revokingId === older.id}
                                className="cursor-pointer h-6 px-2 text-red-400 hover:text-red-600 hover:bg-red-50 border-red-100 text-xs"
                                title="Revoke this certificate">
                                {revokingId === older.id
                                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                                  : <Trash2 className="w-3 h-3" />}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
