
// // hooks/use-messaging.ts
// // WebSocket hook for real-time messaging
// // Mirrors the pattern of use-server-events.ts exactly
// // Connects to messag WebSocket using JWT from /api/messaging/token
// // Exposes: isConnected, lastMessage, sendPing, onMessage

// 'use client'

// import { useEffect, useRef, useCallback, useState } from 'react'
// import type { WsEvent, WsMessagePayload, WsConnectedPayload } from '@/lib/messaging/types'

// interface UseMessagingOptions {
//   onMessage?:    (payload: WsMessagePayload) => void
//   onConnected?:  (payload: WsConnectedPayload) => void
//   onDisconnect?: () => void
// }

// const WS_BASE_URL = (
//   process.env.NEXT_PUBLIC_MESSAGING_WS_URL || 'wss://messag-api-dev.onrender.com'
// ).replace(/\/$/, '') // strip trailing slash if any

// export function useMessaging(options: UseMessagingOptions = {}) {
//   const wsRef          = useRef<WebSocket | null>(null)
//   const tokenRef       = useRef<string | null>(null)
//   const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
//   const mountedRef     = useRef(true)

//   const [isConnected, setIsConnected] = useState(false)
//   const [lastMessage, setLastMessage] = useState<WsMessagePayload | null>(null)

//   // ── Fetch JWT token from Next.js bridge ───────────────────────────────────
//   const getToken = useCallback(async (): Promise<string | null> => {
//     try {
//       const res  = await fetch('/api/messaging/token')
//       const data = await res.json()
//       return data.token ?? null
//     } catch {
//       console.error('❌ Failed to fetch messaging token')
//       return null
//     }
//   }, [])

//   // ── Connect to WebSocket ──────────────────────────────────────────────────
//   const connect = useCallback(async () => {
//     if (typeof window === 'undefined') return
//     if (wsRef.current?.readyState === WebSocket.OPEN) return

//     // Get or reuse token
//     if (!tokenRef.current) {
//       tokenRef.current = await getToken()
//     }

//     if (!tokenRef.current) {
//       console.warn('⚠️ No messaging token — skipping WebSocket connection')
//       return
//     }

//     try {
//       const ws = new WebSocket(`${WS_BASE_URL}/ws?token=${tokenRef.current}`)

//       ws.onopen = () => {
//         if (!mountedRef.current) return
//         console.log('✅ Messaging WebSocket connected')
//         setIsConnected(true)
//       }

//       ws.onmessage = (event) => {
//         if (!mountedRef.current) return
//         try {
//           const data = JSON.parse(event.data) as WsEvent

//           switch (data.type) {
//             case 'connected':
//               options.onConnected?.(data.payload as WsConnectedPayload)
//               break

//             case 'message':
//               const msgPayload = data.payload as WsMessagePayload
//               setLastMessage(msgPayload)
//               options.onMessage?.(msgPayload)
//               break

//             case 'pong':
//               // keepalive acknowledged
//               break

//             case 'error':
//               console.warn('⚠️ WS error event:', data.payload)
//               break

//             default:
//               break
//           }
//         } catch {
//           console.error('❌ Failed to parse WS message')
//         }
//       }

//       ws.onerror = () => {
//         if (!mountedRef.current) return
//         console.error('❌ Messaging WebSocket error')
//         setIsConnected(false)
//       }

//       ws.onclose = () => {
//         if (!mountedRef.current) return
//         console.log('🔌 Messaging WebSocket closed — reconnecting in 5s...')
//         setIsConnected(false)
//         options.onDisconnect?.()

//         // Reconnect after 5 seconds — same pattern as use-server-events.ts
//         reconnectTimer.current = setTimeout(() => {
//           if (mountedRef.current) connect()
//         }, 5000)
//       }

//       wsRef.current = ws
//     } catch (err) {
//       console.error('❌ Failed to create WebSocket:', err)
//     }
//   }, [getToken, options])

