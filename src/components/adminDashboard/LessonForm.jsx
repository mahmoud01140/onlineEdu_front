import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  X,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Link,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  Edit,
  Eye,
  File,
  Image,
  Film,
  Headphones,
  ExternalLink,
} from "lucide-react";
import useLessonStore from "../../stores/useLessonStore";
import useGroupStore from "../../stores/useGroupStore";
import useExamStore from "../../stores/useExamStore";
import ExamForm from "../../components/adminDashboard/ExamForm";

const LessonForm = ({ lessonData, onClose, onSave }) => {
  const { createLesson, updateLesson, isLoading } = useLessonStore();
  const { groups, fetchGroups } = useGroupStore();
  const { exams, fetchExams, createExam, deleteExam, fetchLessonExams, lessonExams } = useExamStore();

  const [isExamFormOpen, setIsExamFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group: "",
    date: "",
    time: "",
    resources: [],
    zoomLink: "",
    zoomPassword: "",
    exam: "",
  });
  const [newResource, setNewResource] = useState({
    url: "",
    type: "link",
    title: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [resourceErrors, setResourceErrors] = useState({});

  // Fetch exams on component mount
  useEffect(() => {
    if (lessonData?._id) {
      fetchLessonExams(lessonData._id);
    }
  }, [lessonData]);

  // Initialize data if there's lessonData (edit mode)
  useEffect(() => {
    if (lessonData) {
      const lessonDate = new Date(lessonData.date);
      const formattedDate = lessonDate.toISOString().split("T")[0];
      const formattedTime = lessonDate.toTimeString().slice(0, 5);

      setFormData({
        title: lessonData.title || "",
        description: lessonData.description || "",
        group: lessonData.group?._id || "",
        date: formattedDate,
        time: formattedTime,
        resources: lessonData.resources || [],
        zoomLink: lessonData.zoomLink || "",
        zoomPassword: lessonData.zoomPassword || "",
        exam: lessonData.exam?._id || "",
      });
    } else {
      // Default values for new lesson
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = tomorrow.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
        time: "18:00",
      }));
    }
  }, [lessonData]);

  // Fetch available groups
  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when editing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear resource errors
    if (resourceErrors[name]) {
      setResourceErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const detectResourceType = (url) => {
    if (url.includes('drive.google.com')) {
      if (url.includes('/file/d/')) return 'file';
      if (url.includes('/folders/')) return 'folder';
      return 'link';
    }
    
    const extension = url.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const pdfExtensions = ['pdf'];

    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'audio';
    if (imageExtensions.includes(extension)) return 'image';
    if (pdfExtensions.includes(extension)) return 'pdf';
    
    return 'link';
  };

  const extractGoogleDriveFileId = (url) => {
    const match = url.match(/\/d\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const validateResource = () => {
    const newErrors = {};

    if (!newResource.url.trim()) {
      newErrors.url = "رابط المورد مطلوب";
    } else if (!newResource.url.includes('drive.google.com')) {
      newErrors.url = "يجب أن يكون الرابط من Google Drive";
    }

    if (!newResource.title.trim()) {
      newErrors.title = "عنوان المورد مطلوب";
    }

    setResourceErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddResource = () => {
    if (!validateResource()) {
      return;
    }

    const resourceType = detectResourceType(newResource.url);
    const fileId = extractGoogleDriveFileId(newResource.url);
    const previewUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w200` : null;

    const resource = {
      url: newResource.url,
      type: resourceType,
      title: newResource.title,
      description: newResource.description,
      previewUrl: previewUrl,
      fileId: fileId,
      addedAt: new Date().toISOString()
    };

    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, resource],
    }));

    // Reset form
    setNewResource({
      url: "",
      type: "link",
      title: "",
      description: ""
    });
    setResourceErrors({});
  };

  const handleRemoveResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleResourceKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResource();
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <File size={16} className="text-red-500" />;
      case 'video':
        return <Film size={16} className="text-purple-500" />;
      case 'audio':
        return <Headphones size={16} className="text-green-500" />;
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      case 'file':
        return <FileText size={16} className="text-orange-500" />;
      case 'folder':
        return <FileText size={16} className="text-yellow-500" />;
      default:
        return <Link size={16} className="text-gray-500" />;
    }
  };

  const getResourceTypeLabel = (type) => {
    const labels = {
      pdf: 'PDF',
      video: 'فيديو',
      audio: 'صوت',
      image: 'صورة',
      file: 'ملف',
      folder: 'مجلد',
      link: 'رابط'
    };
    return labels[type] || type;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان الدرس مطلوب";
    }

    if (!formData.description.trim()) {
      newErrors.description = "وصف الدرس مطلوب";
    }

    if (!formData.group) {
      newErrors.group = "يجب اختيار مجموعة";
    }

    if (!formData.date) {
      newErrors.date = "تاريخ الدرس مطلوب";
    }

    if (!formData.time) {
      newErrors.time = "وقت الدرس مطلوب";
    }

    // Check if date and time are in the future
    const lessonDateTime = new Date(`${formData.date}T${formData.time}`);
    if (lessonDateTime <= new Date()) {
      newErrors.date = "يجب أن يكون تاريخ ووقت الدرس في المستقبل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Combine date and time
      const lessonDateTime = new Date(`${formData.date}T${formData.time}`);

      const submitData = {
        title: formData.title,
        description: formData.description,
        group: formData.group,
        date: lessonDateTime.toISOString(),
        resources: formData.resources,
        zoomLink: formData.zoomLink,
        zoomPassword: formData.zoomPassword,
      };

      // Add exam to form data if selected
      if (formData.exam) {
        submitData.exam = formData.exam;
      }

      if (lessonData) {
        await updateLesson(lessonData._id, submitData);
      } else {
        await createLesson(submitData);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };

  const getSelectedGroup = () => {
    return groups.find((group) => group._id === formData.group);
  };

  const handleSaveExam = (examData) => {
    if (editingExam) {
      // In a real app, you would update the exam via API
      // For now, we'll refetch exams to get the updated list
      fetchLessonExams(lessonData._id);
    } else {
      createExam({ ...examData, lesson: lessonData._id, examType: "lesson" });
    }
    setIsExamFormOpen(false);
    setEditingExam(null);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الامتحان؟")) {
      try {
        await deleteExam(examId);
        // If the deleted exam was selected, clear the selection
        if (formData.exam === examId) {
          setFormData((prev) => ({ ...prev, exam: "" }));
        }
      } catch (error) {
        console.error("Failed to delete exam:", error);
      }
    }
  };

  if (isExamFormOpen) {
    return (
      <ExamForm
        examData={editingExam}
        onSave={handleSaveExam}
        onCancel={() => {
          setIsExamFormOpen(false);
          setEditingExam(null);
        }}
        isEditing={!!editingExam}
        examStatus="lesson"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 md:p-6 bg-base-100 rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {lessonData ? "تعديل الدرس" : "إنشاء درس جديد"}
            </h1>
            <p className="text-gray-600">أدخل تفاصيل الدرس التعليمي</p>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">عنوان الدرس *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: درس التجويد الأساسي"
              className={`input input-bordered ${
                errors.title ? "input-error" : ""
              }`}
            />
            {errors.title && (
              <span className="text-error text-sm mt-1">{errors.title}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">المجموعة *</span>
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={`select select-bordered ${
                errors.group ? "select-error" : ""
              }`}
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
          </div>
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">وصف الدرس *</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="وصف مفصل عن محتوى الدرس وأهدافه"
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

        {/* Exams Section */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-purple-800 flex items-center">
              <FileText className="h-5 w-5 ml-2" />
              الامتحانات المرتبطة
            </h3>
            <button
              type="button"
              onClick={() => setIsExamFormOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} className="ml-1" />
              إنشاء امتحان جديد
            </button>
          </div>

          {/* Available Exams List */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">اختر امتحان مرتبط (اختياري)</span>
            </label>
            <select
              name="exam"
              value={formData.exam} 
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">لا يوجد امتحان</option>
              {lessonExams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.title} - {exam.examType}
                </option>
              ))}
            </select>
          </div>

          {/* Exams List */}
          {lessonExams.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h4 className="font-medium text-purple-700">
                الامتحانات المتاحة:
              </h4>
              {lessonExams.map((exam) => (
                <div
                  key={exam._id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-purple-500" />
                      <span className="font-medium">{exam.title}</span>
                      <span className="badge badge-outline badge-sm">
                        {exam.examType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {exam.questions?.length || 0} أسئلة | النجاح:{" "}
                      {exam.passingScore}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExam(exam);
                        setIsExamFormOpen(true);
                      }}
                      className="btn btn-outline btn-xs"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExam(exam._id)}
                      className="btn btn-error btn-xs"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <FileText size={32} className="mx-auto mb-2 text-gray-400" />
              <p>لا توجد امتحانات متاحة</p>
              <p className="text-sm">
                انقر على "إنشاء امتحان جديد" لإضافة امتحان
              </p>
            </div>
          )}
        </div>

        {/* Date and Time */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 ml-2" />
            الجدول الزمني
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">تاريخ الدرس *</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`input input-bordered ${
                  errors.date ? "input-error" : ""
                }`}
              />
              {errors.date && (
                <span className="text-error text-sm mt-1">{errors.date}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">وقت الدرس *</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`input input-bordered ${
                  errors.time ? "input-error" : ""
                }`}
              />
              {errors.time && (
                <span className="text-error text-sm mt-1">{errors.time}</span>
              )}
            </div>
          </div>

          {/* Selected Group Information */}
          {formData.group && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                معلومات المجموعة المختارة
              </h4>
              {getSelectedGroup() && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">عدد الطلاب:</span>
                    <span className="font-medium mr-2">
                      {" "}
                      {getSelectedGroup().students?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">المستوى:</span>
                    <span className="font-medium mr-2">
                      {" "}
                      {getSelectedGroup().level}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Educational Resources */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Link className="h-5 w-5 ml-2" />
            الموارد التعليمية - Google Drive (اختياري)
          </h3>

          {/* Add New Resource Form */}
          <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
            <h4 className="font-medium text-green-800 mb-3">إضافة مورد جديد</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">رابط Google Drive *</span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={newResource.url}
                  onChange={handleResourceChange}
                  placeholder="https://drive.google.com/..."
                  className={`input input-bordered ${
                    resourceErrors.url ? "input-error" : ""
                  }`}
                />
                {resourceErrors.url && (
                  <span className="text-error text-sm mt-1">{resourceErrors.url}</span>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  يجب أن يكون الرابط من Google Drive (ملف أو مجلد)
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">عنوان المورد *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newResource.title}
                  onChange={handleResourceChange}
                  placeholder="عنوان المورد"
                  className={`input input-bordered ${
                    resourceErrors.title ? "input-error" : ""
                  }`}
                />
                {resourceErrors.title && (
                  <span className="text-error text-sm mt-1">{resourceErrors.title}</span>
                )}
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">وصف المورد (اختياري)</span>
              </label>
              <textarea
                name="description"
                value={newResource.description}
                onChange={handleResourceChange}
                placeholder="وصف مختصر للمورد"
                className="textarea textarea-bordered h-20"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {newResource.url && (
                  <span className="badge badge-outline">
                    {getResourceTypeLabel(detectResourceType(newResource.url))}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddResource}
                className="btn btn-success btn-sm gap-2"
              >
                <Plus size={16} />
                إضافة المورد
              </button>
            </div>
          </div>

          {/* Resources List */}
{formData.resources.length > 0 ? (
  <div className="space-y-3 max-h-60 overflow-y-auto">
    <h4 className="font-medium text-green-700">الموارد المضافة:</h4>
    {formData.resources.map((resource, index) => (
      <div
        key={resource._id || index}
        className="flex items-start justify-between p-3 bg-white rounded-lg border border-green-100"
      >
        <div className="flex items-start gap-3 flex-1">
          {/* Resource Icon/Preview */}
          <div className="flex-shrink-0">
            {resource.previewUrl ? (
              <img
                src={resource.previewUrl}
                alt={resource.title || 'Resource'}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                {getResourceIcon(resource.type)}
              </div>
            )}
          </div>

          {/* Resource Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-medium text-gray-900 truncate">
                {resource.title || 'Untitled Resource'}
              </h5>
              <span className={`badge badge-sm ${
                resource.type === 'pdf' ? 'badge-error' :
                resource.type === 'video' ? 'badge-primary' :
                resource.type === 'audio' ? 'badge-success' :
                resource.type === 'image' ? 'badge-info' :
                resource.type === 'file' ? 'badge-warning' :
                'badge-outline'
              }`}>
                {getResourceTypeLabel(resource.type)}
              </span>
            </div>
            
            {resource.description && (
              <p className="text-sm text-gray-600 mb-2">
                {resource.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link size={12} />
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate flex items-center gap-1"
                title={resource.url}
              >
                {resource.url}
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => handleRemoveResource(index)}
          className="btn btn-error btn-xs ml-2 flex-shrink-0"
        >
          <Trash2 size={12} />
        </button>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-6 bg-white rounded-lg border border-dashed border-green-200">
    <Link size={32} className="mx-auto text-gray-400 mb-2" />
    <p className="text-gray-500">لم يتم إضافة أي موارد بعد</p>
    <p className="text-sm text-gray-400 mt-1">
      قم بإضافة روابط Google Drive للموارد التعليمية
    </p>
  </div>
)}
        </div>

        {/* Zoom Settings */}
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

        {/* Information Preview */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">
            معاينة المعلومات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>العنوان:</strong> {formData.title || "---"}
            </div>
            <div>
              <strong>المجموعة:</strong> {getSelectedGroup()?.title || "---"}
            </div>
            <div>
              <strong>التاريخ:</strong>{" "}
              {formData.date
                ? new Date(formData.date).toLocaleDateString("ar-SA")
                : "---"}
            </div>
            <div>
              <strong>الوقت:</strong> {formData.time || "---"}
            </div>
            <div>
              <strong>الامتحان:</strong>{" "}
              {formData.exam
                ? lessonExams.find((e) => e._id === formData.exam)?.title
                : "---"}
            </div>
            <div>
              <strong>الموارد:</strong> {formData.resources.length} مورد
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button type="button" onClick={onClose} className="btn btn-outline">
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
              : lessonData
              ? "تحديث الدرس"
              : "إنشاء الدرس"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LessonForm;