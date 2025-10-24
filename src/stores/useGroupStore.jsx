import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useGroupStore = create((set, get) => ({
  // الحالة
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
  filters: {
    level: "",
    search: "",
    page: 1,
    limit: 10,
    sort: "-createdAt"
  },
  pagination: {
    total: 0,
    pages: 0,
    currentPage: 1
  },

  // الإجراءات (Actions)

  // الحصول على جميع المجموعات
  fetchGroups: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      // دمج الفلاتر الحالية مع الفلاتر الجديدة
      const currentFilters = get().filters;
      const mergedFilters = { ...currentFilters, ...filters, page: filters.page || 1 };
      
      // بناء query string
      const queryParams = new URLSearchParams();
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axiosInstance.get(`/groups?${queryParams}`);
      
      set({
        groups: response.data.data.groups,
        isLoading: false,
        filters: mergedFilters,
        pagination: {
          total: response.data.total,
          pages: response.data.pages,
          currentPage: response.data.page
        }
      });

      return response.data.data.groups;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل المجموعات";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على مجموعة بواسطة ID
  fetchGroupById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/groups/${id}`);
      set({ currentGroup: response.data.data.group, isLoading: false });
      return response.data.data.group;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إنشاء مجموعة جديدة
  createGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post("/groups", groupData);
      set({ isLoading: false });
      
      // إضافة المجموعة الجديدة إلى القائمة
      const currentGroups = get().groups;
      set({ groups: [response.data.data.group, ...currentGroups] });
      
      toast.success("تم إنشاء المجموعة بنجاح");
      return response.data.data.group;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إنشاء المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // تحديث مجموعة
  updateGroup: async (id, groupData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.patch(`/groups/${id}`, groupData);
      set({ isLoading: false });
      
      // تحديث المجموعة في القائمة
      const currentGroups = get().groups;
      const updatedGroups = currentGroups.map(group =>
        group._id === id ? response.data.data.group : group
      );
      
      set({ 
        groups: updatedGroups, 
        currentGroup: response.data.data.group 
      });
      
      toast.success("تم تحديث المجموعة بنجاح");
      return response.data.data.group;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // حذف مجموعة
  deleteGroup: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await axiosInstance.delete(`/groups/${id}`);
      set({ isLoading: false });
      
      // إزالة المجموعة من القائمة
      const currentGroups = get().groups;
      const filteredGroups = currentGroups.filter(group => group._id !== id);
      
      set({ 
        groups: filteredGroups, 
        currentGroup: null 
      });
      
      toast.success("تم حذف المجموعة بنجاح");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في حذف المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إضافة طالب إلى مجموعة
  addStudentToGroup: async (groupId, studentId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/add-student`, {
        studentId
      });
      set({ isLoading: false });
      
      // تحديث المجموعة في القائمة
      const currentGroups = get().groups;
      const updatedGroups = currentGroups.map(group =>
        group._id === groupId ? response.data.data.group : group
      );
      
      set({ 
        groups: updatedGroups, 
        currentGroup: response.data.data.group 
      });
      
      toast.success("تم إضافة الطالب إلى المجموعة بنجاح");
      return response.data.data.group;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إضافة الطالب";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // إزالة طالب من مجموعة
  removeStudentFromGroup: async (groupId, studentId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/remove-student`, {
        studentId
      });
      set({ isLoading: false });
      
      // تحديث المجموعة في القائمة
      const currentGroups = get().groups;
      const updatedGroups = currentGroups.map(group =>
        group._id === groupId ? response.data.data.group : group
      );
      
      set({ 
        groups: updatedGroups, 
        currentGroup: response.data.data.group 
      });
      
      toast.success("تم إزالة الطالب من المجموعة بنجاح");
      return response.data.data.group;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إزالة الطالب";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // البحث في المجموعات
  searchGroups: async (query) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/groups/search?query=${query}`);
      set({ 
        groups: response.data.data.groups, 
        isLoading: false,
        filters: { ...get().filters, search: query }
      });
      
      return response.data.data.groups;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في البحث";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // الحصول على إحصائيات المجموعات
  fetchGroupStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/groups/stats");
      set({ isLoading: false });
      return response.data.data.stats;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل الإحصائيات";
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
    get().fetchGroups(mergedFilters);
  },

  // تغيير الصفحة
  changePage: (page) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, page };
    
    set({ filters: newFilters });
    get().fetchGroups(newFilters);
  },

  // مسح البحث
  clearSearch: () => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, search: "", page: 1 };
    
    set({ filters: newFilters });
    get().fetchGroups(newFilters);
  },

  // مسح الأخطاء
  clearError: () => set({ error: null }),

  // إعادة تعيين الحالة
  reset: () => set({
    groups: [],
    currentGroup: null,
    isLoading: false,
    error: null,
    filters: {
      level: "",
      search: "",
      page: 1,
      limit: 10,
      sort: "-createdAt"
    },
    pagination: {
      total: 0,
      pages: 0,
      currentPage: 1
    }
  })
}));

export default useGroupStore;