// /types/payments.ts
// Payment types for axioquan payment integration with Java service

/**
 * Payment Status Enum
 * Represents the lifecycle of a payment
 */
export enum PaymentStatus {
  PENDING = 'PENDING', // Payment initiated, awaiting user action
  SUCCESS = 'SUCCESS', // Payment completed successfully
  FAILED = 'FAILED', // Payment failed (card declined, timeout, etc)
  REFUNDED = 'REFUNDED', // Payment refunded to user
}

/**
 * Local Payment Record
 * Shared multi-framework database schema
 * Maintains audit trail with multi-currency support and notification tracking
 */
export interface Payment {
  id: string; // UUID, primary key
  reference: string; // UNIQUE - Unique payment identifier (PAY_XXX)
  user_id: string; // UUID, FK to users
  course_id: string; // UUID, FK to courses
  
  // Payment amounts
  amount_cents: number; // Amount in local currency (5000 = 50 NGN)
  currency: string; // Local currency (NGN, USD, etc)
  original_currency?: string; // User's original currency if different
  original_amount_cents?: number; // Amount in user's original currency
  exchange_rate?: number; // Conversion rate applied
  settlement_currency?: string; // Currency settled to merchant
  
  // Payment status
  status: string; // PENDING, SUCCESS, FAILED, REFUNDED, etc
  payment_method?: string; // card, bank_transfer, paystack, etc
  paystack_reference?: string; // Paystack transaction reference
  paystack_response?: Record<string, any>; // Full Paystack API response (JSONB)
  metadata?: Record<string, any>; // Additional data (JSONB)
  
  // Timestamps
  paid_at?: Date; // When payment was confirmed
  created_at: Date;
  updated_at: Date;
  
  // Notification tracking
  notification_sent?: boolean;
  notification_sent_at?: Date;
  notification_status?: string; // pending, sent, failed
  notification_error?: string; // Error message if notification failed
}

/**
 * Create Payment Request
 * Sent to Java service to initialize payment
 * MUST include all fields - Java service uses these to determine if course is paid
 */
export interface InitializePaymentRequest {
  userId: string;
  courseId: string;
  email: string;
  amountCents: number; // In kobo (1000000 = ₦10,000)
  callbackUrl?: string; // Override Java backend's default FRONTEND_URL callback
}

/**
 * Initialize Payment Response
 * Returned from Java/Spring Boot payment service
 * FREE courses: status SUCCESS, no checkoutUrl needed
 * PAID courses: status PENDING, checkoutUrl provided for Paystack redirect
 */
export interface InitializePaymentResponse {
  id?: string; // Payment ID from service
  reference: string; // Unique reference: PAY_XXX
  courseId?: string;
  userId?: string;
  amountCents?: number;
  currency?: string;
  status?: 'PENDING' | 'SUCCESS'; // FREE courses get SUCCESS immediately
  authorizationUrl?: string; // Paystack checkout URL (field from Java service)
  checkoutUrl?: string; // alias — use authorizationUrl first
  accessCode?: string; // Paystack access code
  paystackReference?: string;
  message?: string;
}

/**
 * Verify Payment Request
 * Sent by Next.js to Java service after user returns from Paystack
 */
export interface VerifyPaymentRequest {
  reference: string;
}

/**
 * Verify Payment Response
 * Returned from Java/Spring Boot service confirming payment status
 * Includes enrollment details created by database trigger
 */
export interface VerifyPaymentResponse {
  paymentId?: string;
  id?: string;
  reference: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount?: number;
  amountCents?: number;
  courseId: string;
  userId: string;
  paystackReference?: string;
  paystackResponse?: Record<string, any>; // Full Paystack response
  
  // Enrollment details (created by database trigger on SUCCESS)
  enrollmentId?: string; // Created when payment succeeds
  enrollmentStatus?: string; // 'active', 'completed', 'inactive'
  hasEnrollment?: boolean; // Confirms enrollment was created
  isPaid?: boolean; // Confirms payment was successful
  
  // Metadata
  message?: string;
  paidAt?: string; // ISO timestamp when payment confirmed
  createdAt?: string;
}

/**
 * Purchase Status Response
 * Boolean: has user already purchased this course?
 */
export interface PurchaseStatusResponse {
  isPurchased: boolean;
  paymentId?: string;
  status?: PaymentStatus;
  enrollmentId?: string;
}

/**
 * Transaction Record
 * From Java service immutable ledger
 * Used for compliance & audit reports
 */
export interface Transaction {
  id: string;
  type: 'PAYMENT' | 'REFUND' | 'CHARGEBACK' | 'DISPUTE';
  paymentId?: string;
  amount_cents: number;
  reference: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  user_id: string;
  created_at: Date;
  metadata?: Record<string, any>;
}

/**
 * Transaction Summary
 * For user dashboard / analytics
 */
export interface TransactionSummary {
  totalTransactions: number;
  completedTransactions: number;
  totalAmountCents: number;
  currency: string;
  averageAmountCents: number;
}

/**
 * Create Local Payment Record
 * For axioquan's payments table
 */
export interface CreateLocalPaymentInput {
  user_id: string;
  course_id: string;
  payment_reference: string;
  payment_id: string;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
}

/**
 * Link Payment to Enrollment
 * After payment succeeds and enrollment is created
 */
export interface LinkPaymentRequest {
  payment_id: string;
  enrollment_id: string;
  verified_at: Date;
}
