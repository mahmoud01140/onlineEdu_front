import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import useExamStore from "../stores/useExamStore";
import useLiveExamStore from "../stores/useLiveExamStore";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
const LiveExamPage = () => {
  //   const { fetchExamByType, currentExam } = useExamStore();
  const [userRole, setUserRole] = useState();
  const { user, checkAuth } = useAuthStore();
  const { fetchUpcomingLiveExams, liveExams, addUserToLiveExam } = useLiveExamStore();
  useEffect(() => {
    checkAuth();
    fetchUpcomingLiveExams();
  }, [fetchUpcomingLiveExams]);
  console.log(user);
  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center float-none items-center justify-center "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 flex items-center flex-col"
      >
        <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <p className="text-blue-800 mb-2">
          لاستكمال عملية تحديد المستوى يرجى حضور الامتحان الشفهى على زوم سوف
          يظهر الرابط وكلمة السر هنا عند موعد الامتحان
        </p>
        <div>
          {liveExams.length > 0 ?( liveExams.map((exam) => (
            <div key={exam._id} className=" bg-green-100 mb-4 p-4 rounded-xl">
              <p className="text-blue-800 font-medium">
                معاد المحاضرة:{"  "}
                {new Date(exam.examDate).toLocaleDateString("ar-SA")}
                 الساعة  {exam.examTime}
              </p>
              {exam.zoomLink && (
                <p className="text-blue-800 font-medium flex flex-col items-center">
                  رابط الامتحان على زوم:{" "}
                  <a
                    href={exam?.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium"
                    onClick={() => addUserToLiveExam(exam._id)}
                  >
                    {exam?.zoomLink}
                  </a>
                  <span className="text-black-800 font-medium">
                    كلمة السر: {exam?.zoomPassword}
                  </span>
                </p>
              )}
              <span className="text-black-800 font-medium">
                {liveExams.length > 1 ? "او" : ""}
              </span>
            </div>
          ))):(
            <p className="text-red-600 font-medium">
               لا يوجد محاضرات قادمة حتى الان
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LiveExamPage;
