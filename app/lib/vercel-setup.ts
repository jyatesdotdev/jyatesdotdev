'use server';

import { prisma } from './prisma';

// This function helps determine if we're running in development or production
export function isVercelProduction() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}

// Function to detect the current environment
export function getCurrentEnvironment() {
  if (isVercelProduction()) {
    return 'production';
  }
  return 'development';
}

// This function can be used to run initialization code for the database
export async function initializeDatabase() {
  try {
    // Ping the database to ensure connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
    return { success: true };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, error };
  }
}
