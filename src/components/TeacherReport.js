import React, { useState, useEffect } from 'react';

const TeacherReport = ({ onBack }) => {
  const [reportData, setReportData] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get teacher email from localStorage or context
    const savedTeacherEmail = localStorage.getItem('teacherEmail') || 'teacher1@college.edu';
    setTeacherEmail(savedTeacherEmail);
    
    // Get student OTP usage data
    const studentUsageData = JSON.parse(localStorage.getItem('studentOTPUsage') || '[]');
    
    // Filter data for this teacher
    const teacherReport = studentUsageData.filter(record => 
      record.teacherEmail === savedTeacherEmail
    );
    
    setReportData(teacherReport);
    setIsLoading(false);
  }, []);

  const downloadCSV = () => {
    if (reportData.length === 0) {
      alert('No data available to download');
      return;
    }

    const headers = ['Student Email', 'OTP Used', 'Date', 'Time', 'Location'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(record => [
        record.studentEmail,
        record.otpUsed,
        record.date,
        record.time,
        record.location
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher-report-${teacherEmail}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Teacher Report</h1>
          <p className="text-blue-200">Students who used OTP under your email</p>
        </div>

        {/* Report Card */}
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
              Back to Teacher Dashboard
            </button>

            {/* Teacher Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Report for Teacher</h3>
              <p className="text-blue-700">{teacherEmail}</p>
            </div>

            {/* Download Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student OTP Usage Report</h2>
              <button
                onClick={downloadCSV}
                disabled={reportData.length === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  reportData.length > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CSV
                </div>
              </button>
            </div>

            {/* Report Data */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading report data...</span>
              </div>
            ) : reportData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-600">No students have used OTP under your email yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Student Email</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">OTP Used</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Time</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-gray-900">{record.studentEmail}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-900 font-mono">{record.otpUsed}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-900">{record.date}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-900">{record.time}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Present
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {reportData.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{reportData.length}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{reportData.length}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReport;
