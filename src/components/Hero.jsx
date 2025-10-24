import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  Award,
} from "lucide-react";
import heroImage from "../assets/images/hero.jpeg";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
const AcademicHero = () => {
  // Animation variants for Framer Motion
  const {user, logout} = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-br py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-right"
            dir="rtl"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              لكل من يتوق لحفظ القرآن الكريم
              <span className="text-green-600"> اكاديمية ابويوسف Online</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants} 
              className="text-lg sm:text-xl"
            >
              انضم الآن لحلقات حفظ ومتابعة جماعية او فردية (رجال – نساء –
              أطفال). تعلم التجويد، فهم المعاني، وحفظ بأساليب حديثة مع مراجعة
              منظمة — من راحة منزلك.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-end"
            >
              <Link to = {user? "/study" : "/register"} className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center">
                {user? "الدراسة" : "سجل الان فى الاكاديمية "}<ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                تواصل معنا
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6"
            >
              <div className="flex items-center justify-end">
                <div className="bg-blue-100 p-3 rounded-full ml-3">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold">+100</p>
                  <p className="text-xs sm:text-sm">طلاب منتظمون</p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="bg-indigo-100 p-3 rounded-full ml-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold">معلمون</p>
                  <p className="text-xs sm:text-sm">ذوو خبرة عالية</p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="bg-purple-100 p-3 rounded-full ml-3">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold">95%</p>
                  <p className="text-xs sm:text-sm">معدل نجاح وتثبيت</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 relative mt-8 lg:mt-0"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={heroImage}
                alt="Academic students collaborating"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating card element - Responsive positioning */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-lg p-3 sm:p-4 max-w-[180px] sm:max-w-xs"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-green-100 p-1 sm:p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <p className="text-xs sm:text-sm font-bold">
                  <span className="text-red-400">نور بيان</span> -{" "}
                  <span className="text-blue-400">اختبارات</span> -{" "}
                  <span className="text-yellow-600">متون</span>
                </p>
              </div>
            </motion.div>

            {/* Another floating element - Responsive positioning */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-green-600 text-white rounded-xl shadow-lg p-3 sm:p-4 max-w-[160px] sm:max-w-xs font-bold"
            >
              <p className="text-xs sm:text-sm">
                الحلقات عن طريق تطبيق زووم عن طريق الهاتف
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AcademicHero;