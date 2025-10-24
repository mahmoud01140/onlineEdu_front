import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap, User, Users } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
const StudentStatusPage = () => {
  const { studentStatus, setStudentStatus } = useAuthStore();
  const navigate = useNavigate();
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
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <BookOpen className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-6">
                اختر فئتك لتحديد المستوى المناسب لك في أكاديمية أبو يوسف
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStudentStatus("student");
                  navigate("/studentform");
                }}
                className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-6 flex flex-col items-center transition-colors duration-300"
              >
                <GraduationCap className="h-12 w-12 text-blue-600 mb-4" />
                <span className="text-lg font-medium text-blue-800">طالب</span>
                <p className="text-sm text-blue-600 mt-2">
                  للمتعلمين الجدد والصغار
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStudentStatus("teacher");
                  navigate("/studentform");
                }}
                className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-6 flex flex-col items-center transition-colors duration-300"
              >
                <User className="h-12 w-12 text-green-600 mb-4" />
                <span className="text-lg font-medium text-green-800">
                  معلم/معلمة
                </span>
                <p className="text-sm text-green-600 mt-2">
                  للمعلمين والمشرفين
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStudentStatus("elder");
                  navigate("/studentform");
                }}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-6 flex flex-col items-center transition-colors duration-300"
              >
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <span className="text-lg font-medium text-purple-800">
                  كبير سن
                </span>
                <p className="text-sm text-purple-600 mt-2">للكبار في السن</p>
              </motion.button>
            </div>
            <div  className="mt-5">هل لديك حساب بالفعل <Link to = "/login" className="btn py-1">سجل دخول </Link> </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default StudentStatusPage;
