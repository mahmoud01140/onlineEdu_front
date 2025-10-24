
// stores/useLiveExamStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useLiveExamStore = create((set, get) => ({
  // State
  liveExams: [],
  allLiveExams: [],
  currentLiveExam: null,
  isLoading: false,
  error: null,

  // Actions
    fetchAllLiveExams: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/liveExam");
      
      set({ 
        allLiveExams: response.data.data.liveExams,
        isLoading: false 
      });

      return response.data.data.liveExams;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل الامتحانات الحية";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  fetchUpcomingLiveExams: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/liveExam/upcoming");
      
      set({ 
        liveExams: response.data.data.liveExams,
        isLoading: false 
      });

      return response.data.data.liveExams;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل الامتحانات الحية";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  createLiveExam: async (examData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post("/liveExam/create", examData);
      
      set({ isLoading: false });
      toast.success("تم إنشاء الامتحان الحي بنجاح");
      
      // Refresh the list
      get().fetchUpcomingLiveExams();
      
      return response.data.data.liveExam;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إنشاء الامتحان الحي";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateLiveExam: async (id, examData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.put(`/liveExam/${id}`, examData);
      
      set({ isLoading: false });
      toast.success("تم تحديث الامتحان الحي بنجاح");
      
      // Refresh the list
      get().fetchUpcomingLiveExams();
      
      return response.data.data.liveExam;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحديث الامتحان الحي";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteLiveExam: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await axiosInstance.delete(`/liveExam/${id}`);
      
      set({ isLoading: false });
      toast.success("تم حذف الامتحان الحي بنجاح");
      
      // Refresh the list
      get().fetchUpcomingLiveExams();
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في حذف الامتحان الحي";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  fetchLiveExamById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/liveExam/${id}`);
      
      set({ 
        currentLiveExam: response.data.data.liveExam,
        isLoading: false 
      });

      return response.data.data.liveExam;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل بيانات الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  addUserToLiveExam: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/liveExam/${id}/add-user`);
      set({ isLoading: false, liveExams: [...get().liveExams, response.data.data.liveExam]});
      toast.success("تم إضافة المستخدم إلى الامتحان بنجاح");
      return response.data.data.liveExam;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في إضافة المستخدم إلى الامتحان";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  clearCurrentLiveExam: () => {
    set({ currentLiveExam: null });
  },

  clearError: () => set({ error: null })
}));

export default useLiveExamStore;

