
// /lib/auth/actions.ts
//  # User authentication actions (login/signup)

'use server';

import { sql } from '@lib/db';
import { hashPassword, validatePasswordStrength, validateUsername, verifyPassword } from './password';
import { SignUpFormData, LoginFormData, AuthUser, ChangePasswordData, PasswordResetRequestData, PasswordResetConfirmData, TokenValidationResponse } from '@/types/auth';
import { User } from '@/types/database';
import { getSession, createSession, destroySession, refreshSession } from './session';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { sendPasswordResetOTP, sendEmailVerificationOTP } from '@/lib/email/utils';
import { generatePaymentToken, paymentApi } from '@/lib/payment/java-payment-api';


/**
 * Handles secure user signup with optional role parameter
 */
export async function signUpUser(formData: SignUpFormData): Promise<{
  success: boolean;
  message: string;
  user?: User;
  errors?: string[];
}> {
  try {
    // 1️⃣ Validate username
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      return {
        success: false,
        message: 'Invalid username',
        errors: usernameValidation.errors,
      };
    }

    // 2️⃣ Validate password strength
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 3️⃣ Confirm password match
    if (formData.password !== formData.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
        errors: ['Passwords do not match'],
      };
    }

    // 4️⃣ Check for existing user
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${formData.email} OR username = ${formData.username}
    `;

    if (existingUser.length > 0) {
      return {
        success: false,
        message: 'User already exists',
        errors: ['Email or username already registered'],
      };
    }

    // 4️⃣ Hash password
    const hashedPassword = await hashPassword(formData.password);

    // 5️⃣ Create new user
    const newUserRows = await sql`
      INSERT INTO users (username, email, password, name)
      VALUES (${formData.username}, ${formData.email}, ${hashedPassword}, ${formData.name})
      RETURNING id, username, email, name, created_at, is_active, locale, timezone
    `;

    const newUser = newUserRows[0] as User;
    if (!newUser) throw new Error('User creation failed — no record returned');

    // 6️⃣ Determine role to assign (default: student, or provided role)
    const roleNameToAssign = formData.role || 'student';
    const roleRows = await sql`
      SELECT id FROM roles WHERE name = ${roleNameToAssign} LIMIT 1
    `;
    
    if (roleRows.length === 0) {
      throw new Error(`Role '${roleNameToAssign}' not found in database`);
    }

    const roleId = roleRows[0].id;

    // 7️⃣ Assign the chosen role
    await sql`
      INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
      VALUES (${newUser.id}, ${roleId}, true, NOW())
    `;

    // 8️⃣ Create empty profile
    await sql`
      INSERT INTO user_profiles (
        user_id,
        skills,
        portfolio_urls,
        learning_goals,
        preferred_topics,
        expertise_levels,
        achievements,
        social_links
      )
      VALUES (
        ${newUser.id},
        ARRAY[]::text[],
        ARRAY[]::text[],
        ARRAY[]::text[],
        ARRAY[]::text[],
        '{}'::jsonb,
        '{}'::jsonb,
        '{}'::jsonb
      )
    `;

    // 9️⃣ User signup complete
    // Note: No user registration with payment service needed
    // Payment service only requires existing users (must be created in their database)
    // Token generation will work for any existing user via /api/v1/auth/generate-token

    // ✅ Return success
    return {
      success: true,
      message: `User registered successfully as ${roleNameToAssign}`,
      user: newUser,
    };
  } catch (error: any) {
    console.error('❌ User registration error:', error);
    return {
      success: false,
      message: 'Registration failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Authenticate user with email and password
 * Returns user data without password if successful
 */
export async function loginUser(credentials: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}> {
  try {
    // 1️⃣ Detect whether the identifier is an email or a username
    const identifier = credentials.email.trim().toLowerCase();
    const isEmail = identifier.includes('@');

    // 2️⃣ Get user and roles — query by email OR username
    let userWithPassword;
    if (isEmail) {
      userWithPassword = await sql`
        SELECT
          u.*,
          ARRAY_AGG(r.name) AS roles,
          (
            SELECT r.name
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = u.id AND ur.is_primary = true
            LIMIT 1
          ) AS primary_role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.email = ${identifier} AND u.is_active = true
        GROUP BY u.id
        LIMIT 1
      `;
    } else {
      userWithPassword = await sql`
        SELECT
          u.*,
          ARRAY_AGG(r.name) AS roles,
          (
            SELECT r.name
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = u.id AND ur.is_primary = true
            LIMIT 1
          ) AS primary_role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.username = ${identifier} AND u.is_active = true
        GROUP BY u.id
        LIMIT 1
      `;
    }

    const user = userWithPassword[0] as (User & { roles: string[]; primary_role: string });
    if (!user) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
      };
    }

    // 2️⃣ Verify password
    if (!user.password || !(await verifyPassword(credentials.password, user.password))) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
      };
    }

    // 3️⃣ Update last login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    // 4️⃣ Build safe user object
    const { password: _, ...userWithoutPassword } = user;
    const authUser: AuthUser = {
      id: userWithoutPassword.id,
      username: userWithoutPassword.username,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      image: userWithoutPassword.image,
      roles: userWithoutPassword.roles?.filter((r) => r !== null) || [],
      primaryRole: userWithoutPassword.primary_role || 'student',
    };

    return {
      success: true,
      message: 'Login successful',
      user: authUser,
    };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Login user and create session
 */
export async function loginWithSession(credentials: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}> {
  try {
    const result = await loginUser(credentials);

    if (result.success && result.user) {
      // ✅ Generate JWT token from payment service for API authentication
      let paymentToken: string | undefined = undefined;

      try {
        console.log('[AUTH] Generating payment token for:', result.user.email);
        const tokenResponse = await generatePaymentToken(result.user.id, result.user.email, result.user.name);

        console.log('[AUTH] Token response:', {
          success: tokenResponse.success,
          hasData: !!tokenResponse.data,
          dataKeys: tokenResponse.data ? Object.keys(tokenResponse.data) : [],
          tokenExists: !!tokenResponse.data?.token,
        });

        if (tokenResponse.success && tokenResponse.data?.token) {
          paymentToken = tokenResponse.data.token;
          console.log('[AUTH] ✓ Payment token generated successfully - length:', paymentToken.length);
        } else {
          console.warn('[AUTH] ⚠️ Failed to generate payment token:', {
            success: tokenResponse.success,
            error: tokenResponse.error,
            data: tokenResponse.data,
          });
          // Don't fail login if payment token generation fails - user can still use platform
          // Payment requests will show clear error about missing token
        }
      } catch (tokenError) {
        console.error('[AUTH] Error generating payment token:', tokenError);
        // Continue with login even if token generation fails
      }

      // ✅ Create session with payment token
      console.log('[AUTH] Creating session with payment token:', paymentToken ? 'YES' : 'NO');
      
      await createSession({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        roles: result.user.roles,
        primaryRole: result.user.primaryRole,
        paymentToken, // Include JWT token from payment service
      });

      return result;
    }

    return result;
  } catch (error: any) {
    console.error('❌ Login with session error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Logout user and destroy session
 * @deprecated Use logoutAction instead for server actions
 */
export async function logoutUser() {
  await destroySession();
  return { success: true, message: 'Logged out successfully' };
}

/**
 * Verify user's current password (for password change functionality)
 */
export async function verifyCurrentPassword(userId: string, password: string): Promise<boolean> {
  try {
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;
    if (!user[0]?.password) return false;
    return await verifyPassword(password, user[0].password);
  } catch (error) {
    console.error('❌ Password verification error:', error);
    return false;
  }
}

/**
 * Fetch user by email (active only)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1
    `;
    return users[0] as User || null;
  } catch (error) {
    console.error('❌ Error getting user by email:', error);
    return null;
  }
}

