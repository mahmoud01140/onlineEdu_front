import React, { useEffect, useState } from "react";
import { X, ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const ExamForm = ({
  examData = null,
  onSave,
  onCancel,
  isEditing = false,
  examStatus,
}) => {
  const initialFormData = {
    title: "",
    examType: "",
    passingScore: 2,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  };

  const [formData, setFormData] = useState(examData || initialFormData);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
    setActiveQuestion(formData.questions.length);
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        questions: newQuestions,
      }));
      setActiveQuestion(Math.max(0, index - 1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg"
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button onClick={onCancel} className="btn btn-ghost btn-circle">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "تعديل الامتحان" : "إنشاء امتحان جديد"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button onClick={onCancel} className="btn btn-outline">
            <X size={20} className="ml-2" />
            إلغاء
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            <Save size={20} className="ml-2" />
            حفظ
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* المعلومات الأساسية */}
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
              className="input input-bordered"
              required
            />
          </div>

          {examStatus !== "lesson" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">نوع الامتحان *</span>
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="student">امتحان الطالب</option>
                <option value="teacher">امتحان المعلم</option>
                <option value="elder">امتحان الكبار</option>
              </select>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">درجة النجاح *</span>
            </label>
            <input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleChange}
              min="1"
              max={formData.questions.length}
              className="input input-bordered"
              required
            />
          </div>
        </div>

        {/* الأسئلة */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">أسئلة الامتحان</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} className="ml-1" />
              إضافة سؤال
            </button>
          </div>

          {/* تنقل بين الأسئلة */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {formData.questions.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveQuestion(index)}
                className={`btn btn-sm ${
                  activeQuestion === index ? "btn-primary" : "btn-ghost"
                }`}
              >
                سؤال {index + 1}
              </button>
            ))}
          </div>

          {/* محتوى السؤال النشط */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">سؤال {activeQuestion + 1}</h3>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(activeQuestion)}
                    className="btn btn-error btn-sm"
                  >
                    <Trash2 size={16} className="ml-1" />
                    حذف
                  </button>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">نص السؤال *</span>
                </label>
                <input
                  type="text"
                  value={formData.questions[activeQuestion].question}
                  onChange={(e) =>
                    handleQuestionChange(
                      activeQuestion,
                      "question",
                      e.target.value
                    )
                  }
                  placeholder="أدخل نص السؤال"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="label">
                  <span className="label-text">خيارات الإجابة *</span>
                </label>
                {formData.questions[activeQuestion].options.map(
                  (option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="radio"
                        name={`question-${activeQuestion}`}
                        checked={
                          formData.questions[activeQuestion].correctAnswer ===
                          optionIndex
                        }
                        onChange={() =>
                          handleQuestionChange(
                            activeQuestion,
                            "correctAnswer",
                            optionIndex
                          )
                        }
                        className="radio radio-primary"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            activeQuestion,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`الخيار ${optionIndex + 1}`}
                        className="input input-bordered flex-1"
                        required
                      />
                    </div>
                  )
                )}
              </div>

              <div className="text-sm text-info">
                <p>
                  ✓ الخيار{" "}
                  {formData.questions[activeQuestion].correctAnswer + 1} هو
                  الإجابة الصحيحة
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* أزرار الحفظ */}
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            <X size={20} className="ml-2" />
            إلغاء
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={20} className="ml-2" />
            {isEditing ? "تحديث الامتحان" : "إنشاء الامتحان"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
export default ExamForm;
