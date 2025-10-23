import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Demo credentials
  const credentials = {
    student: [
      { email: 'student1@college.edu', password: '123' },
      { email: 'student2@college.edu', password: 'Stud@2025' }
    ],
    teacher: [
      { email: 'teacher1@college.edu', password: '123' },
      { email: 'teacher2@college.edu', password: 'Prof@2025' }
    ],
    temp: [
      { email: 'temp.user@example.com', password: 'tempPass1' }
    ]
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', password: '' });
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fillDemoCredentials = () => {
    const currentCredentials = credentials[activeTab];
    if (currentCredentials && currentCredentials.length > 0) {
      const randomCred = currentCredentials[Math.floor(Math.random() * currentCredentials.length)];
      setFormData({
        email: randomCred.email,
        password: randomCred.password
      });
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    
    const allCredentials = [
      ...credentials.student,
      ...credentials.teacher,
      ...credentials.temp
    ];
    
    const isValid = allCredentials.some(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (isValid) {
      // Save user email for tracking
      if (activeTab === 'teacher') {
        localStorage.setItem('teacherEmail', formData.email);
      } else {
        localStorage.setItem('studentEmail', formData.email);
      }
      
      setMessage({ type: 'success', text: 'Login successful! Redirecting to OTP verification...' });
      setTimeout(() => {
        onLoginSuccess(activeTab);
      }, 1500);
    } else {
      setMessage({ type: 'error', text: 'Invalid email or password. Please try again.' });
    }
  };

  const handleGoogleSignIn = () => {
    setMessage({ type: 'info', text: 'Google Sign-In would be implemented here in a real application.' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Smart Attendance Portal</h1>
          <p className="text-blue-200">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`tab-button flex-1 ${activeTab === 'student' ? 'active' : 'inactive'}`}
              onClick={() => handleTabChange('student')}
            >
              Student Login
            </button>
            <button
              className={`tab-button flex-1 ${activeTab === 'teacher' ? 'active' : 'inactive'}`}
              onClick={() => handleTabChange('teacher')}
            >
              Teacher Login
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Message Display */}
              {message.text && (
                <div className={`p-3 rounded-lg text-sm animate-fade-in ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' :
                  message.type === 'error' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Sign In Button */}
              <button type="submit" className="btn-primary">
                Sign In
              </button>

              {/* Demo Credentials Button */}
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="btn-secondary"
              >
                Fill Demo Credentials
              </button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="btn-google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            Use your official college email (e.g., name@college.edu) and password provided by the college IT department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
