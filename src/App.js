import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Login from './components/Login';
import OTPVerification from './components/OTPVerification';
import AttendanceView from './components/AttendanceView';
import TeacherOTPPage from './components/TeacherOTPPage';
import TeacherReport from './components/TeacherReport';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [, setUserRole] = useState('');

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    if (role === 'teacher') {
      setCurrentPage('teacher-otp');
    } else {
      setCurrentPage('otp');
    }
  };

  const handleTeacherReport = () => {
    setCurrentPage('teacher-report');
  };

  const handleBackToTeacher = () => {
    setCurrentPage('teacher-otp');
  };

  const handleOTPSuccess = () => {
    setCurrentPage('attendance');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
    setUserRole('');
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setUserRole('');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'otp':
        return (
          <OTPVerification
            onOTPSuccess={handleOTPSuccess}
            onBack={handleBackToLogin}
          />
        );
      case 'teacher-otp':
        return <TeacherOTPPage onBack={handleBackToLogin} onReport={handleTeacherReport} />;
      case 'teacher-report':
        return <TeacherReport onBack={handleBackToTeacher} />;
      case 'attendance':
        return <AttendanceView onLogout={handleLogout} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <AppProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </AppProvider>
  );
}

export default App;
