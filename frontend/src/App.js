import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import the Footer component
import ThemeContextProvider from "./themes/ThemeContext";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import ProfilePage from "./pages/ProfilePage";
import CreateCoursePage from "./pages/CreateCoursePage";
import TestLivePage from "./pages/TestLivePage";
import CreateTestPage from "./pages/CreateTestPage";
import CreateTestSeriesPage from "./pages/CreateTestSeriesPage";
import TestInitialPage from "./pages/TestInitialPage";
import TestResultPage from "./pages/TestResultPage";
import TestLeaderboardPage from "./pages/TestLeaderboardPage";
import ThreadListPage from "./pages/ThreadListPage";
import ThreadDetailPage from "./pages/ThreadDetailPage";
import CreateThreadForm from "./components/CreateThreadForm";
import CourseDetailPage from "./pages/CourseDetailPage";
import UploadLecturesPage from "./pages/UploadLecturesPage";
import TestSeriesListPage from "./pages/TestSeriesListPage"
import CoursesListPage from "./pages/CoursesListPage"
import TestSeriesDetailPage from "./pages/TestSeriesDetailPage";

const App = () => {
  return (
    <Router>
      <ThemeContextProvider>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<HomePage />} />̦
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/create-course" element={<CreateCoursePage/>} />
            <Route path="/courses/:courseId" element={<CourseDetailPage/>} />

            <Route path="/create-thread" element={<CreateThreadForm/>} />
            <Route path="/upload-lectures/:courseId" element={<UploadLecturesPage/>} />

            <Route path="/test/:testId" element={<TestLivePage/>} />
            <Route path="/create-test" element={<CreateTestPage/>} />
            <Route path="/test/:testId/waiting" element={<TestInitialPage/>} />
            <Route path="/test/:testId/result" element={<TestResultPage/>} />
            <Route path="/test/:testId/leaderboard" element={<TestLeaderboardPage/>} />
            <Route path="/discuss" element={<ThreadListPage/>} />
            <Route path="/discuss/:threadId" element={<ThreadDetailPage/>} />
            <Route path="/create-test-series" element={<CreateTestSeriesPage/>} />
            <Route path="/test-series" element={<TestSeriesListPage/>} />
            <Route path="/test-series/:testSeriesId" element={<TestSeriesDetailPage/>} />

            <Route path="/courses" element={<CoursesListPage/>} />

            <Route path="/logout" element={<Logout />} />
          <Route element={<ProtectedRoute />}>
          //</Route>
        </Routes>
        <Footer /> {/* Include the Footer component here */}

      </ThemeContextProvider>
    </Router>
  );
};

export default App;
