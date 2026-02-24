import React, { useEffect } from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
import { useDarkMode } from '../../context/DarkModeContext'
import { useUser } from '@clerk/clerk-react'

function Layout() {
  const { isDarkMode } = useDarkMode();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const username = user.username || user.firstName || user.fullName || 'User';
      const userInfo = {
        username: username,
        email: user.primaryEmailAddress?.emailAddress,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName
      };
      
      // Store in localStorage for visibility
      localStorage.setItem('username', username);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      console.log('👤 Logged in user:', userInfo);
    }
  }, [isLoaded, user]);

  return (
    <>
      <div className={`min-h-screen flex flex-col ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
          : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900'
      } relative overflow-hidden`}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default Layout