//   // ── Disconnect ────────────────────────────────────────────────────────────
//   const disconnect = useCallback(() => {
//     if (reconnectTimer.current) {
//       clearTimeout(reconnectTimer.current)
//       reconnectTimer.current = null
//     }
//     if (wsRef.current) {
//       wsRef.current.close()
//       wsRef.current = null
//     }
//     setIsConnected(false)
//   }, [])

//   // ── Send ping ─────────────────────────────────────────────────────────────
//   const sendPing = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ type: 'ping' }))
//     }
//   }, [])

//   // ── Send typing indicator ─────────────────────────────────────────────────
//   const sendTyping = useCallback((conversationId: string) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({
//         type:    'typing',
//         payload: { conversationId },
//       }))
//     }
//   }, [])

//   // ── Lifecycle ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     mountedRef.current = true
//     connect()

//     // Keepalive ping every 30 seconds
//     const pingInterval = setInterval(sendPing, 30_000)

//     return () => {
//       mountedRef.current = false
//       clearInterval(pingInterval)
//       disconnect()
//     }
//   }, [connect, disconnect, sendPing])

//   return {
//     isConnected,
//     lastMessage,
//     sendPing,
//     sendTyping,
//     disconnect,
//     reconnect: connect,
//   }
// }






























// // hooks/use-messaging.ts
// // WebSocket hook for real-time messaging
// // Mirrors the pattern of use-server-events.ts exactly
// // Connects to messag WebSocket using JWT from /api/messaging/token

// 'use client'

// import { useEffect, useRef, useCallback, useState } from 'react'
// import type { WsEvent, WsMessagePayload, WsConnectedPayload } from '@/lib/messaging/types'

// interface UseMessagingOptions {
//   onMessage?:    (payload: WsMessagePayload) => void
//   onConnected?:  (payload: WsConnectedPayload) => void
//   onDisconnect?: () => void
// }

// const WS_BASE_URL = (
//   process.env.NEXT_PUBLIC_MESSAGING_WS_URL || 'wss://messag-api-dev.onrender.com'
// ).replace(/\/$/, '')

// export function useMessaging(options: UseMessagingOptions = {}) {
//   const wsRef          = useRef<WebSocket | null>(null)
//   const tokenRef       = useRef<string | null>(null)
//   const reconnectTimer = useRef<number>(0)
//   const mountedRef     = useRef(true)
//   const optionsRef     = useRef(options)

//   // ── Keep optionsRef current without triggering reconnect ─────────────────
//   useEffect(() => {
//     optionsRef.current = options
//   })

//   const [isConnected, setIsConnected] = useState(false)
//   const [lastMessage, setLastMessage] = useState<WsMessagePayload | null>(null)

//   // ── Fetch JWT token ───────────────────────────────────────────────────────
//   const getToken = useCallback(async (): Promise<string | null> => {
//     try {
//       const res  = await fetch('/api/messaging/token')
//       const data = await res.json()
//       return data.token ?? null
//     } catch {
//       return null
//     }
//   }, [])

//   // ── Connect ───────────────────────────────────────────────────────────────
//   const connect = useCallback(async () => {
//     if (typeof window === 'undefined') return
//     if (wsRef.current?.readyState === WebSocket.OPEN) return
//     if (wsRef.current?.readyState === WebSocket.CONNECTING) return

//     if (!tokenRef.current) {
//       tokenRef.current = await getToken()
//     }

//     if (!tokenRef.current) {
//       console.warn('⚠️ No messaging token — skipping WebSocket connection')
//       return
//     }

//     try {
//       const ws = new WebSocket(`${WS_BASE_URL}/ws?token=${tokenRef.current}`)

//       ws.onopen = () => {
//         if (!mountedRef.current) return
//         console.log('✅ Messaging WebSocket connected')
//         setIsConnected(true)
//         // Clear reconnect timer on successful connect
//         window.clearTimeout(reconnectTimer.current)
//       }

//       ws.onmessage = (event) => {
//         if (!mountedRef.current) return
//         try {
//           const data = JSON.parse(event.data) as WsEvent
//           switch (data.type) {
//             case 'connected':
//               optionsRef.current.onConnected?.(data.payload as WsConnectedPayload)
//               break
//             case 'message':
//               const msgPayload = data.payload as WsMessagePayload
//               setLastMessage(msgPayload)
//               optionsRef.current.onMessage?.(msgPayload)
//               break
//             case 'pong':
//               break
//             case 'error':
//               console.warn('⚠️ WS error event:', data.payload)
//               break
//           }
//         } catch {
//           console.error('❌ Failed to parse WS message')
//         }
//       }

//       ws.onerror = () => {
//         if (!mountedRef.current) return
//         setIsConnected(false)
//       }

//       ws.onclose = (event) => {
//         if (!mountedRef.current) return
//         setIsConnected(false)
//         optionsRef.current.onDisconnect?.()

//         // Only reconnect if not a clean close
//         if (event.code !== 1000 && event.code !== 1008) {
//           reconnectTimer.current = window.setTimeout(() => {
//             if (mountedRef.current) {
//               tokenRef.current = null // force fresh token on reconnect
//               connect()
//             }
//           }, 5000)
//         }
//       }

//       wsRef.current = ws
//     } catch (err) {
//       console.error('❌ Failed to create WebSocket:', err)
//     }
//   }, [getToken]) // ← only getToken, NOT options — prevents reconnect loop

//   // ── Disconnect ────────────────────────────────────────────────────────────
//   const disconnect = useCallback(() => {
//     window.clearTimeout(reconnectTimer.current)
//     if (wsRef.current) {
//       wsRef.current.close(1000, 'Component unmounted')
//       wsRef.current = null
//     }
//     setIsConnected(false)
//   }, [])

//   // ── Send ping ─────────────────────────────────────────────────────────────
//   const sendPing = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ type: 'ping' }))
//     }
//   }, [])

//   // ── Send typing indicator ─────────────────────────────────────────────────
//   const sendTyping = useCallback((conversationId: string) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({
//         type:    'typing',
//         payload: { conversationId },
//       }))
//     }
//   }, [])

//   // ── Lifecycle — connect once on mount ─────────────────────────────────────
//   useEffect(() => {
//     mountedRef.current = true
//     connect()

//     const pingInterval = window.setInterval(sendPing, 30_000)

//     return () => {
//       mountedRef.current = false
//       window.clearInterval(pingInterval)
//       disconnect()
//     }
//   }, []) // ← empty deps — connect only once on mount

//   return { isConnected, lastMessage, sendPing, sendTyping, disconnect, reconnect: connect }
// }


























// // hooks/use-messaging.ts
// // WebSocket hook for real-time messaging
// // Mirrors the pattern of use-server-events.ts exactly
// // Connects to messag WebSocket using JWT from /api/messaging/token
// // Phase 4A fix: health check ping wakes Render free tier before connecting

// 'use client'

// import { useEffect, useRef, useCallback, useState } from 'react'
// import type { WsEvent, WsMessagePayload, WsConnectedPayload } from '@/lib/messaging/types'

// interface UseMessagingOptions {
//   onMessage?:    (payload: WsMessagePayload) => void
//   onConnected?:  (payload: WsConnectedPayload) => void
//   onDisconnect?: () => void
// }

// const WS_BASE_URL = (
//   process.env.NEXT_PUBLIC_MESSAGING_WS_URL || 'wss://messag-api-dev.onrender.com'
// ).replace(/\/$/, '')

// // Convert wss:// → https:// for health check
// const HTTP_BASE_URL = WS_BASE_URL
//   .replace('wss://', 'https://')
//   .replace('ws://', 'http://')

// export function useMessaging(options: UseMessagingOptions = {}) {
//   const wsRef          = useRef<WebSocket | null>(null)
//   const tokenRef       = useRef<string | null>(null)
//   const reconnectTimer = useRef<number>(0)
//   const mountedRef     = useRef(true)
//   const optionsRef     = useRef(options)
//   const wakingRef      = useRef(false)

