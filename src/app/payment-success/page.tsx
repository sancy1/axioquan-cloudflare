// /src/app/payment-success/page.tsx
// Paystack redirects here after user completes (or cancels) payment.
// The Java payment service builds this callback URL as:
//   {FRONTEND_URL}/payment-success?reference=PAY_xxx&trxref=xxx
//
// Flow:
//   1. User pays on Paystack
//   2. Paystack redirects here with ?reference=... & ?trxref=...
//   3. We call verifyPaymentAction (Next.js → Java service → confirms with Paystack)
//   4. SUCCESS → mirror enrollment in Next.js DB → redirect to course
//   5. FAILURE → show clear error with retry option

'use client'

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { verifyPaymentAction, checkPaymentAlreadyProcessed } from '@/lib/courses/payment-enrollment-actions'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const [courseSlug, setCourseSlug] = useState<string | null>(null)

  useEffect(() => {
    // Paystack sends reference via either or both param names
    const reference = searchParams.get('reference') || searchParams.get('trxref')

    if (!reference) {
      setStatus('failed')
      setMessage('No payment reference found. Please contact support if you were charged.')
      return
    }

    // ── Guard: if this reference was already verified, redirect immediately.
    // Prevents replaying the success page from browser history or a copied URL.
    checkPaymentAlreadyProcessed(reference).then((check) => {
      if (check.alreadyProcessed && check.courseId) {
        router.replace(`/courses/learn/${check.courseId}`)
        return
      }

      verifyPaymentAction(reference).then((result) => {
        if (result.success && result.data?.status === 'SUCCESS') {
          setStatus('success')
          setMessage(result.message || 'Your payment was confirmed successfully.')
          const cId = result.data.courseId
          if (cId) {
            setCourseSlug(cId)
            // Use replace so the user cannot press Back to return to this page
            setTimeout(() => router.replace(`/courses/learn/${cId}`), 3000)
          }
        } else {
          setStatus('failed')
          setMessage(
            result.error ||
            result.message ||
            'Payment could not be verified. Please contact support.'
          )
        }
      })
    })
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">

        {/* ── Loading ── */}
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-gray-500">
              Please wait while we confirm your payment with Paystack…
            </p>
          </>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2 text-green-700">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-400 mb-6">
              Redirecting you to your course in a moment…
            </p>
            {courseSlug && (
              <Button
                onClick={() => router.replace(`/courses/learn/${courseSlug}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Learning Now
              </Button>
            )}
          </>
        )}

        {/* ── Failed ── */}
        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2 text-red-700">Payment Issue</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.back()} className="w-full">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/courses')}
                className="w-full"
              >
                Browse Courses
              </Button>
            </div>
          </>
        )}
      </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
