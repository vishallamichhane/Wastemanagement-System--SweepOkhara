import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Typing Animation Component
const TypingText = ({ text, delay = 0 }) => {
  const characters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.01 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {characters.map((char, index) => (
        <motion.span key={index} variants={characterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    ward: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const wards = Array.from({ length: 33 }, (_, i) => `Ward ${i + 1}`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.ward) {
      newErrors.ward = "Please select your ward";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Registration successful!");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex">
      {/* Full-page Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/7f/43/03/7f4303e68af7cee0ee19a1eefad890dc.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/55 to-black/65" />
      </div>
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              <TypingText text="Let's Get Started" delay={0.3} />
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-md">
              <TypingText text="Join SweePokhara and be part of a cleaner, greener future. Track waste collection, report issues, and make a real impact in your community." delay={1.2} />
            </p>
          </motion.div>
        </div>

        {/* Decorative green leaf overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-600 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Sign up heading */}
          <div className="text-center mb-3">
            <h2 className="text-2xl font-bold text-white mb-1">Sign up</h2>
          </div>

          {/* Form Container with Border */}
          <div className="rounded-xl p-5 bg-white/10 backdrop-blur-md border border-white/25 ring-1 ring-emerald-500/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <form onSubmit={handleSubmit} className="space-y-3">
            {/* Your Name */}
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Your Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your Address"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Ward */}
            <div>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/40 text-white text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              >
                <option value="" className="bg-gray-900">Select your ward</option>
                {wards.map((ward) => (
                  <option key={ward} value={ward} className="bg-gray-900 text-white">
                    {ward}
                  </option>
                ))}
              </select>
              {errors.ward && (
                <p className="mt-1 text-sm text-red-500">{errors.ward}</p>
              )}
            </div>

            {/* Create Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Sign up Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-4"
            >
              Sign up
            </motion.button>

            {/* Sign in Link */}
            <p className="text-center text-gray-200 mt-4 text-sm">
              Already a Member?{" "}
              <Link to="/login" className="text-emerald-300 hover:text-emerald-200 font-semibold">
                Sign in here
              </Link>
            </p>
          </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}