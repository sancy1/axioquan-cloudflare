'use client'
// src/components/verify/verify-page.tsx

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { buildCertHTML, CertificateData, getGrade } from '@/components/dashboard/certificate-generator'
import {
  ShieldCheck, ShieldX, Search, Download, Eye,
  RotateCcw, ExternalLink, CheckCircle2, XCircle,
  AlertTriangle, Loader2, Award, Calendar, BookOpen,
  User, Hash, GraduationCap
} from 'lucide-react'
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';


// ── Types ──────────────────────────────────────────────────────────────────────

interface VerifiedCert {
  code: string
  studentName: string
  courseTitle: string
  overallScore: number
  finalGrade: string
  issuedAt: string
  courseId: string
  studentId: string
  assessmentId: string | null
}

type VerifyState = 'idle' | 'loading' | 'verified' | 'invalid' | 'revoked' | 'error'

// ── Main Component ─────────────────────────────────────────────────────────────

export default function VerifyPage() {
  const [code, setCode]               = useState('')
  const [state, setState]             = useState<VerifyState>('idle')
  const [cert, setCert]               = useState<VerifiedCert | null>(null)
  const [errorMsg, setErrorMsg]       = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-read code from URL ?code=AXQ-XXXXX
    const params = new URLSearchParams(window.location.search)
    const urlCode = params.get('code')
    if (urlCode) {
      setCode(urlCode.toUpperCase())
      setTimeout(() => handleVerify(urlCode.toUpperCase()), 300)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Format input as user types — uppercase, allow AXQ- prefix naturally
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, ''))
    if (state !== 'idle') {
      setState('idle')
      setCert(null)
    }
  }

  const handleVerify = async (overrideCode?: string) => {
    const target = (overrideCode ?? code).trim()
    if (!target) { inputRef.current?.focus(); return }

    setState('loading')
    setCert(null)
    setErrorMsg('')
    setShowPreview(false)

    try {
      const res  = await fetch(`/api/certificates/verify?code=${encodeURIComponent(target)}`)
      const data = await res.json()

      if (data.success && data.certificate) {
        setCert(data.certificate)
        setState('verified')
      } else if (data.revoked) {
        setState('revoked')
        setErrorMsg(data.revokedReason || 'This certificate has been revoked.')
      } else if (res.status === 404 || res.status === 400) {
        setState('invalid')
        setErrorMsg(data.error || 'Certificate not found.')
      } else {
        setState('error')
        setErrorMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setState('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  const handleDownload = () => {
    if (!cert) return
    const certData: CertificateData = {
      studentId:     cert.studentId,
      studentName:   cert.studentName,
      courseTitle:   cert.courseTitle,
      averageScore:  cert.overallScore,
      assessmentId:  cert.assessmentId ?? '',
      courseId:      cert.courseId,
      completedDate: cert.issuedAt,
    }
    const html = buildCertHTML(certData, cert.code)
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close(); w.focus() }
  }

  const handleOnlineView = () => {
    if (!cert) return
    const certData: CertificateData = {
      studentId:     cert.studentId,
      studentName:   cert.studentName,
      courseTitle:   cert.courseTitle,
      averageScore:  cert.overallScore,
      assessmentId:  cert.assessmentId ?? '',
      courseId:      cert.courseId,
      completedDate: cert.issuedAt,
    }
    // Build HTML without the auto-print script for online view
    const html = buildCertHTML(certData, cert.code).replace(
      '<script>\n  document.fonts.ready.then(function() { setTimeout(function() { window.print(); }, 700); });\n</script>',
      ''
    )
    setPreviewHtml(html)
    setShowPreview(true)
  }

  const handleReset = () => {
    setState('idle')
    setCert(null)
    setCode('')
    setErrorMsg('')
    setShowPreview(false)
    setPreviewHtml('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const gradeColor = (grade: string) => {
    if (grade === 'DISTINCTION') return '#f0c040'
    if (grade === 'MERIT')       return '#4ade80'
    if (grade === 'PASS')        return '#60a5fa'
    return '#f87171'
  }
  

  return (
    <>
      {/* ── Full-page online viewer ────────────────────────────────────────── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0a1628]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">A</span>
              </div>
              <span className="text-white/70 text-sm font-medium tracking-wide">Certificate Preview</span>
              {cert && (
                <span className="text-[#f0c040]/70 text-xs font-mono ml-2">{cert.code}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#f0c040]/10 border border-[#f0c040]/30 text-[#f0c040] text-sm font-medium hover:bg-[#f0c040]/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          </div>

          {/* Certificate iframe */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-6">
            <div className="w-full max-w-5xl shadow-2xl rounded-lg overflow-hidden" style={{ aspectRatio: '297/210' }}>
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="Certificate Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          {/* Footer bar */}
          <div className="px-6 py-2.5 border-t border-white/10 bg-[#0a1628] flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="text-white/40 text-xs tracking-wide">
              Verified · AxioQuan Certification Authority · {cert?.code}
            </span>
          </div>
        </div>
      )}

      {/* ── Main Page ─────────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-[#070f1c] text-white overflow-x-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,148,10,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 80%, rgba(30,60,120,0.15) 0%, transparent 50%)
            `
          }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 0 1px rgba(201,148,10,0.3)' }}>
              <span className="text-white font-black text-base leading-none">A</span>
            </div>
            <span className="font-extrabold text-sm tracking-[4px] text-white uppercase">AxioQuan</span>
          </Link>
          <div className="flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f0c040]/60" />
            Certificate Verification
          </div>
        </nav>

        {/* Hero section */}
        <div className="relative z-10 flex flex-col items-center pt-16 pb-12 px-6">

          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f0c040]/20 bg-[#f0c040]/5 mb-8">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f0c040]" />
            <span className="text-[#f0c040]/80 text-xs font-semibold tracking-[3px] uppercase">Official Verification Portal</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black text-center leading-tight tracking-tight mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className="text-white">Verify a </span>
            <span style={{ color: '#f0c040' }}>Certificate</span>
          </h1>
          <p className="text-white/40 text-center text-base max-w-md leading-relaxed mb-12">
            Enter the certificate code printed at the bottom of any AxioQuan certificate to instantly verify its authenticity.
          </p>

          {/* ── Search Card ─────────────────────────────────────────────── */}
          <div className="w-full max-w-xl">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8"
                 style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

              {/* Input label */}
              <label className="block text-white/50 text-xs font-semibold tracking-[3px] uppercase mb-3">
                Certificate Code
              </label>

              {/* Input row */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Hash className="w-4 h-4 text-[#f0c040]/40" />
                  </div>
                  <input
                    ref={inputRef}
                    value={code}
                    onChange={handleInput}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    placeholder="AXQ-XXXXXX"
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/20 font-mono text-sm tracking-widest focus:outline-none focus:border-[#f0c040]/40 focus:bg-white/[0.07] transition-all"
                    style={{ letterSpacing: code ? '0.12em' : undefined }}
                  />
                </div>
                <button
                  onClick={() => handleVerify()}
                  disabled={state === 'loading' || !code.trim()}
                  className="cursor-pointer h-12 px-6 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    background: state === 'loading' ? 'rgba(201,148,10,0.2)' : 'linear-gradient(135deg, #c9940a, #f0c040)',
                    color: '#0a0a0a',
                    boxShadow: state === 'loading' ? 'none' : '0 0 24px rgba(240,192,64,0.25)'
                  }}
                >
                  {state === 'loading'
                    ? <><Loader2 className="w-4 h-4 animate-spin text-[#f0c040]" /><span className="text-[#f0c040]">Checking</span></>
                    : <><Search className="w-4 h-4" />Verify</>
                  }
                </button>
              </div>

              {/* Helper text */}
              <p className="text-white/25 text-xs">
                The certificate code is printed at the bottom of every AxioQuan certificate — e.g. <span className="font-mono text-white/40">AXQ-K3M7X2</span>
              </p>

              {/* ── Verified Result ──────────────────────────────────────── */}
              {state === 'verified' && cert && (
                <div className="mt-6 animate-fade-in">
                  {/* Green verified banner */}
                  <div className="flex items-center gap-3 p-4 rounded-xl mb-5"
                       style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(74,222,128,0.15)' }}>
                      <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                    </div>
                    <div>
                      <div className="text-[#4ade80] font-bold text-sm tracking-wide">Certificate Verified</div>
                      <div className="text-white/40 text-xs mt-0.5">This is an authentic AxioQuan certificate</div>
                    </div>
                    <div className="ml-auto">
                      <ShieldCheck className="w-5 h-5 text-[#4ade80]/50" />
                    </div>
                  </div>

                  {/* Certificate details grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <DetailCard icon={<User className="w-3.5 h-3.5" />} label="Recipient" value={cert.studentName} />
                    <DetailCard icon={<BookOpen className="w-3.5 h-3.5" />} label="Course" value={cert.courseTitle} fullWidth />
                    <DetailCard icon={<Calendar className="w-3.5 h-3.5" />} label="Issued" value={cert.issuedAt} />
                    <DetailCard icon={<Award className="w-3.5 h-3.5" />} label="Score" value={`${cert.overallScore}%`} />
                    <DetailCard
                      icon={<GraduationCap className="w-3.5 h-3.5" />}
                      label="Grade"
                      value={cert.finalGrade}
                      valueColor={gradeColor(cert.finalGrade)}
                    />
                    <DetailCard icon={<Hash className="w-3.5 h-3.5" />} label="Certificate ID" value={cert.code} mono />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleOnlineView}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all hover:bg-white/10 border border-white/10 text-white"
                    >
                      <Eye className="w-4 h-4" />
                      View Online
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,148,10,0.2), rgba(240,192,64,0.15))',
                        border: '1px solid rgba(240,192,64,0.3)',
                        color: '#f0c040',
                        boxShadow: '0 0 20px rgba(240,192,64,0.08)'
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    className="w-full cursor-pointer mt-3 flex items-center justify-center gap-2 text-white/25 text-xs hover:text-white/50 transition-colors py-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Verify another certificate
                  </button>
                </div>
              )}

              {/* ── Invalid / Not Found ──────────────────────────────────── */}
              {(state === 'invalid' || state === 'error') && (
                <div className="mt-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl"
                       style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                         style={{ background: 'rgba(248,113,113,0.12)' }}>
                      <XCircle className="w-5 h-5 text-[#f87171]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[#f87171] font-bold text-sm tracking-wide mb-1">
                        {state === 'invalid' ? 'Certificate Not Found' : 'Verification Error'}
                      </div>
                      <div className="text-white/40 text-xs leading-relaxed">{errorMsg}</div>
                    </div>
                  </div>
                  <button onClick={handleReset} className="w-full mt-3 flex items-center justify-center gap-2 text-white/30 text-xs hover:text-white/50 transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Try again
                  </button>
                </div>
              )}

              {/* ── Revoked ──────────────────────────────────────────────── */}
              {state === 'revoked' && (
                <div className="mt-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl"
                       style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                         style={{ background: 'rgba(251,191,36,0.1)' }}>
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-amber-400 font-bold text-sm tracking-wide mb-1">Certificate Revoked</div>
                      <div className="text-white/40 text-xs leading-relaxed">{errorMsg}</div>
                    </div>
                  </div>
                  <button onClick={handleReset} className="w-full mt-3 flex items-center justify-center gap-2 text-white/30 text-xs hover:text-white/50 transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Try another code
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── How it works ─────────────────────────────────────────────── */}
          <div className="w-full max-w-xl mt-12">
            <p className="text-white/25 text-xs font-semibold tracking-[3px] uppercase text-center mb-6">How Verification Works</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Hash className="w-5 h-5" />, title: 'Find the Code', desc: 'Locate the certificate ID at the bottom of the certificate document' },
                { icon: <Search className="w-5 h-5" />, title: 'Enter & Verify', desc: 'Paste the code above and click Verify to check authenticity' },
                { icon: <ShieldCheck className="w-5 h-5" />, title: 'Instant Result', desc: 'View the verified certificate details and download a copy' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f0c040]/60"
                       style={{ background: 'rgba(240,192,64,0.07)', border: '1px solid rgba(240,192,64,0.12)' }}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-white/70 text-xs font-bold mb-1">{step.title}</div>
                    <div className="text-white/25 text-xs leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.05] mt-12 py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center" style={{ boxShadow: '0 0 0 1px rgba(201,148,10,0.25)' }}>
              <span className="text-white font-black text-[9px]">A</span>
            </div>
            <Link href="/">
              <span className="text-white/20 text-xs tracking-[3px] uppercase font-semibold">AxioQuan</span>
            </Link>
          </div>
          <p className="text-white/15 text-xs text-center">
            This verification portal confirms certificates issued by AxioQuan. For questions contact <span className="text-white/30">support@axioquan.com</span>
          </p>
          <Link href="/" className="text-white/20 text-xs hover:text-white/40 transition-colors flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Back to AxioQuan
          </Link>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&display=swap');

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease forwards;
        }
      `}</style>
    </>
  )
}

// ── Sub-component ──────────────────────────────────────────────────────────────

function DetailCard({
  icon, label, value, fullWidth = false, valueColor, mono = false
}: {
  icon: React.ReactNode
  label: string
  value: string
  fullWidth?: boolean
  valueColor?: string
  mono?: boolean
}) {
  return (
    <div className={`p-3 rounded-xl border border-white/[0.06] bg-white/[0.025] ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 text-white/30 mb-1.5">
        {icon}
        <span className="text-[10px] font-semibold tracking-[2px] uppercase">{label}</span>
      </div>
      <div
        className={`text-sm font-semibold truncate ${mono ? 'font-mono tracking-wider' : ''}`}
        style={{ color: valueColor ?? 'rgba(255,255,255,0.85)' }}
      >
        {value}
      </div>
    </div>
  )
}
