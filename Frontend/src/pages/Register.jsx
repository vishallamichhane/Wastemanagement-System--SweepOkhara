import React, { useState } from "react";
import { GiBroom } from "react-icons/gi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    ward: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const wards = Array.from({ length: 33 }, (_, i) => i + 1);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(form.phone))
      newErrors.phone = "Enter a valid phone number";

    if (!form.ward) newErrors.ward = "Please select a ward";

    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!form.agreeTerms)
      newErrors.agreeTerms =
        "You must agree to Terms of Service and Privacy Policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex justify-center items-center px-4 py-10 overflow-hidden select-none">
      {/* Enhanced Background animated morphing blobs */}
      <motion.div
        aria-hidden="true"
        className="absolute top-[-12rem] left-[-10rem] w-96 h-96 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{
          borderRadius: [
            "48% 52% 53% 47% / 47% 44% 56% 53%",
            "47% 53% 57% 43% / 49% 45% 55% 51%",
            "50% 50% 46% 54% / 57% 59% 41% 43%",
            "48% 52% 53% 47% / 47% 44% 56% 53%",
          ],
          x: [0, 15, -15, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-[18rem] right-[-12rem] w-96 h-96 bg-gradient-to-r from-teal-300 to-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          borderRadius: [
            "47% 53% 57% 43% / 49% 45% 55% 51%",
            "48% 52% 53% 47% / 47% 44% 56% 53%",
            "50% 50% 46% 54% / 57% 59% 41% 43%",
            "47% 53% 57% 43% / 49% 45% 55% 51%",
          ],
          x: [0, -20, 20, 0],
          y: [0, 15, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-10rem] left-[50%] w-[400px] h-[400px] bg-gradient-to-r from-green-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-4xl opacity-35"
        style={{ transform: "translateX(-50%)" }}
        animate={{
          borderRadius: [
            "50% 50% 46% 54% / 57% 59% 41% 43%",
            "48% 52% 53% 47% / 47% 44% 56% 53%",
            "47% 53% 57% 43% / 49% 45% 55% 51%",
            "50% 50% 46% 54% / 57% 59% 41% 43%",
          ],
          x: [0, 20, -20, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Enhanced Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl max-w-md w-full p-8 relative z-10 border border-white/20"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl blur-xl -z-10"></div>
        
        {/* Enhanced Logo */}
        <motion.div 
          className="flex items-center justify-center mb-8 space-x-3 group cursor-default select-none"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            <GiBroom className="h-8 w-8 text-emerald-600 animate-bounce-slow" />
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
          <span className="text-3xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
            SweepOkhara
          </span>
        </motion.div>

        {/* Enhanced Title */}
        <motion.h2 
          className="font-black text-4xl mb-10 text-center select-text leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent">
            Join Our
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Clean Community
          </span>
        </motion.h2>

        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-800 mb-2 select-text flex items-center gap-2"
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

          {/* Phone and Ward */}
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-1/2">
              <label
                htmlFor="phone"
                className="block text-sm font-bold text-gray-800 mb-2 select-text flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Phone Number
              </label>
              <motion.input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full rounded-2xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  errors.phone 
                    ? "border-red-400 shadow-lg shadow-red-200/50" 
                    : "border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200/50"
                }`}
                whileFocus={{ scale: 1.02 }}
              />
              {errors.phone && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 select-text flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.phone}
                </motion.p>
              )}
            </div>
            <div className="relative w-1/2">
              <label
                htmlFor="ward"
                className="block text-sm font-bold text-gray-800 mb-2 select-text flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Select Ward
              </label>
              <motion.select
                id="ward"
                value={form.ward}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                className={`w-full appearance-none rounded-2xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 text-gray-800 focus:outline-none transition-all duration-300 ${
                  errors.ward 
                    ? "border-red-400 shadow-lg shadow-red-200/50" 
                    : "border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200/50"
                }`}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="" disabled className="text-gray-400">
                  Select ward
                </option>
                {wards.map((w) => (
                  <option key={w} value={w} className="text-gray-800">
                    Ward {w}
                  </option>
                ))}
              </motion.select>
              <svg
                className="pointer-events-none h-5 w-5 absolute right-4 top-1/2 translate-y-1 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {errors.ward && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 select-text flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.ward}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-800 mb-2 select-text flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Password
            </label>
            <div className="relative">
              <motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-gray-800 mb-2 select-text flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Confirm Password
            </label>
            <div className="relative">
              <motion.input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`w-full rounded-2xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  errors.confirmPassword 
                    ? "border-red-400 shadow-lg shadow-red-200/50" 
                    : "border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200/50"
                }`}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? (
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
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mt-2 select-text flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.confirmPassword}
              </motion.p>
            )}
          </motion.div>

          {/* Enhanced Checkbox Terms */}
          <motion.label 
            className="inline-flex items-start mb-6 text-sm text-gray-700 cursor-pointer select-text group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
              className={`mt-1 mr-3 rounded-md border-2 transition-all duration-300 text-emerald-600 focus:ring-emerald-600 focus:ring-2 ${
                errors.agreeTerms 
                  ? "border-red-400 bg-red-50" 
                  : "border-emerald-300 group-hover:border-emerald-400"
              }`}
            />
            <span className="leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors duration-200 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors duration-200 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500">
                Privacy Policy
              </a>
              .
            </span>
          </motion.label>
          {errors.agreeTerms && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 mt-2 mb-3 select-text flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {errors.agreeTerms}
            </motion.p>
          )}

          {/* Enhanced Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(5, 150, 105, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10 text-lg">Create Account</span>
          </motion.button>
        </form>

        {/* Enhanced Bottom text */}
        <motion.p
          className="text-center text-gray-600 text-sm mt-8 select-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors duration-200 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500">
            Log In
          </Link>
        </motion.p>
      </motion.div>

      {/* Enhanced Footer */}
      <motion.footer 
        className="fixed bottom-6 left-0 w-full text-center text-sm text-emerald-700/80 select-none pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
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