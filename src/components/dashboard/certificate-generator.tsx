// // /src/components/dashboard/certificate-generator.tsx
// 'use client';

// import { useState } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: () => void;
//   alreadyIssued?: boolean;
// }

// function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function getGradeColor(score: number): string {
//   if (score >= 90) return '#d4af37';
//   if (score >= 80) return '#7ec8c8';
//   if (score >= 70) return '#a8d5a2';
//   return '#e07070';
// }

// function formatDate(dateStr: string): string {
//   return new Date(dateStr).toLocaleDateString('en-US', {
//     year: 'numeric', month: 'long', day: 'numeric',
//   });
// }

// function buildCertHTML(data: CertificateData, certCode: string): string {
//   const grade = getGrade(data.averageScore);
//   const gradeColor = getGradeColor(data.averageScore);
//   const formattedDate = formatDate(data.completedDate);

//   return `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>Certificate – ${data.studentName}</title>
//   <style>
//     @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Dancing+Script:wght@600&display=swap');
//     @page { size: A4 portrait; margin: 0; }
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     html, body { width: 794px; height: 1123px; }
//     .cert {
//       width: 794px; height: 1123px;
//       background: #0a0e1a;
//       position: relative; overflow: hidden;
//       display: flex; flex-direction: column; align-items: center;
//       font-family: 'Cormorant Garamond', serif;
//       color: #e8dcc8;
//     }
//     .top-line, .bottom-line {
//       position: absolute; left: 0; right: 0; height: 5px;
//       background: linear-gradient(90deg, transparent, #d4af37, #f0d060, #d4af37, transparent);
//     }
//     .top-line { top: 0; } .bottom-line { bottom: 0; }
//     .inner-border {
//       position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px;
//       border: 1px solid rgba(212,175,55,0.28); pointer-events: none;
//     }
//     /* Decorative rings */
//     .ring { position: absolute; border-radius: 50%; border: 1px solid rgba(212,175,55,0.1); }
//     .r1 { width: 880px; height: 880px; top: -220px; left: -160px; }
//     .r2 { width: 680px; height: 680px; top: -110px; left: -40px; }
//     .r3 { width: 580px; height: 580px; bottom: -220px; right: -220px; }
//     /* Watermark */
//     .wm {
//       position: absolute; top: 50%; left: 50%;
//       transform: translate(-50%,-50%) rotate(-30deg);
//       font-family: 'Playfair Display', serif;
//       font-size: 130px; font-weight: 700;
//       color: rgba(212,175,55,0.035); white-space: nowrap; pointer-events: none;
//     }
//     /* Corner ornaments */
//     .corner { position: absolute; width: 72px; height: 72px; }
//     .c-tl { top: 22px; left: 22px; }
//     .c-tr { top: 22px; right: 22px; transform: scaleX(-1); }
//     .c-bl { bottom: 22px; left: 22px; transform: scaleY(-1); }
//     .c-br { bottom: 22px; right: 22px; transform: scale(-1,-1); }
//     /* Logo */
//     .logo-wrap { margin-top: 56px; display:flex; flex-direction:column; align-items:center; z-index:1; }
//     .logo-circle {
//       width: 62px; height: 62px; border-radius: 50%;
//       background: linear-gradient(135deg,#d4af37,#f0d060);
//       display:flex; align-items:center; justify-content:center;
//       font-family:'Playfair Display',serif; font-weight:700; font-size:21px; color:#0a0e1a;
//       box-shadow: 0 0 28px rgba(212,175,55,0.3);
//       margin-bottom: 9px;
//     }
//     .brand { font-family:'Playfair Display',serif; font-size:17px; letter-spacing:.3em; color:#d4af37; text-transform:uppercase; }
//     .brand-sub { font-size:10px; letter-spacing:.25em; color:rgba(212,175,55,0.55); text-transform:uppercase; margin-top:3px; }
//     /* Dividers */
//     .div-line { width:190px; height:1px; background:linear-gradient(90deg,transparent,#d4af37,transparent); margin:22px auto; z-index:1; }
//     .div-diamond { display:flex; align-items:center; gap:8px; margin:14px auto; z-index:1; width:280px; }
//     .div-diamond .dl { flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(212,175,55,0.5)); }
//     .div-diamond .dd { width:6px; height:6px; background:#d4af37; transform:rotate(45deg); flex-shrink:0; }
//     /* Text */
//     .cert-label { font-size:12px; letter-spacing:.35em; color:rgba(212,175,55,0.65); text-transform:uppercase; z-index:1; }
//     .certifies { font-style:italic; font-size:17px; color:rgba(232,220,200,0.65); margin-top:11px; z-index:1; }
//     .name {
//       font-family:'Dancing Script',cursive; font-size:56px; color:#fff;
//       letter-spacing:.02em; margin-top:5px;
//       text-shadow:0 0 40px rgba(212,175,55,0.18);
//       z-index:1; line-height:1.1; text-align:center; padding:0 40px;
//     }
//     .completed { font-style:italic; font-size:15px; color:rgba(232,220,200,0.6); margin-top:12px; z-index:1; }
//     .course {
//       font-family:'Playfair Display',serif; font-size:24px; font-weight:700;
//       color:#d4af37; text-align:center; padding:0 60px;
//       line-height:1.35; z-index:1; margin-top:7px;
//     }
//     /* Stats row */
//     .stats { display:flex; margin-top:34px; z-index:1; border:1px solid rgba(212,175,55,0.22); }
//     .stat { padding:13px 30px; text-align:center; border-right:1px solid rgba(212,175,55,0.22); }
//     .stat:last-child { border-right:none; }
//     .sl { font-size:8px; letter-spacing:.22em; text-transform:uppercase; color:rgba(212,175,55,0.48); margin-bottom:5px; }
//     .sv { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:#e8dcc8; }
//     /* Description */
//     .desc {
//       font-size:11.5px; color:rgba(232,220,200,0.42); text-align:center;
//       max-width:450px; line-height:1.85; font-style:italic;
//       margin-top:26px; z-index:1;
//     }
//     /* Signatures */
//     .sigs { display:flex; gap:76px; margin-top:34px; z-index:1; }
//     .sig { text-align:center; }
//     .sig-name { font-family:'Dancing Script',cursive; font-size:21px; color:#e8dcc8; line-height:1; }
//     .sig-line { width:136px; height:1px; background:rgba(212,175,55,0.38); margin:6px auto; }
//     .sig-role { font-size:8px; letter-spacing:.2em; text-transform:uppercase; color:rgba(212,175,55,0.45); }
//     /* Cert ID */
//     .cert-id {
//       position:absolute; bottom:28px; left:50%; transform:translateX(-50%);
//       font-size:8.5px; letter-spacing:.24em; text-transform:uppercase;
//       color:rgba(212,175,55,0.32); white-space:nowrap; z-index:1;
//     }
//   </style>
// </head>
// <body>
// <div class="cert">
//   <div class="top-line"></div>
//   <div class="bottom-line"></div>
//   <div class="inner-border"></div>
//   <div class="ring r1"></div>
//   <div class="ring r2"></div>
//   <div class="ring r3"></div>
//   <div class="wm">AQ</div>

//   <!-- Corners -->
//   <div class="corner c-tl"><svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><path d="M4 4L16 4M4 4L4 16" stroke="#d4af37" stroke-width=".5" opacity=".35"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
//   <div class="corner c-tr"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
//   <div class="corner c-bl"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>
//   <div class="corner c-br"><svg viewBox="0 0 72 72" fill="none"><path d="M4 4L28 4M4 4L4 28" stroke="#d4af37" stroke-width="1.5" opacity=".6"/><circle cx="4" cy="4" r="2" fill="#d4af37" opacity=".7"/></svg></div>

//   <!-- Logo -->
//   <div class="logo-wrap">
//     <div class="logo-circle">AQ</div>
//     <div class="brand">AxioQuan</div>
//     <div class="brand-sub">Learning Excellence</div>
//   </div>

//   <div class="div-line"></div>

//   <div class="cert-label">Certificate of Completion</div>
//   <div class="certifies">This certifies that</div>
//   <div class="name">${data.studentName}</div>
//   <div class="completed">has successfully completed the course</div>
//   <div class="course">${data.courseTitle}</div>

//   <div class="div-diamond">
//     <div class="dl"></div><div class="dd"></div>
//     <div class="dl" style="background:linear-gradient(90deg,rgba(212,175,55,0.5),transparent)"></div>
//   </div>

//   <div class="stats">
//     <div class="stat">
//       <div class="sl">Date Completed</div>
//       <div class="sv" style="font-size:12px">${formattedDate}</div>
//     </div>
//     <div class="stat">
//       <div class="sl">Avg. Score</div>
//       <div class="sv">${data.averageScore}%</div>
//     </div>
//     <div class="stat">
//       <div class="sl">Grade</div>
//       <div class="sv" style="font-size:13px;color:${gradeColor}">${grade}</div>
//     </div>
//   </div>

//   <div class="desc">
//     This certificate is awarded in recognition of demonstrated proficiency and commitment
//     to mastering the subject matter through rigorous assessment and evaluation.
//   </div>

//   <div class="sigs">
//     <div class="sig">
//       <div class="sig-name">Dr. James Owusu</div>
//       <div class="sig-line"></div>
//       <div class="sig-role">Chief Academic Officer</div>
//     </div>
//     <div class="sig">
//       <div class="sig-name">Dr. Nadia Voss</div>
//       <div class="sig-line"></div>
//       <div class="sig-role">Course Director</div>
//     </div>
//   </div>

//   <div class="cert-id">Certificate ID: ${certCode}</div>
// </div>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string) {
//   const w = window.open('', '_blank');
//   if (w) {
//     w.document.write(html);
//     w.document.close();
//     w.focus();
//     setTimeout(() => w.print(), 1400);
//   }
// }

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issuing, setIssuing] = useState(false);
//   const [issued, setIssued] = useState(alreadyIssued ?? false);
//   const [certCode, setCertCode] = useState<string | null>(null);

//   const handleIssue = async () => {
//     if (data.averageScore < 70) {
//       toast.error('Student has not met the minimum passing score of 70%');
//       return;
//     }
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id: data.studentId,
//           course_id: data.courseId,
//           assessment_id: data.assessmentId,
//           student_name: data.studentName,
//           course_title: data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade: getGrade(data.averageScore),
//         }),
//       });

//       const result = await res.json();
//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now()}`;
//       setCertCode(code);
//       setIssued(true);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(`Certificate issued for ${data.studentName}!`);
//       onIssued?.();
//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = certCode ?? `AXQ-${Date.now()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   if (data.averageScore < 70) {
//     return (
//       <Button size="sm" variant="outline" disabled className="opacity-40 cursor-not-allowed text-xs">
//         <Award className="h-3 w-3 mr-1" /> Not Eligible
//       </Button>
//     );
//   }

//   if (issued) {
//     return (
//       <Button size="sm" variant="outline" onClick={handleRedownload}
//         className="cursor-pointer border-amber-300 text-amber-700 hover:bg-amber-50 text-xs gap-1">
//         <Download className="h-3 w-3" /> Re-download
//       </Button>
//     );
//   }

//   return (
//     <Button size="sm" onClick={handleIssue} disabled={issuing}
//       className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1">
//       {issuing
//         ? <><Loader2 className="h-3 w-3 animate-spin" /> Issuing...</>
//         : <><Award className="h-3 w-3" /> Issue Cert</>
//       }
//     </Button>
//   );
// }




























// 'use client';
// // /src/components/dashboard/certificate-generator.tsx
// //
// // Certificate design matches the uploaded AxioQuan reference:
// // - Blue/silver gradient background with gold oval frame
// // - AxioQuan logo top-center
// // - "CERTIFICATE of COMPLETION" bold header
// // - "THIS IS PROUDLY PRESENTED TO" subtitle
// // - Student name in large Dancing Script (signature-style)
// // - Course title in a dark-blue pill/badge
// // - Three-column stats: Date Taken | Average Score | Grade
// // - Gold CERTIFIED seal (bottom-right)
// // - Alexander Cyril signature in Pacifico font (styled script)
// // - Certificate ID bottom-center
// // - "Empowering Your Automation Journey" tagline
// // - ALL data is fully dynamic from props — nothing hardcoded except branding

// import { useState } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: () => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   } catch {
//     return dateStr;
//   }
// }

// // ─── Certificate HTML Builder ─────────────────────────────────────────────────

// function buildCertHTML(data: CertificateData, certCode: string): string {
//   const grade     = getGrade(data.averageScore);
//   const passed    = isPassed(data.averageScore);
//   const dateTaken = formatDate(data.completedDate);
//   const courseUpper = data.courseTitle.toUpperCase();

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
//   <title>Certificate – ${data.studentName}</title>
//   <link rel="preconnect" href="https://fonts.googleapis.com"/>
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
//   <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@700&family=Cinzel:wght@700;900&family=Open+Sans:wght@400;600;700&family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet"/>
//   <style>
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//     @page { size: A4 landscape; margin: 0; }

//     html, body {
//       width: 297mm;
//       height: 210mm;
//       overflow: hidden;
//       background: #1a4b8c;
//     }

//     body {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-family: 'Open Sans', sans-serif;
//       -webkit-print-color-adjust: exact;
//       print-color-adjust: exact;
//     }

//     /* ── Outer page background ── */
//     .page {
//       width: 297mm;
//       height: 210mm;
//       position: relative;
//       background: linear-gradient(135deg, #1a3f7a 0%, #1e5098 30%, #2060b0 50%, #1e5098 70%, #1a3f7a 100%);
//       overflow: hidden;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }

//     /* Circuit pattern overlay */
//     .page::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background-image:
//         radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 1px, transparent 1px),
//         radial-gradient(circle at 90% 80%, rgba(255,255,255,0.03) 1px, transparent 1px),
//         linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
//       background-size: 40px 40px, 40px 40px, 20px 20px, 20px 20px;
//       pointer-events: none;
//     }

//     /* ── Gold top & bottom bars ── */
//     .gold-bar-top, .gold-bar-bottom {
//       position: absolute;
//       left: 0; right: 0;
//       height: 12px;
//       background: linear-gradient(90deg,
//         #8b6914 0%, #c9940a 15%, #e8c040 30%,
//         #f5d76e 45%, #fce88a 50%,
//         #f5d76e 55%, #e8c040 70%,
//         #c9940a 85%, #8b6914 100%
//       );
//       z-index: 10;
//     }
//     .gold-bar-top { top: 0; }
//     .gold-bar-bottom { bottom: 0; }

//     /* ── Oval white card ── */
//     .oval-card {
//       position: relative;
//       width: 258mm;
//       height: 180mm;
//       background: linear-gradient(160deg, #f8faff 0%, #eef3fc 40%, #f0f5ff 60%, #e8eefa 100%);
//       border-radius: 50% / 42%;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: flex-start;
//       overflow: hidden;
//       z-index: 2;
//       box-shadow:
//         0 0 0 6px rgba(200,148,10,0.7),
//         0 0 0 10px rgba(200,148,10,0.3),
//         0 8px 60px rgba(0,0,0,0.35);
//     }

//     /* Subtle inner radial glow */
//     .oval-card::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.9) 0%, transparent 60%);
//       pointer-events: none;
//       z-index: 0;
//     }

//     /* Blue decorative arcs inside oval (top and bottom) */
//     .arc-top, .arc-bottom {
//       position: absolute;
//       left: 50%;
//       transform: translateX(-50%);
//       border-radius: 50%;
//       pointer-events: none;
//       z-index: 1;
//     }
//     .arc-top {
//       top: -28mm;
//       width: 220mm;
//       height: 56mm;
//       border: 3px solid rgba(30,80,152,0.12);
//     }
//     .arc-bottom {
//       bottom: -28mm;
//       width: 220mm;
//       height: 56mm;
//       border: 3px solid rgba(30,80,152,0.12);
//     }

//     /* ── Content wrapper ── */
//     .content {
//       position: relative;
//       z-index: 2;
//       width: 100%;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       padding: 9mm 24mm 0;
//     }

//     /* ── Logo row ── */
//     .logo-row {
//       display: flex;
//       align-items: center;
//       gap: 6px;
//       margin-bottom: 3mm;
//     }
//     .logo-icon {
//       width: 36px;
//       height: 36px;
//     }
//     .logo-text {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 24px;
//       font-weight: 800;
//       color: #1a3f7a;
//       letter-spacing: -0.5px;
//     }
//     .logo-text span { color: #e8831a; }

