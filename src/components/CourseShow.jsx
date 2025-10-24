import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Star, Search, Filter, X } from "lucide-react";
import useCourseStore from "../stores/useCourseStore";
const CoursesShow = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { getAllCourses, courses } = useCourseStore();
  useEffect(() => {
    getAllCourses();
  }, []);
  // Updated courses data based on your list
  // const courses = [
  //   {
  //     id: 1,
  //     title: "دورة نور البيان للأطفال",
  //     description:
  //       "برنامج متخصص لتعليم الأطفال قراءة القرآن الكريم بطريقة نور البيان المنهجية.",
  //     duration: "3 أشهر",
  //     students: 120,
  //     level: "مبتدئ",
  //     rating: 4.9,
  //     category: "نور البيان",
  //   },
  //   {
  //     id: 2,
  //     title: "دورة نور البيان لكبار السن",
  //     description:
  //       "تعليم كبار السن قراءة القرآن بطريقة ميسرة تناسب قدراتهم واستيعابهم.",
  //     duration: "4 أشهر",
  //     students: 65,
  //     level: "مبتدئ",
  //     rating: 4.8,
  //     category: "نور البيان",
  //   },
  //   {
  //     id: 3,
  //     title: "دورة نور البيان وإعداد معلمات حضانات ودور التحفيظ",
  //     description:
  //       "إعداد وتأهيل المعلمات لتدريس منهج نور البيان في الحضانات ودور التحفيظ.",
  //     duration: "6 أشهر",
  //     students: 45,
  //     level: "متقدم",
  //     rating: 4.9,
  //     category: "نور البيان",
  //   },
  //   {
  //     id: 4,
  //     title: "دورات التجويد للمبتدئين",
  //     description: "تعلم أساسيات أحكام التجويد بشكل عملي وتطبيقي للمبتدئين.",
  //     duration: "5 أشهر",
  //     students: 95,
  //     level: "مبتدئ",
  //     rating: 4.7,
  //     category: "التجويد",
  //   },
  //   {
  //     id: 5,
  //     title: "دورة الصيفية لختمة القرآن الكريم فى أربعة أشهر فقط",
  //     description:
  //       "برنامج مكثف خلال الصيف لختم القرآن الكريم في أربعة أشهر فقط.",
  //     duration: "4 أشهر",
  //     students: 80,
  //     level: "متوسط",
  //     rating: 4.8,
  //     category: "الحفظ",
  //   },
  //   {
  //     id: 6,
  //     title: "دورة الفقه الميسر",
  //     description: "شرح مبسط لأحكام الفقه الإسلامي بما يناسب جميع المستويات.",
  //     duration: "6 أشهر",
  //     students: 110,
  //     level: "جميع المستويات",
  //     rating: 4.7,
  //     category: "الفقه",
  //   },
  //   {
  //     id: 7,
  //     title: "دورة السيرة",
  //     description:
  //       "دراسة متعمقة لسيرة النبي صلى الله عليه وسلم وأخلاقه وشمائله.",
  //     duration: "3 أشهر",
  //     students: 75,
  //     level: "جميع المستويات",
  //     rating: 4.9,
  //     category: "السيرة",
  //   },
  //   {
  //     id: 8,
  //     title: "دورة حفظ المتون العلمية",
  //     description: "حفظ المتون العلمية في مختلف العلوم الشرعية مع فهم معانيها.",
  //     duration: "8 أشهر",
  //     students: 50,
  //     level: "متقدم",
  //     rating: 4.8,
  //     category: "المتون",
  //   },
  //   {
  //     id: 9,
  //     title: "دورة التجويد المصور",
  //     description: "تعلم التجويد باستخدام الوسائل البصرية والرسومات التوضيحية.",
  //     duration: "4 أشهر",
  //     students: 70,
  //     level: "متوسط",
  //     rating: 4.6,
  //     category: "التجويد",
  //   },
  //   {
  //     id: 10,
  //     title: "دورة الخط العربي",
  //     description:
  //       "إتقان فن الخط العربي وتحسين handwriting لكتابة القرآن الكريم.",
  //     duration: "3 أشهر",
  //     students: 60,
  //     level: "جميع المستويات",
  //     rating: 4.7,
  //     category: "الخط",
  //   },
  //   {
  //     id: 11,
  //     title: "دورة الطفل العبقري في الحساب",
  //     description:
  //       "تنمية مهارات الحساب الذهني لدى الأطفال باستخدام أساليب مبتكرة.",
  //     duration: "5 أشهر",
  //     students: 90,
  //     level: "مبتدئ",
  //     rating: 4.8,
  //     category: "المهارات",
  //   },
  // ];

  const categories = [
    { id: "all", name: "جميع البرامج" },
    { id: "نور البيان", name: "نور البيان" },
    { id: "التجويد", name: "التجويد" },
    { id: "الحفظ", name: "الحفظ" },
    { id: "الفقه", name: "الفقه" },
    { id: "السيرة", name: "السيرة" },
    { id: "المتون", name: "المتون" },
    { id: "الخط", name: "الخط" },
    { id: "المهارات", name: "المهارات" },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      dir="rtl"
      className="py-16 px-4 sm:px-6 lg:px-8 border-t-2"
      id="courses"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          برامجنا التعليمية
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-center mb-12 max-w-3xl mx-auto"
        >
          اكتشف مجموعة برامجنا المصممة خصيصًا لمساعدتك في رحلة حفظ وتعلم القرآن
          الكريم والعلوم الشرعية
        </motion.p>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث عن برنامج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-10 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="">تصفية حسب:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Courses List */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-r-4 border-green-500"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {course.title}
                      </h3>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 ml-1" />
                        <span>المدة: {course.duration}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 ml-1" />
                        <span>الطلاب: {course.students}+</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 ml-1 text-yellow-400" />
                        <span>التقييم: {course.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-lg">
                      {course.level}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">
              لم يتم العثور على برامج
            </h3>
            <p className="text-gray-500 mt-2">
              جرب البحث باستخدام مصطلحات أخرى أو اختر فئة مختلفة
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CoursesShow;
