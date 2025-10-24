// components/adminDashboard/LiveExamsManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Video,
  BookOpen,
  Save,
  X,
  AlertCircle,
  List,
  CalendarDays,
} from "lucide-react";
import useLiveExamStore from "../../stores/useLiveExamStore";
// import useGroupStore from "../../stores/useGroupStore";
import { motion } from "framer-motion";

const LiveExamsManagement = () => {
  const {
    liveExams,
    isLoading,
    fetchUpcomingLiveExams,
    deleteLiveExam,
    allLiveExams,
    fetchAllLiveExams,
  } = useLiveExamStore();

  //   const { groups, fetchGroups } = useGroupStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [viewingExam, setViewingExam] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "all"

  useEffect(() => {
    fetchUpcomingLiveExams();
    fetchAllLiveExams();
    // fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الامتحان الحي؟")) {
      try {
        await deleteLiveExam(id);
      } catch (error) {
        console.error("Failed to delete live exam:", error);
      }
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setShowCreateForm(true);
  };

  const handleView = (exam) => {
    setViewingExam(exam);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingExam(null);
  };

  const handleCloseView = () => {
    setViewingExam(null);
  };

  // Filter exams based on active tab
  const getDisplayedExams = () => {
    if (activeTab === "upcoming") {
      return liveExams;
    } else {
      return allLiveExams;
    }
  };

  // Get statistics
  const upcomingCount = liveExams.length;
  const totalCount = allLiveExams.length;
  const activeCount = liveExams.filter(
    (exam) => new Date(exam.examDateTime) > new Date()
  ).length;
  const completedCount = allLiveExams.filter(
    (exam) => new Date(exam.examDateTime) <= new Date()
  ).length;

  if (showCreateForm) {
    return (
      <LiveExamForm
        exam={editingExam}
        // groups={groups}
        onSave={() => {
          handleCloseForm();
          fetchUpcomingLiveExams();
          fetchAllLiveExams();
        }}
        onCancel={handleCloseForm}
      />
    );
  }

  if (viewingExam) {
    return <LiveExamDetails exam={viewingExam} onClose={handleCloseView} />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            إدارة الامتحانات الحية
          </h1>
          <p className="text-gray-600 mt-1">
            إنشاء وإدارة الامتحانات الحية المباشرة
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary gap-2"
        >
          <Plus size={20} />
          امتحان جديد
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Calendar size={32} />
            </div>
            <div className="stat-title">الامتحانات القادمة</div>
            <div className="stat-value text-primary">{upcomingCount}</div>
            <div className="stat-desc">في الأيام المقبلة</div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <List size={32} />
            </div>
            <div className="stat-title">جميع الامتحانات</div>
            <div className="stat-value text-secondary">{totalCount}</div>
            <div className="stat-desc">الإجمالي</div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <Video size={32} />
            </div>
            <div className="stat-title">نشطة</div>
            <div className="stat-value text-accent">{activeCount}</div>
            <div className="stat-desc">امتحان قادم</div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-gray-600">
              <CalendarDays size={32} />
            </div>
            <div className="stat-title">منتهية</div>
            <div className="stat-value text-gray-600">{completedCount}</div>
            <div className="stat-desc">امتحان مكتمل</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-white p-2 rounded-lg shadow-sm">
        <button
          className={`tab tab-lg ${
            activeTab === "upcoming" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          <Calendar className="h-4 w-4 ml-2" />
          الامتحانات القادمة
          <span className="badge badge-sm badge-primary mr-2">
            {upcomingCount}
          </span>
        </button>
        <button
          className={`tab tab-lg ${activeTab === "all" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <List className="h-4 w-4 ml-2" />
          جميع الامتحانات
          <span className="badge badge-sm badge-secondary mr-2">
            {totalCount}
          </span>
        </button>
      </div>

      {/* Live Exams List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            {activeTab === "upcoming" ? (
              <>
                <Calendar className="h-5 w-5 ml-2" />
                الامتحانات الحية القادمة
              </>
            ) : (
              <>
                <List className="h-5 w-5 ml-2" />
                جميع الامتحانات الحية
              </>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : getDisplayedExams().length === 0 ? (
          <div className="text-center py-12">
            <Video size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              {activeTab === "upcoming"
                ? "لا توجد امتحانات قادمة"
                : "لا توجد امتحانات حية"}
            </h3>
            <p className="text-gray-500 mt-2">
              {activeTab === "upcoming"
                ? "لا توجد امتحانات حية قادمة في الوقت الحالي"
                : "قم بإنشاء امتحان حي جديد للبدء"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>الامتحان</th>
                  {/* <th>المجموعة</th> */}
                  <th>التاريخ والوقت</th>
                  <th>المدة</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {getDisplayedExams().map((exam) => (
                  <LiveExamRow
                    key={exam._id}
                    exam={exam}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    showAll={activeTab === "all"}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Live Exam Row Component - Updated to handle both upcoming and all exams
const LiveExamRow = ({ exam, onEdit, onDelete, onView, showAll }) => {
  const examDateTime = exam.examDateTime
    ? new Date(exam.examDateTime)
    : new Date(`${exam.examDate}T${exam.examTime}`);
  const isUpcoming = examDateTime > new Date();
  const isToday =
    new Date(exam.examDate).toDateString() === new Date().toDateString();
  const isPast = examDateTime <= new Date();

  const getStatusBadge = () => {
    if (isPast) {
      return <span className="badge badge-error">منتهي</span>;
    }
    if (isToday) {
      return <span className="badge badge-warning">اليوم</span>;
    }
    return <span className="badge badge-success">قادم</span>;
  };

  const formatDateTime = (examDate, examTime) => {
    const date = new Date(examDate);
    return {
      date: date.toLocaleDateString("ar-SA"),
      time: examTime,
      fullDate: `${date.toLocaleDateString("ar-SA")} - ${examTime}`,
    };
  };

  const { date, time, fullDate } = formatDateTime(exam.examDate, exam.examTime);

  return (
    <tr className={isPast && showAll ? "opacity-60" : ""}>
      <td>
        <div>
          <div className="font-bold text-gray-900">{exam.title}</div>
          <div className="text-sm text-gray-600 line-clamp-2">
            {exam.description}
          </div>
        </div>
      </td>
      {/* <td> */}
      {/* <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" /> */}
      {/* <span>{exam.group?.title || "غير محدد"}</span> */}
      {/* </div> */}
      {/* </td> */}
      <td>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span>{time}</span>
          </div>
        </div>
      </td>
      <td>
        <span className="badge badge-outline">{exam.duration} دقيقة</span>
      </td>
      <td>{getStatusBadge()}</td>
      <td>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(exam)}
            className="btn btn-info btn-xs gap-1"
            title="عرض التفاصيل"
          >
            <Eye size={12} />
          </button>
          <button
            onClick={() => onEdit(exam)}
            className="btn btn-warning btn-xs gap-1"
            disabled={!isUpcoming}
            title={isUpcoming ? "تعديل" : "لا يمكن تعديل الامتحان المنتهي"}
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={() => onDelete(exam._id)}
            className="btn btn-error btn-xs gap-1"
            title="حذف"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Live Exam Form Component (unchanged)
const LiveExamForm = ({ exam, groups, onSave, onCancel }) => {
  const { createLiveExam, updateLiveExam, isLoading } = useLiveExamStore();

  const isEditing = !!exam;

  const [formData, setFormData] = useState({
    title: exam?.title || "",
    description: exam?.description || "",
    examDate: exam?.examDate
      ? new Date(exam.examDate).toISOString().split("T")[0]
      : "",
    examTime: exam?.examTime || "18:00",
    duration: exam?.duration || 60,
    // group: exam?.group?._id || "",
    instructions: exam?.instructions || "",
    maxScore: exam?.maxScore || 100,
    zoomLink: exam?.zoomLink || "",
    zoomPassword: exam?.zoomPassword || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان الامتحان مطلوب";
    }

    if (!formData.description.trim()) {
      newErrors.description = "وصف الامتحان مطلوب";
    }

    if (!formData.examDate) {
      newErrors.examDate = "تاريخ الامتحان مطلوب";
    } else if (new Date(formData.examDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.examDate = "يجب أن يكون التاريخ في المستقبل";
    }

    if (!formData.examTime) {
      newErrors.examTime = "وقت الامتحان مطلوب";
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = "المدة يجب أن تكون على الأقل دقيقة واحدة";
    }

    // if (!formData.group) {
    //   newErrors.group = "يجب اختيار مجموعة";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateLiveExam(exam._id, formData);
      } else {
        await createLiveExam(formData);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save live exam:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "تعديل الامتحان الحي" : "إنشاء امتحان حي جديد"}
            </h1>
            <p className="text-gray-600">أدخل تفاصيل الامتحان الحي</p>
          </div>
        </div>
        <button onClick={onCancel} className="btn btn-ghost btn-circle">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">عنوان الامتحان *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="أدخل عنوان الامتحان"
              className={`input input-bordered ${
                errors.title ? "input-error" : ""
              }`}
            />
            {errors.title && (
              <span className="text-error text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/* <div className="form-control">
            <label className="label">
              <span className="label-text">المجموعة *</span>
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={`select select-bordered ${errors.group ? 'select-error' : ''}`}
            >
              <option value="">اختر مجموعة</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.title} - {group.level}
                </option>
              ))}
            </select>
            {errors.group && (
              <span className="text-error text-sm mt-1">{errors.group}</span>
            )}
          </div> */}

          <div className="form-control">
            <label className="label">
              <span className="label-text">تاريخ الامتحان *</span>
            </label>
            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`input input-bordered ${
                errors.examDate ? "input-error" : ""
              }`}
            />
            {errors.examDate && (
              <span className="text-error text-sm mt-1">{errors.examDate}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">وقت الامتحان *</span>
            </label>
            <input
              type="time"
              name="examTime"
              value={formData.examTime}
              onChange={handleChange}
              className={`input input-bordered ${
                errors.examTime ? "input-error" : ""
              }`}
            />
            {errors.examTime && (
              <span className="text-error text-sm mt-1">{errors.examTime}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">المدة (دقائق) *</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              max="300"
              className={`input input-bordered ${
                errors.duration ? "input-error" : ""
              }`}
            />
            {errors.duration && (
              <span className="text-error text-sm mt-1">{errors.duration}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">الدرجة الكاملة</span>
            </label>
            <input
              type="number"
              name="maxScore"
              value={formData.maxScore}
              onChange={handleChange}
              min="1"
              max="1000"
              className="input input-bordered"
            />
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Video className="h-5 w-5 ml-2" />
            إعدادات Zoom (اختياري)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">رابط Zoom</span>
              </label>
              <input
                type="url"
                name="zoomLink"
                value={formData.zoomLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">كلمة مرور Zoom</span>
              </label>
              <input
                type="text"
                name="zoomPassword"
                value={formData.zoomPassword}
                onChange={handleChange}
                placeholder="كلمة المرور"
                className="input input-bordered"
              />
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">وصف الامتحان *</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="أدخل وصفاً مفصلاً للامتحان"
            className={`textarea textarea-bordered h-24 ${
              errors.description ? "textarea-error" : ""
            }`}
          />
          {errors.description && (
            <span className="text-error text-sm mt-1">
              {errors.description}
            </span>
          )}
        </div>

        {/* Instructions */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">تعليمات الامتحان</span>
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="أدخل تعليمات الامتحان للطلاب"
            className="textarea textarea-bordered h-32"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            إلغاء
          </button>
          <button
            type="submit"
            className="btn btn-primary gap-2"
            disabled={isLoading}
          >
            <Save size={20} />
            {isLoading
              ? "جاري الحفظ..."
              : isEditing
              ? "تحديث الامتحان"
              : "إنشاء الامتحان"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Live Exam Details Component (unchanged)
const LiveExamDetails = ({ exam, onClose }) => {
  console.log(exam)
  const formatDateTime = (examDate, examTime) => {
    const date = new Date(examDate);
    return {
      date: date.toLocaleDateString("ar-SA"),
      time: examTime,
      fullDate: `${date.toLocaleDateString("ar-SA")} - ${examTime}`,
    };
  };

  const examDateTime = exam.examDateTime
    ? new Date(exam.examDateTime)
    : new Date(`${exam.examDate}T${exam.examTime}`);
  const isUpcoming = examDateTime > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-gray-600">تفاصيل الامتحان الحي</p>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Exam Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              المعلومات الأساسية
            </h3>
            <div className="space-y-2 text-sm">
              {/* <div className="flex justify-between">
                <span className="text-blue-700">المجموعة:</span>
                <span className="font-medium">{exam.group?.title || "غير محدد"}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-blue-700">التاريخ:</span>
                <span className="font-medium">
                  {formatDateTime(exam.examDate, exam.examTime).date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">الوقت:</span>
                <span className="font-medium">
                  {formatDateTime(exam.examDate, exam.examTime).time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">المدة:</span>
                <span className="font-medium">{exam.duration} دقيقة</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              معلومات التقييم
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">الدرجة الكاملة:</span>
                <span className="font-medium">{exam.maxScore || 100}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">الحالة:</span>
                <span
                  className={`badge ${
                    isUpcoming ? "badge-success" : "badge-error"
                  }`}
                >
                  {isUpcoming ? "قادم" : "منتهي"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">النوع:</span>
                <span className="font-medium">امتحان حي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {exam.description && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">وصف الامتحان</h3>
            <p className="text-gray-700">{exam.description}</p>
          </div>
        )}

        {/* Instructions */}
        {exam.instructions && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              تعليمات الامتحان
            </h3>
            <p className="text-yellow-700 whitespace-pre-line">
              {exam.instructions}
            </p>
          </div>
        )}
        {exam.users.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">الطلاب المسجلين</h3>
            <p className="text-red-700">
              {exam.users.map((user) => user?.name).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user?.email).join(", ")}
            </p>
            <p className="text-red-700">
              {/* {exam.users.map((user) => user?.phone).join(", ")} */} 
            </p>
            {/* <p className="text-red-700">
              {exam.users.map((user) => user.age).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.address).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.level).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.profileImage).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.isActive).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.isPassLiveEx).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.isPasslevelEx).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.permissions).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.department).join(", ")}
            </p>
            <p className="text-red-700">
              {exam.users.map((user) => user.groups).join(", ")}
            </p> */}
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-end pt-6 border-t">
          <button onClick={onClose} className="btn btn-primary">
            إغلاق
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveExamsManagement;
