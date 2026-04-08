// /hooks/use-transaction-history.ts
// Hook to fetch transaction history from payment service
// Shows all payments, refunds, and other financial transactions

import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  type: 'PAYMENT' | 'REFUND' | 'CHARGEBACK' | 'DISPUTE'
  amount_cents: number
  reference: string
  status: string
  createdAt: string
}

interface TransactionSummary {
  totalTransactions: number
  completedTransactions: number
  totalAmountCents: number
  currency: string
}

export function useTransactionHistory(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch transactions list
        const txnResponse = await fetch(`/api/transactions?userId=${userId}`)
        const txnData = await txnResponse.json()

        if (txnResponse.ok && txnData.success) {
          setTransactions(txnData.data || [])
        } else {
          console.warn('⚠ Could not fetch transactions:', txnData.error)
        }

        // Fetch summary
        const summaryResponse = await fetch(`/api/transactions/summary?userId=${userId}`)
        const summaryData = await summaryResponse.json()

        if (summaryResponse.ok && summaryData.success) {
          setSummary(summaryData.data)
        }
      } catch (err: any) {
        console.error('❌ Transactions fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])

  return { transactions, summary, loading, error }
}
