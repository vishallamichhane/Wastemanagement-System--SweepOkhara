import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedAdminRoute — Clerk role-based guard for admin pages.
 *
 * Checks the signed-in Clerk user's `publicMetadata.role`.
 * If the role is NOT 'admin', the visitor is redirected to /admin/login.
 * While Clerk is still loading, a spinner is shown.
 */
export default function ProtectedAdminRoute({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();

  // Still loading Clerk session
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not signed in at all → send to admin login
  if (!isSignedIn || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Signed in but NOT an admin
  const role = user.publicMetadata?.role;
  if (role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Authenticated admin
  return children;
}
