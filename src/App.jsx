import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
// components
import Navbar from "./components/Navbar";
// pages
import HomePage from "./pages/HomePage";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import StudentStatusPage from "./pages/StudentStatusPage";
import FormPage from "./pages/FormPage";
import useAuthStore from "./stores/useAuthStore";
// import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/adminDashboard";
import StudyPage from "./pages/StudyPage";
import LevelExamPage from "./pages/levelExamPage";
import LiveExamPage from "./pages/LiveExamPage";
import NotFoundPage from "./pages/NotFoundPage";
function App() {
  const { checkAuth, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const location = useLocation();

  // pages where navbar should be hidden
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(
    location.pathname.toLowerCase()
  );
  console.log(user)
  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow container m-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentStatusPage />} />
          <Route path="/studentform" element={<FormPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          <Route path="/admin" element={user?.user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route
            path="/study"
            element={
              !user?.user?.isPasslevelEx ? (
                <LevelExamPage />
              ) : !user?.user?.isPassLiveEx ? (
                <LiveExamPage />
              ) : (
                <StudyPage />
              )
            }
          />
          <Route path="/levelExam" element={<LevelExamPage />} />
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
