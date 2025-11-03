import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Phone,
  BookOpen,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  Feather,
  Briefcase,
  Lock,
} from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
// RTL Arabic registration form based on the second uploaded PDF
import { useNavigate } from "react-router-dom";
import ExamViewer from "./ExamViewer";
import useExamStore from "../stores/useExamStore";
export default function GeneralRegistrationForm() {
  const { registerTeacher, error, isLoading, user } = useAuthStore();
  const [showExam, setShowExam] = useState(false);
  const { fetchExamByType, currentExam } = useExamStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    role: "teacher",
    maritalStatus: "",
    education: "",
    children: "",
    password: "",
    availableTime: "",
    memorizedAmount: "",
    hasIjaza: "",
    tookIqraCourse: "",
    studiedTuhfa: "",
    taughtTuhfa: "",
    workedInTahfeez: "",
    workedInNurseries: "",
    praysFive: "",
    keepsAdhkar: "",
    fastsMondayThursday: "",
    husbandApproves: "",
    husbandPrays: "",
    studiedSharia: "",
    intentions: "",
    canUseTelegramZoom: "",
    preservationPlans: "",
    preservationFruits: "",
    dailyMemorization: "",
    dailyReview: "",
    dailyRecitation: "",
    khatmaPlan: "",
    computerSkills: "",
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

    if (
      !form.name ||
      !form.age ||
      !form.password ||
      !form.email ||
      !form.maritalStatus ||
      !form.education ||
      !form.children ||
      !form.availableTime ||
      !form.memorizedAmount ||
      !form.hasIjaza ||
      !form.tookIqraCourse ||
      !form.studiedTuhfa ||
      !form.taughtTuhfa ||
      !form.workedInTahfeez ||
      !form.workedInNurseries ||
      !form.praysFive ||
      !form.keepsAdhkar ||
      !form.fastsMondayThursday ||
      !form.husbandApproves ||
      !form.husbandPrays ||
      !form.studiedSharia ||
      !form.intentions ||
      !form.canUseTelegramZoom ||
      !form.preservationPlans ||
      !form.preservationFruits ||
      !form.dailyMemorization ||
      !form.dailyReview ||
      !form.dailyRecitation ||
      !form.khatmaPlan ||
      !form.computerSkills ||
      !form.talents
    ) {
      alert("الرجاء تعبئة البيانات كاملة");
      return;
    }
    await registerTeacher(form);
  };

  if (user) {
    navigate("/levelExam");
  }
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-base-100 shadow-xl rounded-2xl p-3 md:p-10"
      >
        {/* <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">
            استمارة الالتحاق بالدورة - دار أبو يوسف
          </h2>
        </div> */}

        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <span className="label-text">الاسم</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="الاسم الثلاثي"
            />
          </label>

          <label>
            <span className="label-text">البريد الإلكتروني</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="example@example.com"
            />
          </label>

          <label>
            <span className="label-text">السن</span>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="مثال: 30"
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

          <label>
            <span className="label-text">المؤهل</span>
            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">عدد الأولاد</span>
            <input
              type="number"
              name="children"
              value={form.children}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
        </div>

        {/* Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <label>
            <span className="label-text">ما الوقت المتاح لديك؟</span>
            <input
              name="availableTime"
              value={form.availableTime}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">كم تحفظ من القرآن؟</span>
            <input
              name="memorizedAmount"
              value={form.memorizedAmount}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">هل معك إجازة؟</span>
            <select
              name="hasIjaza"
              value={form.hasIjaza}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل أخذتِ دورة اقرأ؟</span>
            <select
              name="tookIqraCourse"
              value={form.tookIqraCourse}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل تحفظي تحفة الأطفال؟</span>
            <select
              name="studiedTuhfa"
              value={form.studiedTuhfa}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل تم شرح التحفة لك؟</span>
            <select
              name="taughtTuhfa"
              value={form.taughtTuhfa}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل قمتِ بالعمل في مجال التحفيظ؟</span>
            <select
              name="workedInTahfeez"
              value={form.workedInTahfeez}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل عملتِ في حضانات؟</span>
            <select
              name="workedInNurseries"
              value={form.workedInNurseries}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل محافظة على الصلوات الخمس؟</span>
            <select
              name="praysFive"
              value={form.praysFive}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">
              هل محافظة على أذكار الصباح والمساء؟
            </span>
            <select
              name="keepsAdhkar"
              value={form.keepsAdhkar}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل تصومي الاثنين والخميس؟</span>
            <select
              name="fastsMondayThursday"
              value={form.fastsMondayThursday}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل زوجك موافق على العمل؟</span>
            <select
              name="husbandApproves"
              value={form.husbandApproves}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label>
            <span className="label-text">هل زوجك يصلي؟</span>
            <select
              name="husbandPrays"
              value={form.husbandPrays}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="label-text">
              هل درستِ شيئاً من العلوم الشرعية؟ (اذكر)
            </span>
            <textarea
              name="studiedSharia"
              value={form.studiedSharia}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </label>

          <label className="md:col-span-2">
            <span className="label-text">ما هي النوايا للعمل في الحفظ؟</span>
            <textarea
              name="intentions"
              value={form.intentions}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">
              هل تستطيع التعامل مع التليجرام وزوم؟
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
          </label>

          <label className="md:col-span-2">
            <span className="label-text">ما هي المقتنيات/الخطة للحفظ؟</span>
            <textarea
              name="preservationPlans"
              value={form.preservationPlans}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </label>

          <label className="md:col-span-2">
            <span className="label-text">ما هي ثمار الحفظ؟</span>
            <textarea
              name="preservationFruits"
              value={form.preservationFruits}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">كم مقدار الحفظ اليومي؟</span>
            <input
              name="dailyMemorization"
              value={form.dailyMemorization}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">كم مقدار المراجعة اليومي؟</span>
            <input
              name="dailyReview"
              value={form.dailyReview}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">كم مقدار التلاوة اليومي؟</span>
            <input
              name="dailyRecitation"
              value={form.dailyRecitation}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label className="md:col-span-2">
            <span className="label-text">ما هي خطتك لختم القرآن الكريم؟</span>
            <textarea
              name="khatmaPlan"
              value={form.khatmaPlan}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </label>

          <label>
            <span className="label-text">
              هل لديك خبرة في استعمال الكمبيوتر؟
            </span>
            <select
              name="computerSkills"
              value={form.computerSkills}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="label-text">هل لديك مواهب ومهارات مختلفة؟</span>
            <textarea
              name="talents"
              value={form.talents}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
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

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary w-full sm:w-auto sm:text-sm"
          >
            <CheckCircle className="w-5 h-5" />{" "}
            {isLoading
              ? "جاري الإرسال"
              : "حفظ والانتقال الى امتحان تحديد المستوى"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() =>
              setForm({
                name: "",
                age: "",
                maritalStatus: "",
                education: "",
                children: "",
                password: "",
                availableTime: "",
                memorizedAmount: "",
                hasIjaza: "",
                tookIqraCourse: "",
                studiedTuhfa: "",
                taughtTuhfa: "",
                workedInTahfeez: "",
                workedInNurseries: "",
                praysFive: "",
                keepsAdhkar: "",
                fastsMondayThursday: "",
                husbandApproves: "",
                husbandPrays: "",
                studiedSharia: "",
                intentions: "",
                canUseTelegramZoom: "",
                preservationPlans: "",
                preservationFruits: "",
                dailyMemorization: "",
                dailyReview: "",
                dailyRecitation: "",
                khatmaPlan: "",
                computerSkills: "",
                talents: "",
                consent: false,
              })
            }
            className="btn btn-ghost w-full sm:w-auto"
          >
            <XCircle className="w-5 h-5" /> اعادة تعيين
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
