import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            العودة إلى الصفحة الرئيسية
          </button>
          
          <div className="text-sm text-gray-500">
            <button
              onClick={() => navigate(-1)}
              className="hover:text-gray-700 underline"
            >
              العودة للصفحة السابقة
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
