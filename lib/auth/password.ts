


// /lib/auth/password.ts

import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate username against platform rules.
 * Rules:
 *  - 3–20 characters
 *  - Lowercase letters (a–z), numbers (0–9), underscores (_) and hyphens (-) only
 *  - Must start with a lowercase letter
 *  - Must end with a letter or number (not _ or -)
 *  - No two consecutive special characters (e.g. -- __ _- -_)
 *
 * Valid examples: john_doe  alex123  user-42  maria_s
 */
export function validateUsername(username: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (username.length < 3 || username.length > 20) {
    errors.push('Username must be between 3 and 20 characters');
  }

  if (!/^[a-z]/.test(username)) {
    errors.push('Username must start with a lowercase letter');
  }

  if (/[^a-z0-9_-]/.test(username)) {
    errors.push('Username may only contain lowercase letters, numbers, _ and -');
  }

  if (/[_-]$/.test(username)) {
    errors.push('Username must end with a letter or number');
  }

  if (/[_-]{2}/.test(username)) {
    errors.push('Username cannot contain consecutive _ or - characters');
  }

  return { isValid: errors.length === 0, errors };
}

