import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("general");
  const [form, setForm] = useState({ phoneNumber: "", collectorId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    // Validation for collectors
    if (!form.collectorId) newErrors.collectorId = "Collector ID is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setErrors({});
      try {
        // Collector login logic (uses separate JWT auth)
        const response = await fetch('http://localhost:3000/api/collectors/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collectorId: form.collectorId,
            password: form.password,
            phoneNumber: form.phoneNumber,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Store collector data in localStorage
          localStorage.setItem('collectorToken', result.data.token);
          localStorage.setItem('collectorData', JSON.stringify(result.data));
          localStorage.setItem('userRole', 'collector');
          localStorage.setItem('username', result.data.name || result.data.collectorId);
          
          console.log('👤 Collector logged in:', {
            collectorId: result.data.collectorId,
            name: result.data.name,
            email: result.data.email
          });
          
          // Navigate to collector dashboard
          navigate('/collector/dashboard');
        } else {
          setErrors({ general: result.message || 'Invalid credentials. Please check your Collector ID, password, and phone number.' });
        }
        
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ general: 'Login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };



  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative min-h-screen overflow-hidden flex"
    >
      {/* Full-page Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.pinimg.com/1200x/e9/d8/86/e9d8861d3847922a7c3af7185092d901.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/55 to-black/65" />
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row px-6 sm:px-10 lg:px-12 py-10 gap-10"
      >
        {/* Left Side - Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-4">
              <p className="text-lg uppercase tracking-[0.25em] text-emerald-200/90 font-extrabold">Login</p>
              <h2 className="text-3xl font-extrabold text-white mt-1">Access your account</h2>
            </div>

            {/* Role Toggle */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full p-1 mb-5 backdrop-blur-md">
              {[
                { key: "general", label: "General User" },
                { key: "collector", label: "Waste Collector" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRole(item.key)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    role === item.key
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Shared form container — fixed size for both roles */}
            <div className="rounded-xl p-6 bg-white/10 backdrop-blur-md border border-white/25 ring-1 ring-emerald-500/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] min-h-[420px] flex flex-col">
              {role === "general" ? (
                <div className="flex flex-col flex-1 justify-center">
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: {
                          width: "100%"
                        },
                        card: {
                          width: "100%",
                          boxShadow: "none",
                          background: "transparent",
                          backdropFilter: "none",
                          border: "none",
                          padding: "0",
                          margin: "0"
                        },
                        headerTitle: {
                          display: "none"
                        },
                        headerSubtitle: {
                          display: "none"
                        },
                        header: {
                          display: "none"
                        },
                        cardBox: {
                          boxShadow: "none",
                          width: "100%"
                        },
                        form: {
                          gap: "1rem"
                        },
                        formFieldRow: {
                          marginBottom: "0"
                        },
                        formFieldLabel: {
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem"
                        },
                        formFieldInput: {
                          background: "transparent",
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.4)",
                          borderRadius: "0",
                          color: "#fff",
                          fontSize: "0.875rem",
                          padding: "0.5rem 0.25rem",
                          outline: "none",
                          boxShadow: "none"
                        },
                        formFieldInput__focused: {
                          borderBottom: "1px solid #34d399",
                          boxShadow: "none"
                        },
                        formButtonPrimary: {
                          width: "100%",
                          background: "linear-gradient(to right, #059669, #0d9488)",
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          padding: "0.75rem 0",
                          borderRadius: "0.5rem",
                          boxShadow: "0 12px 30px rgba(16,185,129,0.35)",
                          transition: "all 0.2s",
                          textTransform: "none",
                          letterSpacing: "0",
                          marginTop: "0.5rem",
                          border: "none",
                          outline: "none",
                          borderColor: "transparent",
                          borderWidth: "0"
                        },
                        formButtonPrimaryArrow: {
                          display: "none"
                        },
                        buttonArrowIcon: {
                          display: "none"
                        },
                        formButtonPrimary__loading: {
                          opacity: "0.5"
                        },
                        socialButtons: {
                          gap: "0.5rem",
                          marginTop: "0.75rem"
                        },
                        socialButtonsBlockButton: {
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "0.5rem",
                          color: "#fff",
                          padding: "0.625rem",
                          transition: "all 0.2s",
                          fontSize: "0.875rem"
                        },
                        socialButtonsBlockButtonText: {
                          color: "#fff",
                          fontWeight: "500"
                        },
                        dividerLine: {
                          background: "rgba(255,255,255,0.2)"
                        },
                        dividerText: {
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.75rem"
                        },
                        identityPreview: {
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "0.5rem"
                        },
                        identityPreviewText: {
                          color: "#fff"
                        },
                        identityPreviewEditButton: {
                          color: "#34d399"
                        },
                        alternativeMethodsBlockButton__passkey: {
                          display: "none"
                        },
                        tagPrimaryText: {
                          display: "none"
                        },
                        badge: {
                          display: "none"
                        },
                        lastAuthenticationStrategyBadge: {
                          display: "none"
                        },
                        formFieldAction: {
                          color: "#34d399"
                        },
                        formFieldInputShowPasswordButton: {
                          color: "#6ee7b7"
                        },
                        otpCodeFieldInput: {
                          borderColor: "rgba(255,255,255,0.3)",
                          color: "#fff",
                          background: "transparent"
                        },
                        formResendCodeLink: {
                          color: "#34d399"
                        },
                        alert: {
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          borderRadius: "0.5rem"
                        },
                        alertText: {
                          color: "#fff"
                        },
                        formFieldErrorText: {
                          color: "#f87171"
                        },
                        footer: {
                          display: "none"
                        },
                        footerAction: {
                          display: "none"
                        },
                        footerActionText: {
                          display: "none"
                        },
                        footerActionLink: {
                          display: "none"
                        }
                      },
                      layout: {
                        socialButtonsPlacement: "bottom"
                      },
                    }}
                    localization={{
                      formButtonPrimary: "Login as User",
                      signIn: {
                        socialButtonsBlockButton: "Continue with {{provider|titleize}}",
                        socialButtonsBlockButtonManyInView: "{{provider|titleize}}",
                      },
                      badge__lastUsed: "",
                      badge__primary: "",
                      "badge__lastUsed": "",
                      "signIn.socialButtonsBlockButton__lastUsed": "Continue with {{provider|titleize}}",
                    }}
                    routing="virtual"
                    signUpUrl="/register"
                    redirectUrl="/user"
                    afterSignInUrl="/user"
                  />
                  
                  {/* Registration Link */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-white/80">
                      Don't have an account?{" "}
                      <Link 
                        to="/register" 
                        className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                      >
                        Register here
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                /* Collector Login Form */
                <form onSubmit={onSubmit} noValidate className="space-y-4 flex-1 flex flex-col justify-center">
                  {/* Collector ID */}
                  <div>
                    <label htmlFor="collectorId" className="block text-sm font-semibold text-white mb-1">
                      Collector ID
                    </label>
                    <input
                      id="collectorId"
                      type="text"
                      placeholder="COL-XXXX"
                      value={form.collectorId}
                      onChange={(e) => setForm({ ...form, collectorId: e.target.value })}
                      className={`w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors ${
                        errors.collectorId ? "border-red-400" : ""
                      }`}
                    />
                    {errors.collectorId && (
                      <p className="text-sm text-red-400 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {errors.collectorId}
                      </p>
                    )}
                    <p className="text-xs text-white/60 mt-1">Use the Collector ID provided by admin</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-white mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+977 9876543210"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      className={`w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors ${
                        errors.phoneNumber ? "border-red-400" : ""
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-400 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={`w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 pr-10 focus:outline-none focus:border-emerald-400 transition-colors ${
                          errors.password ? "border-red-400" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.837.526-3.54 1.436-4.968m.6-1.229a9 9 0 0112.358 12.358M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors shadow-[0_12px_30px_rgba(16,185,129,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Logging in..." : "Login as Collector"}
                  </button>

                  {errors.general && (
                    <div className="mt-3">
                      <p className="text-sm text-red-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {errors.general}
                      </p>
                    </div>
                  )}

                </form>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Welcome */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center text-white"
        >
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Welcome back</h1>
            <p className="text-lg text-gray-200 leading-relaxed max-w-md">
              Sign in to manage schedules, track collections, and keep our city clean together.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}