//   // ── Keep optionsRef current without triggering reconnect ─────────────────
//   useEffect(() => {
//     optionsRef.current = options
//   })

//   const [isConnected, setIsConnected]   = useState(false)
//   const [isWaking, setIsWaking]         = useState(false)
//   const [lastMessage, setLastMessage]   = useState<WsMessagePayload | null>(null)

//   // ── Fetch JWT token ───────────────────────────────────────────────────────
//   const getToken = useCallback(async (): Promise<string | null> => {
//     try {
//       const res  = await fetch('/api/messaging/token')
//       const data = await res.json()
//       return data.token ?? null
//     } catch {
//       console.error('❌ Failed to fetch messaging token')
//       return null
//     }
//   }, [])

//   // ── Wake up Render free tier ──────────────────────────────────────────────
//   // Render spins down after 15 minutes of inactivity
//   // Ping the health endpoint first so WebSocket connection does not fail
//   const wakeUpServer = useCallback(async (): Promise<boolean> => {
//     if (wakingRef.current) return false
//     wakingRef.current = true
//     setIsWaking(true)

//     try {
//       const res = await fetch(`${HTTP_BASE_URL}/health`, {
//         signal: AbortSignal.timeout(15_000), // 15s — Render can take up to 10s to wake
//       })
//       return res.ok
//     } catch {
//       // Health check failed or timed out — server still waking
//       // Proceed anyway and let WebSocket retry handle it
//       return false
//     } finally {
//       wakingRef.current = false
//       setIsWaking(false)
//     }
//   }, [])

//   // ── Connect ───────────────────────────────────────────────────────────────
//   const connect = useCallback(async () => {
//     if (typeof window === 'undefined') return
//     if (wsRef.current?.readyState === WebSocket.OPEN) return
//     if (wsRef.current?.readyState === WebSocket.CONNECTING) return

//     // Wake up Render free tier before attempting WebSocket connection
//     await wakeUpServer()

//     if (!mountedRef.current) return

//     // Get or reuse JWT token
//     if (!tokenRef.current) {
//       tokenRef.current = await getToken()
//     }

//     if (!tokenRef.current) {
//       console.warn('⚠️ No messaging token — skipping WebSocket connection')
//       // Retry in 5 seconds in case token fetch was a temporary failure
//       reconnectTimer.current = window.setTimeout(() => {
//         if (mountedRef.current) connect()
//       }, 5000)
//       return
//     }

//     if (!mountedRef.current) return

//     try {
//       const ws = new WebSocket(`${WS_BASE_URL}/ws?token=${tokenRef.current}`)

//       ws.onopen = () => {
//         if (!mountedRef.current) return
//         console.log('✅ Messaging WebSocket connected')
//         setIsConnected(true)
//         window.clearTimeout(reconnectTimer.current)
//       }

//       ws.onmessage = (event) => {
//         if (!mountedRef.current) return
//         try {
//           const data = JSON.parse(event.data) as WsEvent
//           switch (data.type) {
//             case 'connected':
//               optionsRef.current.onConnected?.(data.payload as WsConnectedPayload)
//               break
//             case 'message': {
//               const msgPayload = data.payload as WsMessagePayload
//               setLastMessage(msgPayload)
//               optionsRef.current.onMessage?.(msgPayload)
//               break
//             }
//             case 'pong':
//               // keepalive acknowledged — no action needed
//               break
//             case 'error':
//               console.warn('⚠️ WS server error event:', data.payload)
//               break
//             default:
//               break
//           }
//         } catch {
//           console.error('❌ Failed to parse WS message')
//         }
//       }

//       ws.onerror = () => {
//         if (!mountedRef.current) return
//         // Do not log here — onclose fires immediately after and has more info
//         setIsConnected(false)
//       }

//       ws.onclose = (event) => {
//         if (!mountedRef.current) return
//         setIsConnected(false)
//         optionsRef.current.onDisconnect?.()

