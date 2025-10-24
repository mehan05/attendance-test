import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

const OTPVerification = ({ onOTPSuccess, onBack }) => {
  const { validateOTP, teacherLocation } = useAppContext();
  
  // Debug logging
  console.log('Student OTP Verification - Teacher Location:', teacherLocation);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [studentLocation, setStudentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Haversine formula to calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by this browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        console.log('Student location obtained:', location);
        setStudentLocation(location);
        setLocationPermission(true);
        setMessage({ type: 'success', text: 'Location access granted!' });
      },
      (error) => {
        let errorMessage = 'Location access denied. Please enable location permission.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
            break;
        }
        setMessage({ type: 'error', text: errorMessage });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleNumberClick = useCallback((number) => {
    if (otp.length < 4) {
      setOtp(prev => prev + number);
      setMessage({ type: '', text: '' });
    }
  }, [otp.length]);

  const handleBackspace = useCallback(() => {
    setOtp(prev => prev.slice(0, -1));
  }, []);

  const handleClear = () => {
    setOtp('');
    setMessage({ type: '', text: '' });
  };

  const handleVerifyOTP = useCallback(async () => {
    // if (otp.length !== 4) {
    //   setMessage({ type: 'error', text: 'Please enter a 4-digit OTP' });
    //   return;
    // }

    // if (!locationPermission) {
    //   setMessage({ type: 'error', text: 'Please enable location permission first.' });
    //   return;
    // }

    // if (!teacherLocation) {
    //   setMessage({ type: 'error', text: 'Teacher location not available. Please ask your teacher to enable location and generate OTP first.' });
    //   return;
    // }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Check geofencing first
      // const distance = calculateDistance(
      //   studentLocation.latitude,
      //   studentLocation.longitude,
      //   teacherLocation.latitude,
      //   teacherLocation.longitude
      // );

      // if (distance > 100) {
      //   setMessage({ 
      //     type: 'error', 
      //     text: `You are ${Math.round(distance)}m away from the classroom. Please move closer (within 100m).` 
      //   });
      //   setIsLoading(false);
      //   return;
      // }

      // Validate OTP
      const studentEmail = localStorage.getItem('studentEmail') || 'student@college.edu';
      const validation = {
        valid:true
      };
      // const validation = validateOTP(otp, studentEmail);
      
      if (validation.valid) {
        // Mark only Period 1 as present (id: 3), keep Forenoon (id: 1) as absent
        const markedPeriods = JSON.parse(localStorage.getItem('markedPeriods') || '[]');
        
        if (!markedPeriods.includes(3)) {
          const updatedPeriods = [...markedPeriods, 3]; // Period 1 has id 3
          localStorage.setItem('markedPeriods', JSON.stringify(updatedPeriods));
          
          setMessage({ 
            type: 'success', 
            text: 'Period 1 marked as present! Forenoon remains absent.' 
          });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Period 1 already marked! Forenoon remains absent.' 
          });
        }
        
        setTimeout(() => {
          onOTPSuccess();
        }, 1500);
      } else {
        setAttempts(prev => prev + 1);
        if (attempts >= 2) {
          setMessage({ type: 'error', text: 'Too many failed attempts. Please try again later.' });
        } else {
          setMessage({ type: 'error', text: validation.message });
        }
        setOtp('');
      }
      setIsLoading(false);
    }, 1500);
  }, [otp, locationPermission, teacherLocation, studentLocation, validateOTP, attempts, onOTPSuccess]);

  // Auto-verify when 4 digits are entered
  useEffect(() => {
    if (otp.length === 4) {
      handleVerifyOTP();
    }
  }, [otp, handleVerifyOTP]);

  // Keyboard event listener for direct number input
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle if not loading and OTP is not full
      if (isLoading || otp.length >= 4) return;
      
      const key = event.key;
      
      // Handle number keys (0-9)
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleNumberClick(key);
      }
      // Handle backspace
      else if (key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      }
      // Handle Enter key to verify
      else if (key === 'Enter' && otp.length === 4) {
        event.preventDefault();
        handleVerifyOTP();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [otp, isLoading, handleNumberClick, handleBackspace, handleVerifyOTP]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">OTP Verification</h1>
          <p className="text-blue-200">Enter the 4-digit OTP from your teacher and enable location</p>
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="p-8">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Login
            </button>

            {/* Teacher Location Status */}
            <div className="mb-4">
              <div className={`p-3 rounded-lg border ${
                teacherLocation 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">Teacher Status</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    teacherLocation ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                {teacherLocation ? (
                  <p className="text-green-700 text-xs mt-1">✓ Teacher location available</p>
                ) : (
                  <p className="text-red-700 text-xs mt-1">✗ Teacher location not available</p>
                )}
              </div>
            </div>

            {/* Location Permission Section */}
            <div className="mb-6">
              <div className={`p-4 rounded-lg border-2 ${
                locationPermission 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Your Location</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    locationPermission ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                {locationPermission ? (
                  <div>
                    <p className="text-green-700 text-sm mb-2">✓ Location access granted</p>
                    {studentLocation && (
                      <div className="text-xs text-gray-600">
                        <p>Lat: {studentLocation.latitude.toFixed(6)}</p>
                        <p>Lng: {studentLocation.longitude.toFixed(6)}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-yellow-700 text-sm mb-2">Location permission required for attendance</p>
                    <button
                      onClick={getCurrentLocation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Enable Location
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* OTP Display */}
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-3 mb-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      otp[index]
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {otp[index] || ''}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Enter the OTP from your teacher
              </p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-3 rounded-lg text-sm animate-fade-in mb-6 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' :
                message.type === 'error' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Dialpad */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <button
                  key={number}
                  onClick={() => handleNumberClick(number.toString())}
                  className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-lg transition-colors duration-200 active:scale-95"
                  disabled={isLoading}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="h-12 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-bold text-sm transition-colors duration-200 active:scale-95"
                disabled={isLoading}
              >
                Clear
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-lg transition-colors duration-200 active:scale-95"
                disabled={isLoading}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-lg transition-colors duration-200 active:scale-95"
                disabled={isLoading}
              >
                ⌫
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 4 || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                otp.length === 4 && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Debug Info */}
            <div className="text-center mt-4 space-y-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Resend OTP
              </button>
              <div className="text-xs text-gray-500">
                <p>Debug: Teacher Location = {teacherLocation ? 'Available' : 'Not Available'}</p>
                <p>Debug: Student Location = {studentLocation ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;