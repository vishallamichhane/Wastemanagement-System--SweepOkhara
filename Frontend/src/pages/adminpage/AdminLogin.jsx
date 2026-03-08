import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useSignIn, useClerk } from '@clerk/clerk-react';
import { FiLock, FiMail, FiAlertTriangle, FiShield, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import sweepPokharaLogo from '../../assets/images/sweeppokhara-final-logo.png';

// Sync admin user to MongoDB (auto-creates if missing, sets role to admin)
async function syncAdminToMongoDB(user) {
  try {
    await axios.post('/api/users/create', {
      clerkId: user.id,
      username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'admin',
      email: user.primaryEmailAddress?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      address: user.publicMetadata?.address || '',
      ward: user.publicMetadata?.ward || '',
      phone: user.publicMetadata?.phone || '',
      role: 'admin',
    });
    console.log('✅ Admin user synced to MongoDB');
  } catch (err) {
    // If user already exists, that's fine
    console.log('Admin MongoDB sync:', err.response?.data?.message || err.message);
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
  const { signOut } = useClerk();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotAdmin, setShowNotAdmin] = useState(false);

  // If already signed in, check if admin
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === 'admin') {
        // Sync admin user to MongoDB, then redirect
        syncAdminToMongoDB(user).then(() => {
          navigate('/admin', { replace: true });
        });
      } else {
        // Signed in but not admin
        setShowNotAdmin(true);
      }
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isSignInLoaded) {
        setError('Authentication service not ready. Please try again.');
        setIsLoading(false);
        return;
      }

      // Sign in with Clerk (two-step flow)
      // Step 1: Create sign-in attempt with identifier
      const result = await signIn.create({
        identifier: email,
      });

      // Step 2: Attempt first factor with password
      let completeResult;
      if (result.status === 'needs_first_factor') {
        completeResult = await signIn.attemptFirstFactor({
          strategy: 'password',
          password: password,
        });
      } else if (result.status === 'complete') {
        completeResult = result;
      } else {
        setError('Unexpected sign-in status. Please try again.');
        setIsLoading(false);
        return;
      }

      if (completeResult.status === 'complete') {
        // Step 3: Activate the session
        await setActive({ session: completeResult.createdSessionId });
        
        // Redirect to admin — the useEffect will verify admin role
        window.location.href = '/admin';
      } else {
        setError('Sign-in not complete. Additional verification may be required.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      if (err.errors) {
        const clerkError = err.errors[0];
        if (clerkError.code === 'form_identifier_not_found') {
          setError('No account found with this email.');
        } else if (clerkError.code === 'form_password_incorrect') {
          setError('Incorrect password.');
        } else if (clerkError.code === 'strategy_for_user_invalid') {
          setError('This account uses Google Sign-In. Please use the correct login method.');
        } else {
          setError(clerkError.longMessage || clerkError.message || 'Login failed.');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutAndRetry = async () => {
    try {
      await signOut();
      setShowNotAdmin(false);
      setError('');
    } catch (err) {
      console.error('Signout error:', err);
    }
  };

  // Show "Not admin" screen if user is signed in but not admin
  if (showNotAdmin && isSignedIn && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-2">
            You are signed in as <strong>{user.primaryEmailAddress?.emailAddress}</strong>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            This account does not have administrator privileges. Please sign in with an admin account.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleSignOutAndRetry}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Out & Try Another Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiArrowLeft /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={sweepPokharaLogo} 
              alt="SweepPokhara Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiShield className="text-emerald-400 text-xl" />
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          </div>
          <p className="text-gray-400 text-sm">Authorized personnel only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sweeppokhara.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
                <FiAlertTriangle className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <FiShield className="text-lg" />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs">
              This portal is restricted to authorized administrators.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Unauthorized access attempts will be logged.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft /> Back to SweepPokhara
          </button>
        </div>
      </div>
    </div>
  );
}
