/**
 * Clerk Authentication Configuration
 * 
 * This module exports Clerk middleware and utilities for authentication.
 * Replaces the previous Better Auth implementation.
 */

import { clerkMiddleware, getAuth, requireAuth, clerkClient } from '@clerk/express';

// Export Clerk middleware for Express
export const auth = clerkMiddleware();

// Middleware to require authentication
export const requireAuthentication = requireAuth();

// Get user from request (for protected routes)
export const getUserFromRequest = (req) => {
  const auth = getAuth(req);
  return auth;
};

// Get Clerk client for server-side operations
export const clerk = clerkClient;

console.log("🔧 Clerk authentication initialized");