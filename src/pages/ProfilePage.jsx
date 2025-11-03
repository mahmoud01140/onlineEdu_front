import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Phone,
  Briefcase,
  MapPin,
  BookOpen,
  Mail,
  School,
  Clock,
  Award,
  Star,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

export default function StudentProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    schoolType: "",
    grade: "",
    parentPhone: "",
    parentJob: "",
    address: "",
    memorizedAmount: "",
    availableTime: "",
    dailyMemorize: "",
    dailyReview: "",
    dailyRecitation: "",
    talents: "",
  });

  // تحميل بيانات المستخدم عند بدء التحميل
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user?.name || "غير محدد",
        email: user.user?.email || "غير محدد",
        age: user.user?.age || "غير محدد",
        schoolType: user.user?.schoolType || "غير محدد",
        grade: user.user?.grade || "غير محدد",
        parentPhone: user.user?.parentPhone || "غير محدد",
        parentJob: user.user?.parentJob || "غير محدد",
        address: user.user?.address || "غير محدد",
        memorizedAmount: user.user?.memorizedAmount || "غير محدد",
        availableTime: user.user?.availableTime || "غير محدد",
        dailyMemorize: user.user?.dailyMemorize || "غير محدد",
        dailyReview: user.user?.dailyReview || "غير محدد",
        dailyRecitation: user.user?.dailyRecitation || "غير محدد",
        talents: user.user?.talents || "غير محدد",
      });
    }
  }, [user]);

  const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon size={20} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );

  const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 xs:gap-2 py-2">
      <div className="flex items-center gap-2 text-gray-600 min-w-[120px]">
        {Icon && <Icon size={14} className="text-gray-400 flex-shrink-0" />}
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      </div>
      <span className="text-right font-medium text-gray-800 break-words xs:text-left xs:flex-1">
        {value || "غير محدد"}
      </span>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color = "text-primary" }) => (
    <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm border border-gray-100">
      <Icon size={20} className={`mx-auto mb-2 ${color} sm:size-6`} />
      <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-800 text-sm sm:text-base">{value}</p>
    </div>
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64 p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">يجب تسجيل الدخول أولاً</h2>
          <p className="text-gray-600 mt-2">لا يمكن عرض الملف الشخصي بدون تسجيل الدخول</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6"
    >
      {/* Header - Responsive */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
        >
          <User size={24} className="text-white sm:size-8 md:size-10" />
        </motion.div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 px-2 break-words">
          {profile.name}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">الملف الشخصي للطالب</p>
      </div>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* المعلومات الشخصية */}
        <InfoCard title="المعلومات الشخصية" icon={User}>
          <InfoItem label="الاسم الكامل" value={profile.name} icon={User} />
          <InfoItem label="البريد الإلكتروني" value={profile.email} icon={Mail} />
          <InfoItem label="السن" value={profile.age} icon={Calendar} />
          <InfoItem label="نوع المدرسة" value={profile.schoolType} icon={School} />
          <InfoItem label="الصف الدراسي" value={profile.grade} icon={BookOpen} />
        </InfoCard>

        {/* معلومات ولي الأمر */}
        <InfoCard title="معلومات ولي الأمر" icon={Briefcase}>
          <InfoItem label="رقم التليفون" value={profile.parentPhone} icon={Phone} />
          <InfoItem label="المهنة" value={profile.parentJob} icon={Briefcase} />
          <InfoItem label="العنوان" value={profile.address} icon={MapPin} />
        </InfoCard>

        {/* المعلومات القرآنية */}
        <InfoCard title="المعلومات القرآنية" icon={BookOpen} className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <InfoItem label="المقدار المحفوظ" value={profile.memorizedAmount} icon={Award} />
              <InfoItem label="الحفظ اليومي" value={profile.dailyMemorize} icon={BookOpen} />
            </div>
            <div className="space-y-3">
              <InfoItem label="المراجعة اليومية" value={profile.dailyReview} icon={BookOpen} />
              <InfoItem label="التلاوة اليومية" value={profile.dailyRecitation} icon={BookOpen} />
            </div>
          </div>
        </InfoCard>

        {/* معلومات إضافية */}
        <InfoCard title="معلومات إضافية" icon={Star} className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="الوقت المتاح" value={profile.availableTime} icon={Clock} />
            <InfoItem label="المواهب والمهارات" value={profile.talents} icon={Star} />
          </div>
        </InfoCard>
      </div>

      {/* Quick Stats - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <StatCard 
          icon={BookOpen} 
          label="الحفظ اليومي" 
          value={profile.dailyMemorize} 
          color="text-primary" 
        />
        <StatCard 
          icon={Award} 
          label="المقدار المحفوظ" 
          value={profile.memorizedAmount} 
          color="text-secondary" 
        />
        <StatCard 
          icon={Clock} 
          label="الوقت المتاح" 
          value={profile.availableTime} 
          color="text-blue-500" 
        />
        <StatCard 
          icon={School} 
          label="الصف الدراسي" 
          value={profile.grade} 
          color="text-green-500" 
        />
      </motion.div>

      {/* معلومات النظام - Responsive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-blue-800 mb-3 sm:mb-4">معلومات النظام</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className="text-center bg-white/50 rounded-lg p-3">
            <p className="text-blue-600 font-medium text-xs sm:text-sm">تاريخ التسجيل</p>
            <p className="text-blue-800 font-semibold mt-1 text-sm">
              {new Date(user.createdAt || Date.now()).toLocaleDateString('ar-SA')}
            </p>
          </div>
          <div className="text-center bg-white/50 rounded-lg p-3">
            <p className="text-blue-600 font-medium text-xs sm:text-sm">الحالة</p>
            <p className="text-blue-800 font-semibold mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'نشط' : 'غير نشط'}
              </span>
            </p>
          </div>
          <div className="text-center bg-white/50 rounded-lg p-3">
            <p className="text-blue-600 font-medium text-xs sm:text-sm">آخر تحديث</p>
            <p className="text-blue-800 font-semibold mt-1 text-sm">
              {new Date(user.updatedAt || Date.now()).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile Optimized Layout for Small Screens */}
      <div className="block lg:hidden mt-4">
        <InfoCard title="ملخص سريع" icon={Star}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">المدرسة:</span>
              <span className="font-medium">{profile.schoolType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">العمر:</span>
              <span className="font-medium">{profile.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ولي الأمر:</span>
              <span className="font-medium">{profile.parentPhone}</span>
            </div>
          </div>
        </InfoCard>
      </div>
    </motion.div>
  );
}