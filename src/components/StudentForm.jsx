import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Phone, Briefcase, MapPin, Lock } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
import ExamViewer from "./ExamViewer";
import useExamStore from "../stores/useExamStore";
import { useNavigate } from "react-router-dom";
export default function StudentForm() {
  const { registerStudent, isLoading, error, user } = useAuthStore();
  const [showExam, setShowExam] = useState(false);
  const { fetchExamByType, currentExam } = useExamStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "student",
    name: "",
    email: "",
    password: "",
    age: "",
    schoolType: "عام",
    grade: "",
    parentPhone: "",
    parentJob: "",
    address: "",
    hasSiblings: "",
    availableTime: "9:00 - 12:00",
    memorizedAmount: "",
    parentsMemorize: "",
    studiedFath: "",
    studiedTuhfa: "",
    // studiedNoor: "",
    prayerFive: "",
    adhkar: "",
    canUseTelegramZoom: "",
    dailyMemorization: "",
    dailyReview: "",
    dailyRecitation: "",
    attendNoorCourse: "",
    parentMemorize: "",
    planFinishQuran: "",
    talents: "قراءة, كتابة, حل المشاكل",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? (checked ? "yes" : "no") : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(form)
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.age ||
      !form.schoolType ||
      !form.grade ||
      !form.parentPhone ||
      !form.parentJob ||
      !form.address ||
      !form.hasSiblings ||
      !form.availableTime ||
      !form.memorizedAmount ||
      !form.parentsMemorize ||
      !form.studiedFath ||
      !form.studiedTuhfa ||
      // !form.studiedNoor ||
      !form.prayerFive ||
      !form.adhkar ||
      !form.canUseTelegramZoom ||
      !form.dailyMemorization ||
      !form.dailyReview ||
      !form.dailyRecitation ||
      !form.attendNoorCourse ||
      // !form.parentMemorize ||
      !form.planFinishQuran ||
      !form.talents
    ) {
      alert("الرجاء تعبئة البيانات كاملة");
      return;
    }
    await registerStudent(form);
  }

  if (user) {
    navigate("/levelExam");
  }
  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* <motion.h2
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="text-2xl font-bold text-center mb-6"
      >
        استمارة تسجيل طالب — اكاديمية أبو يوسف لتحفيظ القرآن
      </motion.h2> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="اكتب الاسم الكامل"
                className="input input-bordered pr-10"
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">البريد الإلكتروني</span>
            </label>
            <div className="relative">
              <User className="absolute top-3 left-3 opacity-60" size={18} />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="اكتب البريد الإلكتروني"
                className="input input-bordered pr-10"
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">السن</span>
            </label>
            <div className="relative">
              <Calendar
                className="absolute top-3 left-3 opacity-60"
                size={18}
              />
              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                type="number"
                min="3"
                placeholder="العمر"
                className="input input-bordered pr-10"
              />
            </div>
          </div>

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
          <div className="form-control">
            <label className="label">
              <span className="label-text">عام / أزهري</span>
            </label>
            <select
              name="schoolType"
              value={form.schoolType}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option>عام</option>
              <option>ازهر</option>
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
              placeholder="مثال: ثالثة ابتدائي"
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">رقم تليفون ولى الأمر</span>
            </label>
            <div className="relative">
              <Phone className="absolute top-3 left-3 opacity-60" size={18} />
              <input
                name="parentPhone"
                value={form.parentPhone}
                onChange={handleChange}
                type="tel"
                placeholder="010xxxxxxxx"
                className="input input-bordered pr-10"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">مهنة ولى الأمر</span>
            </label>
            <div className="relative">
              <Briefcase
                className="absolute top-3 left-3 opacity-60"
                size={18}
              />
              <input
                name="parentJob"
                value={form.parentJob}
                onChange={handleChange}
                type="text"
                placeholder="مهنة ولى الأمر"
                className="input input-bordered pr-10"
              />
            </div>
          </div>

          <div className="form-control md:col-span-2">
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
                placeholder="العنوان الكامل"
                className="input input-bordered pr-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">هل لديك إخوة؟</span>
            </label>
            <select
              name="hasSiblings"
              value={form.hasSiblings}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">ما الوقت المتاح لديك؟</span>
            </label>
            <input
              name="availableTime"
              value={form.availableTime}
              onChange={handleChange}
              type="text"
              className="input input-bordered"
              placeholder="مثال: بعد العصر"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">كم تحفظ من القرآن؟</span>
            </label>
            <input
              name="memorizedAmount"
              value={form.memorizedAmount}
              onChange={handleChange}
              type="text"
              className="input input-bordered"
              placeholder="مثال: 5 أجزاء"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">هل يحفظ والديك القرآن؟</span>
            </label>
            <select
              name="parentsMemorize"
              value={form.parentsMemorize}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                هل درست كتاب فتح الرحمن / نور البيان؟
              </span>
            </label>
            <select
              name="studiedFath"
              value={form.studiedFath}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">هل سبق لك تحفة الأطفال؟</span>
            </label>
            <select
              name="studiedTuhfa"
              value={form.studiedTuhfa}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                هل تستطيع التعامل مع التليجرام وبرنامج زوم؟
              </span>
            </label>
            <select
              name="canUseTelegramZoom"
              value={form.canUseTelegramZoom}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">هل تؤدي الصلوات الخمس؟</span>
            </label>
            <select
              name="prayerFive"
              value={form.prayerFive}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                هل محافظ على أذكار الصباح والمساء؟
              </span>
            </label>
            <select
              name="adhkar"
              value={form.adhkar}
              onChange={handleChange}
              className="select select-bordered"
            >
               <option>اختر</option>
              <option value="no">لا</option>
              <option value="yes">نعم</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">مقدار الحفظ اليومي</label>
            <select
              name="dailyMemorization"
              value={form.dailyMemorization}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">اختر</option>
              <option value="نصف جزء">نصف جزء</option>
              <option value="جزء">جزء</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">مقدار المراجعة اليومي</label>
            <select
              name="dailyReview"
              value={form.dailyReview}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">اختر</option>
              <option value="نصف جزء">نصف جزء</option>
              <option value="جزء">جزء</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">مقدار التلاوة اليومي</label>
            <select
              name="dailyRecitation"
              value={form.dailyRecitation}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">اختر</option>
              <option value="نصف جزء">نصف جزء</option>
              <option value="جزء">جزء</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              هل تستطيع الأم حضور دورة نور البيان كمحاضِر؟
            </span>
          </label>
          <select
            name="attendNoorCourse"
            value={form.attendNoorCourse}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option>اختر</option>
            <option value="no">لا</option>
            <option value="yes">نعم</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">ما هي خطتك لختم القرآن الكريم؟</span>
          </label>
          <textarea
            name="planFinishQuran"
            value={form.planFinishQuran}
            onChange={handleChange}
            className="textarea textarea-bordered"
            placeholder="اكتب خطتك"
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">هل لديك مواهب ومهارات مختلفة؟</span>
          </label>
          <input
            name="talents"
            value={form.talents}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="مثال: الرسم، الخط، إلخ"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mt-4">
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            {isLoading
              ? "جاري التسجيل"
              : "حفظ والانتقال الى امتحان تحديد المستوى"}
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({
                name: "",
                age: "",
                schoolType: "عام",
                grade: "",
                parentPhone: "",
                parentJob: "",
                address: "",
                hasSiblings: "",
                availableTime: "",
                memorizedAmount: "",
                parentsMemorize: "",
                studiedFath: "",
                studiedTuhfa: "",
                // studiedNoor: "",
                prayerFive: "",
                adhkar: "",
                canUseTelegramZoom: "",
                dailyMemorization: "",
                dailyReview: "",
                dailyRecitation: "",
                attendNoorCourse: "",
                // parentMemorize: "",
                planFinishQuran: "",
                talents: "",
              })
            }
            className="btn btn-ghost w-full sm:w-auto"
          >
            إعادة تعيين
          </button>
        </div>
      </form>
    </motion.div>
  );
}
