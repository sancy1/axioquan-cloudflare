// /lib/db/index.ts

import { neon } from '@neondatabase/serverless';

// Allow build to succeed without DATABASE_URL
// Real value is injected by Render at runtime
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ [BUILD] DATABASE_URL not set - skipping connection at build time');
}

// Only create connection if DATABASE_URL exists
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null as any;

// Connection test helper
export async function testConnection() {
  if (!DATABASE_URL) {
    return { success: false, error: 'DATABASE_URL not set' };
  }
  try {
    const result = await sql`SELECT 1 as test_value, NOW() as current_time`;
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return { success: false, error };
  }
}