/**
 * Fetch user by ID (active only)
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id} AND is_active = true LIMIT 1
    `;
    return users[0] as User || null;
  } catch (error) {
    console.error('❌ Error getting user by ID:', error);
    return null;
  }
}

/**
 * Server action to handle user logout with redirect
 * Use this for client components that need to trigger logout
 */
export async function logoutAction() {
  'use server';
  
  await destroySession();
  redirect('/');
}

/**
 * Refresh user session - can be called from client components
 * Returns success status and message
 */
export async function refreshUserSession(): Promise<{
  success: boolean;
  message: string;
}> {
  'use server';
  
  const refreshed = await refreshSession();
  
  if (refreshed) {
    return {
      success: true,
      message: 'Session refreshed successfully',
    };
  } else {
    return {
      success: false,
      message: 'Failed to refresh session - user not authenticated',
    };
  }
}

/**
 * Check if user is authenticated (for client components)
 * Returns basic auth status without exposing sensitive data
 */
export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    primaryRole: string;
  };
}> {
  'use server';
  
  const { getSession } = await import('./session');
  const session = await getSession();
  
  if (!session) {
    return { isAuthenticated: false };
  }
  
  return {
    isAuthenticated: true,
    user: {
      name: session.name,
      email: session.email,
      primaryRole: session.primaryRole,
    },
  };
}

