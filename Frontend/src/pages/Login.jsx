import React, { useState } from "react";
import { GiBroom } from "react-icons/gi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [role, setRole] = useState("general");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(
        `Logging in as ${
          role === "general" ? "General User" : "Waste Collector"
        } with email: ${form.email}`
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">
      {/* Enhanced Background animated blobs */}
      <motion.div
        aria-hidden="true"
        className="absolute top-[-8rem] left-[-6rem] w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-[10rem] right-[-5rem] w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-6rem] left-[40%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-25"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto z-10">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden relative border border-white/20"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl -z-10"></div>

          {/* Left Side - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="lg:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-100 p-12 flex flex-col justify-center items-center text-center rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(emerald_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            {/* Enhanced Logo */}
            <motion.div 
              className="flex flex-col items-center mb-8 select-none relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <GiBroom className="h-12 w-12 text-emerald-600 mb-4 animate-bounce-slow" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <motion.h1 
                className="text-4xl font-black bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent mb-2 select-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                SweepOkhara
              </motion.h1>
              <motion.p 
                className="text-emerald-700 text-lg font-semibold tracking-wide select-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Clean City, Smart Citizen
              </motion.p>
            </motion.div>

            {/* Enhanced Illustration */}
            <motion.div 
              className="w-full max-w-sm mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <img
                  src="https://i.pinimg.com/736x/35/98/0d/35980d7e6f1720aaf9ad7ba3d680c2c4.jpg"
                  alt="Clean city illustration"
                  className="w-full max-w-[320px] object-contain rounded-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-500 shadow-2xl"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </motion.div>

            {/* Feature Points */}
            <motion.div 
              className="mt-8 grid grid-cols-2 gap-4 text-left w-full max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {[
                "Real-time bin monitoring",
                "Smart waste collection",
                "Instant issue reporting",
                "Community engagement"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2 text-emerald-800 text-sm font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="lg:w-1/2 p-12 flex flex-col justify-center relative"
          >
            <motion.h2 
              className="text-3xl font-black bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-3 select-text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-8 select-text font-medium tracking-wide text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Sign in to continue your clean city journey
            </motion.p>

            {/* Enhanced Role selector */}
            <motion.div 
              className="inline-flex bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl overflow-hidden mb-8 select-none shadow-lg ring-2 ring-emerald-200/50 p-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="button"
                onClick={() => setRole("general")}
                className={`px-8 py-3 font-bold transition-all duration-500 relative overflow-hidden rounded-xl
                    ${
                      role === "general"
                        ? "bg-white text-emerald-700 shadow-lg"
                        : "text-emerald-600 hover:text-emerald-700 hover:bg-white/50"
                    }`}
              >
                <span className="relative z-10">👤 General User</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("collector")}
                className={`px-8 py-3 font-bold transition-all duration-500 relative overflow-hidden rounded-xl
                    ${
                      role === "collector"
                        ? "bg-white text-emerald-700 shadow-lg"
                        : "text-emerald-600 hover:text-emerald-700 hover:bg-white/50"
                    }`}
              >
                <span className="relative z-10">🚛 Waste Collector</span>
              </button>
            </motion.div>

            <form onSubmit={onSubmit} noValidate className="space-y-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label
                  htmlFor="email"
                  className="block text-gray-800 font-bold text-sm mb-2 select-text tracking-wide flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Email Address
                </label>
                <motion.input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full rounded-2xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    errors.email 
                      ? "border-red-400 shadow-lg shadow-red-200/50" 
                      : "border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200/50"
                  }`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 mt-2 select-text flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label
                  htmlFor="password"
                  className="block text-gray-800 font-bold text-sm mb-2 select-text tracking-wide flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full rounded-2xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                      errors.password 
                        ? "border-red-400 shadow-lg shadow-red-200/50" 
                        : "border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200/50"
                    }`}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.837.526-3.54 1.436-4.968m.6-1.229a9 9 0 0112.358 12.358M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 mt-2 select-text flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Enhanced Log In Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(5, 150, 105, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10 text-lg">Sign In to Your Account</span>
              </motion.button>
            </form>

            {/* Enhanced Links */}
            <motion.div 
              className="flex justify-between mt-8 text-sm text-gray-600 select-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <a
                href="#"
                className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors duration-200 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500"
              >
                Forgot Password?
              </a>
              <p>
                New to SweepOkhara?{" "}
                <Link
                  to="/register"
                  className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors duration-200 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500"
                >
                  Create Account
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer - Properly positioned at bottom */}
      <motion.footer 
        className="w-full text-center text-sm text-emerald-700/80 select-none py-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        © 2024 SweepOkhara. All rights reserved. Pokhara Metropolitan City
      </motion.footer>

      <style>{`
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8%);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}