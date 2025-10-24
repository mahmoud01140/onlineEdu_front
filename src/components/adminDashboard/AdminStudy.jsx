// components/adminDashboard/AdminStudy.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  UserCheck,
  Save,
  RefreshCw,
  ChevronRight,
  Eye
} from "lucide-react";
import useAdminStudyStore from "../../stores/useAdminStudyStore";
import { motion } from "framer-motion";

const AdminStudy = () => {
  const {
    upcomingLessons,
    currentGroup,
    attendanceRecords,
    isLoading,
    fetchUpcomingLessons,
    fetchGroupDetails,
    markAttendance,
    fetchAttendanceRecords,
    clearCurrentGroup
  } = useAdminStudyStore();

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);

  useEffect(() => {
    fetchUpcomingLessons();
  }, []);

  useEffect(() => {
    if (selectedLesson && selectedLesson.group) {
      fetchGroupDetails(selectedLesson.group._id);
      fetchAttendanceRecords(selectedLesson._id);
    }
  }, [selectedLesson]);

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setShowAttendanceHistory(false);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        studentId
      }
    }));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
        studentId
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedLesson) return;

    const records = Object.values(attendanceData);
    
    if (records.length === 0) {
      toast.error("لم يتم تحديد أي حالة حضور");
      return;
    }

    try {
      await markAttendance(
        selectedLesson._id,
        selectedLesson.group._id,
        records
      );
      
      // Refresh attendance records
      fetchAttendanceRecords(selectedLesson._id);
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };

  const getAttendanceStatusCount = () => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    };

    Object.values(attendanceData).forEach(record => {
      if (counts[record.status] !== undefined) {
        counts[record.status]++;
      }
    });

    return counts;
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "text-green-600 bg-green-100",
      absent: "text-red-600 bg-red-100",
      late: "text-yellow-600 bg-yellow-100",
      excused: "text-blue-600 bg-blue-100"
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: <CheckCircle size={16} />,
      absent: <XCircle size={16} />,
      late: <ClockIcon size={16} />,
      excused: <UserCheck size={16} />
    };
    return icons[status] || <XCircle size={16} />;
  };

  const formatLessonDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const attendanceCounts = getAttendanceStatusCount();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            إدارة الدراسة
          </h1>
          <p className="text-gray-600 mt-1">
            متابعة الدروس القادمة وتسجيل الحضور والغياب
          </p>
        </div>
        
        <button
          onClick={fetchUpcomingLessons}
          disabled={isLoading}
          className="btn btn-outline gap-2"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Lessons Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 ml-2" />
              الدروس القادمة
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : upcomingLessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                <p>لا توجد دروس قادمة</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {upcomingLessons.map((lesson) => (
                  <motion.div
                    key={lesson._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedLesson?._id === lesson._id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {lesson.title}
                      </h3>
                      <ChevronRight
                        size={16}
                        className={`text-gray-400 ${
                          selectedLesson?._id === lesson._id
                            ? "text-primary"
                            : ""
                        }`}
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{lesson.group?.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{formatLessonDate(lesson.date)}</span>
                      </div>
                      
                      {lesson.group?.level && (
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} />
                          <span className="badge badge-outline badge-sm">
                            {lesson.group.level}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {!selectedLesson ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                اختر درساً للبدء
              </h3>
              <p className="text-gray-500">
                اختر أحد الدروس القادمة من القائمة لعرض تفاصيل المجموعة وتسجيل الحضور
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lesson Header */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedLesson.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowAttendanceHistory(!showAttendanceHistory)}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <Eye size={16} />
                    {showAttendanceHistory ? "عرض التسجيل" : "عرض السجل"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-600" />
                    <span className="font-medium">المجموعة:</span>
                    <span>{selectedLesson.group?.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-600" />
                    <span className="font-medium">الموعد:</span>
                    <span>{formatLessonDate(selectedLesson.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-purple-600" />
                    <span className="font-medium">المستوى:</span>
                    <span className="badge badge-outline">
                      {selectedLesson.group?.level}
                    </span>
                  </div>
                </div>

                {selectedLesson.zoomLink && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-800">رابط الزووم:</span>
                      <a
                        href={selectedLesson.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedLesson.zoomLink}
                      </a>
                    </div>
                    {selectedLesson.zoomPassword && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-blue-800">كلمة المرور:</span>
                        <span className="text-blue-600">{selectedLesson.zoomPassword}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Attendance Section */}
              {showAttendanceHistory ? (
                <AttendanceHistory
                  records={attendanceRecords}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ) : (
                <AttendanceForm
                  currentGroup={currentGroup}
                  attendanceData={attendanceData}
                  attendanceCounts={attendanceCounts}
                  isLoading={isLoading}
                  onAttendanceChange={handleAttendanceChange}
                  onNotesChange={handleNotesChange}
                  onSave={handleSaveAttendance}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Attendance Form Component
const AttendanceForm = ({
  currentGroup,
  attendanceData,
  attendanceCounts,
  isLoading,
  onAttendanceChange,
  onNotesChange,
  onSave,
  getStatusColor,
  getStatusIcon
}) => {
  if (!currentGroup) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-gray-600 mt-4">جاري تحميل تفاصيل المجموعة...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <UserCheck className="h-5 w-5 ml-2" />
          تسجيل الحضور والغياب
        </h3>
        
        <div className="flex gap-4 text-sm">
          {Object.entries(attendanceCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`badge badge-sm ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
              </span>
              <span className="font-medium">
                {count} {getStatusLabel(status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {currentGroup.students?.map((student) => (
          <motion.div
            key={student._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {student.name?.charAt(0) || "S"}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{student.name}</h4>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{student.email}</span>
                  {student.phone && <span>{student.phone}</span>}
                  {student.age && <span>العمر: {student.age}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Attendance Status */}
              <div className="flex gap-2">
                {["present", "absent", "late", "excused"].map((status) => (
                  <button
                    key={status}
                    onClick={() => onAttendanceChange(student._id, status)}
                    className={`btn btn-sm ${
                      attendanceData[student._id]?.status === status
                        ? getStatusColor(status).replace("text-", "btn-")
                        : "btn-ghost"
                    }`}
                  >
                    {getStatusIcon(status)}
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>

              {/* Notes */}
              <input
                type="text"
                placeholder="ملاحظات"
                value={attendanceData[student._id]?.notes || ""}
                onChange={(e) => onNotesChange(student._id, e.target.value)}
                className="input input-bordered input-sm w-32"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6 pt-6 border-t">
        <button
          onClick={onSave}
          disabled={isLoading || Object.keys(attendanceData).length === 0}
          className="btn btn-primary gap-2"
        >
          <Save size={20} />
          {isLoading ? "جاري الحفظ..." : "حفظ الحضور والغياب"}
        </button>
      </div>
    </div>
  );
};

// Attendance History Component
const AttendanceHistory = ({ records, getStatusColor, getStatusIcon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <UserCheck className="h-5 w-5 ml-2" />
        سجل الحضور والغياب
      </h3>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
          <p>لا توجد سجلات حضور لهذا الدرس</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`badge badge-lg ${getStatusColor(record.status)}`}>
                  {getStatusIcon(record.status)}
                  {getStatusLabel(record.status)}
                </div>
                
                <div>
                  <h4 className="font-semibold">{record.student?.name}</h4>
                  <p className="text-sm text-gray-600">{record.student?.email}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {new Date(record.createdAt).toLocaleDateString("ar-SA")}
                </div>
                {record.notes && (
                  <div className="text-sm text-gray-600 mt-1">{record.notes}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get status label in Arabic
const getStatusLabel = (status) => {
  const labels = {
    present: "حاضر",
    absent: "غائب",
    late: "متأخر",
    excused: "معذور"
  };
  return labels[status] || status;
};

export default AdminStudy;