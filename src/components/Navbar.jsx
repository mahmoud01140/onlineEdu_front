import { useState } from "react";
import { Menu, X, User, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center flex-col"
      >
        <div className="max-w-[1280px] mx-auto p-1 px-4 sm:px-6 flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="w-20 h-20">
            <img src={logo} alt="Logo" className="w-full h-full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to="/"
              className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
            >
              الرئيسية
            </Link>
            <div className="h-6 border-r-2 border-gray-300" />

            {user && (
              <>
                <Link
                  to="/study"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  الدراسة
                </Link>
                <div className="h-6 border-r-2 border-gray-300" />
              </>
            )}

            {user && user.user.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  لوحة التحكم
                </Link>
                <div className="h-6 border-r-2 border-gray-300" />
              </>
            )}

            {location.pathname.toLowerCase() === "/" && (
              <>
                <a
                  href="#courses"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  برامجنا التعليمية
                </a>
                <div className="h-6 border-r-2 border-gray-300" />
                <a
                  href="#about"
                  className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
                >
                  عن المشايخ
                </a>
                <div className="h-6 border-r-2 border-gray-300" />
              </>
            )}

            {!user ? (
              <Link
                to="/register"
                className="text-base lg:text-lg font-medium font-tajawal hover:text-green-600 transition-colors"
              >
                التسجيل في الاكاديمية
              </Link>
            ) : (
              <div className="relative">
                {/* User Info Dropdown */}
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user.user.name}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {user.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.user.email}
                        </p>
                        <p className="text-xs text-primary mt-1">
                          {user.user.role === "admin" ? "مدير النظام" : "طالب"}
                        </p>
                      </div>
                      
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <User size={16} />
                          الملف الشخصي
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut size={16} />
                          تسجيل خروج
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md bg-gray-100 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation Menu */}
          <div
            className={`fixed md:hidden inset-0 bg-white transition-transform duration-300 ease-in-out z-40 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Mobile Header with User Info */}
            <div className="p-4 border-b border-gray-200">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{user.user.name}</p>
                    <p className="text-sm text-gray-500">{user.user.email}</p>
                    <p className="text-xs text-primary mt-1">
                      {user.user.role === "admin" ? "مدير النظام" : "طالب"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">مرحباً بك في الأكاديمية</p>
                </div>
              )}
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col p-4 space-y-4">
              <Link
                to="/"
                className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/study"
                    className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الدراسة
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الملف الشخصى
                  </Link>
                </>
              )}
              
              {user && user.user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )}
              
              {location.pathname.toLowerCase() === "/" && (
                <>
                  <a
                    href="#courses"
                    className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    برامجنا التعليمية
                  </a>
                  <a
                    href="#about"
                    className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    عن المشايخ
                  </a>
                </>
              )}
              
              {!user ? (
                <Link
                  to="/register"
                  className="text-gray-700 text-lg font-medium font-tajawal hover:text-green-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  التسجيل في الاكاديمية
                </Link>
              ) : (
                <button
                  className="flex items-center gap-2 text-red-600 text-lg font-medium font-tajawal hover:text-red-700 transition-colors py-2 mt-4"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  تسجيل خروج
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="border-t-2 w-10/12" />
      </motion.div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Overlay for user dropdown */}
      {isUserDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </header>
  );
}