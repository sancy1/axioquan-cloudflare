// src/app/api/proxy/document/route.ts
// Proxies CDN documents through Next.js to:
//  1. Bypass CORS / X-Frame-Options that blocks iframe embedding
//  2. Force a real download via Content-Disposition: attachment
//  3. Fix double-path Cloudinary URLs
//  4. Try multiple Cloudinary resource_type variants if the first 404s

import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = [
  'res.cloudinary.com',
  'cloudinary.com',
  'storage.googleapis.com',
  's3.amazonaws.com',
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const raw      = searchParams.get('url')
  const mode     = (searchParams.get('mode') ?? 'inline') as 'inline' | 'download'
  const filename = searchParams.get('filename') ?? 'document'

  if (!raw) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  // Security: only allow known CDN hosts
  let parsedUrl: URL
  try { parsedUrl = new URL(raw) } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }
  const isAllowed = ALLOWED_HOSTS.some(
    h => parsedUrl.hostname === h || parsedUrl.hostname.endsWith('.' + h)
  )
  if (!isAllowed) {
    return new NextResponse('Host not allowed', { status: 403 })
  }

  // Build all URL candidates to try (handles various Cloudinary storage quirks)
  const candidates = buildCandidates(raw)

  // Try each candidate until one returns a non-404
  let upstream: Response | null = null
  let usedUrl = raw

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AxioQuan/1.0)' },
        redirect: 'follow',
      })
      if (res.ok) {
        upstream = res
        usedUrl  = candidate
        break
      }
      // If last candidate, keep the last response to return its status
      if (candidate === candidates[candidates.length - 1]) {
        upstream = res
      }
    } catch (err) {
      console.error('[proxy/document] fetch error for', candidate, err)
    }
  }

  if (!upstream) {
    return new NextResponse('Failed to fetch document', { status: 502 })
  }

  if (!upstream.ok) {
    // Return a helpful JSON error so the UI can show a better message
    return new NextResponse(
      JSON.stringify({
        error: `Upstream returned ${upstream.status}`,
        triedUrls: candidates,
        hint: 'The file may not exist at any of these Cloudinary paths. Check your Cloudinary Media Library.',
      }),
      {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  console.log('[proxy/document] served from:', usedUrl)

  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
  const body        = await upstream.arrayBuffer()

  const headers = new Headers({
    'Content-Type':     contentType,
    'Content-Length':   body.byteLength.toString(),
    'X-Frame-Options':  'SAMEORIGIN',
    'Cache-Control':    'public, max-age=3600',
    'X-Proxied-From':   usedUrl,
  })

  if (mode === 'download') {
    const safeFilename = filename !== 'document'
      ? filename
      : usedUrl.split('/').pop()?.split('?')[0] ?? 'document'
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`)
  } else {
    const urlFilename = usedUrl.split('/').pop()?.split('?')[0] ?? 'document'
    headers.set('Content-Disposition', `inline; filename="${urlFilename}"`)
  }

  return new NextResponse(body, { status: 200, headers })
}

// ── Build URL candidates ──────────────────────────────────────────────────────
// Given the raw stored URL, generate all plausible variants Cloudinary might use.
function buildCandidates(raw: string): string[] {
  const candidates = new Set<string>()

  // 1. Raw URL first — the file exists at whatever path Cloudinary stored it,
  //    including any double-path from upload configuration.
  candidates.add(raw)
  // 2. Cleaned (deduped) version as fallback — for future uploads with corrected code
  const cleaned = deduplicatePathSegments(raw)
  candidates.add(cleaned)

  // For Cloudinary URLs, try swapping resource_type
  if (raw.includes('res.cloudinary.com')) {
    // Try all resource types: raw, image, video, auto
    for (const rt of ['raw', 'image', 'video', 'auto']) {
      candidates.add(cleaned.replace(/\/(raw|image|video|auto)\/upload\//, `/${rt}/upload/`))
      candidates.add(raw.replace(/\/(raw|image|video|auto)\/upload\//, `/${rt}/upload/`))
    }

    // Try without version number (v1234567890)
    const noVersion = cleaned.replace(/\/v\d{10}\//, '/')
    candidates.add(noVersion)
    for (const rt of ['raw', 'image', 'video']) {
      candidates.add(noVersion.replace(/\/(raw|image|video|auto)\/upload\//, `/${rt}/upload/`))
    }

    // Try fl_attachment flag (some Cloudinary setups need this)
    candidates.add(cleaned.replace('/upload/', '/upload/fl_attachment/'))
  }

  return [...candidates].filter(Boolean)
}

// ── Deduplicate repeated path segments ───────────────────────────────────────
// /axioquan/documents/axioquan/documents/FILE.pdf → /axioquan/documents/FILE.pdf
function deduplicatePathSegments(url: string): string {
  try {
    const u     = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    const deduped: string[] = []
    for (let i = 0; i < parts.length; i++) {
      const remaining = parts.slice(i)
      let found = false
      for (let k = Math.max(0, deduped.length - remaining.length); k < deduped.length; k++) {
        const tail = deduped.slice(k)
        if (tail.length > 0 && tail.every((s, j) => j < remaining.length && s === remaining[j])) {
          i += tail.length - 1; found = true; break
        }
      }
      if (!found) deduped.push(parts[i])
    }
    u.pathname = '/' + deduped.join('/')
    return u.toString()
  } catch { return url }
}
