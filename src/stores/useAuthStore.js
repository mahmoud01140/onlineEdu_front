import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  success: false,
  isLoading: false,
  studentStatus: null,
  setStudentStatus: (status) => {
    set({ studentStatus: status });
  },
  registerStudent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/register/student", data);
      set({ user: response.data });
      console.log(response);
      set({ success: true });
      toast.success("تم التسجيل بنجاح. يمكنك تسجيل الدخول الآن.");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.errors?.map((err) => err).join(", ") ||
        "فشل في التسجيل. يرجى المحاولة مرة أخرى.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  registerTeacher: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/register/teacher", data);
      set({ user: response.data });
      toast.success("تم التسجيل بنجاح. يمكنك تسجيل الدخول الآن.");
      set({ success: true });
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.errors?.map((err) => err).join(", ") ||
        "فشل في التسجيل. يرجى المحاولة مرة أخرى.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  registerElder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/register/elder", data);
      set({ user: response.data });
      console.log(response);
      set({ success: true });
      toast.success("تم التسجيل بنجاح. يمكنك تسجيل الدخول الآن.");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.errors?.map((err) => err).join(", ")  || error.response?.data?.message ||
        "فشل في التسجيل. يرجى المحاولة مرة أخرى.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  loginUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ user: response.data });
      console.log(response.data);
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        "فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("auth/check");
      set({ user: response.data });
    } catch (error) {
      console.log(error);
      set({ user: null });

    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ user: null });
      console.log(response);
      toast.success("تم تسجيل خروج بنجاح");
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.");
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default useAuthStore;
