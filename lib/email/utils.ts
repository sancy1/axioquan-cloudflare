
// /lib/email/utils.ts

// Remove 'use server' and add server-only import
import 'server-only';
import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

// Create email transporter
export function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

// Get email configuration from environment
export function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!),
    user: process.env.SMTP_USER!,
    password: process.env.SMTP_PASSWORD!,
    from: process.env.SMTP_FROM!,
  };
}

// Send email function
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  try {
    const config = getEmailConfig();
    const transporter = createTransporter(config);
    
    const result = await transporter.sendMail({
      from: config.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
    });
    
    console.log('✅ Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return false;
  }
}

/**
 * Test email configuration - Only use this in server components/actions
 */
export async function testEmailConfig(): Promise<{ success: boolean; message: string }> {
  try {
    const config = getEmailConfig();
    const transporter = createTransporter(config);
    
    // Verify connection configuration
    await transporter.verify();
    
    return {
      success: true,
      message: 'Email configuration is valid and ready to send emails',
    };
  } catch (error: any) {
    console.error('❌ Email configuration test failed:', error);
    return {
      success: false,
      message: `Email configuration test failed: ${error.message}`,
    };
  }
}

/**
 * Send email verification OTP via EmailJS REST API (port 443 — not blocked by Render).
 * Used during signup to verify the user's email address.
 * Dev mode: logs OTP to console only to preserve monthly quota.
 */
export async function sendEmailVerificationOTP(email: string, otp: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Email Verification OTP for ${email}: ${otp}`);
    return true;
  }

  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      user_email: email,
      otp_code: otp,
    },
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) return true;
    console.error('❌ EmailJS error:', await res.text());
    return false;
  } catch (err: any) {
    console.error('❌ EmailJS fetch error:', err.message);
    return false;
  }
}

/**
 * Send password reset OTP via EmailJS REST API (port 443 — not blocked by Render).
 * Dev mode: logs OTP to console only to preserve monthly quota.
 */
export async function sendPasswordResetOTP(email: string, otp: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Password Reset OTP for ${email}: ${otp}`);
    return true;
  }

  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      user_email: email,
      otp_code: otp,
    },
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) return true;
    console.error('❌ EmailJS error:', await res.text());
    return false;
  } catch (err: any) {
    console.error('❌ EmailJS fetch error:', err.message);
    return false;
  }
}