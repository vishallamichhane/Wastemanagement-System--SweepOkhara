import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsLock, BsEye, BsEyeSlash, BsCheckCircle, BsXCircle, BsArrowLeft } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import Header from "./components/Header";
import useScrollToTop from '../../hooks/useScrollToTop';
import { useUser } from "@clerk/clerk-react";

export default function ChangePasswordPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "text-red-500",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    let score = 0;
    Object.values(requirements).forEach(met => met && score++);

    let message = "";
    let color = "text-red-500";

    if (score === 5) {
      message = "Strong password";
      color = "text-green-500";
    } else if (score >= 3) {
      message = "Good password";
      color = "text-yellow-500";
    } else if (score >= 1) {
      message = "Weak password";
      color = "text-orange-500";
    } else {
      message = "Very weak password";
    }

    setPasswordStrength({
      score,
      message,
      color,
      requirements
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (formData.newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Use Clerk to change password
      await user.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setPasswordChanged(true);
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Optionally redirect after success
      setTimeout(() => {
        navigate('/user/profile');
      }, 2000);
      
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center gap-2">
      {met ? (
        <BsCheckCircle className="text-green-500 text-sm" />
      ) : (
        <BsXCircle className="text-gray-300 text-sm" />
      )}
      <span className={`text-sm ${met ? "text-gray-600" : "text-gray-400"}`}>
        {text}
      </span>
    </div>
  );

  return (
    <>
  <div className="h-16 sm:h-20"></div>
      {/* Main content */}
      <main className="flex-grow max-w-lg mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-10 mb-16 pb-20 sm:pb-0 space-y-6 sm:space-y-8 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>
          
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl text-white shadow-lg">
                <BsLock className="text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Change Password
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Update your account security
            </p>
          </div>
        </section>

        {/* Success Message */}
        {passwordChanged && (
          <div className="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <BsCheckCircle className="text-green-600 text-2xl" />
              <h3 className="text-lg font-bold text-green-800">Password Changed Successfully!</h3>
            </div>
            <p className="text-green-700">
              Your password has been updated. Please use your new password for your next login.
            </p>
          </div>
        )}

        {/* Password Change Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 px-4 py-3 pr-12 text-gray-700 bg-white/50 transition-all duration-300"
                  disabled={isLoading || passwordChanged}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading || passwordChanged}
                >
                  {showCurrentPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 px-4 py-3 pr-12 text-gray-700 bg-white/50 transition-all duration-300"
                  disabled={isLoading || passwordChanged}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading || passwordChanged}
                >
                  {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Password Strength:</span>
                    <span className={`text-sm font-medium ${passwordStrength.color}`}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        passwordStrength.score === 5 ? "bg-green-500" :
                        passwordStrength.score >= 3 ? "bg-yellow-500" :
                        passwordStrength.score >= 1 ? "bg-orange-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="w-full rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 px-4 py-3 pr-12 text-gray-700 bg-white/50 transition-all duration-300"
                  disabled={isLoading || passwordChanged}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading || passwordChanged}
                >
                  {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Password Requirements:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <PasswordRequirement 
                  met={passwordStrength.requirements.length} 
                  text="At least 8 characters" 
                />
                <PasswordRequirement 
                  met={passwordStrength.requirements.uppercase} 
                  text="One uppercase letter" 
                />
                <PasswordRequirement 
                  met={passwordStrength.requirements.lowercase} 
                  text="One lowercase letter" 
                />
                <PasswordRequirement 
                  met={passwordStrength.requirements.number} 
                  text="One number" 
                />
                <PasswordRequirement 
                  met={passwordStrength.requirements.special} 
                  text="One special character" 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || passwordChanged}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Changing Password...
                  </>
                ) : passwordChanged ? (
                  <>
                    <BsCheckCircle className="text-lg" />
                    Password Changed
                  </>
                ) : (
                  <>
                    <FiLock className="text-lg" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 animate-fade-in-delay">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Security Tips</h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li className="flex items-start gap-2">
              <BsCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Use a unique password that you don't use elsewhere</span>
            </li>
            <li className="flex items-start gap-2">
              <BsCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Change your password regularly for better security</span>
            </li>
            <li className="flex items-start gap-2">
              <BsCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Never share your password with anyone</span>
            </li>
            <li className="flex items-start gap-2">
              <BsCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Consider using a password manager for strong passwords</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.5s both;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.8);
        }
      `}</style>
    </>
  );
}
