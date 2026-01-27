import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("general");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Dummy authentication - check against registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email === form.email);
      
      if (user && user.password === form.password) {
        // Store logged-in user data
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          ward: user.ward,
          role: role
        }));
        alert(`Welcome ${user.fullName}!`);
        navigate('/user');
      } else {
        setErrors({ password: 'Email or password is incorrect' });
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

            <div className="rounded-xl p-6 bg-white/10 backdrop-blur-md border border-white/25 ring-1 ring-emerald-500/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              {/* Role Toggle */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 mb-5">
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

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
                    Email Address
                  </label>
                  <motion.input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors ${
                      errors.email ? "border-red-400" : ""
                    }`}
                    whileFocus={{ scale: 1.005 }}
                  />
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <motion.input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 pr-10 focus:outline-none focus:border-emerald-400 transition-colors ${
                        errors.password ? "border-red-400" : ""
                      }`}
                      whileFocus={{ scale: 1.005 }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-emerald-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
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
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors shadow-[0_12px_30px_rgba(16,185,129,0.35)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {role === "collector" ? "Login as Collector" : "Login as User"}
                </motion.button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-white/20 w-full"></div>
                  <span className="absolute bg-white/10 px-3 text-xs text-white/70">OR</span>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <motion.button
                    type="button"
                    onClick={() => alert('Google login not yet implemented')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FcGoogle className="text-xl" />
                    Continue with Google
                  </motion.button>
                </div>

                {/* Links */}
                <div className="flex items-center justify-between text-sm text-white/80">
                  <a href="#" className="hover:text-white transition-colors">
                    Forgot password?
                  </a>
                  <p>
                    New here?{' '}
                    <Link to="/register" className="text-emerald-300 hover:text-emerald-200 font-semibold">
                      Create account
                    </Link>
                  </p>
                </div>
              </form>
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
