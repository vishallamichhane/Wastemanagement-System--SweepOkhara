import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const CollectorLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if collector is authenticated
    const checkAuth = () => {
      const collectorToken = localStorage.getItem('collectorToken');
      const collectorData = localStorage.getItem('collectorData');
      const userRole = localStorage.getItem('userRole');

      if (!collectorToken || !collectorData || userRole !== 'collector') {
        // Not authenticated, redirect to login
        navigate('/login', { replace: true });
        return;
      }

      try {
        const data = JSON.parse(collectorData);
        if (data && data.collectorId) {
          setIsAuthenticated(true);
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing collector data:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default CollectorLayout;
