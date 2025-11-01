import React, { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BookText,
  Clock,
  Users,
  Star,
  Tag,
  ArrowLeft,
  Save,
  TrendingUp,
  UserCheck,
  UserX,
  GraduationCap,
  Calendar,
  FileText,
  BarChart,
  PieChart,
  Video,
  Download,
} from "lucide-react";
import useCourseStore from "../stores/useCourseStore";
import useUserStore from "../stores/useUserStore";
import useGroupStore from "../stores/useGroupStore";
import useLessonStore from "../stores/useLessonStore";
import useAuthStore from "../stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import LessonsManagement from "../components/adminDashboard/LessonsManagement";
import GroupsManagement from "../components/adminDashboard/GroupsManagement";
import UsersManagement from "../components/adminDashboard/UsersManagement";
import ExamsManagement from "../components/adminDashboard/ExamsManagement";
import AdminStudy from "../components/adminDashboard/AdminStudy";
import LiveExamsManagement from "../components/adminDashboard/LiveExamsManagement";
import ExportUsers from "../components/adminDashboard/ExportUsers";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [activeTab]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('admin-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (window.innerWidth < 1024 && 
          isSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          menuButton && 
          !menuButton.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "users":
        return <UsersManagement />;
      case "courses":
        return <CoursesManagement />;
      case "exams":
        return <ExamsManagement />;
      case "groups":
        return <GroupsManagement />;
      case "lessons":
        return <LessonsManagement />;
      case "study":
        return <AdminStudy />;
      case "live-exams":
        return <LiveExamsManagement />;
      case "export-users":
        return <ExportUsers />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen lg:h-[calc(100vh-90px)]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="admin-sidebar"
        className={`bg-white shadow-lg transform transition-all duration-300 fixed lg:static z-50 ${
          isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20 xl:w-64"
        } overflow-hidden h-full flex flex-col`}
      >
        <div className="p-4 border-b flex-shrink-0">
          <h1 className={`text-xl font-bold text-primary ${!isSidebarOpen && 'lg:hidden xl:block'}`}>
            لوحة تحكم المشرف
          </h1>
          <p className={`text-sm text-gray-600 ${!isSidebarOpen && 'lg:hidden xl:block'}`}>
            أكاديمية أبو يوسف
          </p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="dashboard"
            icon={BarChart3}
            label="الإحصائيات"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="live-exams"
            icon={Video}
            label="الامتحانات الشفهي"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="study"
            icon={BookOpen}
            label="إدارة الدراسة"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="users"
            icon={Users}
            label="إدارة المستخدمين"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="courses"
            icon={BookOpen}
            label="إدارة الدورات"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="exams"
            icon={ClipboardCheck}
            label="إدارة الامتحانات"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="lessons"
            icon={BookOpen}
            label="إدارة الدروس"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="groups"
            icon={Users}
            label="إدارة المجموعات"
            isSidebarOpen={isSidebarOpen}
          />

          <SidebarButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="export-users"
            icon={Download}
            label="تنزيل بيانات المستخدمين"
            isSidebarOpen={isSidebarOpen}
          />

          <div className="border-t pt-4 mt-4 flex-shrink-0">
            <button
              className="w-full flex items-center justify-center lg:justify-start space-x-2 p-3 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              onClick={() => {
                logout();
              }}
            >
              <LogOut size={20} />
              <span className={`${!isSidebarOpen && 'lg:hidden xl:block'}`}>تسجيل الخروج</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:mr-0">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            id="menu-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-right">
              <p className="font-semibold text-sm md:text-base">{user?.user?.name || "المشرف"}</p>
              <p className="text-xs md:text-sm text-gray-600">مشرف النظام</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
              {user?.user?.name?.charAt(0) || "M"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Sidebar Button Component
const SidebarButton = ({ activeTab, setActiveTab, tabName, icon: Icon, label, isSidebarOpen }) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`w-full flex items-center justify-center lg:justify-start space-x-2 p-3 rounded-lg transition-colors ${
      activeTab === tabName
        ? "bg-primary text-white"
        : "hover:bg-gray-100"
    }`}
  >
    <Icon size={20} />
    <span className={`${!isSidebarOpen && 'lg:hidden xl:block'}`}>{label}</span>
  </button>
);

