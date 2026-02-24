import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSignUp } from "@clerk/clerk-react";

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
  const navigate = useNavigate();
  const { signUp, isLoaded: isSignUpLoaded, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    ward: "",
    houseNumber: "",
    password: "",
    confirmPassword: "",
  });
  console.log(formData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      if (validateForm()) {
        if (!isSignUpLoaded) {
          setErrors({ submit: "Authentication not ready. Please try again." });
          return;
        }

        setIsSubmitting(true);
        console.log("Submitting registration with Clerk...");
        
        // Parse first and last name from full name
        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Generate username from email or full name
        const username = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

        // Create sign up with Clerk
        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          firstName: firstName,
          lastName: lastName,
          username: username,
          unsafeMetadata: {
            address: formData.address,
            ward: formData.ward,
            houseNumber: formData.houseNumber,
          },
        });

        console.log("Sign up result:", result);

        // Send email verification code
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        
        // Set pending verification state
        setPendingVerification(true);
        console.log("Verification email sent");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      let errorMsg = error.errors?.[0]?.message || error.message || "Registration failed";
      
      // Provide helpful context for password breach errors
      if (errorMsg.includes("data breach") || errorMsg.includes("breached")) {
        errorMsg = "⚠️ This password has been compromised in a data breach. Please choose a stronger, unique password for your security.";
      }
      
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resending verification code
  const handleResendCode = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setErrors({ verification: "✓ New verification code sent! Check your email." });
      console.log("Verification code resent successfully");
    } catch (error) {
      console.error("Resend code error:", error);
      const errorMsg = error.errors?.[0]?.message || "Failed to resend code";
      setErrors({ verification: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle email verification code submission
  const handleVerification = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!verificationCode.trim()) {
      setErrors({ verification: "Please enter the verification code" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Attempt to verify the email with the provided code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("Verification result:", completeSignUp);
      console.log("SignUp status:", completeSignUp.status);
      console.log("Missing requirements:", completeSignUp.missingFields);
      console.log("Unverified fields:", completeSignUp.unverifiedFields);

      // Check if the email verification was successful
      if (completeSignUp.verifications?.emailAddress?.status === "verified") {
        console.log("Email verified successfully!");
        
        // Check if signup is complete or needs additional steps
        if (completeSignUp.status === "complete") {
          console.log("Signup complete! Setting session...");
          
          // Set the session as active
          await setActive({ session: completeSignUp.createdSessionId });
          
          console.log("Session activated, saving user to MongoDB...");
          
          // Extract username from the completeSignUp object
          const username = completeSignUp.username || formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
          
          console.log("User data to save:", {
            clerkId: completeSignUp.createdUserId,
            username: username,
            email: formData.email,
            fullName: formData.fullName,
            address: formData.address,
            ward: formData.ward,
          });
          
          // Save user data to MongoDB
          try {
            console.log('📤 Sending request to:', 'http://localhost:3000/api/users/create');
            
            const response = await fetch('http://localhost:3000/api/users/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                clerkId: completeSignUp.createdUserId,
                username: username,
                email: formData.email,
                firstName: formData.fullName.trim().split(' ')[0] || '',
                lastName: formData.fullName.trim().split(' ').slice(1).join(' ') || '',
                fullName: formData.fullName,
                address: formData.address,
                ward: formData.ward,
                houseNumber: formData.houseNumber,
              }),
            });

            console.log('📥 Response status:', response.status);
            
            const result = await response.json();
            console.log('📥 Response data:', result);
            
            if (result.success) {
              console.log('✅ User saved to MongoDB:', result.user);
            } else {
              console.error('⚠️ MongoDB save failed:', result.error);
              console.error('⚠️ Full response:', result);
            }
          } catch (mongoError) {
            console.error('❌ MongoDB save error:', mongoError);
            console.error('❌ Error details:', mongoError.message);
            console.error('❌ Error stack:', mongoError.stack);
            // Don't block user navigation on MongoDB error
          }
          
          console.log("Navigating to dashboard...");
          
          // Navigate to user dashboard
          navigate('/user');
        } else if (completeSignUp.status === "missing_requirements") {
          // Handle missing requirements - this might need phone verification or other fields
          console.log("Missing requirements detected");
          
          // Check what's missing
          const missingFields = completeSignUp.missingFields || [];
          const unverifiedFields = completeSignUp.unverifiedFields || [];
          
          console.log("Missing fields:", missingFields);
          console.log("Unverified fields:", unverifiedFields);
          
          // If no other requirements, try to complete the signup
          if (missingFields.length === 0 && unverifiedFields.length === 0) {
            console.log("No missing fields, attempting to set session...");
            await setActive({ session: completeSignUp.createdSessionId });
            
            // Extract username from the completeSignUp object
            const username = completeSignUp.username || formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
            
            console.log("User data to save:", {
              clerkId: completeSignUp.createdUserId,
              username: username,
              email: formData.email,
              fullName: formData.fullName,
              address: formData.address,
              ward: formData.ward,
            });
            
            // Save user data to MongoDB
            try {
              console.log('📤 Sending request to:', 'http://localhost:3000/api/users/create');
              
              const response = await fetch('http://localhost:3000/api/users/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  clerkId: completeSignUp.createdUserId,
                  username: username,
                  email: formData.email,
                  firstName: formData.fullName.trim().split(' ')[0] || '',
                  lastName: formData.fullName.trim().split(' ').slice(1).join(' ') || '',
                  fullName: formData.fullName,
                  address: formData.address,
                  ward: formData.ward,
                  houseNumber: formData.houseNumber,
                }),
              });

              console.log('📥 Response status:', response.status);
              
              const result = await response.json();
              console.log('📥 Response data:', result);
              
              if (result.success) {
                console.log('✅ User saved to MongoDB:', result.user);
              } else {
                console.error('⚠️ MongoDB save failed:', result.error);
                console.error('⚠️ Full response:', result);
              }
            } catch (mongoError) {
              console.error('❌ MongoDB save error:', mongoError);
              console.error('❌ Error details:', mongoError.message);
              console.error('❌ Error stack:', mongoError.stack);
            }
            
            navigate('/user');
          } else {
            setErrors({ 
              verification: `Additional verification needed. Missing: ${missingFields.join(', ') || 'None'}. Unverified: ${unverifiedFields.join(', ') || 'None'}` 
            });
          }
        } else {
          // Unknown status
          console.log("Signup not complete. Status:", completeSignUp.status);
          setErrors({ verification: `Verification incomplete. Status: ${completeSignUp.status}. Please try again.` });
        }
      } else {
        // Email not verified
        setErrors({ verification: "Email verification failed. Please check the code and try again." });
      }
    } catch (error) {
      console.error("Verification error:", error);
      console.error("Error details:", error.errors);
      
      // Handle rate limiting
      if (error.status === 429) {
        setErrors({ verification: "Too many attempts. Please wait a few minutes and try again." });
        return;
      }
      
      // Handle specific error codes
      const errorCode = error.errors?.[0]?.code || "";
      const errorMsg = error.errors?.[0]?.message || error.message || "Verification failed";
      
      if (errorCode === "form_code_incorrect") {
        setErrors({ verification: "Incorrect verification code. Please check and try again." });
      } else if (errorCode === "verification_expired") {
        setErrors({ verification: "Verification code has expired. Please request a new one." });
      } else {
        setErrors({ verification: errorMsg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show verification form if pending
  if (pendingVerification) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-6"
        >
          <div className="rounded-xl p-8 bg-white/10 backdrop-blur-md border border-white/25 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Verify Your Email</h2>
              <p className="text-gray-300 mt-2">We sent a code to {formData.email}</p>
            </div>
            
            <form onSubmit={handleVerification} className="space-y-4">
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-emerald-400"
              />
              {errors.verification && (
                <p className={`text-sm ${errors.verification.includes('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {errors.verification}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </button>
              
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSubmitting}
                className="w-full text-gray-300 hover:text-white py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Didn't receive code? Resend
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <p className="text-3xl font-extrabold tracking-[0.35em] text-emerald-200 mb-4 drop-shadow-lg">
              SweePokhara
            </p>
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
                placeholder="Full Name (e.g., John Doe)"
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
                placeholder="Email (e.g., john@example.com)"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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

            {/* House Number */}
            <div>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                placeholder="House Number (Optional)"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {errors.houseNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.houseNumber}</p>
              )}
            </div>

            {/* Create Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters (e.g., Pass@123)"
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 pr-10 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 placeholder:text-sm text-sm py-2 px-1 pr-10 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Sign up Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </motion.button>

            {/* Display submission errors */}
            {errors.submit && (
              <p className="mt-3 text-sm text-red-500 text-center">{errors.submit}</p>
            )}

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