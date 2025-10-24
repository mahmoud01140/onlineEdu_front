import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useCourseStore = create((set, get) => ({
  // الحالة
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  // الحصول على جميع الدورات
  // fetchCourses: async (filters = {}) => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     // دمج الفلاتر الحالية مع الفلاتر الجديدة
  //     const currentFilters = get().filters;
  //     const mergedFilters = { ...currentFilters, ...filters, page: filters.page || 1 };

  //     // بناء query string
  //     const queryParams = new URLSearchParams();
  //     Object.entries(mergedFilters).forEach(([key, value]) => {
  //       if (value) queryParams.append(key, value);
  //     });

  //     const response = await axiosInstance.get(`/courses?${queryParams}`);

  //     set({
  //       courses: response.data.data.courses,
  //       isLoading: false,
  //       filters: mergedFilters,
  //       pagination: {
  //         total: response.data.total,
  //         pages: response.data.pages,
  //         currentPage: response.data.page
  //       }
  //     });

  //     return response.data.data.courses;
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || "فشل في تحميل الدورات";
  //     set({ error: errorMessage, isLoading: false });
  //     toast.error(errorMessage);
  //     throw error;
  //   }
  // },
  getAllCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`courses`);
      console.log(response.data.data.courses);
      set({ courses: response.data.data.courses, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الدورات";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  // الحصول على دورة بواسطة ID
  // fetchCourseById: async (id) => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     const response = await axiosInstance.get(`/courses/${id}`);
  //     set({ currentCourse: response.data.data.course, isLoading: false });
  //     return response.data.data.course;
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "فشل في تحميل الدورة";
  //     set({ error: errorMessage, isLoading: false });
  //     toast.error(errorMessage);
  //     throw error;
  //   }
  // },

  // إنشاء دورة جديدة (للمشرفين فقط)
  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post("courses", courseData);
      console.log(courseData)
      set({ isLoading: false });
      // إضافة الدورة الجديدة إلى القائمة
      get().getAllCourses()

      toast.success("تم إنشاء الدورة بنجاح");
      return response.data.data.course;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في إنشاء الدورة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث دورة (للمشرفين فقط)
  // updateCourse: async (id, courseData) => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     const response = await axiosInstance.patch(`/courses/${id}`, courseData);
  //     set({ isLoading: false });

  //     // تحديث الدورة في القائمة
  //     const currentCourses = get().courses;
  //     const updatedCourses = currentCourses.map((course) =>
  //       course._id === id ? response.data.data.course : course
  //     );

  //     set({
  //       courses: updatedCourses,
  //       currentCourse: response.data.data.course,
  //     });

  //     toast.success("تم تحديث الدورة بنجاح");
  //     return response.data.data.course;
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "فشل في تحديث الدورة";
  //     set({ error: errorMessage, isLoading: false });
  //     toast.error(errorMessage);
  //     throw error;
  //   }
  // },

  // حذف دورة (للمشرفين فقط)
  deleteCourse: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.delete(`courses/${id}`);
      set({ isLoading: false });
      get().getAllCourses();
      toast.success("تم حذف الدورة بنجاح");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في حذف الدورة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تفعيل/تعطيل دورة (للمشرفين فقط)
  toggleCourseActive: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.patch(
        `/courses/${id}/toggle-active`
      );
      set({ isLoading: false });

      // تحديث حالة الدورة في القائمة
      const currentCourses = get().courses;
      const updatedCourses = currentCourses.map((course) =>
        course._id === id ? response.data.data.course : course
      );

      set({
        courses: updatedCourses,
        currentCourse: response.data.data.course,
      });

      const message = response.data.data.course.isActive
        ? "تم تفعيل الدورة بنجاح"
        : "تم تعطيل الدورة بنجاح";

      toast.success(message);
      return response.data.data.course;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تغيير حالة الدورة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // التسجيل في دورة
  enrollInCourse: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post(`/courses/${id}/enroll`);
      set({ isLoading: false });

      // زيادة عدد الطلاب في الدورة
      const currentCourses = get().courses;
      const updatedCourses = currentCourses.map((course) => {
        if (course._id === id) {
          return { ...course, students: course.students + 1 };
        }
        return course;
      });

      set({ courses: updatedCourses });

      // إضافة الدورة إلى قائمة الدورات المسجلة فيها
      const currentEnrolled = get().enrolledCourses;
      set({
        enrolledCourses: [...currentEnrolled, response.data.data.enrollment],
      });

      toast.success("تم التسجيل في الدورة بنجاح");
      return response.data.data.enrollment;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في التسجيل في الدورة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث تقييم الدورة
  updateCourseRating: async (id, rating) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.patch(
        `/courses/${id}/update-rating`,
        { rating }
      );
      set({ isLoading: false });

      // تحديث التقييم في القائمة
      const currentCourses = get().courses;
      const updatedCourses = currentCourses.map((course) =>
        course._id === id ? response.data.data.course : course
      );

      set({
        courses: updatedCourses,
        currentCourse: response.data.data.course,
      });

      toast.success("تم تحديث التقييم بنجاح");
      return response.data.data.course;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحديث التقييم";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على الدورات المسجلة فيها المستخدم
  fetchEnrolledCourses: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/enrollments/my-courses");
      set({
        enrolledCourses: response.data.data.enrollments,
        isLoading: false,
      });
      return response.data.data.enrollments;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الدورات المسجلة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على إحصائيات الدورات
  fetchCourseStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/courses/stats");
      set({ isLoading: false });
      return response.data.data.stats;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "فشل في تحميل الإحصائيات";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تطبيق الفلاتر
  applyFilters: (newFilters) => {
    const currentFilters = get().filters;
    const mergedFilters = { ...currentFilters, ...newFilters, page: 1 }; // العودة إلى الصفحة الأولى عند تطبيق فلتر جديد

    set({ filters: mergedFilters });
    get().fetchCourses(mergedFilters);
  },

  // تغيير الصفحة
  changePage: (page) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, page };

    set({ filters: newFilters });
    get().fetchCourses(newFilters);
  },

  // مسح الأخطاء
  clearError: () => set({ error: null }),

  // إعادة تعيين الحالة
  reset: () =>
    set({
      courses: [],
      currentCourse: null,
      enrolledCourses: [],
      isLoading: false,
      error: null,
      filters: {
        category: "",
        level: "",
        page: 1,
        limit: 10,
        sort: "-createdAt",
      },
      pagination: {
        total: 0,
        pages: 0,
        currentPage: 1,
      },
    }),
}));

export default useCourseStore;