/**
 * Update user profile information
 */
export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
}): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const updatedUser = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${profileData.name}, name),
        bio = COALESCE(${profileData.bio}, bio),
        timezone = COALESCE(${profileData.timezone}, timezone),
        locale = COALESCE(${profileData.locale}, locale),
        updated_at = NOW()
      WHERE id = ${userId} AND is_active = true
      RETURNING id, name, email, bio, timezone, locale
    `;

    if (updatedUser.length === 0) {
      return {
        success: false,
        message: 'User not found or inactive',
        errors: ['User not found'],
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    return {
      success: false,
      message: 'Profile update failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}



// Add this to /lib/auth/actions.ts

/**
 * Delete user account with all associated data
 * Requires password confirmation for security
 */
export async function deleteUserAccount(
  userId: string, 
  password: string
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Verify user identity with password
    const passwordValid = await verifyCurrentPassword(userId, password);
    if (!passwordValid) {
      return {
        success: false,
        message: 'Account deletion failed',
        errors: ['Invalid password provided'],
      };
    }

    // Import the deletion function
    const { deleteUserAccount: deleteAccount } = await import('@/lib/db/queries/users');
    const deletionResult = await deleteAccount(userId);

    if (deletionResult.success) {
      // Destroy the session after successful deletion
      await destroySession();
    }

    return deletionResult;
  } catch (error: any) {
    console.error('❌ Error in deleteUserAccount action:', error);
    return {
      success: false,
      message: 'Account deletion failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Server action to handle account deletion with redirect
 * ⚠️ IMPORTANT: Deletes ALL data including paid course enrollments
 * When user re-registers, they must repay for paid courses
 */
// Then update the deleteAccountAction function:
export async function deleteAccountAction(password: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  'use server';
  
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to delete your account'],
      };
    }

    console.log(`[DELETE ACCOUNT] Starting deletion for user: ${session.userId}`);

    const result = await deleteUserAccount(session.userId, password);
    
    if (result.success) {
      console.log(`[DELETE ACCOUNT] ✅ Account successfully deleted, destroying session...`);
      // Destroy session and redirect to homepage
      await destroySession();
      redirect('/?message=account-deleted');
    }
    
    console.error(`[DELETE ACCOUNT] ❌ Deletion failed:`, result.errors);
    return result;
  } catch (error: any) {
    // Handle PAID_COURSE_ENROLLMENT_ERROR - ignore it during account deletion
    if (error.message && error.message.includes('PAID_COURSE_ENROLLMENT_ERROR')) {
      console.warn('[DELETE ACCOUNT] Paid course error - force deleting anyway:', error.message);
      // Continue with deletion despite paid course errors
      try {
        const session = await getSession();
        if (session) {
          await destroySession();
        }
        redirect('/?message=account-deleted-with-warnings');
      } catch (redirectError) {
        return {
          success: true,
          message: 'Account deleted (redirecting...)',
          errors: undefined,
        };
      }
    }
    
    console.error('❌ Delete account action error:', error);
    return {
      success: false,
      message: 'Account deletion failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}





/**
 * Change user password with current password verification
 */
export async function changePassword(
  userId: string, 
  passwordData: ChangePasswordData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // 1️⃣ Verify current password
    const isCurrentPasswordValid = await verifyCurrentPassword(userId, passwordData.currentPassword);
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Password change failed',
        errors: ['Current password is incorrect'],
      };
    }

    // 2️⃣ Validate new password strength
    const passwordValidation = validatePasswordStrength(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 3️⃣ Check if new password is different from current
    if (passwordData.currentPassword === passwordData.newPassword) {
      return {
        success: false,
        message: 'Password change failed',
        errors: ['New password must be different from current password'],
      };
    }

    // 4️⃣ Check password history (prevent reuse)
    const isPasswordInHistory = await checkPasswordHistory(userId, passwordData.newPassword);
    if (isPasswordInHistory) {
      return {
        success: false,
        message: 'Password change failed',
        errors: ['You cannot use a previously used password'],
      };
    }

    // 5️⃣ Hash new password
    const hashedNewPassword = await hashPassword(passwordData.newPassword);

    // 6️⃣ Update password in database
    await sql`
      UPDATE users 
      SET password = ${hashedNewPassword}, updated_at = NOW() 
      WHERE id = ${userId} AND is_active = true
    `;

    // 7️⃣ Add to password history
    await addToPasswordHistory(userId, hashedNewPassword);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error: any) {
    console.error('❌ Password change error:', error);
    return {
      success: false,
      message: 'Password change failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Check if password exists in user's password history
 */
async function checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
  try {
    const history = await sql`
      SELECT password FROM password_history 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    for (const record of history) {
      if (await verifyPassword(newPassword, record.password)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Password history check error:', error);
    return false;
  }
}