// مكون صفحة الإحصائيات
const DashboardHome = () => {
  const { userStats, fetchUserStats } = useUserStore();
  const { fetchGroupStats, groupStats } = useGroupStore();
  const { fetchLessonStats, lessonStats } = useLessonStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        await Promise.all([
          fetchUserStats(),
          fetchGroupStats(),
          fetchLessonStats(),
        ]);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Calculate total stats from the API data
  const totalStats = {
    totalUsers: userStats?.totalUsers || 0,
    activeUsers: userStats?.activeUsers || 0,
    inactiveUsers: userStats?.inactiveUsers || 0,
    todayRegistrations: userStats?.todayRegistrations || 0,
    totalGroups:
      userStats?.groupStats?.reduce((sum, stat) => sum + stat.totalGroups, 0) ||
      0,
    totalLessons:
      lessonStats?.totalLessons || 0,
    upcomingLessons:
      lessonStats?.upcomingLessons || 0,
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-gray-600">
          آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
        </p>
      </div>

      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <StatCard
          icon={Users}
          title="إجمالي المستخدمين"
          value={totalStats.totalUsers}
          description={`+${totalStats.todayRegistrations} اليوم`}
          color="primary"
        />

        <StatCard
          icon={UserCheck}
          title="المستخدمين النشطين"
          value={totalStats.activeUsers}
          description={`${Math.round(
            (totalStats.activeUsers / totalStats.totalUsers) * 100
          ) || 0}% من الإجمالي`}
          color="secondary"
        />

        <StatCard
          icon={GraduationCap}
          title="إجمالي المجموعات"
          value={totalStats.totalGroups}
          description="مجموعات تعليمية"
          color="accent"
        />

        <StatCard
          icon={BookOpen}
          title="إجمالي الدروس"
          value={totalStats.totalLessons}
          description={`${totalStats.upcomingLessons} قادمة`}
          color="info"
        />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* إحصائيات المستخدمين حسب الدور */}
        <StatsSection
          title="توزيع المستخدمين حسب الدور"
          icon={PieChart}
          data={userStats?.roleStats}
          renderItem={(stat) => (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stat._id === "student"
                      ? "bg-primary"
                      : stat._id === "teacher"
                      ? "bg-secondary"
                      : stat._id === "admin"
                      ? "bg-accent"
                      : "bg-gray-400"
                  }`}
                ></div>
                <div>
                  <h3 className="font-semibold text-sm capitalize">
                    {stat._id === "student"
                      ? "طالب"
                      : stat._id === "teacher"
                      ? "معلم"
                      : stat._id === "admin"
                      ? "مشرف"
                      : stat._id === "elder"
                      ? "كبار"
                      : stat._id}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {stat.activeUsers} نشطين من أصل {stat.totalUsers}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-base md:text-lg">{stat.totalUsers}</div>
                <div className="text-xs text-gray-500">مستخدم</div>
              </div>
            </>
          )}
        />

        {/* إحصائيات المجموعات حسب المستوى */}
        <StatsSection
          title="المجموعات حسب المستوى"
          icon={BarChart}
          data={userStats?.groupStats}
          renderItem={(stat) => (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stat._id === "مبتدئ"
                      ? "bg-success"
                      : stat._id === "متوسط"
                      ? "bg-warning"
                      : stat._id === "متقدم"
                      ? "bg-error"
                      : "bg-gray-400"
                  }`}
                ></div>
                <div>
                  <h3 className="font-semibold text-sm">{stat._id}</h3>
                  <p className="text-xs text-gray-600">
                    {stat.totalStudents} طالب في {stat.totalGroups} مجموعة
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-base md:text-lg">{stat.totalGroups}</div>
                <div className="text-xs text-gray-500">مجموعة</div>
              </div>
            </>
          )}
        />
      </div>

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* إحصائيات الدروس */}
        <StatsSection
          title="إحصائيات الدروس"
          icon={Calendar}
          data={lessonStats?.levelStats}
          renderItem={(stat) => (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stat._id === "مبتدئ"
                      ? "bg-success"
                      : stat._id === "متوسط"
                      ? "bg-warning"
                      : stat._id === "متقدم"
                      ? "bg-error"
                      : "bg-gray-400"
                  }`}
                ></div>
                <div>
                  <h3 className="font-semibold text-sm">مستوى {stat._id}</h3>
                  <p className="text-xs text-gray-600">
                    {stat.upcomingLessons} درس قادم
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-base md:text-lg">{stat.totalLessons}</div>
                <div className="text-xs text-gray-500">درس</div>
              </div>
            </>
          )}
        />

        {/* إحصائيات سريعة */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 ml-2" />
              إحصائيات سريعة
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <QuickStat
                icon={UserCheck}
                value={totalStats.activeUsers}
                label="مستخدم نشط"
                color="blue"
              />

              <QuickStat
                icon={UserX}
                value={totalStats.inactiveUsers}
                label="مستخدم غير نشط"
                color="green"
              />

              <QuickStat
                icon={Calendar}
                value={totalStats.todayRegistrations}
                label="مستخدم جديد اليوم"
                color="purple"
              />

              <QuickStat
                icon={BookOpen}
                value={totalStats.upcomingLessons}
                label="درس قادم"
                color="orange"
              />
            </div>
          </div>
        </div>
      </div>

      {/* مخطط إحصائي (وهمي) */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mt-4 md:mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="h-4 w-4 md:h-5 md:w-5 ml-2" />
          نظرة عامة على النشاط
        </h2>
        <div className="h-48 md:h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center flex-col p-4">
          <BarChart3 size={32} className="text-blue-400 mb-2 md:mb-4" />
          <p className="text-blue-600 font-medium text-sm md:text-base">مخططات النشاط التفصيلية</p>
          <p className="text-blue-400 text-xs md:text-sm">سيتم إضافتها قريباً</p>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, title, value, description, color }) => (
  <div className="stats shadow bg-white w-full">
    <div className="stat">
      <div className={`stat-figure text-${color}`}>
        <Icon size={28} className="hidden sm:block" />
        <Icon size={24} className="sm:hidden" />
      </div>
      <div className="stat-title text-xs sm:text-sm">{title}</div>
      <div className={`stat-value text-${color} text-lg sm:text-2xl md:text-3xl`}>
        {value}
      </div>
      <div className="stat-desc text-xs">{description}</div>
    </div>
  </div>
);

// Reusable Stats Section Component
const StatsSection = ({ title, icon: Icon, data, renderItem }) => (
  <div className="bg-white rounded-lg shadow p-4 md:p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg md:text-xl font-semibold flex items-center">
        <Icon className="h-4 w-4 md:h-5 md:w-5 ml-2" />
        {title}
      </h2>
    </div>

    <div className="space-y-3 md:space-y-4">
      {data?.map((stat) => (
        <div
          key={stat._id}
          className="flex justify-between items-center p-3 border rounded-lg"
        >
          {renderItem(stat)}
        </div>
      ))}
    </div>
  </div>
);

// Reusable Quick Stat Component
const QuickStat = ({ icon: Icon, value, label, color }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-600" },
    green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "text-orange-600" },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`text-center p-3 md:p-4 ${colors.bg} rounded-lg`}>
      <Icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 ${colors.icon}`} />
      <div className={`text-lg md:text-2xl font-bold ${colors.text}`}>
        {value}
      </div>
      <div className={`text-xs ${colors.text} font-medium`}>{label}</div>
    </div>
  );
};

