import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSignUp, useUser } from "@clerk/clerk-react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, isLoaded: isSignUpLoaded, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    // If already signed in, redirect to dashboard
    if (isSignedIn) {
      navigate('/user');
    }
  }, [searchParams, isSignedIn, navigate]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (!isSignUpLoaded || !signUp) {
      setError("Please go back to registration and try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete") {
        console.log("Verification successful:", result);
        setSuccess(true);
        await setActive({ session: result.createdSessionId });
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      const errorMsg = err.errors?.[0]?.message || "Verification failed. Please check the code and try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isSignUpLoaded || !signUp) {
      setError("Please go back to registration and try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      console.log("Verification code resent");
      setResendCountdown(60);
    } catch (err) {
      console.error("Resend error:", err);
      const errorMsg = err.errors?.[0]?.message || "Failed to resend code. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-500/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400 text-sm">
            We've sent a verification code to <span className="text-emerald-400 font-semibold">{email}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl p-6 bg-white/10 backdrop-blur-md border border-white/25 ring-1 ring-emerald-500/15 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white text-lg font-semibold mb-2">Email Verified!</p>
              <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Verification Code
                </label>
                <motion.input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength="6"
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-3 px-1 text-center tracking-widest focus:outline-none focus:border-emerald-400 transition-colors"
                  whileFocus={{ scale: 1.005 }}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors shadow-[0_12px_30px_rgba(16,185,129,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </motion.button>

              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm mb-3">Didn't receive the code?</p>
                <motion.button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading || resendCountdown > 0}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-xs mt-6"
        >
          Your email address is used only for verification and account security.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
