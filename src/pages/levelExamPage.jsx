import React, { useEffect, useState } from "react";
import ExamViewer from "../components/ExamViewer";
import useAuthStore from "../stores/useAuthStore";
import useExamStore from "../stores/useExamStore";
const levelExamPage = () => {
  const { fetchExamByType, currentExam } = useExamStore();
  const { user, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
    fetchExamByType(user?.user?.role);
  }, [fetchExamByType, user?.user?.role]);
  return (
    <div>
      <ExamViewer examData={currentExam} />
    </div>
  );
};

export default levelExamPage;
