import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Plus,
  Trash2,
  Search,
  List,
  Grid,
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useExamStore from "../../stores/useExamStore";
import ExamForm from "./ExamForm";
const ExamsManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedExam, setExpandedExam] = useState(null);
  const { createExam, fetchExams, exams, deleteExam, updateExam } = useExamStore();
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);
  // بيانات وهمية للامتحانات
  // const [exams, setExams] = useState([
  //   {
  //     _id: "1",
  //     title: "امتحان تحديد مستوى الطالب",
  //     examType: "student",
  //     passingScore: 2,
  //     questions: [
  //       {
  //         question: "ما هي السورة التي تسمى قلب القرآن؟",
  //         options: ["يس", "الفاتحة", "الإخلاص", "البقرة"],
  //         correctAnswer: 0,
  //       },
  //       {
  //         question: "كم عدد أحزاب القرآن الكريم؟",
  //         options: ["30 حزب", "60 حزب", "120 حزب", "240 حزب"],
  //         correctAnswer: 1,
  //       },
  //     ],
  //   },
  //   {
  //     _id: "2",
  //     title: "امتحان تأهيل المعلمين",
  //     examType: "teacher",
  //     passingScore: 2,
  //     questions: [
  //       {
  //         question: "ما هو حكم الاستعاذة عند beginning التلاوة؟",
  //         options: ["واجبة", "مستحبة", "مباحة", "مكروهة"],
  //         correctAnswer: 1,
  //       },
  //     ],
  //   },
  // ]);

  const handleSaveExam = (examData) => {
    if (editingExam) {
      // تحديث الامتحان الموجود
      updateExam(editingExam._id, examData);
    } else {
      // إضافة امتحان جديد
      createExam(examData);
    }
    setIsFormOpen(false);
    setEditingExam(null);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setIsFormOpen(true);
  };

  const handleDeleteExam = (id) => {
    deleteExam(id);
  };

  const toggleExpandExam = (id) => {
    setExpandedExam(expandedExam === id ? null : id);
  };

  const filteredExams = exams?.filter((exam) => {
    const matchesSearch = exam.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || exam.examType === selectedType;
    return matchesSearch && matchesType;
  });

  if (isFormOpen) {
    return (
      <ExamForm
        examData={editingExam}
        onSave={handleSaveExam}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingExam(null);
        }}
        isEditing={!!editingExam}
        examStatus="level"
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* العنوان وأزرار التحكم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            إدارة الامتحانات
          </h1>
          <p className="text-gray-600 mt-1">أنشئ وأدر امتحانات الأكاديمية</p>
        </div>

        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={20} />
          امتحان جديد
        </button>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* شريط البحث */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن امتحان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-4 pr-10"
            />
          </div>

          {/* أزرار التصفية */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">جميع الأنواع</option>
              <option value="student">امتحان الطالب</option>
              <option value="teacher">امتحان المعلم</option>
              <option value="elder">امتحان الكبار</option>
            </select>

            {/* زر تبديل طريقة العرض */}
            <div className="join">
              <button
                className={`join-item btn btn-sm ${
                  viewMode === "grid" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} />
              </button>
              <button
                className={`join-item btn btn-sm ${
                  viewMode === "list" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* نتائج البحث */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          عرض {filteredExams?.length} من أصل {exams?.length} امتحان
        </p>

        {(searchTerm || selectedType !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
            }}
            className="btn btn-ghost btn-sm"
          >
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* عرض الامتحانات */}
      {filteredExams?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <ClipboardCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            لا توجد امتحانات
          </h3>
          <p className="text-gray-500 mt-1">
            لم يتم العثور على امتحانات تطابق معايير البحث
          </p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => setIsFormOpen(true)}
          >
            إنشاء امتحان جديد
          </button>
        </div>
      ) : viewMode === "grid" ? (
        // عرض الشبكة
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams?.map((exam) => (
            <ExamCard
              key={exam._id}
              exam={exam}
              onEdit={handleEditExam}
              onDelete={handleDeleteExam}
              isExpanded={expandedExam === exam._id}
              onToggleExpand={toggleExpandExam}
            />
          ))}
        </div>
      ) : (
        // عرض القائمة
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>الامتحان</th>
                <th>النوع</th>
                <th>عدد الأسئلة</th>
                <th>درجة النجاح</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams?.map((exam) => (
                <ExamRow
                  key={exam._id}
                  exam={exam}
                  onEdit={handleEditExam}
                  onDelete={handleDeleteExam}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
const ExamCard = ({ exam, onEdit, onDelete, isExpanded, onToggleExpand }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="p-5">
        {/* العنوان والنوع */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
          <span
            className={`badge ${
              exam.examType === "student"
                ? "badge-primary"
                : exam.examType === "teacher"
                ? "badge-secondary"
                : exam.examType === "lesson"
                ? "badge-accent"
                : "badge-warning"
            } badge-sm`}
          >
            {exam.examType === "student"
              ? "طالب"
              : exam.examType === "teacher"
              ? "معلم"
              : exam.examType === "lesson"
              ? `عن ${exam.lesson?.title}`
              : exam.examType === "elder"
              ? "كبار"
              : "غير معروف"
            }
          </span>
        </div>

        {/* المعلومات الأساسية */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>عدد الأسئلة:</span>
            <span className="font-medium">{exam.questions.length}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>درجة النجاح:</span>
            <span className="font-medium">{exam.passingScore}</span>
          </div>
        </div>

        {/* زر عرض/إخفاء الأسئلة */}
        <button
          onClick={() => onToggleExpand(exam._id)}
          className="btn btn-ghost btn-sm w-full mb-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} className="ml-1" />
              إخفاء الأسئلة
            </>
          ) : (
            <>
              <ChevronDown size={16} className="ml-1" />
              عرض الأسئلة
            </>
          )}
        </button>

        {/* الأسئلة (موسعة) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 mb-4"
            >
              {exam.questions.map((question, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-1">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`text-xs p-1 rounded ${
                          optIndex === question.correctAnswer
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100"
                        }`}
                      >
                        {optIndex + 1}. {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* أزرار الإجراءات */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(exam)}
            className="btn btn-warning btn-sm flex-1 gap-2"
          >
            <Edit3 size={16} />
            تعديل
          </button>
          <button
            onClick={() => onDelete(exam._id)}
            className="btn btn-error btn-sm flex-1 gap-2"
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// صف الامتحان (للعرض القائم)
const ExamRow = ({ exam, onEdit, onDelete }) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ClipboardCheck size={24} className="text-white" />
            </div>
          </div>
          <div>
            <div className="font-bold">{exam.title}</div>
          </div>
        </div>
      </td>
      <td>
        <span
          className={`badge ${
            exam.examType === "student"
              ? "badge-primary"
              : exam.examType === "teacher"
              ? "badge-secondary"
              : "badge-accent"
          } badge-sm`}
        >
          {exam.examType === "student"
            ? "طالب"
            : exam.examType === "teacher"
            ? "معلم"
            : "كبار"}
        </span>
      </td>
      <td>{exam.questions.length}</td>
      <td>{exam.passingScore}</td>
      <td>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(exam)}
            className="btn btn-warning btn-xs gap-1"
          >
            <Edit3 size={12} />
            تعديل
          </button>
          <button
            onClick={() => onDelete(exam._id)}
            className="btn btn-error btn-xs gap-1"
          >
            <Trash2 size={12} />
            حذف
          </button>
        </div>
      </td>
    </motion.tr>
  );
};
export default ExamsManagement;
