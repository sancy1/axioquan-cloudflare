// src/app/verify/page.tsx
// Public page — no auth required. Anyone can verify a certificate.

import VerifyPage from '@/components/verify/verify-page'

export const metadata = {
  title: 'Verify Certificate · AxioQuan',
  description: 'Verify the authenticity of an AxioQuan certificate of completion.',
}

export default function Verify() {
  return <VerifyPage />
}
