/**
 * Clerk Authentication Client
 * 
 * This module provides authentication utilities using Clerk.
 * Components should use Clerk hooks directly:
 * - useUser() for user data
 * - useAuth() for auth state
 * - useSignIn() for sign in
 * - useSignUp() for sign up
 * - useClerk() for clerk instance
 */

// Re-export Clerk hooks for convenience
export { 
  useUser, 
  useAuth, 
  useSignIn, 
  useSignUp, 
  useClerk,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from '@clerk/clerk-react';

// API base URL for backend calls
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

console.log("Clerk authentication client initialized");