/**
 * Add password to history (keep last 5 passwords)
 */
async function addToPasswordHistory(userId: string, hashedPassword: string): Promise<void> {
  try {
    // Insert new password record
    await sql`
      INSERT INTO password_history (user_id, password) 
      VALUES (${userId}, ${hashedPassword})
    `;

    // Keep only last 5 passwords
    await sql`
      DELETE FROM password_history 
      WHERE user_id = ${userId} 
      AND id NOT IN (
        SELECT id FROM password_history 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT 5
      )
    `;
  } catch (error) {
    console.error('❌ Add to password history error:', error);
  }
}

/**
 * Server action for changing password (for use in client components)
 */
export async function changePasswordAction(formData: ChangePasswordData): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  'use server';

  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Authentication required',
        errors: ['You must be logged in to change your password'],
      };
    }

    return await changePassword(session.userId, formData);
  } catch (error: any) {
    console.error('❌ Change password action error:', error);
    return {
      success: false,
      message: 'Password change failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}






// /lib/auth/actions.ts - Update both requestPasswordReset and resetPasswordWithToken functions

/**
 * Request password reset - sends email with reset link
/**
 * Request password reset - sends email with reset link
 */
export async function requestPasswordReset(
  data: PasswordResetRequestData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // 1️⃣ Find user by email
    const users = await sql`
      SELECT id, email, name, is_active 
      FROM users 
      WHERE email = ${data.email} AND is_active = true 
      LIMIT 1
    `;

    const user = users[0] as (User & { name: string }) | undefined;

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: 'If an account with that email exists, a 6-digit code has been sent.',
      };
    }

    // 2️⃣ Generate 6-digit OTP
    const resetToken = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // 3️⃣ Delete any existing reset tokens for this user
    await sql`
      DELETE FROM password_reset_tokens 
      WHERE user_id = ${user.id}
    `;

    // 4️⃣ Store new reset token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires)
      VALUES (${user.id}, ${resetToken}, ${expiresAt})
    `;

    // 5️⃣ Send OTP via EmailJS (port 443 — bypasses Render firewall)
    const emailSent = await sendPasswordResetOTP(user.email, resetToken);

    if (!emailSent) {
      // Don't throw error, just log and continue
      console.error('❌ Failed to send password reset OTP for:', user.email);
      return {
        success: true,
        message: 'If an account with that email exists, a 6-digit code has been sent.',
      };
    }

    // 7️⃣ Log the reset request (handle undefined IP properly)
    await sql`
      INSERT INTO user_audit_logs (user_id, action, ip_address, user_agent)
      VALUES (${user.id}, 'password_reset_requested', ${data.ipAddress || null}, ${data.userAgent || null})
    `;

    return {
      success: true,
      message: 'If an account with that email exists, a 6-digit code has been sent.',
    };
  } catch (error: any) {
    console.error('❌ Password reset request error:', error);
    return {
      success: true,
      message: 'If an account with that email exists, a 6-digit code has been sent.',
    };
  }
}


/**
 * Validate password reset token
 */
export async function validateResetToken(token: string): Promise<TokenValidationResponse> {
  try {
    // 1️⃣ Find valid, unused token
    const tokens = await sql`
      SELECT prt.*, u.email, u.name, u.is_active
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = ${token} 
        AND prt.expires > NOW() 
        AND prt.used = false
        AND u.is_active = true
      LIMIT 1
    `;

    const resetToken = tokens[0] as any;

    if (!resetToken) {
      return {
        isValid: false,
        message: 'Invalid or expired reset token',
      };
    }

    return {
      isValid: true,
      message: 'Token is valid',
      user: {
        id: resetToken.user_id,
        email: resetToken.email,
        name: resetToken.name,
      },
    };
  } catch (error: any) {
    console.error('❌ Token validation error:', error);
    return {
      isValid: false,
      message: 'Token validation failed',
    };
  }
}


// /lib/auth/actions.ts

// In /lib/auth/actions.ts - Remove the duplicate verifyPasswordHistory function and update resetPasswordWithToken

// /lib/auth/actions.ts - Update resetPasswordWithToken function

/**
 * Reset password using token
 */
/**
 * Reset password using token
 */
export async function resetPasswordWithToken(
  data: PasswordResetConfirmData
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // 1️⃣ Validate token first
    const tokenValidation = await validateResetToken(data.token);
    if (!tokenValidation.isValid || !tokenValidation.user) {
      return {
        success: false,
        message: 'Invalid or expired reset token',
        errors: ['Please request a new password reset link'],
      };
    }

    const userId = tokenValidation.user.id;

    // 2️⃣ Validate new password strength
    const passwordValidation = validatePasswordStrength(data.newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 3️⃣ Check password history (prevent reuse)
    const isPasswordInHistory = await checkPasswordHistory(userId, data.newPassword);
    if (isPasswordInHistory) {
      return {
        success: false,
        message: 'Password reset failed',
        errors: ['You cannot use a previously used password'],
      };
    }

    // 4️⃣ Hash new password
    const hashedNewPassword = await hashPassword(data.newPassword);

    // 5️⃣ Update password WITHOUT transaction
    // Update user password
    await sql`
      UPDATE users 
      SET password = ${hashedNewPassword}, updated_at = NOW() 
      WHERE id = ${userId}
    `;

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens 
      SET used = true, used_at = NOW() 
      WHERE token = ${data.token}
    `;

    // Add to password history
    await sql`
      INSERT INTO password_history (user_id, hashed_password)
      VALUES (${userId}, ${hashedNewPassword})
    `;

    // 6️⃣ Log the password reset (handle undefined IP properly)
    await sql`
      INSERT INTO user_audit_logs (user_id, action, ip_address, user_agent)
      VALUES (${userId}, 'password_reset_completed', ${data.ipAddress || null}, ${data.userAgent || null})
    `;

    // 7️⃣ Invalidate all existing sessions for security
    await sql`
      UPDATE sessions 
      SET is_active = false 
      WHERE user_id = ${userId}
    `;

    return {
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    };
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    return {
      success: false,
      message: 'Password reset failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Verify a 6-digit OTP and reset the user's password.
 * Accepts email + otp + newPassword.
 * The bypass code (029780) always passes for portfolio/employer testing.
 */
export async function verifyOTPAndResetPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string; errors?: string[] }> {
  try {
    const BYPASS_CODE = '029780';

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, message: 'Passwords do not match', errors: ["Passwords don't match"] };
    }

    const passwordValidation = validatePasswordStrength(data.newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, message: 'Password validation failed', errors: passwordValidation.errors };
    }

    const users = await sql`
      SELECT id, email FROM users WHERE email = ${data.email} AND is_active = true LIMIT 1
    `;
    const user = users[0] as any;
    if (!user) {
      return { success: false, message: 'Invalid or expired code', errors: ['Invalid verification code'] };
    }

    // Accept bypass code OR valid DB token
    let isValid = data.otp === BYPASS_CODE;
    if (!isValid) {
      const tokens = await sql`
        SELECT id FROM password_reset_tokens
        WHERE user_id = ${user.id}
          AND token = ${data.otp}
          AND expires > NOW()
          AND used = false
        LIMIT 1
      `;
      isValid = tokens.length > 0;
    }

    if (!isValid) {
      return { success: false, message: 'Invalid or expired code', errors: ['The verification code is invalid or has expired'] };
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await sql`UPDATE users SET password = ${hashedPassword}, updated_at = NOW() WHERE id = ${user.id}`;

    if (data.otp !== BYPASS_CODE) {
      await sql`
        UPDATE password_reset_tokens SET used = true, used_at = NOW()
        WHERE user_id = ${user.id} AND token = ${data.otp}
      `;
    }

    await sql`UPDATE sessions SET is_active = false WHERE user_id = ${user.id}`;

    return { success: true, message: 'Password reset successfully. You can now log in with your new password.' };
  } catch (error: any) {
    console.error('❌ OTP password reset error:', error);
    return { success: false, message: 'Password reset failed', errors: [error.message || 'An unexpected error occurred'] };
  }
}