//         // Code 1008 = policy violation (bad token) — do not retry with same token
//         if (event.code === 1008) {
//           console.warn('⚠️ WS closed: invalid token — clearing token and retrying')
//           tokenRef.current = null
//         }

//         // Code 1000 = clean close (component unmounted) — do not retry
//         if (event.code === 1000) return

//         // All other close codes — retry after 5 seconds
//         reconnectTimer.current = window.setTimeout(() => {
//           if (mountedRef.current) {
//             // Force fresh token on every reconnect
//             tokenRef.current = null
//             connect()
//           }
//         }, 5000)
//       }

//       wsRef.current = ws
//     } catch (err) {
//       console.error('❌ Failed to create WebSocket:', err)
//       // Retry after 5 seconds
//       reconnectTimer.current = window.setTimeout(() => {
//         if (mountedRef.current) connect()
//       }, 5000)
//     }
//   }, [getToken, wakeUpServer])

//   // ── Disconnect ────────────────────────────────────────────────────────────
//   const disconnect = useCallback(() => {
//     window.clearTimeout(reconnectTimer.current)
//     if (wsRef.current) {
//       wsRef.current.close(1000, 'Component unmounted')
//       wsRef.current = null
//     }
//     setIsConnected(false)
//   }, [])

//   // ── Send ping — keepalive every 30s ──────────────────────────────────────
//   const sendPing = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ type: 'ping' }))
//     }
//   }, [])

//   // ── Send typing indicator ─────────────────────────────────────────────────
//   const sendTyping = useCallback((conversationId: string) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({
//         type:    'typing',
//         payload: { conversationId },
//       }))
//     }
//   }, [])

//   // ── Lifecycle — connect once on mount ─────────────────────────────────────
//   useEffect(() => {
//     mountedRef.current = true
//     connect()

//     // Keepalive ping every 30 seconds prevents Render from sleeping
//     const pingInterval = window.setInterval(sendPing, 30_000)

//     return () => {
//       mountedRef.current = false
//       window.clearInterval(pingInterval)
//       disconnect()
//     }
//   }, []) // ← empty deps — connect only once on mount, cleanup on unmount

//   return {
//     isConnected,
//     isWaking,
//     lastMessage,
//     sendPing,
//     sendTyping,
//     disconnect,
//     reconnect: connect,
//   }
// }























// hooks/use-messaging.ts
// WebSocket hook for real-time messaging
// FIXED: wakeUpServer removed from connect deps — was causing reconnect loop
// FIXED: message dispatch now fires for all conversations not just active one

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { WsEvent, WsMessagePayload, WsConnectedPayload } from '@/lib/messaging/types'

interface UseMessagingOptions {
  onMessage?:    (payload: WsMessagePayload) => void
  onConnected?:  (payload: WsConnectedPayload) => void
  onDisconnect?: () => void
}

const WS_BASE_URL = (
  process.env.NEXT_PUBLIC_MESSAGING_WS_URL || 'wss://messag-api-dev.onrender.com'
).replace(/\/$/, '')

const HTTP_BASE_URL = WS_BASE_URL
  .replace('wss://', 'https://')
  .replace('ws://', 'http://')

