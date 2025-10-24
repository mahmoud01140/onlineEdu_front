// stores/useStudyStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useAdminStudyStore = create((set, get) => ({
  // State
  upcomingLessons: [],
  currentGroup: null,
  attendanceRecords: [],
  isLoading: false,
  error: null,

  // Actions
  fetchUpcomingLessons: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/studyAdmin/upcoming-lessons");
      
      set({ 
        upcomingLessons: response.data.data.lessons,
        isLoading: false 
      });

      return response.data.data.lessons;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل الدروس القادمة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  fetchGroupDetails: async (groupId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/studyAdmin/group/${groupId}`);
      
      set({ 
        currentGroup: response.data.data.group,
        isLoading: false 
      });

      return response.data.data.group;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل تفاصيل المجموعة";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  markAttendance: async (lessonId, groupId, attendanceRecords) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post("/studyAdmin/attendance", {
        lessonId,
        groupId,
        attendanceRecords
      });
      
      set({ isLoading: false });
      toast.success("تم حفظ الحضور والغياب بنجاح");
      
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في حفظ الحضور والغياب";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  fetchAttendanceRecords: async (lessonId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/studyAdmin/attendance/${lessonId}`);
      
      set({ 
        attendanceRecords: response.data.data.attendance,
        isLoading: false 
      });

      return response.data.data.attendance;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "فشل في تحميل سجل الحضور";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  clearCurrentGroup: () => {
    set({ currentGroup: null });
  },

  clearError: () => set({ error: null })
}));

export default useAdminStudyStore;
