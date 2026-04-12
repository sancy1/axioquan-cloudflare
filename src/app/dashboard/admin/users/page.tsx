'use client'

// /src/app/dashboard/admin/users/page.tsx
// Admin User Management Panel

import { useEffect, useState, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Trash2,
  ShieldOff,
  ShieldCheck,
  CreditCard,
  Search,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Payment {
  paymentId: string
  courseId: string
  courseTitle: string | null
  status: string
  amount: number | null
  paidAt: string | null
}

interface User {
  id: string
  username: string
  email: string
  name: string | null
  image: string | null
  is_active: boolean
  last_login: string | null
  created_at: string
  roles: string[]
  payments: Payment[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function roleColor(role: string) {
  switch (role) {
    case 'admin':
      return 'destructive'
    case 'instructor':
      return 'secondary'
    case 'student':
      return 'outline'
    default:
      return 'outline'
  }
}

function initials(user: User) {
  const n = user.name || user.username || user.email
  return n.slice(0, 2).toUpperCase()
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [deleteDialog, setDeleteDialog] = useState<User | null>(null)
  const [suspendDialog, setSuspendDialog] = useState<{ user: User; action: 'suspend' | 'unsuspend' } | null>(null)
  const [paymentDialog, setPaymentDialog] = useState<{ user: User; payment: Payment } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // ─── Load users ────────────────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.message || 'Failed to load users.')
      }
    } catch {
      setError('Network error. Could not load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // ─── Filtered list ─────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q)
    )
  })

  // ─── Actions ───────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteDialog) return
    setActionLoading(true)
    setActionError(null)
    try {
      const res = await fetch(`/api/admin/users/${deleteDialog.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.id))
        setDeleteDialog(null)
      } else {
        setActionError(data.message || 'Failed to delete user.')
      }
    } catch {
      setActionError('Network error.')
    } finally {
      setActionLoading(false)
    }
  }

  async function confirmSuspend() {
    if (!suspendDialog) return
    setActionLoading(true)
    setActionError(null)
    try {
      const res = await fetch(`/api/admin/users/${suspendDialog.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: suspendDialog.action }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === suspendDialog.user.id
              ? { ...u, is_active: suspendDialog.action === 'unsuspend' }
              : u
          )
        )
        setSuspendDialog(null)
      } else {
        setActionError(data.message || 'Action failed.')
      }
    } catch {
      setActionError('Network error.')
    } finally {
      setActionLoading(false)
    }
  }

  async function confirmDeletePayment() {
    if (!paymentDialog) return
    setActionLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: paymentDialog.user.id,
          courseId: paymentDialog.payment.courseId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === paymentDialog.user.id
              ? {
                  ...u,
                  payments: u.payments.filter(
                    (p) => p.paymentId !== paymentDialog.payment.paymentId
                  ),
                }
              : u
          )
        )
        setPaymentDialog(null)
      } else {
        setActionError(data.message || 'Failed to delete payment.')
      }
    } catch {
      setActionError('Network error.')
    } finally {
      setActionLoading(false)
    }
  }

  function closeDialogs() {
    setDeleteDialog(null)
    setSuspendDialog(null)
    setPaymentDialog(null)
    setActionError(null)
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${users.length} total users`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-72"
            />
          </div>
          <Button variant="outline" size="icon" onClick={loadUsers} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No users found.
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Roles</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
                <th className="px-4 py-3 text-left font-medium">Payments</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  {/* User info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        {user.image && <AvatarImage src={user.image} alt={user.name || user.username} />}
                        <AvatarFallback className="text-xs font-semibold">
                          {initials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{user.name || user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((r) => (
                          <Badge key={r} variant={roleColor(r) as any} className="text-xs">
                            {r}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.is_active ? 'outline' : 'destructive'}
                      className="text-xs"
                    >
                      {user.is_active ? 'Active' : 'Suspended'}
                    </Badge>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  {/* Payments */}
                  <td className="px-4 py-3">
                    {user.payments.length === 0 ? (
                      <span className="text-xs text-muted-foreground">None</span>
                    ) : (
                      <div className="space-y-1">
                        {user.payments.map((p) => (
                          <div key={p.paymentId} className="flex items-center gap-1.5">
                            <span
                              className="text-xs truncate max-w-30"
                              title={p.courseTitle || p.courseId}
                            >
                              {p.courseTitle || p.courseId.slice(0, 8)}
                            </span>
                            <Badge
                              variant={p.status === 'SUCCESS' ? 'outline' : 'secondary'}
                              className="text-xs shrink-0"
                            >
                              {p.status}
                            </Badge>
                            <button
                              title="Delete this payment & enrollment"
                              onClick={() => {
                                setActionError(null)
                                setPaymentDialog({ user, payment: p })
                              }}
                              className="text-muted-foreground hover:text-red-600 transition-colors"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Suspend / Unsuspend */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title={user.is_active ? 'Suspend user' : 'Unsuspend user'}
                        className={
                          user.is_active
                            ? 'hover:text-yellow-600 hover:bg-yellow-50'
                            : 'hover:text-green-600 hover:bg-green-50'
                        }
                        onClick={() => {
                          setActionError(null)
                          setSuspendDialog({
                            user,
                            action: user.is_active ? 'suspend' : 'unsuspend',
                          })
                        }}
                      >
                        {user.is_active ? (
                          <ShieldOff className="h-4 w-4" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete user"
                        className="hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setActionError(null)
                          setDeleteDialog(user)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete User Dialog ────────────────────────────────────────────── */}
      <Dialog open={!!deleteDialog} onOpenChange={() => closeDialogs()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              This will permanently delete{' '}
              <span className="font-semibold text-foreground">
                {deleteDialog?.name || deleteDialog?.username}
              </span>{' '}
              and all their data (enrollments, progress, payments, reviews). This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <p className="text-sm text-red-600 bg-red-50 rounded p-2">{actionError}</p>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialogs} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting…' : 'Yes, Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Suspend / Unsuspend Dialog ───────────────────────────────────── */}
      <Dialog open={!!suspendDialog} onOpenChange={() => closeDialogs()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {suspendDialog?.action === 'suspend' ? 'Suspend User' : 'Unsuspend User'}
            </DialogTitle>
            <DialogDescription>
              {suspendDialog?.action === 'suspend' ? (
                <>
                  Suspend{' '}
                  <span className="font-semibold text-foreground">
                    {suspendDialog.user.name || suspendDialog.user.username}
                  </span>
                  ? They will not be able to log in until unsuspended.
                </>
              ) : (
                <>
                  Re-enable account for{' '}
                  <span className="font-semibold text-foreground">
                    {suspendDialog?.user.name || suspendDialog?.user.username}
                  </span>
                  ?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <p className="text-sm text-red-600 bg-red-50 rounded p-2">{actionError}</p>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialogs} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant={suspendDialog?.action === 'suspend' ? 'destructive' : 'default'}
              onClick={confirmSuspend}
              disabled={actionLoading}
            >
              {actionLoading
                ? 'Processing…'
                : suspendDialog?.action === 'suspend'
                ? 'Yes, Suspend'
                : 'Yes, Unsuspend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Payment Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!paymentDialog} onOpenChange={() => closeDialogs()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Delete Payment &amp; Enrollment
            </DialogTitle>
            <DialogDescription>
              Remove the payment record and enrollment for{' '}
              <span className="font-semibold text-foreground">
                {paymentDialog?.user.name || paymentDialog?.user.username}
              </span>{' '}
              from{' '}
              <span className="font-semibold text-foreground">
                {paymentDialog?.payment.courseTitle || paymentDialog?.payment.courseId}
              </span>
              . The user will lose access to this course.
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <p className="text-sm text-red-600 bg-red-50 rounded p-2">{actionError}</p>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialogs} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePayment}
              disabled={actionLoading}
            >
              {actionLoading ? 'Removing…' : 'Yes, Remove Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
