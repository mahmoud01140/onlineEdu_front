import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  return (
    <header className="w-full">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center flex-col"
      >
        <div className="max-w-[1280px] mx-auto p-1 px-4 sm:px-6 flex items-center justify-between w-full">
          {/* Logo - positioned correctly for RTL */}
          <Link to="/" className="w-20 h-20">
            <img src={logo} alt="" className="w-full h-full" />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to="/"
              className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
            >
              الرئيسية
            </Link>
            <div className="h-6 border-2" />

            {user && (
              <>
                {" "}
                <Link
                  to="/study"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  الدراسة
                </Link>
                <div className="h-6 border-2" />
              </>
            )}

            {user && user.user.role === "admin" && (
              <>
                {" "}
                <Link
                  to="/admin"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  لوحة التحكم
                </Link>
                <div className="h-6 border-2" />
              </>
            )}
            {/* {user && (
              <>
                <Link
                  to="/profile"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  الملف الشخصى
                </Link>
                <div className="h-6 border-2" />
              </>
            )} */}

            {location.pathname.toLowerCase() === "/" && (
              <>
                <a
                  href="#courses"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  برامجنا التعليمية
                </a>
                <div className="h-6 border-2" />
                <a
                  href="#about"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  عن المشايخ
                </a>
                <div className="h-6 border-2" />
              </>
            )}

            {!user ? (
              <>
                <Link
                  to="/register"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  التسجيل في الاكاديمية
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  تسجيل خروج
                </button>
                <div className="h-6 border-2" />
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md bg-white/20 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation Menu */}
          <div
            className={`fixed md:hidden inset-0 bg-[rgb(241,203,187)] transition-transform duration-300 ease-in-out z-40 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <Link
                to="/"
                className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              {user && (
                <>
                  {" "}
                  <Link
                    to="/study"
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الدراسة
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الملف الشخصى
                  </Link>
                </>
              )}
              {user && user.user.role == "admin" && (
                <>
                  {" "}
                  <Link
                    to="/admin"
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                </>
              )}
              {location.pathname.toLowerCase() === "/" && (
                <>
                  {" "}
                  <a
                    href="#courses"
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    برامجنا التعليمية
                  </a>
                  <a
                    href="#about"
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    عن المشايخ
                  </a>
                </>
              )}
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                                     onClick={() => setIsMenuOpen(false)} 
                  >
                    التسجيل في الاكاديمية
                  </Link>

                </>
              ) : (
                <>
                  <button
                    className="text-gray-700 text-xl font-medium font-tajawal hover:text-red-600 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    تسجيل خروج
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="border-t-2 w-10/12" />
      </motion.div>
    </header>
  );
}
