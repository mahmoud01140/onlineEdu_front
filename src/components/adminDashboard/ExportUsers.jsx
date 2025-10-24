// components/adminDashboard/ExportUsers.jsx - Add this component

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Table, 
  Filter, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  BookOpen,
  BarChart3,
  Clock,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';
import { axiosInstance } from '../../lib/axios';

const ExportUsers = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'attendance'
  
  // Users export state
  const [userFilters, setUserFilters] = useState({
    role: '',
    level: '',
    isActive: '',
    search: ''
  });
  
  // Attendance export state
  const [attendanceFilters, setAttendanceFilters] = useState({
    groupId: '',
    studentId: '',
    status: 'all',
    startDate: '',
    endDate: ''
  });
  
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [exportOptions, setExportOptions] = useState({
    includeAttendance: true,
    includeExams: true,
    includeGroups: true,
    dataLimit: 'all'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch groups and students for attendance filters
  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchGroups();
      fetchStudents();
    }
  }, [activeTab]);

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get('/groups');
      setGroups(response.data.data?.groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/users?role=student');
      setStudents(response.data.data?.users || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleUserFilterChange = (key, value) => {
    setUserFilters(prev => ({ ...prev, [key]: value }));
    setError('');
    setSuccess('');
  };

  const handleAttendanceFilterChange = (key, value) => {
    setAttendanceFilters(prev => ({ ...prev, [key]: value }));
    setError('');
    setSuccess('');
  };

  const handleExportOptionChange = (key, value) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async (format) => {
    if (!user ) {
      setError('غير مصرح لك بتنزيل البيانات');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let endpoint = '/export/users';
      let params = { format, ...exportOptions };

      if (activeTab === 'attendance') {
        endpoint = '/export/attendance';
        params = { ...attendanceFilters };
      } else {
        params = { ...params, ...userFilters };
      }

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await axiosInstance.get(endpoint, {
        params,
        responseType: 'blob',
        timeout: 60000,
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Download progress: ${percentCompleted}%`);
        }
      });

      if (!(response.data instanceof Blob)) {
        throw new Error('استجابة غير صالحة من الخادم');
      }

      if (response.data.size === 0) {
        throw new Error('الملف الذي تم تنزيله فارغ');
      }

      const contentDisposition = response.headers['content-disposition'];
      let filename = activeTab === 'attendance' 
        ? `attendance-report-${new Date().toISOString().split('T')[0]}.xlsx`
        : `users-report-${new Date().toISOString().split('T')[0]}.${format === 'word' ? 'docx' : 'xlsx'}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      const successMessage = activeTab === 'attendance' 
        ? `تم تنزيل تقرير الحضور بنجاح: ${filename}`
        : `تم تنزيل التقرير الشامل بنجاح: ${filename}`;

      setSuccess(successMessage);

    } catch (error) {
      console.error('Export error:', error);
      // ... error handling (same as before)
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    if (activeTab === 'users') {
      setUserFilters({
        role: '',
        level: '',
        isActive: '',
        search: ''
      });
    } else {
      setAttendanceFilters({
        groupId: '',
        studentId: '',
        status: 'all',
        startDate: '',
        endDate: ''
      });
    }
    setError('');
    setSuccess('');
  };

  const hasActiveFilters = activeTab === 'users' 
    ? Object.values(userFilters).some(value => value !== '')
    : Object.values(attendanceFilters).some(value => value !== '' && value !== 'all');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="h-5 w-5 ml-2" />
            نظام التصدير والتقارير
          </h2>
          <p className="text-gray-600 mt-1">
            تصدير البيانات الشاملة وتقارير الحضور والغياب
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-gray-100 p-2 rounded-lg mb-6">
        <button
          className={`tab tab-lg ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users className="h-4 w-4 ml-2" />
          التقرير الشامل
        </button>
        <button
          className={`tab tab-lg ${activeTab === 'attendance' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <CalendarDays className="h-4 w-4 ml-2" />
          تقرير الحضور والغياب
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success mb-6">
          <CheckCircle className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-6">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Export Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Users filters and options (same as before) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Filter className="h-4 w-4 ml-2" />
              فلاتر البحث
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                <select
                  value={userFilters.role}
                  onChange={(e) => handleUserFilterChange('role', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">جميع الأدوار</option>
                  <option value="student">طالب</option>
                  <option value="teacher">معلم</option>
                  <option value="elder">كبير</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
                <select
                  value={userFilters.level}
                  onChange={(e) => handleUserFilterChange('level', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">جميع المستويات</option>
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  value={userFilters.isActive}
                  onChange={(e) => handleUserFilterChange('isActive', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">الكل</option>
                  <option value="true">نشط</option>
                  <option value="false">غير نشط</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">بحث</label>
                <input
                  type="text"
                  value={userFilters.search}
                  onChange={(e) => handleUserFilterChange('search', e.target.value)}
                  placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Export Options Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="h-4 w-4 ml-2" />
              خيارات التصدير
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
              {/* ... existing export options ... */}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Export Tab */}
      {activeTab === 'attendance' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CalendarDays className="h-4 w-4 ml-2" />
              فلاتر تقرير الحضور
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-red-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المجموعة</label>
                <select
                  value={attendanceFilters.groupId}
                  onChange={(e) => handleAttendanceFilterChange('groupId', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">جميع المجموعات</option>
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الطالب</label>
                <select
                  value={attendanceFilters.studentId}
                  onChange={(e) => handleAttendanceFilterChange('studentId', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">جميع الطلاب</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة الحضور</label>
                <select
                  value={attendanceFilters.status}
                  onChange={(e) => handleAttendanceFilterChange('status', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="present">حاضر</option>
                  <option value="absent">غائب</option>
                  <option value="late">متأخر</option>
                  <option value="excused">معذور</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفترة الزمنية</label>
                <select
                  value={attendanceFilters.period}
                  onChange={(e) => {
                    const today = new Date();
                    const startDate = new Date();
                    
                    if (e.target.value === 'lastWeek') {
                      startDate.setDate(today.getDate() - 7);
                    } else if (e.target.value === 'lastMonth') {
                      startDate.setDate(today.getDate() - 30);
                    } else if (e.target.value === 'last3Months') {
                      startDate.setDate(today.getDate() - 90);
                    }
                    
                    if (e.target.value !== 'custom') {
                      handleAttendanceFilterChange('startDate', startDate.toISOString().split('T')[0]);
                      handleAttendanceFilterChange('endDate', today.toISOString().split('T')[0]);
                    }
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="lastMonth">آخر 30 يوم</option>
                  <option value="lastWeek">آخر أسبوع</option>
                  <option value="last3Months">آخر 3 أشهر</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-orange-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
                <input
                  type="date"
                  value={attendanceFilters.startDate}
                  onChange={(e) => handleAttendanceFilterChange('startDate', e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
                <input
                  type="date"
                  value={attendanceFilters.endDate}
                  onChange={(e) => handleAttendanceFilterChange('endDate', e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Status */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>الفلاتر النشطة:</strong> 
            {activeTab === 'users' ? (
              <>
                {userFilters.role && ` الدور: ${userFilters.role === 'student' ? 'طالب' : userFilters.role === 'teacher' ? 'معلم' : userFilters.role === 'elder' ? 'كبير' : 'مدير'}`}
                {userFilters.level && ` المستوى: ${userFilters.level}`}
                {userFilters.isActive && ` الحالة: ${userFilters.isActive === 'true' ? 'نشط' : 'غير نشط'}`}
                {userFilters.search && ` البحث: ${userFilters.search}`}
              </>
            ) : (
              <>
                {attendanceFilters.groupId && ` المجموعة: ${groups.find(g => g._id === attendanceFilters.groupId)?.title || attendanceFilters.groupId}`}
                {attendanceFilters.studentId && ` الطالب: ${students.find(s => s._id === attendanceFilters.studentId)?.name || attendanceFilters.studentId}`}
                {attendanceFilters.status !== 'all' && ` الحالة: ${attendanceFilters.status === 'present' ? 'حاضر' : attendanceFilters.status === 'absent' ? 'غائب' : attendanceFilters.status === 'late' ? 'متأخر' : 'معذور'}`}
                {attendanceFilters.startDate && ` من: ${new Date(attendanceFilters.startDate).toLocaleDateString('ar-SA')}`}
                {attendanceFilters.endDate && ` إلى: ${new Date(attendanceFilters.endDate).toLocaleDateString('ar-SA')}`}
              </>
            )}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {activeTab === 'users' ? (
          <>
            <button
              onClick={() => handleExport('excel')}
              disabled={isLoading}
              className="btn btn-success gap-2 flex-1 md:flex-none min-w-40"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Table className="h-4 w-4" />
              )}
              Excel شامل
            </button>

            <button
              onClick={() => handleExport('word')}
              disabled={isLoading}
              className="btn btn-primary gap-2 flex-1 md:flex-none min-w-40"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Word موجز
            </button>
          </>
        ) : (
          <button
            onClick={() => handleExport('excel')}
            disabled={isLoading}
            className="btn btn-error gap-2 flex-1 md:flex-none min-w-48"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <CalendarDays className="h-4 w-4" />
            )}
            تحميل تقرير الحضور
          </button>
        )}

        <button
          onClick={clearFilters}
          disabled={isLoading}
          className="btn btn-outline gap-2 flex-1 md:flex-none min-w-32"
        >
          <Filter className="h-4 w-4" />
          مسح الكل
        </button>
      </div>

      {/* Loading Progress */}
      {isLoading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              {activeTab === 'attendance' ? 'جاري إعداد تقرير الحضور...' : 'جاري جمع البيانات وإعداد التقرير...'}
            </span>
            <span>قد تستغرق العملية عدة دقائق</span>
          </div>
          <progress className="progress progress-primary w-full"></progress>
        </div>
      )}

      {/* Report Information */}
      <div className="mt-6">
        {activeTab === 'users' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">تقرير Excel الشامل يشمل:</h4>
              <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                <li>بيانات المستخدمين الأساسية</li>
                <li>المجموعات والصفوف</li>
                <li>سجل الحضور والغياب</li>
                <li>نتائج الامتحانات</li>
                <li>الإحصائيات والتقارير</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">تقرير Word الموجز يشمل:</h4>
              <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                <li>ملخص إحصائي شامل</li>
                <li>بيانات المستخدمين الرئيسية</li>
                <li>توزيع المستخدمين حسب الدور والمستوى</li>
                <li>تقرير مناسب للعرض والإدارة</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">تقرير الحضور والغياب يشمل:</h4>
            <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
              <li>سجل كامل للحضور والغياب حسب الفلتر</li>
              <li>ملخص إحصائي شامل بنسب الحضور والغياب</li>
              <li>إحصائيات مفصلة لكل طالب</li>
              <li>تلوين السجلات حسب حالة الحضور</li>
              <li>إمكانية التصفية والترتيب في Excel</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportUsers;