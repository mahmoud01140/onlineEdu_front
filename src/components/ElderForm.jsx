import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Phone,
  Briefcase,
  Home,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  MessageCircle,
  Feather,
  Lock,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
// RTL Arabic registration form based on the uploaded PDF
// Tailwind + DaisyUI classes used throughout.
import { useNavigate } from "react-router-dom";

import ExamViewer from "./ExamViewer";
import useExamStore from "../stores/useExamStore";
export default function SeniorRegistrationForm() {
  const { registerElder, error, isLoading, user } = useAuthStore();
  const [showExam, setShowExam] = useState(false);
  const { fetchExamByType, currentExam } = useExamStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    role: "elder",
    phone: "",
    password: "",
    profession: "",
    maritalStatus: "",
    address: "",
    hasChildren: "",
    availableTime: "",
    memorizedAmount: "",
    studiedTajweed: "",
    studiedFath: "",
    studiedTuhfat: "",
    studiedSharia: "",
    prayFive: "",
    adhkar: "",
    canUseTelegramZoom: "",
    dailyMemorization: "",
    dailyReview: "",
    dailyRecitation: "",
    talents: "",
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation example

    if (
      !form.name ||
      !form.phone ||
      !form.age ||
      !form.profession ||
      !form.maritalStatus ||
      !form.address ||
      !form.hasChildren ||
      !form.availableTime ||
      !form.memorizedAmount ||
      !form.studiedTajweed ||
      !form.studiedFath ||
      !form.studiedTuhfat ||
      !form.studiedSharia ||
      !form.prayFive ||
      !form.adhkar ||
      !form.canUseTelegramZoom ||
      !form.dailyMemorization ||
      !form.dailyReview ||
      !form.dailyRecitation ||
      !form.talents
    ) {
      alert("الرجاء تعبئة البيانات كاملة");
      return;
    }
    await registerElder(form);
  };
  if (user) {
    navigate("/levelExam");
  }
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-6"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-base-100 shadow-xl rounded-2xl p-6 md:p-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">
            استمارة التسجيل - دار أبو يوسف (لكبار السن)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="label-text">الاسم</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="الاسم الثلاثي"
              className="input input-bordered w-full"
            />
          </label>
          <label className="block">
            <span className="label-text">البريد الإلكتروني</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className="input input-bordered w-full"
            />
          </label>
          <label className="block">
            <span className="label-text">السن</span>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="مثال: 65"
              className="input input-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">كلمة المرور</span>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="إنشاء كلمة مرور"
              />
            </div>
          </label>

          <label className="block">
            <span className="label-text">التليفون</span>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="رقم التليفون"
                className="input input-bordered w-full"
              />
            </div>
          </label>

          <label className="block">
            <span className="label-text">المهنة</span>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <input
                type="text"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="المهنة"
                className="input input-bordered w-full"
              />
            </div>
          </label>

          <label className="block">
            <span className="label-text">الحالة الاجتماعية</span>
            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="single">أعزب</option>
              <option value="married">متزوج</option>
              <option value="married">متزوجة</option>
              <option value="divorced">أرمل</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="label-text">العنوان</span>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="المدينة - الحي - التفاصيل"
                className="input input-bordered w-full"
              />
            </div>
          </label>

          {/* Questions from the PDF — yes/no and small inputs */}

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="label-text">هل لديك أولاد؟</span>
              <select
                name="hasChildren"
                value={form.hasChildren}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>

            <div>
              <span className="label-text">الوقت المتاح لديك؟</span>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <input
                  name="availableTime"
                  value={form.availableTime}
                  onChange={handleChange}
                  placeholder="مثال: مساءً بعد المغرب"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <span className="label-text">كم تحفظ من القرآن؟</span>
              <input
                name="memorizedAmount"
                value={form.memorizedAmount}
                onChange={handleChange}
                placeholder="مثال: نصف جزء"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="label-text">هل درست أحكام التجويد؟</span>
              <select
                name="studiedTajweed"
                value={form.studiedTajweed}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>

            <div>
              <span className="label-text">درست فتح الرحمن/نور البيان؟</span>
              <select
                name="studiedFath"
                value={form.studiedFath}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>

            <div>
              <span className="label-text">درست تحفة الأطفال؟</span>
              <select
                name="studiedTuhfat"
                value={form.studiedTuhfat}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="label-text">هل درست علوم شرعية؟</span>
              <select
                name="studiedSharia"
                value={form.studiedSharia}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>

            <div>
              <span className="label-text">هل تؤدي الصلوات الخمس؟</span>
              <select
                name="prayFive"
                value={form.prayFive}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>

            <div>
              <span className="label-text">
                تحافظ على أذكار الصباح والمساء؟
              </span>
              <select
                name="adhkar"
                value={form.adhkar}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="label-text">
                هل تستطيع التعامل مع التليجرام وبرنامج زوم؟
              </span>
              <select
                name="canUseTelegramZoom"
                value={form.canUseTelegramZoom}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>

            <div>
              <span className="label-text">ما مقدار حفظك اليومي؟</span>
              <input
                name="dailyMemorization"
                value={form.dailyMemorization}
                onChange={handleChange}
                placeholder="مثال: ربع حزب"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <span className="label-text">ما مقدار المراجعة اليومي؟</span>
              <input
                name="dailyReview"
                value={form.dailyReview}
                onChange={handleChange}
                placeholder="مثال: نصف جزء"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <label className="md:col-span-2">
            <span className="label-text">ما هو مقدار التلاوة اليومي؟</span>
            <input
              name="dailyRecitation"
              value={form.dailyRecitation}
              onChange={handleChange}
              placeholder="مثال: جزء كامل"
              className="input input-bordered w-full"
            />
          </label>

          <label className="md:col-span-2">
            <span className="label-text">
              هل لديك مواهب ومهارات مختلفة؟ (اذكر)
            </span>
            <textarea
              name="talents"
              value={form.talents}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="مثال: خط، تعليم، صيانة..."
            />
          </label>

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span>أوافق على شروط الاستبيان وأن تكون المعلومات صحيحة</span>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />{" "}
            {isLoading
              ? "جاري الإرسال"
              : "حفظ والانتقال الى امتحان تحديد المستوى"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() =>
              setForm({
                name: "",
                age: "",
                phone: "",
                profession: "",
                maritalStatus: "",
                address: "",
                hasChildren: "",
                availableTime: "",
                memorizedAmount: "",
                studiedTajweed: "",
                studiedFath: "",
                studiedTuhfat: "",
                studiedSharia: "",
                prayFive: "",
                adhkar: "",
                canUseTelegramZoom: "",
                dailyMemorization: "",
                dailyReview: "",
                dailyRecitation: "",
                talents: "",
                // consent: false,
              })
            }
            whileTap={{ scale: 0.98 }}
            type="button"
            className="btn btn-ghost flex items-center gap-2"
          >
            <XCircle className="w-5 h-5" /> مسح
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
