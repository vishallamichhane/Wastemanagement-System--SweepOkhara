import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedUserRoute — Clerk auth guard for user pages.
 *
 * Requires the visitor to be signed in via Clerk.
 * If not signed in, redirects to /login.
 * While Clerk is still loading, a spinner is shown.
 */
export default function ProtectedUserRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  // Still loading Clerk session
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated user
  return children;
}
