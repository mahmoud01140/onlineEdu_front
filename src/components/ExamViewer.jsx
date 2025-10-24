// LevelExam.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ArrowRight,
  Award,
  CheckCircle,
  XCircle,
  BookOpen,
  X,
  Home,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
import useExamStore from "../stores/useExamStore";
import { useNavigate } from "react-router-dom";
import useLiveExamStore from "../stores/useLiveExamStore";
const LevelExam = ({ examData }) => {
  const { studentStatus } = useAuthStore();
  const { fetchExamByType, submitExam, isLoading, error } = useExamStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  // const [examData, setExamData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchUpcomingLiveExams, liveExams, addUserToLiveExam } = useLiveExamStore();
  const navigate = useNavigate();
  // Load exam data when studentStatus changes
  useEffect(() => {
    let mounted = true;
    const loadExam = async () => {
      try {
        // const exam = await fetchExamByType(studentStatus);

        if (!mounted) return;
        // setExamData(exam);
        // initialize selectedAnswers array with same length as questions
        if (examData && examData.questions) {
          setSelectedAnswers(Array(examData.questions.length).fill(undefined));
        }
        // optionally reset timer based on exam settings
        setTimeRemaining((prev) =>
          examData && examData.durationSeconds
            ? examData.durationSeconds
            : 15 * 60
        );
        setCurrentQuestion(0);
        setExamCompleted(false);
        setScore(0);
      } catch (err) {
        console.error("Failed to load exam:", err);
      }
    };

    loadExam();
    return () => {
      mounted = false;
    };
  }, [studentStatus, fetchExamByType]);

  // Exam timer
  useEffect(() => {
    if (examCompleted || !examData) return;

    if (timeRemaining <= 0) {
      // ensure not called repeatedly
      if (!examCompleted) handleExamCompletion();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, examCompleted, examData]); // keep deps explicit

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // User selects an option (index)
  const handleAnswer = (optionIndex) => {
    if (examCompleted || isSubmitting) return;
    setSelectedAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = optionIndex;
      return copy;
    });

    // auto-advance after a short delay — use functional update to avoid stale currentQuestion
    setTimeout(() => {
      setCurrentQuestion((prev) => {
        if (!examData) return prev;
        if (prev < examData.questions.length - 1) return prev + 1;
        // otherwise finish
        // handleExamCompletion();
        return prev;
      });
    }, 500);
  };

  // Complete exam: calculate score and submit once
  const handleExamCompletion = async () => {
    if (!examData || isSubmitting || examCompleted) return;
    setIsSubmitting(true);

    // calculate score
    let calculatedScore = 0;
    examData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setExamCompleted(true);

    // submit to server (guarded)
    try {
      await submitExam(examData._id, selectedAnswers);
      fetchUpcomingLiveExams();
    } catch (err) {
      console.error("Failed to submit exam:", err);
      // optionally display a toast / allow retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    if (!examData) return;
    setCurrentQuestion((prev) =>
      Math.min(examData.questions.length - 1, prev + 1)
    );
  };

  const handleQuestionNavigation = (index) => {
    if (!examData) return;
    setCurrentQuestion(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mr-3">جاري تحميل الامتحان...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            المحاولة مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>لا يوجد امتحان متاح حاليًا</p>
      </div>
    );
  }

  const answeredCount = selectedAnswers.filter((a) => a !== undefined).length;
  const progressPercent =
    ((currentQuestion + 1) / examData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
          >
            اختبار تحديد المستوى
          </motion.h1>

          {!examCompleted ? (
            <motion.div
              key="exam"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 ml-2" />
                  <span className="text-gray-700">
                    الوقت المتبقي: {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-700">
                    السؤال {currentQuestion + 1} من {examData.questions.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    // resetExam likely comes from parent to close the test modal/page
                    resetExam?.();
                  }}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center self-start md:self-auto"
                >
                  <X className="h-4 w-4 ml-1" />
                  إلغاء الاختبار
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Mobile question navigator */}
              <div className="flex overflow-x-auto gap-2 mb-6 md:hidden">
                {examData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                      currentQuestion === index
                        ? "bg-primary text-white"
                        : selectedAnswers[index] !== undefined
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    aria-label={`انتقل للسؤال ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Current question */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-right">
                  {examData.questions[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                  {examData.questions[currentQuestion].options.map(
                    (option, idx) => {
                      const isSelected =
                        selectedAnswers[currentQuestion] === idx;
                      const isCorrect =
                        examData.questions[currentQuestion].correctAnswer ===
                        idx;
                      const showCorrect =
                        selectedAnswers[currentQuestion] !== undefined &&
                        isCorrect;

                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ x: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(idx)}
                          disabled={
                            selectedAnswers[currentQuestion] !== undefined ||
                            isSubmitting
                          }
                          className={`w-full text-right py-4 px-4 border rounded-lg transition-colors duration-200 flex items-center justify-between
                          ${
                            isSelected
                              ? isCorrect
                                ? "bg-green-100 border-green-500 text-green-800"
                                : "bg-red-100 border-red-500 text-red-800"
                              : "border-gray-200 hover:bg-gray-50"
                          }
                          ${
                            showCorrect
                              ? "bg-green-100 border-green-500 text-green-800"
                              : ""
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span className="flex-1 text-right">{option}</span>
                          <div
                            className={`h-6 w-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                          ${
                            isSelected
                              ? isCorrect
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-red-500 border-red-500 text-white"
                              : "border-gray-300"
                          }`}
                          >
                            {isSelected && (
                              <span className="text-xs font-bold">
                                {isCorrect ? "✓" : "✗"}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="btn btn-outline"
                >
                  السابق
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestion === examData.questions.length - 1 ||
                    selectedAnswers[currentQuestion] === undefined
                  }
                  className="btn btn-outline"
                >
                  التالي
                </button>
              </div>

              {/* Finish button if all answered */}
              {answeredCount === examData.questions.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleExamCompletion}
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إنهاء الاختبار"}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {score >= examData.passingScore ? (
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                )}
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {score >= examData.passingScore
                  ? "مبروك! لقد نجحت في الاختبار"
                  : "تحتاج إلى مزيد من الدراسة"}
              </h2>

              <p className="text-lg text-gray-700 mb-4">
                درجتك: {score} من {examData.questions.length}
              </p>

              <p className="text-gray-600 mb-6">
                {score >= examData.passingScore
                  ? "مستواك مناسب للمرحلة التالية"
                  : `تحتاج إلى ${
                      examData.passingScore - score
                    } نقطة إضافية للنجاح`}
              </p>

                {(examData.examType === "student" || examData.examType === "teacher" || examData.examType === "elder" ) && (              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
              >
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-blue-800 mb-2">
                  لاستكمال عملية تحديد المستوى يرجى حضور الامتحان الشفهى على زوم
                </p>
                {liveExams.map((exam) => (
                  <div
                    key={exam._id}
                    className=" bg-green-100 mb-4 p-4 rounded-xl"
                  >
                    <p className="text-blue-800 font-medium">
                      معاد المحاضرة:{"  "}
                      {new Date(exam.examDate).toLocaleDateString("ar-SA")}
                      الساعة {exam.examTime}
                    </p>
                    {exam.zoomLink && (
                      <p className="text-blue-800 font-medium flex flex-col items-center">
                        رابط الامتحان على زوم:{" "}
                        <a
                          href={exam?.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium"
                          onClick={() => addUserToLiveExam(exam._id)}
                        >
                          {exam?.zoomLink}
                        </a>
                        <span className="text-black-800 font-medium">
                          كلمة السر: {exam?.zoomPassword}
                        </span>
                      </p>
                    )}
                    <span className="text-black-800 font-medium">
                      {liveExams.length > 1 ? "او" : ""}
                    </span>
                  </div>
                ))}
              </motion.div>)}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="btn btn-outline gap-2"
                >
                  <Home size={20} />
                  الصفحة الرئيسية
                </motion.button>

                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="btn btn-primary gap-2"
                >
                  سجل الآن في الأكاديمية
                  <ArrowRight size={20} />
                </motion.button> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LevelExam;
