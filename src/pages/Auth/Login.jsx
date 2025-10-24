import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, isLoading, error, user } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await loginUser(form);
  }
  if (user) {
    navigate("/study");
  }
  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 min-h-screen flex items-center justify-center"
    >
      <div className="w-full">
        <motion.h2
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-center mb-2"
        >
          تسجيل الدخول إلى أكاديمية أبو يوسف
        </motion.h2>

        <p className="text-center text-gray-600 mb-8">
          أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك
        </p>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="example@email.com"
                className="input input-bordered w-full pl-10"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">كلمة المرور</span>
            </label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 opacity-60" size={18} />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className="input input-bordered w-full pl-10 pr-10"
                required
              />
              <button
                type="button"
                className="absolute top-3 right-3 opacity-60"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* <label className="label">
              <Link
                to="/forgot-password"
                className="label-text-alt link link-hover"
              >
                نسيت كلمة المرور؟
              </Link>
            </label> */}
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>

        <div className="divider">أو</div>

        <div className="text-center">
          <p className="text-sm">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="link link-primary">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