// مكون إدارة الدورات
const CoursesManagement = () => {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const { courses, getAllCourses, deleteCourse } = useCourseStore();

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <>
      {isAddCourseOpen ? (
        <CourseForm setIsAddCourseOpen={setIsAddCourseOpen} />
      ) : (
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">إدارة الدورات</h1>
            <button
              className="btn btn-primary btn-sm md:btn-md"
              onClick={() => setIsAddCourseOpen(true)}
            >
              <BookText size={18} className="ml-1 md:ml-2" />
              <span className="text-sm md:text-base">دورة جديدة</span>
            </button>
          </div>

          {/* بطاقات الدورات */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {courses?.map((course) => (
              <motion.div
                key={course._id}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 border-r-4 border-green-500"
              >
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">
                        {course.title}
                      </h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full self-start">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 md:gap-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                        <span>المدة: {course.duration}</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                        <span>الطلاب: {course.students}+</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600">
                        <Star className="h-3 w-3 md:h-4 md:w-4 ml-1 text-yellow-400" />
                        <span>التقييم: {course.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-lg">
                      {course.level}
                    </span>
                    <button
                      className="btn btn-error btn-xs md:btn-sm"
                      onClick={() => deleteCourse(course._id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// مكون إدارة الامتحانات
const CourseForm = ({ setIsAddCourseOpen, isEditing = false }) => {
  const { createCourse } = useCourseStore();

  const initialFormData = {
    title: "",
    description: "",
    duration: "",
    students: 0,
    level: "مبتدئ",
    rating: 0,
    category: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCourse(formData);
    setIsAddCourseOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-base-100 rounded-lg">
      {/* الرأس */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddCourseOpen(false)}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold">
            {isEditing ? "تعديل الدورة" : "إنشاء دورة جديدة"}
          </h1>
        </div>
        <div className="flex space-x-2 self-end sm:self-auto">
          <button
            onClick={() => setIsAddCourseOpen(false)}
            className="btn btn-outline btn-sm md:btn-md"
          >
            <X size={18} className="ml-1 md:ml-2" />
            <span className="text-sm md:text-base">إلغاء</span>
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm md:btn-md">
            <Save size={18} className="ml-1 md:ml-2" />
            <span className="text-sm md:text-base">حفظ</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* المعلومات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center text-sm md:text-base">
                <BookOpen size={16} className="ml-1" />
                عنوان الدورة *
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="أدخل عنوان الدورة"
              className="input input-bordered input-sm md:input-md"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center text-sm md:text-base">
                <Tag size={16} className="ml-1" />
                التصنيف *
              </span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="أدخل تصنيف الدورة"
              className="input input-bordered input-sm md:input-md"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center text-sm md:text-base">
                <Clock size={16} className="ml-1" />
                المدة *
              </span>
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="مثال: 3 أشهر"
              className="input input-bordered input-sm md:input-md"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center text-sm md:text-base">
                <Users size={16} className="ml-1" />
                عدد الطلاب
              </span>
            </label>
            <input
              type="number"
              name="students"
              value={formData.students}
              onChange={handleChange}
              className="input input-bordered input-sm md:input-md"
              min="0"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm md:text-base">المستوى *</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="select select-bordered select-sm md:select-md"
              required
            >
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center text-sm md:text-base">
                <Star size={16} className="ml-1" />
                التقييم
              </span>
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="input input-bordered input-sm md:input-md"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        {/* الوصف */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm md:text-base">وصف الدورة *</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="أدخل وصفاً مفصلاً للدورة"
            className="textarea textarea-bordered h-24 md:h-32 text-sm md:text-base"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;