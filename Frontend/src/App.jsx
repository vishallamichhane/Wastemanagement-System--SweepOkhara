import { useState, useEffect } from 'react'
import './App.css'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import VerifyEmailPage from './pages/VerifyEmail'
import UserHomePage from './pages/userpage/UserHomepage';
import MapPage from './pages/userpage/Mapview';
import HomePage from './pages/Home';
import FeaturePage from './pages/Feature';
import AboutusPage from './pages/Aboutus';
import ContactPage from './pages/Contact';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SchedulePage from './pages/userpage/Schedule';
import ReportPage from './pages/userpage/Report';
import MyRepotPage from './pages/userpage/MyReport';
import Awareness1Page from './pages/userpage/Awareness1';
import Awareness2Page from './pages/userpage/Awareness2';
import Awareness3Page from './pages/userpage/Awareness3';
import ProfilePage from './pages/userpage/Profile';
import PrivacySettingsPage from './pages/userpage/Privacysetting';
import ChangePasswordPage from './pages/userpage/Changepassword';
import Privacy_PolicyPage from './pages/userpage/Policy';
import TermsPage from './pages/userpage/Terms';
import DashboardPage from './pages/collectorpage/Dashboard';
import UserLayout from './pages/userpage/Layout';
import WelcomeLayout from './pages/WelcomeLayout';
import CollectorLayout from './pages/collectorpage/CollectorLayout';
import AssignedTaskPage from './pages/collectorpage/Assignedtasks';
import CollectorMapPage from './pages/collectorpage/Collectormap';
import CollectorProfilePage from './pages/collectorpage/Profilecollector';
import CollectorReportsPage from './pages/collectorpage/Reports';
import AdminDashboard from './pages/adminpage/Admin';
import UserManagementPage from './pages/adminpage/UserManagement';
import { DarkModeProvider } from './context/DarkModeContext';
import { useUser, ClerkProvider } from '@clerk/clerk-react';

// Get Clerk publishable key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error("⚠️ Missing VITE_CLERK_PUBLISHABLE_KEY - Add it to your .env file")
}

function OAuthCallback() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (isSignedIn && user) {
      console.log("OAuth successful, user:", user);
      // Clerk handles email verification automatically
      navigate('/user');
    } else {
      navigate('/login?error=no_user');
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-white text-lg">Processing authentication...</p>
      </div>
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p>Missing Clerk Publishable Key. Please check your .env file.</p>
        </div>
      </div>
    );
  }
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      localization={{
        badge__lastUsed: " ",
        badge__primary: " ",
        lastAuthenticationStrategy: " ",
      }}
      appearance={{
        elements: {
          badge: { display: "none" },
          tagPrimaryText: { display: "none" },
          tag: { display: "none" },
          socialButtonsBlockButtonText__lastUsed: { display: "none" },
          lastAuthenticationStrategyBadge: { display: "none" },
        }
      }}
    >
      <DarkModeProvider>
        <Routes>
          {/* Routes for welcome layout*/}
          <Route element={<WelcomeLayout />}>
            <Route path='/' element= {<HomePage/>}/>
            <Route path='/feature' element= {<FeaturePage/>}/>
            <Route path='/aboutus' element= {<AboutusPage/>}/>
            <Route path='/contact' element= {<ContactPage/>}/>
            <Route path='/policy' element= {<Privacy_PolicyPage/>}/>
            <Route path='/terms' element= {<TermsPage/>}/>
          </Route>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route path='/api/auth/callback/google' element={<OAuthCallback />} />
          
          {/* Routes for user layout */}
          <Route path="/user" element={<UserLayout />} > 
            <Route index element={<UserHomePage />} />
            <Route path='schedule' element= {<SchedulePage/>}/>
          <Route path='myreport' element= {<MyRepotPage/>}/>
          <Route path='report' element= {<ReportPage/>}/>
          <Route path='awareness2' element= {<Awareness2Page/>}/>
          <Route path='awareness1' element= {<Awareness1Page/>}/>
          <Route path='awareness3' element= {<Awareness3Page/>}/>
          <Route path='profile' element= {<ProfilePage/>}>
            <Route path='privacy' element= {<PrivacySettingsPage/>}/>
            <Route path='changepw' element= {<ChangePasswordPage/>}/>
          </Route>
          <Route path='map' element= {<MapPage/>}/>
          <Route path='policy' element= {<Privacy_PolicyPage/>}/>
          <Route path='terms' element= {<TermsPage/>}/>
        </Route> 

        {/* Routes for collector layout */}
        <Route path="/collector" element={<CollectorLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<AssignedTaskPage />} />
          <Route path="map" element={<CollectorMapPage />} />
          <Route path="profile" element={<CollectorProfilePage />} />
          <Route path="reports" element={<CollectorReportsPage />} />
        </Route>

        {/* Routes for admin */}
        <Route path='/admin' element= {<AdminDashboard/>}/>
        <Route path='/usermanagement' element= {<UserManagementPage/>}/>
      </Routes>
      </DarkModeProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App