//     /* ── Main title ── */
//     .cert-title {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 30px;
//       font-weight: 900;
//       color: #1a3f7a;
//       letter-spacing: 2px;
//       text-transform: uppercase;
//       line-height: 1;
//       margin-bottom: 2.5mm;
//       text-align: center;
//     }
//     .cert-title em {
//       font-style: normal;
//       font-weight: 400;
//       font-size: 26px;
//       letter-spacing: 3px;
//     }

//     /* ── Subtitle ── */
//     .subtitle {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 9px;
//       font-weight: 400;
//       letter-spacing: 3.5px;
//       color: #555;
//       text-transform: uppercase;
//       margin-bottom: 1mm;
//     }

//     /* ── Underline divider ── */
//     .divider {
//       width: 120mm;
//       height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(30,80,152,0.25), transparent);
//       margin: 1.5mm auto 2mm;
//     }

//     /* ── Recipient name ── */
//     .recipient-name {
//       font-family: 'Dancing Script', cursive;
//       font-size: 52px;
//       font-weight: 700;
//       color: #1a2a50;
//       line-height: 1.05;
//       margin-bottom: 1mm;
//       text-align: center;
//     }

//     /* ── Completed text ── */
//     .completed-text {
//       font-family: 'Open Sans', sans-serif;
//       font-size: 9.5px;
//       color: #444;
//       margin-bottom: 2.5mm;
//       font-style: italic;
//     }

//     /* ── Course pill ── */
//     .course-pill {
//       background: linear-gradient(135deg, #1a3f7a, #1e5cb3);
//       color: #fff;
//       font-family: 'Montserrat', sans-serif;
//       font-size: 13px;
//       font-weight: 800;
//       letter-spacing: 2.5px;
//       padding: 5px 28px;
//       border-radius: 30px;
//       text-transform: uppercase;
//       margin-bottom: 3.5mm;
//       box-shadow: 0 3px 12px rgba(26,63,122,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
//       border: 1px solid rgba(255,255,255,0.1);
//     }

//     /* ── Stats row ── */
//     .stats-outer {
//       display: flex;
//       align-items: stretch;
//       gap: 0;
//       width: 100%;
//       max-width: 185mm;
//       border: 1px solid rgba(30,80,152,0.15);
//       border-radius: 4px;
//       margin-bottom: 3mm;
//       overflow: hidden;
//       background: rgba(255,255,255,0.6);
//     }
//     .stat-col {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       padding: 4px 8px 5px;
//     }
//     .stat-col + .stat-col {
//       border-left: 1px solid rgba(30,80,152,0.15);
//     }
//     .stat-label {
//       font-family: 'Open Sans', sans-serif;
//       font-size: 8px;
//       color: #666;
//       margin-bottom: 2px;
//     }
//     .stat-value {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 13px;
//       font-weight: 700;
//       color: #1a2a50;
//       line-height: 1;
//     }
//     .stat-value.score-value {
//       font-size: 18px;
//     }
//     .grade-badge {
//       background: ${passed ? '#2e7d32' : '#c62828'};
//       color: #fff;
//       font-family: 'Montserrat', sans-serif;
//       font-size: 11px;
//       font-weight: 800;
//       letter-spacing: 1.5px;
//       padding: 3px 14px;
//       border-radius: 4px;
//     }

//     /* ── Bottom row: sig | cert ID | tagline | seal ── */
//     .bottom-row {
//       display: flex;
//       align-items: flex-end;
//       width: 100%;
//       max-width: 215mm;
//       padding: 0 0 1mm;
//       gap: 0;
//     }

//     /* Signature block */
//     .sig-block {
//       display: flex;
//       flex-direction: column;
//       align-items: flex-start;
//       min-width: 52mm;
//     }
//     .sig-name {
//       font-family: 'Pacifico', cursive;
//       font-size: 20px;
//       color: #1a2a50;
//       line-height: 1;
//       margin-bottom: 2px;
//     }
//     .sig-line {
//       width: 44mm;
//       height: 1px;
//       background: rgba(26,42,80,0.4);
//       margin-bottom: 3px;
//     }
//     .sig-role {
//       font-family: 'Open Sans', sans-serif;
//       font-size: 8px;
//       color: #555;
//       letter-spacing: 0.3px;
//     }

//     /* Center block */
//     .cert-id-block {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       padding-bottom: 2px;
//     }
//     .cert-id-text {
//       font-family: 'Open Sans', sans-serif;
//       font-size: 8px;
//       color: #555;
//     }
//     .cert-id-text strong {
//       color: #1a2a50;
//     }
//     .tagline {
//       font-family: 'Open Sans', sans-serif;
//       font-size: 7.5px;
//       font-style: italic;
//       color: #1a3f7a;
//       margin-top: 2px;
//       letter-spacing: 0.3px;
//     }

//     /* Gold certified seal */
//     .seal {
//       width: 58px;
//       height: 58px;
//       position: relative;
//       flex-shrink: 0;
//     }
//     .seal svg {
//       width: 100%;
//       height: 100%;
//       filter: drop-shadow(0 2px 6px rgba(180,130,0,0.5));
//     }

//     /* ── Print ── */
//     @media print {
//       html, body { background: #1a4b8c !important; }
//       .page { page-break-after: avoid; }
//     }
//   </style>
// </head>
// <body>
// <div class="page">
//   <div class="gold-bar-top"></div>
//   <div class="gold-bar-bottom"></div>

//   <div class="oval-card">
//     <div class="arc-top"></div>
//     <div class="arc-bottom"></div>

//     <div class="content">

//       <!-- Logo -->
//       <div class="logo-row">
//         <!-- AxioQuan A icon -->
//         <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <polygon points="20,4 36,34 4,34" fill="none" stroke="#1a3f7a" stroke-width="2.5"/>
//           <line x1="10" y1="26" x2="30" y2="26" stroke="#1a3f7a" stroke-width="2.5"/>
//           <polygon points="24,4 36,34 20,34" fill="#e8831a" opacity="0.75"/>
//         </svg>
//         <div class="logo-text">Axio<span>Quan</span></div>
//       </div>

//       <!-- Title -->
//       <div class="cert-title">CERTIFICATE <em>of</em> COMPLETION</div>

//       <!-- Subtitle -->
//       <div class="subtitle">This is proudly presented to</div>

//       <!-- Divider -->
//       <div class="divider"></div>

//       <!-- Student name -->
//       <div class="recipient-name">${data.studentName}</div>

//       <!-- Completion text -->
//       <div class="completed-text">For successfully completing the course</div>

//       <!-- Course pill -->
//       <div class="course-pill">${courseUpper}</div>

//       <!-- Stats -->
//       <div class="stats-outer">
//         <div class="stat-col">
//           <div class="stat-label">Date Taken:</div>
//           <div class="stat-value">${dateTaken}</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Average Score:</div>
//           <div class="stat-value score-value">${data.averageScore}%</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Grade:</div>
//           <div class="grade-badge">${passed ? 'PASSED' : 'FAILED'}</div>
//         </div>
//       </div>

//       <!-- Bottom row -->
//       <div class="bottom-row">

//         <!-- Signature -->
//         <div class="sig-block">
//           <div class="sig-name">Alexander Cyril</div>
//           <div class="sig-line"></div>
//           <div class="sig-role">Training Director</div>
//         </div>

//         <!-- Center: Cert ID + tagline -->
//         <div class="cert-id-block">
//           <div class="cert-id-text">Certificate ID: <strong>${certCode}</strong></div>
//           <div class="tagline">Empowering Your Learning Journey</div>
//         </div>

//         <!-- Gold certified seal -->
//         <div class="seal">
//           <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <radialGradient id="sg" cx="50%" cy="40%" r="60%">
//                 <stop offset="0%" stop-color="#f8e170"/>
//                 <stop offset="50%" stop-color="#d4a017"/>
//                 <stop offset="100%" stop-color="#8b6000"/>
//               </radialGradient>
//             </defs>
//             <!-- Starburst rays -->
//             ${Array.from({ length: 16 }, (_, i) => {
//               const angle = (i * 22.5) * Math.PI / 180;
//               const x1 = 50 + 38 * Math.cos(angle);
//               const y1 = 50 + 38 * Math.sin(angle);
//               const x2 = 50 + 46 * Math.cos(angle);
//               const y2 = 50 + 46 * Math.sin(angle);
//               return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#c9940a" stroke-width="2.5"/>`;
//             }).join('\n            ')}
//             <!-- Outer ring -->
//             <circle cx="50" cy="50" r="40" fill="url(#sg)" stroke="#8b6000" stroke-width="0.5"/>
//             <!-- Inner ring -->
//             <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
//             <!-- Stars row -->
//             <text x="50" y="30" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.9)" font-family="sans-serif">★ ★ ★ ★ ★</text>
//             <!-- CERTIFIED text -->
//             <text x="50" y="52" text-anchor="middle" font-size="11" font-weight="900"
//               font-family="Montserrat,sans-serif" fill="#1a0000"
//               letter-spacing="0.5">CERTIFIED</text>
//             <!-- Stars bottom -->
//             <text x="50" y="68" text-anchor="middle" font-size="6" fill="rgba(255,255,255,0.8)" font-family="sans-serif">★ ★ ★</text>
//           </svg>
//         </div>

//       </div><!-- /bottom-row -->

//     </div><!-- /content -->
//   </div><!-- /oval-card -->
// </div><!-- /page -->

// <script>
//   document.fonts.ready.then(function() {
//     setTimeout(function() { window.print(); }, 600);
//   });
// </script>
// </body>
// </html>`;
// }

