import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedCollectorRoute — Auth guard for collector pages.
 *
 * Checks localStorage for a valid collector session (collectorToken, collectorData, userRole).
 * If not authenticated, redirects to /login.
 */
export default function ProtectedCollectorRoute({ children }) {
  const collectorToken = localStorage.getItem('collectorToken');
  const collectorData = localStorage.getItem('collectorData');
  const userRole = localStorage.getItem('userRole');

  // Not authenticated as collector → redirect to login
  if (!collectorToken || !collectorData || userRole !== 'collector') {
    return <Navigate to="/login" replace />;
  }

  // Validate collectorData is parseable and has collectorId
  try {
    const data = JSON.parse(collectorData);
    if (!data || !data.collectorId) {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  // Authenticated collector
  return children;
}
