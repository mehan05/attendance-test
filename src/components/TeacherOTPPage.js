import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const TeacherOTPPage = ({ onBack, onReport }) => {
  const { generateOTP, setLocation, teacherLocation } = useAppContext();
  
  // Debug logging
  console.log('Teacher OTP Page - Teacher Location:', teacherLocation);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError('');
    setLocationPermission(false);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        console.log('Teacher location obtained:', location);
        setLocation(location);
        setLocationPermission(true);
        setLocationError('');
      },
      (error) => {
        let errorMessage = 'An unknown error occurred.';
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
        setLocationError(errorMessage);
        setLocationPermission(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleGenerateOTP = () => {
    if (!locationPermission) {
      setLocationError('Please enable location permission first.');
      return;
    }

    setIsGenerating(true);
    const otp = generateOTP();
    setGeneratedOTP(otp);
    setCountdown(10);
    setIsGenerating(false);
  };

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-blue-200">Generate OTP and manage attendance</p>
        </div>

        {/* Main Card */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - OTP Generation */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">OTP Generation</h2>
                
                {/* Generated OTP Display */}
                {generatedOTP && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Generated OTP</h3>
                    <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                      {generatedOTP}
                    </div>
                    <p className="text-sm text-blue-700">
                      Share this OTP with students for attendance
                    </p>
                    {countdown > 0 && (
                      <div className="mt-4">
                        <div className="text-lg font-semibold text-orange-600">
                          Next OTP in: {countdown}s
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(countdown / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Generate OTP Button */}
                <button
                  onClick={handleGenerateOTP}
                  disabled={!locationPermission || isGenerating || countdown > 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    locationPermission && !isGenerating && countdown === 0
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Generating OTP...
                    </div>
                  ) : countdown > 0 ? (
                    `Wait ${countdown}s for next OTP`
                  ) : (
                    'Generate OTP'
                  )}
                </button>

                {/* Download Report Button */}
                <button
                  onClick={onReport}
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Report
                  </div>
                </button>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Enable location permission first</li>
                    <li>• Generate OTP for students to use</li>
                    <li>• OTP is valid for 10 minutes</li>
                    <li>• Wait 10 seconds between generations</li>
                  </ul>
                </div>
              </div>

              {/* Right Side - Location Permission */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Settings</h2>
                
                {/* Location Permission Status */}
                <div className={`p-6 rounded-xl border-2 ${
                  locationPermission 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Location Permission</h3>
                    <div className={`w-4 h-4 rounded-full ${
                      locationPermission ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                  
                {locationPermission ? (
                  <div>
                    <p className="text-green-700 mb-2">✓ Location access granted</p>
                    {teacherLocation && (
                      <div className="text-sm text-gray-600">
                        <p><strong>Latitude:</strong> {teacherLocation.latitude.toFixed(6)}</p>
                        <p><strong>Longitude:</strong> {teacherLocation.longitude.toFixed(6)}</p>
                        <p><strong>Accuracy:</strong> ±{Math.round(teacherLocation.accuracy)}m</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-yellow-700 mb-2">Location permission required for OTP generation</p>
                    <p className="text-xs text-gray-500">Click "Enable Location Permission" to get your coordinates</p>
                  </div>
                )}
                </div>

                {/* Location Permission Button */}
                <button
                  onClick={getCurrentLocation}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    !locationPermission
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={locationPermission}
                >
                  {locationPermission ? 'Location Enabled' : 'Enable Location Permission'}
                </button>

                {/* Geofencing Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Geofencing Settings</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Minimum distance: 100 meters</p>
                    <p>• Students must be within range</p>
                    <p>• Uses Haversine formula for accuracy</p>
                    <p>• Real-time location validation</p>
                  </div>
                </div>

                {/* Error Messages */}
                {locationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{locationError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p>This system uses geofencing to ensure students are physically present in the classroom.</p>
                <p className="mt-1">OTP generation is restricted to authorized locations only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOTPPage;