// // ─── Print window ─────────────────────────────────────────────────────────────

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) {
//     w.document.write(html);
//     w.document.close();
//     w.focus();
//   }
// }

// // ─── React Component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issuing, setIssuing] = useState(false);
//   const [issued, setIssued] = useState(alreadyIssued ?? false);
//   const [certCode, setCertCode] = useState<string | null>(null);

//   const handleIssue = async () => {
//     if (data.averageScore < 70) {
//       toast.error('Student has not met the minimum passing score of 70%');
//       return;
//     }

//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       // Already issued — still allow re-download
//       if (result.alreadyIssued) {
//         const code = `AXQ-${Date.now().toString(36).toUpperCase()}`;
//         setCertCode(code);
//         setIssued(true);
//         openCertPrintWindow(buildCertHTML(data, code));
//         toast.info('Certificate already issued — opening for download.');
//         onIssued?.();
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setCertCode(code);
//       setIssued(true);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(`Certificate issued for ${data.studentName}!`);
//       onIssued?.();
//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = certCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // Not eligible
//   if (data.averageScore < 70) {
//     return (
//       <Button
//         size="sm"
//         variant="outline"
//         disabled
//         className="opacity-40 cursor-not-allowed text-xs"
//       >
//         <Award className="h-3 w-3 mr-1" />
//         Not Eligible
//       </Button>
//     );
//   }

//   // Already issued — show re-download
//   if (issued) {
//     return (
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={handleRedownload}
//         className="cursor-pointer border-amber-300 text-amber-700 hover:bg-amber-50 text-xs gap-1"
//       >
//         <Download className="h-3 w-3" />
//         Re-download
//       </Button>
//     );
//   }

//   // Issue
//   return (
//     <Button
//       size="sm"
//       onClick={handleIssue}
//       disabled={issuing}
//       className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1"
//     >
//       {issuing ? (
//         <><Loader2 className="h-3 w-3 animate-spin" /> Issuing...</>
//       ) : (
//         <><Award className="h-3 w-3" /> Issue Cert</>
//       )}
//     </Button>
//   );
// }
































// 'use client';
// // /src/components/dashboard/certificate-generator.tsx
// //
// // v5 changes:
// // • On mount: hits GET /api/certificates/issue?student_id&assessment_id
// //   to load real issued status from DB → survives page refresh
// // • Duplicate detected: shows toast with confirm "Resend?" — if yes,
// //   calls POST with force:true and issues a second certificate
// // • Removed dead "Generate Certificates (PDF)" button (was handleExportData('pdf'))
// //   — the Issue Cert button already opens a printable PDF window
// // • issuedCount tracked so "Re-download (x2)" can show multiple-issue state

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   /** Pass true if parent already knows cert is issued (avoids extra fetch) */
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────

// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed     = isPassed(data.averageScore);
//   const dateTaken  = formatDate(data.completedDate);
//   const courseUpper = data.courseTitle.toUpperCase();

//   // SVG rays for seal — generated inline
//   const rays: string[] = [];
//   for (let i = 0; i < 16; i++) {
//     const angle = (i * 22.5 * Math.PI) / 180;
//     const x1 = (50 + 38 * Math.cos(angle)).toFixed(1);
//     const y1 = (50 + 38 * Math.sin(angle)).toFixed(1);
//     const x2 = (50 + 47 * Math.cos(angle)).toFixed(1);
//     const y2 = (50 + 47 * Math.sin(angle)).toFixed(1);
//     rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c9940a" stroke-width="2.2"/>`);
//   }

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <title>Certificate – ${data.studentName}</title>
//   <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
//   <style>
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     @page { size: A4 landscape; margin: 0; }
//     html, body { width: 297mm; height: 210mm; overflow: hidden; background: #1a4b8c;
//       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     body { display: flex; align-items: center; justify-content: center;
//       font-family: 'Open Sans', sans-serif; }
//     .page { width: 297mm; height: 210mm; position: relative;
//       background: linear-gradient(135deg, #1a3f7a 0%, #1e5098 30%, #2060b0 50%, #1e5098 70%, #1a3f7a 100%);
//       overflow: hidden; display: flex; align-items: center; justify-content: center; }
//     .page::before { content: ''; position: absolute; inset: 0;
//       background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
//       background-size: 20px 20px; pointer-events: none; }
//     .gold-bar { position: absolute; left: 0; right: 0; height: 11px; z-index: 10;
//       background: linear-gradient(90deg, #7a5800 0%, #c9940a 12%, #e8c040 26%, #fff6b0 50%, #e8c040 74%, #c9940a 88%, #7a5800 100%); }
//     .gold-bar.top { top: 0; } .gold-bar.bot { bottom: 0; }
//     .oval { position: relative; width: 258mm; height: 182mm;
//       background: linear-gradient(160deg, #f8faff 0%, #edf2fc 35%, #f0f5ff 60%, #e8eefa 100%);
//       border-radius: 50% / 42%;
//       display: flex; flex-direction: column; align-items: center;
//       overflow: hidden; z-index: 2;
//       box-shadow: 0 0 0 5px rgba(200,148,10,0.75), 0 0 0 9px rgba(200,148,10,0.25), 0 6px 50px rgba(0,0,0,0.38); }
//     .oval::before { content: ''; position: absolute; inset: 0;
//       background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.92) 0%, transparent 52%);
//       pointer-events: none; z-index: 0; }
//     .arc { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 50%;
//       pointer-events: none; z-index: 1; width: 220mm; height: 56mm; }
//     .arc.top { top: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .arc.bot { bottom: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .content { position: relative; z-index: 2; width: 100%;
//       display: flex; flex-direction: column; align-items: center; padding: 8mm 22mm 0; }
//     .logo-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2.5mm; }
//     .logo-text { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800;
//       color: #1a3f7a; letter-spacing: -0.5px; }
//     .logo-text span { color: #e8831a; }
//     .cert-title { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 900;
//       color: #1a3f7a; letter-spacing: 2px; text-transform: uppercase; line-height: 1;
//       margin-bottom: 2mm; text-align: center; }
//     .cert-title em { font-style: normal; font-weight: 400; font-size: 24px; letter-spacing: 3px; }
//     .subtitle { font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 400;
//       letter-spacing: 3.5px; color: #666; text-transform: uppercase; margin-bottom: 0.8mm; }
//     .divider { width: 115mm; height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(30,80,152,0.22), transparent);
//       margin: 1.2mm auto 1.8mm; }
//     .recipient-name { font-family: 'Dancing Script', cursive; font-size: 50px; font-weight: 700;
//       color: #1a2a50; line-height: 1.05; margin-bottom: 1mm; text-align: center; }
//     .completed-text { font-family: 'Open Sans', sans-serif; font-size: 9px; color: #555;
//       margin-bottom: 2mm; font-style: italic; }
//     .course-pill { background: linear-gradient(135deg, #1a3f7a, #1e5cb3); color: #fff;
//       font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 800;
//       letter-spacing: 2px; padding: 5px 26px; border-radius: 30px; text-transform: uppercase;
//       margin-bottom: 3mm;
//       box-shadow: 0 3px 12px rgba(26,63,122,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
//     .stats-outer { display: flex; width: 185mm; border: 1px solid rgba(30,80,152,0.15);
//       border-radius: 4px; margin-bottom: 2.5mm; overflow: hidden; background: rgba(255,255,255,0.55); }
//     .stat-col { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 4px 8px 5px; }
//     .stat-col + .stat-col { border-left: 1px solid rgba(30,80,152,0.15); }
//     .stat-label { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #777; margin-bottom: 2px; }
//     .stat-value { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; color: #1a2a50; }
//     .stat-value.big { font-size: 18px; }
//     .grade-badge { color: #fff; font-family: 'Montserrat', sans-serif; font-size: 11px;
//       font-weight: 800; letter-spacing: 1.5px; padding: 3px 14px; border-radius: 4px;
//       background: ${passed ? '#2e7d32' : '#c62828'}; }
//     .bottom-row { display: flex; align-items: flex-end; width: 100%; padding: 0 3mm 0; gap: 0; margin-top: auto; }
//     .sig-block { display: flex; flex-direction: column; align-items: flex-start; min-width: 52mm; padding-bottom: 2mm; }
//     .sig-name { font-family: 'Pacifico', cursive; font-size: 19px; color: #1a2a50; line-height: 1; margin-bottom: 2px; }
//     .sig-line { width: 44mm; height: 1px; background: rgba(26,42,80,0.35); margin-bottom: 3px; }
//     .sig-role { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #666; }
//     .cert-id-block { flex: 1; display: flex; flex-direction: column; align-items: center; padding-bottom: 4mm; }
//     .cert-id-text { font-family: 'Open Sans', sans-serif; font-size: 8px; color: #666; }
//     .cert-id-text strong { color: #1a2a50; }
//     .tagline { font-family: 'Open Sans', sans-serif; font-size: 7.5px; font-style: italic; color: #1a3f7a; margin-top: 2px; }
//     .seal { width: 56px; height: 56px; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(160,110,0,0.5)); margin-bottom: 2mm; }
//     @media print {
//       html, body { background: #1a4b8c !important; }
//     }
//   </style>
// </head>
// <body>
// <div class="page">
//   <div class="gold-bar top"></div>
//   <div class="gold-bar bot"></div>
//   <div class="oval">
//     <div class="arc top"></div>
//     <div class="arc bot"></div>
//     <div class="content">

//       <!-- Logo -->
//       <div class="logo-row">
//         <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
//           <polygon points="20,4 36,34 4,34" fill="none" stroke="#1a3f7a" stroke-width="2.5"/>
//           <line x1="10" y1="26" x2="30" y2="26" stroke="#1a3f7a" stroke-width="2.5"/>
//           <polygon points="24,4 36,34 20,34" fill="#e8831a" opacity="0.8"/>
//         </svg>
//         <div class="logo-text">Axio<span>Quan</span></div>
//       </div>

//       <div class="cert-title">CERTIFICATE <em>of</em> COMPLETION</div>
//       <div class="subtitle">This is proudly presented to</div>
//       <div class="divider"></div>
//       <div class="recipient-name">${data.studentName}</div>
//       <div class="completed-text">For successfully completing the course</div>
//       <div class="course-pill">${courseUpper}</div>

//       <div class="stats-outer">
//         <div class="stat-col">
//           <div class="stat-label">Date Taken:</div>
//           <div class="stat-value">${dateTaken}</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Average Score:</div>
//           <div class="stat-value big">${data.averageScore}%</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Grade:</div>
//           <div class="grade-badge">${passed ? 'PASSED' : 'FAILED'}</div>
//         </div>
//       </div>

//       <div class="bottom-row">
//         <div class="sig-block">
//           <div class="sig-name">Alexander Cyril</div>
//           <div class="sig-line"></div>
//           <div class="sig-role">Training Director</div>
//         </div>
//         <div class="cert-id-block">
//           <div class="cert-id-text">Certificate ID: <strong>${certCode}</strong></div>
//           <div class="tagline">Empowering Your Learning Journey</div>
//         </div>
//         <svg class="seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <radialGradient id="sg" cx="50%" cy="38%" r="62%">
//               <stop offset="0%" stop-color="#fce88a"/>
//               <stop offset="40%" stop-color="#d4a017"/>
//               <stop offset="100%" stop-color="#7a5000"/>
//             </radialGradient>
//           </defs>
//           ${rays.join('\n          ')}
//           <circle cx="50" cy="50" r="40" fill="url(#sg)" stroke="#8b6000" stroke-width="0.8"/>
//           <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
//           <text x="50" y="30" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,0.9)" font-family="sans-serif">★ ★ ★ ★ ★</text>
//           <text x="50" y="52" text-anchor="middle" font-size="11" font-weight="900"
//             font-family="Montserrat,Arial,sans-serif" fill="#1a0a00" letter-spacing="0.3">CERTIFIED</text>
//           <text x="50" y="67" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.8)" font-family="sans-serif">★ ★ ★</text>
//         </svg>
//       </div>

//     </div>
//   </div>
// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   // null = loading, false = not issued, true = issued
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   // ── On mount: check DB for issued status (survives refresh) ───────────────
//   useEffect(() => {
//     // If parent already told us it's issued, trust it and skip fetch
//     if (alreadyIssued === true) {
//       setIssued(true);
//       return;
//     }
//     if (data.averageScore < 70) {
//       setIssued(false);
//       return;
//     }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   // ── Issue (or force re-issue) ─────────────────────────────────────────────
//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       // Duplicate — ask instructor if they want to resend
//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';

//         // Use a toast with action buttons
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: {
//             label: 'Yes, resend',
//             onClick: () => doIssue(true), // force=true
//           },
//           duration: 10000,
//         });
//         return;
//       }

//       // Success
//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);

//       openCertPrintWindow(buildCertHTML(data, code));
//       const msg = result.wasForced
//         ? `Additional certificate issued for ${data.studentName}.`
//         : `Certificate issued for ${data.studentName}!`;
//       toast.success(msg);
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   // Re-download previously issued cert
//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <Button size="sm" variant="outline" disabled
//         className="opacity-40 cursor-not-allowed text-xs">
//         <Award className="h-3 w-3 mr-1" /> Not Eligible
//       </Button>
//     );
//   }

//   // ── Loading (checking DB) ─────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <Button size="sm" variant="outline" disabled className="text-xs gap-1 opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin" /> Checking...
//       </Button>
//     );
//   }

//   // ── Already issued — show Re-download ────────────────────────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col items-start gap-0.5">
//         <Button size="sm" variant="outline" onClick={handleRedownload}
//           className="cursor-pointer border-amber-300 text-amber-700 hover:bg-amber-50 text-xs gap-1">
//           <Download className="h-3 w-3" />
//           Re-download{issuedCount > 1 ? ` (×${issuedCount})` : ''}
//         </Button>
//         {/* Allow re-issuing another copy */}
//         <button
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="text-[10px] text-blue-600 hover:underline cursor-pointer leading-tight pl-0.5"
//         >
//           {issuing ? 'Issuing…' : '+ Issue another'}
//         </button>
//       </div>
//     );
//   }

//   // ── Not yet issued ────────────────────────────────────────────────────────
//   return (
//     <Button size="sm" onClick={() => doIssue(false)} disabled={issuing}
//       className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1">
//       {issuing
//         ? <><Loader2 className="h-3 w-3 animate-spin" /> Issuing...</>
//         : <><Award className="h-3 w-3" /> Issue Cert</>}
//     </Button>
//   );
// }




























// 'use client';
// // /src/components/dashboard/certificate-generator.tsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────

// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed      = isPassed(data.averageScore);
//   const dateTaken   = formatDate(data.completedDate);
//   const courseUpper = data.courseTitle.toUpperCase();

//   const rays: string[] = [];
//   for (let i = 0; i < 16; i++) {
//     const angle = (i * 22.5 * Math.PI) / 180;
//     const x1 = (50 + 38 * Math.cos(angle)).toFixed(1);
//     const y1 = (50 + 38 * Math.sin(angle)).toFixed(1);
//     const x2 = (50 + 47 * Math.cos(angle)).toFixed(1);
//     const y2 = (50 + 47 * Math.sin(angle)).toFixed(1);
//     rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c9940a" stroke-width="2.2"/>`);
//   }

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <title>Certificate – ${data.studentName}</title>
//   <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
//   <style>
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     @page { size: A4 landscape; margin: 0; }
//     html, body { width: 297mm; height: 210mm; overflow: hidden; background: #1a4b8c;
//       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     body { display: flex; align-items: center; justify-content: center;
//       font-family: 'Open Sans', sans-serif; }
//     .page { width: 297mm; height: 210mm; position: relative;
//       background: linear-gradient(135deg, #1a3f7a 0%, #1e5098 30%, #2060b0 50%, #1e5098 70%, #1a3f7a 100%);
//       overflow: hidden; display: flex; align-items: center; justify-content: center; }
//     .page::before { content: ''; position: absolute; inset: 0;
//       background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
//       background-size: 20px 20px; pointer-events: none; }
//     .gold-bar { position: absolute; left: 0; right: 0; height: 11px; z-index: 10;
//       background: linear-gradient(90deg, #7a5800 0%, #c9940a 12%, #e8c040 26%, #fff6b0 50%, #e8c040 74%, #c9940a 88%, #7a5800 100%); }
//     .gold-bar.top { top: 0; } .gold-bar.bot { bottom: 0; }
//     .oval { position: relative; width: 258mm; height: 182mm;
//       background: linear-gradient(160deg, #f8faff 0%, #edf2fc 35%, #f0f5ff 60%, #e8eefa 100%);
//       border-radius: 50% / 42%;
//       display: flex; flex-direction: column; align-items: center;
//       overflow: hidden; z-index: 2;
//       box-shadow: 0 0 0 5px rgba(200,148,10,0.75), 0 0 0 9px rgba(200,148,10,0.25), 0 6px 50px rgba(0,0,0,0.38); }
//     .oval::before { content: ''; position: absolute; inset: 0;
//       background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.92) 0%, transparent 52%);
//       pointer-events: none; z-index: 0; }
//     .arc { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 50%;
//       pointer-events: none; z-index: 1; width: 220mm; height: 56mm; }
//     .arc.top { top: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .arc.bot { bottom: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .content { position: relative; z-index: 2; width: 100%;
//       display: flex; flex-direction: column; align-items: center; padding: 8mm 22mm 0; }
//     .logo-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2.5mm; }
//     .logo-text { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800;
//       color: #1a3f7a; letter-spacing: -0.5px; }
//     .logo-text span { color: #e8831a; }
//     .cert-title { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 900;
//       color: #1a3f7a; letter-spacing: 2px; text-transform: uppercase; line-height: 1;
//       margin-bottom: 2mm; text-align: center; }
//     .cert-title em { font-style: normal; font-weight: 400; font-size: 24px; letter-spacing: 3px; }
//     .subtitle { font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 400;
//       letter-spacing: 3.5px; color: #666; text-transform: uppercase; margin-bottom: 0.8mm; }
//     .divider { width: 115mm; height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(30,80,152,0.22), transparent);
//       margin: 1.2mm auto 1.8mm; }
//     .recipient-name { font-family: 'Dancing Script', cursive; font-size: 50px; font-weight: 700;
//       color: #1a2a50; line-height: 1.05; margin-bottom: 1mm; text-align: center; }
//     .completed-text { font-family: 'Open Sans', sans-serif; font-size: 9px; color: #555;
//       margin-bottom: 2mm; font-style: italic; }
//     .course-pill { background: linear-gradient(135deg, #1a3f7a, #1e5cb3); color: #fff;
//       font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 800;
//       letter-spacing: 2px; padding: 5px 26px; border-radius: 30px; text-transform: uppercase;
//       margin-bottom: 3mm;
//       box-shadow: 0 3px 12px rgba(26,63,122,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
//     .stats-outer { display: flex; width: 185mm; border: 1px solid rgba(30,80,152,0.15);
//       border-radius: 4px; margin-bottom: 2.5mm; overflow: hidden; background: rgba(255,255,255,0.55); }
//     .stat-col { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 4px 8px 5px; }
//     .stat-col + .stat-col { border-left: 1px solid rgba(30,80,152,0.15); }
//     .stat-label { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #777; margin-bottom: 2px; }
//     .stat-value { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; color: #1a2a50; }
//     .stat-value.big { font-size: 18px; }
//     .grade-badge { color: #fff; font-family: 'Montserrat', sans-serif; font-size: 11px;
//       font-weight: 800; letter-spacing: 1.5px; padding: 3px 14px; border-radius: 4px;
//       background: ${passed ? '#2e7d32' : '#c62828'}; }
//     .bottom-row { display: flex; align-items: flex-end; width: 100%; padding: 0 3mm 0; gap: 0; margin-top: auto; }
//     .sig-block { display: flex; flex-direction: column; align-items: flex-start; min-width: 52mm; padding-bottom: 2mm; }
//     .sig-name { font-family: 'Pacifico', cursive; font-size: 19px; color: #1a2a50; line-height: 1; margin-bottom: 2px; }
//     .sig-line { width: 44mm; height: 1px; background: rgba(26,42,80,0.35); margin-bottom: 3px; }
//     .sig-role { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #666; }
//     .cert-id-block { flex: 1; display: flex; flex-direction: column; align-items: center; padding-bottom: 4mm; }
//     .cert-id-text { font-family: 'Open Sans', sans-serif; font-size: 8px; color: #666; }
//     .cert-id-text strong { color: #1a2a50; }
//     .tagline { font-family: 'Open Sans', sans-serif; font-size: 7.5px; font-style: italic; color: #1a3f7a; margin-top: 2px; }
//     .seal { width: 56px; height: 56px; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(160,110,0,0.5)); margin-bottom: 2mm; }
//     @media print { html, body { background: #1a4b8c !important; } }
//   </style>
// </head>
// <body>
// <div class="page">
//   <div class="gold-bar top"></div>
//   <div class="gold-bar bot"></div>
//   <div class="oval">
//     <div class="arc top"></div>
//     <div class="arc bot"></div>
//     <div class="content">
//       <div class="logo-row">
//         <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
//           <polygon points="20,4 36,34 4,34" fill="none" stroke="#1a3f7a" stroke-width="2.5"/>
//           <line x1="10" y1="26" x2="30" y2="26" stroke="#1a3f7a" stroke-width="2.5"/>
//           <polygon points="24,4 36,34 20,34" fill="#e8831a" opacity="0.8"/>
//         </svg>
//         <div class="logo-text">Axio<span>Quan</span></div>
//       </div>
//       <div class="cert-title">CERTIFICATE <em>of</em> COMPLETION</div>
//       <div class="subtitle">This is proudly presented to</div>
//       <div class="divider"></div>
//       <div class="recipient-name">${data.studentName}</div>
//       <div class="completed-text">For successfully completing the course</div>
//       <div class="course-pill">${courseUpper}</div>
//       <div class="stats-outer">
//         <div class="stat-col">
//           <div class="stat-label">Date Taken:</div>
//           <div class="stat-value">${dateTaken}</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Average Score:</div>
//           <div class="stat-value big">${data.averageScore}%</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Grade:</div>
//           <div class="grade-badge">${passed ? 'PASSED' : 'FAILED'}</div>
//         </div>
//       </div>
//       <div class="bottom-row">
//         <div class="sig-block">
//           <div class="sig-name">Alexander Cyril</div>
//           <div class="sig-line"></div>
//           <div class="sig-role">Training Director</div>
//         </div>
//         <div class="cert-id-block">
//           <div class="cert-id-text">Certificate ID: <strong>${certCode}</strong></div>
//           <div class="tagline">Empowering Your Learning Journey</div>
//         </div>
//         <svg class="seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <radialGradient id="sg" cx="50%" cy="38%" r="62%">
//               <stop offset="0%" stop-color="#fce88a"/>
//               <stop offset="40%" stop-color="#d4a017"/>
//               <stop offset="100%" stop-color="#7a5000"/>
//             </radialGradient>
//           </defs>
//           ${rays.join('\n          ')}
//           <circle cx="50" cy="50" r="40" fill="url(#sg)" stroke="#8b6000" stroke-width="0.8"/>
//           <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
//           <text x="50" y="30" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,0.9)" font-family="sans-serif">★ ★ ★ ★ ★</text>
//           <text x="50" y="52" text-anchor="middle" font-size="11" font-weight="900"
//             font-family="Montserrat,Arial,sans-serif" fill="#1a0a00" letter-spacing="0.3">CERTIFIED</text>
//           <text x="50" y="67" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.8)" font-family="sans-serif">★ ★ ★</text>
//         </svg>
//       </div>
//     </div>
//   </div>
// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   useEffect(() => {
//     if (alreadyIssued === true) { setIssued(true); return; }
//     if (data.averageScore < 70) { setIssued(false); return; }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: { label: 'Yes, resend', onClick: () => doIssue(true) },
//           duration: 10000,
//         });
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(
//         result.wasForced
//           ? `Additional certificate issued for ${data.studentName}.`
//           : `Certificate issued for ${data.studentName}!`
//       );
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <Button size="sm" variant="outline" disabled
//         className="w-full opacity-40 cursor-not-allowed text-xs">
//         <Award className="h-3 w-3 mr-1" /> Not Eligible
//       </Button>
//     );
//   }

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <Button size="sm" variant="outline" disabled className="w-full text-xs gap-1 opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin" /> Checking...
//       </Button>
//     );
//   }

//   // ── Already issued — Re-download + Issue Another stacked ─────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col gap-1.5 w-full">
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={handleRedownload}
//           className="w-full cursor-pointer border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold gap-1"
//         >
//           <Download className="h-3 w-3 shrink-0" />
//           Re-download{issuedCount > 1 ? ` (×${issuedCount})` : ''}
//         </Button>

//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="w-full cursor-pointer border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium gap-1"
//         >
//           {issuing
//             ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing…</>
//             : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
//           }
//         </Button>
//       </div>
//     );
//   }

//   // ── Not yet issued — prominent Issue Cert button ──────────────────────────
//   return (
//     <Button
//       size="sm"
//       onClick={() => doIssue(false)}
//       disabled={issuing}
//       className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-3 py-2 gap-1.5 shadow-sm"
//     >
//       {issuing
//         ? <><Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" /> Issuing...</>
//         : <><Award className="h-3.5 w-3.5 shrink-0" /> Issue Cert</>
//       }
//     </Button>
//   );
// }


























// 'use client';
// // /src/components/dashboard/certificate-generator.tsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────

// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed      = isPassed(data.averageScore);
//   const dateTaken   = formatDate(data.completedDate);
//   const courseUpper = data.courseTitle.toUpperCase();

//   const rays: string[] = [];
//   for (let i = 0; i < 16; i++) {
//     const angle = (i * 22.5 * Math.PI) / 180;
//     const x1 = (50 + 38 * Math.cos(angle)).toFixed(1);
//     const y1 = (50 + 38 * Math.sin(angle)).toFixed(1);
//     const x2 = (50 + 47 * Math.cos(angle)).toFixed(1);
//     const y2 = (50 + 47 * Math.sin(angle)).toFixed(1);
//     rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c9940a" stroke-width="2.2"/>`);
//   }

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <title>Certificate – ${data.studentName}</title>
//   <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
//   <style>
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     @page { size: A4 landscape; margin: 0; }
//     html, body { width: 297mm; height: 210mm; overflow: hidden; background: #1a4b8c;
//       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     body { display: flex; align-items: center; justify-content: center;
//       font-family: 'Open Sans', sans-serif; }
//     .page { width: 297mm; height: 210mm; position: relative;
//       background: linear-gradient(135deg, #1a3f7a 0%, #1e5098 30%, #2060b0 50%, #1e5098 70%, #1a3f7a 100%);
//       overflow: hidden; display: flex; align-items: center; justify-content: center; }
//     .page::before { content: ''; position: absolute; inset: 0;
//       background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
//       background-size: 20px 20px; pointer-events: none; }
//     .gold-bar { position: absolute; left: 0; right: 0; height: 11px; z-index: 10;
//       background: linear-gradient(90deg, #7a5800 0%, #c9940a 12%, #e8c040 26%, #fff6b0 50%, #e8c040 74%, #c9940a 88%, #7a5800 100%); }
//     .gold-bar.top { top: 0; } .gold-bar.bot { bottom: 0; }
//     .oval { position: relative; width: 258mm; height: 182mm;
//       background: linear-gradient(160deg, #f8faff 0%, #edf2fc 35%, #f0f5ff 60%, #e8eefa 100%);
//       border-radius: 50% / 42%;
//       display: flex; flex-direction: column; align-items: center;
//       overflow: hidden; z-index: 2;
//       box-shadow: 0 0 0 5px rgba(200,148,10,0.75), 0 0 0 9px rgba(200,148,10,0.25), 0 6px 50px rgba(0,0,0,0.38); }
//     .oval::before { content: ''; position: absolute; inset: 0;
//       background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.92) 0%, transparent 52%);
//       pointer-events: none; z-index: 0; }
//     .arc { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 50%;
//       pointer-events: none; z-index: 1; width: 220mm; height: 56mm; }
//     .arc.top { top: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .arc.bot { bottom: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .content { position: relative; z-index: 2; width: 100%;
//       display: flex; flex-direction: column; align-items: center; padding: 8mm 22mm 0; }
//     .logo-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2.5mm; }
//     .logo-text { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800;
//       color: #1a3f7a; letter-spacing: -0.5px; }
//     .logo-text span { color: #e8831a; }
//     .cert-title { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 900;
//       color: #1a3f7a; letter-spacing: 2px; text-transform: uppercase; line-height: 1;
//       margin-bottom: 2mm; text-align: center; }
//     .cert-title em { font-style: normal; font-weight: 400; font-size: 24px; letter-spacing: 3px; }
//     .subtitle { font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 400;
//       letter-spacing: 3.5px; color: #666; text-transform: uppercase; margin-bottom: 0.8mm; }
//     .divider { width: 115mm; height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(30,80,152,0.22), transparent);
//       margin: 1.2mm auto 1.8mm; }
//     .recipient-name { font-family: 'Dancing Script', cursive; font-size: 50px; font-weight: 700;
//       color: #1a2a50; line-height: 1.05; margin-bottom: 1mm; text-align: center; }
//     .completed-text { font-family: 'Open Sans', sans-serif; font-size: 9px; color: #555;
//       margin-bottom: 2mm; font-style: italic; }
//     .course-pill { background: linear-gradient(135deg, #1a3f7a, #1e5cb3); color: #fff;
//       font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 800;
//       letter-spacing: 2px; padding: 5px 26px; border-radius: 30px; text-transform: uppercase;
//       margin-bottom: 3mm;
//       box-shadow: 0 3px 12px rgba(26,63,122,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
//     .stats-outer { display: flex; width: 185mm; border: 1px solid rgba(30,80,152,0.15);
//       border-radius: 4px; margin-bottom: 2.5mm; overflow: hidden; background: rgba(255,255,255,0.55); }
//     .stat-col { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 4px 8px 5px; }
//     .stat-col + .stat-col { border-left: 1px solid rgba(30,80,152,0.15); }
//     .stat-label { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #777; margin-bottom: 2px; }
//     .stat-value { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; color: #1a2a50; }
//     .stat-value.big { font-size: 18px; }
//     .grade-badge { color: #fff; font-family: 'Montserrat', sans-serif; font-size: 11px;
//       font-weight: 800; letter-spacing: 1.5px; padding: 3px 14px; border-radius: 4px;
//       background: ${passed ? '#2e7d32' : '#c62828'}; }
//     .bottom-row { display: flex; align-items: flex-end; width: 100%; padding: 0 3mm 0; gap: 0; margin-top: auto; }
//     .sig-block { display: flex; flex-direction: column; align-items: flex-start; min-width: 52mm; padding-bottom: 2mm; }
//     .sig-name { font-family: 'Pacifico', cursive; font-size: 19px; color: #1a2a50; line-height: 1; margin-bottom: 2px; }
//     .sig-line { width: 44mm; height: 1px; background: rgba(26,42,80,0.35); margin-bottom: 3px; }
//     .sig-role { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #666; }
//     .cert-id-block { flex: 1; display: flex; flex-direction: column; align-items: center; padding-bottom: 4mm; }
//     .cert-id-text { font-family: 'Open Sans', sans-serif; font-size: 8px; color: #666; }
//     .cert-id-text strong { color: #1a2a50; }
//     .tagline { font-family: 'Open Sans', sans-serif; font-size: 7.5px; font-style: italic; color: #1a3f7a; margin-top: 2px; }
//     .seal { width: 56px; height: 56px; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(160,110,0,0.5)); margin-bottom: 2mm; }
//     @media print { html, body { background: #1a4b8c !important; } }
//   </style>
// </head>
// <body>
// <div class="page">
//   <div class="gold-bar top"></div>
//   <div class="gold-bar bot"></div>
//   <div class="oval">
//     <div class="arc top"></div>
//     <div class="arc bot"></div>
//     <div class="content">
//       <div class="logo-row">
//         <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
//           <polygon points="20,4 36,34 4,34" fill="none" stroke="#1a3f7a" stroke-width="2.5"/>
//           <line x1="10" y1="26" x2="30" y2="26" stroke="#1a3f7a" stroke-width="2.5"/>
//           <polygon points="24,4 36,34 20,34" fill="#e8831a" opacity="0.8"/>
//         </svg>
//         <div class="logo-text">Axio<span>Quan</span></div>
//       </div>
//       <div class="cert-title">CERTIFICATE <em>of</em> COMPLETION</div>
//       <div class="subtitle">This is proudly presented to</div>
//       <div class="divider"></div>
//       <div class="recipient-name">${data.studentName}</div>
//       <div class="completed-text">For successfully completing the course</div>
//       <div class="course-pill">${courseUpper}</div>
//       <div class="stats-outer">
//         <div class="stat-col">
//           <div class="stat-label">Date Taken:</div>
//           <div class="stat-value">${dateTaken}</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Average Score:</div>
//           <div class="stat-value big">${data.averageScore}%</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Grade:</div>
//           <div class="grade-badge">${passed ? 'PASSED' : 'FAILED'}</div>
//         </div>
//       </div>
//       <div class="bottom-row">
//         <div class="sig-block">
//           <div class="sig-name">Alexander Cyril</div>
//           <div class="sig-line"></div>
//           <div class="sig-role">Training Director</div>
//         </div>
//         <div class="cert-id-block">
//           <div class="cert-id-text">Certificate ID: <strong>${certCode}</strong></div>
//           <div class="tagline">Empowering Your Learning Journey</div>
//         </div>
//         <svg class="seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <radialGradient id="sg" cx="50%" cy="38%" r="62%">
//               <stop offset="0%" stop-color="#fce88a"/>
//               <stop offset="40%" stop-color="#d4a017"/>
//               <stop offset="100%" stop-color="#7a5000"/>
//             </radialGradient>
//           </defs>
//           ${rays.join('\n          ')}
//           <circle cx="50" cy="50" r="40" fill="url(#sg)" stroke="#8b6000" stroke-width="0.8"/>
//           <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
//           <text x="50" y="30" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,0.9)" font-family="sans-serif">★ ★ ★ ★ ★</text>
//           <text x="50" y="52" text-anchor="middle" font-size="11" font-weight="900"
//             font-family="Montserrat,Arial,sans-serif" fill="#1a0a00" letter-spacing="0.3">CERTIFIED</text>
//           <text x="50" y="67" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.8)" font-family="sans-serif">★ ★ ★</text>
//         </svg>
//       </div>
//     </div>
//   </div>
// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   useEffect(() => {
//     if (alreadyIssued === true) { setIssued(true); return; }
//     if (data.averageScore < 70) { setIssued(false); return; }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: { label: 'Yes, resend', onClick: () => doIssue(true) },
//           duration: 10000,
//         });
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(
//         result.wasForced
//           ? `Additional certificate issued for ${data.studentName}.`
//           : `Certificate issued for ${data.studentName}!`
//       );
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <Button size="sm" variant="outline" disabled
//         className="w-full opacity-40 cursor-not-allowed text-xs">
//         <Award className="h-3 w-3 mr-1" /> Not Eligible
//       </Button>
//     );
//   }

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <Button size="sm" variant="outline" disabled className="w-full text-xs gap-1 opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin" /> Checking...
//       </Button>
//     );
//   }

//   // ── Already issued — Re-download + Issue Another stacked ─────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col gap-1.5 w-full">
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={handleRedownload}
//           className="w-full cursor-pointer border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold gap-1"
//         >
//           <Download className="h-3 w-3 shrink-0" />
//           Re-download{issuedCount > 1 ? ` (×${issuedCount})` : ''}
//         </Button>

//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="w-full cursor-pointer border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium gap-1"
//         >
//           {issuing
//             ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing…</>
//             : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
//           }
//         </Button>
//       </div>
//     );
//   }

//   // ── Not yet issued — prominent Issue Cert button ──────────────────────────
//   return (
//     <Button
//       size="sm"
//       onClick={() => doIssue(false)}
//       disabled={issuing}
//       className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-3 py-2 gap-1.5 shadow-sm"
//     >
//       {issuing
//         ? <><Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" /> Issuing...</>
//         : <><Award className="h-3.5 w-3.5 shrink-0" /> Issue Cert</>
//       }
//     </Button>
//   );
// }


































// 'use client';
// // /src/components/dashboard/certificate-generator.tsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────

// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed      = isPassed(data.averageScore);
//   const dateTaken   = formatDate(data.completedDate);
//   const courseUpper = data.courseTitle.toUpperCase();

//   const rays: string[] = [];
//   for (let i = 0; i < 16; i++) {
//     const angle = (i * 22.5 * Math.PI) / 180;
//     const x1 = (50 + 38 * Math.cos(angle)).toFixed(1);
//     const y1 = (50 + 38 * Math.sin(angle)).toFixed(1);
//     const x2 = (50 + 47 * Math.cos(angle)).toFixed(1);
//     const y2 = (50 + 47 * Math.sin(angle)).toFixed(1);
//     rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c9940a" stroke-width="2.2"/>`);
//   }

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <title>Certificate – ${data.studentName}</title>
//   <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
//   <style>
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     @page { size: A4 landscape; margin: 0; }
//     html, body { width: 297mm; height: 210mm; overflow: hidden; background: #1a4b8c;
//       -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//     body { display: flex; align-items: center; justify-content: center;
//       font-family: 'Open Sans', sans-serif; }
//     .page { width: 297mm; height: 210mm; position: relative;
//       background: linear-gradient(135deg, #1a3f7a 0%, #1e5098 30%, #2060b0 50%, #1e5098 70%, #1a3f7a 100%);
//       overflow: hidden; display: flex; align-items: center; justify-content: center; }
//     .page::before { content: ''; position: absolute; inset: 0;
//       background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
//       background-size: 20px 20px; pointer-events: none; }
//     .gold-bar { position: absolute; left: 0; right: 0; height: 11px; z-index: 10;
//       background: linear-gradient(90deg, #7a5800 0%, #c9940a 12%, #e8c040 26%, #fff6b0 50%, #e8c040 74%, #c9940a 88%, #7a5800 100%); }
//     .gold-bar.top { top: 0; } .gold-bar.bot { bottom: 0; }
//     .oval { position: relative; width: 258mm; height: 182mm;
//       background: linear-gradient(160deg, #f8faff 0%, #edf2fc 35%, #f0f5ff 60%, #e8eefa 100%);
//       border-radius: 50% / 42%;
//       display: flex; flex-direction: column; align-items: center;
//       overflow: hidden; z-index: 2;
//       box-shadow: 0 0 0 5px rgba(200,148,10,0.75), 0 0 0 9px rgba(200,148,10,0.25), 0 6px 50px rgba(0,0,0,0.38); }
//     .oval::before { content: ''; position: absolute; inset: 0;
//       background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.92) 0%, transparent 52%);
//       pointer-events: none; z-index: 0; }
//     .arc { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 50%;
//       pointer-events: none; z-index: 1; width: 220mm; height: 56mm; }
//     .arc.top { top: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .arc.bot { bottom: -28mm; border: 2px solid rgba(30,80,152,0.09); }
//     .content { position: relative; z-index: 2; width: 100%;
//       display: flex; flex-direction: column; align-items: center; padding: 8mm 22mm 0; }
//     .logo-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2.5mm; }
//     .logo-text { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800;
//       color: #1a3f7a; letter-spacing: -0.5px; }
//     .logo-text span { color: #e8831a; }
//     .cert-title { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 900;
//       color: #1a3f7a; letter-spacing: 2px; text-transform: uppercase; line-height: 1;
//       margin-bottom: 2mm; text-align: center; }
//     .cert-title em { font-style: normal; font-weight: 400; font-size: 24px; letter-spacing: 3px; }
//     .subtitle { font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 400;
//       letter-spacing: 3.5px; color: #666; text-transform: uppercase; margin-bottom: 0.8mm; }
//     .divider { width: 115mm; height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(30,80,152,0.22), transparent);
//       margin: 1.2mm auto 1.8mm; }
//     .recipient-name { font-family: 'Dancing Script', cursive; font-size: 50px; font-weight: 700;
//       color: #1a2a50; line-height: 1.05; margin-bottom: 1mm; text-align: center; }
//     .completed-text { font-family: 'Open Sans', sans-serif; font-size: 9px; color: #555;
//       margin-bottom: 2mm; font-style: italic; }
//     .course-pill { background: linear-gradient(135deg, #1a3f7a, #1e5cb3); color: #fff;
//       font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 800;
//       letter-spacing: 2px; padding: 5px 26px; border-radius: 30px; text-transform: uppercase;
//       margin-bottom: 3mm;
//       box-shadow: 0 3px 12px rgba(26,63,122,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
//     .stats-outer { display: flex; width: 185mm; border: 1px solid rgba(30,80,152,0.15);
//       border-radius: 4px; margin-bottom: 2.5mm; overflow: hidden; background: rgba(255,255,255,0.55); }
//     .stat-col { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 4px 8px 5px; }
//     .stat-col + .stat-col { border-left: 1px solid rgba(30,80,152,0.15); }
//     .stat-label { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #777; margin-bottom: 2px; }
//     .stat-value { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; color: #1a2a50; }
//     .stat-value.big { font-size: 18px; }
//     .grade-badge { color: #fff; font-family: 'Montserrat', sans-serif; font-size: 11px;
//       font-weight: 800; letter-spacing: 1.5px; padding: 3px 14px; border-radius: 4px;
//       background: ${passed ? '#2e7d32' : '#c62828'}; }
//     .bottom-row { display: flex; align-items: flex-end; width: 100%; padding: 0 3mm 0; gap: 0; margin-top: auto; }
//     .sig-block { display: flex; flex-direction: column; align-items: flex-start; min-width: 52mm; padding-bottom: 2mm; }
//     .sig-name { font-family: 'Pacifico', cursive; font-size: 19px; color: #1a2a50; line-height: 1; margin-bottom: 2px; }
//     .sig-line { width: 44mm; height: 1px; background: rgba(26,42,80,0.35); margin-bottom: 3px; }
//     .sig-role { font-family: 'Open Sans', sans-serif; font-size: 7.5px; color: #666; }
//     .cert-id-block { flex: 1; display: flex; flex-direction: column; align-items: center; padding-bottom: 4mm; }
//     .cert-id-text { font-family: 'Open Sans', sans-serif; font-size: 8px; color: #666; }
//     .cert-id-text strong { color: #1a2a50; }
//     .tagline { font-family: 'Open Sans', sans-serif; font-size: 7.5px; font-style: italic; color: #1a3f7a; margin-top: 2px; }
//     .seal { width: 56px; height: 56px; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(160,110,0,0.5)); margin-bottom: 2mm; }
//     @media print { html, body { background: #1a4b8c !important; } }
//   </style>
// </head>
// <body>
// <div class="page">
//   <div class="gold-bar top"></div>
//   <div class="gold-bar bot"></div>
//   <div class="oval">
//     <div class="arc top"></div>
//     <div class="arc bot"></div>
//     <div class="content">
//       <div class="logo-row">
//         <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
//           <polygon points="20,4 36,34 4,34" fill="none" stroke="#1a3f7a" stroke-width="2.5"/>
//           <line x1="10" y1="26" x2="30" y2="26" stroke="#1a3f7a" stroke-width="2.5"/>
//           <polygon points="24,4 36,34 20,34" fill="#e8831a" opacity="0.8"/>
//         </svg>
//         <div class="logo-text">Axio<span>Quan</span></div>
//       </div>
//       <div class="cert-title">CERTIFICATE <em>of</em> COMPLETION</div>
//       <div class="subtitle">This is proudly presented to</div>
//       <div class="divider"></div>
//       <div class="recipient-name">${data.studentName}</div>
//       <div class="completed-text">For successfully completing the course</div>
//       <div class="course-pill">${courseUpper}</div>
//       <div class="stats-outer">
//         <div class="stat-col">
//           <div class="stat-label">Date Taken:</div>
//           <div class="stat-value">${dateTaken}</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Average Score:</div>
//           <div class="stat-value big">${data.averageScore}%</div>
//         </div>
//         <div class="stat-col">
//           <div class="stat-label">Grade:</div>
//           <div class="grade-badge">${passed ? 'PASSED' : 'FAILED'}</div>
//         </div>
//       </div>
//       <div class="bottom-row">
//         <div class="sig-block">
//           <div class="sig-name">Alexander Cyril</div>
//           <div class="sig-line"></div>
//           <div class="sig-role">Training Director</div>
//         </div>
//         <div class="cert-id-block">
//           <div class="cert-id-text">Certificate ID: <strong>${certCode}</strong></div>
//           <div class="tagline">Empowering Your Learning Journey</div>
//         </div>
//         <svg class="seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <radialGradient id="sg" cx="50%" cy="38%" r="62%">
//               <stop offset="0%" stop-color="#fce88a"/>
//               <stop offset="40%" stop-color="#d4a017"/>
//               <stop offset="100%" stop-color="#7a5000"/>
//             </radialGradient>
//           </defs>
//           ${rays.join('\n          ')}
//           <circle cx="50" cy="50" r="40" fill="url(#sg)" stroke="#8b6000" stroke-width="0.8"/>
//           <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
//           <text x="50" y="30" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,0.9)" font-family="sans-serif">★ ★ ★ ★ ★</text>
//           <text x="50" y="52" text-anchor="middle" font-size="11" font-weight="900"
//             font-family="Montserrat,Arial,sans-serif" fill="#1a0a00" letter-spacing="0.3">CERTIFIED</text>
//           <text x="50" y="67" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.8)" font-family="sans-serif">★ ★ ★</text>
//         </svg>
//       </div>
//     </div>
//   </div>
// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   useEffect(() => {
//     if (alreadyIssued === true) { setIssued(true); return; }
//     if (data.averageScore < 70) { setIssued(false); return; }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: { label: 'Yes, resend', onClick: () => doIssue(true) },
//           duration: 10000,
//         });
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(
//         result.wasForced
//           ? `Additional certificate issued for ${data.studentName}.`
//           : `Certificate issued for ${data.studentName}!`
//       );
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-40 cursor-not-allowed">
//         <Award className="h-3 w-3 shrink-0" /> Not Eligible
//       </span>
//     );
//   }

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin shrink-0" /> Checking...
//       </span>
//     );
//   }

//   // ── Already issued — Re-download + Issue Another stacked ─────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col items-end gap-1">
//         <button
//           onClick={handleRedownload}
//           className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight"
//         >
//           <Download className="h-3 w-3 shrink-0" />
//           Re-download{issuedCount > 1 ? ` (×${issuedCount})` : ''}
//         </button>
//         <button
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer leading-tight disabled:opacity-50"
//         >
//           {issuing
//             ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing…</>
//             : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
//           }
//         </button>
//       </div>
//     );
//   }

//   // ── Not yet issued — text-only link style ────────────────────────────────
//   return (
//     <button
//       onClick={() => doIssue(false)}
//       disabled={issuing}
//       className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight disabled:opacity-50"
//     >
//       {issuing
//         ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
//         : <><Award className="h-3 w-3 shrink-0" /> Issue Cert</>
//       }
//     </button>
//   );
// }




































// 'use client';
// // /src/components/dashboard/certificate-generator.tsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────

// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed        = isPassed(data.averageScore);
//   const dateTaken     = formatDate(data.completedDate);
//   const grade         = getGrade(data.averageScore);
//   // Pre-compute all conditional values — keeps template literal clean
//   const pillBg        = passed ? '#dcfce7' : '#fee2e2';
//   const pillColor     = passed ? '#166534' : '#991b1b';
//   const pillBorder    = passed ? '#86efac' : '#fca5a5';
//   const passedLabel   = passed ? 'PASSED' : 'FAILED';

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <title>Certificate – ${data.studentName}</title>
//   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet"/>
//   <style>
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     @page { size: A4 landscape; margin: 0; }
//     html, body {
//       width: 297mm; height: 210mm; overflow: hidden;
//       -webkit-print-color-adjust: exact; print-color-adjust: exact;
//     }
//     body {
//       font-family: 'Montserrat', sans-serif;
//       background: #0f172a;
//       display: flex; align-items: center; justify-content: center;
//     }

//     /* ── Outer page ── */
//     .page {
//       width: 297mm; height: 210mm;
//       position: relative; overflow: hidden;
//       background: #ffffff;
//       display: flex;
//     }

//     /* ── Left accent panel ── */
//     .left-panel {
//       width: 62mm; height: 100%;
//       background: linear-gradient(175deg, #0f172a 0%, #1e3a5f 55%, #0f2744 100%);
//       position: relative;
//       display: flex; flex-direction: column;
//       align-items: center; justify-content: space-between;
//       padding: 10mm 6mm;
//       flex-shrink: 0;
//     }
//     .left-panel::after {
//       content: '';
//       position: absolute; right: 0; top: 0; bottom: 0; width: 4px;
//       background: linear-gradient(180deg, #c9940a 0%, #f0c040 40%, #fff1a0 60%, #c9940a 100%);
//     }

//     /* Decorative circle pattern on left panel */
//     .circle-deco {
//       position: absolute;
//       border-radius: 50%;
//       border: 1px solid rgba(255,255,255,0.06);
//     }
//     .c1 { width: 80mm; height: 80mm; top: -20mm; left: -20mm; }
//     .c2 { width: 55mm; height: 55mm; top: 30mm; left: -15mm; }
//     .c3 { width: 70mm; height: 70mm; bottom: -10mm; left: -10mm; }

//     /* Logo area */
//     .logo-wrap {
//       display: flex; flex-direction: column; align-items: center; gap: 3mm;
//       position: relative; z-index: 2;
//     }
//     .logo-icon {
//       width: 14mm; height: 14mm;
//     }
//     .logo-name {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 15px; font-weight: 800; letter-spacing: 1px;
//       color: #ffffff;
//     }
//     .logo-name span { color: #f0c040; }
//     .logo-tagline {
//       font-size: 6px; font-weight: 400; letter-spacing: 2.5px;
//       color: rgba(255,255,255,0.45); text-transform: uppercase; text-align: center;
//     }

//     /* Left panel merit badge */
//     .merit-badge {
//       position: relative; z-index: 2;
//       display: flex; flex-direction: column; align-items: center; gap: 2mm;
//     }
//     .merit-circle {
//       width: 22mm; height: 22mm; border-radius: 50%;
//       background: linear-gradient(135deg, #c9940a, #f0c040, #fff1a0, #c9940a);
//       display: flex; align-items: center; justify-content: center;
//       box-shadow: 0 0 0 2px rgba(240,192,64,0.3), 0 4px 16px rgba(0,0,0,0.4);
//     }
//     .merit-inner {
//       width: 17mm; height: 17mm; border-radius: 50%;
//       background: linear-gradient(135deg, #0f172a, #1e3a5f);
//       display: flex; flex-direction: column; align-items: center; justify-content: center;
//       gap: 0;
//     }
//     .merit-score {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 14px; font-weight: 800;
//       color: #f0c040; line-height: 1;
//     }
//     .merit-pct {
//       font-size: 7px; font-weight: 600; color: rgba(240,192,64,0.7);
//     }
//     .merit-label {
//       font-size: 6.5px; font-weight: 700; letter-spacing: 2px;
//       color: rgba(255,255,255,0.5); text-transform: uppercase;
//     }

//     /* Left panel sig block */
//     .sig-block {
//       position: relative; z-index: 2;
//       display: flex; flex-direction: column; align-items: center; gap: 1mm;
//       width: 100%;
//     }
//     .sig-name {
//       font-family: 'Great Vibes', cursive;
//       font-size: 20px; color: #f0c040; line-height: 1;
//     }
//     .sig-line {
//       width: 36mm; height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(240,192,64,0.5), transparent);
//     }
//     .sig-role {
//       font-size: 6px; font-weight: 600; letter-spacing: 2px;
//       color: rgba(255,255,255,0.4); text-transform: uppercase;
//     }

//     /* ── Right content area ── */
//     .right-panel {
//       flex: 1;
//       display: flex; flex-direction: column;
//       padding: 9mm 10mm 7mm 10mm;
//       position: relative;
//       background: #ffffff;
//     }

//     /* Subtle background watermark pattern */
//     .right-panel::before {
//       content: '';
//       position: absolute; inset: 0;
//       background-image:
//         radial-gradient(circle at 85% 15%, rgba(15,23,42,0.03) 0%, transparent 50%),
//         radial-gradient(circle at 15% 85%, rgba(201,148,10,0.04) 0%, transparent 50%);
//       pointer-events: none;
//     }

//     /* Top bar: "certificate of completion" label */
//     .cert-label-row {
//       display: flex; align-items: center; gap: 3mm; margin-bottom: 5mm;
//     }
//     .cert-label-line {
//       flex: 1; height: 1px;
//       background: linear-gradient(90deg, #e2e8f0, transparent);
//     }
//     .cert-label-line.right {
//       background: linear-gradient(270deg, #e2e8f0, transparent);
//     }
//     .cert-label {
//       font-size: 7px; font-weight: 700; letter-spacing: 4px;
//       color: #94a3b8; text-transform: uppercase;
//       white-space: nowrap;
//     }

//     /* Presented to */
//     .presented-to {
//       font-family: 'Cormorant Garamond', serif;
//       font-size: 10px; font-weight: 400; font-style: italic;
//       color: #64748b; letter-spacing: 1px; margin-bottom: 1mm;
//     }

//     /* Student name */
//     .student-name {
//       font-family: 'Great Vibes', cursive;
//       font-size: 52px; color: #0f172a;
//       line-height: 1; margin-bottom: 3mm;
//       letter-spacing: 1px;
//     }

//     /* Divider with diamond */
//     .name-divider {
//       display: flex; align-items: center; gap: 3mm; margin-bottom: 4mm;
//     }
//     .ndiv-line {
//       flex: 1; height: 1px; background: #e2e8f0;
//     }
//     .ndiv-diamond {
//       width: 5px; height: 5px;
//       background: #c9940a;
//       transform: rotate(45deg);
//       flex-shrink: 0;
//     }

//     /* Body text */
//     .body-text {
//       font-family: 'Cormorant Garamond', serif;
//       font-size: 11px; font-weight: 400; color: #475569;
//       line-height: 1.6; margin-bottom: 3mm;
//     }
//     .body-text strong {
//       font-weight: 700; color: #0f172a;
//       font-style: italic;
//     }

//     /* Stats row */
//     .stats-row {
//       display: flex; gap: 3mm; margin-bottom: 5mm;
//     }
//     .stat-box {
//       flex: 1; border: 1px solid #e2e8f0; border-radius: 3px;
//       padding: 3mm 4mm;
//       background: #f8fafc;
//       display: flex; flex-direction: column; gap: 0.5mm;
//     }
//     .stat-box.highlight {
//       border-color: rgba(201,148,10,0.35);
//       background: linear-gradient(135deg, #fffbeb, #fef3c7);
//     }
//     .stat-lbl {
//       font-size: 6px; font-weight: 700; letter-spacing: 2px;
//       color: #94a3b8; text-transform: uppercase;
//     }
//     .stat-val {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 13px; font-weight: 800; color: #0f172a;
//     }
//     .stat-box.highlight .stat-val { color: #92400e; }
//     .grade-pill {
//       display: inline-block;
//       padding: 1px 8px; border-radius: 20px;
//       font-size: 9px; font-weight: 700; letter-spacing: 1px;
//       background: ${pillBg};
//       color: ${pillColor};
//       border: 1px solid ${pillBorder};
//     }

//     /* Bottom footer row */
//     .footer-row {
//       margin-top: auto;
//       display: flex; align-items: flex-end; justify-content: space-between;
//       border-top: 1px solid #f1f5f9; padding-top: 3mm;
//     }
//     .cert-id-block {
//       display: flex; flex-direction: column; gap: 0.5mm;
//     }
//     .cert-id-lbl {
//       font-size: 6px; font-weight: 700; letter-spacing: 2px;
//       color: #94a3b8; text-transform: uppercase;
//     }
//     .cert-id-val {
//       font-family: 'Montserrat', sans-serif;
//       font-size: 8px; font-weight: 600; color: #475569;
//       letter-spacing: 0.5px;
//     }
//     .verify-text {
//       font-size: 6px; color: #cbd5e1; font-style: italic; letter-spacing: 0.5px;
//     }

//     /* Watermark text behind content */
//     .watermark {
//       position: absolute;
//       bottom: 12mm; right: 8mm;
//       font-family: 'Montserrat', sans-serif;
//       font-size: 72px; font-weight: 900;
//       color: rgba(15,23,42,0.025);
//       letter-spacing: -2px;
//       pointer-events: none;
//       user-select: none;
//       line-height: 1;
//     }

//     @media print { html, body { background: #0f172a !important; } }
//   </style>
// </head>
// <body>
// <div class="page">

//   <!-- ── Left dark panel ── -->
//   <div class="left-panel">
//     <div class="circle-deco c1"></div>
//     <div class="circle-deco c2"></div>
//     <div class="circle-deco c3"></div>

//     <!-- Logo -->
//     <div class="logo-wrap">
//       <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <polygon points="20,3 37,35 3,35" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
//         <polygon points="20,3 37,35 3,35" fill="none" stroke="#f0c040" stroke-width="1.5" stroke-dasharray="60 100" stroke-dashoffset="-20"/>
//         <polygon points="24,3 37,35 20,35" fill="#f0c040" opacity="0.85"/>
//         <line x1="10" y1="27" x2="30" y2="27" stroke="#f0c040" stroke-width="2"/>
//       </svg>
//       <div class="logo-name">Axio<span>Quan</span></div>
//       <div class="logo-tagline">Learning Excellence Platform</div>
//     </div>

//     <!-- Score badge -->
//     <div class="merit-badge">
//       <div class="merit-circle">
//         <div class="merit-inner">
//           <div class="merit-score">${data.averageScore}</div>
//           <div class="merit-pct">SCORE %</div>
//         </div>
//       </div>
//       <div class="merit-label">${grade}</div>
//     </div>

//     <!-- Signature -->
//     <div class="sig-block">
//       <div class="sig-name">Alexander Cyril</div>
//       <div class="sig-line"></div>
//       <div class="sig-role">Training Director · AxioQuan</div>
//     </div>
//   </div>

//   <!-- ── Right content panel ── -->
//   <div class="right-panel">
//     <div class="watermark">AQ</div>

//     <!-- Top label -->
//     <div class="cert-label-row">
//       <div class="cert-label-line"></div>
//       <div class="cert-label">Certificate of Completion</div>
//       <div class="cert-label-line right"></div>
//     </div>

//     <!-- Recipient -->
//     <div class="presented-to">This certificate is proudly presented to</div>
//     <div class="student-name">${data.studentName}</div>

//     <div class="name-divider">
//       <div class="ndiv-line"></div>
//       <div class="ndiv-diamond"></div>
//       <div class="ndiv-line"></div>
//     </div>

//     <!-- Body -->
//     <div class="body-text">
//       Has successfully completed all requirements and demonstrated outstanding proficiency in<br/>
//       <strong>${data.courseTitle}</strong>
//     </div>

//     <!-- Stats -->
//     <div class="stats-row">
//       <div class="stat-box highlight">
//         <div class="stat-lbl">Final Score</div>
//         <div class="stat-val">${data.averageScore}%</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Achievement</div>
//         <div class="stat-val"><span class="grade-pill">${grade}</span></div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Completion Date</div>
//         <div class="stat-val" style="font-size:10px">${dateTaken}</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Status</div>
//         <div class="stat-val"><span class="grade-pill">${passedLabel}</span></div>
//       </div>
//     </div>

//     <!-- Footer -->
//     <div class="footer-row">
//       <div class="cert-id-block">
//         <div class="cert-id-lbl">Certificate ID</div>
//         <div class="cert-id-val">${certCode}</div>
//         <div class="verify-text">Verify at axioquan.com/verify</div>
//       </div>
//       <div style="text-align:right">
//         <div class="cert-id-lbl">Issued by</div>
//         <div class="cert-id-val">AxioQuan · Training &amp; Certification Division</div>
//       </div>
//     </div>
//   </div>

// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   useEffect(() => {
//     if (alreadyIssued === true) { setIssued(true); return; }
//     if (data.averageScore < 70) { setIssued(false); return; }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: { label: 'Yes, resend', onClick: () => doIssue(true) },
//           duration: 10000,
//         });
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(
//         result.wasForced
//           ? `Additional certificate issued for ${data.studentName}.`
//           : `Certificate issued for ${data.studentName}!`
//       );
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-40 cursor-not-allowed">
//         <Award className="h-3 w-3 shrink-0" /> Not Eligible
//       </span>
//     );
//   }

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin shrink-0" /> Checking...
//       </span>
//     );
//   }

//   // ── Already issued — Re-download + Issue Another stacked ─────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col items-end gap-1">
//         <button
//           onClick={handleRedownload}
//           className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight"
//         >
//           <Download className="h-3 w-3 shrink-0" />
//           Re-download{issuedCount > 1 ? ` (×${issuedCount})` : ''}
//         </button>
//         <button
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer leading-tight disabled:opacity-50"
//         >
//           {issuing
//             ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing…</>
//             : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
//           }
//         </button>
//       </div>
//     );
//   }

//   // ── Not yet issued — text-only link style ────────────────────────────────
//   return (
//     <button
//       onClick={() => doIssue(false)}
//       disabled={issuing}
//       className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight disabled:opacity-50"
//     >
//       {issuing
//         ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
//         : <><Award className="h-3 w-3 shrink-0" /> Issue Cert</>
//       }
//     </button>
//   );
// }




























// 'use client';
// // /src/components/dashboard/certificate-generator.tsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────

// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed      = isPassed(data.averageScore);
//   const dateTaken   = formatDate(data.completedDate);
//   const grade       = getGrade(data.averageScore);
//   // Pre-compute ALL conditionals outside the template literal
//   const passedLabel = passed ? 'PASSED' : 'FAILED';
//   const passedColor = passed ? '#4ade80' : '#f87171';
//   const scoreStr    = String(data.averageScore);
//   const nameStr     = String(data.studentName);
//   const titleStr    = String(data.courseTitle);
//   const codeStr     = String(certCode);

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <title>Certificate - ${nameStr}</title>
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;600;700;800;900&family=Great+Vibes&display=swap" rel="stylesheet"/>
// <style>
// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
// @page { size: A4 portrait; margin: 0; }
// html, body {
//   width: 210mm; height: 297mm; overflow: hidden;
//   -webkit-print-color-adjust: exact; print-color-adjust: exact;
// }
// body {
//   font-family: 'Montserrat', sans-serif;
//   background: #0d1b2e;
//   display: flex; align-items: center; justify-content: center;
// }

// .page {
//   width: 210mm; height: 297mm;
//   background: #0d1b2e;
//   position: relative; overflow: hidden;
//   display: flex; flex-direction: column; align-items: center;
// }

// /* ── Corner ornaments ── */
// .corner {
//   position: absolute;
//   width: 18mm; height: 18mm;
// }
// .corner svg { width: 100%; height: 100%; }
// .corner.tl { top: 6mm; left: 6mm; }
// .corner.tr { top: 6mm; right: 6mm; transform: scaleX(-1); }
// .corner.bl { bottom: 6mm; left: 6mm; transform: scaleY(-1); }
// .corner.br { bottom: 6mm; right: 6mm; transform: scale(-1); }

// /* ── Border frame ── */
// .frame-outer {
//   position: absolute;
//   top: 7mm; left: 7mm; right: 7mm; bottom: 7mm;
//   border: 1.5px solid rgba(201,148,10,0.35);
//   pointer-events: none;
// }
// .frame-inner {
//   position: absolute;
//   top: 9.5mm; left: 9.5mm; right: 9.5mm; bottom: 9.5mm;
//   border: 0.5px solid rgba(201,148,10,0.18);
//   pointer-events: none;
// }

// /* ── Subtle grid bg ── */
// .page::before {
//   content: '';
//   position: absolute; inset: 0;
//   background-image:
//     linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
//   background-size: 8mm 8mm;
//   pointer-events: none;
// }

// /* ── Radial glow ── */
// .page::after {
//   content: '';
//   position: absolute; inset: 0;
//   background: radial-gradient(ellipse at 50% 30%, rgba(201,148,10,0.07) 0%, transparent 65%);
//   pointer-events: none;
// }

// /* ── Content wrapper ── */
// .content {
//   position: relative; z-index: 2;
//   width: 100%; height: 100%;
//   display: flex; flex-direction: column; align-items: center;
//   padding: 16mm 14mm 10mm;
// }

// /* ── Logo badge ── */
// .logo-badge {
//   width: 18mm; height: 18mm; border-radius: 50%;
//   background: linear-gradient(135deg, #c9940a, #f0c040, #fff1a0, #c9940a);
//   display: flex; align-items: center; justify-content: center;
//   box-shadow: 0 0 0 2px rgba(201,148,10,0.25), 0 0 20px rgba(201,148,10,0.3), 0 4px 16px rgba(0,0,0,0.5);
//   margin-bottom: 3.5mm;
// }
// .logo-badge-inner {
//   width: 14mm; height: 14mm; border-radius: 50%;
//   background: #0d1b2e;
//   display: flex; align-items: center; justify-content: center;
// }
// .logo-badge-text {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 11px; font-weight: 900; color: #f0c040;
//   letter-spacing: 0.5px;
// }

// /* ── Brand name ── */
// .brand-name {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 14px; font-weight: 800; letter-spacing: 6px;
//   color: #ffffff; text-transform: uppercase;
//   margin-bottom: 1.5mm;
// }
// .brand-sub {
//   font-size: 7px; font-weight: 400; letter-spacing: 4px;
//   color: rgba(255,255,255,0.4); text-transform: uppercase;
//   margin-bottom: 5mm;
// }

// /* ── Top gold divider ── */
// .gold-rule {
//   width: 55mm; height: 1px;
//   background: linear-gradient(90deg, transparent, #c9940a, #f0c040, #c9940a, transparent);
//   margin-bottom: 5mm;
// }
// .gold-rule.short {
//   width: 30mm; margin-bottom: 4mm;
// }
// .gold-rule.full {
//   width: 80%; margin-bottom: 5mm; margin-top: 5mm;
// }

// /* ── Cert label ── */
// .cert-label {
//   font-size: 7.5px; font-weight: 600; letter-spacing: 5px;
//   color: rgba(255,255,255,0.45); text-transform: uppercase;
//   margin-bottom: 1.5mm;
// }

// /* ── Awarded to ── */
// .awarded-to {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 11px; font-style: italic;
//   color: rgba(255,255,255,0.5); letter-spacing: 1px;
//   margin-bottom: 2mm;
// }

// /* ── Recipient name ── */
// .recipient-name {
//   font-family: 'Great Vibes', cursive;
//   font-size: 52px; color: #ffffff;
//   line-height: 1.1; text-align: center;
//   text-shadow: 0 0 30px rgba(240,192,64,0.2);
//   margin-bottom: 4mm;
// }

// /* ── For completion of ── */
// .for-completion {
//   font-size: 7.5px; font-weight: 500; letter-spacing: 4px;
//   color: rgba(255,255,255,0.4); text-transform: uppercase;
//   margin-bottom: 2.5mm;
// }

// /* ── Course title ── */
// .course-title {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 16px; font-weight: 800;
//   color: #f0c040; letter-spacing: 1.5px;
//   text-transform: uppercase; text-align: center;
//   line-height: 1.3; margin-bottom: 0;
// }

// /* ── Stats boxes ── */
// .stats-row {
//   display: flex; gap: 4mm; width: 100%;
//   margin-bottom: 6mm;
// }
// .stat-box {
//   flex: 1;
//   border: 1px solid rgba(201,148,10,0.3);
//   border-radius: 2px;
//   padding: 4mm 3mm;
//   display: flex; flex-direction: column;
//   align-items: center; gap: 1.5mm;
//   background: rgba(255,255,255,0.03);
// }
// .stat-lbl {
//   font-size: 6px; font-weight: 700; letter-spacing: 2.5px;
//   color: rgba(255,255,255,0.35); text-transform: uppercase;
// }
// .stat-val {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 15px; font-weight: 800;
//   color: #ffffff; line-height: 1; text-align: center;
// }
// .stat-val.date-val {
//   font-size: 11px;
// }
// .stat-val.grade-val {
//   color: ${passedColor};
// }

// /* ── Body text ── */
// .body-text {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 10.5px; font-style: italic; font-weight: 400;
//   color: rgba(255,255,255,0.5);
//   text-align: center; line-height: 1.7;
//   max-width: 130mm;
//   margin-bottom: 0;
// }

// /* ── Signatures ── */
// .sigs-row {
//   display: flex; justify-content: space-between;
//   width: 100%; margin-top: auto; padding-top: 6mm;
// }
// .sig-block {
//   display: flex; flex-direction: column; align-items: center; gap: 1mm;
//   width: 52mm;
// }
// .sig-name {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 8.5px; font-weight: 700; letter-spacing: 1px;
//   color: #ffffff; text-transform: uppercase;
// }
// .sig-line {
//   width: 36mm; height: 1px;
//   background: linear-gradient(90deg, transparent, rgba(201,148,10,0.6), transparent);
// }
// .sig-role {
//   font-size: 6.5px; font-weight: 400; letter-spacing: 0.5px;
//   color: rgba(255,255,255,0.35);
// }

// /* ── Footer cert ID ── */
// .cert-footer {
//   margin-top: 5mm;
//   font-size: 6.5px; font-weight: 500; letter-spacing: 2.5px;
//   color: rgba(255,255,255,0.3); text-transform: uppercase;
//   text-align: center;
// }
// .cert-footer span { color: rgba(201,148,10,0.7); }

// /* ── Dot ornament ── */
// .dot-ornament {
//   width: 2mm; height: 2mm; border-radius: 50%;
//   background: #c9940a;
//   margin: 4mm 0;
//   box-shadow: 0 0 6px rgba(201,148,10,0.6);
// }

// @media print { html, body { background: #0d1b2e !important; } }
// </style>
// </head>
// <body>
// <div class="page">

//   <!-- Frame borders -->
//   <div class="frame-outer"></div>
//   <div class="frame-inner"></div>

//   <!-- Corner ornaments -->
//   <div class="corner tl">
//     <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.5" fill="none" opacity="0.7"/>
//       <path d="M2 38 L2 2 L38 2" stroke="#f0c040" stroke-width="0.5" fill="none" opacity="0.4"/>
//       <circle cx="2" cy="2" r="3" fill="#c9940a" opacity="0.8"/>
//     </svg>
//   </div>
//   <div class="corner tr">
//     <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.5" fill="none" opacity="0.7"/>
//       <path d="M2 38 L2 2 L38 2" stroke="#f0c040" stroke-width="0.5" fill="none" opacity="0.4"/>
//       <circle cx="2" cy="2" r="3" fill="#c9940a" opacity="0.8"/>
//     </svg>
//   </div>
//   <div class="corner bl">
//     <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.5" fill="none" opacity="0.7"/>
//       <path d="M2 38 L2 2 L38 2" stroke="#f0c040" stroke-width="0.5" fill="none" opacity="0.4"/>
//       <circle cx="2" cy="2" r="3" fill="#c9940a" opacity="0.8"/>
//     </svg>
//   </div>
//   <div class="corner br">
//     <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.5" fill="none" opacity="0.7"/>
//       <path d="M2 38 L2 2 L38 2" stroke="#f0c040" stroke-width="0.5" fill="none" opacity="0.4"/>
//       <circle cx="2" cy="2" r="3" fill="#c9940a" opacity="0.8"/>
//     </svg>
//   </div>

//   <!-- Content -->
//   <div class="content">

//     <!-- Logo -->
//     <div class="logo-badge">
//       <div class="logo-badge-inner">
//         <div class="logo-badge-text">AQ</div>
//       </div>
//     </div>

//     <div class="brand-name">AxioQuan</div>
//     <div class="brand-sub">Learning Excellence</div>

//     <div class="gold-rule"></div>

//     <div class="cert-label">Certificate of Completion</div>
//     <div class="awarded-to">This certifies that</div>

//     <div class="recipient-name">${nameStr}</div>

//     <div class="for-completion">For successful completion of</div>
//     <div class="course-title">${titleStr}</div>

//     <div class="gold-rule full"></div>

//     <!-- Stats -->
//     <div class="stats-row">
//       <div class="stat-box">
//         <div class="stat-lbl">Date Completed</div>
//         <div class="stat-val date-val">${dateTaken}</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Avg Score</div>
//         <div class="stat-val">${scoreStr}%</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Grade</div>
//         <div class="stat-val grade-val">${passedLabel}</div>
//       </div>
//     </div>

//     <!-- Body text -->
//     <div class="body-text">
//       This certificate is awarded in recognition of demonstrated proficiency and
//       commitment to mastering the subject through rigorous assessment and evaluation.
//     </div>

//     <div class="dot-ornament"></div>

//     <!-- Signatures -->
//     <div class="sigs-row">
//       <div class="sig-block">
//         <div class="sig-name">Dr. James Owusu</div>
//         <div class="sig-line"></div>
//         <div class="sig-role">Chief Academic Officer</div>
//       </div>
//       <div class="sig-block">
//         <div class="sig-name">Dr. Nadia Voss</div>
//         <div class="sig-line"></div>
//         <div class="sig-role">Course Director</div>
//       </div>
//     </div>

//     <!-- Cert ID footer -->
//     <div class="cert-footer">
//       Certificate ID: <span>${codeStr}</span> &nbsp;·&nbsp; Verified
//     </div>

//   </div>
// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }

// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   useEffect(() => {
//     if (alreadyIssued === true) { setIssued(true); return; }
//     if (data.averageScore < 70) { setIssued(false); return; }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: { label: 'Yes, resend', onClick: () => doIssue(true) },
//           duration: 10000,
//         });
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(
//         result.wasForced
//           ? `Additional certificate issued for ${data.studentName}.`
//           : `Certificate issued for ${data.studentName}!`
//       );
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-40 cursor-not-allowed">
//         <Award className="h-3 w-3 shrink-0" /> Not Eligible
//       </span>
//     );
//   }

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin shrink-0" /> Checking...
//       </span>
//     );
//   }

//   // ── Already issued — Re-download + Issue Another stacked ─────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col items-end gap-1">
//         <button
//           onClick={handleRedownload}
//           className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight"
//         >
//           <Download className="h-3 w-3 shrink-0" />
//           Re-download{issuedCount > 1 ? ` (x${issuedCount})` : ''}
//         </button>
//         <button
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer leading-tight disabled:opacity-50"
//         >
//           {issuing
//             ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
//             : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
//           }
//         </button>
//       </div>
//     );
//   }

//   // ── Not yet issued ────────────────────────────────────────────────────────
//   return (
//     <button
//       onClick={() => doIssue(false)}
//       disabled={issuing}
//       className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight disabled:opacity-50"
//     >
//       {issuing
//         ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
//         : <><Award className="h-3 w-3 shrink-0" /> Issue Cert</>
//       }
//     </button>
//   );
// }

































// 'use client';
// // /src/components/dashboard/certificate-generator.tsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Award, Download, Loader2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface CertificateData {
//   studentId: string;
//   studentName: string;
//   courseTitle: string;
//   averageScore: number;
//   assessmentId: string;
//   courseId: string;
//   completedDate: string;
// }

// interface Props {
//   data: CertificateData;
//   onIssued?: (certCode: string, isReissue: boolean) => void;
//   alreadyIssued?: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// export function getGrade(score: number): string {
//   if (score >= 90) return 'DISTINCTION';
//   if (score >= 80) return 'MERIT';
//   if (score >= 70) return 'PASS';
//   return 'FAIL';
// }

// function isPassed(score: number): boolean {
//   return score >= 70;
// }

// function formatDate(dateStr: string): string {
//   try {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//     });
//   } catch { return dateStr; }
// }

// // ─── Certificate HTML ─────────────────────────────────────────────────────────


// export function buildCertHTML(data: CertificateData, certCode: string): string {
//   const passed      = isPassed(data.averageScore);
//   const dateTaken   = formatDate(data.completedDate);
//   const grade       = getGrade(data.averageScore);
//   const passedLabel = passed ? 'PASSED' : 'FAILED';
//   const passedColor = passed ? '#4ade80' : '#f87171';
//   const scoreStr    = String(data.averageScore);
//   const nameStr     = String(data.studentName);
//   const titleStr    = String(data.courseTitle);
//   const codeStr     = String(certCode);

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <title>Certificate - ${nameStr}</title>
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;600;700;800;900&family=Great+Vibes&display=swap" rel="stylesheet"/>
// <style>
// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
// @page { size: A4 landscape; margin: 0; }
// html, body {
//   width: 297mm; height: 210mm; overflow: hidden;
//   -webkit-print-color-adjust: exact; print-color-adjust: exact;
// }
// body {
//   font-family: 'Montserrat', sans-serif;
//   background: #0d1b2e;
//   display: flex; align-items: center; justify-content: center;
// }

// /* ── Page ── */
// .page {
//   width: 297mm; height: 210mm;
//   background: #0d1b2e;
//   position: relative; overflow: hidden;
//   display: flex; flex-direction: column; align-items: center;
//   justify-content: center;
// }

// /* ── Subtle grid background ── */
// .page::before {
//   content: '';
//   position: absolute; inset: 0;
//   background-image:
//     linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
//   background-size: 10mm 10mm;
//   pointer-events: none;
// }

// /* ── Gold radial glow centre ── */
// .page::after {
//   content: '';
//   position: absolute; inset: 0;
//   background: radial-gradient(ellipse at 50% 42%, rgba(201,148,10,0.09) 0%, transparent 62%);
//   pointer-events: none;
// }

// /* ── Outer + inner border frames ── */
// .frame-outer {
//   position: absolute;
//   top: 7mm; left: 7mm; right: 7mm; bottom: 7mm;
//   border: 1.5px solid rgba(201,148,10,0.4);
//   pointer-events: none; z-index: 3;
// }
// .frame-inner {
//   position: absolute;
//   top: 10mm; left: 10mm; right: 10mm; bottom: 10mm;
//   border: 0.5px solid rgba(201,148,10,0.18);
//   pointer-events: none; z-index: 3;
// }

// /* ── Corner ornaments ── */
// .corner {
//   position: absolute; width: 16mm; height: 16mm; z-index: 4;
// }
// .corner svg { width: 100%; height: 100%; }
// .corner.tl { top: 5mm;  left: 5mm; }
// .corner.tr { top: 5mm;  right: 5mm;  transform: scaleX(-1); }
// .corner.bl { bottom: 5mm; left: 5mm;  transform: scaleY(-1); }
// .corner.br { bottom: 5mm; right: 5mm; transform: scale(-1); }

// /* ── Main content wrapper ── */
// .content {
//   position: relative; z-index: 2;
//   width: 100%; height: 100%;
//   display: flex; flex-direction: column;
//   align-items: center; justify-content: center;
//   padding: 15mm 20mm 12mm;
//   gap: 0;
// }

// /* ── Logo: black rounded square with A ── */
// .logo-wrap {
//   display: flex; flex-direction: column; align-items: center;
//   gap: 2.5mm; margin-bottom: 3mm;
// }
// .logo-box {
//   width: 13mm; height: 13mm;
//   background: #000000;
//   border-radius: 3mm;
//   display: flex; align-items: center; justify-content: center;
//   box-shadow: 0 0 14px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,148,10,0.25);
// }
// .logo-letter {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 22px; font-weight: 900;
//   color: #ffffff; line-height: 1;
// }
// .brand-name {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 11px; font-weight: 800; letter-spacing: 5px;
//   color: #ffffff; text-transform: uppercase;
// }
// .brand-sub {
//   font-size: 6px; font-weight: 400; letter-spacing: 3.5px;
//   color: rgba(255,255,255,0.38); text-transform: uppercase;
// }

// /* ── Gold rule ── */
// .gold-rule {
//   height: 1px; width: 50mm;
//   background: linear-gradient(90deg, transparent, #c9940a, #f0c040, #c9940a, transparent);
//   margin: 3.5mm 0;
// }
// .gold-rule.wide { width: 200mm; }

// /* ── Cert label ── */
// .cert-label {
//   font-size: 6.5px; font-weight: 600; letter-spacing: 5px;
//   color: rgba(255,255,255,0.38); text-transform: uppercase;
//   margin-bottom: 1mm;
// }

// /* ── Awarded to ── */
// .awarded-to {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 10.5px; font-style: italic;
//   color: rgba(255,255,255,0.48); letter-spacing: 0.5px;
//   margin-bottom: 1.5mm;
// }

// /* ── Recipient name ── */
// .recipient-name {
//   font-family: 'Great Vibes', cursive;
//   font-size: 46px; color: #ffffff;
//   line-height: 1.1; text-align: center;
//   text-shadow: 0 0 28px rgba(240,192,64,0.18);
//   margin-bottom: 2mm;
// }

// /* ── Course block ── */
// .for-completion {
//   font-size: 7px; font-weight: 500; letter-spacing: 4px;
//   color: rgba(255,255,255,0.35); text-transform: uppercase;
//   margin-bottom: 1.5mm;
// }
// .course-title {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 13px; font-weight: 800; letter-spacing: 2px;
//   color: #f0c040; text-transform: uppercase; text-align: center;
//   line-height: 1.3; margin-bottom: 0;
// }

// /* ── Wide divider before stats ── */
// .wide-divider {
//   width: 100%; height: 1px; margin: 4mm 0;
//   background: linear-gradient(90deg, transparent, rgba(201,148,10,0.35), rgba(240,192,64,0.5), rgba(201,148,10,0.35), transparent);
// }

// /* ── Stats row ── */
// .stats-row {
//   display: flex; gap: 5mm; width: 100%;
//   margin-bottom: 4.5mm;
// }
// .stat-box {
//   flex: 1;
//   border: 1px solid rgba(201,148,10,0.28);
//   border-radius: 2px;
//   padding: 3.5mm 4mm;
//   display: flex; flex-direction: column;
//   align-items: center; gap: 1.5mm;
//   background: rgba(255,255,255,0.025);
// }
// .stat-lbl {
//   font-size: 5.5px; font-weight: 700; letter-spacing: 2.5px;
//   color: rgba(255,255,255,0.32); text-transform: uppercase;
// }
// .stat-val {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 14px; font-weight: 800;
//   color: #ffffff; line-height: 1; text-align: center;
// }
// .stat-val.date-val { font-size: 10.5px; }
// .stat-val.grade-val { color: ${passedColor}; }

// /* ── Body italic text ── */
// .body-text {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: 10px; font-style: italic;
//   color: rgba(255,255,255,0.42);
//   text-align: center; line-height: 1.75;
//   max-width: 180mm;
//   margin-bottom: 0;
// }

// /* ── Signatures row ── */
// .sigs-row {
//   display: flex; justify-content: space-between; align-items: flex-end;
//   width: 100%; margin-top: 5mm;
// }
// .sig-block {
//   display: flex; flex-direction: column; align-items: center; gap: 1.5mm;
//   width: 60mm;
// }
// .sig-name {
//   font-family: 'Montserrat', sans-serif;
//   font-size: 8px; font-weight: 700; letter-spacing: 1px;
//   color: #ffffff; text-transform: uppercase;
// }
// .sig-line {
//   width: 40mm; height: 1px;
//   background: linear-gradient(90deg, transparent, rgba(201,148,10,0.55), transparent);
// }
// .sig-role {
//   font-size: 6px; color: rgba(255,255,255,0.32); letter-spacing: 0.5px;
// }

// /* ── Dot ornament ── */
// .dot {
//   width: 1.8mm; height: 1.8mm; border-radius: 50%;
//   background: #c9940a;
//   box-shadow: 0 0 5px rgba(201,148,10,0.7);
//   margin: 0 auto;
// }

// /* ── Cert footer ── */
// .cert-footer {
//   font-size: 6px; font-weight: 500; letter-spacing: 2.5px;
//   color: rgba(255,255,255,0.28); text-transform: uppercase;
//   text-align: center; margin-top: 2.5mm;
// }
// .cert-footer span { color: rgba(201,148,10,0.65); }

// @media print { html, body { background: #0d1b2e !important; } }
// </style>
// </head>
// <body>
// <div class="page">
//   <div class="frame-outer"></div>
//   <div class="frame-inner"></div>

//   <!-- Corner ornaments -->
//   <div class="corner tl"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>
//   <div class="corner tr"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>
//   <div class="corner bl"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>
//   <div class="corner br"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>

//   <div class="content">

//     <!-- Logo -->
//     <div class="logo-wrap">
//       <div class="logo-box">
//         <div class="logo-letter">A</div>
//       </div>
//       <div class="brand-name">AxioQuan</div>
//       <div class="brand-sub">Learning Excellence</div>
//     </div>

//     <div class="gold-rule"></div>

//     <div class="cert-label">Certificate of Completion</div>
//     <div class="awarded-to">This certifies that</div>

//     <div class="recipient-name">${nameStr}</div>

//     <div class="for-completion">For successful completion of</div>
//     <div class="course-title">${titleStr}</div>

//     <div class="wide-divider"></div>

//     <!-- Stats -->
//     <div class="stats-row">
//       <div class="stat-box">
//         <div class="stat-lbl">Date Completed</div>
//         <div class="stat-val date-val">${dateTaken}</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Avg Score</div>
//         <div class="stat-val">${scoreStr}%</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Grade</div>
//         <div class="stat-val">${grade}</div>
//       </div>
//       <div class="stat-box">
//         <div class="stat-lbl">Status</div>
//         <div class="stat-val grade-val">${passedLabel}</div>
//       </div>
//     </div>

//     <!-- Body text -->
//     <div class="body-text">
//       This certificate is awarded in recognition of demonstrated proficiency and commitment to mastering
//       the subject through rigorous assessment and evaluation by the AxioQuan certification board.
//     </div>

//     <div class="dot" style="margin-top:3.5mm;margin-bottom:0;"></div>

//     <!-- Signatures -->
//     <div class="sigs-row">
//       <div class="sig-block">
//         <div class="sig-name">Dr. James Owusu</div>
//         <div class="sig-line"></div>
//         <div class="sig-role">Chief Academic Officer</div>
//       </div>
//       <div class="cert-footer" style="margin-top:0;">
//         Certificate ID: <span>${codeStr}</span><br/>Verified · AxioQuan
//       </div>
//       <div class="sig-block">
//         <div class="sig-name">Dr. Nadia Voss</div>
//         <div class="sig-line"></div>
//         <div class="sig-role">Course Director</div>
//       </div>
//     </div>

//   </div>
// </div>
// <script>
//   document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
// </script>
// </body>
// </html>`;
// }


// function openCertPrintWindow(html: string): void {
//   const w = window.open('', '_blank');
//   if (w) { w.document.write(html); w.document.close(); w.focus(); }
// }

// // ─── React component ──────────────────────────────────────────────────────────

// export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
//   const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [latestCode, setLatestCode] = useState<string | null>(null);
//   const [issuing, setIssuing] = useState(false);

//   useEffect(() => {
//     if (alreadyIssued === true) { setIssued(true); return; }
//     if (data.averageScore < 70) { setIssued(false); return; }

//     let cancelled = false;
//     fetch(
//       `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
//     )
//       .then(r => r.json())
//       .then(json => {
//         if (cancelled) return;
//         setIssued(json.issued ?? false);
//         setIssuedCount(json.issuedCount ?? 0);
//         setLatestCode(json.latestCertCode ?? null);
//       })
//       .catch(() => { if (!cancelled) setIssued(false); });

//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.studentId, data.assessmentId]);

//   const doIssue = async (force: boolean) => {
//     setIssuing(true);
//     try {
//       const res = await fetch('/api/certificates/issue', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           student_id:    data.studentId,
//           course_id:     data.courseId,
//           assessment_id: data.assessmentId,
//           student_name:  data.studentName,
//           course_title:  data.courseTitle,
//           overall_score: data.averageScore,
//           final_grade:   getGrade(data.averageScore),
//           force,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || 'Failed to issue certificate');
//         return;
//       }

//       if (result.alreadyIssued) {
//         const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
//         const issued_date = result.latestIssuedAt
//           ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//           : 'previously';
//         toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
//           description: 'Would you like to issue another one?',
//           action: { label: 'Yes, resend', onClick: () => doIssue(true) },
//           duration: 10000,
//         });
//         return;
//       }

//       const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//       setLatestCode(code);
//       setIssued(true);
//       setIssuedCount(prev => prev + 1);
//       openCertPrintWindow(buildCertHTML(data, code));
//       toast.success(
//         result.wasForced
//           ? `Additional certificate issued for ${data.studentName}.`
//           : `Certificate issued for ${data.studentName}!`
//       );
//       onIssued?.(code, result.wasForced ?? false);

//     } catch {
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIssuing(false);
//     }
//   };

//   const handleRedownload = () => {
//     const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
//     openCertPrintWindow(buildCertHTML(data, code));
//   };

//   // ── Not eligible ──────────────────────────────────────────────────────────
//   if (data.averageScore < 70) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-40 cursor-not-allowed">
//         <Award className="h-3 w-3 shrink-0" /> Not Eligible
//       </span>
//     );
//   }

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (issued === null) {
//     return (
//       <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
//         <Loader2 className="h-3 w-3 animate-spin shrink-0" /> Checking...
//       </span>
//     );
//   }

//   // ── Already issued — Re-download + Issue Another stacked ─────────────────
//   if (issued) {
//     return (
//       <div className="flex flex-col items-end gap-1">
//         <button
//           onClick={handleRedownload}
//           className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight"
//         >
//           <Download className="h-3 w-3 shrink-0" />
//           Re-download{issuedCount > 1 ? ` (x${issuedCount})` : ''}
//         </button>
//         <button
//           onClick={() => doIssue(false)}
//           disabled={issuing}
//           className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer leading-tight disabled:opacity-50"
//         >
//           {issuing
//             ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
//             : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
//           }
//         </button>
//       </div>
//     );
//   }

//   // ── Not yet issued ────────────────────────────────────────────────────────
//   return (
//     <button
//       onClick={() => doIssue(false)}
//       disabled={issuing}
//       className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight disabled:opacity-50"
//     >
//       {issuing
//         ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
//         : <><Award className="h-3 w-3 shrink-0" /> Issue Cert</>
//       }
//     </button>
//   );
// }
































'use client';
// /src/components/dashboard/certificate-generator.tsx

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Award, Download, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CertificateData {
  studentId: string;
  studentName: string;
  courseTitle: string;
  averageScore: number;
  assessmentId: string;
  courseId: string;
  completedDate: string;
}

interface Props {
  data: CertificateData;
  onIssued?: (certCode: string, isReissue: boolean) => void;
  alreadyIssued?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getGrade(score: number): string {
  if (score >= 90) return 'DISTINCTION';
  if (score >= 80) return 'MERIT';
  if (score >= 70) return 'PASS';
  return 'FAIL';
}

function isPassed(score: number): boolean {
  return score >= 70;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return dateStr; }
}

// ─── Certificate HTML ─────────────────────────────────────────────────────────


export function buildCertHTML(data: CertificateData, certCode: string): string {
  const passed      = isPassed(data.averageScore);
  const dateTaken   = formatDate(data.completedDate);
  const grade       = getGrade(data.averageScore);
  const passedLabel = passed ? 'PASSED' : 'FAILED';
  const passedColor = passed ? '#4ade80' : '#f87171';
  const scoreStr    = String(data.averageScore);
  const nameStr     = String(data.studentName);
  const titleStr    = String(data.courseTitle);
  const codeStr     = String(certCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate - ${nameStr}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;600;700;800;900&family=Great+Vibes&display=swap" rel="stylesheet"/>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@page { size: A4 landscape; margin: 0; }
html, body {
  width: 297mm; height: 210mm; overflow: hidden;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
body {
  font-family: 'Montserrat', sans-serif;
  background: #0d1b2e;
  display: flex; align-items: center; justify-content: center;
}

/* ── Page ── */
.page {
  width: 297mm; height: 210mm;
  background: #0d1b2e;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center;
}

/* ── Subtle grid background ── */
.page::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
  background-size: 10mm 10mm;
  pointer-events: none;
}

/* ── Gold radial glow centre ── */
.page::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 42%, rgba(201,148,10,0.09) 0%, transparent 62%);
  pointer-events: none;
}

/* ── Outer + inner border frames ── */
.frame-outer {
  position: absolute;
  top: 7mm; left: 7mm; right: 7mm; bottom: 7mm;
  border: 1.5px solid rgba(201,148,10,0.4);
  pointer-events: none; z-index: 3;
}
.frame-inner {
  position: absolute;
  top: 10mm; left: 10mm; right: 10mm; bottom: 10mm;
  border: 0.5px solid rgba(201,148,10,0.18);
  pointer-events: none; z-index: 3;
}

/* ── Corner ornaments ── */
.corner {
  position: absolute; width: 16mm; height: 16mm; z-index: 4;
}
.corner svg { width: 100%; height: 100%; }
.corner.tl { top: 5mm;  left: 5mm; }
.corner.tr { top: 5mm;  right: 5mm;  transform: scaleX(-1); }
.corner.bl { bottom: 5mm; left: 5mm;  transform: scaleY(-1); }
.corner.br { bottom: 5mm; right: 5mm; transform: scale(-1); }

/* ── Main content wrapper ── */
.content {
  position: relative; z-index: 2;
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 15mm 20mm 12mm;
  gap: 0;
}

/* ── Logo: black rounded square with A ── */
.logo-wrap {
  display: flex; flex-direction: column; align-items: center;
  gap: 2.5mm; margin-bottom: 3mm;
}
.logo-box {
  width: 13mm; height: 13mm;
  background: #000000;
  border-radius: 3mm;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 14px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,148,10,0.25);
}
.logo-letter {
  font-family: 'Montserrat', sans-serif;
  font-size: 22px; font-weight: 900;
  color: #ffffff; line-height: 1;
}
.brand-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 800; letter-spacing: 5px;
  color: #ffffff; text-transform: uppercase;
}
.brand-sub {
  font-size: 6px; font-weight: 400; letter-spacing: 3.5px;
  color: rgba(255,255,255,0.38); text-transform: uppercase;
}

/* ── Gold rule ── */
.gold-rule {
  height: 1px; width: 50mm;
  background: linear-gradient(90deg, transparent, #c9940a, #f0c040, #c9940a, transparent);
  margin: 3.5mm 0;
}
.gold-rule.wide { width: 200mm; }

/* ── Cert label ── */
.cert-label {
  font-size: 6.5px; font-weight: 600; letter-spacing: 5px;
  color: rgba(255,255,255,0.38); text-transform: uppercase;
  margin-bottom: 1mm;
}

/* ── Awarded to ── */
.awarded-to {
  font-family: 'Cormorant Garamond', serif;
  font-size: 10.5px; font-style: italic;
  color: rgba(255,255,255,0.48); letter-spacing: 0.5px;
  margin-bottom: 1.5mm;
}

/* ── Recipient name ── */
.recipient-name {
  font-family: 'Great Vibes', cursive;
  font-size: 46px; color: #ffffff;
  line-height: 1.1; text-align: center;
  text-shadow: 0 0 28px rgba(240,192,64,0.18);
  margin-bottom: 2mm;
}

/* ── Course block ── */
.for-completion {
  font-size: 7px; font-weight: 500; letter-spacing: 4px;
  color: rgba(255,255,255,0.35); text-transform: uppercase;
  margin-bottom: 1.5mm;
}
.course-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; font-weight: 800; letter-spacing: 2px;
  color: #f0c040; text-transform: uppercase; text-align: center;
  line-height: 1.3; margin-bottom: 0;
}

/* ── Wide divider before stats ── */
.wide-divider {
  width: 100%; height: 1px; margin: 4mm 0;
  background: linear-gradient(90deg, transparent, rgba(201,148,10,0.35), rgba(240,192,64,0.5), rgba(201,148,10,0.35), transparent);
}

/* ── Stats row ── */
.stats-row {
  display: flex; gap: 5mm; width: 100%;
  margin-bottom: 4.5mm;
}
.stat-box {
  flex: 1;
  border: 1px solid rgba(201,148,10,0.28);
  border-radius: 2px;
  padding: 3.5mm 4mm;
  display: flex; flex-direction: column;
  align-items: center; gap: 1.5mm;
  background: rgba(255,255,255,0.025);
}
.stat-lbl {
  font-size: 5.5px; font-weight: 700; letter-spacing: 2.5px;
  color: rgba(255,255,255,0.32); text-transform: uppercase;
}
.stat-val {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px; font-weight: 800;
  color: #ffffff; line-height: 1; text-align: center;
}
.stat-val.date-val { font-size: 10.5px; }
.stat-val.grade-val { color: ${passedColor}; }

/* ── Body italic text ── */
.body-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 10px; font-style: italic;
  color: rgba(255,255,255,0.42);
  text-align: center; line-height: 1.75;
  max-width: 180mm;
  margin-bottom: 0;
}

/* ── Signatures row ── */
.sigs-row {
  display: flex; justify-content: space-between; align-items: flex-end;
  width: 100%; margin-top: 5mm;
}
.sig-block {
  display: flex; flex-direction: column; align-items: center; gap: 1.5mm;
  width: 60mm;
}
.sig-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 8px; font-weight: 700; letter-spacing: 1px;
  color: #ffffff; text-transform: uppercase;
}
.sig-line {
  width: 40mm; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,148,10,0.55), transparent);
}
.sig-role {
  font-size: 6px; color: rgba(255,255,255,0.32); letter-spacing: 0.5px;
}

/* ── Dot ornament ── */
.dot {
  width: 1.8mm; height: 1.8mm; border-radius: 50%;
  background: #c9940a;
  box-shadow: 0 0 5px rgba(201,148,10,0.7);
  margin: 0 auto;
}

/* ── Cert footer ── */
.cert-footer {
  font-size: 6px; font-weight: 500; letter-spacing: 2.5px;
  color: rgba(255,255,255,0.28); text-transform: uppercase;
  text-align: center; margin-top: 2.5mm;
}
.cert-footer span { color: rgba(201,148,10,0.65); }

@media print { html, body { background: #0d1b2e !important; } }
</style>
</head>
<body>
<div class="page">
  <div class="frame-outer"></div>
  <div class="frame-inner"></div>

  <!-- Corner ornaments -->
  <div class="corner tl"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 60 60" fill="none"><path d="M2 58 L2 2 L58 2" stroke="#c9940a" stroke-width="1.8" fill="none" opacity="0.7"/><path d="M2 42 L2 2 L42 2" stroke="#f0c040" stroke-width="0.6" fill="none" opacity="0.35"/><circle cx="2" cy="2" r="2.5" fill="#c9940a" opacity="0.9"/></svg></div>

  <div class="content">

    <!-- Logo -->
    <div class="logo-wrap">
      <div class="logo-box">
        <div class="logo-letter">A</div>
      </div>
      <div class="brand-name">AxioQuan</div>
      <div class="brand-sub">Learning Excellence</div>
    </div>

    <div class="gold-rule"></div>

    <div class="cert-label">Certificate of Completion</div>
    <div class="awarded-to">This certifies that</div>

    <div class="recipient-name">${nameStr}</div>

    <div style="margin-top:4mm;"></div>
    <div class="for-completion">For successful completion of</div>
    <div class="course-title">${titleStr}</div>

    <div class="wide-divider"></div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-lbl">Date Completed</div>
        <div class="stat-val date-val">${dateTaken}</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">Avg Score</div>
        <div class="stat-val">${scoreStr}%</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">Grade</div>
        <div class="stat-val">${grade}</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">Status</div>
        <div class="stat-val grade-val">${passedLabel}</div>
      </div>
    </div>

    <!-- Body text -->
    <div class="body-text">
      This certificate is awarded in recognition of demonstrated proficiency and commitment to mastering
      the subject through rigorous assessment and evaluation by the AxioQuan certification board.
    </div>

    <div class="dot" style="margin-top:3.5mm;margin-bottom:0;"></div>

    <!-- Single signature — centred -->
    <div style="margin-top:5mm; display:flex; flex-direction:column; align-items:center; gap:1.5mm;">
      <div style="font-family:'Great Vibes',cursive; font-size:32px; color:#f0c040; line-height:1; text-shadow:0 0 12px rgba(240,192,64,0.25);">Alexander Cyril</div>
      <div style="width:52mm; height:1px; background:linear-gradient(90deg,transparent,rgba(201,148,10,0.55),transparent);"></div>
      <div style="font-size:6px; font-weight:600; letter-spacing:2px; color:rgba(255,255,255,0.32); text-transform:uppercase;">Training Director · AxioQuan</div>
    </div>

    <!-- Cert ID footer -->
    <div class="cert-footer" style="margin-top:4mm;">
      Certificate ID: <span>${codeStr}</span> &nbsp;·&nbsp; Verified · AxioQuan
    </div>

  </div>
</div>
<script>
  document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });
</script>
</body>
</html>`;
}


function openCertPrintWindow(html: string): void {
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.focus(); }
}

// ─── React component ──────────────────────────────────────────────────────────

export function CertificateGenerator({ data, onIssued, alreadyIssued }: Props) {
  const [issued, setIssued] = useState<boolean | null>(alreadyIssued === true ? true : null);
  const [issuedCount, setIssuedCount] = useState(0);
  const [latestCode, setLatestCode] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    if (alreadyIssued === true) { setIssued(true); return; }
    if (data.averageScore < 70) { setIssued(false); return; }

    let cancelled = false;
    fetch(
      `/api/certificates/issue?student_id=${encodeURIComponent(data.studentId)}&assessment_id=${encodeURIComponent(data.assessmentId)}`
    )
      .then(r => r.json())
      .then(json => {
        if (cancelled) return;
        setIssued(json.issued ?? false);
        setIssuedCount(json.issuedCount ?? 0);
        setLatestCode(json.latestCertCode ?? null);
      })
      .catch(() => { if (!cancelled) setIssued(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.studentId, data.assessmentId]);

  const doIssue = async (force: boolean) => {
    setIssuing(true);
    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id:    data.studentId,
          course_id:     data.courseId,
          assessment_id: data.assessmentId,
          student_name:  data.studentName,
          course_title:  data.courseTitle,
          overall_score: data.averageScore,
          final_grade:   getGrade(data.averageScore),
          force,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Failed to issue certificate');
        return;
      }

      if (result.alreadyIssued) {
        const times = result.issuedCount === 1 ? 'once' : `${result.issuedCount} times`;
        const issued_date = result.latestIssuedAt
          ? new Date(result.latestIssuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'previously';
        toast(`${data.studentName} already received a certificate ${times} (last: ${issued_date}).`, {
          description: 'Would you like to issue another one?',
          action: { label: 'Yes, resend', onClick: () => doIssue(true) },
          duration: 10000,
        });
        return;
      }

      const code = result.certificate?.certificate_code ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
      setLatestCode(code);
      setIssued(true);
      setIssuedCount(prev => prev + 1);
      openCertPrintWindow(buildCertHTML(data, code));
      toast.success(
        result.wasForced
          ? `Additional certificate issued for ${data.studentName}.`
          : `Certificate issued for ${data.studentName}!`
      );
      onIssued?.(code, result.wasForced ?? false);

    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIssuing(false);
    }
  };

  const handleRedownload = () => {
    const code = latestCode ?? `AXQ-${Date.now().toString(36).toUpperCase()}`;
    openCertPrintWindow(buildCertHTML(data, code));
  };

  // ── Not eligible ──────────────────────────────────────────────────────────
  if (data.averageScore < 70) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-40 cursor-not-allowed">
        <Award className="h-3 w-3 shrink-0" /> Not Eligible
      </span>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (issued === null) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground opacity-60">
        <Loader2 className="h-3 w-3 animate-spin shrink-0" /> Checking...
      </span>
    );
  }

  // ── Already issued — Re-download + Issue Another stacked ─────────────────
  if (issued) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleRedownload}
          className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight"
        >
          <Download className="h-3 w-3 shrink-0" />
          Re-download{issuedCount > 1 ? ` (x${issuedCount})` : ''}
        </button>
        <button
          onClick={() => doIssue(false)}
          disabled={issuing}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer leading-tight disabled:opacity-50"
        >
          {issuing
            ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
            : <><Award className="h-3 w-3 shrink-0" /> Issue Another</>
          }
        </button>
      </div>
    );
  }

  // ── Not yet issued ────────────────────────────────────────────────────────
  return (
    <button
      onClick={() => doIssue(false)}
      disabled={issuing}
      className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 cursor-pointer leading-tight disabled:opacity-50"
    >
      {issuing
        ? <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> Issuing...</>
        : <><Award className="h-3 w-3 shrink-0" /> Issue Cert</>
      }
    </button>
  );
}
