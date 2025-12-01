import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiBroom } from 'react-icons/gi';
import { BsBell, BsCamera, BsPinMap, BsCheckCircle, BsUpload, BsGeoAlt } from 'react-icons/bs';
import { FiLogOut, FiChevronLeft, FiMapPin } from 'react-icons/fi';
import Header from './Header';

const ReportIssue = () => {
  const [issueType, setIssueType] = useState('missed-pickup');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userCoordinates, setUserCoordinates] = useState(null);

  const issueTypes = [
    { id: 'missed-pickup', label: 'Missed Pickup', icon: '🚛' },
    { id: 'overflowing-bin', label: 'Overflowing Bin', icon: '🗑️' },
    { id: 'illegal-dumping', label: 'Illegal Dumping', icon: '⚠️' },
    { id: 'broken-container', label: 'Broken Container', icon: '🔧' },
    { id: 'street-litter', label: 'Street Litter', icon: '🧹' },
    { id: 'other', label: 'Other Issue', icon: '❓' }
  ];

  // Check if geolocation is available
  const isGeolocationAvailable = () => {
    return 'geolocation' in navigator;
  };

  // Get current position using browser's Geolocation API
  const getCurrentLocation = () => {
    if (!isGeolocationAvailable()) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ latitude, longitude });
        
        try {
          // Reverse geocoding to get address from coordinates
          const address = await reverseGeocode(latitude, longitude);
          setLocation(address);
        } catch (error) {
          console.error('Geocoding error:', error);
          // Fallback: show coordinates if address lookup fails
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationError('Could not get precise address, but location coordinates are captured');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Reverse geocoding function to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      // Construct address from available components
      const addressComponents = [];
      if (data.locality) addressComponents.push(data.locality);
      if (data.city) addressComponents.push(data.city);
      if (data.principalSubdivision) addressComponents.push(data.principalSubdivision);
      if (data.countryName) addressComponents.push(data.countryName);
      
      return addressComponents.join(', ') || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback to OpenStreetMap Nominatim
      return await fallbackReverseGeocode(lat, lng);
    }
  };

  // Fallback geocoding service
  const fallbackReverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Fallback geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data.address) {
        const address = data.address;
        const addressComponents = [];
        
        if (address.road) addressComponents.push(address.road);
        if (address.suburb) addressComponents.push(address.suburb);
        if (address.city) addressComponents.push(address.city);
        if (address.state) addressComponents.push(address.state);
        if (address.country) addressComponents.push(address.country);
        
        return addressComponents.join(', ') || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Fallback geocoding failed:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + photos.length <= 5) {
      setPhotos(prev => [...prev, ...files]);
    } else {
      alert('Maximum 5 photos allowed');
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      setLocationError('Please provide a location for the issue');
      return;
    }

    setIsSubmitting(true);
    
    // Prepare form data
    const formData = {
      issueType,
      location,
      description,
      coordinates: userCoordinates,
      photos: photos.length,
      timestamp: new Date().toISOString()
    };

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Report submitted:', formData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        setIssueType('missed-pickup');
        setLocation('');
        setDescription('');
        setPhotos([]);
        setUserCoordinates(null);
        setLocationError('');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setLocationError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check geolocation availability on component mount
  useEffect(() => {
    if (!isGeolocationAvailable()) {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col relative overflow-hidden">
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/userhome" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">
            Report an Issue
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us keep Pokhara clean. Let us know about any waste-related problems.
          </p>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-[1.005] transition-all duration-500 border border-emerald-100">
          
          {/* Type of Issue Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
              Type of Issue
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {issueTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setIssueType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 group ${
                    issueType === type.id
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl mb-2 transition-transform duration-300 ${
                      issueType === type.id ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {type.icon}
                    </div>
                    <span className={`font-semibold text-sm ${
                      issueType === type.id ? 'text-emerald-700' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </span>
                    {issueType === type.id && (
                      <div className="mt-2 flex justify-center">
                        <BsCheckCircle className="text-emerald-500 text-lg animate-checkmark" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Location Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <FiMapPin className="text-emerald-600 text-xl" />
              Location
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setLocationError('');
                }}
                placeholder="e.g., Lakeside Road, Pokhara-6"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
              />
              
              {/* Location Detection Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isDetectingLocation || !isGeolocationAvailable()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDetectingLocation ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <BsGeoAlt className="text-lg" />
                      Use My Current Location
                    </>
                  )}
                </button>

                {userCoordinates && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    <BsPinMap className="text-emerald-500" />
                    <span>GPS: {userCoordinates.latitude.toFixed(6)}, {userCoordinates.longitude.toFixed(6)}</span>
                  </div>
                )}
              </div>

              {/* Location Error Message */}
              {locationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {locationError}
                  </div>
                </div>
              )}

              {/* Geolocation Not Available Warning */}
              {!isGeolocationAvailable() && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Location detection not available in your browser
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm">
                📝
              </span>
              Description
            </h3>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 italic">
                Please provide as much detail as possible...
              </p>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the issue, including any relevant details..."
                rows="6"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Upload Photos Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <BsCamera className="text-emerald-600 text-xl" />
              Upload Photos (Optional)
            </h3>
            
            <div className="space-y-4">
              {/* Upload Area */}
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50/50 group">
                  <BsUpload className="text-3xl text-gray-400 mb-3 mx-auto group-hover:text-emerald-500 transition-colors duration-300" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Upload a file or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB • Max 5 photos
                  </p>
                </div>
              </label>

              {/* Preview Uploaded Photos */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group animate-fade-in">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !location || !description}
              className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                isSubmitting || !location || !description
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-3xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Report...
                </div>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-6 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center relative z-10 mt-8">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </a>
          <a href="#" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Success Confirmation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl transform animate-confirmation-popup border border-emerald-200">
            <div className="text-center">
              {/* Animated Checkmark */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-10 h-10 text-white animate-checkmark" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                {/* Pulsing Ring Effect */}
                <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-ping-slow opacity-75"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Report Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for helping keep Pokhara clean. We'll address the issue promptly.
              </p>
              
              {userCoordinates && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                  <div className="flex items-center gap-2 justify-center">
                    <BsPinMap className="text-emerald-500" />
                    <span>Location recorded: {location}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced animations */}
      <style jsx>{`
        /* Floating background elements */
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Confirmation Popup Animation */
        @keyframes confirmation-popup {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Checkmark Animation */
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Slow Ping Animation */
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out both;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out both;
        }
        
        .animate-confirmation-popup {
          animation: confirmation-popup 0.5s ease-out both;
        }

        .animate-checkmark {
          animation: checkmark 0.6s ease-in-out both;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ReportIssue;