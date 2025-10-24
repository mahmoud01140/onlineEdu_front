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
  Edit,
  Save,
  X,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

export default function StudentProfile() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
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
      setForm({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        schoolType: user.schoolType || "",
        grade: user.grade || "",
        parentPhone: user.parentPhone || "",
        parentJob: user.parentJob || "",
        address: user.address || "",
        memorizedAmount: user.memorizedAmount || "",
        availableTime: user.availableTime || "",
        dailyMemorize: user.dailyMemorize || "",
        dailyReview: user.dailyReview || "",
        dailyRecitation: user.dailyRecitation || "",
        talents: user.talents || "",
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    const success = await updateProfile(form);
    if (success) {
      setIsEditing(false);
    }
  }

  function handleCancel() {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        schoolType: user.schoolType || "",
        grade: user.grade || "",
        parentPhone: user.parentPhone || "",
        parentJob: user.parentJob || "",
        address: user.address || "",
        memorizedAmount: user.memorizedAmount || "",
        availableTime: user.availableTime || "",
        dailyMemorize: user.dailyMemorize || "",
        dailyReview: user.dailyReview || "",
        dailyRecitation: user.dailyRecitation || "",
        talents: user.talents || "",
      });
    }
    setIsEditing(false);
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold">يجب تسجيل الدخول أولاً</h2>
          <p className="text-gray-600">لا يمكن عرض الملف الشخصي بدون تسجيل الدخول</p>
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
      className="max-w-4xl mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">الملف الشخصي للطالب</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn btn-primary">
                <Save size={18} className="ml-1" />
                حفظ
              </button>
              <button onClick={handleCancel} className="btn btn-ghost">
                <X size={18} className="ml-1" />
                إلغاء
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              <Edit size={18} className="ml-1" />
              تعديل
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* المعلومات الشخصية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">المعلومات الشخصية</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">الاسم</span>
              </label>
              <div className="relative">
                <User className="absolute top-3 left-3 opacity-60" size={18} />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">البريد الإلكتروني</span>
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 opacity-60" size={18} />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="input input-bordered w-full pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">السن</span>
              </label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 opacity-60" size={18} />
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  type="number"
                  className="input input-bordered w-full pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">نوع المدرسة</span>
              </label>
              <select
                name="schoolType"
                value={form.schoolType}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={!isEditing}
              >
                <option value="عام">عام</option>
                <option value="ازهر">أزهري</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">الصف الدراسي</span>
              </label>
              <input
                name="grade"
                value={form.grade}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* معلومات ولي الأمر */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">معلومات ولي الأمر</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">رقم تليفون ولي الأمر</span>
              </label>
              <div className="relative">
                <Phone className="absolute top-3 left-3 opacity-60" size={18} />
                <input
                  name="parentPhone"
                  value={form.parentPhone}
                  onChange={handleChange}
                  type="tel"
                  className="input input-bordered w-full pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">مهنة ولي الأمر</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute top-3 left-3 opacity-60" size={18} />
                <input
                  name="parentJob"
                  value={form.parentJob}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">العنوان</span>
              </label>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 opacity-60" size={18} />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* المعلومات القرآنية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">المعلومات القرآنية</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">كم تحفظ من القرآن؟</span>
              </label>
              <input
                name="memorizedAmount"
                value={form.memorizedAmount}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full"
                disabled={!isEditing}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">مقدار الحفظ اليومي</span>
              </label>
              <select
                name="dailyMemorize"
                value={form.dailyMemorize}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={!isEditing}
              >
                <option value="">اختر</option>
                <option value="نصف جزء">نصف جزء</option>
                <option value="جزء">جزء</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">مقدار المراجعة اليومي</span>
              </label>
              <select
                name="dailyReview"
                value={form.dailyReview}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={!isEditing}
              >
                <option value="">اختر</option>
                <option value="نصف جزء">نصف جزء</option>
                <option value="جزء">جزء</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">مقدار التلاوة اليومي</span>
              </label>
              <select
                name="dailyRecitation"
                value={form.dailyRecitation}
                onChange={handleChange}
                className="select select-bordered w-full"
                disabled={!isEditing}
              >
                <option value="">اختر</option>
                <option value="نصف جزء">نصف جزء</option>
                <option value="جزء">جزء</option>
              </select>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">معلومات إضافية</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">الوقت المتاح</span>
              </label>
              <input
                name="availableTime"
                value={form.availableTime}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full"
                disabled={!isEditing}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">المواهب والمهارات</span>
              </label>
              <input
                name="talents"
                value={form.talents}
                onChange={handleChange}
                className="input input-bordered w-full"
                disabled={!isEditing}
                placeholder="مثال: الرسم، الخط، إلخ"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-blue-800">معلومات إضافية غير قابلة للتعديل</h4>
              <div className="mt-2 space-y-2 text-sm text-blue-700">
                <p>تاريخ التسجيل: {new Date(user.createdAt || Date.now()).toLocaleDateString('ar-SA')}</p>
                <p>الحالة: {user.isActive ? 'نشط' : 'غير نشط'}</p>
                <p>آخر تحديث: {new Date(user.updatedAt || Date.now()).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}