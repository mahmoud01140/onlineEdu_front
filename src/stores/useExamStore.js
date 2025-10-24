import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useExamStore = create((set, get) => ({
  // الحالة
  currentExam: null,
  examResults: null,
  isLoading: false,
  error: null,
  exams: [],
  lessonExams: [],
  examType: "student", // student, teacher, elder

  // الإجراءات (Actions)
  fetchExamByType: async (type = null) => {
    set({ isLoading: true, error: null });
    try {
      const examType = type || get().examType;
      const response = await axiosInstance.get(`/exams/${examType}`);

      set({
        currentExam: response.data.data.exam,
        examType,
        isLoading: false,
      });

      return response.data.data.exam;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  // الحصول على الامتحان حسب النوع
  fetchExams: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`exams`);
      set({
        exams: response.data.data.exams,
        isLoading: false,
      });

      return response.data.data.exam;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  fetchLessonExams: async (lessonId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/exams/lesson/${lessonId}`);
      set({
        lessonExams: response.data.data.exams,
        isLoading: false,
      });

      return response.data.data.exams;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الامتحانات";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  // تقديم الإجابات وتصحيح الامتحان
  submitExam: async (id, answers) => {
    set({ isLoading: true, error: null });

    try {
      // const { currentExam } = get();

      // if (!currentExam) {
      //   throw new Error("لا يوجد امتحان حالياً");
      // }

      const response = await axiosInstance.post(`/exams/${id}/submit`, {
        answers,
      });

      set({
        examResults: response.data.data,
        isLoading: false,
      });

      toast.success("تم تقديم الامتحان بنجاح");
      console.log(response.data.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تقديم الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إنشاء امتحان جديد (للمشرفين فقط)
  createExam: async (examData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("exams", examData);
      set({ isLoading: false });
      get().fetchExams();
      toast.success("تم إنشاء الامتحان بنجاح");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في إنشاء الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  deleteExam: async (examId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.delete(`exams/${examId}`);
      set({ isLoading: false });
      get().fetchExams();
      toast.success("تم حذف الامتحان بنجاح");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في حذف الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  // تحديث الامتحان
  updateExam: async (id, examData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.put(`exams/${id}`, examData);
      set({ isLoading: false });
      get().fetchExams();
      toast.success("تم تحديث الامتحان بنجاح");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحديث الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  // تغيير نوع الامتحان
  setExamType: (type) => {
    set({ examType: type });
  },

  // إعادة تعيين النتائج
  resetResults: () => {
    set({ examResults: null });
  },
  // الحصول على الامتحانات الخاصة بالدرس

  // مسح الأخطاء
  clearError: () => set({ error: null }),

  // إعادة تعيين الحالة
  reset: () =>
    set({
      currentExam: null,
      examResults: null,
      isLoading: false,
      error: null,
      examType: "student",
    }),
}));

export default useExamStore;
