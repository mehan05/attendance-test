import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Load from localStorage on initialization
  const [teacherOTP, setTeacherOTP] = useState(() => {
    const saved = localStorage.getItem('teacherOTP');
    return saved ? JSON.parse(saved) : null;
  });
  const [teacherLocation, setTeacherLocation] = useState(() => {
    const saved = localStorage.getItem('teacherLocation');
    return saved ? JSON.parse(saved) : null;
  });
  const [otpExpiry, setOtpExpiry] = useState(() => {
    const saved = localStorage.getItem('otpExpiry');
    return saved ? new Date(JSON.parse(saved)) : null;
  });
  const [isOTPActive, setIsOTPActive] = useState(() => {
    const saved = localStorage.getItem('isOTPActive');
    return saved ? JSON.parse(saved) : false;
  });

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    setTeacherOTP(otp);
    setOtpExpiry(expiry);
    setIsOTPActive(true);
    
    // Save to localStorage
    localStorage.setItem('teacherOTP', JSON.stringify(otp));
    localStorage.setItem('otpExpiry', JSON.stringify(expiry));
    localStorage.setItem('isOTPActive', JSON.stringify(true));
    
    return otp;
  };

  const validateOTP = (inputOTP, studentEmail = 'student@college.edu') => {
    console.log('Validating OTP:', { inputOTP, teacherOTP, isOTPActive, teacherLocation });
    
    if (!teacherOTP || !isOTPActive) {
      return { valid: false, message: 'No active OTP found' };
    }
    
    if (new Date() > otpExpiry) {
      setIsOTPActive(false);
      return { valid: false, message: 'OTP has expired' };
    }
    
    if (inputOTP === teacherOTP) {
      setIsOTPActive(false);
      
      // Record student OTP usage
      const teacherEmail = localStorage.getItem('teacherEmail') || 'teacher1@college.edu';
      const usageRecord = {
        studentEmail: studentEmail,
        teacherEmail: teacherEmail,
        otpUsed: inputOTP,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        location: teacherLocation ? `${teacherLocation.latitude.toFixed(6)}, ${teacherLocation.longitude.toFixed(6)}` : 'Unknown'
      };
      
      // Save to localStorage
      const existingUsage = JSON.parse(localStorage.getItem('studentOTPUsage') || '[]');
      existingUsage.push(usageRecord);
      localStorage.setItem('studentOTPUsage', JSON.stringify(existingUsage));
      
      return { valid: true, message: 'Attendance updated successfully!' };
    }
    
    return { valid: false, message: 'Wrong OTP' };
  };

  const setLocation = (location) => {
    console.log('Setting teacher location in context:', location);
    setTeacherLocation(location);
    // Save to localStorage
    localStorage.setItem('teacherLocation', JSON.stringify(location));
  };

  const clearOTP = () => {
    setTeacherOTP(null);
    setOtpExpiry(null);
    setIsOTPActive(false);
    
    // Clear from localStorage
    localStorage.removeItem('teacherOTP');
    localStorage.removeItem('otpExpiry');
    localStorage.removeItem('isOTPActive');
  };

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'teacherLocation' && e.newValue) {
        setTeacherLocation(JSON.parse(e.newValue));
      }
      if (e.key === 'teacherOTP' && e.newValue) {
        setTeacherOTP(JSON.parse(e.newValue));
      }
      if (e.key === 'otpExpiry' && e.newValue) {
        setOtpExpiry(new Date(JSON.parse(e.newValue)));
      }
      if (e.key === 'isOTPActive' && e.newValue !== null) {
        setIsOTPActive(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    teacherOTP,
    teacherLocation,
    otpExpiry,
    isOTPActive,
    generateOTP,
    validateOTP,
    setLocation,
    clearOTP
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
