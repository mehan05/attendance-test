import React, { useState, useEffect, useMemo } from 'react';

const AttendanceView = ({ onLogout }) => {
  const handleLogout = () => {
    // Clear attendance data when logging out
    localStorage.removeItem('markedPeriods');
    onLogout();
  };

  // Time slots - initially all absent, will change to present period by period
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, period: 'Forenoon', status: 'absent' },
    { id: 2, period: 'Afternoon', status: 'absent' },
    { id: 3, period: 'Period 1', time: '8.45 - 9.35', status: 'absent' },
    { id: 4, period: 'Period 2', time: '9.35- 10.25', status: 'absent' },
    { id: 5, period: 'Period 3', time: '10.40-11.30', status: 'absent' },
    { id: 6, period: 'Period 4', time: '11.30-12.30', status: 'absent' },
    { id: 7, period: 'Period 5', time: '1.20-2.20', status: 'absent' },
    { id: 8, period: 'Period 6', time: '2.20-3.10', status: 'absent' },
    { id: 9, period: 'Period 7', time: '3.25-4.25', status: 'absent' }
  ]);

  // Track which periods have been marked as present
  const [markedPeriods] = useState(() => {
    const saved = localStorage.getItem('markedPeriods');
    return saved ? JSON.parse(saved) : [];
  });

  // Mock attendance data - Period 1 marking doesn't affect daily attendance count
  const attendanceData = useMemo(() => ({
    total: 120,
    present: 0, // Always 0 - Period 1 is not counted as a full day
    absent: 120, // Always 120 - Period 1 is not counted as a full day
    percentage: 100.0 // Always 100% - Period 1 is not counted as a full day
  }), []);

  // Update time slots based on marked periods
  useEffect(() => {
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => ({
        ...slot,
        status: markedPeriods.includes(slot.id) ? 'present' : 'absent'
      }))
    );
  }, [markedPeriods]);

  // Save marked periods to localStorage
  useEffect(() => {
    localStorage.setItem('markedPeriods', JSON.stringify(markedPeriods));
  }, [markedPeriods]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✓';
      case 'absent': return '✗';
      case 'late': return '⏰';
      default: return '?';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Attendance</h1>
            <p className="text-blue-200">Track your daily attendance and time slots</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Attendance Status Banner */}
        {markedPeriods.length > 0 && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Attendance Marked Successfully!</span>
            </div>
            <p className="text-sm mt-1">Period 1 has been marked as present for today.</p>
          </div>
        )}

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Days</p>
                <p className="text-3xl font-bold text-gray-900">{attendanceData.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Present</p>
                <p className="text-3xl font-bold text-green-600">{attendanceData.present}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Absent</p>
                <p className="text-3xl font-bold text-red-600">{attendanceData.absent}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✗</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Percentage</p>
                <p className="text-3xl font-bold text-blue-600">{attendanceData.percentage}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>


        {/* Time Slots Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Time Slots</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(slot.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{slot.period}</h3>
                  <span className="text-2xl">{getStatusIcon(slot.status)}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">{slot.time}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    slot.status === 'present' ? 'bg-green-200 text-green-800' :
                    slot.status === 'absent' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
