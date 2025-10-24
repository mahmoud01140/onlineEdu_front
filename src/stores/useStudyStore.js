import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useStudyStore = create((set, get) => ({
  // الحالة
  lessons: [],
  currentLesson: null,
  upcomingLessons: [],
  todayLessons: [],
  isLoading: false,
  error: null,
  // الحصول على جميع الدروس
  fetchUserLessons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/study/lessons`);
      set({
        lessons: response.data.data.lessons,
        isLoading: false,
      });
      console.log(response.data.data.lessons);
      return response.data.data.lessons;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الدروس";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على درس بواسطة ID
  //   fetchLessonById: async (id) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.get(`/lessons/${id}`);
  //       set({ currentLesson: response.data.data.lesson, isLoading: false });
  //       return response.data.data.lesson;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحميل الدرس";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // الحصول على دروس مجموعة محددة
  //   fetchGroupLessons: async (groupId, filters = {}) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const page = filters.page || 1;
  //       const limit = filters.limit || 10;

  //       const response = await axiosInstance.get(`/lessons/group/${groupId}?page=${page}&limit=${limit}`);

  //       set({
  //         lessons: response.data.data.lessons,
  //         isLoading: false,
  //         pagination: {
  //           total: response.data.total,
  //           pages: response.data.pages,
  //           currentPage: response.data.page
  //         }
  //       });

  //       return response.data.data.lessons;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحميل دروس المجموعة";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // الحصول على الدروس القادمة
  //   fetchUpcomingLessons: async () => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.get("/lessons/upcoming");
  //       set({
  //         upcomingLessons: response.data.data.lessons,
  //         isLoading: false
  //       });
  //       return response.data.data.lessons;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحميل الدروس القادمة";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // الحصول على دروس اليوم
  //   fetchTodayLessons: async () => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.get("/lessons/today");
  //       set({
  //         todayLessons: response.data.data.lessons,
  //         isLoading: false
  //       });
  //       return response.data.data.lessons;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحميل دروس اليوم";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // الحصول على الدروس السابقة
  //   fetchPastLessons: async (filters = {}) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const page = filters.page || 1;
  //       const limit = filters.limit || 10;

  //       const response = await axiosInstance.get(`/lessons/past?page=${page}&limit=${limit}`);

  //       set({
  //         lessons: response.data.data.lessons,
  //         isLoading: false,
  //         pagination: {
  //           total: response.data.total,
  //           pages: response.data.pages,
  //           currentPage: response.data.page
  //         }
  //       });

  //       return response.data.data.lessons;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحميل الدروس السابقة";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // إنشاء درس جديد
  //   createLesson: async (lessonData) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.post("/lessons", lessonData,{ headers:{"Content-Type": "multipart/form-data"}});
  //       set({ isLoading: false });

  //       // إضافة الدرس الجديد إلى القائمة
  //       const currentLessons = get().lessons;
  //       set({ lessons: [response.data.data.lesson, ...currentLessons] });

  //       // تحديث الدروس القادمة إذا كان الدرس في المستقبل
  //       const newLessonDate = new Date(response.data.data.lesson.date);
  //       const now = new Date();
  //       if (newLessonDate >= now) {
  //         const currentUpcoming = get().upcomingLessons;
  //         set({ upcomingLessons: [response.data.data.lesson, ...currentUpcoming] });
  //       }

  //       toast.success("تم إنشاء الدرس بنجاح");
  //       return response.data.data.lesson;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في إنشاء الدرس";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // تحديث درس
  //   updateLesson: async (id, lessonData) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.patch(`/lessons/${id}`, lessonData);
  //       set({ isLoading: false });

  //       // تحديث الدرس في القائمة
  //       const currentLessons = get().lessons;
  //       const updatedLessons = currentLessons.map(lesson =>
  //         lesson._id === id ? response.data.data.lesson : lesson
  //       );

  //       // تحديث الدروس القادمة
  //       const currentUpcoming = get().upcomingLessons;
  //       const updatedUpcoming = currentUpcoming.map(lesson =>
  //         lesson._id === id ? response.data.data.lesson : lesson
  //       );

  //       set({
  //         lessons: updatedLessons,
  //         upcomingLessons: updatedUpcoming,
  //         currentLesson: response.data.data.lesson
  //       });

  //       toast.success("تم تحديث الدرس بنجاح");
  //       return response.data.data.lesson;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحديث الدرس";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // حذف درس
  //   deleteLesson: async (id) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       await axiosInstance.delete(`/lessons/${id}`);
  //       set({ isLoading: false });

  //       // إزالة الدرس من القوائم
  //       const currentLessons = get().lessons;
  //       const filteredLessons = currentLessons.filter(lesson => lesson._id !== id);

  //       const currentUpcoming = get().upcomingLessons;
  //       const filteredUpcoming = currentUpcoming.filter(lesson => lesson._id !== id);

  //       set({
  //         lessons: filteredLessons,
  //         upcomingLessons: filteredUpcoming,
  //         currentLesson: null
  //       });

  //       toast.success("تم حذف الدرس بنجاح");
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في حذف الدرس";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // إضافة مورد إلى درس
  //   addResource: async (lessonId, resourceUrl) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.post(`/lessons/${lessonId}/resources`, {
  //         resourceUrl
  //       });
  //       set({ isLoading: false });

  //       // تحديث الدرس في القوائم
  //       const currentLessons = get().lessons;
  //       const updatedLessons = currentLessons.map(lesson =>
  //         lesson._id === lessonId ? response.data.data.lesson : lesson
  //       );

  //       const currentUpcoming = get().upcomingLessons;
  //       const updatedUpcoming = currentUpcoming.map(lesson =>
  //         lesson._id === lessonId ? response.data.data.lesson : lesson
  //       );

  //       set({
  //         lessons: updatedLessons,
  //         upcomingLessons: updatedUpcoming,
  //         currentLesson: response.data.data.lesson
  //       });

  //       toast.success("تم إضافة المورد بنجاح");
  //       return response.data.data.lesson;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في إضافة المورد";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // إزالة مورد من درس
  //   removeResource: async (lessonId, resourceUrl) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.delete(`/lessons/${lessonId}/resources`, {
  //         data: { resourceUrl }
  //       });
  //       set({ isLoading: false });

  //       // تحديث الدرس في القوائم
  //       const currentLessons = get().lessons;
  //       const updatedLessons = currentLessons.map(lesson =>
  //         lesson._id === lessonId ? response.data.data.lesson : lesson
  //       );

  //       const currentUpcoming = get().upcomingLessons;
  //       const updatedUpcoming = currentUpcoming.map(lesson =>
  //         lesson._id === lessonId ? response.data.data.lesson : lesson
  //       );

  //       set({
  //         lessons: updatedLessons,
  //         upcomingLessons: updatedUpcoming,
  //         currentLesson: response.data.data.lesson
  //       });

  //       toast.success("تم إزالة المورد بنجاح");
  //       return response.data.data.lesson;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في إزالة المورد";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // نسخ درس
  //   duplicateLesson: async (lessonId) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.post(`/lessons/${lessonId}/duplicate`);
  //       set({ isLoading: false });

  //       // إضافة الدرس المنسوخ إلى القائمة
  //       const currentLessons = get().lessons;
  //       set({ lessons: [response.data.data.lesson, ...currentLessons] });

  //       toast.success("تم نسخ الدرس بنجاح");
  //       return response.data.data.lesson;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في نسخ الدرس";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // البحث في الدروس
  //   searchLessons: async (query) => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.get(`/lessons/search?query=${query}`);
  //       set({
  //         lessons: response.data.data.lessons,
  //         isLoading: false,
  //         filters: { ...get().filters, search: query }
  //       });

  //       return response.data.data.lessons;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في البحث";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // الحصول على إحصائيات الدروس
  //   fetchLessonStats: async () => {
  //     set({ isLoading: true, error: null });

  //     try {
  //       const response = await axiosInstance.get("/lessons/stats");
  //       set({ isLoading: false });
  //       return response.data.data;
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message || "فشل في تحميل الإحصائيات";
  //       set({ error: errorMessage, isLoading: false });
  //       toast.error(errorMessage);
  //       throw error;
  //     }
  //   },

  //   // تطبيق الفلاتر
  //   applyFilters: (newFilters) => {
  //     const currentFilters = get().filters;
  //     const mergedFilters = { ...currentFilters, ...newFilters, page: 1 };

  //     set({ filters: mergedFilters });
  //     get().fetchLessons(mergedFilters);
  //   },

  //   // تغيير الصفحة
  //   changePage: (page) => {
  //     const currentFilters = get().filters;
  //     const newFilters = { ...currentFilters, page };

  //     set({ filters: newFilters });
  //     get().fetchLessons(newFilters);
  //   },

  //   // مسح البحث
  //   clearSearch: () => {
  //     const currentFilters = get().filters;
  //     const newFilters = { ...currentFilters, search: "", page: 1 };

  //     set({ filters: newFilters });
  //     get().fetchLessons(newFilters);
  //   },

  //   // مسح الأخطاء
  //   clearError: () => set({ error: null }),

  //   // إعادة تعيين الحالة
  //   reset: () => set({
  //     lessons: [],
  //     currentLesson: null,
  //     upcomingLessons: [],
  //     todayLessons: [],
  //     isLoading: false,
  //     error: null,
  //     filters: {
  //       group: "",
  //       search: "",
  //       dateFrom: "",
  //       dateTo: "",
  //       page: 1,
  //       limit: 10,
  //       sort: "-date"
  //     },
  //     pagination: {
  //       total: 0,
  //       pages: 0,
  //       currentPage: 1
  //     }
  //   })
}));

export default useStudyStore;
