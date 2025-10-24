import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useUserStore = create((set, get) => ({
  // الحالة
  users: [],
  currentUser: null,
  userProfile: null,
  isLoading: false,
  error: null,
  filters: {
    role: "",
    level: "",
    search: "",
    isActive: "",
    isPassLiveEx: "",
    page: 1,
    limit: 10,
    sort: "-createdAt"
  },
  pagination: {
    total: 0,
    pages: 0,
    currentPage: 1
  },
  examResults: [],
  userStats: null,

  // الإجراءات (Actions)

  // الحصول على جميع المستخدمين
  fetchUsers: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const currentFilters = get().filters;
      const mergedFilters = { ...currentFilters, ...filters, page: filters.page || 1 };
      
      const queryParams = new URLSearchParams();
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await axiosInstance.get(`/users?${queryParams}`);
      
      set({
        users: response.data.data.users,
        isLoading: false,
        filters: mergedFilters,
        pagination: {
          total: response.data.total,
          pages: response.data.pages,
          currentPage: response.data.page
        }
      });

      return response.data.data.users;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل المستخدمين";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على مستخدم بواسطة ID
  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      set({ currentUser: response.data.data.user, isLoading: false });
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل المستخدم";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إنشاء مستخدم جديد
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post("/users", userData);
      set({ isLoading: false });
      
      const currentUsers = get().users;
      set({ users: [response.data.data.user, ...currentUsers] });
      
      toast.success("تم إنشاء المستخدم بنجاح");
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إنشاء المستخدم";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث مستخدم
  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.patch(`/users/${id}`, userData);
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user =>
        user._id === id ? response.data.data.user : user
      );
      
      set({ 
        users: updatedUsers, 
        currentUser: response.data.data.user 
      });

      const { userProfile } = get();
      if (userProfile && userProfile._id === id) {
        set({ userProfile: response.data.data.user });
      }
      
      toast.success("تم تحديث المستخدم بنجاح");
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث المستخدم";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث كلمة المرور
  updatePassword: async (id, passwordData) => {
    set({ isLoading: true, error: null });
    
    try {
      await axiosInstance.patch(`/users/${id}/password`, passwordData);
      set({ isLoading: false });
      
      toast.success("تم تحديث كلمة المرور بنجاح");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث كلمة المرور";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // حذف مستخدم
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await axiosInstance.delete(`/users/${id}`);
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const filteredUsers = currentUsers.filter(user => user._id !== id);
      
      set({ 
        users: filteredUsers, 
        currentUser: null 
      });
      
      toast.success("تم حذف المستخدم بنجاح");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في حذف المستخدم";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تعطيل/تفعيل مستخدم
  toggleUserStatus: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.patch(`/users/${id}/toggle-status`);
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user =>
        user._id === id ? response.data.data.user : user
      );
      
      set({ 
        users: updatedUsers, 
        currentUser: response.data.data.user 
      });
      
      const message = response.data.data.user.isActive ? "تم تفعيل المستخدم" : "تم تعطيل المستخدم";
      toast.success(message);
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تغيير حالة المستخدم";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على نتائج الامتحانات
  fetchExamResults: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/exam-results");
      set({ 
        examResults: response.data.data.examResults, 
        isLoading: false 
      });
      return response.data.data.examResults;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل نتائج الامتحانات";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على نتيجة امتحان مستخدم معين
  fetchUserExamResult: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/exam-results/user/${userId}`);
      set({ isLoading: false });
      return response.data.data.examResult;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل نتيجة الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث نتيجة الامتحان
  updateExamResult: async (resultId, resultData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.patch(`/exam-results/${resultId}`, resultData);
      set({ isLoading: false });
      
      const currentResults = get().examResults;
      const updatedResults = currentResults.map(result =>
        result._id === resultId ? response.data.data.examResult : result
      );
      
      set({ examResults: updatedResults });
      
      toast.success("تم تحديث نتيجة الامتحان بنجاح");
      return response.data.data.examResult;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث نتيجة الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إضافة مستخدم إلى مجموعة
  addUserToGroup: async (userId, groupId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post(`/users/${userId}/add-to-group`, {
        groupId
      });
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user =>
        user._id === userId ? response.data.data.user : user
      );
      
      set({ 
        users: updatedUsers, 
        currentUser: response.data.data.user 
      });
      
      toast.success("تم إضافة المستخدم إلى المجموعة بنجاح");
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إضافة المستخدم إلى المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إزالة مستخدم من مجموعة
  removeUserFromGroup: async (userId, groupId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post(`/users/${userId}/remove-from-group`, {
        groupId
      });
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user =>
        user._id === userId ? response.data.data.user : user
      );
      
      set({ 
        users: updatedUsers, 
        currentUser: response.data.data.user 
      });
      
      toast.success("تم إزالة المستخدم من المجموعة بنجاح");
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إزالة المستخدم من المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على إحصائيات المستخدمين
  fetchUserStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/users/stats");
      set({ 
        userStats: response.data.data, 
        isLoading: false 
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل الإحصائيات";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // البحث في المستخدمين
  searchUsers: async (query) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/users/search?query=${query}`);
      set({ 
        users: response.data.data.users, 
        isLoading: false,
        filters: { ...get().filters, search: query }
      });
      
      return response.data.data.users;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في البحث";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث مستوى المستخدم
  updateUserLevel: async (userId, level) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, { level });
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user =>
        user._id === userId ? response.data.data.user : user
      );
      
      set({ 
        users: updatedUsers, 
        currentUser: response.data.data.user 
      });
      
      toast.success("تم تحديث مستوى المستخدم بنجاح");
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث المستوى";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث دور المستخدم
  updateUserRole: async (userId, role) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, { role });
      set({ isLoading: false });
      
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user =>
        user._id === userId ? response.data.data.user : user
      );
      
      set({ 
        users: updatedUsers, 
        currentUser: response.data.data.user 
      });
      
      toast.success("تم تحديث دور المستخدم بنجاح");
      return response.data.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث الدور";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تطبيق الفلاتر
  applyFilters: (newFilters) => {
    const currentFilters = get().filters;
    const mergedFilters = { ...currentFilters, ...newFilters, page: 1 };
    
    set({ filters: mergedFilters });
    get().fetchUsers(mergedFilters);
  },

  // تغيير الصفحة
  changePage: (page) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, page };
    
    set({ filters: newFilters });
    get().fetchUsers(newFilters);
  },

  // مسح البحث
  clearSearch: () => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, search: "", page: 1 };
    
    set({ filters: newFilters });
    get().fetchUsers(newFilters);
  },

  // الحصول على نتيجة امتحان مستخدم معين من الحالة المحلية
  getExamResultByUserId: (userId) => {
    const { examResults } = get();
    return examResults.find(result => result.user?._id === userId);
  },

  // الحصول على المستخدمين حسب المجموعة
  getUsersByGroup: (groupId) => {
    const { users } = get();
    return users.filter(user => 
      user.groups?.some(group => group._id === groupId)
    );
  },

  // الحصول على المستخدمين حسب المستوى
  getUsersByLevel: (level) => {
    const { users } = get();
    return users.filter(user => user.level === level);
  },

  // الحصول على المستخدمين حسب الدور
  getUsersByRole: (role) => {
    const { users } = get();
    return users.filter(user => user.role === role);
  },

  // مسح الأخطاء
  clearError: () => set({ error: null }),

  // تحديث الملف الشخصي محلياً
  updateProfileLocally: (profileData) => {
    set({ userProfile: profileData });
  },

  // إعادة تعيين الحالة
  reset: () => set({
    users: [],
    currentUser: null,
    userProfile: null,
    isLoading: false,
    error: null,
    filters: {
      role: "",
      level: "",
      search: "",
      isActive: "",
      page: 1,
      limit: 10,
      sort: "-createdAt"
    },
    pagination: {
      total: 0,
      pages: 0,
      currentPage: 1
    },
    examResults: [],
    userStats: null
  })
}));

export default useUserStore;