export function useMessaging(options: UseMessagingOptions = {}) {
  const wsRef          = useRef<WebSocket | null>(null)
  const tokenRef       = useRef<string | null>(null)
  const reconnectTimer = useRef<number>(0)
  const mountedRef     = useRef(true)
  const optionsRef     = useRef(options)
  const hasWokenRef    = useRef(false) // wake server only once per session

  // ── Keep optionsRef current without triggering reconnect ─────────────────
  useEffect(() => {
    optionsRef.current = options
  })

  const [isConnected, setIsConnected] = useState(false)
  const [isWaking, setIsWaking]       = useState(false)
  const [lastMessage, setLastMessage] = useState<WsMessagePayload | null>(null)

  // ── Fetch JWT token ───────────────────────────────────────────────────────
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const res  = await fetch('/api/messaging/token')
      const data = await res.json()
      return data.token ?? null
    } catch {
      return null
    }
  }, [])

  // ── Wake Render free tier — called once per session via ref ───────────────
  // NOT in connect deps — uses ref to avoid recreating connect callback
  const wakeServer = async () => {
    if (hasWokenRef.current) return
    hasWokenRef.current = true
    setIsWaking(true)
    try {
      await fetch(`${HTTP_BASE_URL}/health`, {
        signal: AbortSignal.timeout(15_000),
      })
    } catch {
      // Server still waking — proceed anyway, WS will retry
    } finally {
      setIsWaking(false)
    }
  }

  // ── Connect ───────────────────────────────────────────────────────────────
  // wakeServer is NOT in deps — it uses a ref flag so it is safe
  const connect = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return

    // Wake server once per session before first connect attempt
    await wakeServer()

    if (!mountedRef.current) return

    if (!tokenRef.current) {
      tokenRef.current = await getToken()
    }

    if (!tokenRef.current) {
      console.warn('⚠️ No messaging token — retrying in 5s')
      reconnectTimer.current = window.setTimeout(() => {
        if (mountedRef.current) connect()
      }, 5000)
      return
    }

    if (!mountedRef.current) return

    try {
      const ws = new WebSocket(`${WS_BASE_URL}/ws?token=${tokenRef.current}`)

      ws.onopen = () => {
        if (!mountedRef.current) return
        console.log('✅ Messaging WebSocket connected')
        setIsConnected(true)
        window.clearTimeout(reconnectTimer.current)
      }

      ws.onmessage = (event) => {
        if (!mountedRef.current) return
        try {
          const data = JSON.parse(event.data) as WsEvent
          switch (data.type) {
            case 'connected':
              optionsRef.current.onConnected?.(data.payload as WsConnectedPayload)
              break
            case 'message': {
              const msgPayload = data.payload as WsMessagePayload
              setLastMessage(msgPayload)
              optionsRef.current.onMessage?.(msgPayload)
              break
            }
            case 'pong':
              break
            case 'error':
              console.warn('⚠️ WS error event:', data.payload)
              break
          }
        } catch {
          console.error('❌ Failed to parse WS message')
        }
      }

      ws.onerror = () => {
        if (!mountedRef.current) return
        setIsConnected(false)
      }

      ws.onclose = (event) => {
        if (!mountedRef.current) return
        setIsConnected(false)
        optionsRef.current.onDisconnect?.()

        if (event.code === 1008) {
          tokenRef.current = null
        }
        if (event.code === 1000) return

        reconnectTimer.current = window.setTimeout(() => {
          if (mountedRef.current) {
            tokenRef.current = null
            connect()
          }
        }, 5000)
      }

      wsRef.current = ws
    } catch (err) {
      console.error('❌ Failed to create WebSocket:', err)
      reconnectTimer.current = window.setTimeout(() => {
        if (mountedRef.current) connect()
      }, 5000)
    }
  }, [getToken]) // ← ONLY getToken — wakeServer uses ref, options uses optionsRef

  // ── Disconnect ────────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    window.clearTimeout(reconnectTimer.current)
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounted')
      wsRef.current = null
    }
    setIsConnected(false)
  }, [])

  // ── Send ping ─────────────────────────────────────────────────────────────
  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }))
    }
  }, [])

  // ── Send typing indicator ─────────────────────────────────────────────────
  const sendTyping = useCallback((conversationId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type:    'typing',
        payload: { conversationId },
      }))
    }
  }, [])

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true
    connect()
    const pingInterval = window.setInterval(sendPing, 30_000)
    return () => {
      mountedRef.current = false
      window.clearInterval(pingInterval)
      disconnect()
    }
  }, []) // ← empty — connect once on mount only

  return { isConnected, isWaking, lastMessage, sendPing, sendTyping, disconnect, reconnect: connect }
}