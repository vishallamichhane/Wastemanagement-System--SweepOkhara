import React, { useState } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiHome, 
  FiBriefcase, 
  FiCheck, 
  FiX,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { 
  BsBuilding, 
  BsShieldCheck,
  BsPersonBadge
} from "react-icons/bs";

const AddNewUser = ({ onClose, onSave }) => {
  // All 33 wards of Pokhara
  const wards = Array.from({ length: 33 }, (_, i) => `Ward ${i + 1}`);
  
  // User types
  const userTypes = [
    { value: "Resident", label: "Resident", icon: FiHome },
    { value: "Business", label: "Business", icon: FiBriefcase },
    { value: "Commercial", label: "Commercial", icon: BsBuilding },
    { value: "Government", label: "Government", icon: BsShieldCheck }
  ];

  // Initial form state
  const [form, setForm] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    
    // Address Information
    ward: "",
    houseNumber: "",
    street: "",
    address: "",
    
    // Account Information
    userType: "Resident",
    status: "active",
    
    // Security Information
    password: "",
    confirmPassword: "",
    
    // Additional Information
    emergencyContact: "",
    profilePicture: "",
    
    // Preferences
    notifications: true,
    emailUpdates: true,
    smsAlerts: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle user type selection
  const handleUserTypeSelect = (type) => {
    setForm({
      ...form,
      userType: type
    });
  };

  // Handle status change
  const handleStatusChange = (status) => {
    setForm({
      ...form,
      status
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Basic Information Validation
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "Invalid phone number";
    
    // Address Validation
    if (!form.ward) newErrors.ward = "Please select a ward";
    if (!form.houseNumber.trim()) newErrors.houseNumber = "House number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    
    // Password Validation
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    // Emergency Contact Validation
    if (form.emergencyContact && !/^\d{10,15}$/.test(form.emergencyContact.replace(/\D/g, ''))) {
      newErrors.emergencyContact = "Invalid emergency contact number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Generate user ID
    const userId = `USR-${String(Date.now()).slice(-6)}`;
    
    // Prepare user data for saving
    const userData = {
      id: userId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      type: form.userType,
      status: form.status,
      reports: 0,
      joined: new Date().toISOString().split('T')[0],
      lastActive: "Just now",
      address: form.address,
      ward: form.ward,
      houseNumber: form.houseNumber,
      street: form.street,
      emergencyContact: form.emergencyContact || "Not provided",
      verificationStatus: "Pending",
      profileComplete: "70%",
      binAssigned: "Not assigned",
      preferences: {
        notifications: form.notifications,
        emailUpdates: form.emailUpdates,
        smsAlerts: form.smsAlerts
      }
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) {
        onSave(userData);
      }
      if (onClose) {
        onClose();
      }
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
              <p className="text-gray-600">Create a new user account for the waste management system</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUser className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiPhone className="text-gray-400" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiPhone className="text-gray-400" />
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={form.emergencyContact}
                    onChange={handleChange}
                    placeholder="Enter emergency contact"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.emergencyContact && (
                    <p className="text-sm text-red-600">{errors.emergencyContact}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiMapPin className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ward Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ward Number *
                  </label>
                  <select
                    name="ward"
                    value={form.ward}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.ward ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Ward</option>
                    {wards.map(ward => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
                  {errors.ward && (
                    <p className="text-sm text-red-600">{errors.ward}</p>
                  )}
                </div>

                {/* House Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    House/Lot Number *
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={form.houseNumber}
                    onChange={handleChange}
                    placeholder="Enter house/lot number"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.houseNumber && (
                    <p className="text-sm text-red-600">{errors.houseNumber}</p>
                  )}
                </div>

                {/* Street */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Street/Area Name
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Enter street or area name"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600">{errors.street}</p>
                  )}
                </div>

                {/* Full Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address with landmarks"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Type & Status Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BsPersonBadge className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Account Type & Status</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    User Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {userTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleUserTypeSelect(type.value)}
                          className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                            form.userType === type.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Account Status *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('active')}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        form.status === 'active'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <FiCheck className="text-emerald-600" />
                      <span className="text-sm font-medium">Active</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleStatusChange('inactive')}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        form.status === 'inactive'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <FiX className="text-amber-600" />
                      <span className="text-sm font-medium">Inactive</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleStatusChange('suspended')}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        form.status === 'suspended'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <FiX className="text-red-600" />
                      <span className="text-sm font-medium">Suspended</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiLock className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Security Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BsShieldCheck className="text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">User Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive email updates and alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailUpdates"
                      checked={form.emailUpdates}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive in-app notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={form.notifications}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">SMS Alerts</p>
                    <p className="text-sm text-gray-600">Receive SMS alerts for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsAlerts"
                      checked={form.smsAlerts}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating User...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiCheck />
                    Create User Account
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;