/**
 * Send a 6-digit email verification OTP to a newly registered user.
 * Call this AFTER signUpUser succeeds. Stores the token in password_reset_tokens.
 * Dev mode: OTP is printed to the terminal (no EmailJS call).
 */
export async function sendSignupVerificationOTP(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const users = await sql`
      SELECT id, email FROM users WHERE email = ${email} AND is_active = true LIMIT 1
    `;
    const user = users[0] as any;
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Remove any existing token for this user before inserting a fresh one
    await sql`DELETE FROM password_reset_tokens WHERE user_id = ${user.id}`;
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires)
      VALUES (${user.id}, ${otp}, ${expiresAt})
    `;

    const emailSent = await sendEmailVerificationOTP(user.email, otp);
    if (!emailSent) {
      console.error('❌ Failed to send email verification OTP for:', user.email);
    }

    return { success: true, message: 'Verification code sent to your email.' };
  } catch (error: any) {
    console.error('❌ sendSignupVerificationOTP error:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
}

/**
 * Verify the signup email OTP and create the user session.
 * Accepts the bypass code 029780 for employer / portfolio testing.
 */
export async function verifySignupOTPAndCreateSession(email: string, otp: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const BYPASS_CODE = '029780';

    const users = await sql`
      SELECT
        u.id, u.email, u.name, u.image,
        ARRAY_AGG(r.name) AS roles,
        (
          SELECT r2.name FROM user_roles ur2
          JOIN roles r2 ON ur2.role_id = r2.id
          WHERE ur2.user_id = u.id AND ur2.is_primary = true
          LIMIT 1
        ) AS primary_role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = ${email} AND u.is_active = true
      GROUP BY u.id
      LIMIT 1
    `;
    const user = users[0] as any;
    if (!user) {
      return { success: false, message: 'Invalid verification code', errors: ['User not found'] };
    }

    let isValid = otp === BYPASS_CODE;
    if (!isValid) {
      const tokens = await sql`
        SELECT id FROM password_reset_tokens
        WHERE user_id = ${user.id}
          AND token = ${otp}
          AND expires > NOW()
          AND used = false
        LIMIT 1
      `;
      isValid = tokens.length > 0;
    }

    if (!isValid) {
      return {
        success: false,
        message: 'Invalid or expired code',
        errors: ['The verification code is invalid or has expired'],
      };
    }

    // Mark token as used (skip for bypass code)
    if (otp !== BYPASS_CODE) {
      await sql`
        UPDATE password_reset_tokens SET used = true, used_at = NOW()
        WHERE user_id = ${user.id} AND token = ${otp}
      `;
    }

    // Generate payment token (best-effort — login still succeeds without it)
    let paymentToken: string | undefined;
    try {
      const tokenResponse = await generatePaymentToken(user.id, user.email, user.name);
      if (tokenResponse.success && tokenResponse.data?.token) {
        paymentToken = tokenResponse.data.token;
      }
    } catch (tokenError) {
      console.error('[AUTH] Payment token error during signup verification:', tokenError);
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles?.filter((r: string | null) => r !== null) || [],
      primaryRole: user.primary_role || 'student',
      paymentToken,
    });

    return { success: true, message: 'Email verified. Welcome aboard!' };
  } catch (error: any) {
    console.error('❌ verifySignupOTPAndCreateSession error:', error);
    return {
      success: false,
      message: 'Verification failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}