import { motion, AnimatePresence } from "framer-motion";
import StudentForm from "../components/StudentForm";
import Teacherform from "../components/teacherform";
import ElderForm from "../components/ElderForm";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const FormPage = () => {
  const { studentStatus, setStudentStatus } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (studentStatus === null) {
      navigate("/register");
    }
  }, []);
  return (
    <section dir="rtl" className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          التسجيل فى الاكاديمية
        </motion.h1>
        <AnimatePresence mode="wait">
          {studentStatus === "student" ? (
            <StudentForm />
          ) : studentStatus === "teacher" ? (
            <Teacherform />
          ) : studentStatus === "elder" ? (
            <ElderForm />
          ) : (
            ""
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FormPage;
