import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Calendar,
  Users,
  Clock,
  Download,
  User
} from "lucide-react";
import useLessonStore from "../../stores/useLessonStore";
import useGroupStore from "../../stores/useGroupStore";
import LessonForm from "./LessonForm";

const LessonsManagement = () => {
  const {
    lessons,
    upcomingLessons,
    isLoading,
    error,
    filters,
    pagination,
    fetchLessons,
    fetchUpcomingLessons,
    deleteLesson,
    duplicateLesson,
    applyFilters,
    clearSearch,
  } = useLessonStore();

  const { groups, fetchGroups } = useGroupStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchLessons();
    fetchUpcomingLessons();
    fetchGroups();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من أنك تريد حذف هذا الدرس؟")) {
      try {
        await deleteLesson(id);
      } catch (error) {
        console.error("Failed to delete lesson:", error);
      }
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateLesson(id);
    } catch (error) {
      console.error("Failed to duplicate lesson:", error);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isFormOpen) {
    return (
      <LessonForm
        lessonData={editingLesson}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLesson(null);
        }}
        onSave={() => {
          setIsFormOpen(false);
          setEditingLesson(null);
          fetchLessons();
          fetchUpcomingLessons();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* العنوان وأزرار التحكم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            إدارة الدروس
          </h1>
          <p className="text-gray-600 mt-1">إدارة الدروس والمواد التعليمية</p>
        </div>

        <button className="btn btn-primary gap-2" onClick={handleCreate}>
          <Plus size={20} />
          درس جديد
        </button>
      </div>

      {/* التبويبات */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          جميع الدروس
        </button>
        <button
          className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          الدروس القادمة
        </button>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* شريط البحث */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن درس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-4 pr-10"
            />
          </form>

          {/* أزرار التصفية */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.group}
              onChange={(e) => applyFilters({ group: e.target.value })}
              className="select select-bordered select-sm"
            >
              <option value="">جميع المجموعات</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.title}
                </option>
              ))}
            </select>

            {filters.search && (
              <button onClick={clearSearch} className="btn btn-ghost btn-sm">
                مسح البحث
              </button>
            )}
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <BookOpen size={32} />
            </div>
            <div className="stat-title">إجمالي الدروس</div>
            <div className="stat-value text-primary">{pagination.total}</div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Calendar size={32} />
            </div>
            <div className="stat-title">دروس قادمة</div>
            <div className="stat-value text-secondary">
              {upcomingLessons.length}
            </div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <Users size={32} />
            </div>
            <div className="stat-title">مجموعات نشطة</div>
            <div className="stat-value text-accent">
              {new Set(lessons.map((l) => l.group?._id)).size}
            </div>
          </div>
        </div>
      </div>

      {/* عرض الدروس */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : (
        <>
          {activeTab === "upcoming" ? (
            /* الدروس القادمة */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingLessons.map((lesson) => (
                <LessonCard
                  key={lesson._id}
                  lesson={lesson}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            /* جميع الدروس */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <LessonCard
                    key={lesson._id}
                    lesson={lesson}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              {/* التقسيم إلى صفحات */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="join">
                    <button
                      className="join-item btn"
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        applyFilters({ page: pagination.currentPage - 1 })
                      }
                    >
                      السابق
                    </button>

                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`join-item btn ${
                          pagination.currentPage === page ? "btn-active" : ""
                        }`}
                        onClick={() => applyFilters({ page })}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="join-item btn"
                      disabled={pagination.currentPage === pagination.pages}
                      onClick={() =>
                        applyFilters({ page: pagination.currentPage + 1 })
                      }
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

// بطاقة الدرس
const LessonCard = ({ lesson, onEdit, onDelete, onDuplicate, formatDate }) => {
  const isUpcoming = new Date(lesson.date) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="p-5">
        {/* العنوان والمجموعة */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
          {isUpcoming && (
            <span className="badge badge-primary badge-sm">قادم</span>
          )}
        </div>

        {/* معلومات المجموعة */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Users size={16} className="ml-1" />
          <span>{lesson.group?.title}</span>
        </div>

        {/* التاريخ والوقت */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar size={16} className="ml-1" />
          <span>{formatDate(lesson.date)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <User size={16} className="ml-1" />
          <span>
            {lesson?.group?.insturctor?.name}
          </span>
        </div>

        {/* الوصف */}
        <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

        {/* الموارد */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Download size={16} className="ml-1" />
              <span>الموارد ({lesson.resources.length})</span>
            </div>
            <div className="space-y-1">
              {lesson.resources.slice(0, 3).map((resource, index) => (
                <a
                  key={index}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-600 hover:underline truncate"
                >
                  {resource.title || "Resource"}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(lesson)}
            className="btn btn-warning btn-sm flex-1 gap-1"
          >
            <Edit3 size={16} />
            تعديل
          </button>

          <button
            onClick={() => onDuplicate(lesson._id)}
            className="btn btn-info btn-sm gap-1"
          >
            <Copy size={16} />
          </button>

          <button
            onClick={() => onDelete(lesson._id)}
            className="btn btn-error btn-sm gap-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonsManagement;
